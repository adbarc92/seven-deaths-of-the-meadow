// js13k build + size gate. Fails loudly over 13312 bytes.
//   node build.mjs            build, auto-A/B roadroller, report size
//   node build.mjs --keep     also leave dist/ artifacts for inspection
//
// Pipeline: strip tests -> IIFE-wrap -> esbuild --minify -> [roadroller]
//           -> inline into minified HTML -> deflate zip -> advzip -z -4
// Roadroller only wins above ~6KB of minified JS (JS13K.md s3), so both
// candidates are built every time and the smaller zip is kept.
import { execFileSync } from 'child_process';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import zlib from 'zlib';
import advzip from 'advzip-bin';
import * as esbuild from 'esbuild';
import { Packer } from 'roadroller';

const SRC = 'index.html', OUT = 'dist', LIMIT = 13312;
// roadroller's search is slow; --max is for the final submit, not the inner loop
const ROLL_LEVEL = process.argv.includes('--max') ? 2 : 1;

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// ---------- 1. split the source shell from the inline script ----------
const src = readFileSync(SRC, 'utf8');
const a = src.indexOf('<script>'), b = src.indexOf('</script>', a);
if (a < 0 || b < 0) throw new Error('no inline <script> block in ' + SRC);
const head = src.slice(0, a), tail = src.slice(b + 9);
let js = src.slice(a + 8, b);

// dev-only self-checks never ship; see the TEST fence in index.html
js = js.replace(/\/\*TEST\*\/[\s\S]*?\/\*ENDTEST\*\//g, '');
// the IIFE is what lets esbuild mangle top-level names
writeFileSync(`${OUT}/g.js`, `(()=>{${js}})()`);

// ---------- 2. minify ----------
const min = esbuild.transformSync(`(()=>{${js}})()`, {
  minify: true, target: 'es2020',
}).code.trim();
writeFileSync(`${OUT}/g.min.js`, min);

let rolled = null;
try {
  const packer = new Packer([{ data: min, type: 'js', action: 'eval' }], {});
  await packer.optimize(ROLL_LEVEL);
  const d = packer.makeDecoder();
  const r = (d.firstLine + d.secondLine).trim();
  // a literal </script> in the packed payload would close the tag early
  if (!/<\/script/i.test(r)) { rolled = r; writeFileSync(`${OUT}/g.packed.js`, r); }
} catch (e) { console.error('  (roadroller skipped: ' + e.message + ')'); }

// ---------- 3. minified HTML shell ----------
const shell = (head + '<script>' + '</scr' + 'ipt>' + tail)
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/\s*\n\s*/g, '')
  .replace(/\s*([{};:,])\s*/g, '$1')   // css only reaches here; markup has none of these loose
  .replace(/;}/g, '}');

// ---------- 4. zip: single stored-as-deflate entry, then advzip ----------
function makeZip(html, file) {
  const name = Buffer.from('index.html'), data = Buffer.from(html);
  const comp = zlib.deflateRawSync(data, { level: 9 });
  const crc = zlib.crc32(data);
  const h = Buffer.alloc(30);
  h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(8, 8);
  h.writeUInt32LE(crc, 14); h.writeUInt32LE(comp.length, 18); h.writeUInt32LE(data.length, 22);
  h.writeUInt16LE(name.length, 26);
  const cd = Buffer.alloc(46);
  cd.writeUInt32LE(0x02014b50, 0); cd.writeUInt16LE(20, 4); cd.writeUInt16LE(20, 6);
  cd.writeUInt16LE(8, 10); cd.writeUInt32LE(crc, 16);
  cd.writeUInt32LE(comp.length, 20); cd.writeUInt32LE(data.length, 24);
  cd.writeUInt16LE(name.length, 28);
  const off = h.length + name.length + comp.length;
  const eo = Buffer.alloc(22);
  eo.writeUInt32LE(0x06054b50, 0); eo.writeUInt16LE(1, 8); eo.writeUInt16LE(1, 10);
  eo.writeUInt32LE(cd.length + name.length, 12); eo.writeUInt32LE(off, 16);
  writeFileSync(file, Buffer.concat([h, name, comp, cd, name, eo]));
  execFileSync(advzip, ['-z', '-4', '-q', file]);
  return readFileSync(file).length;
}

// ---------- 5. A/B and gate ----------
const cand = [['minify', min]];
if (rolled) cand.push(['roadroller', rolled]);
const results = cand.map(([tag, code]) => {
  const html = shell.replace('<script>', '<script>' + code);
  const f = `${OUT}/game.${tag}.zip`;
  writeFileSync(`${OUT}/index.${tag}.html`, html);
  return { tag, html, size: makeZip(html, f) };
});
results.sort((x, y) => x.size - y.size);
const win = results[0];

writeFileSync(`${OUT}/index.html`, win.html);
const size = makeZip(win.html, 'game.zip');
if (!process.argv.includes('--keep')) for (const f of ['g.js', 'g.min.js', 'g.packed.js']) rmSync(`${OUT}/${f}`, { force: true });

for (const r of results) console.log(`  ${r.tag.padEnd(11)} ${r.size}${r === win ? '  <-- shipped' : ''}`);
console.log(`\n${size} / ${LIMIT} bytes  (${LIMIT - size} free)`);
if (size > LIMIT) { console.error('OVER LIMIT'); process.exit(1); }
