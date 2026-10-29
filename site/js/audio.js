// Dashboard sounds via Web Audio. Sound is on by default; browsers keep the context suspended until the
// first click/tap/key, so nothing plays before that. Mute choice is remembered per browser.
const BASE = 'assets/sounds/';
const FILES = {
  switch1: 'dashmain/dash_BladeSwitch_1.mp3',
  switch2: 'dashmain/dash_BladeSwitch_2.mp3',
  switch3: 'dashmain/dash_BladeSwitch_3.mp3',
  switch4: 'dashmain/dash_BladeSwitch_4.mp3',
  land: 'dashmain/dash_BladeLand.mp3',
  open2: 'dashmain/dash_2ndLevelOpen.mp3',
  close2: 'dashmain/dash_2ndLevelClose.mp3',
  open3: 'dashmain/dash_3rdLevelOpen.mp3',
  close3: 'dashmain/dash_3rdLevelClose.mp3',
  blink: 'dashmain/dash_Blink.mp3',
  focus: 'shrdres/btn_Focus.mp3',
  select: 'shrdres/btn_Select.mp3',
  back: 'shrdres/btn_Back.mp3',
  inactiveFocus: 'shrdres/btn_InactiveFocus.mp3',
  inactiveSelect: 'shrdres/btn_InactiveSelect.mp3',
  tab: 'dashcomm/tab_Switch.mp3',
};

let ctx = null;
const buffers = {};
let muted = false;
try { muted = localStorage.getItem('dash-muted') === '1'; } catch {}

export function initAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  for (const [name, file] of Object.entries(FILES)) {
    fetch(BASE + file)
      .then((r) => r.arrayBuffer())
      .then((b) => ctx.decodeAudioData(b))
      .then((buf) => { buffers[name] = buf; })
      .catch(() => {});
  }
  const unlock = () => { if (ctx.state === 'suspended') ctx.resume(); };
  for (const ev of ['pointerdown', 'keydown', 'touchend']) window.addEventListener(ev, unlock, { capture: true, passive: true });
}

export function play(name) {
  if (muted || !ctx || ctx.state !== 'running') return;
  const buf = buffers[name];
  if (!buf) return;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(ctx.destination);
  src.start();
}

export function isMuted() { return muted; }
export function setMuted(v) {
  muted = v;
  try { localStorage.setItem('dash-muted', v ? '1' : '0'); } catch {}
}
