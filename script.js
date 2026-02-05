const upgradesList = [
  {name:"Adrenaline",price:50,icon:"Adrenaline.png"},
  {name:"Business License",price:75,icon:"Business_License.png"},
  {name:"Defuse Kit",price:30,icon:"Defuse_Kit.png"},
  {name:"Paycheck",price:55,icon:"Paycheck.png"},
  {name:"Swiftness Ring",price:80,icon:"Swiftness_Ring.png"},
  {name:"Enemy ESP",price:100,icon:"Enemy_ESP.png"},
  {name:"Better Gift Arrow",price:80,icon:"Better_Gift_Arrow.png"},
  {name:"Better Jump Pads",price:50,icon:"Better_Jump_Pads.png"},
  {name:"Double Jump",price:100,icon:"Double_Jump.png"},
  {name:"Grace Wings",price:250,icon:"Grace_Wings.png",id:"opt-grace"},
  {name:"Grapple Points",price:100,icon:"Grapple_Points.png"},
  {name:"Last Robloxian Standing",price:200,icon:"Last_Robloxian_Standing.png"},
  {name:"Pocket Bell",price:150,icon:"Pocket_Bell.png"},
  {name:"Tripmine ESP",price:400,icon:"Tripmine_ESP.png"},
  {name:"Advanced Coil",price:600,icon:"Advanced_Gravity_Coil.png"},
  {name:"Ice Skates",price:400,icon:"Ice_Skates.png"},
  {name:"Helmet",price:600,icon:"Helmet.png"},
  {name:"More Altars",price:600,icon:"More_Altars.png"},
  {name:"Barrier",price:1000,icon:"Subspacial_Barrier.png",id:"opt-barrier"},
  {name:"Ninja Belt",price:500,icon:"Ninja_Belt.png",id:"opt-ninja"},
  {name:"Gift Magnet",price:2000,icon:"Gift_Magnet.png"},
  {name:"Matrix",price:2500,icon:"Matrix_Tetrahedron.png"},
  {name:"Shield",price:3000,icon:"Shield.png",id:"opt-shield"},
  {name:"Sport Shoes",price:1200,icon:"Sport_Shoes.png"},
  {name:"Real Wings",price:25000,icon:"Real_Wings.png"}
];

const soloPrices = {
  "opt-grace":200,
  "opt-barrier":200,
  "opt-ninja":300,
  "opt-shield":1000
};

const enemiesList = [
  "Mart","Baby","NIL","Voidbreaker","Springer","Bell",
  "Voidbound Guardian","Skinwalker","Voidbound Baby","???",
  "Telefragger","Flesh","Guardian","Cadence","ICBM"
].map(n=>({name:n,icon:n.replace("?","Unknown")+".png"}));

let isTrapMode=false;

function renderGrid(){
  const grid=document.getElementById("mainGrid");
  grid.innerHTML="";

  if(isTrapMode){
    enemiesList.forEach(e=>{
      grid.innerHTML+=`
      <label>
        <input class="enemy-count" type="number" value="0" min="0" oninput="calculate()">
        <img src="${e.icon}" class="custom-icon" onerror="this.style.display='none'">
        <span class="enemy-name-text">${e.name}</span>
      </label>`;
    });
  } else {
    upgradesList.forEach(u=>{
      grid.innerHTML+=`
      <label id="${u.id||""}">
        <input type="checkbox" class="option" data-price="${u.price}" onchange="calculate()">
        <img src="${u.icon}" class="custom-icon" onerror="this.style.display='none'">
        <span>${u.name} <small class="price-val"></small></span>
      </label>`;
    });
  }
  handlePlayerRules();
}

function toggleTrapMode(){
  isTrapMode=!isTrapMode;
  document.body.classList.toggle("trap-active");
  document.getElementById("mainTitle").textContent =
    isTrapMode ? "Nullscape Trap Card Calculator" : "Nullscape Price Calculator";
  document.getElementById("gridTitle").textContent =
    isTrapMode ? "Current Run Enemies" : "Upgrades";
  document.getElementById("toggleIcon").src =
    isTrapMode ? "Defuse_Kit.png" : "Trap-Card.png";

  document.getElementById("player-group").style.display = isTrapMode?"none":"block";
  document.getElementById("upgrade-results").style.display = isTrapMode?"none":"block";
  document.getElementById("trap-results").style.display = isTrapMode?"block":"none";

  renderGrid();
}

function handlePlayerRules(){
  const players=Math.max(1,Math.min(20,parseInt(players.value)||1));
  players.value=players;
  mode.disabled=players===1;
  if(players===1) mode.value="1";

  document.querySelectorAll(".upgrades-grid label").forEach(l=>{
    const cb=l.querySelector("input");
    const span=l.querySelector(".price-val");
    if(!cb) return;
    const base=Number(cb.dataset.price);
    span.textContent=`(${players===1&&soloPrices[l.id]?soloPrices[l.id]:base})`;
  });
  calculate();
}

function calculate(){
  const m=parseFloat(mode.value);

  if(isTrapMode){
    const limit=m>1?16:8;
    let used=0;
    trapList.innerHTML="";
    document.querySelectorAll(".enemy-count").forEach(i=>{
      const c=parseInt(i.value)||0;
      if(c<=0) return;
      let add=Math.min(c,limit-used);
      used+=add;
      trapList.innerHTML+=`<li>${i.nextElementSibling.nextElementSibling.textContent}<span>${c+add}</span></li>`;
    });
  } else {
    let total=0;
    const p=parseInt(players.value)||1;
    const s=Math.sqrt(p);
    document.querySelectorAll(".option:checked").forEach(o=>{
      const base=Number(o.dataset.price);
      const solo=soloPrices[o.parentElement.id];
      const price=p===1&&solo?solo:Math.ceil(base*s);
      total+=Math.ceil(price*m);
    });
    result.textContent="Total: "+total.toLocaleString();
  }
}

function clearAll(){
  document.querySelectorAll(isTrapMode?".enemy-count":".option")
    .forEach(e=>isTrapMode?e.value=0:e.checked=false);
  calculate();
}

window.onload=renderGrid;
