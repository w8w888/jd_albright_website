// Blades: narrow silver strips drawn from the decoded skin (dashuisk/skin.xur, visuals blade_grey_left /
// blade_grey_rt: a lens-shaped back plus a face that narrows around the tab panel). Strips up to the active
// blade stack on the left, later ones on the right; in both stacks the strip nearer the content draws on top
// and casts its shadow outward, and the right stack draws above the active blade's content. Left-stack strips use the unmirrored shape (the tab panel
// steps out toward the content), right-stack strips the mirrored one. The original bends strips between the
// two with its bend tweens; here a strip flips halfway across. Strips further from the content sit lower,
// as in the captures.
// Paths are in XUI units inside a 161x853 box; the box is scaled onto the stage.
// On portrait phones the whole arrangement is turned sideways: strips run across the screen, earlier blades
// stack at the top and later ones at the bottom. Geometry is worked out as if in landscape along the
// stacking axis ("along", down the screen) and the strip axis ("across", the screen width), and the strip
// art is mirrored across its diagonal (CSS, #stage.portrait .blade-art) so the decoded shapes still apply.
import { STAGE, BLADE } from './layout.js';

const SVG = 'http://www.w3.org/2000/svg';

// decoded paths (reference/scenes-json/BLADE_VISUALS.md)
const BACK = 'M48.538 460.001 C48.538 628.079 30.827 785.389 0.001 920 L50.17 920 C80.998 785.388 98.712 628.08 98.712 460.001 C98.712 291.921 80.998 134.613 50.17 0 L0 0 C30.827 134.612 48.538 291.923 48.538 460.001 Z';
const FACE = 'M53.028 553.151 C54.291 521.858 54.356 492.164 54.356 460.001 C54.356 393.263 52.084 327.808 45.647 265.626 C45.489 264.097 45.303 261.617 45.05 258.982 C44.949 257.941 43.662 247.518 53.538 247.518 C58.274 247.518 60.433 247.518 69.652 247.518 C78.871 247.518 78.325 236.72 78.147 235.08 C76.83 222.959 74.578 203.068 71.634 180.332 C64.917 128.456 52.111 51.183 40.352 0 L0 0 C30.926 134.612 48.694 291.923 48.694 460.001 C48.694 628.079 30.926 785.389 0.001 920 L40.352 920 C57.501 845.358 70.599 766.695 78.869 680.129 C80.544 648.654 72.9 630.781 65.955 614.105 C58.617 596.484 51.934 580.262 53.028 553.151 Z';
const BACK_STOPS = [['#b4b6b8', 0.26], ['#dfdfdf', 0.4], ['#c3c5c7', 0.69], ['#c8cacc', 0.89]];
const FACE_STOPS = [['#bdbdc0', 0.0], ['#d9d9db', 0.38], ['#e3e3e5', 0.67], ['#efefef', 1]];
// placement of the back and face inside the 161-unit box: blade_grey_rt (mirrored) for the right stack, and
// the same shapes unmirrored for the left stack, placed so the tab panels line up with the captures
const MIRRORED = { back: 'translate(154.44 -73.41) scale(-1 1)', face: 'translate(153.72 -73.56) scale(-1 1)', mx: 154.44, dir: -1 };
const UNMIRRORED = { back: 'translate(31.6 -73.41)', face: 'translate(32.32 -73.56)', mx: 31.6, dir: 1 };
// outer edge of the back (the side away from the content), as two cubics in path units
const EDGE = [[0, 0], [30.827, 134.612], [48.538, 291.923], [48.538, 460.001], [48.538, 628.079], [30.827, 785.389], [0, 920]];
// tab notch height (stage px at 720 high) by stack and depth from the content
const NOTCH = { left: 122, leftStep: 16, right: 150, rightStep: 11 };
const NOTCH_DESIGN = 128.5;

const clamp01 = (v) => Math.min(1, Math.max(0, v));

