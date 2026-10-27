const $ = id => document.getElementById(id);

const ta = $('inputText');
const preview = $('preview');
const outputBox = $('outputBox');
const copyBtn = $('copyBtn');
const undoBtn = $('undoBtn');

ta.value = '';
let richParts = [];
let rawOutput = '';
let textLocked = false;
let savedStart = 0;
let savedEnd = 0;
let typedSinceSnapshot = false;

let toastTimer;
function showToast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('visible'), 2200);
}

function saveSel() {
  savedStart = ta.selectionStart;
  savedEnd = ta.selectionEnd;
}
document.addEventListener('selectionchange', () => { if (document.activeElement === ta) saveSel(); });
['select', 'keyup', 'mouseup', 'touchend', 'blur'].forEach(ev => ta.addEventListener(ev, saveSel));

function currentRange() {
  const len = ta.value.length;
  let s = ta.selectionStart;
  let e = ta.selectionEnd;
  if (s === e) { s = savedStart; e = savedEnd; }
  s = Math.min(s, len);
  e = Math.min(e, len);
  return s < e ? { start: s, end: e } : null;
}

let undoStack = [];
function saveSnapshot() {
  undoStack.push(JSON.parse(JSON.stringify(richParts)));
  if (undoStack.length > 100) undoStack.shift();
  undoBtn.disabled = false;
}

undoBtn.addEventListener('click', () => {
  if (undoStack.length === 0) return;
  richParts = undoStack.pop();
  ta.value = plainText();
  savedStart = savedEnd = 0;
  typedSinceSnapshot = false;
  undoBtn.disabled = undoStack.length === 0;
  renderAll();
});

const helpSidebar = $('helpSidebar');
const sidebarOverlay = $('sidebarOverlay');

function toggleSidebar(open) {
  helpSidebar.classList.toggle('active', open);
  sidebarOverlay.classList.toggle('active', open);
  helpSidebar.setAttribute('aria-hidden', String(!open));
  (open ? $('closeSidebar') : $('openSidebar')).focus({ preventScroll: true });
}
$('openSidebar').addEventListener('click', () => toggleSidebar(true));
$('closeSidebar').addEventListener('click', () => toggleSidebar(false));
sidebarOverlay.addEventListener('click', () => toggleSidebar(false));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && helpSidebar.classList.contains('active')) toggleSidebar(false);
});

['fontColor', 'strokeColor', 'gradStart', 'gradMid', 'gradEnd'].forEach(id => {
  const inp = $(id);
  const sw = $(id + 'Swatch');
  const wrap = $(id + 'Wrap');
  wrap.addEventListener('click', e => { if (e.target !== inp) inp.click(); });
  const sync = () => { sw.style.background = inp.value; updateGradientBar(); };
  inp.addEventListener('input', sync);
  inp.addEventListener('change', sync);
});

['btnBold', 'btnItalic', 'btnUnder', 'btnStrike'].forEach(id => {
  $(id).addEventListener('click', () => {
    const on = $(id).classList.toggle('active');
    $(id).setAttribute('aria-pressed', String(on));
  });
});

function gradientOn() { return !$('gradientRow').classList.contains('hidden'); }
function strokeOn() { return !$('strokeRow').classList.contains('hidden'); }

function getGradientStops() {
  const stops = [$('gradStart').value];
  if ($('gradMidToggle').checked) stops.push($('gradMid').value);
  stops.push($('gradEnd').value);
  return stops;
}

function updateGradientBar() {
  $('gradBar').style.background = `linear-gradient(90deg, ${getGradientStops().join(', ')})`;
}

$('btnGradientToggle').addEventListener('click', () => {
  const row = $('gradientRow');
  row.classList.toggle('hidden');
  const on = gradientOn();
  $('btnGradientToggle').classList.toggle('active', on);
  $('btnGradientToggle').setAttribute('aria-expanded', String(on));
  $('fontColorWrap').classList.toggle('dimmed', on);
  $('fontColorWrap').title = on ? 'Ignored while Gradient is on' : 'Text color';
  updateGradientBar();
});

$('gradMidToggle').addEventListener('change', () => {
  $('gradMidWrap').classList.toggle('hidden', !$('gradMidToggle').checked);
  updateGradientBar();
});

$('gradSwap').addEventListener('click', () => {
  const a = $('gradStart');
  const b = $('gradEnd');
  [a.value, b.value] = [b.value, a.value];
  $('gradStartSwatch').style.background = a.value;
  $('gradEndSwatch').style.background = b.value;
  updateGradientBar();
});

