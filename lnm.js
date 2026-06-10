const ta = document.getElementById('inputText');
const preview = document.getElementById('preview');
const outputBox = document.getElementById('outputBox');

ta.value = '';
let richParts = [];
let rawOutput = '';
let textLocked = false;
let lastSelectionStart = 0;
let lastSelectionEnd = 0;

ta.addEventListener('beforeinput', () => {
  if (!textLocked) {
    lastSelectionStart = ta.selectionStart;
    lastSelectionEnd = ta.selectionEnd;
  }
});

ta.addEventListener('blur', () => {
  if (!textLocked) {
    lastSelectionStart = ta.selectionStart;
    lastSelectionEnd = ta.selectionEnd;
  }
});

let undoStack = [];
function saveSnapshot() {
  undoStack.push(JSON.parse(JSON.stringify(richParts)));
  document.getElementById('undoBtn').disabled = false;
}

const openSidebarBtn = document.getElementById('openSidebar');
const closeSidebarBtn = document.getElementById('closeSidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const helpSidebar = document.getElementById('helpSidebar');

function toggleSidebar(open) {
  if (open) {
    helpSidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
  } else {
    helpSidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
  }
}

openSidebarBtn.addEventListener('click', () => toggleSidebar(true));
closeSidebarBtn.addEventListener('click', () => toggleSidebar(false));
sidebarOverlay.addEventListener('click', () => toggleSidebar(false));

['fontColor','strokeColor'].forEach(id => {
  const inp = document.getElementById(id);
  const sw = document.getElementById(id + 'Swatch');
  const wrap = document.getElementById(id + 'Wrap');
  wrap.addEventListener('click', () => inp.click());
  inp.addEventListener('input', () => { sw.style.background = inp.value; });
});

['btnBold','btnItalic','btnUnder','btnStrike'].forEach(id => {
  document.getElementById(id).addEventListener('click', () => {
    document.getElementById(id).classList.toggle('active');
  });
});

document.getElementById('btnStrokeToggle').addEventListener('click', () => {
  document.getElementById('strokeRow').classList.toggle('hidden');
  document.getElementById('btnStrokeToggle').classList.toggle('active');
});

document.getElementById('lockBtn').addEventListener('click', () => {
  textLocked = !textLocked;
  ta.readOnly = textLocked;
  ta.classList.toggle('locked', textLocked);
  document.getElementById('lockBtn').classList.toggle('active', textLocked);
  document.getElementById('lockBtn').textContent = textLocked ? '⊘ Unlock Text' : '⊘ Lock Text';
  document.getElementById('lockIndicator').classList.toggle('visible', textLocked);
});

document.getElementById('undoBtn').addEventListener('click', () => {
  if (undoStack.length === 0) return;
  richParts = undoStack.pop();
  ta.value = richParts.map(p => p.text).join('');
  document.getElementById('undoBtn').disabled = undoStack.length === 0;
  renderAll();
});

document.getElementById('applyBtn').addEventListener('click', () => {
  let selStart = ta.selectionStart;
  let selEnd = ta.selectionEnd;
  
  if (selStart === selEnd && lastSelectionStart !== lastSelectionEnd) {
    selStart = lastSelectionStart;
    selEnd = lastSelectionEnd;
  }
  
  if (selStart === selEnd) { alert('Select some text first!'); return; }

  saveSnapshot();

  const newTags = buildTags();
  const result  = [];
  let cursor    = 0;

  for (const part of richParts) {
    const pStart = cursor;
    const pEnd   = cursor + part.text.length;
    cursor       = pEnd;

    if (pEnd <= selStart || pStart >= selEnd) {
      result.push(part);
      continue;
    }
    if (pStart < selStart) {
      result.push({ text: part.text.slice(0, selStart - pStart), tags: { ...part.tags } });
    }
    const overlapText = part.text.slice(
      Math.max(0, selStart - pStart),
      Math.min(part.text.length, selEnd - pStart)
    );
    result.push({ text: overlapText, tags: { ...part.tags, ...newTags } });
    if (pEnd > selEnd) {
      result.push({ text: part.text.slice(selEnd - pStart), tags: { ...part.tags } });
    }
  }

  richParts = result.filter(p => p.text.length > 0);
  renderAll();
  lastSelectionStart = 0;
  lastSelectionEnd = 0;
});

ta.addEventListener('input', () => {
  if (textLocked) return;
  richParts = [{ text: ta.value, tags: {} }];
  undoStack = [];
  document.getElementById('undoBtn').disabled = true;
  renderAll();
});

function buildTags() {
  const tags = {};
  const col = document.getElementById('fontColor').value;
  if (col) tags.color = col;
  const face = document.getElementById('fontFace').value;
  if (face) tags.face = face;
  
  tags.bold = document.getElementById('btnBold').classList.contains('active');
  tags.italic = document.getElementById('btnItalic').classList.contains('active');
  tags.under = document.getElementById('btnUnder').classList.contains('active');
  tags.strike = document.getElementById('btnStrike').classList.contains('active');
  
  if (!document.getElementById('strokeRow').classList.contains('hidden')) {
    tags.stroke      = true;
    tags.strokeColor = document.getElementById('strokeColor').value;
    tags.strokeThick = 4;
  }
  return tags;
}

function wrapTags(text, tags) {
  if (!text) return '';
  let s = text;
  
  let fa = '';
  if (tags.color) fa += ` color="${tags.color}"`;
  if (tags.face) {
    const cleanFace = tags.face.replace(/\s+/g, '');
    fa += ` face="${cleanFace}"`;
  }
  if (fa) s = `<font${fa}>${s}</font>`;

  if (tags.bold)   s = `<b>${s}</b>`;
  if (tags.italic) s = `<i>${s}</i>`;
  if (tags.under)  s = `<u>${s}</u>`;
  if (tags.strike) s = `<s>${s}</s>`;
  if (tags.stroke) s = `<stroke color="${tags.strokeColor}" thickness="${tags.strokeThick}">${s}</stroke>`;
  
  return s;
}

function buildRaw() {
  return richParts.map(p => wrapTags(p.text, p.tags)).join('');
}

const faceMap = {
  'Arial': 'Arial, sans-serif',
  'Bangers': "'Bangers', cursive",
  'Creepster': "'Creepster', cursive",
  'Fondamento': "'Fondamento', cursive",
  'FredokaOne': "'Fredoka One', cursive",
  'GrenzeGotisch': "'Grenze Gotisch', cursive",
  'HighwayGothic': "'Highway Gothic', sans-serif",
  'Inconsolata': "'Inconsolata', monospace",
  'IndieFlower': "'Indie Flower', cursive",
  'JosefinSans': "'Josefin Sans', sans-serif",
  'Jura': "'Jura', sans-serif",
  'Kalam': "'Kalam', cursive",
  'LuckiestGuy': "'Luckiest Guy', cursive",
  'Merriweather': "'Merriweather', serif",
  'Michroma': "'Michroma', sans-serif",
  'Nunito': "'Nunito', sans-serif",
  'Oswald': "'Oswald', sans-serif",
  'PatrickHand': "'Patrick Hand', cursive",
  'PermanentMarker': "'Permanent Marker', cursive",
  'PressStart2P': "'Press Start 2P', monospace",
  'Roboto': "'Roboto', sans-serif",
  'RobotoCondensed': "'Roboto Condensed', sans-serif",
  'RobotoMono': "'Roboto Mono', monospace",
  'Sarpanch': "'Sarpanch', sans-serif",
  'SpecialElite': "'Special Elite', cursive",
  'TitilliumWeb': "'Titillium Web', sans-serif",
  'Ubuntu': "'Ubuntu', sans-serif",
  'Zekton': "'Zekton', sans-serif"
};

function richToHtml(raw) {
  let h = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '\x01')
    .replace(/>/g, '\x02');

  h = h
    .replace(/\x01b\x02/g, '<b>').replace(/\x01\/b\x02/g, '</b>')
    .replace(/\x01i\x02/g, '<i>').replace(/\x01\/i\x02/g, '</i>')
    .replace(/\x01u\x02/g, '<u>').replace(/\x01\/u\x02/g, '</u>')
    .replace(/\x01s\x02/g, '<s>').replace(/\x01\/s\x02/g, '</s>');

  h = h.replace(/\x01font([^\x02]*)\x02([\s\S]*?)\x01\/font\x02/g, (_, attrs, inner) => {
    let style = '';
    const cm = attrs.match(/color="([^"]+)"/);
    if (cm) style += `color:${cm[1]};text-decoration-color:${cm[1]};-webkit-text-decoration-color:${cm[1]};`;
    const fm = attrs.match(/face="([^"]+)"/);
    if (fm) style += `font-family:${faceMap[fm[1]] || fm[1]};`;
    return `<span style="${style}">${inner}</span>`;
  });

  h = h.replace(/\x01stroke([^\x02]*)\x02([\s\S]*?)\x01\/stroke\x02/g, (_, attrs, inner) => {
    const cm = attrs.match(/color="([^"]+)"/);
    const tm = attrs.match(/thickness="([^"]+)"/);
    const color = cm ? cm[1] : '#fff';
    const thick = tm ? parseInt(tm[1]) : 2;
    return `<span style="-webkit-text-stroke:${thick}px ${color};text-stroke:${thick}px ${color};paint-order:stroke fill;">${inner}</span>`;
  });

  h = h.replace(/\x01[^\x02]*\x02/g, '');
  return h;
}

function renderAll() {
  rawOutput = buildRaw();
  outputBox.textContent = rawOutput || '';
  preview.innerHTML = rawOutput ? richToHtml(rawOutput) : '';
  document.getElementById('copyBtn').textContent = 'Copy';
}

function copyOutput() {
  if (!rawOutput) return;
  navigator.clipboard.writeText(rawOutput).then(() => {
    document.getElementById('copyBtn').textContent = '✓ Copied!';
    setTimeout(() => document.getElementById('copyBtn').textContent = 'Copy', 1500);
  });
}

const fontFaceSelect = document.getElementById('fontFace');
fontFaceSelect.addEventListener('change', () => {
  const selectedOption = fontFaceSelect.options[fontFaceSelect.selectedIndex];
  fontFaceSelect.style.fontFamily = selectedOption.style.fontFamily || "'Outfit', sans-serif";
});

renderAll();

particlesJS("particles-js", {
  particles: {
    number: { value: 45 },
    color: { value: "#c285ff" },
    opacity: { value: 0.3 },
    size: { value: 2.5 },
    move: { enable: true, speed: 0.6 }
  }
});