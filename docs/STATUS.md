# Status — Seven Deaths of the Meadow

## State summary

*Rewritten in place each session.*

**TL;DR.** The game is content-complete, verified, and **finished as a build**.
Every band, both ambient deaths, the foal chain, the gate and both endings are
in, playable end to end in Chrome and Firefox from the extracted zip. The
remaining work is not code: **set `AUTHOR`, submit, and watch one person play.**
Both need a human.

**Where the schedule stands.** DESIGN.md s8 budgets Sep 3–12 for what all
landed on Sep 3. The project is **nine days ahead of its own plan**, with the
deadline at 05:00 America/Denver on **Sep 13**. The spare days belong to
playtesting, not to new systems (DESIGN.md s9).

**Readiness:** submittable, **not yet submitted**. Verified on 2026-09-03 at
`d239aa4`:

| Check | Result |
|---|---|
| `npm run build` | green — **5211 / 13312 bytes (8101 free)** |
| `npm run max` | green — **5193 / 13312 bytes (8119 free)** |
| `npm test` | **76 passed, 0 failed** |
| `npm run shots` | passed at this commit (Chrome + Firefox, pixel probes, extracted-zip playthrough) |

`max` runs a slower roadroller search and lands 18 bytes under plain `build`.
Both are green; **`npm run max` is what ships** (JS13K.md s3).

**Open PRs:** none. **Branches:** none but `main`. **Worktrees:** none.

### Known gaps

1. **The entry has not been submitted.** This is the only time-sensitive item.
   DESIGN.md s8 makes "submit a working build and re-submit daily" the hedge
   against the last days evaporating, and JS13K.md s5 confirms entries can be
   updated freely until the deadline. The build has been submittable since
   Sep 3 and the plan's own submit date is Sep 9. Nothing is gained by waiting.
2. **`AUTHOR` is empty.** [index.html](../index.html) line 25 is
   `const AUTHOR = '';`; line 446 skips the byline while it is blank. CONTENT.md
   s4 allows a title and an author line. One-line fix, blocks gap 1, needs a
   human decision.
3. **No human has played it.** All 76 checks plus the browser pass are
   automated. DESIGN.md s8 reserves a day for watching one stranger play and
   fixing the single thing they quit over. An agent cannot do this, and there
   are now nine spare days for it.
4. **8.1 KB of budget is unspent** — 39% of the limit used. A standing decision,
   not an oversight: DESIGN.md s4 forbids a sixth chain and s9 forbids the
   systems that would absorb it. Spending it needs an explicit call; the default
   is that the entry is done.
5. **No audio mute.** Not in the design, and DESIGN.md s9 rules out settings
   toggles. Volumes are low and tones short. Flagged because some judges care.
6. **Clock values are unverified against a real player.**
   `DUSK 32 / DARK 70 / CLOSE 88` seconds. Reachability is tested (worst site is
   well inside R1's 20 seconds); whether the wait for dusk *feels* right is a
   playtest question, and folds into gap 3.
7. **No git tag on any build.** The repo is thrown away Sep 14 (DESIGN.md s9),
   but tagging whatever zip actually gets uploaded is cheap insurance for
   "which bytes did I submit?"

### Next steps

1. **Set `AUTHOR` in [index.html](../index.html), `npm run max`, upload
   `game.zip`.** Ten minutes. Converts a finished game into an entered one.
   Then re-submit whenever anything changes, through Sep 13.
2. **Watch one person play.** Fix the single thing they quit over — as a
   clearer journal entry or a shorter walk, never a softer rule (CONTENT.md s6).
3. **Decide whether any of the 8.1 KB gets spent**, or declare the entry done
   and coast to the deadline on daily re-submits.

---

## Session log

*Newest first.*

### 2026-09-03 (evening) — audit and pickup

No code changed. Audited the state of the work and reconciled git, GitHub, and
the docs against a fresh verification run.

**Verified rather than trusted.** Re-ran the build and the headless suite at
`d239aa4`: green at 5211 bytes, 76/76. `npm run shots` was not re-run — it
passed at this same commit earlier in the day and the tree has not moved since.
Reconciled the one number that looked like a contradiction: STATUS.md quoted
5193 while `npm run build` prints 5211. Not a drift — 5193 is the `npm run max`
figure. Both are now recorded above with which one ships.

**The finding.** Everything in the repo is done and nothing is in flight — clean
tree, no open PRs, no branches, no worktrees. The whole Sep 3–12 build order
collapsed into one day, so the binding constraint is no longer engineering
capacity. It is that **the entry is submittable and unsubmitted**, and the two
things standing between it and a good submission (an author name, one human
playtest) are both decisions rather than tasks. Promoted submission to gap 1 and
next-step 1; it had been buried as a sub-clause.

Also noted: no build has ever been tagged, so there is currently no way to point
at "the bytes I uploaded" after the fact.

### 2026-09-03 — repo, pipeline, and the whole game

Started from the provided design docs and a two-site vertical slice. Ended
content-complete and verified in two browsers.

**Repo.** Created private `adbarc92/seven-deaths-of-the-meadow`. Six PRs, all
squash-merged, one branch per unit of work.

**Build (#1).** `build.sh` could not run here: it assumed Info-ZIP and a system
`advzip`, and the `zip` on PATH is a 7-Zip shim that rejects `-9`, so the size
gate failed before measuring anything. Moved to `build.mjs` with the toolchain
pinned as devDependencies — esbuild and roadroller via their JS APIs, advzip
from `advzip-bin`, and a small deflate zip writer on node's `zlib`. Both
compression candidates are built every time and the smaller ships, which is the
A/B JS13K.md s3 asks for. Roadroller lost by 200 bytes at slice size and now
wins by 330, so the automatic A/B earned its keep.

**Content (#2).** All seven bands, the clock, the foal, the gate, both endings.
Two places the docs left a choice, both resolved toward the pillar:

- `trueName` is *run* state, not meta — DESIGN.md s5 says a new meta field is a
  progression system in disguise, so the name must be fetched inside the run
  that spends it. One journal line was added to CONTENT.md to carry the
  knowledge across deaths.
- Green depends on blue by the foal simply *not being in the meadow* until the
  pond is solved, rather than by refusing the player something.

**Polish (#3).** Touch (drag to walk, press to interact), audio, and three real
input bugs: auto-repeat strobed the journal, arrows and space scrolled the page
(js13k plays entries in an iframe), and the journal did not stop movement.

**Looking at it (#4).** Everything to this point was verified headlessly, and
the gate arch had been drawn **upside down** since the content pass — an
anticlockwise arc painted the bottom of the circle, so the gate rendered as an
M. Also: unset rainbow slots were invisible against the pale sky, and the
journal panel leaked what was underneath. Added `visual.test.mjs`.

**The actual entry (#5).** Nothing was testing the *zip*. Added a pass that
inflates `game.zip` and plays the extracted file with real key events.

**Firefox (#6).** Cross-browser per JS13K.md s5. The true ending fits at 7
lines under Firefox's own text metrics.

**On the tests.** Mutation-checking repeatedly caught tests that passed for the
wrong reason: an auto-repeat check that toggled twice and landed back where it
started; arch probes that compared points across the sky/meadow gradient; a
shipped-build probe that could not distinguish title from meadow because the
title deliberately draws the meadow. Each was fixed and re-verified to fail
when the bug is reinstated.
