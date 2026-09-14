// Loads index.html's inline script in node with a stub canvas, so the game
// can be driven and asserted without a browser. Used by test.mjs.
import { readFileSync } from 'fs';
import vm from 'vm';

// A 2d context that swallows every draw call. Nothing here asserts on
// rendering; it exists so the game's draw path can run without a DOM.
function stubCtx() {
  const grad = { addColorStop() {} };
  return new Proxy({
    canvas: { width: 320, height: 320 },
    createLinearGradient: () => grad,
    createRadialGradient: () => grad,
    measureText: t => ({ width: t.length * 4 }),
    globalAlpha: 1, fillStyle: '', strokeStyle: '', lineWidth: 1,
    font: '', textAlign: '', lineCap: '',
  }, {
    get: (o, k) => (k in o ? o[k] : () => {}),
    set: (o, k, v) => (o[k] = v, true),
  });
}

export function load(search = '') {
  const src = readFileSync('index.html', 'utf8');
  const a = src.indexOf('<script>'), b = src.indexOf('</script>', a);
  const js = src.slice(a + 8, b);

  const canvas = { width: 320, height: 320, getContext: () => stubCtx(), addEventListener() {}, style: {} };
  const ctx = {
    document: {
      getElementById: () => canvas,
      addEventListener() {}, body: { addEventListener() {} },
      title: '',
    },
    location: { search },
    innerWidth: 800, innerHeight: 600, devicePixelRatio: 1,
    requestAnimationFrame: () => 0,   // the real loop never starts; tests step manually
    console, Math, Date, performance: { now: () => 0 },
    addEventListener() {}, setTimeout: (f) => (f(), 0),
    // Records every tone the game asks for, so audio can be asserted on.
    AudioContext: function () {
      this.currentTime = 0;
      this.destination = {};
      // setTargetAtTime keeps the last target as .v: the game wraps audio in
      // try/catch, so a missing method would otherwise pass as silence.
      this.createGain = () => ({ gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {}, setTargetAtTime(v) { this.v = v } }, connect() {} });
      this.createOscillator = () => ({
        frequency: { setTargetAtTime(v) { this.v = v } }, connect() {},
        start() {}, stop() {},
        set type(v) { }, get type() { return '' },
      });
    },
  };
  ctx.window = ctx; ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(js, ctx, { filename: 'index.html' });
  if (!ctx.__T) throw new Error('harness hooks missing - is the /*TEST*/ fence intact?');
  return ctx.__T;
}

// --- driving helpers -------------------------------------------------
// Walk to a site by teleporting: movement is not what these tests cover.
export function goto(T, id) {
  const s = T.SITES.find(s => s.id === id);
  if (!s) throw new Error('no site ' + id);
  T.run.x = s.x; T.run.y = s.y;
  return s;
}

// Step the simulation. dt is clamped to 0.05 in the game, so stay at or under.
export function tick(T, dt = 0.05, n = 1) { for (let i = 0; i < n; i++) T.update(dt) }

// Stand at a site. Movement is covered by its own test; everywhere else the
// walk is not what is under test.
export function at(T, id) {
  const s = T.SITES.find(s => s.id === id);
  if (!s) throw new Error('no site ' + id);
  T.run.x = s.x; T.run.y = s.y; T.run.in = '';
  return s;
}

// Walk there for real, with the movement keys, and report the seconds taken.
export function walk(T, x, y, limit = 40) {
  let t = 0;
  const k = T.keys;
  for (; t < limit; t += 0.05) {
    const dx = x - T.run.x, dy = y - T.run.y;
    if (Math.hypot(dx, dy) < 3) break;
    k.d = dx > 1 ? 1 : 0; k.a = dx < -1 ? 1 : 0;
    k.s = dy > 1 ? 1 : 0; k.w = dy < -1 ? 1 : 0;
    T.update(0.05);
    if (T.run.dead) break;
  }
  k.d = k.a = k.s = k.w = 0;
  return t;
}
