const upgradesList = [
 { name:"Adrenaline", price:50, icon:"assets/Adrenaline.png", id:"opt-adrenaline" },
 { name:"Business License", price:75, icon:"assets/Business_License.png" },
 { name:"Defuse Kit", price:30, icon:"assets/Defuse_Kit.png" },
 { name:"Paycheck", price:55, icon:"assets/Paycheck.png" },
 { name:"Swiftness Ring", price:80, icon:"assets/Swiftness_Ring.png" },
 { name:"Enemy ESP", price:100, icon:"assets/Enemy_ESP.png" },
 { name:"Better Gift Arrow", price:80, icon:"assets/Better_Gift_Arrow.png" },
 { name:"Better Jump Pads", price:50, icon:"assets/Better_Jump_Pads.png" },
 { name:"Double Jump", price:100, icon:"assets/Double_Jump.png" },
 { name:"Grace Wings", price:250, icon:"assets/Grace_Wings.png", id:"opt-grace" },
 { name:"Grapple Points", price:100, icon:"assets/Grapple_Points.png" },
 { name:"LRS", price:200, icon:"assets/Last_Robloxian_Standing.png", id:"opt-lrs" },
 { name:"Pocket Bell", price:150, icon:"assets/Pocket_Bell.png" },
 { name:"Tripmine ESP", price:400, icon:"assets/Tripmine_ESP.png" },
 { name:"Advanced Coil", price:600, icon:"assets/Advanced_Gravity_Coil.png" },
 { name:"Ice Skates", price:400, icon:"assets/Ice_Skates.png" },
 { name:"Helmet", price:600, icon:"assets/Helmet.png" },
 { name:"More Altars", price:600, icon:"assets/More_Altars.png" },
 { name:"Barrier", price:1000, icon:"assets/Subspacial_Barrier.png", id:"opt-barrier" },
 { name:"Ninja Belt", price:500, icon:"assets/Ninja_Belt.png", id:"opt-ninja" },
 { name:"Gift Magnet", price:2000, icon:"assets/Gift_Magnet.png" },
 { name:"Matrix", price:2500, icon:"assets/Matrix_Tetrahedron.png" },
 { name:"Shield", price:3000, icon:"assets/Shield.png", id:"opt-shield" },
 { name:"Sport Shoes", price:1200, icon:"assets/Sport_Shoes.png" },
 { name:"Real Wings", price:25000, icon:"assets/Real_Wings.png" }
];

const soloPrices = {
  "opt-grace": 200,
  "opt-barrier": 200,
  "opt-ninja": 300,
  "opt-shield": 1000
};

const enemiesList = [
 { name:"Mart", icon:"assets/Mart.png" },
 { name:"Baby", icon:"assets/baby.png" },
 { name:"NIL", icon:"assets/nil.png" },
 { name:"Voidbreaker", icon:"assets/voidbreaker.png" },
 { name:"Springer", icon:"assets/springer.png" },
 { name:"Bell", icon:"assets/bell.png" },
 { name:"Voidbound Guardian", icon:"assets/vbg.png" },
 { name:"Skinwalker", icon:"assets/skinwalker.png" },
 { name:"Voidbound Baby", icon:"assets/voidBaby.png" },
 { name:"???", icon:"assets/random.png" },
 { name:"Telefragger", icon:"assets/tele.png" },
 { name:"Flesh", icon:"assets/flesh.png" },
 { name:"Guardian", icon:"assets/guardian.png" },
 { name:"Cadence", icon:"assets/Cadance.png" },
 { name:"ICBM", icon:"assets/icbm.png" }
];

let isTrapMode = false;

function toggleMobileList() {
  if (window.innerWidth <= 900) {
    document.getElementById("trapList").classList.toggle("visible");
    document.getElementById("collapsible-title").classList.toggle("active");
  }
}

