const CASUAL_OVERRIDES = {
    "Grace Wings":               { hidden: true },
    "Defuse Kit":                { hidden: true },
    "Subspacial Barrier":        { hidden: true },
    "Radar Module : Tripmines":  { hidden: true },
    "Shield":               { casualPrice: 2000,  casualSoloPrice: 1000  },
    "Ice Skates":           { casualPrice: 400,   casualSoloPrice: 300   },
    "Ninja Belt":           { casualPrice: 700,   casualSoloPrice: 500   },
    "Matrix Tetrahedron":   { casualPrice: 1500,  casualSoloPrice: 1500  },
    "Shark Tail":           { casualPrice: 800,   casualSoloPrice: 800   },
    "Drowned Ægis":         { casualPrice: 4000,  casualSoloPrice: 4000  },
    "Panic Necklace":       { casualPrice: 1500,  casualSoloPrice: 1500  },
    "Sport Shoes":          { casualPrice: 1000,  casualSoloPrice: 1000  },
    "Gift Magnet":          { casualPrices: [750,  1050, 1350]            },
    "Gift Idol":            { casualPrices: [3000, 6000, 9000, 12000, 15000] },
    "Miniature Hourglass":  { casualPrice: 1500,  casualSoloPrice: 1500  },
};

const EXTREME_OVERRIDES = {
    "Swiftness Ring":       { extremePrice: 80,  extremeSoloPrice: 80  },
    "Test1":       { extremePrice: 1,  extremeSoloPrice: 2  },
    "Test2":       { extremePrices: [1, 2], extremeSoloPrices: [3, 4] },
};

