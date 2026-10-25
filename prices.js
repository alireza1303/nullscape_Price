let currentDifficulty  = 'standard';
let currentMode        = 'solo';
let playerCount        = 1;
const discountActive = { nothing: false, wish: false };

function getDiscountPercent() {
    const { nothing, wish } = discountActive;
    if (nothing && wish) return Price_Values.discountPercent.both;
    if (nothing) return Price_Values.discountPercent.nothing;
    if (wish) return Price_Values.discountPercent.wish;
    return 0;
}

function isPartyMode() { return currentMode === 'party' || currentMode === 'partyplus'; }

function isCasualHidden(item) {
    if (currentDifficulty !== 'casual') return false;
    return !!(Casual_Changes[item.name]?.hidden);
}

function isExtremeHidden(item) {
    if (currentDifficulty !== 'extreme') return false;
    return !!(Extreme_Changes[item.name]?.hidden);
}

function getEffectivePrices(item) {
    if (currentDifficulty === 'casual' && Casual_Changes[item.name]) {
        const ov = Casual_Changes[item.name];
        return {
            price:      ov.casualPrice      ?? item.price,
            soloPrice:  ov.casualSoloPrice  ?? item.soloPrice,
            prices:     ov.casualPrices     ?? item.prices,
            soloPrices: item.soloPrices,
        };
    }
    if (currentDifficulty === 'extreme' && Extreme_Changes[item.name]) {
        const ov = Extreme_Changes[item.name];
        return {
            price:      ov.extremePrice      ?? item.price,
            soloPrice:  ov.extremeSoloPrice  ?? item.soloPrice,
            prices:     ov.extremePrices     ?? item.prices,
            soloPrices: ov.extremeSoloPrices ?? item.soloPrices,
        };
    }
    return { price: item.price, soloPrice: item.soloPrice, prices: item.prices, soloPrices: item.soloPrices };
}

function computePrice(item, stackOverride) {
    const s = stackOverride !== undefined ? stackOverride : item.currentStack;
    if (s === 0) return 0;
    const eff = getEffectivePrices(item);
    const isSolo = (currentMode === 'solo');
    let base = 0;
    if (eff.prices) {
        const arr = (isSolo && eff.soloPrices) ? eff.soloPrices : eff.prices;
        base = arr[s - 1] ?? 0;
    } else {
        base = (isSolo && eff.soloPrice !== undefined) ? eff.soloPrice : eff.price;
    }
    let scaled = (playerCount === 1) ? base : Math.ceil(base * Math.sqrt(playerCount));
    if (currentMode === 'partyplus') scaled = Math.ceil(scaled / Price_Values.partyPlusDivisor);
    if (currentMode === 'party' && playerCount > Price_Values.bigPartyAbove) scaled = Math.ceil(scaled / Price_Values.bigPartyDivisor);
    const discount = getDiscountPercent();
    if (discount > 0) scaled = Math.ceil(scaled * (100 - discount) / 100);
    return scaled;
}

function renderGrid() {
    const grid = document.getElementById('mainGrid');
    grid.innerHTML = upgradesList.map((item, index) => {
        let dots = '';
        if (item.maxStack > 1) {
            for (let i = 0; i < item.maxStack; i++) dots += `<div class="stack-dot" id="dot-${index}-${i}"></div>`;
        }
        return `<div class="upgrade-item" id="item-${index}" style="--i:${index}" onclick="cycleUpgrade(${index}, this)">
            <div class="icon-wrapper"><img src="${item.icon}" onerror="this.src='https://via.placeholder.com/50?text=?'"></div>
            <div class="info">
                <span class="name">${item.name}</span>
                <span class="price-tag" id="price-text-${index}">Cost: 0</span>
                <div class="stack-indicator">${dots}</div>
            </div>
            <span class="lv-badge">Lv${item.level}</span>
        </div>`;
    }).join('');
    applyRules();
    updateVisualPrices();
}

function cycleUpgrade(index, el) {
    if (el.classList.contains('disabled') || el.classList.contains('casual-hidden') || el.classList.contains('extreme-hidden')) return;
    const item = upgradesList[index];
    const max  = item.maxStack || 1;
    item.currentStack = (item.currentStack >= max) ? 0 : item.currentStack + 1;
    el.classList.toggle('active', item.currentStack > 0);
    if (item.maxStack > 1) {
        for (let i = 0; i < item.maxStack; i++) {
            const dot = document.getElementById(`dot-${index}-${i}`);
            if (dot) dot.classList.toggle('filled', i < item.currentStack);
        }
    }
    calculate();
}

function updateVisualPrices() {
    upgradesList.forEach((item, index) => {
        const displayStack = item.currentStack > 0 ? item.currentStack : 1;
        const previewCost  = computePrice(item, displayStack);
        const text = item.maxStack > 1
            ? `Stack ${displayStack}: ${previewCost.toLocaleString()}`
            : `Cost: ${previewCost.toLocaleString()}`;
        const el = document.getElementById('price-text-' + index);
        if (el) el.textContent = text;
    });
}

