# Status — Seven Deaths of the Meadow

## State summary

*Rewritten in place each session.*

**TL;DR.** The game is content-complete and playable end to end, in Chrome and
Firefox, from the extracted zip. Every band, both ambient deaths, the foal
chain, the gate and both endings are in. It is submittable today.

**Readiness:** submittable. `game.zip` builds green at **5193 / 13312 bytes
(8119 free)** with `npm run max`.

**Verification:** 76 headless checks (`npm test`), plus a browser pass
(`npm run shots`) covering pixel probes, a keyboard playthrough of the
*extracted zip*, and Firefox. Mutation-checked throughout — several tests were
found vacuous and fixed rather than trusted.

**Open PRs:** none.

### Known gaps

1. **`AUTHOR` is empty.** [index.html](../index.html) has an `AUTHOR` constant
   near the top; the ending renders no byline while it is blank. CONTENT.md s4
   allows a title and an author line. One-line fix, needs a human decision.
2. **No human has played it.** Every check is automated. DESIGN.md s8 reserves
   Sep 12 for watching one stranger play and fixing the single thing they quit
   over. That cannot be done by an agent.
3. **8.1 KB of budget is unspent** — 39% of the limit used. This is a decision,
   not an oversight: DESIGN.md s4 says seven authored chains is the likeliest
   cause of schedule failure and forbids a sixth, and s9 forbids the systems
   that would otherwise absorb bytes. Spending it needs an explicit call.
4. **No audio mute.** Not in the design, and DESIGN.md s9 rules out settings
   toggles. Volumes are low and tones are short. Flagging it because some
   judges care.
5. **Clock values are unverified against a real player.** `DUSK 32 / DARK 70 /
   CLOSE 88` seconds. Reachability is tested (worst site is well inside R1's 20
   seconds), but whether the wait for dusk *feels* right is a playtest question.

### Next steps

1. Set `AUTHOR`, run `npm run max`, submit. Entries can be updated until the
   deadline, so there is no reason to hold the build back (JS13K.md s5).
2. Watch one person play. Fix the single thing they quit over — as a clearer
   journal entry or a shorter walk, never a softer rule (CONTENT.md s6).
3. Decide whether any of the 8.1 KB should be spent, or whether the entry is
   done.

---

## Session log

*Newest first.*

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
