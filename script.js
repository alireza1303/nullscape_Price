const upgradesList = [
    { name: "Adrenaline", price: 50, icon: "Adrenaline.png", id: "opt-adrenaline" },
    { name: "Business License", price: 75, icon: "Business_License.png" },
    { name: "Defuse Kit", price: 30, icon: "Defuse_Kit.png" },
    { name: "Paycheck", price: 55, icon: "Paycheck.png" },
    { name: "Swiftness Ring", price: 80, icon: "Swiftness_Ring.png" },
    { name: "Enemy ESP", price: 100, icon: "Enemy_ESP.png" },
    { name: "Better Gift Arrow", price: 80, icon: "Better_Gift_Arrow.png" },
    { name: "Better Jump Pads", price: 50, icon: "Better_Jump_Pads.png" },
    { name: "Double Jump", price: 100, icon: "Double_Jump.png" },
    { name: "Grace Wings", price: 250, icon: "Grace_Wings.png", id: "opt-grace" },
    { name: "Grapple Points", price: 100, icon: "Grapple_Points.png" },
    { name: "Last Robloxian Standing", price: 200, icon: "Last_Robloxian_Standing.png", id: "opt-lrs" },
    { name: "Pocket Bell", price: 150, icon: "Pocket_Bell.png" },
    { name: "Tripmine ESP", price: 400, icon: "Tripmine_ESP.png" },
    { name: "Advanced Coil", price: 600, icon: "Advanced_Gravity_Coil.png" },
    { name: "Ice Skates", price: 400, icon: "Ice_Skates.png" },
    { name: "Helmet", price: 600, icon: "Helmet.png" },
    { name: "More Altars", price: 600, icon: "More_Altars.png" },
    { name: "Barrier", price: 1000, icon: "Subspacial_Barrier.png", id: "opt-barrier" },
    { name: "Ninja Belt", price: 500, icon: "Ninja_Belt.png", id: "opt-ninja" },
    { name: "Gift Magnet", price: 2000, icon: "Gift_Magnet.png" },
    { name: "Matrix", price: 2500, icon: "Matrix_Tetrahedron.png" },
    { name: "Shield", price: 3000, icon: "Shield.png", id: "opt-shield" },
    { name: "Sport Shoes", price: 1200, icon: "Sport_Shoes.png" },
    { name: "Real Wings", price: 25000, icon: "Real_Wings.png" }
];

const soloPrices = { "opt-grace": 200, "opt-barrier": 200, "opt-ninja": 300, "opt-shield": 1000 };
const enemiesList = ["Mart", "Baby", "NIL", "Voidbreaker", "Springer", "Bell", "Voidbound Guardian", "Skinwalker", "Voidbound Baby", "???", "Telefragger", "Flesh", "Guardian", "Cadence", "ICBM"].map(n => ({name: n, icon: n.replace("?", "Unknown")+".png"}));

let isTrapMode = false;

function renderGrid() {
    const grid = document.getElementById('mainGrid');
    grid.innerHTML = '';
    if (isTrapMode) {
        enemiesList.forEach(item => {
            const label = document.createElement('label');
            label.innerHTML = `
                <input type="number" class="enemy-count" value="0" min="0" oninput="calculate()">
                <img src="${item.icon}" class="custom-icon" onerror="this.style.display='none'">
                <span class="enemy-name-text">${item.name}</span>
            `;
            grid.appendChild(label);
        });
    } else {
        upgradesList.forEach(item => {
            const label = document.createElement('label');
            label.id = item.id || '';
            label.innerHTML = `
                <input type="checkbox" class="option" data-price="${item.price}" onchange="calculate()">
                <img src="${item.icon}" class="custom-icon" onerror="this.style.display='none'">
                <span>${item.name} <small class="price-val"></small></span>
            `;
            grid.appendChild(label);
        });
    }
    handlePlayerRules();
}

function toggleTrapMode() {
    isTrapMode = !isTrapMode;
    document.body.classList.toggle('trap-active');
    document.getElementById('mainTitle').textContent = isTrapMode ? "Trap Card Calculator" : "Nullscape Price Calculator";
    document.getElementById('gridTitle').textContent = isTrapMode ? "Current Run Enemies" : "Upgrades";
    document.getElementById('toggleIcon').src = isTrapMode ? "Defuse_Kit.png" : "Trap-Card.png";
    
    document.getElementById('player-group').style.display = isTrapMode ? "none" : "block";
    document.getElementById('upgrade-results').style.display = isTrapMode ? "none" : "block";
    document.getElementById('trap-results').style.display = isTrapMode ? "block" : "none";
    
    renderGrid();
}

function handlePlayerRules() {
    const players = Math.min(20, Math.max(1, parseInt(document.getElementById("players").value) || 1));
    const modeSelect = document.getElementById("mode");
    
    if (!isTrapMode) {
        modeSelect.disabled = (players === 1);
        if(players === 1) modeSelect.value = "1";
    } else {
        modeSelect.disabled = false;
    }
    
    if (!isTrapMode) {
        document.querySelectorAll(".upgrades-grid label").forEach(label => {
            const checkbox = label.querySelector('input');
            const priceSpan = label.querySelector('.price-val');
            const base = Number(checkbox.dataset.price);
            let displayPrice = (players === 1 && soloPrices[label.id]) ? soloPrices[label.id] : base;
            priceSpan.textContent = `(${displayPrice})`;
        });
    }
    calculate();
}

function calculate() {
    const modeVal = parseFloat(document.getElementById("mode").value);
    if (isTrapMode) {
        let limit = (modeVal > 1) ? 16 : 8;
        let used = 0;
        const list = document.getElementById('trapList');
        list.innerHTML = '';

        document.querySelectorAll(".enemy-count").forEach(input => {
            let count = parseInt(input.value) || 0;
            let name = input.parentElement.querySelector('.enemy-name-text').textContent;
            let added = 0;
            if (used < limit && count > 0) {
                added = Math.min(count, limit - used);
                used += added;
            }
            if (count > 0) {
                const li = document.createElement('li');
                li.innerHTML = `${name} <span>${count + added}</span>`;
                list.appendChild(li);
            }
        });
    } else {
        let players = parseInt(document.getElementById("players").value) || 1;
        let total = 0;
        const sqrtP = Math.sqrt(players);
        document.querySelectorAll(".option:checked").forEach(opt => {
            let price = (players === 1 && soloPrices[opt.parentElement.id]) ? soloPrices[opt.parentElement.id] : Math.ceil(Number(opt.dataset.price) * sqrtP);
            total += Math.ceil(price * modeVal);
        });
        document.getElementById("result").textContent = "Total: " + total.toLocaleString();
    }
}

function clearAll() { 
    document.querySelectorAll(isTrapMode ? ".enemy-count" : ".option").forEach(i => isTrapMode ? i.value = 0 : i.checked = false);
    calculate(); 
}

window.onload = renderGrid;
