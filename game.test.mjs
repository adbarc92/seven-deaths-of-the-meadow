// Regression tests for Seven Deaths of the Meadow.
//   node test.mjs
// Two groups: the game's rules (driven headlessly through harness.mjs) and
// the shipped artifact (does build.mjs still emit a valid, in-budget zip).
import { execFileSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { load, goto } from './harness.mjs';

let pass = 0; const fails = [];
const ok = (cond, name) => cond ? pass++ : fails.push(name);
const group = n => console.log('\n' + n);

// ---------- the game's own self-check ----------
group('self-check');
{
  const T = load();
  const f = T.selfTest();
  ok(f.length === 0, 'in-game selfTest passes: ' + f.join(' | '));
}

// ---------- site rules ----------
group('sites');
{
  const T = load();

  T.newRun(); goto(T, 'bramble').act(false);
  ok(T.run.dead, 'bramble tap kills');

  T.newRun();
  const br = goto(T, 'bramble');
  br.act(true);
  ok(!T.run.dead && T.run.bands.red && T.run.berry, 'bramble hold sets red and yields the berry');
  br.act(true);
  ok(T.run.dead, 'bramble hold twice kills');

  T.newRun(); goto(T, 'stone').act(false);
  ok(T.run.bands.indigo, 'stone sets indigo');
}

// ---------- the state boundary (DESIGN.md s5) ----------
group('state boundary');
{
  const T = load();
  T.newRun(); goto(T, 'bramble').act(true);
  const deathsBefore = T.meta.deaths;
  goto(T, 'bramble').act(true);
  T.newRun();
  ok(!T.run.bands.red && !T.run.berry, 'run state is destroyed on respawn');
  ok(T.meta.journal.length > 0, 'journal survives respawn');
  ok(T.meta.deaths === deathsBefore + 1, 'death counter survives respawn');
}

// ---------- prose rules (CONTENT.md s1) ----------
group('prose');
{
  const T = load();
  const lines = [];
  for (const s of T.SITES) {
    for (const held of [false, true]) {
      for (let i = 0; i < 3; i++) { T.newRun(); T.run.berry = i === 2; lines.push(String(s.act(held) || '')); }
    }
  }
  const all = lines.concat(T.meta.journal);
  ok(!all.some(l => l.includes('!')), 'no exclamation marks anywhere');
  ok(!all.some(l => /\b(game over|you lose|try again|you die)\b/i.test(l)), 'no failure-state vocabulary');
  // "press a thorn" is a physical act and is canon; what CONTENT.md s1
  // forbids is prose that names a control. Test the rule, not the wording.
  ok(!all.some(l => /\b(button|keyboard|click|keypress)\b/i.test(l)), 'no line names a control');
  ok(!all.some(l => /\[[A-Za-z]\]/.test(l)), 'no line embeds a key hint');
  ok(T.meta.journal.every(j => j.split(/\s+/).length <= 10), 'journal entries stay under ten words');
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
  ok(!/\/\*TEST\*\//.test(out) && !out.includes('__T'), 'self-checks are stripped from the bundle');
  ok(out.startsWith('<!DOCTYPE html>'), 'shipped html keeps the doctype (standards mode)');
}

// ---------- report ----------
console.log(`\n${pass} passed, ${fails.length} failed`);
for (const f of fails) console.log('  FAIL  ' + f);
process.exit(fails.length ? 1 : 0);
