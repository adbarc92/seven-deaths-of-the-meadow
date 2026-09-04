# CLAUDE.md

<!-- BEGIN: ACTIVE-SESSION-PICKUP — remove this block once the entry has been submitted and the AUTHOR line is set -->
## Active session pickup

**Read [`docs/STATUS.md`](docs/STATUS.md) before doing anything else.** Its
State summary is current as of 2026-09-03 and is rewritten every session.

Short version, so you can orient without reading it first:

- The game is **done as a build** and verified — 76/76 headless checks, a
  Chrome + Firefox pass, and a playthrough of the *extracted zip*. `npm run max`
  ships at 5193 / 13312 bytes. `main` is clean; there are no open PRs, no other
  branches, and no worktrees.
- The whole DESIGN.md s8 build order (Sep 3–12) landed on Sep 3, so the project
  is **nine days ahead of its plan**. The deadline is **05:00 America/Denver on
  Sep 13, 2026**.
- **The remaining work is not code.** Two blocking items, both needing a human:
  1. `AUTHOR` at [`index.html`](index.html) line 25 is still `''`, so the ending
     renders no byline. Ask for the name — do not invent one.
  2. **The entry has never been submitted**, though it has been submittable
     since Sep 3 and DESIGN.md s8 calls for submitting early and re-submitting
     daily. This is the only time-sensitive thing left.
- After those: watch one person play, and fix the single thing they quit over —
  as a clearer journal entry or a shorter walk, **never a softer rule**
  (CONTENT.md s6).

Before proposing any *new* work, read **DESIGN.md section 9**. It is a list of
things that look like oversights and are not — an engine, a scene graph, a
data-driven puzzle format, difficulty settings. The 8.1 KB of unspent budget is
a deliberate decision, not a gap to fill. Spending it needs an explicit call
from the user.

If `docs/STATUS.md` disagrees with anything above, STATUS.md wins and this block
is stale.
<!-- END: ACTIVE-SESSION-PICKUP -->

## Doc authority

The design is fixed and documented. These files have authority over their
subject; read before changing anything they cover.

| File | Authority over |
|---|---|
| [DESIGN.md](DESIGN.md) | the loop, the state model, what may not be cut |
| [CONTENT.md](CONTENT.md) | every string in the game, and the voice rules |
| [ART.md](ART.md) | palette, drawing conventions, the colourblind constraint |
| [JS13K.md](JS13K.md) | competition rules, build pipeline, submission checklist |
| [docs/STATUS.md](docs/STATUS.md) | where the work actually is right now |

## Commands

```sh
npm run build   # writes game.zip, exits non-zero over 13312 bytes
npm run max     # slower roadroller search — this is what ships
npm test        # 76 headless checks, no browser
npm run shots   # Chrome + Firefox: screenshots, pixel probes, extracted-zip smoke test
```

The size gate *is* the build. Never report progress without the byte count.
