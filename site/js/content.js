// Renders a blade's content (header, profile card, menu, description panel, tray link, button bar)
// into its blade element. Positions are in css/dashboard.css, relative to the blade's content origin.
import { owner, brand } from './data.js';

const IMG = 'assets/images/';

function h(tag, cls, parent, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  parent?.appendChild(n);
  return n;
}

function img(src, cls, parent) {
  const i = h('img', cls, parent);
  i.src = IMG + src;
  i.alt = '';
  i.draggable = false;
  return i;
}

// The gamercard-style profile card.
function tile(parent) {
  const t = h('div', 'tile tile--gamercard focusable', parent);
  h('div', 'tile-head', t, owner.name);
  img(owner.picture, 'tile-pic', t);
  const stats = h('div', 'tile-stats', t);
  for (const [label, value] of owner.stats) {
    const row = h('div', 'stat', stats);
    h('span', 'stat-label', row, label);
    h('span', 'stat-value', row, String(value));
  }
  return t;
}

// Build the blade's content. Returns the ordered focusable elements with their entries.
export function renderBlade(blade, contentEl) {
  contentEl.replaceChildren();
  contentEl.classList.toggle('no-tile', !blade.tile);
  const focusables = [];

  h('div', 'band band--top', contentEl);
  h('div', 'band band--bottom', contentEl);
  h('div', 'blade-title', contentEl, blade.title);

  if (blade.tile) {
    const about = blade.items.find((i) => i.id === 'me');
    focusables.push({ el: tile(contentEl), entry: { id: 'profile', kind: 'tile', meta: blade.motd, details: about?.details, label: owner.name } });
  }

  const list = h('div', 'menu', contentEl);
  list.setAttribute('role', 'menu');
  for (const entry of blade.items) {
    const row = h('div', `row row--${entry.size ?? 'small'} focusable`, list);
    row.setAttribute('role', 'menuitem');
    img(entry.icon, 'row-icon', row);
    const label = h('div', 'row-label', row);
    for (const line of [].concat(entry.label)) h('div', null, label, line);
    if (entry.href) row.classList.add('row--link');
    focusables.push({ el: row, entry });
  }

  const meta = h('div', 'meta', contentEl);
  const b = h('div', 'meta-brand-text', meta);
  h('div', 'meta-brand-title', b, brand.title);
  h('div', 'meta-brand-sub', b, brand.subtitle);
  h('div', 'meta-rule', meta);
  const metaText = h('div', 'meta-text', meta);
  const metaTitle = h('div', 'meta-title', metaText);
  const metaBody = h('div', 'meta-body', metaText);

  if (blade.tray) {
    const tray = h('div', 'tray focusable', contentEl);
    const knob = h('div', 'tray-knob', tray);
    img(blade.tray.icon ?? 'dashcomm/ico_32x_Eject.png', 'tray-icon', knob);
    h('div', 'tray-label', tray, blade.tray.label);
    focusables.push({ el: tray, entry: { id: 'tray', kind: 'tray', href: blade.tray.href, meta: { title: blade.tray.label, body: blade.tray.href.replace(/^mailto:|^https?:\/\//, '') } } });
  }

  const bar = h('div', 'buttonbar', contentEl);
  legend(bar, 'y', null, 'legend--y');
  legend(bar, 'x', null, 'legend--x');
  legend(bar, 'b', null, 'legend--b');
  legend(bar, 'a', 'Select', 'legend--a');

  return {
    focusables,
    setMeta(entry) {
      const m = entry?.meta ?? blade.motd;
      metaTitle.textContent = m.title;
      metaBody.textContent = m.body;
    },
  };
}

function legend(bar, key, text, cls) {
  const n = h('button', `legend ${cls}`, bar);
  n.type = 'button';
  n.dataset.action = key;
  if (text) h('span', 'legend-text', n, text);
  else n.disabled = true;
  buttonGlyph(n, key, !!text);
  n.setAttribute('aria-label', text ?? key.toUpperCase());
}

// A controller button: the coloured orb (or the faded disabled one) with its letter on top, as the
// dashboard draws it.
export function buttonGlyph(parent, key, enabled) {
  const g = h('span', `legend-icon legend-icon--${enabled ? key : 'off'}`, parent);
  g.setAttribute('aria-hidden', 'true');
  img(`shrdres/${enabled ? key.toUpperCase() : 'disabled'}-Button.png`, null, g);
  h('span', 'legend-letter', g, key.toUpperCase());
  return g;
}
