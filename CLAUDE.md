# CLAUDE.md

<!-- BEGIN: ACTIVE-SESSION-PICKUP — remove this block once the entry has been submitted and the AUTHOR line is set -->
<!-- BEGIN: ACTIVE-SESSION-PICKUP — remove once the entry is submitted and the playtest is done -->
## Active session pickup

**Read [`docs/STATUS.md`](docs/STATUS.md) before doing anything else.** Its
State summary is current as of **2026-09-05** and is rewritten every session.

Short version, so you can orient without reading it first:

- The game is **done as a build** and verified — 76/76 headless checks and a
  Chrome + Firefox pass. `main` is clean; no open PRs, no other branches, no
  worktrees, nothing in flight.
- **The deadline is 05:00 America/Denver on Sep 13, 2026.** The whole DESIGN.md
  s8 build order landed on Sep 3, so engineering capacity stopped being the
  constraint a week ago.
- **Two blocking items, both needing a human, both unchanged since Sep 3:**
  1. `AUTHOR` at [`index.html`](index.html) line 25 is still `''`, so the ending
     renders no byline. **Ask for the name — do not invent one.**
  2. **The entry has never been submitted.** It has been submittable since Sep 3
     and the plan's own submit date was Sep 9. This is the only time-sensitive
     thing left.
- **Do not quote a byte count from memory or from a doc.** `npm run max` is not
  deterministic — it produced 5215 bytes on Sep 5 against code that produced
  5193 on Sep 3. Re-run it and read the number off the build.
- **One real coverage gap, found Sep 5:** nothing has ever run the game in an
  **iframe**, which is how js13k serves entries — and the arrow/space scroll fix
  exists *because* of the iframe. See STATUS.md gap 4 for the recipe. The rig
  built for it was scratchpad-only and is gone.
- After those: watch one person play. A full protocol and a live observation
  sheet are linked from the Sep 5 session-log entry. Fix the single thing they
  quit over — a clearer journal entry or a shorter walk, **never a softer rule**
  (CONTENT.md s6).

Before proposing any *new* work, read **DESIGN.md section 9**. It is a list of
things that look like oversights and are not — an engine, a scene graph, a
data-driven puzzle format, difficulty settings. The 8.1 KB of unspent budget is
a deliberate decision, not a gap to fill. Spending it needs an explicit call
from the user.

If `docs/STATUS.md` disagrees with anything above, STATUS.md wins and this block
is stale.
<!-- END: ACTIVE-SESSION-PICKUP -->
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
