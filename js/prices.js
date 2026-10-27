const Prot_Values = {
    minLevel: 8,
    levelOffset: 4,
    partyScalingDivisor: 1.75,
    
    pricing: {
        soloDuo: { percent: 0.05, basePrice: 12.5 },
        party:   { percent: 0.10, basePrice: 50 },
    },

    modes: {
        solo:       { min: 1, max: 1,  isSoloDuo: true  },
        duo:        { min: 1, max: 2,  isSoloDuo: true  },
        party:      { min: 1, max: 8,  isSoloDuo: false },
        party_plus: { min: 1, max: 20, isSoloDuo: false },
    },

    transition: {
        angle: 55,
        durationMs: 900,
        easing: 'cubic-bezier(.65,0,.35,1)',
    },

    introSettleMs: 2521,
};

const Price_Values = {
    discountPercent: { nothing: 15, wish: 10, both: 25 },
    partyPlusDivisor: 1.125,
    bigPartyDivisor: 1.125,
    bigPartyAbove: 8,
    lastStandingMinPlayers: 3,

    modeLimits: {
        solo:      { min: 1, max: 1,  typedMax: 1   },
        duo:       { min: 1, max: 2,  typedMax: 2   },
        party:     { min: 1, max: 8,  typedMax: 8   },
        partyplus: { min: 1, max: 20, typedMax: 999 },
    },

    startLevel: 0,
    maxLevel: 99,
    toastMs: 2200,

    loadingFadeDelayMs: 200,
    loadingRemoveDelayMs: 800,
};

const Casual_Changes = {
    "Defuse Kit":                  { hidden: true },
    "Grace Wings":                 { hidden: true },
    "Radar Module : Tripmines":    { hidden: true },
    "Miniature Hourglass":         { hidden: true },
    "Business License":            { casualPrices: [75, 100, 1000], casualSoloPrices: [50, 100, 1000] },
    "Paycheck":                    { casualPrice: 55, casualSoloPrice: 33 },
    "Swiftness Ring":              { casualPrices: [70, 70, 70, 1000], casualSoloPrices: [60, 60, 60, 800] },
    "Radar":                       { casualPrice: 125, casualSoloPrice: 100 },
    "Double Jump":                 { casualPrice: 150, casualSoloPrice: 125 },
    "Advanced Gravity Coil":       { casualPrice: 500, casualSoloPrice: 500 },
    "Ice Skates":                  { casualPrice: 300, casualSoloPrice: 250 },
    "Fanny Pack":                  { casualPrice: 250, casualSoloPrice: 250 },
    "Helmet":                      { casualPrice: 300, casualSoloPrice: 275 },
    "Pocket Bell":                 { casualPrice: 275, casualSoloPrice: 250 },
    "Radar Module : Altars":       { casualPrice: 250, casualSoloPrice: 200 },
    "Radar Module : Enemies":      { casualPrice: 150, casualSoloPrice: 125 },
    "Altar Boons":                 { casualPrices: [475, 1000, 2750], casualSoloPrices: [450, 1000, 2500] },
    "Health Insurance":            { casualPrice: 350, casualSoloPrice: 350 },
    "Star Marts":                  { casualPrice: 350, casualSoloPrice: 300 },
    "More Altars":                 { casualPrice: 450, casualSoloPrice: 400 },
    "Birthday Pony":               { casualPrice: 300, casualSoloPrice: 250 },
    "Soul Tracers":                { casualPrice: 800, casualSoloPrice: 400 },
    "Ninja Belt":                  { casualPrice: 450, casualSoloPrice: 400 },
    "Subspacial Barrier":          { casualPrices: [600, 1000, 2000], casualSoloPrices: [400, 1000, 2000] },
    "Large Grapple Points":        { casualPrice: 300, casualSoloPrice: 250 },
    "Gift Magnet":                 { casualPrices: [750, 1000, 1250, 3250], casualSoloPrices: [500, 800, 1150, 3000] },
    "Matrix Tetrahedron":          { casualPrice: 1500, casualSoloPrice: 1250 },
    "Shield":                      { casualPrice: 2000, casualSoloPrice: 1500 },
    "Sport Shoes":                 { casualPrice: 1000, casualSoloPrice: 750 },
    "Shark Tail":                  { casualPrice: 900, casualSoloPrice: 650 },
    "Aggro Magnet":                { casualPrice: 1700, casualSoloPrice: 1500 },
    "Debuff Magnet":               { casualPrice: 1700, casualSoloPrice: 1500 },
    "Propeller Hat":               { casualPrice: 650, casualSoloPrice: 550 },
    "Radar Module : Instruments":  { casualPrice: 600, casualSoloPrice: 500 },
    "Panic Necklace":              { casualPrice: 1750, casualSoloPrice: 1500 },
    "Fleeting Fate":               { casualPrice: 1750, casualSoloPrice: 1500 },
    "Drowned Ægis":                { casualPrice: 4000, casualSoloPrice: 3250 },
    "Gift Idol":                   { casualPrices: [2500, 5000, 8500, 12000, 14500, 18000], casualSoloPrices: [2000, 4000, 6000, 8000, 10000, 15000] },
    "Shadow Cloak":                { casualPrice: 2000, casualSoloPrice: 1500 },
    "Jet Boosters":                { casualPrice: 4500, casualSoloPrice: 4000 },
    "Quixotic Wing":               { casualPrice: 25000, casualSoloPrice: 25000 },
    "Transient Pennon":            { casualPrice: 25000, casualSoloPrice: 25000 },
    "Magnified Levels":            { casualPrices: [2000, 5000, 12500, 17500], casualSoloPrices: [1500, 4500, 10000, 15000] },
};