// stage length along the stacking axis, and along the strips
const along = () => (STAGE.portrait ? STAGE.h : STAGE.w);
const across = () => (STAGE.portrait ? STAGE.w : STAGE.h);

// position (stage px along the stacking axis: x, or y on a portrait phone) of a blade's box in the
// left/top or right/bottom stack
export function stackX(i, count, onLeft) {
  const s = BLADE.scale;
  if (onLeft) return (22 + 41 * i) * s - 1.8;
  return along() - (1280 - (1.1416 * (924 - 40 * (count - 1 - i)) - 1.8) - BLADE.rightNudge) * (s / 1.1416);
}

const sy = () => 1.0945 * across() / 720;
// the strip art starts this far before the blade's box (40 px at the 1280x720 scale)
const artOffset = () => 40 * BLADE.scale / 1.1416;

// stage px a strip sits further along its length than its design position, for a (fractional) depth in its stack
function notchShift(onLeft, depth) {
  const notch = onLeft ? NOTCH.left + NOTCH.leftStep * depth : NOTCH.right + NOTCH.rightStep * depth;
  return (notch - NOTCH_DESIGN) * across() / 720;
}

// Points (stage px) along the outer edge of a stack's outermost strip, moved `inset` path units inward,
// top to bottom (left to right on a portrait phone). The colour background is clipped to the area between
// the two stacks.
export function outerEdge(count, onLeft, depth, inset) {
  const side = onLeft ? UNMIRRORED : MIRRORED;
  const x0 = stackX(onLeft ? 0 : count - 1, count, onLeft) - artOffset();
  const y0 = -61.8 * across() / 720 + notchShift(onLeft, depth) - 73.41 * sy();
  const pts = [];
  for (let seg = 0; seg < 2; seg++) {
    const [p0, p1, p2, p3] = EDGE.slice(seg * 3, seg * 3 + 4);
    for (let k = seg ? 1 : 0; k <= 12; k++) {
      const t = k / 12, u = 1 - t;
      const bx = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0];
      const by = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1];
      const a = x0 + (side.mx + side.dir * (bx + inset)) * BLADE.scale, b = y0 + by * sy();
      pts.push(STAGE.portrait ? [b, a] : [a, b]);
    }
  }
  return pts;
}

function el(name, attrs = {}, parent) {
  const n = document.createElementNS(SVG, name);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  parent?.appendChild(n);
  return n;
}