const upgradesList = [
    { name:"Adrenaline",                 price:50,   soloPrice:50,   icon:"assets/Adrenaline.png",                 id:"opt-adrenaline", level:3,  currentStack:0 },
    { name:"Business License",           prices:[75, 188],           icon:"assets/Business_License.png",           level:3,  currentStack:0, maxStack:2 },
    { name:"Defuse Kit",                 price:30,   soloPrice:30,   icon:"assets/Defuse_Kit.png",                 level:3,  currentStack:0 },
    { name:"Paycheck",                   price:55,   soloPrice:55,   icon:"assets/Paycheck.png",                   level:3,  currentStack:0 },
    { name:"Swiftness Ring",             price:80,   soloPrice:80,   icon:"assets/Swiftness_Ring.png",             level:3,  currentStack:0 },
    { name:"Radar",                      price:175,  soloPrice:175,  icon:"assets/Radar.png",                      level:5,  currentStack:0 },
    { name:"Better Jump Pads",           price:50,   soloPrice:50,   icon:"assets/Better_Jump_Pads.png",           level:5,  currentStack:0 },
    { name:"Double Jump",                price:150,  soloPrice:150,  icon:"assets/Double_Jump.png",                level:5,  currentStack:0 },
    { name:"Grapple Points",             price:100,  soloPrice:100,  icon:"assets/Grapple_Points.png",             level:5,  currentStack:0 },
    { name:"Tria Orb",                   price:100,  soloPrice:100,  icon:"assets/Tria_Orb.png",                   level:5,  currentStack:0 },
    { name:"Medal",                      price:100,  soloPrice:100,  icon:"assets/Medal.png",                      level:5,  currentStack:0 },
    { name:"Advanced Gravity Coil",      price:600,  soloPrice:600,  icon:"assets/Advanced_Gravity_Coil.png",      level:8,  currentStack:0 },
    { name:"Ice Skates",                 price:400,  soloPrice:300,  icon:"assets/Ice_Skates.png",                 level:8,  currentStack:0 },
    { name:"Fanny Pack",                 price:300,  soloPrice:300,  icon:"assets/Fanny_Pack.png",                 level:8,  currentStack:0 },
    { name:"Grace Wings",                price:300,  soloPrice:200,  icon:"assets/Grace_Wings.png",                level:8,  currentStack:0 },
    { name:"Helmet",                     price:400,  soloPrice:400,  icon:"assets/Helmet.png",                     level:8,  currentStack:0 },
    { name:"Pocket Bell",                price:300,  soloPrice:300,  icon:"assets/Pocket_Bell.png",                level:8,  currentStack:0 },
    { name:"Last Robloxian Standing",    price:300,  soloPrice:300,  icon:"assets/Last_Robloxian_Standing.png",   id:"opt-lrs", level:8, currentStack:0 },
    { name:"Radar Module : Altars",      price:300,  soloPrice:300,  icon:"assets/Radar_Module_Altars.png",        level:8,  currentStack:0 },
    { name:"Radar Module : Tripmines",   price:400,  soloPrice:400,  icon:"assets/Radar_Module_Tripmines.png",     level:8,  currentStack:0 },
    { name:"Radar Module : Enemies",     price:200,  soloPrice:200,  icon:"assets/Radar_Module_Enemies.png",       level:8,  currentStack:0 },
    { name:"More Altars",                price:600,  soloPrice:600,  icon:"assets/More_Altars.png",                level:10, currentStack:0 },
    { name:"Ninja Belt",                 price:700,  soloPrice:500,  icon:"assets/Ninja_Belt.png",                 level:13, currentStack:0 },
    { name:"Subspacial Barrier",         prices:[1000, 3000], soloPrices:[500, 1500], icon:"assets/Subspacial_Barrier.png", level:13, currentStack:0, maxStack:2 },
    { name:"Large Grapple Points",       price:500,  soloPrice:500,  icon:"assets/Large_Grapple_Points.png",       level:13, currentStack:0 },
    { name:"Gift Magnet",                prices:[1500, 2100, 2700],  icon:"assets/Gift_Magnet.png",                level:15, currentStack:0, maxStack:3 },
    { name:"Matrix Tetrahedron",         price:2500, soloPrice:2500, icon:"assets/Matrix_Tetrahedron.png",         level:15, currentStack:0 },
    { name:"Shield",                     price:4000, soloPrice:1000, icon:"assets/Shield.png",                    level:15, currentStack:0 },
    { name:"Sport Shoes",                price:1350, soloPrice:1350, icon:"assets/Sport_Shoes.png",               level:15, currentStack:0 },
    { name:"Shark Tail",                 price:1200, soloPrice:1200, icon:"assets/Shark_Tail.png",                level:15, currentStack:0 },
    { name:"Radar Module : Instruments", price:1000, soloPrice:1000, icon:"assets/Radar_Module_Instruments.png",  level:18, currentStack:0 },
    { name:"Panic Necklace",             price:3000, soloPrice:3000, icon:"assets/Panic_Necklace.png",            level:18, currentStack:0 },
    { name:"Drowned Ægis",              price:6000, soloPrice:6000, icon:"assets/DrownedAegis.png",              level:20, currentStack:0 },
    { name:"Miniature Hourglass",        price:3000, soloPrice:3000, icon:"assets/Miniature_Hourglass.png",       level:20, currentStack:0 },
    { name:"Gift Idol",                  prices:[4000, 8000, 12000, 16000, 20000], icon:"assets/Gift_Idol.png",   level:20, currentStack:0, maxStack:5 },
];

let currentDifficulty  = 'standard';
let currentMode        = 'solo';
let playerCount        = 1;
let nothingCurseActive = false;

function isPartyMode() { return currentMode === 'party' || currentMode === 'partyplus'; }

function isCasualHidden(item) {
    if (currentDifficulty !== 'casual') return false;
    return !!(CASUAL_OVERRIDES[item.name]?.hidden);
}

function isExtremeHidden(item) {
    if (currentDifficulty !== 'extreme') return false;
    return !!(EXTREME_OVERRIDES[item.name]?.hidden);
}

