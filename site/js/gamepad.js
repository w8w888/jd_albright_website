// Standard-mapping gamepad → dashboard actions, with key-repeat for held directions.
const MAP = { 0: 'a', 1: 'b', 2: 'x', 3: 'y', 4: 'prev', 5: 'next', 12: 'up', 13: 'down', 14: 'prev', 15: 'next' };
const REPEAT_DELAY = 400, REPEAT_RATE = 120;

export function startGamepad(act) {
  const held = {};
  const tick = (now) => {
    for (const pad of navigator.getGamepads()) {
      if (!pad) continue;
      const pressed = {};
      for (const [i, a] of Object.entries(MAP)) if (pad.buttons[i]?.pressed) pressed[a] = true;
      const [ax, ay] = pad.axes;
      if (ay < -0.6) pressed.up = true;
      if (ay > 0.6) pressed.down = true;
      if (ax < -0.6) pressed.prev = true;
      if (ax > 0.6) pressed.next = true;
      for (const a of new Set([...Object.keys(pressed), ...Object.keys(held)])) {
        if (!pressed[a]) { delete held[a]; continue; }
        if (!held[a]) { held[a] = now + REPEAT_DELAY; act(a); }
        else if (now >= held[a] && ['up', 'down', 'prev', 'next'].includes(a)) { held[a] = now + REPEAT_RATE; act(a); }
      }
      break;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
