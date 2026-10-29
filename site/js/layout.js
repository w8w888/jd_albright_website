// Stage and blade geometry. The stage always fills the viewport: its height is 720 logical px (landscape)
// and its width follows the viewport's aspect ratio, so wider screens get more room between the content and
// the right-hand blades. Narrow landscape screens keep a minimum width and grow taller instead. Portrait
// phones get a 560-wide stage with the blades turned sideways (stacked top and bottom, see blades.js) and the
// content in one column between them (see #stage.portrait in the CSS).
// At 1280x720 everything matches reference/screenshots/live-blade-signed-out.png.

export const STAGE = { w: 0, h: 720, portrait: false };   // set by setLayout

const LANDSCAPE = {
  scale: 1.1416,        // XUI units → stage px (fitted to the 1280x720 capture)
  contentX: 57,         // content offset from the active blade's box
  rightNudge: 15,       // px (at 1280 scale) the right stack sits right of its decoded position
  labelLeft: 62,        // tab label x inside a left-stack strip
  labelRight: 46,       // … and a right-stack strip
  switchMs: 340,        // one blade step (decoded: 20–24 frames at 60 fps)
};
// on a portrait phone: strip thickness, content offset below the active strip, bottom stack offset
const PORTRAIT = { scale: 0.8, contentX: 70, rightNudge: 88, labelLeft: 57 };

const MIN_LANDSCAPE_W = 1280;   // content plus both blade stacks fit from here up
const PORTRAIT_W = 560;

export const BLADE = { ...LANDSCAPE };

// Pick the layout for a viewport size. Returns true if the stage geometry changed.
export function setLayout(vw, vh) {
  const ratio = vw / vh;
  const portrait = ratio < 0.8;
  let w, h;
  if (portrait) { w = PORTRAIT_W; h = Math.round(PORTRAIT_W / ratio); }
  else if (720 * ratio >= MIN_LANDSCAPE_W) { h = 720; w = Math.round(720 * ratio); }
  else { w = MIN_LANDSCAPE_W; h = Math.round(MIN_LANDSCAPE_W / ratio); }
  if (portrait === STAGE.portrait && w === STAGE.w && h === STAGE.h) return false;
  Object.assign(STAGE, { w, h, portrait });
  Object.assign(BLADE, LANDSCAPE, portrait ? PORTRAIT : {});
  return true;
}
