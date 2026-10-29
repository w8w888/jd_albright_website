import { blades, startBlade } from './data.js';
import { STAGE, BLADE, setLayout } from './layout.js';
import { createBlade, layoutBlades, sizeBlade, stackX, outerEdge } from './blades.js';
import { renderBlade, markClipped } from './content.js';
import { createColorBackground } from './colorbg.js';
import { createPanel } from './panels.js';
import { initInput } from './input.js';
import { initAudio, play, isMuted, setMuted } from './audio.js';

const viewport = document.getElementById('viewport');
const stage = document.getElementById('stage');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

// ---- state -------------------------------------------------------------------------------
let active = bladeFromHash() ?? blades.findIndex((b) => b.id === startBlade);
let t = active;                       // animated (fractional) active index
const focus = blades.map(() => 0);    // focus index per blade
const panels = [];                    // open second-level panels, innermost last
let views = [];

const colorBg = createColorBackground(stage, blades);
const parts = blades.map((b, i) => createBlade(b, i));
for (const p of parts) stage.appendChild(p.root);

// Content keeps clear of the blades waiting on the right: the description panel, tray bar and (portrait)
// column shrink to the room between the active blade and the first blade of the right stack. On a portrait
// phone the content column instead fills the height between the top and bottom stacks.
function fitContent() {
  const n = blades.length;
  if (STAGE.portrait) {
    parts.forEach((p, i) => {
      const top = stackX(i, n, true) + BLADE.contentX;
      const bottom = i < n - 1 ? stackX(i + 1, n, false) - 4 : STAGE.h;
      p.content.style.setProperty('--room-h', `${bottom - top}px`);
      p.content.style.setProperty('--band-w', `${STAGE.w - 36}px`);
    });
    // fade out a description cut short by the room (dashboard.css lets it shrink)
    for (const m of stage.querySelectorAll('.meta')) markClipped(m);
    return;
  }
  parts.forEach((p, i) => {
    const origin = stackX(i, n, true) + BLADE.contentX;
    const right = i < n - 1 ? stackX(i + 1, n, false) + 38 * BLADE.scale : STAGE.w;
    const room = right - origin - 12;
    p.content.style.setProperty('--meta-w', `${Math.min(392, room - 483)}px`);
    p.content.style.setProperty('--tray-w', `${Math.min(780, room - 78)}px`);
    p.content.style.setProperty('--col-w', `${Math.min(420, room - 84)}px`);
    // header/footer bands end, with rounded corners, just at the first right-hand strip
    const bandEnd = i < n - 1 ? stackX(i + 1, n, false) + 34 * BLADE.scale / 1.1416 : STAGE.w;
    p.content.style.setProperty('--band-w', `${bandEnd - origin - 36}px`);
  });
}

function renderAll() {
  views = blades.map((b, i) => renderBlade(b, parts[i].content));
  views.forEach((v, i) => { focus[i] = Math.min(focus[i], v.focusables.length - 1); applyFocus(i); });
}

// ---- focus -------------------------------------------------------------------------------
function context() {
  if (panels.length) return panels.at(-1);
  return { focusables: views[active].focusables, get focus() { return focus[active]; }, set focus(v) { focus[active] = v; }, blade: active };
}

function applyFocus(bladeIndex) {
  const v = views[bladeIndex];
  v.focusables.forEach((f, i) => f.el.classList.toggle('is-focused', i === focus[bladeIndex]));
  v.setMeta(v.focusables[focus[bladeIndex]]?.entry);
}

function setFocus(i, { sound = true } = {}) {
  const c = context();
  i = Math.max(0, Math.min(c.focusables.length - 1, i));
  if (i === c.focus) return;
  c.focus = i;
  if (c.blade != null) applyFocus(c.blade);
  else c.focusables.forEach((f, j) => f.el.classList.toggle('is-focused', j === i));
  if (sound) play('focus');
}

// ---- blade switching -----------------------------------------------------------------------
let anim = null;
const easeInOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);

function goToBlade(i) {
  if (panels.length || i < 0 || i >= blades.length || i === active) return;
  const steps = Math.abs(i - active);
  active = i;
  play(`switch${1 + (i % 4)}`);
  colorBg.show(blades[i], !reducedMotion.matches);
  fitColour();
  history.replaceState(null, '', `#/${blades[i].id}`);
  const from = t;
  const dur = reducedMotion.matches ? 0 : BLADE.switchMs * Math.min(1 + (steps - 1) * 0.5, 2.5);
  const start = performance.now();
  cancelAnimationFrame(anim);
  const step = (now) => {
    const k = dur ? Math.min(1, (now - start) / dur) : 1;
    t = from + (i - from) * easeInOut(k);
    layoutBlades(parts, t);
    if (k < 1) anim = requestAnimationFrame(step);
    else { anim = null; play('land'); }
  };
  anim = requestAnimationFrame(step);
  parts.forEach((p, j) => p.root.setAttribute('aria-selected', String(j === i)));
}