$('btnStrokeToggle').addEventListener('click', () => {
  $('strokeRow').classList.toggle('hidden');
  const on = strokeOn();
  $('btnStrokeToggle').classList.toggle('active', on);
  $('btnStrokeToggle').setAttribute('aria-expanded', String(on));
});

$('strokeThick').addEventListener('input', () => { $('strokeThickOut').textContent = $('strokeThick').value; });

$('lockBtn').addEventListener('click', () => {
  textLocked = !textLocked;
  ta.readOnly = textLocked;
  ta.classList.toggle('locked', textLocked);
  $('lockBtn').classList.toggle('active', textLocked);
  $('lockBtn').setAttribute('aria-pressed', String(textLocked));
  $('lockBtn').textContent = textLocked ? '⊘ Unlock Text' : '⊘ Lock Text';
  $('lockIndicator').classList.toggle('visible', textLocked);
});

function plainText() { return richParts.map(p => p.text).join(''); }

function tagsKey(t) {
  return JSON.stringify([
    t.color || '', t.face || '',
    !!t.bold, !!t.italic, !!t.under, !!t.strike,
    !!t.stroke, t.strokeColor || '', t.strokeThick || 0
  ]);
}

function mergeParts(parts) {
  const out = [];
  for (const p of parts) {
    if (!p.text) continue;
    const last = out[out.length - 1];
    if (last && tagsKey(last.tags) === tagsKey(p.tags)) last.text += p.text;
    else out.push({ text: p.text, tags: { ...p.tags } });
  }
  return out;
}

function sliceParts(from, to) {
  const out = [];
  let c = 0;
  for (const part of richParts) {
    const a = c;
    const b = c + part.text.length;
    c = b;
    if (b <= from || a >= to) continue;
    out.push({
      text: part.text.slice(Math.max(0, from - a), Math.min(part.text.length, to - a)),
      tags: { ...part.tags }
    });
  }
  return out;
}

function tagsAt(index) {
  let c = 0;
  for (const part of richParts) {
    c += part.text.length;
    if (index < c) return { ...part.tags };
  }
  return {};
}

function syncPartsToText(newText) {
  const oldText = plainText();
  if (oldText === newText) return;

  const minLen = Math.min(oldText.length, newText.length);
  let p = 0;
  while (p < minLen && oldText[p] === newText[p]) p++;
  let s = 0;
  while (s < minLen - p && oldText[oldText.length - 1 - s] === newText[newText.length - 1 - s]) s++;

  const removeEnd = oldText.length - s;
  const inserted = newText.slice(p, newText.length - s);
  const inherit = oldText.length ? tagsAt(p > 0 ? p - 1 : 0) : {};

  richParts = mergeParts([
    ...sliceParts(0, p),
    ...(inserted ? [{ text: inserted, tags: inherit }] : []),
    ...sliceParts(removeEnd, oldText.length)
  ]);
}

ta.addEventListener('input', () => {
  if (textLocked) return;
  if (!typedSinceSnapshot) { saveSnapshot(); typedSinceSnapshot = true; }
  syncPartsToText(ta.value);
  renderAll();
});

function hexToRgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
}
function gradientColor(t, stops) {
  if (stops.length === 1) return stops[0];
  const seg = t * (stops.length - 1);
  const i = Math.min(Math.floor(seg), stops.length - 2);
  const f = seg - i;
  const a = hexToRgb(stops[i]);
  const b = hexToRgb(stops[i + 1]);
  return rgbToHex(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f);
}

function buildTags() {
  const tags = {};
  const col = $('fontColor').value;
  if (col) tags.color = col;
  const face = $('fontFace').value;
  if (face) tags.face = face;

  tags.bold = $('btnBold').classList.contains('active');
  tags.italic = $('btnItalic').classList.contains('active');
  tags.under = $('btnUnder').classList.contains('active');
  tags.strike = $('btnStrike').classList.contains('active');

  if (strokeOn()) {
    tags.stroke = true;
    tags.strokeColor = $('strokeColor').value;
    tags.strokeThick = parseInt($('strokeThick').value, 10) || 4;
  }
  return tags;
}

