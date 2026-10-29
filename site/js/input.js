// Mouse, touch and keyboard input, translated into dashboard actions.
// act(name, arg) names: prev, next, blade (index), up, down, hover (element), press (element), a, b, x, y.
import { STAGE } from './layout.js';

const WHEEL_STEP = 100;    // accumulated wheel delta per action (one mouse notch)
const SWIPE_MIN = 40;      // px before a touch drag counts as a swipe
const ROW_SWIPE = 45;      // px of vertical drag per focus step

export function initInput(viewport, act) {
  // --- mouse / pen / touch -------------------------------------------------------------
  let drag = null;
  let suppressClick = false;

  viewport.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, stepped: 0, swiped: false };
  });
  viewport.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse') {
      const f = e.target.closest?.('.focusable');
      if (f) act('hover', f);
      return;
    }
    if (!drag || drag.id !== e.pointerId) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.swiped && Math.abs(dx) > SWIPE_MIN && Math.abs(dx) > Math.abs(dy) * 1.2) {
      drag.swiped = true;
      act(dx < 0 ? 'next' : 'prev');
    }
    // portrait phone: the blades stack top and bottom, so swiping up brings the next one up
    if (STAGE.portrait) {
      if (!drag.swiped && Math.abs(dy) > SWIPE_MIN && Math.abs(dy) > Math.abs(dx) * 1.2) {
        drag.swiped = true;
        act(dy < 0 ? 'next' : 'prev');
      }
      return;
    }
    if (!drag.swiped) {
      const steps = Math.trunc(-dy / ROW_SWIPE);
      while (drag.stepped < steps) { drag.stepped++; act('down'); }
      while (drag.stepped > steps) { drag.stepped--; act('up'); }
    }
  });
  const endDrag = (e) => {
    if (drag && drag.id === e.pointerId) suppressClick = drag.swiped || drag.stepped !== 0;
    drag = null;
  };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  viewport.addEventListener('click', (e) => {
    if (suppressClick) { suppressClick = false; return; }
    const legend = e.target.closest('[data-action]');
    if (legend) return act(legend.dataset.action);
    const f = e.target.closest('.focusable');
    if (f) return act('press', f);
    const blade = e.target.closest('.blade');
    if (blade) act('blade', Number(blade.dataset.index));
  });

  let wx = 0, wy = 0, wheelTimer = 0;
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const scale = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? 400 : 1;
    let dx = e.deltaX * scale, dy = e.deltaY * scale;
    if (e.shiftKey && !dx) { dx = dy; dy = 0; }
    wx += dx; wy += dy;
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { wx = 0; wy = 0; }, 200);
    if (Math.abs(wx) >= WHEEL_STEP && Math.abs(wx) > Math.abs(wy)) { act(wx > 0 ? 'next' : 'prev'); wx = 0; wy = 0; }
    while (Math.abs(wy) >= WHEEL_STEP) { act(wy > 0 ? 'down' : 'up'); wy -= Math.sign(wy) * WHEEL_STEP; }
  }, { passive: false });

  // --- keyboard -------------------------------------------------------------------------
  const keys = {
    ArrowLeft: 'prev', ArrowRight: 'next', PageUp: 'prev', PageDown: 'next',
    ArrowUp: 'up', ArrowDown: 'down', Enter: 'a', ' ': 'a', Escape: 'b', Backspace: 'b', x: 'x', y: 'y',
  };
  window.addEventListener('keydown', (e) => {
    const a = keys[e.key];
    if (!a || e.altKey || e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    act(a);
  });

  // --- gamepad (loaded only if a controller connects) -----------------------------------
  window.addEventListener('gamepadconnected', () => import('./gamepad.js').then((m) => m.startGamepad(act)), { once: true });
}