const Extreme_Changes = {
    "Health Insurance":            { hidden: true },
    "Soul Tracers":                { hidden: true },
    "Business License":            { extremePrices: [75, 200, 2000], extremeSoloPrices: [75, 180, 1500] },
    "Radar":                       { extremePrice: 175, extremeSoloPrice: 150 },
    "Double Jump":                 { extremePrice: 175, extremeSoloPrice: 150 },
    "Advanced Gravity Coil":       { extremePrice: 725, extremeSoloPrice: 650 },
    "Ice Skates":                  { extremePrice: 400, extremeSoloPrice: 375 },
    "Fanny Pack":                  { extremePrice: 350, extremeSoloPrice: 300 },
    "Grace Wings":                 { extremePrice: 325, extremeSoloPrice: 200 },
    "Helmet":                      { extremePrice: 400, extremeSoloPrice: 375 },
    "Pocket Bell":                 { extremePrice: 350, extremeSoloPrice: 325 },
    "Radar Module : Altars":       { extremePrice: 350, extremeSoloPrice: 300 },
    "Radar Module : Tripmines":    { extremePrice: 450, extremeSoloPrice: 400 },
    "Radar Module : Enemies":      { extremePrice: 250, extremeSoloPrice: 200 },
    "Altar Boons":                 { extremePrices: [600, 1500, 4500], extremeSoloPrices: [600, 1250, 3999] },
    "Star Marts":                  { extremePrice: 550, extremeSoloPrice: 500 },
    "More Altars":                 { extremePrice: 600, extremeSoloPrice: 550 },
    "Birthday Pony":               { extremePrice: 450, extremeSoloPrice: 400 },
    "Ninja Belt":                  { extremePrice: 750, extremeSoloPrice: 525 },
    "Subspacial Barrier":          { extremePrices: [1000, 1500, 3750], extremeSoloPrices: [500, 1500, 3250] },
    "Large Grapple Points":        { extremePrice: 500, extremeSoloPrice: 325 },
    "Gift Magnet":                 { extremePrices: [1800, 2600, 3400, 7500], extremeSoloPrices: [1500, 2500, 3500, 7000] },
    "Matrix Tetrahedron":          { extremePrice: 2750, extremeSoloPrice: 2750 },
    "Shield":                      { extremePrice: 6000, extremeSoloPrice: 3500 },
    "Sport Shoes":                 { extremePrice: 1600, extremeSoloPrice: 1401 },
    "Shark Tail":                  { extremePrice: 1800, extremeSoloPrice: 1350 },
    "Aggro Magnet":                { extremePrice: 3500, extremeSoloPrice: 3000 },
    "Debuff Magnet":               { extremePrice: 3500, extremeSoloPrice: 3000 },
    "Propeller Hat":               { extremePrice: 850, extremeSoloPrice: 750 },
    "Radar Module : Instruments":  { extremePrice: 1000, extremeSoloPrice: 900 },
    "Panic Necklace":              { extremePrice: 3000, extremeSoloPrice: 2750 },
    "Fleeting Fate":               { extremePrice: 3000, extremeSoloPrice: 2750 },
    "Drowned Ægis":                { extremePrice: 7000, extremeSoloPrice: 6000 },
    "Miniature Hourglass":         { extremePrice: 4000, extremeSoloPrice: 3000 },
    "Gift Idol":                   { extremePrices: [5000, 8000, 12000, 16000, 22500, 28500], extremeSoloPrices: [4000, 7000, 10000, 13000, 16000, 25000] },
    "Shadow Cloak":                { extremePrice: 3500, extremeSoloPrice: 2500 },
    "Jet Boosters":                { extremePrice: 7000, extremeSoloPrice: 7000 },
    "Quixotic Wing":               { extremePrice: 35000, extremeSoloPrice: 35000 },
    "Transient Pennon":            { extremePrice: 35000, extremeSoloPrice: 35000 },
    "Swiftness Ring":              { extremePrices: [80, 80, 80, 1500], extremeSoloPrices: [80, 80, 80, 1250] },
    "Magnified Levels":            { extremePrices: [3000, 9000, 15000, 25000], extremeSoloPrices: [3000, 9000, 15000, 20000] },

    "Test1":       { extremePrice: 1,  extremeSoloPrice: 2  },
    "Test2":       { extremePrices: [1, 2], extremeSoloPrices: [3, 4] },
};

