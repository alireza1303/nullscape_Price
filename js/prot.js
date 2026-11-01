(function () {
  const V = Prot_Values;
  const $ = id => document.getElementById(id);
  const $$ = selector => document.querySelectorAll(selector);

  const state = {
    mode: 'solo',
    hasResult: false,
    busy: false,
    priceTheme: '',
    dependence: false,
    burnout: false,
    aegis: false,
    doubleLevels: new Set(),
    dpMore: false,
  };

  const fmt = n => n.toLocaleString();
  const levelMultiplier = level => Math.max(1, level - V.levelOffset);

  function clampInput(id, min) {
    const el = $(id);
    if (!el.value || parseInt(el.value) < min) el.value = min;
  }

  function validateProtLevels() {
    clampInput('protStart', V.minLevel);
    clampInput('protEnd', V.minLevel);
  }

  function updatePlayerLimits() {
    const { min, max } = V.modes[state.mode];
    const el = $('protPlayers');
    const value = Math.max(min, Math.min(max, parseInt(el.value) || min));
    el.min = min;
    el.max = max;
    el.value = value;
  }

  const D = V.delusions;

  function flatCosts(start, end, isSoloDuo, players) {
    const { basePrice } = isSoloDuo ? V.pricing.soloDuo : V.pricing.party;
    const costs = [];
    for (let level = start; level <= end; level++) {
      const mult = levelMultiplier(level);
      const cost = isSoloDuo
        ? basePrice * mult * players
        : basePrice * mult * Math.sqrt(players) / V.partyScalingDivisor;
      costs.push({ level, cost });
    }
    return costs;
  }

  const r6 = n => Math.round(n * 1e6) / 1e6;

  function buildSteps(costs, opts) {
    const dep = opts.dependence ? D.dependence.priceMult : 1;
    const second = dep * (opts.burnout ? D.burnout.secondProtMult : 1);
    const steps = [];
    for (const { level, cost } of costs) {
      steps.push({ level, cost, mult: dep, second: false });
      if (opts.doubleLevels.has(level)) steps.push({ level, cost, mult: second, second: true });
    }
    return steps;
  }

  const stepPrice = (balance, s, percent) => Math.floor(r6((balance * percent + s.cost) * s.mult));

  function requiredGifts(steps, percent) {
    let required = 0;
    for (let i = steps.length - 1; i >= 0; i--) {
      const { cost, mult } = steps[i];
      required = Math.ceil(r6((required + mult * cost) / (1 - mult * percent)));
    }
    return required;
  }

  function spendBreakdown(steps, required, percent) {
    let balance = required;
    let total = 0;
    const rows = [];
    for (const s of steps) {
      const price = stepPrice(balance, s, percent);
      const remaining = balance - price;
      rows.push({ level: s.level, second: s.second, start: balance, price, remaining });
      total += price;
      balance = remaining;
    }
    return { rows, total };
  }

  function getOptions() {
    const canDouble = state.burnout;
    return {
      dependence: state.dependence,
      burnout: state.burnout,
      aegis: state.aegis,
      canDouble,
      doubleLevels: canDouble ? state.doubleLevels : new Set(),
    };
  }

  function levelLine(r) {
    const tag = r.second ? ' (2nd prot)' : '';
    return `<div class="prot-line">Level ${r.level}${tag}: Start = ${fmt(r.start)} | Altar Price = ${fmt(r.price)} | Remaining = ${fmt(r.remaining)}</div>`;
  }

  function renderNotes(opts, players, start, end) {
    const notes = [];
    if (opts.dependence) {
      const pct = D.dependence.giftPercentBase + D.dependence.giftPercentPerPlayer * players;
      notes.push(`<strong>Dependence:</strong> altar is 20% cheaper and gives ${D.dependence.shields} Shields. It can only be used after <strong>${pct}%</strong> of the gifts are collected, and the Shield upgrade is disabled.`);
    }
    const picked = [...opts.doubleLevels].sort((x, y) => x - y);
    if (picked.length) {
      const inside = picked.filter(l => l >= start && l <= end);
      const outside = picked.filter(l => l < start || l > end);
      const extra = `The 2nd prot costs ×${D.burnout.secondProtMult} (Burnout).`;
      if (inside.length) {
        notes.push(`<strong>Double prot at level${inside.length > 1 ? 's' : ''} ${inside.join(', ')}.</strong> ${extra}`);
      }
      if (outside.length) {
        notes.push(`<strong>Double prot:</strong> level${outside.length > 1 ? 's' : ''} ${outside.join(', ')} ${outside.length > 1 ? 'are' : 'is'} outside ${start}–${end}, so not included.`);
      }
    } else if (opts.canDouble) {
      notes.push('<strong>Double prot:</strong> no levels selected, so no double prot is included.');
    }
    return notes.length ? `<div class="prot-notes">${notes.map(n => `<div class="prot-line">${n}</div>`).join('')}</div><br>` : '';
  }

  function renderResults({ required, total, rows, notes }) {
    $('protOutput').innerHTML = `
      <div class="prot-banner">Minimum gifts needed<span>${fmt(required)}</span></div>
      ${notes}
      <strong>Total gifts used:</strong> ${fmt(total)}<br><br>
      <strong>Level Breakdown:</strong>
      <div class="prot-breakdown">${rows.map(levelLine).join('')}</div>`;
  }

  function renderError(message) {
    $('protOutput').innerHTML = `<strong>Error:</strong> ${message}`;
  }

  function renderNext() {
    const out = $('nextOutput');
    const raw = $('nextGifts').value;
    if (raw === '') {
      out.innerHTML = '';
      return;
    }
    validateProtLevels();
    updatePlayerLimits();
    const mode = V.modes[state.mode];
    const start = parseInt($('protStart').value) || V.minLevel;
    const players = parseFloat($('protPlayers').value) || 1;
    const percent = (mode.isSoloDuo ? V.pricing.soloDuo : V.pricing.party).percent;
    const count = clamp(parseInt($('nextCount').value) || 1, 1, 100);
    const costs = flatCosts(start, start + count - 1, mode.isSoloDuo, players);
    const steps = buildSteps(costs, getOptions());
    let balance = Math.max(0, parseInt(raw) || 0);
    const lines = [];
    for (const s of steps) {
      const label = `Level ${s.level}${s.second ? ' (2nd prot)' : ''}`;
      const price = stepPrice(balance, s, percent);
      if (price > balance) {
        const need = requiredGifts([s], percent);
        lines.push(`<div class="next-line short"><span>${label}</span><span class="price">Need ${fmt(Math.max(1, need - balance))} more (${fmt(need)} total)</span></div>`);
        break;
      }
      balance -= price;
      lines.push(`<div class="next-line"><span>${label}</span><span><span class="price">${fmt(price)}</span> &middot; left ${fmt(balance)}</span></div>`);
    }
    out.innerHTML = lines.join('');
  }

  function calculate() {
    validateProtLevels();
    updatePlayerLimits();

    const mode = V.modes[state.mode];
    const start = parseInt($('protStart').value) || V.minLevel;
    const end = parseInt($('protEnd').value) || V.minLevel;
    const players = parseFloat($('protPlayers').value) || 1;

    if (start > end) {
      renderError('Start level cannot be greater than end level.');
      return;
    }

    const opts = getOptions();
    const percent = (mode.isSoloDuo ? V.pricing.soloDuo : V.pricing.party).percent;
    const steps = buildSteps(flatCosts(start, end, mode.isSoloDuo, players), opts);
    const required = requiredGifts(steps, percent);
    const { rows, total } = spendBreakdown(steps, required, percent);

    renderResults({ required, total, rows, notes: renderNotes(opts, players, start, end) });
  }

  function syncDelusionUI() {
    $('protDependence')?.classList.toggle('active', state.dependence);
    $('protBurnout')?.classList.toggle('active', state.burnout);
    $('protAegis')?.classList.toggle('active', state.aegis);
    const group = $('protDoubleGroup');
    if (group) group.hidden = !state.burnout;
    const aegisGroup = $('protAegisGroup');
    if (aegisGroup) aegisGroup.hidden = !state.burnout;
    const hint = $('protDoubleHint');
    if (hint) hint.textContent = `Burnout: the 2nd prot costs ×${D.burnout.secondProtMult}.` +
      (state.aegis ? ' Drowned Ægis: the double prot is guaranteed to spawn.' : '');
  }

  function doubleRange() {
    const start = parseInt($('protStart').value) || V.minLevel;
    const end = parseInt($('protEnd').value) || V.minLevel;
    const count = clamp(parseInt($('nextCount').value) || 1, 1, 100);
    const last = Math.min(Math.max(end, start + count - 1), start + 99);
    return { start, end, last };
  }

  function updateDoubleCount() {
    const el = $('protDoubleCount');
    if (!el) return;
    const { start, last } = doubleRange();
    const n = [...state.doubleLevels].filter(l => l >= start && l <= last).length;
    el.textContent = n === 0 ? 'None' : `${n} level${n > 1 ? 's' : ''}`;
  }

  function renderDoubleList() {
    const list = $('dpList');
    if (!list) return;
    const { start, end, last } = doubleRange();
    let html = '';
    const shown = state.dpMore ? last : Math.max(end, start);
    for (let l = start; l <= shown; l++) {
      html += `<label class="dp-item${l > end ? ' beyond' : ''}"><input type="checkbox" value="${l}"${state.doubleLevels.has(l) ? ' checked' : ''}><span>Level ${l}</span></label>`;
    }
    list.innerHTML = html;
    $('dpSub').innerHTML = last > end
      ? `<button type="button" class="dp-more">${state.dpMore ? 'Hide' : 'Show'} extra levels for Next Prots (${end + 1}–${last})</button>`
      : '';
    updateDoubleCount();
  }

  function openDoublePanel() {
    renderDoubleList();
    $('dpPanel').classList.add('active');
    $('dpOverlay').classList.add('active');
    $('dpPanel').setAttribute('aria-hidden', 'false');
  }

  function closeDoublePanel() {
    $('dpPanel')?.classList.remove('active');
    $('dpOverlay')?.classList.remove('active');
    $('dpPanel')?.setAttribute('aria-hidden', 'true');
  }

  function setAllDouble(on) {
    const { start, last } = doubleRange();
    for (let l = start; l <= last; l++) on ? state.doubleLevels.add(l) : state.doubleLevels.delete(l);
    renderDoubleList();
    renderNext();
  }

  function toggleOption(key) {
    state[key] = !state[key];
    if (key === 'burnout' && !state.burnout) state.aegis = false;
    syncDelusionUI();
    if (!state.burnout) closeDoublePanel();
    renderNext();
  }

  function selectMode(mode) {
    state.mode = mode;
    $$('#protModeSel .mode-btn').forEach(b => b.classList.toggle('active', b.dataset.pmode === mode));
    updatePlayerLimits();
    renderNext();
  }

  function initInputs() {
    $('protStart').min = $('protStart').value = V.minLevel;
    $('protEnd').min = $('protEnd').value = V.minLevel;
    updatePlayerLimits();
    syncDelusionUI();
    renderDoubleList();
  }

  function bindEvents() {
    $$('#protModeSel .mode-btn').forEach(b => b.addEventListener('click', () => selectMode(b.dataset.pmode)));
    $('protStart').addEventListener('change', () => { validateProtLevels(); renderDoubleList(); renderNext(); });
    $('protEnd').addEventListener('change', () => { validateProtLevels(); renderDoubleList(); });
    $('protPlayers').addEventListener('change', () => { updatePlayerLimits(); renderNext(); });
    $('nextGifts').addEventListener('input', renderNext);
    $('nextCount').addEventListener('input', renderNext);
    $('nextCount').addEventListener('change', () => { $('nextCount').value = clamp(parseInt($('nextCount').value) || 1, 1, 100); renderDoubleList(); renderNext(); });
    $('protCalcBtn').addEventListener('click', calculate);
    $('protDependence')?.addEventListener('click', () => toggleOption('dependence'));
    $('protBurnout')?.addEventListener('click', () => toggleOption('burnout'));
    $('protAegis')?.addEventListener('click', () => toggleOption('aegis'));
    $('protDoubleOpen').addEventListener('click', openDoublePanel);
    $('dpClose').addEventListener('click', closeDoublePanel);
    $('dpOverlay').addEventListener('click', closeDoublePanel);
    $('dpAll').addEventListener('click', () => setAllDouble(true));
    $('dpNone').addEventListener('click', () => setAllDouble(false));
    $('dpSub').addEventListener('click', e => {
      if (!e.target.closest('.dp-more')) return;
      state.dpMore = !state.dpMore;
      renderDoubleList();
    });
    $('dpList').addEventListener('change', e => {
      const level = parseInt(e.target.value);
      if (isNaN(level)) return;
      e.target.checked ? state.doubleLevels.add(level) : state.doubleLevels.delete(level);
      updateDoubleCount();
      renderNext();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDoublePanel(); });
  }

  function switchView(view) {
    const body = document.body;
    const isProt = body.classList.contains('view-prot');
    if (state.busy || (view === 'prot') === isProt) return;
    closeDoublePanel();
    state.busy = true;
    window.scrollTo(0, 0);

    const { angle, durationMs, easing } = V.transition;
    const direction = view === 'prot' ? 1 : -1;
    const from = $(isProt ? 'prot-view' : 'main-ui');
    const to = $(isProt ? 'main-ui' : 'prot-view');
    const priceView = $('main-ui');

    if (!isProt) state.priceTheme = getComputedStyle(body).getPropertyValue('--theme').trim();
    if (state.priceTheme) priceView.style.setProperty('--theme', state.priceTheme);

    body.style.setProperty('--pivot', Math.round(Math.max(innerWidth, innerHeight) * 1.5) + 'px');
    body.classList.add('rotating');
    from.classList.add('wheel');
    to.classList.add('wheel');

    const options = { duration: durationMs, easing, fill: 'forwards' };
    const leaving = from.animate(
      [{ transform: 'rotate(0deg)' }, { transform: `rotate(${-direction * angle}deg)` }], options);
    const arriving = to.animate(
      [{ transform: `rotate(${direction * angle}deg)` }, { transform: 'rotate(0deg)' }], options);

    const setViewClass = () => body.classList.toggle('view-prot', view === 'prot');
    const halfway = setTimeout(setViewClass, durationMs / 2);

    Promise.all([leaving.finished, arriving.finished]).then(() => {
      clearTimeout(halfway);
      setViewClass();
      priceView.style.removeProperty('--theme');
      from.classList.remove('wheel');
      to.classList.remove('wheel');
      body.classList.remove('rotating');
      leaving.cancel();
      arriving.cancel();
      state.busy = false;
    });
  }

  window.switchView = switchView;

  initInputs();
  bindEvents();
  setTimeout(() => document.documentElement.classList.add('entered'), V.introSettleMs);
})();
