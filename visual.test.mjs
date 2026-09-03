// Screenshots the real game in a real browser, from the built zip's HTML.
//   node shots.mjs [outdir]
// Dev-only: puppeteer-core drives the locally installed Chrome, nothing is
// downloaded and nothing here ships. Exits non-zero on a console error, so
// this doubles as a smoke test the headless harness cannot do.
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const OUT = process.argv[2] || 'shots';
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);
if (!CHROME) throw new Error('no local Chrome or Edge found');
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('console', m => m.type() === 'error' && errors.push('console: ' + m.text()));

await page.setViewport({ width: 700, height: 700 });
await page.goto('file:///' + resolve('index.html').replace(/\\/g, '/'));
await page.waitForFunction('!!window.__T');

const T = () => page.evaluate(() => window.__T);
const shot = async name => {
  await page.evaluate(() => window.__T.draw());
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log('  ' + name);
};

// Drive the game through its states. Everything runs in page context because
// __T holds live references the game closes over.
const run = fn => page.evaluate(fn);

await shot('01-title');

await run(() => { const T = window.__T; T.setScene(1); T.newRun() });
await shot('02-meadow-noon');

await run(() => { const T = window.__T; T.run.t = T.DUSK + 1 });
await shot('03-meadow-dusk');

await run(() => { const T = window.__T; T.run.t = T.DARK + 1 });
await shot('04-meadow-dark');

// standing at a site, with the prompt bar and a message plate
await run(() => {
  const T = window.__T, s = T.SITES.find(s => s.id === 'bramble');
  T.newRun(); T.run.x = s.x; T.run.y = s.y + 20; T.act(s, 1);
});
await shot('05-bramble-message');

// the death overlay
await run(() => {
  const T = window.__T, s = T.SITES.find(s => s.id === 'pond');
  T.newRun(); T.run.x = s.x; T.run.y = s.y; T.act(s, 0);
});
await shot('06-death');

// a full board: every band set, the foal in the meadow, at the gate
await run(() => {
  const T = window.__T;
  T.newRun();
  T.act(T.SITES.find(s => s.id === 'stone'), 0);
  T.act(T.SITES.find(s => s.id === 'bramble'), 1);
  T.act(T.SITES.find(s => s.id === 'hollow'), 1);
  T.act(T.SITES.find(s => s.id === 'pond'), 1);
  T.run.t = T.DUSK + 1;
  T.act(T.SITES.find(s => s.id === 'ring'), 1);
  T.run.bands.green = 1;
  const g = T.SITES.find(s => s.id === 'gate');
  T.run.x = g.x; T.run.y = g.y + 26; T.run.in = ''; T.update(0.05);
});
await shot('07-gate-full');

await run(() => window.__T.setJournal(1));
await shot('08-journal');
await run(() => window.__T.setJournal(0));

await run(() => { const T = window.__T; T.setScene(2); T.run.end = 1 });
await shot('09-ending-standard');
await run(() => { window.__T.run.end = 2 });
await shot('10-ending-true');

// portrait phone, which is how the Mobile category will see it
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await run(() => { const T = window.__T; T.setScene(1); T.newRun(); T.setTouch(null) });
await shot('11-phone-portrait');

// ---------- pixel probes ----------
// Screenshots catch what the headless harness cannot, but only if someone
// looks. These assert the two things that already went wrong once.
await page.setViewport({ width: 640, height: 640 });
await run(() => { const T = window.__T; T.setScene(1); T.newRun(); T.draw() });

const probe = pts => page.evaluate(pts => {
  const S = Math.min(innerWidth, innerHeight) / 320;
  const ox = (innerWidth - 320 * S) / 2, oy = (innerHeight - 320 * S) / 2;
  const g = document.getElementById('c').getContext('2d');
  return pts.map(([x, y]) =>
    Array.from(g.getImageData((ox + x * S) | 0, (oy + y * S) | 0, 1, 1).data));
}, pts);

const near = (a, b, tol) =>
  Math.abs(a[0] - b[0]) < tol && Math.abs(a[1] - b[1]) < tol && Math.abs(a[2] - b[2]) < tol;

// The gate arch is painted across the top of its circle and open underneath.
// An anticlockwise arc drew the bowl instead and it looked like an M.
// Each arch point is compared against background at the SAME height: the sky
// fades into the meadow, so crown-vs-bowl on their own proves nothing.
await run(() => {
  const T = window.__T;
  T.BANDS.forEach(b => T.run.bands[b] = 1);   // full alpha makes the stroke unambiguous
  T.draw();
});
const [crown, refTop, bowl, refBot] =
  await probe([[160, 43], [122, 43], [160, 77], [122, 77]]);
// Unset bands are the only thing telling the player there are seven of
// anything; white on the pale sky made them invisible at zero bands.
await run(() => { const T = window.__T; T.newRun(); T.draw() });
const [slot, sky] = await probe([[103, 12], [40, 12]]);

const checks = [
  [!near(crown, refTop, 8), 'gate arch is painted across the top of its circle'],
  [near(bowl, refBot, 8), 'gate arch is open underneath, not a bowl'],
  [!near(slot, sky, 10), 'unset rainbow slots read against the sky'],
];
for (const [good, name] of checks) {
  console.log((good ? '  ok   ' : '  FAIL ') + name);
  if (!good) errors.push('pixel: ' + name);
}

await browser.close();
if (errors.length) {
  console.error('FAILURES:');
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log('clean: no console errors, no page errors, pixel probes pass');
