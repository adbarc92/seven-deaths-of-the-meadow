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
    addEventListener() {},
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
