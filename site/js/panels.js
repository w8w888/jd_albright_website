// Second-level panels: slide in from the right over the active blade's content, close with B / Back.
import { BLADE } from './layout.js';
import { buttonGlyph } from './content.js';

const IMG = 'assets/images/';

function h(tag, cls, parent, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  parent?.appendChild(n);
  return n;
}

// spec: { title, theme, items: [{ label, icon?, picture?, meta? }], message?, body?: string[], left }
export function createPanel(stage, spec) {
  const root = h('div', 'panel', stage);
  root.style.setProperty('--panel-left', `${spec.left}px`);
  root.style.setProperty('--band', spec.theme.band);
  root.style.setProperty('--body', spec.theme.body);
  root.style.setProperty('--body-light', spec.theme.bodyLight);
  root.style.setProperty('--footer', spec.theme.footer);
  root.style.setProperty('--switch-ms', `${BLADE.switchMs}ms`);
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-label', spec.title);

  h('div', 'panel-band panel-band--top', root);
  h('div', 'panel-band panel-band--bottom', root);
  h('div', 'panel-title', root, spec.title);
  const list = h('div', 'panel-list', root);
  const focusables = [];
  for (const item of spec.items ?? []) {
    const row = h('div', 'row row--small focusable', list);
    row.dataset.focus = String(focusables.length);
    if (item.picture || item.icon) {
      const i = h('img', item.picture ? 'row-pic' : 'row-icon', row);
      i.src = IMG + (item.picture ?? item.icon);
      i.alt = '';
      i.draggable = false;
    }
    h('div', 'row-label', row, item.label);
    focusables.push({ el: row, entry: item });
  }
  if (spec.message) h('p', 'panel-message', root, spec.message);
  if (spec.body) {
    // strings become paragraphs; consecutive '• ' strings become one bullet list
    const body = h('div', 'panel-body', root);
    let ul = null;
    for (const line of spec.body) {
      if (line.startsWith('• ')) { ul ??= h('ul', null, body); h('li', null, ul, line.slice(2)); }
      else { ul = null; h('p', null, body, line); }
    }
  }

  const bar = h('div', 'buttonbar', root);
  const back = h('button', 'legend legend--b', bar);
  back.type = 'button';
  back.dataset.action = 'b';
  h('span', 'legend-text', back, 'Back');
  buttonGlyph(back, 'b', true);
  if (focusables.length) {
    const sel = h('button', 'legend legend--a', bar);
    sel.type = 'button';
    sel.dataset.action = 'a';
    h('span', 'legend-text', sel, 'Select');
    buttonGlyph(sel, 'a', true);
  }

  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-open')));
  return {
    root,
    focusables,
    close() {
      root.classList.remove('is-open');
      root.addEventListener('transitionend', () => root.remove(), { once: true });
      setTimeout(() => root.remove(), BLADE.switchMs + 200);
    },
  };
}