function gradient(defs, id, stops) {
  const g = el('linearGradient', { id, x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
  for (const [c, o] of stops) el('stop', { offset: o, 'stop-color': c }, g);
}

function strip(parent, side, ids) {
  const g = el('g', {}, parent);
  el('path', { d: BACK, transform: side.back, fill: `url(#${ids.back})`, stroke: 'rgba(25,25,25,.6)', 'stroke-width': 1.6, 'vector-effect': 'non-scaling-stroke', class: 'hit' }, g);
  // the active blade's colour shows on its tab panel, the part of the back the face leaves uncovered
  const tint = el('path', { d: BACK, transform: side.back, opacity: 0, 'pointer-events': 'none' }, g);
  el('path', { d: FACE, transform: side.face, fill: `url(#${ids.face})`, stroke: 'rgba(40,40,40,.55)', 'stroke-width': 1.3, 'vector-effect': 'non-scaling-stroke', class: 'hit' }, g);
  // bright rim just inside the face edge
  el('path', { d: FACE, transform: `${side.face} translate(2.5 0)`, fill: 'none', stroke: 'rgba(255,255,255,.9)', 'stroke-width': 1.2, 'vector-effect': 'non-scaling-stroke' }, g);
  return { g, tint };
}

export function createBlade(blade, index) {
  const root = document.createElement('div');
  root.className = 'blade';
  root.dataset.index = index;
  root.style.zIndex = String(10 + index);

  const svg = el('svg', { class: 'blade-art' });
  const defs = el('defs', {}, svg);
  const ids = { back: `b${index}-back`, face: `b${index}-face` };
  gradient(defs, ids.back, BACK_STOPS);
  gradient(defs, ids.face, FACE_STOPS);
  const scaler = el('g', {}, svg);
  const right = strip(scaler, MIRRORED, ids);
  const left = strip(scaler, UNMIRRORED, ids);
  for (const v of [left, right]) v.tint.setAttribute('fill', blade.colour.front[1][0]);
  root.appendChild(svg);

  const label = document.createElement('div');
  label.className = 'tab-label';
  label.textContent = blade.tab;
  root.appendChild(label);

  const content = document.createElement('div');
  content.className = 'blade-content';
  root.appendChild(content);

  const parts = { root, content, label, svg, scaler, left, right, blade };
  sizeBlade(parts);
  return parts;
}

// Fit a blade's art to the current stage size (called on creation and when the layout changes).
export function sizeBlade(p) {
  p.svg.setAttribute('width', Math.ceil(161 * BLADE.scale));
  p.svg.setAttribute('height', across());
  p.svg.style.left = STAGE.portrait ? '0' : `${-artOffset()}px`;
  p.svg.style.top = STAGE.portrait ? `${-artOffset()}px` : '0';
  p.shift = null;
  p.root.style.height = `${STAGE.h}px`;
  // content sits beside the active strip, or below it on a portrait phone
  p.content.style.left = STAGE.portrait ? '0' : `${BLADE.contentX}px`;
  p.content.style.top = STAGE.portrait ? `${BLADE.contentX}px` : '0';
}

// Lay out all blades for a (possibly fractional) active index t.
export function layoutBlades(parts, t) {
  const n = parts.length;
  parts.forEach((p, i) => {
    const arrive = clamp01(t - (i - 1));   // 0 = waiting on the right (bottom), 1 = in the left (top) stack
    const covered = clamp01(t - i);        // 1 = covered by the next blade
    const active = arrive * (1 - covered);
    const onLeft = arrive >= 0.5;
    const x = stackX(i, n, false) + (stackX(i, n, true) - stackX(i, n, false)) * arrive;
    p.root.style.transform = STAGE.portrait ? `translate3d(0,${x.toFixed(2)}px,0)` : `translate3d(${x.toFixed(2)}px,0,0)`;
    p.root.style.zIndex = String(onLeft ? 10 + i : 100 - i);
    p.root.classList.toggle('on-left', onLeft);

    // depth in each stack (0 = next to the content); the strip slides between the two notch heights
    const shift = notchShift(true, Math.max(0, t - i)) * arrive + notchShift(false, Math.max(0, i - 1 - t)) * (1 - arrive);
    if (shift !== p.shift || onLeft !== p.onLeft) {
      p.shift = shift;
      p.onLeft = onLeft;
      p.scaler.setAttribute('transform', `translate(0 ${(-61.8 * across() / 720 + shift).toFixed(2)}) scale(${BLADE.scale} ${sy().toFixed(4)})`);
      p.left.g.style.display = onLeft ? '' : 'none';
      p.right.g.style.display = onLeft ? 'none' : '';
    }

    const k = active * active * (3 - 2 * active);
    (onLeft ? p.left : p.right).tint.setAttribute('opacity', (0.6 * k).toFixed(3));

    const lx = (BLADE.labelLeft * arrive + BLADE.labelRight * (1 - arrive)) * BLADE.scale / 1.1416;
    const ly = (NOTCH_DESIGN + 14) * across() / 720 + shift;
    p.label.style.transform = STAGE.portrait ? `translate(${ly.toFixed(1)}px, ${lx.toFixed(1)}px)` : `translate(${lx.toFixed(1)}px, ${ly.toFixed(1)}px)`;
    p.label.style.color = k > 0.5 ? 'rgba(15,15,15,.75)' : 'rgba(15,15,15,.59)';

    p.content.style.opacity = (k * k).toFixed(3);
    p.content.style.visibility = k > 0.01 ? 'visible' : 'hidden';
    p.root.classList.toggle('is-active', active > 0.5);
  });
}
