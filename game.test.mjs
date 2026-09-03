// Regression tests for Seven Deaths of the Meadow.
//   node game.test.mjs
// Two groups: the game's rules (driven headlessly through harness.mjs) and
// the shipped artifact (does build.mjs still emit a valid, in-budget zip).
import { execFileSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { load, at, tick, walk } from './harness.mjs';

let pass = 0; const fails = [];
const ok = (cond, name) => cond ? pass++ : fails.push(name);
const group = n => console.log('\n' + n);

// Start a run already in the meadow, at a chosen point on the clock.
function begin(T, t = 0) { T.setScene(1); T.newRun(); T.run.t = t; return T.run }

// ---------- the game's own self-check ----------
group('self-check');
{
  const T = load();
  ok(T.selfTest().length === 0, 'in-game selfTest passes');
}

// ---------- site rules ----------
group('sites');
{
  const T = load();

  begin(T); T.act(at(T, 'bramble'), 0);
  ok(T.run.dead, 'bramble tap kills');

  begin(T);
  T.act(at(T, 'bramble'), 1);
  ok(!T.run.dead && T.run.bands.red && T.run.berry, 'bramble hold sets red and yields the berry');
  T.act(at(T, 'bramble'), 1);
  ok(T.run.dead, 'bramble hold twice kills');

  begin(T); T.act(at(T, 'stone'), 0);
  ok(T.run.bands.indigo, 'stone sets indigo');

  begin(T); T.act(at(T, 'hollow'), 0);
  ok(T.run.dead, 'hollow tap kills');

  begin(T); T.act(at(T, 'hollow'), 1);
  ok(T.run.dead, 'hollow hold with an empty hand kills');

  begin(T);
  T.act(at(T, 'bramble'), 1); T.act(at(T, 'hollow'), 1);
  ok(!T.run.dead && T.run.bands.orange, 'berry then hold at the hollow sets orange');
  ok(!T.run.berry, 'the hollow consumes the berry');
  T.act(at(T, 'hollow'), 1);
  ok(T.run.dead, 'a second offering at the hollow kills - the debt was settled once');

  begin(T); T.act(at(T, 'pond'), 0);
  ok(T.run.dead, 'pond tap kills');

  begin(T); T.act(at(T, 'pond'), 1);
  ok(!T.run.dead && T.run.bands.blue, 'pond hold sets blue');
}

// ---------- the clock (DESIGN.md s4: noon and dusk are positions on it) ----------
group('clock');
{
  const T = load();

  begin(T, 0); at(T, 'ring'); tick(T);
  ok(T.run.dead, 'standing in the ring at noon kills');

  begin(T, T.DUSK + 1); at(T, 'ring'); tick(T);
  ok(!T.run.dead, 'the ring is safe at dusk');
  T.act(at(T, 'ring'), 1);
  ok(T.run.bands.yellow, 'walking the ring at dusk sets yellow');
  ok(!T.run.name, 'the name is not handed over on the first dusk visit');
  T.act(at(T, 'ring'), 1);
  ok(T.run.name, 'returning to the ring at dusk finds the name');

  begin(T, T.CLOSE - 0.01); tick(T);
  ok(T.run.dead && /Dark/.test(T.run.dead), 'the meadow closes at full dark');

  begin(T, 0);
  ok(T.phase() === 0, 'noon at t=0');
  T.run.t = T.DUSK + 1; ok(T.phase() === 1, 'dusk after DUSK');
  T.run.t = T.DARK + 1; ok(T.phase() === 2, 'dark after DARK');
}

// ---------- the foal (green depends on blue) ----------
group('foal');
{
  const T = load();
  const foal = T.SITES.find(s => s.id === 'foal');

  begin(T);
  T.run.x = foal.x; T.run.y = foal.y; tick(T);
  ok(!T.run.foal, 'the foal is not in the meadow before the pond is solved');

  begin(T);
  T.act(at(T, 'pond'), 1);
  T.run.x = foal.x; T.run.y = foal.y; T.run.in = ''; tick(T);
  ok(T.run.foal, 'the foal falls in behind you once blue is set');

  T.act(at(T, 'stone'), 0);
  ok(T.run.dead && /same price twice/.test(T.run.dead), 'any other site while following kills');

  begin(T);
  T.act(at(T, 'pond'), 1);
  T.run.x = foal.x; T.run.y = foal.y; T.run.in = ''; tick(T);
  T.act(at(T, 'pond'), 1);
  ok(!T.run.dead && T.run.bands.green, 'the foal drinks at the pond and sets green');
  ok(!T.run.foal, 'the foal stops following once it has drunk');

  // the ambient path has to enforce the rule too, not just the verb path
  begin(T);
  T.act(at(T, 'pond'), 1);
  T.run.x = foal.x; T.run.y = foal.y; T.run.in = ''; tick(T);
  at(T, 'ring'); T.run.t = T.DUSK + 1; tick(T);
  ok(T.run.dead, 'walking into an ambient site while following kills');
}

// ---------- the gate and both endings ----------
group('endings');
{
  const T = load();

  begin(T); at(T, 'gate'); tick(T);
  ok(T.run.dead && /unfinished/.test(T.run.dead), 'the gate kills you with fewer than six bands');

  // full run, standard ending
  const six = (T, withName) => {
    begin(T, 0);
    T.act(at(T, 'stone'), 0);                       // indigo
    T.act(at(T, 'bramble'), 1);                     // red + berry
    T.act(at(T, 'hollow'), 1);                      // orange
    T.act(at(T, 'pond'), 1);                        // blue
    const f = T.SITES.find(s => s.id === 'foal');
    T.run.x = f.x; T.run.y = f.y; T.run.in = ''; tick(T);
    T.act(at(T, 'pond'), 1);                        // green
    T.run.t = T.DUSK + 1;
    T.act(at(T, 'ring'), 1);                        // yellow
    if (withName) T.act(at(T, 'ring'), 1);          // the name
    return T.run;
  };

  let r = six(T, false);
  ok(!r.dead, 'six bands are reachable in a single run without dying');
  ok(T.setBands() === 6, 'six bands are set before the gate');
  at(T, 'gate'); tick(T);
  ok(r.bands.violet, 'the seventh band arrives on its own');
  ok(T.setBands() === 7, 'all seven bands set at the gate');
  T.act(T.SITES.find(s => s.id === 'gate'), 0);
  ok(r.end === 1 && T.scene === 2, 'entering the gate gives the standard ending');

  r = six(T, true);
  ok(r.name, 'the true name is held');
  at(T, 'gate'); tick(T);
  T.act(T.SITES.find(s => s.id === 'gate'), 1);
  ok(r.end === 2, 'speaking the name at the gate gives the true ending');

  r = six(T, false);
  at(T, 'gate'); tick(T);
  T.act(T.SITES.find(s => s.id === 'gate'), 1);
  ok(r.end === 1, 'speaking without the name still gives the standard ending');
}

// ---------- the state boundary (DESIGN.md s5) ----------
group('state boundary');
{
  const T = load();
  begin(T); T.act(at(T, 'bramble'), 1);
  const deaths = T.meta.deaths;
  T.act(at(T, 'bramble'), 1);
  const before = T.meta.journal.length;
  T.newRun();
  ok(!T.run.bands.red && !T.run.berry && !T.run.name, 'run state is destroyed on respawn');
  ok(T.run.t === 0, 'the clock restarts on respawn');
  ok(T.meta.journal.length === before, 'journal survives respawn');
  ok(T.meta.deaths === deaths + 1, 'death counter survives respawn');

  // No third scope, no new meta field. (DESIGN.md s5)
  ok(Object.keys(T.meta).sort().join() === 'deaths,journal', 'meta holds exactly journal and deaths');
}

// ---------- layout: R1, and unambiguous sites ----------
group('layout');
{
  const T = load();
  begin(T);
  const fixed = T.SITES.filter(s => s.id !== 'foal');

  // R1: under 20 seconds from respawn to any puzzle state.
  let worst = 0, worstId = '';
  for (const s of fixed) {
    begin(T);
    const t = walk(T, s.x, s.y);
    if (t > worst) { worst = t; worstId = s.id }
  }
  ok(worst < 20, `every site is under 20s from respawn (worst: ${worstId} at ${worst.toFixed(1)}s)`);

  // nearest() returns the first match, so overlapping prompt rings would make
  // a site permanently unreachable.
  let overlap = '';
  for (let i = 0; i < fixed.length; i++)
    for (let j = i + 1; j < fixed.length; j++) {
      const a = fixed[i], b = fixed[j];
      if (Math.hypot(a.x - b.x, a.y - b.y) <= a.r + b.r + 28) overlap = a.id + '/' + b.id;
    }
  ok(!overlap, 'no two sites have overlapping prompt rings: ' + overlap);

  begin(T);
  ok(T.nearest() && T.nearest().id === 'stone', 'you wake within reach of the stone');
}

// ---------- input ----------
group('input');
{
  const T = load();
  const key = (k, repeat) => T.onkeydown({ key: k, repeat, preventDefault() {} });

  T.setScene(0); key('x');
  ok(T.scene === 1, 'any key leaves the title');

  begin(T); T.run.dead = 'x'; key('j');
  ok(!T.run.dead, 'any key respawns, including J');

  begin(T);
  ok(!T.journalOpen, 'the journal starts closed');
  key('j'); ok(T.journalOpen, 'J opens the journal');
  key('j', 1);   // odd count: an unguarded repeat would toggle it shut
  ok(T.journalOpen, 'auto-repeat does not strobe the journal');
  key('j', 1); key('j', 1); key('j', 1);
  ok(T.journalOpen, 'held J stays open however long it repeats');
  key('j'); ok(!T.journalOpen, 'J closes it again');

  // The clock is a resource, so reading costs time - but you stand still.
  begin(T); T.setJournal(1);
  T.keys.d = 1;
  const x = T.run.x, t0 = T.run.t;
  tick(T, 0.05, 10);
  ok(T.run.x === x, 'you do not walk while reading the journal');
  ok(T.run.t > t0, 'the clock keeps running while reading');
  T.keys.d = 0; T.setJournal(0);

  // Drag walks, a press that has not travelled is the verb.
  begin(T);
  const start = T.run.x;
  T.setTouch({ x: 100, y: 100, dx: 40, dy: 0, moved: 1 });
  tick(T, 0.05, 6);
  ok(T.run.x > start + 10, 'dragging walks the unicorn');

  begin(T); at(T, 'bramble');
  T.setTouch({ x: 0, y: 0, dx: 0, dy: 0, moved: 0 });
  tick(T, 0.05, Math.ceil(T.HOLD / 0.05) + 1);
  ok(T.run.bands.red, 'a still press reaching the hold threshold gives the hold verb');

  begin(T); at(T, 'bramble');
  T.setTouch({ x: 0, y: 0, dx: 0, dy: 0, moved: 0 });
  tick(T, 0.05, 2);
  ok(!T.run.dead && !T.run.bands.red, 'a short still press has not fired either verb yet');
}

// ---------- audio ----------
group('audio');
{
  const T = load();
  let threw = '';
  try {
    begin(T);
    T.act(at(T, 'stone'), 0);   // sets a band -> chime on the next tick
    tick(T);
    T.act(at(T, 'pond'), 0);    // death tone
    const g = T.SITES.find(s => s.id === 'gate');
    begin(T); T.run.name = 1; g.act(1);   // the ending arpeggio
  } catch (e) { threw = e.message }
  ok(!threw, 'audio never throws: ' + threw);
}

// ---------- prose rules (CONTENT.md s1) ----------
group('prose');
{
  const T = load();
  const lines = [];
  for (const s of T.SITES) {
    for (const held of [0, 1]) {
      for (let i = 0; i < 3; i++) {
        begin(T); T.run.berry = i === 2 ? 1 : 0; T.run.t = i ? T.DUSK + 1 : 0;
        lines.push(String(s.act(held) || ''));
        if (s.near) { begin(T); T.run.t = i ? T.DUSK + 1 : 0; lines.push(String(s.near() || '')) }
      }
    }
  }
  const all = lines.concat(T.meta.journal).filter(Boolean);
  ok(all.length > 15, 'the prose sweep actually reached the lines');
  ok(!all.some(l => l.includes('!')), 'no exclamation marks anywhere');
  ok(!all.some(l => /\b(game over|you lose|try again|you died)\b/i.test(l)), 'no failure-state vocabulary');
  // "press a thorn" is a physical act and is canon; what CONTENT.md s1
  // forbids is prose that names a control. Test the rule, not the wording.
  ok(!all.some(l => /\b(button|keyboard|click|keypress)\b/i.test(l)), 'no line names a control');
  ok(!all.some(l => /\[[A-Za-z]\]/.test(l)), 'no line embeds a key hint');
  ok(T.meta.journal.every(j => j.split(/\s+/).length <= 10), 'journal entries stay under ten words');
  ok(!T.meta.journal.some(j => /\bbecause\b|\bso that\b|\bin order\b/i.test(j)), 'journal records no causation');
}

// ---------- rendering ----------
group('rendering');
{
  const T = load();
  let threw = '';
  try {
    T.setScene(0); T.draw();                       // title
    begin(T);
    for (const t of [0, T.DUSK + 1, T.DARK + 1]) { T.run.t = t; T.draw() }
    T.act(at(T, 'pond'), 1); T.draw();             // with the foal in the meadow
    T.run.dead = 'x'; T.draw();                    // death overlay
    T.setScene(2); T.run.end = 1; T.draw();
    T.run.end = 2; T.draw();
  } catch (e) { threw = e.message }
  ok(!threw, 'draw survives every scene and every hour: ' + threw);

  // Long prose has to fit the 320x320 box, not run off the bottom.
  const trueEnd = 'You say the name written under the tallest face.\nSeven colors come apart into one.\nThe thing on the other side was never a unicorn. It was something divided seven ways a long time ago, and every rule you learned was it asking, politely, to be put back together.\nIt does not need the meadow now.\nNeither, it turns out, do you.';
  ok(96 + T.layout(trueEnd, 250, 7).length * 10 < 285, 'the true ending fits above the title line');
}

// ---------- the shipped artifact ----------
group('build');
{
  execFileSync('node', ['build.mjs'], { stdio: 'pipe' });
  ok(existsSync('game.zip'), 'build emits game.zip');
  const zip = readFileSync('game.zip');
  ok(zip.readUInt32LE(0) === 0x04034b50, 'game.zip has a valid local file header');
  ok(zip.length <= 13312, `game.zip is within budget (${zip.length} / 13312)`);

  const out = readFileSync('dist/index.html', 'utf8');
  ok(/<\/script>/.test(out), 'shipped html closes its script tag');
  // Assert stripping against the unpacked candidate: roadroller's payload is
  // arbitrary bytes and will match any short needle by chance.
  const plain = readFileSync('dist/index.minify.html', 'utf8');
  ok(!/\/\*TEST\*\//.test(plain) && !plain.includes('__T') && !plain.includes('selfTest'),
    'self-checks are stripped from the bundle');
  ok(out.startsWith('<!DOCTYPE html>'), 'shipped html keeps the doctype (standards mode)');
  ok(!/https?:\/\//.test(out), 'no external references - the zip must run offline');
}

// ---------- report ----------
console.log(`\n${pass} passed, ${fails.length} failed`);
for (const f of fails) console.log('  FAIL  ' + f);
process.exit(fails.length ? 1 : 0);
