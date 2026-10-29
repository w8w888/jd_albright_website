// The colour background behind the blades, rebuilt from the decoded XUI scenes (dashuisk/skin.xur:
// BG_animation, blade_N_bgcolor, white_cover, black_cover, white_shine_panel). Everything inside .cbg-scene
// is in XUI scene units (1120x770); the scene is mapped onto the stage with the transform fitted to the
// 1280x720 reference capture (x' = 1.1416x - 1.8, y' = 1.0945y - 61.8).
import { STAGE, BLADE } from './layout.js';

// Background swirls: concentric-ring radial gradients, scaled and 3-D rotated. The scenes store the rotation
// as a quaternion with no perspective, so it projects to a 2-D affine matrix. The XUI blend modes aren't
// stored by meaning; drawing the colour layers normally and the swirls as a soft-light overlay above them
// matched the captures best (tested against reference/screenshots with tools/shot.mjs). The decoded tilt and
// 3x scale stretched the rings into diagonal ripples, so they're drawn flat and smaller, which reads as the
// captures' soft circles.
const RINGS = '#000 0.39%, #000 1.96%, #000 10.59%, #fff 24.71%, #000 41.18%, #fff 56.47%, #000 72.16%, #fff 87.84%, #000 100%';
const SWIRLS = [
  { x: 154.96, y: -162.0, w: 770, h: 770, sx: 1.6, sy: 1.6, px: 385, py: 385, q: null, opacity: 0.5, stops: RINGS },
  { x: -218.82, y: 110.05, w: 476, h: 777, sx: 1.6, sy: 1.6, px: 385, py: 385, q: null, opacity: 0.8, stops: RINGS },
  { x: 304.64, y: 78.28, w: 432, h: 440, sx: 2.2, sy: 2.2, px: 196, py: 196, q: null, opacity: 1,
    stops: 'rgba(15,15,15,.2) 0.39%, rgba(15,15,15,.2) 3.92%, rgba(15,15,15,.78) 10.2%, rgba(235,235,235,.59) 24.71%, rgba(15,15,15,.59) 41.18%, #fff 56.47%, #000 72.16%, #fff 87.45%, #000 100%' },
];

function quatMatrix([x, y, z, w]) {
  return [1 - 2 * (y * y + z * z), 2 * (x * y + z * w), 2 * (x * y - z * w), 1 - 2 * (x * x + z * z)];
}

function div(cls, parent) {
  const n = document.createElement('div');
  n.className = cls;
  parent.appendChild(n);
  return n;
}

const grad = (stops) => `linear-gradient(180deg, ${stops.map(([c, p]) => `${c} ${(p * 100).toFixed(1)}%`).join(', ')})`;

export function createColorBackground(stage, blades) {
  const root = div('cbg', stage);
  const scene = div('cbg-scene', root);
  div('cbg-black', scene);
  for (const s of SWIRLS) {
    const n = div('cbg-swirl', scene);
    const m = s.q ? quatMatrix(s.q) : [1, 0, 0, 1];
    Object.assign(n.style, {
      left: `${s.x}px`, top: `${s.y}px`, width: `${s.w}px`, height: `${s.h}px`,
      transformOrigin: `${s.px}px ${s.py}px`,
      transform: `matrix(${m.join(',')},0,0) scale(${s.sx},${s.sy})`,
      opacity: `calc(var(--swirl, 1) * ${s.opacity})`,
      background: `radial-gradient(closest-side, ${s.stops})`,
    });
  }
  // two colour layers (back = additive, front = 70%) per slot; slots swap on each blade change
  const slots = [0, 1].map(() => ({ back: div('cbg-back', scene), front: div('cbg-front', scene) }));
  for (const c of ['cbg-white', 'cbg-dark-top']) div(c, scene);

  let current = 0;
  const paint = (slot, blade) => {
    const c = blade.colour;
    slot.back.style.background = c.back.length ? grad(c.back) : c.backSolid;
    slot.front.style.background = grad(c.front);
  };
  paint(slots[0], blades[0]);
  // hidden: clipped away to the side the next blade arrives from (right, or bottom on a portrait phone)
  const hidden = () => (STAGE.portrait ? 'inset(100% 0 0 0)' : 'inset(0 0 0 100%)');
  slots[1].back.style.clipPath = slots[1].front.style.clipPath = hidden();

  return {
    root,
    show(blade, animate) {
      const incoming = slots[1 - current];
      const outgoing = slots[current];
      paint(incoming, blade);
      for (const l of [incoming.back, incoming.front]) {
        l.style.transition = 'none';
        l.style.clipPath = animate ? hidden() : 'inset(0)';
        l.style.zIndex = '2';
      }
      for (const l of [outgoing.back, outgoing.front]) l.style.zIndex = '1';
      if (animate) {
        // the new colour wipes in from the right (bottom) over the first half of the blade switch
        void incoming.back.offsetWidth;
        for (const l of [incoming.back, incoming.front]) {
          l.style.transition = `clip-path ${BLADE.switchMs * 0.55}ms linear`;
          l.style.clipPath = 'inset(0)';
        }
      }
      current = 1 - current;
    },
    // map the 1120x770 scene onto the stage; the colour only shows between the outer blade strips
    // (outside them are the silver wings). leftEdge / rightEdge: stage points, top to bottom (the top and
    // bottom edges, left to right, on a portrait phone); a missing right edge leaves the colour running to
    // the stage edge.
    fit(leftEdge, rightEdge) {
      const sx = STAGE.portrait ? STAGE.w / 1120 * 1.6 : 1.1416 * STAGE.w / 1280;
      const sy = 1.0945 * STAGE.h / 720;
      const tx = STAGE.portrait ? -STAGE.w * 0.3 : -1.8;
      scene.style.transform = `translate(${tx}px, ${(-61.8 * STAGE.h / 720).toFixed(1)}px) scale(${sx}, ${sy})`;
      const corners = STAGE.portrait ? [[STAGE.w, STAGE.h], [0, STAGE.h]] : [[STAGE.w, STAGE.h], [STAGE.w, 0]];
      const right = rightEdge ? [...rightEdge].reverse() : corners;
      root.style.clipPath = `polygon(${[...leftEdge, ...right].map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`;
    },
  };
}