const upgradesList = [
    { name:"Adrenaline",                      price:50,              soloPrice:50,          icon:"assets/Adrenaline.png", id:"opt-adrenaline", level:3, currentStack:0 },
    { name:"Business License",                prices:[75, 160, 1400],                              soloPrices:[75, 150, 1250],                          icon:"assets/Business_License.png", level:3, currentStack:0, maxStack:3 },
    { name:"Defuse Kit",                      price:30,              soloPrice:30,          icon:"assets/Defuse_Kit.png", level:3, currentStack:0 },
    { name:"Paycheck",                        price:55,              soloPrice:55,          icon:"assets/Paycheck.png", level:3, currentStack:0 },
    { name:"Swiftness Ring",                  prices:[80, 80, 80, 1250],                           soloPrices:[80, 80, 80, 1000],                       icon:"assets/Swiftness_Ring.png", level:3, currentStack:0, maxStack:4 },
    { name:"Radar",                           price:150,             soloPrice:125,         icon:"assets/Radar.png", level:5, currentStack:0 },
    { name:"Better Jump Pads",                price:50,              soloPrice:50,          icon:"assets/Better_Jump_Pads.png", level:5, currentStack:0 },
    { name:"Double Jump",                     price:150,             soloPrice:150,         icon:"assets/Double_Jump.png", level:5, currentStack:0 },
    { name:"Grapple Points",                  price:100,             soloPrice:100,         icon:"assets/Grapple_Points.png", level:5, currentStack:0 },
    { name:"Tria Orb",                        price:100,             soloPrice:100,         icon:"assets/Tria_Orb.png", level:5, currentStack:0 },
    { name:"Medal",                           price:100,             soloPrice:100,         icon:"assets/Medal.png", level:5, currentStack:0 },
    { name:"Advanced Gravity Coil",           price:650,             soloPrice:600,         icon:"assets/Advanced_Gravity_Coil.png", level:8, currentStack:0 },
    { name:"Ice Skates",                      price:350,             soloPrice:325,         icon:"assets/Ice_Skates.png", level:8, currentStack:0 },
    { name:"Fanny Pack",                      price:300,             soloPrice:275,         icon:"assets/Fanny_Pack.png", level:8, currentStack:0 },
    { name:"Grace Wings",                     price:300,             soloPrice:200,         icon:"assets/Grace_Wings.png", level:8, currentStack:0 },
    { name:"Helmet",                          price:350,             soloPrice:325,         icon:"assets/Helmet.png", level:8, currentStack:0 },
    { name:"Pocket Bell",                     price:300,             soloPrice:300,         icon:"assets/Pocket_Bell.png", level:8, currentStack:0 },
    { name:"Last Robloxian Standing",         price:300,             soloPrice:300,         icon:"assets/Last_Robloxian_Standing.png", id:"opt-lrs", level:8, currentStack:0 },
    { name:"Radar Module : Altars",           price:300,             soloPrice:250,         icon:"assets/Radar_Module_Altars.png", level:8, currentStack:0 },
    { name:"Radar Module : Tripmines",        price:350,             soloPrice:300,         icon:"assets/Radar_Module_Tripmines.png", level:8, currentStack:0 },
    { name:"Radar Module : Enemies",          price:200,             soloPrice:150,         icon:"assets/Radar_Module_Enemies.png", level:8, currentStack:0 },
    { name:"Altar Boons",                     prices:[525, 1250, 3000],                            soloPrices:[525, 1001, 2750],                        icon:"assets/Altar_Boons.png", level:8, currentStack:0, maxStack:3 },
    { name:"Health Insurance",                price:500,             soloPrice:500,         icon:"assets/Health_Insurance.png", level:8, currentStack:0 },
    { name:"Spring Shoes",                    price:100,             soloPrice:100,         icon:"assets/Spring_Shoes.png", level:8, currentStack:0 },
    { name:"Star Marts",                      price:450,             soloPrice:400,         icon:"assets/Star_Marts.png", level:8, currentStack:0 },
    { name:"More Altars",                     price:500,             soloPrice:450,         icon:"assets/More_Altars.png", level:10, currentStack:0 },
    { name:"Birthday Pony",                   price:350,             soloPrice:300,         icon:"assets/Birthday_Pony.png", level:10, currentStack:0 },
    { name:"Soul Tracers",                    price:1000,            soloPrice:600,         icon:"assets/Soul_Tracers.png", level:12, currentStack:0 },
    { name:"Ninja Belt",                      price:600,             soloPrice:500,         icon:"assets/Ninja_Belt.png", level:13, currentStack:0 },
    { name:"Subspacial Barrier",              prices:[750, 1500, 3000],                            soloPrices:[500, 1250, 2750],                        icon:"assets/Subspacial_Barrier.png", level:13, currentStack:0, maxStack:3 },
    { name:"Large Grapple Points",            price:400,             soloPrice:300,         icon:"assets/Large_Grapple_Points.png", level:13, currentStack:0 },
    { name:"Gift Magnet",                     prices:[1500, 2000, 2500, 6000],                     soloPrices:[1250, 1750, 2250, 5000],                 icon:"assets/Gift_Magnet.png", level:15, currentStack:0, maxStack:4 },
    { name:"Matrix Tetrahedron",              price:2250,            soloPrice:2000,        icon:"assets/Matrix_Tetrahedron.png", level:15, currentStack:0 },
    { name:"Shield",                          price:4000,            soloPrice:2000,        icon:"assets/Shield.png", level:15, currentStack:0 },
    { name:"Sport Shoes",                     price:1350,            soloPrice:1250,        icon:"assets/Sport_Shoes.png", level:15, currentStack:0 },
    { name:"Shark Tail",                      price:1200,            soloPrice:1000,        icon:"assets/Shark_Tail.png", level:15, currentStack:0 },
    { name:"Aggro Magnet",                    price:2800,            soloPrice:2500,        icon:"assets/Aggro_Magnet.png", level:15, currentStack:0 },
    { name:"Debuff Magnet",                   price:2800,            soloPrice:2500,        icon:"assets/Debuff_Magnet.png", level:15, currentStack:0 },
    { name:"Propeller Hat",                   price:750,             soloPrice:650,         icon:"assets/Propeller_Hat.png", level:15, currentStack:0 },
    { name:"Radar Module : Instruments",      price:850,             soloPrice:750,         icon:"assets/Radar_Module_Instruments.png", level:18, currentStack:0 },
    { name:"Panic Necklace",                  price:2500,            soloPrice:2250,        icon:"assets/Panic_Necklace.png", level:18, currentStack:0 },
    { name:"Fleeting Fate",                   price:2500,            soloPrice:2250,        icon:"assets/Fleeting_Fate.png", level:18, currentStack:0 },
    { name:"Drowned Ægis",                    price:6000,            soloPrice:5499,        icon:"assets/DrownedAegis.png", level:20, currentStack:0 },
    { name:"Miniature Hourglass",             price:3000,            soloPrice:3000,        icon:"assets/Miniature_Hourglass.png", level:20, currentStack:0 },
    { name:"Gift Idol",                       prices:[3500, 7000, 10500, 14000, 17500, 25000],      soloPrices:[3000, 6000, 9000, 12000, 15000, 22500],   icon:"assets/Gift_Idol.png", level:20, currentStack:0, maxStack:6 },
    { name:"Shadow Cloak",                    price:2500,            soloPrice:2000,        icon:"assets/Shadow_Cloak.png", level:20, currentStack:0 },
    { name:"Jet Boosters",                    price:6750,            soloPrice:6000,        icon:"assets/Jet_Boosters.png", level:25, currentStack:0 },
    { name:"Quixotic Wing",                   price:30000,           soloPrice:30000,       icon:"assets/Quixotic_Wing.png", level:30, currentStack:0 },
    { name:"Transient Pennon",                price:30000,           soloPrice:30000,       icon:"assets/Transient_Pennon.png", level:30, currentStack:0 },
    { name:"Magnified Levels",                prices:[3000, 9000, 15000, 20000],                    soloPrices:[2000, 5000, 12500, 17500],                icon:"assets/Magnified_Levels.png", level:30, currentStack:0, maxStack:4 },
];