function getEffectivePrices(item) {
    if (currentDifficulty === 'casual' && CASUAL_OVERRIDES[item.name]) {
        const ov = CASUAL_OVERRIDES[item.name];
        return {
            price:      ov.casualPrice      ?? item.price,
            soloPrice:  ov.casualSoloPrice  ?? item.soloPrice,
            prices:     ov.casualPrices     ?? item.prices,
            soloPrices: item.soloPrices,
        };
    }
    if (currentDifficulty === 'extreme' && EXTREME_OVERRIDES[item.name]) {
        const ov = EXTREME_OVERRIDES[item.name];
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
    if (currentMode === 'partyplus') scaled = Math.ceil(scaled / 1.125);
    if (currentMode === 'party' && playerCount > 8) scaled = Math.ceil(scaled / 1.125);
    if (nothingCurseActive) scaled = Math.ceil(scaled * 0.85);
    return scaled;
}

function renderGrid() {
    const grid = document.getElementById('mainGrid');
    grid.innerHTML = upgradesList.map((item, index) => {
        let dots = '';
        if (item.maxStack > 1) {
            for (let i = 0; i < item.maxStack; i++) dots += `<div class="stack-dot" id="dot-${index}-${i}"></div>`;
        }
        return `<div class="upgrade-item" id="item-${index}" onclick="cycleUpgrade(${index}, this)">
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
    if (indicator) indicator.style.opacity = nothingCurseActive ? '1' : '0';
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
        if (item.id === 'opt-lrs' && (!isPartyMode() || playerCount <= 2)) disabled = true;
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
    const pInput = document.getElementById('pInput');
    if (mode === 'solo') {
        pInput.min = 1; pInput.max = 1;
        playerCount = 1;
        pInput.value = 1;
    } else if (mode === 'duo') {
        pInput.min = 1; pInput.max = 2;
        if (playerCount > 2) playerCount = 2;
        if (playerCount < 1) playerCount = 1;
        pInput.value = playerCount;
    } else if (mode === 'party') {
        pInput.min = 1; pInput.max = 8;
        if (playerCount > 8) playerCount = 8;
        if (playerCount < 1) playerCount = 1;
        pInput.value = playerCount;
    } else if (mode === 'partyplus') {
        pInput.min = 1; pInput.max = 20;
        if (playerCount < 1) playerCount = 1;
        pInput.value = playerCount;
    }
    document.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    updateFormulaText();
    syncMobileSettings();
    applyRules();
}

function validatePlayers(input) {
    const max = currentMode === 'duo' ? 2 : currentMode === 'party' ? 8 : currentMode === 'partyplus' ? 999 : 1;
    playerCount = Math.max(1, Math.min(max, parseInt(input.value) || 1));
    input.value = playerCount;
    const allInputs = document.querySelectorAll('.player-input');
    allInputs.forEach(inp => { inp.value = playerCount; });
    applyRules();
    updateFormulaText();
    calculate();
}

function toggleCurse() {
    nothingCurseActive = !nothingCurseActive;
    const allCurseBtns = document.querySelectorAll('.curse-toggle-btn');
    allCurseBtns.forEach(btn => {
        btn.classList.toggle('active', nothingCurseActive);
    });
    calculate();
}

function updateFormulaText() {
    const el = document.getElementById('formulaText');
    if (!el) return;
    let formula = playerCount > 1 ? 'ceil(base × √players)' : 'ceil(base × √players)';
    if (currentMode === 'partyplus') formula += ' ÷ 1.125';
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
    const mobCurse = drawer.querySelector('.curse-toggle-btn');
    if (mobCurse) {
        mobCurse.classList.toggle('active', nothingCurseActive);
        mobCurse.onclick = function() { toggleCurse(); };
    }
    drawer.querySelectorAll('[data-diff]').forEach(b => {
        b.classList.toggle('active', b.dataset.diff === currentDifficulty);
        b.onclick = function() { setDifficulty(this.dataset.diff); };
    });
    drawer.querySelectorAll('[data-mode]').forEach(b => {
        b.classList.toggle('active', b.dataset.mode === currentMode);
        b.onclick = function() { setMode(this.dataset.mode); };
    });
    const themeMap = { casual: 'var(--casual)', standard: 'var(--primary)', extreme: 'var(--extreme)' };
    const mobBtn = document.getElementById('mobileSettingsBtn');
    if (mobBtn) mobBtn.style.background = themeMap[currentDifficulty] ?? 'var(--primary)';
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
    }, 1200);
};

particlesJS('particles-js', {
    particles: {
        number:  { value: 45 },
        color:   { value: '#c285ff' },
        opacity: { value: 0.3 },
        size:    { value: 2.5 },
        move:    { enable: true, speed: 0.6 },
    }
});