// ---- panels --------------------------------------------------------------------------------
function openPanel(spec) {
  const blade = blades[active];
  const along = stackX(active, blades.length, true) + (STAGE.portrait ? BLADE.contentX - 8 : 117 * BLADE.scale / 1.1416);
  const panel = createPanel(stage, { theme: blade.theme, left: STAGE.portrait ? 0 : along, top: STAGE.portrait ? along : 0, ...spec });
  panel.focus = 0;
  panel.onSelect = spec.onSelect;
  panel.focusables[0]?.el.classList.add('is-focused');
  panels.push(panel);
  history.pushState({ panels: panels.length }, '', `#/${blade.id}/${spec.id}`);
  play('open2');
}

function closeTopPanel() {
  const p = panels.pop();
  if (!p) return;
  p.close();
  play('close2');
}

window.addEventListener('popstate', (e) => {
  const depth = e.state?.panels ?? 0;
  while (panels.length > depth) closeTopPanel();
  const i = bladeFromHash();
  if (i != null && i !== active && !panels.length) goToBlade(i);
});

// Select the highlighted entry: links open (mail links in place, web links in a new tab), entries with
// details open a second-level panel, anything else just clicks.
function select() {
  const c = context();
  const f = c.focusables[c.focus];
  if (!f) return;
  if (panels.length) { play('select'); return c.onSelect?.(f.entry); }
  const { entry } = f;
  if (entry.href) {
    play('select');
    if (entry.href.startsWith('mailto:')) location.href = entry.href;
    else window.open(entry.href, '_blank', 'noopener');
    return;
  }
  if (entry.details) {
    play('select');
    return openPanel({ id: entry.id, title: entry.meta?.title ?? [].concat(entry.label).join(' '), body: entry.details });
  }
  play('inactiveSelect');
}

// ---- input → actions ------------------------------------------------------------------------
function act(name, arg) {
  switch (name) {
    case 'prev': return goToBlade(active - 1);
    case 'next': return goToBlade(active + 1);
    case 'blade': return goToBlade(arg);
    case 'up': return setFocus(context().focus - 1);
    case 'down': return setFocus(context().focus + 1);
    case 'hover':
    case 'press': {
      const c = context();
      const i = c.focusables.findIndex((f) => f.el === arg);
      if (i < 0) return;
      setFocus(i, { sound: name === 'hover' });
      if (name === 'press') select();
      return;
    }
    case 'a': return select();
    case 'b': if (panels.length) { history.back(); } return;
    default:
  }
}

// ---- routing & stage scaling ----------------------------------------------------------------
function bladeFromHash() {
  const id = location.hash.replace(/^#\/?/, '').split('/')[0];
  const i = blades.findIndex((b) => b.id === id);
  return i >= 0 ? i : null;
}

function fit() {
  const vw = window.innerWidth, vh = window.innerHeight;
  if (setLayout(vw, vh)) {
    stage.style.width = `${STAGE.w}px`;
    stage.style.height = `${STAGE.h}px`;
    stage.classList.toggle('portrait', STAGE.portrait);
    parts.forEach(sizeBlade);
    fitContent();
    layoutBlades(parts, t);
  }
  fitColour();
  const s = Math.min(vw / STAGE.w, vh / STAGE.h);
  stage.style.transform = `translate(-50%, -50%) scale(${s})`;
}

// The colour shows between the outermost strips: about halfway into each strip's back, which keeps it
// hidden under the strip whatever the strip's notch height.
function fitColour() {
  const n = blades.length;
  colorBg.fit(outerEdge(n, true, 1.5, 24), active < n - 1 ? outerEdge(n, false, 1.5, 24) : null);
}

// ---- mute toggle ----------------------------------------------------------------------------
const mute = document.getElementById('mute');
function syncMute() { mute.setAttribute('aria-pressed', String(isMuted())); mute.title = isMuted() ? 'Sound off' : 'Sound on'; }
mute.addEventListener('click', (e) => { e.stopPropagation(); setMuted(!isMuted()); syncMute(); });
syncMute();

// ---- boot -----------------------------------------------------------------------------------
history.replaceState(null, '', `#/${blades[active].id}`);
fit();
window.addEventListener('resize', fit);
renderAll();
colorBg.show(blades[active], false);
layoutBlades(parts, t);
initAudio();
initInput(viewport, act);
Promise.all([document.fonts.ready, ...[...stage.querySelectorAll('img')].map((i) => i.decode().catch(() => {}))])
  .then(() => { window.__dashReady = true; });
