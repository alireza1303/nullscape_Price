const universalAchievements = [
  { name: "500 marts", color: "#6ea5f7" },
  { name: "Bell Blast", color: "#6ea5f7" },
  { name: "Big Mart", color: "#6ea5f7" },
  { name: "comedic slipping sfx", color: "#fca3a3" },
  { name: "Communication Win", color: "#fcd19f" },
  { name: "I Hate YOU", color: "#e8e8e8" },
  { name: "Financial Failure", color: "#d2e5e8" },
  { name: "We Were Right There", color: "#00ffff" },
  { name: "Unfortunate Timing", color: "#ccc" },
  { name: "The Best Patch 5 addition", color: "#d2e5e8" },
  { name: "Mart Slide", color: "#ccf0f2" },
  { name: "Level 5", color: "#fca3a3" },
  { name: "Im All in", color: "#cf93bd" },
  { name: "Lap2", color: "#ffe6ad" },
  { name: "I'm Him.", color: "#ffe6ad" },
  { name: "I'm Taking you down with me", color: "#ff00ff" },
  { name: "Chaos", color: "#fcd6d6" },
  { name: "Ich hasse es", color: "#ccc" },

  { name: "Crash Out incoming", color: "#424242" },
  { name: "Economic Recession", color: "#c8e6c9" },
  { name: "ForensicDuty", color: "#ffcdd2" },
  { name: "HighriseEinstein", color: "#9575cd" },
  { name: "Conga Line", color: "#673ab7" },
  { name: "Infinite Feedback Loop", color: "#ede7f6" },
  { name: "It Goes in the Square Hole", color: "#fff9c4" },
  { name: "Level 12", color: "#e57373" },
  { name: "Level 25", color: "#cc0000" },
  { name: "So You don't see", color: "#f5f5f5" },
  { name: "Near Death Experinece", color: "#e0e0e0" },
  { name: "The Grand Reveal", color: "#eceff1" },
  { name: "When Life Gives You cadnace", color: "#b0bec5" },
  { name: "Mart And Bell", color: "#cfd8dc" },
  { name: "It's Time", color: "#37474f" },

  { name: "How Did We Get here", color: "#a5c4cc" },
  { name: "Random Guy at bbq", color: "#f7cc4d" },
  { name: "OverLoad", color: "#311b92" },
  { name: "The Destroyer", color: "#7e57c2" },
  { name: "Jackpot", color: "#ffff00" },
  { name: "Ticket to zoo", color: "#a1c7ed" },
  { name: "I Guess Bro", color: "#d1c4e9" },

  { name: "Blossom", color: "#ce93d8" },
  { name: "Chaos Demon", color: "#ef9a9a" },
  { name: "Middle Lane", color: "#ffcc80" },
  { name: "Level 50!", color: "#b71c1c" },
  { name: "Level 50 (Party)", color: "#880e4f" }
];

let currentMode = null;
let userProgress = JSON.parse(localStorage.getItem('nullscape_achievements')) || { Casual: {}, Standard: {}, Extreme: {} };

