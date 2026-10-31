let currentDifficulty = 'standard';
let currentMode       = 'solo';
let playerCount       = 1;
const discountActive  = { nothing: false, wish: false };

let buyMode       = false;
let gifts         = 0;
let playerLevel   = Price_Values.startLevel;
let purchaseOrder = [];
let purchaseHistory = [];
let logTab        = 'current';
let justBought    = false;
let lastLogKey    = null;
let searchTerm    = '';
let toastTimer;

const clamp     = (n, min, max) => Math.max(min, Math.min(max, n));
const maxOf     = item => item.maxStack || 1;
const ownedOf   = item => item.owned || 0;
const haveOf    = item => (item.owned || 0) + (item.bought || 0);
const stackOf   = item => buyMode ? haveOf(item) : item.currentStack;
const isHiddenNow = item => isCasualHidden(item) || isExtremeHidden(item);
const indexOfEl = el => Number(el.id.replace('item-', ''));


function toast(message) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), Price_Values.toastMs);
}

function shake(el) {
    el.animate(
        [{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' }],
        { duration: 260, easing: 'ease-out' });
}

function setStat(el, text) {
    if (el.textContent === text) return;
    el.textContent = text;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
}


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
    let scaled = (playerCount === 1) ? base : base * Math.sqrt(playerCount);
    if (currentMode === 'party' && playerCount > Price_Values.bigPartyAbove) scaled = scaled / Price_Values.bigPartyDivisor;
    const discount = getDiscountPercent();
    if (discount > 0) scaled = scaled * (100 - discount) / 100;
    return Math.ceil(Math.round(scaled * 1e6) / 1e6);
}

function spentOn(item) {
    let t = 0;
    const from = ownedOf(item) + 1;
    const to   = haveOf(item);
    for (let s = from; s <= to; s++) t += computePrice(item, s);
    return t;
}

function totalSpent() {
    let t = 0;
    upgradesList.forEach(item => { if (!isHiddenNow(item)) t += spentOn(item); });
    return t;
}


function renderGrid() {
    const grid = document.getElementById('mainGrid');
    grid.innerHTML = upgradesList.map((item, index) => {
        let dots = '';
        if (item.maxStack > 1) {
            for (let i = 0; i < item.maxStack; i++) dots += `<div class="stack-dot" id="dot-${index}-${i}"></div>`;
        }
        return `<div class="upgrade-item" id="item-${index}" style="--i:${index}" onclick="clickUpgrade(${index}, this)">
            <div class="icon-wrapper"><img src="${item.icon}" onerror="this.src='https://via.placeholder.com/50?text=?'"></div>
            <div class="info">
                <span class="name">${item.name}</span>
                <span class="price-tag" id="price-text-${index}">Cost: 0</span>
                <div class="stack-indicator">${dots}</div>
            </div>
            <span class="lv-badge">Lv${item.level}</span>
        </div>`;
    }).join('');

    grid.addEventListener('animationend', e => {
        if (e.animationName === 'dot-pop') e.target.classList.remove('pop');
    });
    grid.addEventListener('contextmenu', e => {
        const el = e.target.closest('.upgrade-item');
        if (!el || buyMode) return;
        e.preventDefault();
        if (el.classList.contains('disabled')) return;
        const index = indexOfEl(el);
        const item = upgradesList[index];
        if (item.currentStack <= 0) return;
        item.currentStack--;
        refreshItem(index);
        calculate();
        fitGrid();
    });

    applyRules();
    updateVisualPrices();
}

function refreshItem(index, animate = false) {
    const item = upgradesList[index];
    const el   = document.getElementById(`item-${index}`);
    if (!el) return;
    const s = stackOf(item);
    el.classList.toggle('active', s > 0);
    if (!el.classList.contains('buying')) el.classList.toggle('sold', buyMode && s >= maxOf(item));
    for (let i = 0; i < item.maxStack; i++) {
        const dot = document.getElementById(`dot-${index}-${i}`);
        if (!dot) continue;
        const want = i < s;
        const was  = dot.classList.contains('filled');
        dot.classList.toggle('filled', want);
        if (want && !was && animate) {
            dot.classList.remove('pop');
            void dot.offsetWidth;
            dot.classList.add('pop');
        }
    }
}

function refreshAllItems() {
    upgradesList.forEach((_, i) => refreshItem(i));
}

function updateVisualPrices() {
    const remaining = buyMode ? gifts - totalSpent() : 0;
    upgradesList.forEach((item, index) => {
        const el = document.getElementById(`item-${index}`);
        const max = maxOf(item);
        let text, unaffordable = false, locked = false;
        if (buyMode) {
            const owned = haveOf(item);
            const next  = Math.min(owned + 1, max);
            const cost  = computePrice(item, next);
            if (owned >= max) text = 'Maxed';
            else {
                text = max > 1 ? `Stack ${next}: ${cost.toLocaleString()}` : `Cost: ${cost.toLocaleString()}`;
                unaffordable = cost > remaining;
                locked = item.level > playerLevel;
            }
        } else {
            const displayStack = item.currentStack > 0 ? item.currentStack : 1;
            const previewCost  = computePrice(item, displayStack);
            text = max > 1
                ? `Stack ${displayStack}: ${previewCost.toLocaleString()}`
                : `Cost: ${previewCost.toLocaleString()}`;
        }
        const t = document.getElementById('price-text-' + index);
        if (t) t.textContent = text;
        if (el) {
            el.classList.toggle('unaffordable', unaffordable && !locked);
            el.classList.toggle('locked', locked);
        }
    });
}

function applyRules() {
    upgradesList.forEach((item, index) => {
        const el = document.getElementById(`item-${index}`);
        if (!el) return;
        const casualHide  = isCasualHidden(item);
        const extremeHide = isExtremeHidden(item);
        el.classList.toggle('casual-hidden',  casualHide);
        el.classList.toggle('extreme-hidden', extremeHide);
        if (casualHide || extremeHide) { item.currentStack = 0; item.bought = 0; refreshItem(index); }
        let disabled = false;
        if (item.id === 'opt-adrenaline' && isPartyMode()) disabled = true;
        if (item.id === 'opt-lrs' && (!isPartyMode() || playerCount < Price_Values.lastStandingMinPlayers)) disabled = true;
        el.classList.toggle('disabled', disabled && !casualHide && !extremeHide);
        if (disabled) { item.currentStack = 0; item.bought = 0; refreshItem(index); }
    });
    applySearch();
    calculate();
}

function applySearch() {
    let shown = 0;
    upgradesList.forEach((item, index) => {
        const el = document.getElementById(`item-${index}`);
        if (!el) return;
        const match = !searchTerm || item.name.toLowerCase().includes(searchTerm);
        el.classList.toggle('filtered', !match);
        if (match && !isHiddenNow(item)) shown++;
    });
    const empty = document.getElementById('gridEmpty');
    if (empty) empty.hidden = !(searchTerm && shown === 0);
}

function fitGrid() {
    const grid = document.getElementById('mainGrid');
    const ui   = document.getElementById('main-ui');
    if (!grid || !ui || document.body.classList.contains('rotating')) return;
    grid.style.gridTemplateColumns = '';
    grid.style.height = '';
    if (window.innerWidth <= 1000 || ui.offsetHeight === 0) return;

    const n = [...grid.children].filter(el =>
        !el.classList.contains('casual-hidden') && !el.classList.contains('extreme-hidden') &&
        !el.classList.contains('sold') && !el.classList.contains('filtered')).length;
    if (!n) return;

    const gap = 10, minRow = 54, minCol = 215;
    const avail = grid.clientHeight;
    const maxCols = Math.max(1, Math.floor((grid.clientWidth + gap) / (minCol + gap)));

    let cols = Math.min(4, maxCols);
    while (cols < maxCols && Math.ceil(n / cols) * (minRow + gap) - gap > avail) cols++;
    grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
}


function clickUpgrade(index, el) {
    if (el.classList.contains('disabled') || el.classList.contains('casual-hidden') || el.classList.contains('extreme-hidden') || el.classList.contains('buying')) return;
    const item = upgradesList[index];
    const max  = maxOf(item);
    let soldNow = false;

    if (buyMode) {
        const owned = haveOf(item);
        if (owned >= max) return;
        if (item.level > playerLevel) {
            shake(el);
            toast(`Requires level ${item.level}`);
            return;
        }
        const cost = computePrice(item, owned + 1);
        const left = gifts - totalSpent();
        if (cost > left) {
            shake(el);
            toast(`Need ${(cost - left).toLocaleString()} more gifts`);
            return;
        }
        item.bought = (item.bought || 0) + 1;
        purchaseOrder.push({ index, stack: owned + 1 });
        justBought = true;
        soldNow = haveOf(item) >= max;
    } else {
        item.currentStack = (item.currentStack >= max) ? 0 : item.currentStack + 1;
    }
    if (soldNow) {
        el.classList.add('buying');
        setTimeout(() => {
            el.classList.remove('buying');
            refreshItem(index);
            fitGrid();
        }, 320);
    }
    refreshItem(index, true);
    calculate();
    fitGrid();
}

function pruneOrder() {
    purchaseOrder = purchaseOrder.filter(p => p.stack <= haveOf(upgradesList[p.index]));
}

function undoPurchase() {
    if (!buyMode) return;
    pruneOrder();
    const last = purchaseOrder.pop();
    if (!last) return;
    const item = upgradesList[last.index];
    item.bought = Math.max(0, (item.bought || 0) - 1);
    refreshItem(last.index);
    calculate();
    fitGrid();
    toast(`Refunded ${item.name}`);
}

function resetPurchases() {
    upgradesList.forEach(item => { item.bought = 0; item.owned = 0; });
    purchaseOrder = [];
    purchaseHistory = [];
    refreshAllItems();
    renderHistory();
}

function commitPurchase() {
    if (!buyMode) return;
    pruneOrder();
    if (!purchaseOrder.length) { toast('Nothing to purchase yet'); return; }

    const items = purchaseOrder.map(p => {
        const item = upgradesList[p.index];
        return { name: item.name, icon: item.icon, stack: p.stack, max: maxOf(item), price: computePrice(item, p.stack) };
    });
    const spent  = items.reduce((t, e) => t + e.price, 0);
    const before = gifts;
    gifts = Math.max(0, gifts - spent);

    purchaseHistory.push({ level: playerLevel, before, after: gifts, spent, items });

    upgradesList.forEach(item => {
        if (item.bought) { item.owned = ownedOf(item) + item.bought; item.bought = 0; }
    });
    purchaseOrder = [];
    justBought = false;
    lastLogKey = null;

    syncControls();
    refreshAllItems();
    calculate();
    renderHistory();
    fitGrid();
    toast(`Purchased ${items.length} ${items.length === 1 ? 'item' : 'items'} for ${spent.toLocaleString()} gifts`);
}

function clearHistory() {
    if (!purchaseHistory.length && !upgradesList.some(i => ownedOf(i) > 0)) return;
    if (!confirm('Clear buy history? Upgrades you already purchased will become available again.')) return;
    upgradesList.forEach(item => { item.owned = 0; });
    purchaseHistory = [];
    refreshAllItems();
    calculate();
    renderHistory();
    fitGrid();
    toast('Buy history cleared');
}

function setLogTab(tab) {
    logTab = tab;
    document.querySelectorAll('.log-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    document.querySelectorAll('.log-panel').forEach(p => { p.hidden = p.dataset.panel !== tab; });
}

function logMarkup() {
    return `<div class="log-tabs" role="tablist">
        <button type="button" class="log-tab active" data-tab="current" role="tab" onclick="setLogTab('current')">
            Cart <span class="log-count purchase-count">0</span>
        </button>
        <button type="button" class="log-tab" data-tab="history" role="tab" onclick="setLogTab('history')">
            History <span class="log-count history-count">0</span>
        </button>
    </div>
    <div class="log-panel" data-panel="current">
        <div class="purchase-list"></div>
        <div class="purchase-summary"><span>Gifts Spent</span><span class="purchase-spent">0</span></div>
        <div class="log-actions">
            <button class="undo-btn" type="button" onclick="undoPurchase()" disabled>Undo</button>
            <button class="purchase-btn" type="button" onclick="commitPurchase()" disabled>Purchase</button>
        </div>
    </div>
    <div class="log-panel" data-panel="history" hidden>
        <div class="history-list"></div>
        <button class="history-clear" type="button" onclick="clearHistory()">Clear history</button>
    </div>`;
}

function renderHistory() {
    document.querySelectorAll('.history-count').forEach(el => { el.textContent = purchaseHistory.length; });
    document.querySelectorAll('.history-clear').forEach(b => { b.style.display = purchaseHistory.length ? '' : 'none'; });
    const html = purchaseHistory.length
        ? purchaseHistory.map((b, i) => ({ b, n: i + 1 })).reverse().map(({ b, n }) => `<div class="history-batch">
            <div class="history-head">
                <span class="history-title">#${n}<span class="history-lv">Level ${b.level}</span></span>
                <span class="history-total">-${b.spent.toLocaleString()}</span>
            </div>
            <div class="history-sub">${b.before.toLocaleString()} → ${b.after.toLocaleString()} gifts</div>
            <div class="history-items">${b.items.map(e => `<div class="history-item">
                <img src="${e.icon}" alt="">
                <span class="history-name">${e.name}${e.max > 1 ? `<em>${e.stack}/${e.max}</em>` : ''}</span>
                <span class="history-price">${e.price.toLocaleString()}</span>
            </div>`).join('')}</div>
        </div>`).join('')
        : `<div class="purchase-empty"><strong>No Purchases Yet</strong><span>Press Purchase to save your spending here</span></div>`;
    document.querySelectorAll('.history-list').forEach(el => { el.innerHTML = html; });
}

function buildLog() {
    const card = document.getElementById('purchasesCard');
    if (card) card.innerHTML = logMarkup();
}

function clearAll() {
    upgradesList.forEach((item, index) => {
        if (buyMode) item.bought = 0; else item.currentStack = 0;
        refreshItem(index);
    });
    if (buyMode) purchaseOrder = [];
    calculate();
    fitGrid();
}


const emptyPurchases = `<div class="purchase-empty">
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l-1 12H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>
    <strong>Nothing Spent Yet</strong>
    <span>Click an upgrade to spend gifts on it</span>
</div>`;

function renderPurchases() {
    pruneOrder();
    let balance = gifts;
    let spent = 0;
    const entries = purchaseOrder.map(p => {
        const item  = upgradesList[p.index];
        const price = computePrice(item, p.stack);
        balance -= price;
        spent   += price;
        return { item, stack: p.stack, price, left: balance };
    }).reverse();

    document.querySelectorAll('.undo-btn').forEach(b => { b.disabled = entries.length === 0; });
    document.querySelectorAll('.purchase-btn').forEach(b => { b.disabled = entries.length === 0; });
    const count = String(entries.length);
    document.querySelectorAll('.purchase-count').forEach(el => setStat(el, count));
    document.querySelectorAll('.purchase-spent').forEach(el => setStat(el, spent.toLocaleString()));

    const key = entries.map(e => `${e.item.name}:${e.stack}:${e.price}:${e.left}`).join('|');
    if (key === lastLogKey) return;
    lastLogKey = key;

    const html = entries.length
        ? entries.map((e, i) => {
            const max   = maxOf(e.item);
            const tag   = max > 1 ? `Stack ${e.stack} of ${max}` : 'One Time';
            const fresh = justBought && i === 0 ? ' fresh' : '';
            return `<div class="purchase-row${fresh}">
                <div class="purchase-icon"><img src="${e.item.icon}" alt=""></div>
                <div class="purchase-info">
                    <div class="purchase-name">${e.item.name}</div>
                    <div class="purchase-meta"><span class="purchase-tag">${tag}</span><span>${e.left.toLocaleString()} left</span></div>
                </div>
                <div class="purchase-price">-${e.price.toLocaleString()}</div>
            </div>`;
        }).join('')
        : emptyPurchases;

    justBought = false;
    document.querySelectorAll('.purchase-list').forEach(el => { el.innerHTML = html; });
}

function calculate() {
    let shown, label, formula, negative = false;
    if (buyMode) {
        const spent = totalSpent();
        const left  = gifts - spent;
        shown    = left.toLocaleString();
        negative = left < 0;
        label    = 'Gifts Left';
        formula  = `${spent.toLocaleString()} of ${gifts.toLocaleString()} gifts spent`;
    } else {
        let total = 0;
        upgradesList.forEach(item => {
            if (item.currentStack > 0 && !isHiddenNow(item)) total += computePrice(item);
        });
        shown   = total.toLocaleString();
        label   = 'Total Gifts';
        formula = 'ceil(base × √players)';
    }
    const res = document.getElementById('result');
    res.textContent = shown;
    res.classList.toggle('negative', negative);
    document.getElementById('totalLabel').textContent = label;
    document.getElementById('formulaText').textContent = formula;
    const ml = document.getElementById('mobileLabel');
    if (ml) ml.textContent = buyMode ? 'Left' : 'Total';

    const indicator = document.getElementById('curse-indicator');
    if (indicator) {
        const discount = getDiscountPercent();
        indicator.textContent = discount > 0 ? `${discount}% discount is on` : 'Discount is on';
        indicator.style.opacity = discount > 0 ? '1' : '0';
    }
    const mob = document.getElementById('mobile-result');
    if (mob) mob.textContent = shown;
    updateVisualPrices();
    renderPurchases();
}


function syncControls() {
    const body = document.body;
    [...body.classList].filter(c => c.startsWith('mode-')).forEach(c => body.classList.remove(c));
    body.classList.add(`mode-${currentDifficulty}`);
    document.documentElement.classList.toggle('buy-on', buyMode);

    const { min, max } = Price_Values.modeLimits[currentMode];
    document.querySelectorAll('[data-diff]').forEach(b => b.classList.toggle('active', b.dataset.diff === currentDifficulty));
    document.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('active', b.dataset.mode === currentMode));
    document.querySelectorAll('.price-players').forEach(i => { i.min = min; i.max = max; i.value = playerCount; });
    document.querySelectorAll('[data-discount]').forEach(b => b.classList.toggle('active', discountActive[b.dataset.discount]));
    document.querySelectorAll('[data-buy-toggle]').forEach(b => {
        b.classList.toggle('active', buyMode);
        const pill = b.querySelector('.buy-pill');
        if (pill) pill.textContent = buyMode ? 'On' : 'Off';
    });
    document.querySelectorAll('.gifts-input').forEach(i => { if (document.activeElement !== i) i.value = gifts || ''; });
    document.querySelectorAll('.level-input').forEach(i => { if (document.activeElement !== i) i.value = playerLevel; });
}

function setDifficulty(diff) {
    currentDifficulty = diff;
    syncControls();
    applyRules();
}

function setMode(mode) {
    const changed = mode !== currentMode;
    const hadPurchases = purchaseOrder.length > 0 || purchaseHistory.length > 0;
    currentMode = mode;
    const { min, typedMax } = Price_Values.modeLimits[mode];
    playerCount = clamp(playerCount, min, typedMax);
    if (changed) {
        resetPurchases();
        if (hadPurchases) toast('Spending log and buy history cleared for the new mode');
    }
    syncControls();
    applyRules();
}

function validatePlayers(input) {
    const { typedMax } = Price_Values.modeLimits[currentMode];
    playerCount = clamp(parseInt(input.value) || 1, 1, typedMax);
    syncControls();
    applyRules();
}

function toggleDiscount(key) {
    discountActive[key] = !discountActive[key];
    syncControls();
    calculate();
}

function toggleBuyMode() {
    buyMode = !buyMode;
    syncControls();
    refreshAllItems();
    calculate();
    fitGrid();
}

function setGifts(input) {
    gifts = Math.max(0, parseInt(input.value) || 0);
    document.querySelectorAll('.gifts-input').forEach(i => { if (i !== input) i.value = input.value; });
    calculate();
}

function setLevel(input) {
    const n = parseInt(input.value);
    playerLevel = Number.isNaN(n) ? 0 : clamp(n, 0, Price_Values.maxLevel);
    document.querySelectorAll('.level-input').forEach(i => { if (i !== input) i.value = input.value; });
    calculate();
}

function setSearch(value) {
    searchTerm = value.trim().toLowerCase();
    document.querySelectorAll('.upgrade-search').forEach(i => { if (i.value !== value) i.value = value; });
    applySearch();
    fitGrid();
}


function toggleMobileSettings() {
    document.getElementById('mobileDrawer').classList.toggle('open');
}

function buildDrawer() {
    const pcBox  = document.getElementById('pc-settings-box');
    const drawer = document.getElementById('mobile-settings-content');
    if (!drawer || !pcBox) return;
    drawer.innerHTML = pcBox.innerHTML;
    drawer.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    drawer.insertAdjacentHTML('beforeend', `<div class="input-group purchases-group">${logMarkup()}</div>`);
    lastLogKey = null;
}


document.addEventListener('keydown', e => {
    if (document.body.classList.contains('view-prot')) return;
    const tag = document.activeElement ? document.activeElement.tagName : '';
    const typing = tag === 'INPUT' || tag === 'TEXTAREA';
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && buyMode && !typing) {
        e.preventDefault();
        undoPurchase();
    } else if (e.key === '/' && !typing) {
        const search = document.querySelector('#main-ui .upgrade-search');
        if (search) { e.preventDefault(); search.focus(); }
    } else if (e.key === 'Escape' && document.activeElement && document.activeElement.classList.contains('upgrade-search')) {
        setSearch('');
        document.activeElement.blur();
    }
});

window.addEventListener('resize', fitGrid);
new MutationObserver(() => {
    if (!document.body.classList.contains('view-prot') && !document.body.classList.contains('rotating')) fitGrid();
}).observe(document.body, { attributes: true, attributeFilter: ['class'] });

window.onload = () => {
    renderGrid();
    buildLog();
    buildDrawer();
    renderHistory();
    setLogTab(logTab);
    syncControls();
    refreshAllItems();
    applyRules();
    fitGrid();
    if (document.fonts) document.fonts.ready.then(fitGrid);
    setTimeout(() => {
        document.getElementById('loading-screen').style.opacity = '0';
        document.getElementById('main-ui').classList.add('loaded');
        setTimeout(() => document.getElementById('loading-screen').remove(), 800);
    }, Price_Values.loadingFadeDelayMs);
};
