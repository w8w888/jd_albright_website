// Loads one of the two views (index.html has already picked it and its stylesheet: <html data-view>) and
// adds the button that switches between them. Switching remembers the choice and reloads on the same section.
const view = document.documentElement.dataset.view;
const other = view === 'modern' ? 'classic' : 'modern';

const toggle = document.createElement('button');
toggle.id = 'view-toggle';
toggle.type = 'button';
if (view === 'modern') {
  const icon = document.createElement('img');
  icon.src = 'assets/images/gamesbla/ico_32x_myGames.png';   // the dashboard's controller icon
  icon.alt = '';
  toggle.appendChild(icon);
}
toggle.append(view === 'modern' ? 'Dashboard view' : 'Modern view');
toggle.title = view === 'modern' ? 'Switch to the Xbox 360 dashboard' : 'Switch to the standard portfolio layout';
// keep presses away from the dashboard's own pointer and keyboard handling
for (const type of ['pointerdown', 'pointerup', 'click', 'wheel', 'touchstart', 'keydown']) {
  toggle.addEventListener(type, (e) => e.stopPropagation());
}
toggle.addEventListener('click', () => {
  try { localStorage.setItem('view', other); } catch { /* storage blocked: the URL below still carries it */ }
  const url = new URL(location.href);
  url.searchParams.set('view', other);
  // the dashboard's sub-panel routes (#/about/me) mean nothing in the modern view; keep the section
  url.hash = `#/${location.hash.replace(/^#\/?/, '').split('/')[0]}`;
  location.replace(url);
});
document.body.appendChild(toggle);

import(view === 'modern' ? './modern.js' : './main.js');
