// Modern view: the same content as the dashboard (data.js) laid out as a conventional portfolio page.
// Borrowed from the dashboard: one section at a time, silver blade tabs down the side (a top bar on phones)
// that slide the sections across, each section's dashboard colours, and the console's UI font for headings.
import { owner, brand, blades, startBlade } from './data.js';

const IMG = 'assets/images/';

function h(tag, cls, parent, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  parent?.appendChild(n);
  return n;
}

function link(parent, cls, href, text) {
  const a = h('a', cls, parent, text);
  a.href = href;
  if (!href.startsWith('mailto:')) { a.target = '_blank'; a.rel = 'noopener'; }
  return a;
}

// the contact section's links (the section made only of links), for the profile card
function contactLinks() {
  const contact = blades.find((b) => b.items.every((i) => i.href));
  return contact ? contact.items.map((i) => [i.href, [].concat(i.label).join(' ')]) : [];
}

const gradient = (stops) => `linear-gradient(120deg, ${stops.map(([c, p]) => `${c} ${(p * 100).toFixed(0)}%`).join(', ')})`;

function profile(parent) {
  const card = h('div', 'm-profile', parent);
  const pic = h('img', 'm-profile-pic', card);
  pic.src = IMG + owner.picture;
  pic.alt = owner.name;
  const text = h('div', 'm-profile-text', card);
  h('div', 'm-profile-name', text, owner.name);
  h('div', 'm-profile-sub', text, brand.subtitle);
  const stats = h('div', 'm-stats', text);
  for (const [label, value] of owner.stats) {
    const s = h('div', 'm-stat', stats);
    h('span', 'm-stat-value', s, String(value));
    h('span', 'm-stat-label', s, label);
  }
  const links = h('div', 'm-links', text);
  for (const [href, label] of contactLinks()) link(links, 'm-button', href, label);
}

function card(parent, item) {
  const isLink = !!item.href;
  const c = isLink ? link(parent, 'm-card m-card--link', item.href) : h('article', 'm-card', parent);
  const head = h('div', 'm-card-head', c);
  const chip = h('span', 'm-chip', head);
  const icon = h('img', null, chip);
  icon.src = IMG + item.icon;
  icon.alt = '';
  const titles = h('div', 'm-card-titles', head);
  const label = [].concat(item.label);
  h('h3', 'm-card-title', titles, item.meta?.title ?? label.join(' '));
  if (label.length > 1) h('div', 'm-card-kicker', titles, label[0]);
  if (isLink) h('span', 'm-card-arrow', head, '↗');

  if (!item.details) {
    h('p', 'm-card-summary', c, item.meta?.body);
    return;
  }
  // details: '• ' lines become bullets; on a card with bullets the first plain line is the role/date line
  const hasBullets = item.details.some((l) => l.startsWith('• '));
  let ul = null;
  item.details.forEach((line, i) => {
    if (line.startsWith('• ')) { ul ??= h('ul', 'm-card-list', c); h('li', null, ul, line.slice(2)); }
    else { ul = null; h('p', i === 0 && hasBullets ? 'm-card-meta' : 'm-card-summary', c, line); }
  });
}

function section(parent, blade) {
  const s = h('section', 'm-section', parent);
  s.id = `m-${blade.id}`;
  s.style.setProperty('--accent', blade.theme.band);
  s.style.setProperty('--accent-bright', blade.theme.body);
  s.setAttribute('aria-labelledby', `m-${blade.id}-title`);

  const hero = h('header', 'm-hero', s);
  hero.style.backgroundImage = `radial-gradient(120% 140% at 85% 10%, rgba(255,255,255,.28), transparent 55%), ${gradient(blade.colour.front)}`;
  const title = h('h2', 'm-hero-title', hero, blade.title);
  title.id = `m-${blade.id}-title`;
  h('p', 'm-hero-body', hero, blade.motd.body);
  if (blade.tray) link(hero, 'm-hero-cta', blade.tray.href, blade.tray.label);

  if (blade.tile) profile(s);
  const grid = h('div', `m-grid${blade.items.every((i) => !i.details) ? ' m-grid--compact' : ''}`, s);
  for (const item of blade.items) card(grid, item);
  return s;
}

// ---- build ------------------------------------------------------------------------------------
const app = h('div', 'm-app', document.body);
const rail = h('nav', 'm-rail', app);
rail.setAttribute('aria-label', 'Sections');
const brandEl = h('a', 'm-brand', rail);
brandEl.href = `#/${startBlade}`;
h('span', 'm-brand-name', brandEl, brand.title);
h('span', 'm-brand-sub', brandEl, 'Portfolio');
const tabs = h('div', 'm-tabs', rail);
const main = h('main', 'm-main', app);
const track = h('div', 'm-track', main);

const sections = blades.map((b) => section(track, b));
const tabEls = blades.map((b) => {
  const t = h('a', 'm-tab', tabs);
  t.href = `#/${b.id}`;
  t.style.setProperty('--accent', b.theme.band);
  t.style.setProperty('--accent-bright', b.theme.body);
  h('span', 'm-tab-label', t, b.tab);
  return t;
});

const foot = h('footer', 'm-foot', main);
h('span', null, foot, `© ${new Date().getFullYear()} ${owner.name}. `);
h('span', null, foot, 'Xbox and the Xbox 360 dashboard artwork belong to Microsoft; this site is a fan tribute.');

// ---- routing ------------------------------------------------------------------------------------
let active = -1;
function show(i, { scroll = true } = {}) {
  if (i === active) return;
  const from = active;
  active = i;
  sections.forEach((s, j) => {
    s.hidden = j !== i;
    s.classList.remove('is-in-left', 'is-in-right');
  });
  // slide in from the side it sits on, like a blade
  if (from >= 0) sections[i].classList.add(i > from ? 'is-in-right' : 'is-in-left');
  tabEls.forEach((t, j) => {
    t.classList.toggle('is-active', j === i);
    if (j === i) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
  });
  document.documentElement.style.setProperty('--page-accent', blades[i].theme.band);
  if (scroll && from >= 0) main.scrollIntoView({ block: 'start', behavior: 'smooth' });
  tabEls[i].scrollIntoView({ block: 'nearest', inline: 'center' });
}

function fromHash() {
  const id = location.hash.replace(/^#\/?/, '').split('/')[0];
  const i = blades.findIndex((b) => b.id === id);
  return i >= 0 ? i : blades.findIndex((b) => b.id === startBlade);
}

window.addEventListener('hashchange', () => show(fromHash()));
window.addEventListener('keydown', (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey || /input|textarea/i.test(e.target.tagName)) return;
  const d = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
  if (!d) return;
  const next = Math.max(0, Math.min(blades.length - 1, active + d));
  if (next !== active) location.hash = `#/${blades[next].id}`;
});
show(fromHash(), { scroll: false });
Promise.all([document.fonts.ready, ...[...document.images].map((i) => i.decode().catch(() => {}))])
  .then(() => { window.__dashReady = true; });