let currentDifficulty = 'standard';
let currentMode       = 'solo';
let playerCount       = 1;
const discountActive  = { nothing: false, wish: false };

let buyMode       = false;
let gifts         = 0;
let playerLevel   = Price_Values.startLevel;
let purchaseOrder = [];
let justBought    = false;
let lastLogKey    = null;
let searchTerm    = '';
let toastTimer;

const clamp     = (n, min, max) => Math.max(min, Math.min(max, n));
const maxOf     = item => item.maxStack || 1;
const stackOf   = item => buyMode ? (item.bought || 0) : item.currentStack;
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
    for (let s = 1; s <= (item.bought || 0); s++) t += computePrice(item, s);
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
            const owned = item.bought || 0;
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

    const gap = 10, minRow = 54, defRow = 72, minCol = 215;
    const top   = grid.getBoundingClientRect().top + window.scrollY;
    const avail = window.innerHeight - top - 40;
    const maxCols = Math.max(1, Math.floor((grid.clientWidth + gap) / (minCol + gap)));

    let cols = Math.min(4, maxCols);
    while (cols < maxCols && Math.ceil(n / cols) * (minRow + gap) - gap > avail) cols++;
    const rows = Math.ceil(n / cols);

    const need = rows * (minRow + gap) - gap;
    const nice = rows * (defRow + gap) - gap;
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.height = Math.max(need, Math.min(avail, nice)) + 'px';
}


