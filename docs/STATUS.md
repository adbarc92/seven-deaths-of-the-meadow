# Status — Seven Deaths of the Meadow

## State summary

*Rewritten in place each session.*

**TL;DR.** The first human playtest (the author, 2026-09-08) found two
entry-sinking bugs, both now fixed and on `main`. **The build is ready to
upload and has still never been submitted** — that is the user's hands-on
step, and the only time-bounded item. Design work is paused, not abandoned:
the playtest found the game's one decision has a dominant answer, and the
proposed fix (a new site, "the horn") did not survive two rounds of critique
in its current form.

**Where the schedule stands.** Deadline **05:00 America/Denver, Sep 13, 2026**.
DESIGN.md s8's submit date was Sep 9 and has passed. Entries update freely
until the deadline (JS13K.md s5), so upload now and re-submit after each fix.

**Readiness:** submittable, **not yet submitted**. Verified 2026-09-10:

| Check | Result |
|---|---|
| `npm run max` | green — **5275 / 13312 bytes (8037 free)** |
| `npm test` | **83 passed, 0 failed** (76 + 7 guard-radius tests) |
| `npm run shots` | clean — Chrome + Firefox, dev file and shipped zip. One run crashed with a Node trace; an immediate rerun was clean. Trace not captured, cause unknown — treat as a flake until it recurs. |
| iframe focus on load | **PASS** (manual, 2026-09-08, http-served iframe) |
| iframe arrow/space scroll leak | **PASS** (manual, 2026-09-08) |