function hexToRgba(hex, alpha) {
  hex = hex.replace('#', '');
  if(hex.length === 3) hex = hex.split('').map(s => s+s).join('');
  let r = parseInt(hex.substring(0,2), 16);
  let g = parseInt(hex.substring(2,4), 16);
  let b = parseInt(hex.substring(4,6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function handleModeClick(mode) {
  if (currentMode === mode) {
    resetToMenu();
  } else {
    selectMode(mode);
  }
}

function selectMode(mode) {
  currentMode = mode;
  document.getElementById('achievementSearch').value = '';
  
  document.body.className = `mode-${mode.toLowerCase()}`;

  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  
  document.getElementById('controlPanel').classList.add('locked');
  document.getElementById('progressContainer').classList.add('visible');
  document.getElementById('searchContainer').classList.add('visible');
  
  renderAchievements(mode);
}

function resetToMenu() {
  currentMode = null;
  document.getElementById('achievementSearch').value = '';
  
  document.body.className = '';
  document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('controlPanel').classList.remove('locked');
  document.getElementById('progressContainer').classList.remove('visible');
  document.getElementById('searchContainer').classList.remove('visible');
  
  const grid = document.getElementById('achievementsGrid');
  grid.classList.remove('visible');
  setTimeout(() => { if(!currentMode) grid.innerHTML = ''; }, 400);
}

function renderAchievements(mode) {
  const grid = document.getElementById('achievementsGrid');
  grid.innerHTML = '';
  grid.classList.remove('visible');
  
  const targetAchievements = [...universalAchievements];
  
  setTimeout(() => {
    if (currentMode !== mode) return;
    
    targetAchievements.forEach((ach, index) => {
      const isCompleted = userProgress[mode]?.[ach.name] || false;
      const card = document.createElement('div');
      card.className = `achievement-card ${isCompleted ? 'completed' : ''}`;
      card.setAttribute('data-name', ach.name.toLowerCase());
      
      card.style.animationDelay = `${index * 12}ms`;
      
      card.style.setProperty('--card-theme', ach.color);
      card.style.setProperty('--card-glow', hexToRgba(ach.color, 0.2));
      card.style.setProperty('--card-bg-theme', hexToRgba(ach.color, 0.08));
      
      card.onclick = () => toggleAchievement(ach.name, card);
      
      card.innerHTML = `<div class="name">${ach.name}</div>`;
      grid.appendChild(card);
    });
    grid.classList.add('visible');
    updateProgressBar();
    filterAchievements();
  }, 50);
}

function filterAchievements() {
  const query = document.getElementById('achievementSearch').value.toLowerCase().trim();
  const cards = document.querySelectorAll('.achievement-card');
  
  cards.forEach(card => {
    const name = card.getAttribute('data-name');
    if (name.includes(query)) {
      card.style.display = 'flex';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0) scale(1)';
    } else {
      card.style.display = 'none';
    }
  });
}

function toggleAchievement(name, cardElement) {
  if (!currentMode) return;
  
  const newState = !userProgress[currentMode][name];
  userProgress[currentMode][name] = newState;
  
  cardElement.classList.toggle('completed', newState);
  updateProgressBar();
  
  localStorage.setItem('nullscape_achievements', JSON.stringify(userProgress));
}

function updateProgressBar() {
  if (!currentMode) return;
  
  const total = universalAchievements.length;
  const completedCount = universalAchievements.filter(ach => userProgress[currentMode][ach.name]).length;
  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  
  document.getElementById('progressPercentText').textContent = `${percentage}%`;
  document.getElementById('progressFractionText').textContent = `${completedCount} / ${total}`;
  
  document.getElementById('barFill').style.width = `${percentage}%`;
}

function resetProgress() {
  if (!currentMode) return;
  
  const confirmReset = confirm(`Are you sure you want to reset all achievement progress for the ${currentMode} profile?`);
  if (confirmReset) {
    userProgress[currentMode] = {};
    localStorage.setItem('nullscape_achievements', JSON.stringify(userProgress));
    
    renderAchievements(currentMode);
    
    const resetBtn = document.querySelector('.reset-btn');
    const oldText = resetBtn.textContent;
    resetBtn.textContent = "Cleared!";
    resetBtn.style.background = "#eb5757";
    resetBtn.style.color = "#fff";
    
    setTimeout(() => {
      resetBtn.textContent = oldText;
      resetBtn.style.background = "rgba(235, 87, 87, 0.1)";
      resetBtn.style.color = "#eb5757";
    }, 1200);
  }
}

particlesJS("particles-js", {
    "particles": { "number": { "value": 45 }, "color": { "value": "#c285ff" }, "opacity": { "value": 0.3 }, "size": { "value": 2.5 }, "move": { "enable": true, "speed": 0.6 } }
});