function clickUpgrade(index, el) {
    if (el.classList.contains('disabled') || el.classList.contains('casual-hidden') || el.classList.contains('extreme-hidden') || el.classList.contains('buying')) return;
    const item = upgradesList[index];
    const max  = maxOf(item);
    let soldNow = false;

    if (buyMode) {
        const owned = item.bought || 0;
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
        item.bought = owned + 1;
        purchaseOrder.push({ index, stack: owned + 1 });
        justBought = true;
        soldNow = item.bought >= max;
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
    purchaseOrder = purchaseOrder.filter(p => p.stack <= (upgradesList[p.index].bought || 0));
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
    upgradesList.forEach(item => { item.bought = 0; });
    purchaseOrder = [];
    refreshAllItems();
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
    const count = `${entries.length} ${entries.length === 1 ? 'Item' : 'Items'}`;
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
    const hadPurchases = purchaseOrder.length > 0;
    currentMode = mode;
    const { min, typedMax } = Price_Values.modeLimits[mode];
    playerCount = clamp(playerCount, min, typedMax);
    if (changed) {
        resetPurchases();
        if (hadPurchases) toast('Spending log cleared for the new mode');
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
    drawer.insertAdjacentHTML('beforeend', `<div class="input-group purchases-group">
        <label class="purchases-label">Spending Log
            <span class="purchases-actions">
                <button class="undo-btn" type="button" onclick="undoPurchase()" disabled>Undo</button>
                <span class="curse-pill purchase-count">0 Items</span>
            </span>
        </label>
        <div class="purchase-list"></div>
        <div class="purchase-summary"><span>Gifts Spent</span><span class="purchase-spent">0</span></div>
    </div>`);
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
    buildDrawer();
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