function applyFormat(clear) {
  const range = currentRange();
  if (!range) { showToast('Select some text first, or tap Select all.'); return; }
  const { start, end } = range;

  saveSnapshot();
  typedSinceSnapshot = false;

  const newTags = clear ? null : buildTags();
  const useGradient = !clear && gradientOn();
  const stops = getGradientStops();

  const total = useGradient
    ? Array.from(plainText().slice(start, end)).filter(ch => !/\s/.test(ch)).length
    : 0;
  let seen = 0;
  let lastColor = stops[0];

  const result = [];
  let cursor = 0;
  for (const part of richParts) {
    const pStart = cursor;
    const pEnd = cursor + part.text.length;
    cursor = pEnd;

    if (pEnd <= start || pStart >= end) { result.push(part); continue; }

    const a = Math.max(0, start - pStart);
    const b = Math.min(part.text.length, end - pStart);
    if (a > 0) result.push({ text: part.text.slice(0, a), tags: { ...part.tags } });

    const mid = part.text.slice(a, b);
    if (clear) {
      result.push({ text: mid, tags: {} });
    } else if (useGradient) {
      for (const ch of Array.from(mid)) {
        if (!/\s/.test(ch)) {
          lastColor = gradientColor(total > 1 ? seen / (total - 1) : 0, stops);
          seen++;
        }
        result.push({ text: ch, tags: { ...part.tags, ...newTags, color: lastColor } });
      }
    } else {
      result.push({ text: mid, tags: { ...part.tags, ...newTags } });
    }

    if (b < part.text.length) result.push({ text: part.text.slice(b), tags: { ...part.tags } });
  }

  richParts = mergeParts(result);
  renderAll();
  showToast(clear ? 'Formatting cleared.' : useGradient ? 'Gradient applied.' : 'Applied.');
}

$('applyBtn').addEventListener('click', () => applyFormat(false));
$('clearBtn').addEventListener('click', () => applyFormat(true));

$('selectAllBtn').addEventListener('click', () => {
  if (!ta.value) { showToast('Type some text first.'); return; }
  ta.focus({ preventScroll: true });
  ta.setSelectionRange(0, ta.value.length);
  saveSel();
});

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
    const thick = tm ? parseInt(tm[1], 10) : 2;
    return `<span style="-webkit-text-stroke:${thick}px ${color};text-stroke:${thick}px ${color};paint-order:stroke fill;">${inner}</span>`;
  });

  h = h.replace(/\x01[^\x02]*\x02/g, '');
  return h;
}

function updateCount() {
  const n = Array.from(ta.value).length;
  const el = $('charCount');
  el.textContent = `${n} / ${ta.maxLength}`;
  el.classList.toggle('full', n >= ta.maxLength);
}

function renderAll() {
  rawOutput = buildRaw();
  outputBox.textContent = rawOutput || '';
  preview.innerHTML = rawOutput ? richToHtml(rawOutput) : '';
  copyBtn.textContent = 'Copy';
  updateCount();
}

function copyOutput() {
  if (!rawOutput) { showToast('Nothing to copy yet.'); return; }
  const done = () => {
    copyBtn.textContent = '✓ Copied!';
    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
  };
  const fallback = () => {
    const tmp = document.createElement('textarea');
    tmp.value = rawOutput;
    tmp.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(tmp);
    tmp.select();
    try { document.execCommand('copy') ? done() : showToast('Could not copy. Select the output and copy it manually.'); }
    catch (e) { showToast('Could not copy. Select the output and copy it manually.'); }
    tmp.remove();
  };
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(rawOutput).then(done, fallback);
  else fallback();
}
outputBox.addEventListener('click', copyOutput);
copyBtn.addEventListener('click', e => { e.stopPropagation(); copyOutput(); });
outputBox.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copyOutput(); }
});

[['bgDark', 'dark'], ['bgLight', 'light']].forEach(([id, mode]) => {
  $(id).addEventListener('click', () => {
    preview.dataset.bg = mode;
    $('bgDark').classList.toggle('active', mode === 'dark');
    $('bgLight').classList.toggle('active', mode === 'light');
    $('bgDark').setAttribute('aria-pressed', String(mode === 'dark'));
    $('bgLight').setAttribute('aria-pressed', String(mode === 'light'));
  });
});

const fontFaceSelect = $('fontFace');
fontFaceSelect.addEventListener('change', () => {
  const selectedOption = fontFaceSelect.options[fontFaceSelect.selectedIndex];
  fontFaceSelect.style.fontFamily = selectedOption.style.fontFamily || "'Outfit', sans-serif";
});

updateGradientBar();
renderAll();
