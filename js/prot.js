(function () {
  const V = Prot_Values;
  const $ = id => document.getElementById(id);
  const $$ = selector => document.querySelectorAll(selector);

  const state = {
    mode: 'solo',
    hasResult: false,
    busy: false,
    priceTheme: '',
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

  function requiredGifts(costs, percent) {
    let required = 0;
    for (let i = costs.length - 1; i >= 0; i--) {
      required = Math.ceil((required + costs[i].cost) / (1 - percent));
    }
    return required;
  }

  function spendBreakdown(costs, required, percent) {
    let balance = required;
    let total = 0;
    const rows = [];
    for (const { level, cost } of costs) {
      const price = Math.floor(balance * percent + cost);
      const remaining = balance - price;
      rows.push({ level, start: balance, price, remaining });
      total += price;
      balance = remaining;
    }
    return { rows, total };
  }

  function levelLine(r) {
    return `<div class="prot-line">Level ${r.level}: Start = ${fmt(r.start)} | Alter Price = ${fmt(r.price)} | Remaining = ${fmt(r.remaining)}</div>`;
  }

  function renderResults({ required, total, rows }) {
    $('protOutput').innerHTML = `
      <div class="prot-banner">Minimum gifts needed<span>${fmt(required)}</span></div>
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
    let balance = Math.max(0, parseInt(raw) || 0);
    const lines = [];
    for (const { level, cost } of costs) {
      const price = Math.floor(balance * percent + cost);
      if (price > balance) {
        const need = requiredGifts([{ level, cost }], percent);
        lines.push(`<div class="next-line short"><span>Level ${level}</span><span class="price">Need ${fmt(Math.max(1, need - balance))} more (${fmt(need)} total)</span></div>`);
        break;
      }
      balance -= price;
      lines.push(`<div class="next-line"><span>Level ${level}</span><span><span class="price">${fmt(price)}</span> &middot; left ${fmt(balance)}</span></div>`);
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

    const percent = (mode.isSoloDuo ? V.pricing.soloDuo : V.pricing.party).percent;
    const costs = flatCosts(start, end, mode.isSoloDuo, players);
    const required = requiredGifts(costs, percent);
    const { rows, total } = spendBreakdown(costs, required, percent);

    renderResults({ required, total, rows });
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
  }

  function bindEvents() {
    $$('#protModeSel .mode-btn').forEach(b => b.addEventListener('click', () => selectMode(b.dataset.pmode)));
    $('protStart').addEventListener('change', () => { validateProtLevels(); renderNext(); });
    $('protEnd').addEventListener('change', validateProtLevels);
    $('protPlayers').addEventListener('change', () => { updatePlayerLimits(); renderNext(); });
    $('nextGifts').addEventListener('input', renderNext);
    $('nextCount').addEventListener('input', renderNext);
    $('nextCount').addEventListener('change', () => { $('nextCount').value = clamp(parseInt($('nextCount').value) || 1, 1, 100); renderNext(); });
    $('protCalcBtn').addEventListener('click', calculate);
  }

  function switchView(view) {
    const body = document.body;
    const isProt = body.classList.contains('view-prot');
    if (state.busy || (view === 'prot') === isProt) return;
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