`npm run max` is still non-deterministic (5261, 5263, 5268, 5275 across this
session's builds). Read the number off the build you upload.

### Known gaps

1. **Not uploaded.** Needs the user's js13k account.
2. **A partial hold carries between sites — live bug, unfixed.** `holdT` is
   only reset when the key is released, never when the player leaves a prompt
   ring. Start a hold at one site, walk away with the key down, and it
   completes at the next site with no fresh press. Verified A/B on
   2026-09-09: identical 0.25 s at the hollow kills only when preceded by a
   0.30 s partial hold at the bramble. Fix: reset `holdT`/`fired` when
   `nearest()` returns a different site from last frame; mutation-check it.
3. **A win is not legible as a win.** The author reached the standard ending
   and could not tell whether they had won.
4. **Respawn ignores DESIGN.md s2** ("wake again, seconds from where you
   failed") — `newRun()` always wakes the player at the stone. The larger
   cost of a death is not the walk, though: `run.t` resets, so any death on
   the winning path means waiting out `DUSK = 32` again.
5. **"Hold everything" is a dominant strategy.** No site rewards tapping.
   This is *deliberate* per CONTENT.md s2 ("the carving is the tutorial. Tap
   is take, hold is give") but the playtest found it boring. The horn
   proposal to break it is parked — see the session log.
6. **No blind playtest.** The author played; discoverability (time to first
   hold, time to first `J`) is still unmeasured. The protocol from the Sep 5
   entry still applies.
7. **Audio unreported.** The author played with a browser but did not
   comment on sound; nobody has confirmed hearing it.
8. **CLAUDE.md's pickup block is stale** (76 checks, blank `AUTHOR`).
   Its own last line says STATUS.md wins.
9. **8037 bytes unspent.** Standing decision; spending it is the user's call.

### Next steps

1. **Upload `game.zip` built from `main`**, then record the uploaded byte
   count and date here.
2. **Fix the hold carry-over** (gap 2). Small, confirmed, and it produces
   exactly the "arbitrary death" feeling the playtest reported. Re-submit.
3. **Then choose** between the confirmed defects (gaps 3–4) and new content
   (the horn, reworked). The Sep 9 session log has the case for each.

---

## Session log

*Newest first.*

### 2026-09-08 to 09-10 — first human playtest, two shipped bugs, a design parked

**The playtest.** The author played the shipping zip in an http-served iframe
on a deliberately scrollable page — the js13k condition, never tested before.
Iframe focus on load and the arrow/space scroll fix both **PASS**. (A first
attempt at the scroll check was invalid: the harness put the game below the
fold, so the author's own wheel-scroll tripped the leak detector. Rebuilt with
the game above the fold and key-attributed detection before scoring.)

The verdict: "the concept is fun," but too opaque, the objective unclear, and
not enough content. The author never knowingly completed the first act —
and reached an ending without being able to tell whether it was a win.

**What that turned out to be.**

- **The gate could be won with zero bands.** Every guarded site checks
  `near()` at `s.r`, but `nearest()` offered the verb out to `s.r + 14`.
  From that 14 px ring, tapping the gate ended the game with no bands and no
  death — which is what happened in the playtest. The same ring made the
  **true name free at noon**, so the replay hook DESIGN.md s4 describes did
  not exist in the build. Fixed by flagging lethal-guard sites `k` and
  stopping the verb at `s.r` for them. Scoped to the gate and ring on
  purpose: the general fix would have halved the foal's pickup range for no
  benefit. Seven tests stand at real offsets and hold a key; four fail when
  the bug is reinstated. The bug class was invisible because `harness.at()`
  teleports to the exact centre — nothing had ever stood in the ring.
- **The journal recorded only four of nine deaths.** Five deaths wrote
  nothing, so their lesson vanished with the five-second death line. Added
  five lines, voice-checked against CONTENT.md s1 and documented there. The
  foal death has two code paths (`act()` and the `near()` loop); both write.
- **`AUTHOR` set to "Alex Barclay"**, at the user's instruction.

**The design thread, and why it stopped.** The author found "hold E at all of
them" solves the game. Confirmed: three sites ignore `held` and hold is right
at the other four. A new site was proposed — a horn in the grass where hold
kills and tap is correct — plus an item and a third ending. Two rounds of
independent adversarial critique cut it down hard:

- Round 1 found the two bugs above, and removed the item and third ending
  (an item-gated ending violates DESIGN.md s4's "gated on knowledge, not on
  completion") and a proposed hollow inversion (the comb is handed over with
  the berry, so nothing is owed afterward). It also caught the spec
  **inventing a DESIGN.md s5 rule** that does not exist.
- Round 2 found that hold-dominance is **deliberate** — CONTENT.md s2 makes
  the carving the tutorial — so the horn's real job is contradicting it; that
  with no state the horn stays drawn and re-tappable after "you lift it out";
  that the player's own horn is the same vertical spike with the same
  gradient (fails ART.md s1); and that a horn the meadow "never owned"
  contradicts the true ending's "divided seven ways." Its claim that hold
  time accumulates over empty grass was **wrong**, but chasing it found the
  real carry-over bug (gap 2).

The horn is parked, not rejected. The unsolved problem it was reaching for:
one inverted site is an exception, not a rule, and no correct second
instance has been found. The v1 spec at
`docs/superpowers/specs/2026-09-08-meadow-debt-direction-design.md` is
untracked, superseded, and deliberately not committed.

**On process.** Nothing from this work was committed until the 10th, two
days after the fixes existed — `main` sat on the zero-band-win build through
the plan's own Sep 9 submit date. Commit fixes when they are verified; do
not let them ride on a branch behind design work.

### 2026-09-05 — playtest protocol, and a hole in the test coverage

No game code changed; the tree is clean at `eaaead8`. This session was analysis
and test design, plus one real coverage finding.

**The coverage finding (gap 4).** Every test entry point —
[visual.test.mjs](../visual.test.mjs) lines 27, 155 and 221 — calls
`page.goto('file:///…')`, loading the game as a **top-level document**. js13k
serves entries inside an **iframe**, and per the PR #3 note in the Sep 3 log the
arrow/space scroll-prevention code exists *because* of that iframe. So the fix
has never once run in the situation it was written for. Two things are unverified
as a result, both invisible to the current suite:

- whether arrows/space still leak scroll to the **parent** page, and
- whether the iframe takes **keyboard focus on load** — if a voter must click the
  frame before any key works, the entry reads as broken on arrival.

The durable fix is an iframe case in `visual.test.mjs`: serve over http (not
`file://` — file-origin iframes behave differently enough to invalidate the
result), embed the extracted zip in a deliberately scrollable page, drive real
key events, and assert `scrollY === 0`. **Not written — awaiting the user's
call**, since it is a code change and CLAUDE.md reserves new work for an
explicit request.

A throwaway rig for the manual version was built and used to confirm the setup
works (static server on :8013, an iframe harness with a live `scrollY` readout,
the zip extracted to a single 6862-byte `index.html`). It lived in the session
scratchpad and **is gone**; it was deliberately kept out of the repo. Recreating
it is ten minutes, and the recipe is the paragraph above.

**Design analysis — dusk dead air (feeds gap 6 of the previous summary, now
folded into the playtest).** Walking the site layout against the clock: at
`sp = 68` px/s the whole informed route (stone → bramble → hollow → pond → foal →
pond → ring → gate) is ~13 s of walking plus ~3.5 s of holds. But `DUSK = 32`
([index.html](../index.html) line 29) and the ring's `near()` kills at noon, so
the player cannot even wait beside it. **On the optimal run roughly half the
elapsed time is standing still with no legal action**, and it sits on the winning
path — the last thing a judge sees. The tension worth testing: `DUSK` is
simultaneously the noon window that has to stay open long enough to *teach* the
yellow lesson, and the expert-run idle. Shortening it costs the lesson. This is a
tuning question for a real player, not a systems change.

**Playtest protocol.** Written and published as a live observation sheet:
**https://claude.ai/code/artifact/5246f991-1115-4a3c-87e4-771920e6b459**
(three tester sheets, `db`-backed so results can be read back and analysed).
It carries two clocks — a session clock for the 3-minute judge window, and a run
clock ticking the game's own `DUSK 32 / DARK 70 / CLOSE 88` — a DEATH button that
logs and resets, and auto-capture of deaths+bands at the 3:00 mark. The six
things to measure, in priority order: time to first **hold** (carries five of the
game's six insights — if they never hold, they get none), time to first **J**,
deaths+bands at 3:00, behaviour during the dusk wait, quit point, and whether
they ever revisited a site after it stopped being dangerous.

Session design notes worth not re-deriving: brief with one sentence and do not
help; first 3 minutes silent (judge simulation), think-aloud after; recruit
people who do not know you wrote it; ask "tell me the rules of that place" rather
than "was it fun".

**Smoke test — started, not completed.** Build and rig were verified and the
first round of operator checks was put to the user, who dismissed it. Recorded
as **NOT RUN**, never as passed: iframe focus, iframe scroll leak, audio present
in iframe, audio quality, and real-touch-on-a-real-phone (the existing
`11-phone-portrait.png` is an emulated viewport, not a finger).

**Positioning, for the submission blurb if it helps.** Structurally this is a
90-second **Outer Wilds** — knowledge-only progression, a log that records
observations and never meanings — with **Fear & Hunger**'s manners and **Rusty
Lake**'s flat transactional calm. The failure mode it must avoid is the Sierra
instadeath: same mechanics, opposite reputation, and the difference is entirely
whether the death reads as "of course" in retrospect.

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