function calculate() {
    let total = 0;
    upgradesList.forEach(item => {
        if (item.currentStack > 0 && !isCasualHidden(item) && !isExtremeHidden(item)) total += computePrice(item);
    });
    document.getElementById('result').textContent = total.toLocaleString();
    const indicator = document.getElementById('curse-indicator');
    if (indicator) {
        const discount = getDiscountPercent();
        indicator.textContent = discount > 0 ? `${discount}% discount is on` : 'Discount is on';
        indicator.style.opacity = discount > 0 ? '1' : '0';
    }
    const mob = document.getElementById('mobile-result');
    if (mob) mob.textContent = total.toLocaleString();
    updateVisualPrices();
}

function clearDots(index, item) {
    if (item.maxStack > 1) {
        for (let i = 0; i < item.maxStack; i++) {
            const dot = document.getElementById(`dot-${index}-${i}`);
            if (dot) dot.classList.remove('filled');
        }
    }
}

function applyRules() {
    upgradesList.forEach((item, index) => {
        const el = document.getElementById(`item-${index}`);
        if (!el) return;
        const casualHide  = isCasualHidden(item);
        const extremeHide = isExtremeHidden(item);
        el.classList.toggle('casual-hidden',  casualHide);
        el.classList.toggle('extreme-hidden', extremeHide);
        if (casualHide || extremeHide) { item.currentStack = 0; el.classList.remove('active'); clearDots(index, item); }
        let disabled = false;
        if (item.id === 'opt-adrenaline' && isPartyMode()) disabled = true;
        if (item.id === 'opt-lrs' && (!isPartyMode() || playerCount < Price_Values.lastStandingMinPlayers)) disabled = true;
        el.classList.toggle('disabled', disabled && !casualHide && !extremeHide);
        if (disabled) { item.currentStack = 0; el.classList.remove('active'); clearDots(index, item); }
    });
    calculate();
}

function setDifficulty(diff) {
    currentDifficulty = diff;
    document.body.className = `mode-${diff}`;
    document.querySelectorAll('[data-diff]').forEach(b => b.classList.toggle('active', b.dataset.diff === diff));
    updateFormulaText();
    syncMobileSettings();
    applyRules();
}

function setMode(mode) {
    currentMode = mode;
    const { min, max, typedMax } = Price_Values.modeLimits[mode];
    const pInput = document.getElementById('pInput');
    pInput.min = min;
    pInput.max = max;
    playerCount = Math.max(min, Math.min(typedMax, playerCount));
    pInput.value = playerCount;
    document.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    updateFormulaText();
    syncMobileSettings();
    applyRules();
}

function validatePlayers(input) {
    const max = Price_Values.modeLimits[currentMode].typedMax;
    playerCount = Math.max(1, Math.min(max, parseInt(input.value) || 1));
    input.value = playerCount;
    const allInputs = document.querySelectorAll('.player-input');
    allInputs.forEach(inp => { inp.value = playerCount; });
    applyRules();
    updateFormulaText();
    calculate();
}

function toggleDiscount(key) {
    discountActive[key] = !discountActive[key];
    document.querySelectorAll(`[data-discount="${key}"]`).forEach(btn => {
        btn.classList.toggle('active', discountActive[key]);
    });
    calculate();
}

function updateFormulaText() {
    const el = document.getElementById('formulaText');
    if (!el) return;
    let formula = 'ceil(base × √players)';
    if (currentMode === 'partyplus') formula += ` ÷ ${Price_Values.partyPlusDivisor}`;
    el.textContent = formula;
}

function toggleMobileSettings() {
    document.getElementById('mobileDrawer').classList.toggle('open');
}

function syncMobileSettings() {
    const pcBox  = document.getElementById('pc-settings-box');
    const drawer = document.getElementById('mobile-settings-content');
    if (!drawer || !pcBox) return;
    drawer.innerHTML = pcBox.innerHTML;
    const mobInput = drawer.querySelector('.player-input');
    if (mobInput) { 
        mobInput.value = playerCount;
        mobInput.removeAttribute('disabled');
        mobInput.onchange = function() { validatePlayers(this); };
    }
    drawer.querySelectorAll('[data-discount]').forEach(b => {
        b.classList.toggle('active', discountActive[b.dataset.discount]);
        b.onclick = function() { toggleDiscount(this.dataset.discount); };
    });
    drawer.querySelectorAll('[data-diff]').forEach(b => {
        b.classList.toggle('active', b.dataset.diff === currentDifficulty);
        b.onclick = function() { setDifficulty(this.dataset.diff); };
    });
    drawer.querySelectorAll('[data-mode]').forEach(b => {
        b.classList.toggle('active', b.dataset.mode === currentMode);
        b.onclick = function() { setMode(this.dataset.mode); };
    });
    updateFormulaText();
}

function clearAll() {
    upgradesList.forEach((item, index) => {
        item.currentStack = 0;
        const el = document.getElementById(`item-${index}`);
        if (el) el.classList.remove('active');
        clearDots(index, item);
    });
    calculate();
}

window.onload = () => {
    renderGrid();
    setMode('solo');
    syncMobileSettings();
    setTimeout(() => {
        document.getElementById('loading-screen').style.opacity = '0';
        document.getElementById('main-ui').classList.add('loaded');
        setTimeout(() => document.getElementById('loading-screen').remove(), 800);
    }, Price_Values.loadingFadeDelayMs);
};
