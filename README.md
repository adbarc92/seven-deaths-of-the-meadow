# Seven Deaths of the Meadow

js13kGames 2026 entry. Theme: **Unicorns and Rainbows**.

A sunlit pastel meadow with a unicorn shrine at its centre. You die in about
ninety seconds. Nothing carries over between runs except what you personally
worked out.

The design is fixed and documented. Read these before changing anything:

| File | Authority over |
|---|---|
| [DESIGN.md](DESIGN.md) | the loop, the state model, what may not be cut |
| [CONTENT.md](CONTENT.md) | every string in the game, and the voice rules |
| [ART.md](ART.md) | palette, drawing conventions, the colourblind constraint |
| [JS13K.md](JS13K.md) | competition rules, build pipeline, submission checklist |
| [docs/STATUS.md](docs/STATUS.md) | where the work actually is right now |

`DESIGN.md` section 9 is a list of things that look like oversights and are
not. It is worth reading before proposing an engine, a scene graph, or a
data-driven puzzle format.

## Build

```sh
npm install
npm run build      # writes game.zip, fails over 13312 bytes
npm run max        # slower roadroller search, for the final submit
```

The build inlines and minifies the script, builds **both** a plain-minified and
a roadrolled candidate, zips each, runs `advzip -z -4`, and ships whichever is
smaller. The size gate is the build: it exits non-zero over budget.

## Test

```sh
npm test           # 76 checks, no browser needed
npm run shots      # Chrome + Firefox: screenshots, pixel probes, zip smoke test
```

`npm test` loads the inline script under node with a stub 2d context
(`harness.mjs`) and drives the real game state — sites, the clock, the foal,
both endings, the run/meta boundary, and the CONTENT.md voice rules. The test
hooks live inside a `/*TEST*/` fence that the build strips, so they cost zero
shipped bytes.

`npm run shots` drives the locally installed Chrome and Firefox through
`puppeteer-core` (nothing is downloaded). It screenshots every scene into
`shots/`, asserts on canvas pixels, and — importantly — inflates `game.zip`
and plays *the extracted entry* with real key events. That last part is the
JS13K.md section 5 checklist item; the dev file is not the entry.

## Playing

Move with `WASD` or the arrow keys. One interact key, `E`. Intent is expressed
by duration, not by a menu: **tap** to take, **hold** to give. `J` shows what
you remember.

On a phone: **drag to walk, press to interact.** A touch that has not
travelled is the tap/hold verb; one that has is a floating stick. The HUD strip
at the top opens the journal.

## Before submitting

- Set `AUTHOR` at the top of the script in [index.html](index.html) — it is
  empty, and the ending renders no byline until it is filled in.
- `npm run max`, then upload `game.zip`.