function renderGrid() {
  const grid = document.getElementById("mainGrid");
  grid.innerHTML = "";

  if (isTrapMode) {
    enemiesList.forEach(enemy => {
      const label = document.createElement("label");
      label.innerHTML = `
        <input type="number" class="enemy-count" min="0" value="0" oninput="calculate()">
        <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">
          <img src="${enemy.icon}" class="custom-icon" onerror="this.style.display='none'">
          <span class="enemy-name-text">${enemy.name}</span>
        </div>
      `;
      grid.appendChild(label);
    });
  } else {
    upgradesList.forEach(upg => {
      const label = document.createElement("label");
      label.id = upg.id || "";
      label.innerHTML = `
        <input type="checkbox" class="option" data-price="${upg.price}" onchange="calculate()">
        <img src="${upg.icon}" class="custom-icon" onerror="this.style.display='none'">
        <span>${upg.name} <small class="price-val"></small></span>
      `;
      grid.appendChild(label);
    });
  }

  handlePlayerRules();
}

function toggleTrapMode() {
  isTrapMode = !isTrapMode;

  document.body.classList.toggle("trap-active");
  document.getElementById("mainTitle").textContent =
    isTrapMode ? "Nullscape Trap Card Calculator" : "Nullscape Price Calculator";
  document.getElementById("gridTitle").textContent =
    isTrapMode ? "Current Run Enemies" : "Upgrades";
  document.getElementById("toggleIcon").src =
    isTrapMode ? "assets/Defuse_Kit.png" : "assets/Trap-Card.png";

  document.getElementById("player-group").style.display = isTrapMode ? "none" : "block";
  document.getElementById("upgrade-results").style.display = isTrapMode ? "none" : "block";
  document.getElementById("trap-results").style.display = isTrapMode ? "block" : "none";

  renderGrid();
}

function handlePlayerRules() {
  const pInput = document.getElementById("players");
  let players = Math.min(20, Math.max(1, parseInt(pInput.value) || 1));
  pInput.value = players;

  const modeSelect = document.getElementById("mode");

  if (!isTrapMode) {
    modeSelect.disabled = players === 1;
    if (players === 1) modeSelect.value = "1";

    document.querySelectorAll(".upgrades-grid label").forEach(label => {
      const checkbox = label.querySelector("input");
      const priceSpan = label.querySelector(".price-val");
      const base = Number(checkbox.dataset.price);

      const displayPrice =
        players === 1 && soloPrices[label.id]
          ? soloPrices[label.id]
          : base;

      priceSpan.textContent = `(${displayPrice})`;

      if (label.id === "opt-adrenaline") {
        checkbox.disabled = players > 1;
        if (players > 1) checkbox.checked = false;
      }

      if (label.id === "opt-lrs") {
        checkbox.disabled = players < 3;
        if (players < 3) checkbox.checked = false;
      }
    });
  }

  calculate();
}

function calculate() {
  const modeValue = parseFloat(document.getElementById("mode").value);

  if (isTrapMode) {
    let limit = modeValue > 1 ? 16 : 8;
    let used = 0;

    const list = document.getElementById("trapList");
    list.innerHTML = "";

    document.querySelectorAll(".enemy-count").forEach(input => {
      const count = parseInt(input.value) || 0;
      const name = input.parentElement.querySelector(".enemy-name-text").textContent;

      let added = 0;
      if (used < limit && count > 0) {
        added = Math.min(count, limit - used);
        used += added;
      }

      if (count > 0) {
        const li = document.createElement("li");
        li.innerHTML = `${name} <span>${count + added}</span>`;
        list.appendChild(li);
      }
    });

  } else {
    const players = parseInt(document.getElementById("players").value) || 1;
    const sqrtP = Math.sqrt(players);
    let total = 0;

    document.querySelectorAll(".option:checked").forEach(opt => {
      const base = Number(opt.dataset.price);
      const price =
        players === 1 && soloPrices[opt.parentElement.id]
          ? soloPrices[opt.parentElement.id]
          : Math.ceil(base * sqrtP);

      total += Math.ceil(price * modeValue);
    });

    document.getElementById("result").textContent =
      "Total: " + total.toLocaleString();
  }
}

function clearAll() {
  document.querySelectorAll(
    isTrapMode ? ".enemy-count" : ".option"
  ).forEach(el => {
    if (isTrapMode) el.value = 0;
    else el.checked = false;
  });

  calculate();
}

window.onload = renderGrid;
