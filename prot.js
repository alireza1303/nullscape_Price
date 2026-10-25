(function () {
  const V = Prot_Values;
  const $ = id => document.getElementById(id);
  const $$ = selector => document.querySelectorAll(selector);

  const state = {
    mode: 'solo',
    protOn: true,
    puriOn: true,
    curse: null,
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

  function validatePuriLevel() {
    clampInput('puriLevel', V.puri.minLevel);
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
        : basePrice * mult * (Math.sqrt(players) / V.partyScalingDivisor);
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

  function puriCost(players) {
    const curse = V.puri.curses.find(c => c.key === state.curse);
    if (!curse) return 0;
    const level = parseInt($('puriLevel').value) || V.puri.minLevel;
    return Math.ceil(curse.value * levelMultiplier(level) * Math.sqrt(players));
  }

  function puriLine(cost) {
    if (!cost) return '';
    const curse = V.puri.curses.find(c => c.key === state.curse);
    const level = parseInt($('puriLevel').value);
    return `<div class="prot-line puri-line">Puri (${curse.name}, Level ${level}): ${fmt(cost)}</div>`;
  }

  function levelLine(r) {
    return `<div class="prot-line">Level ${r.level}: Start = ${fmt(r.start)} | Alter Price = ${fmt(r.price)} | Remaining = ${fmt(r.remaining)}</div>`;
  }

  function renderResults({ required, total, rows, puri }) {
    $('protOutput').innerHTML = `
      <div class="prot-banner">Minimum gifts needed<span>${fmt(required + puri)}</span></div>
      <strong>Total gifts used:</strong> ${fmt(total + puri)}<br><br>
      <strong>Level Breakdown:</strong>
      ${puriLine(puri)}
      ${rows.map(levelLine).join('')}`;
  }

  function renderError(message) {
    $('protOutput').innerHTML = `<strong>Error:</strong> ${message}`;
  }

  function calculate() {
    validateProtLevels();
    validatePuriLevel();
    updatePlayerLimits();

    const mode = V.modes[state.mode];
    const start = parseInt($('protStart').value) || V.minLevel;
    const end = parseInt($('protEnd').value) || V.minLevel;
    const players = parseFloat($('protPlayers').value) || 1;

    if (state.protOn && start > end) {
      renderError('Start level cannot be greater than end level.');
      return;
    }

    let required = 0;
    let total = 0;
    let rows = [];
    if (state.protOn) {
      const percent = (mode.isSoloDuo ? V.pricing.soloDuo : V.pricing.party).percent;
      const costs = flatCosts(start, end, mode.isSoloDuo, players);
      required = requiredGifts(costs, percent);
      ({ rows, total } = spendBreakdown(costs, required, percent));
    }

    const puri = state.puriOn ? puriCost(players) : 0;
    state.hasResult = true;
    renderResults({ required, total, rows, puri });
  }

  function renderCurseButtons() {
    $('puriOptions').innerHTML = V.puri.curses.map(c => `
      <button type="button" class="puri-opt" data-curse="${c.key}">
        <img src="${c.image}" alt="" onerror="this.style.visibility='hidden'">
        <span>${c.name}</span>
      </button>`).join('');
  }

  function selectCurse(key) {
    state.curse = state.curse === key ? null : key;
    $$('#puriOptions .puri-opt').forEach(b => b.classList.toggle('active', b.dataset.curse === state.curse));
  }

  function selectMode(mode) {
    state.mode = mode;
    $$('#protModeSel .mode-btn').forEach(b => b.classList.toggle('active', b.dataset.pmode === mode));
    updatePlayerLimits();
  }

  function refreshToggles() {
    const { protOn, puriOn } = state;
    $('protCard').classList.toggle('off', !protOn);
    $('puriCard').classList.toggle('off', !puriOn);
    $('protCard').classList.toggle('all-off', !protOn && !puriOn);
    $('protToggle').textContent = protOn ? 'Disable Prot' : 'Enable Prot';
    $('puriToggle').textContent = puriOn ? 'Disable Puri' : 'Enable Puri';

    const results = $('protResultsCard');
    results.classList.toggle('only-prot', protOn && !puriOn);
    results.classList.toggle('only-puri', !protOn && puriOn);
    results.classList.toggle('faded', !protOn && !puriOn);

    if (state.hasResult && (protOn || puriOn)) calculate();
  }

  function initInputs() {
    $('protStart').min = $('protStart').value = V.minLevel;
    $('protEnd').min = $('protEnd').value = V.minLevel;
    $('puriLevel').min = $('puriLevel').value = V.puri.minLevel;
    renderCurseButtons();
    updatePlayerLimits();
  }

  function bindEvents() {
    $$('#protModeSel .mode-btn').forEach(b => b.addEventListener('click', () => selectMode(b.dataset.pmode)));
    $$('#puriOptions .puri-opt').forEach(b => b.addEventListener('click', () => selectCurse(b.dataset.curse)));
    $('protStart').addEventListener('change', validateProtLevels);
    $('protEnd').addEventListener('change', validateProtLevels);
    $('protPlayers').addEventListener('change', updatePlayerLimits);
    $('puriLevel').addEventListener('change', validatePuriLevel);
    $('protCalcBtn').addEventListener('click', calculate);
    $('protToggle').addEventListener('click', () => { state.protOn = !state.protOn; refreshToggles(); });
    $('puriToggle').addEventListener('click', () => { state.puriOn = !state.puriOn; refreshToggles(); });
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
