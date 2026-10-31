# Status — Seven Deaths of the Meadow

## State summary

*Rewritten in place each session.*

**TL;DR.** The author submitted the entry at the deadline, from `main` as it
stood before this session's work. After the deadline, a ten-item expansion
was designed item by item and built on `feat/meadow-expansion` — one commit
per item, each with its byte cost — and is open for review as
[PR #10](https://github.com/adbarc92/seven-deaths-of-the-meadow/pull/10).
**No human has played the branch yet.** Nothing is in flight: the tree is
clean apart from one deliberately untracked folder (see Assumptions).

**Where the schedule stands.** The deadline (05:00 America/Denver, Sep 13,
2026) has passed and the entry is submitted. JS13K.md s5 only promises free
updates *until* the deadline, so treat the submitted build as the judged one
unless the organisers say otherwise. The branch is post-jam work.

**The byte budget is now being spent** — by the user's explicit call on
2026-09-11, for the items in PR #10. That retires the old "unspent budget is a
standing decision" note; new items still need their own call.

**Readiness — branch `feat/meadow-expansion`, verified 2026-09-14:**

| Check | Result |
|---|---|
| `npm run max` | green — **6151 / 13312 bytes (7161 free)**. Still non-deterministic by about ±15; read the number off the build you ship. |
| `npm test` | **137 passed, 0 failed** (83 on `main`) |
| `npm run shots` | clean — Chrome + Firefox, dev file and shipped zip, 17 checks |
| mutation checks | 35 mutations across items 1–9, all killed; item 0's tests failed before its fix |

### What the branch adds

Cost is the change in the `minify` candidate, which is deterministic; the
shipped roadroller number is not.

| # | Commit | Change | Cost |
|---|---|---|---|
| 0 | `e33088a` | A press belongs to the site it began at (was gap 2) | +13 |
| 1 | `bd5dabc` | Hold is grip: the dandelion, and keeping the foal at the pond kills (was gap 5) | +282 |
| 2 | `97b6a2e` | A rainbow on the endings — the win is legible (was gap 3) | +78 |
| 3 | `2395e81` | Wake where you failed, pushed out of lethal sites (was gap 4, position half) | +85 |
| 4 | `e28d38e` | A sun that sets: the clock, visible | +57 |
| 5 | `475183e` | The journal label darkens while a new line is unread | +22 |
| 6 | `528d249` | Ambience: drone by hour, bees at the hollow, silence while kneeling | +230 |
| 7 | `8bedf71` | The unicorn drawn side-on, facing the way it walks | +29 |
| 8 | `d95cac6` | In the dark, the carving has a second line, found by touch | +76 |
| 9 | `54cfe7c` | The full name, found in the dark, and a third ending | +226 |

Total: `minify` 5610 → 6708 (+1098); shipped ~5270 → 6151.

### Known gaps

1. **No human has played the branch.** Everything above is verified headlessly
   and by pixel probe, none of it by a player. Item 1 changes the correct verb
   at the pond; watch whether the dandelion teaches the grip rule before the
   foal kills someone for holding.
2. **Open action item — item 9's prose needs further drafts.** The third
   ending ("Whole") and the two new ring lines were accepted "for now".
   CONTENT.md s4 marks the ending as a first draft.
3. **Audio is unheard.** Item 6's tests prove what the game asks the audio
   graph for, not what a speaker plays.
4. **The dusk wait on the winning path remains.** Respawn keeps position but
   still resets the clock — keeping the clock would be a checkpoint (CONTENT.md
   s6). The sun makes the wait legible; it does not shorten it.
5. **No blind playtest.** The Sep 5 protocol still applies; add: does anyone
   find the dark carving, or the full name?
6. **`npm run shots` flake** — one unexplained crash on Sep 10. Every run on
   Sep 14 was clean.
7. **The submitted build is untagged**, and its byte count was not recorded.

### Considered and dropped (2026-09-14)

- **Death flowers** (a flower where you last died). A new meta field
  (DESIGN.md s5), marks the site that killed you (CONTENT.md s6), and
  redundant now that item 3 wakes you on that spot.
- **The horn** (hold kills, tap takes). Its purpose — breaking the
  hold-everything strategy — is done by item 1; its "name + horn" ending would
  collide with item 9's; its silhouette clash with the player's horn (ART.md
  s1) was never solved. The v1 spec under `docs/superpowers/specs/` stays
  untracked and superseded.

### Handoff — next steps, in order

1. **Review and merge PR #10.** Before merging: `npm test`, `npm run shots`,
   and `npm run max` on the merge result; read the byte count off the build.
   After merging, delete the pickup block in `CLAUDE.md` (its markers say so).
2. **Play the branch**, ideally blind, using the Sep 5 protocol. Watch three
   things in order: whether the dandelion teaches the grip rule before the
   pond kills a foal-holder; whether anyone reads the sun as the clock;
   whether anyone returns to the ring in the dark. Fix the single thing they
   quit over — a clearer journal line or a shorter walk, never a softer rule.
3. **Redraft item 9's prose** (gap 2): the third ending in `ENDINGS[2]` in
   `index.html` and CONTENT.md s4, plus the two ring lines in CONTENT.md s2.
   The fit checks in `game.test.mjs` and `visual.test.mjs` read `ENDINGS`
   directly, so a longer draft is caught if it collides with the ring.
4. **Listen to the ambience** (gap 3) in Chrome and Firefox: the drone should
   drop at dusk and again at dark, bees near the hollow, silence while kneeling
   at the pond. If it is too loud or too quiet, the gains are in `ambience()`.
5. **Tag the submitted build** if you can confirm which commit you uploaded
   (gap 7) — `7aa80d1` was `main` at the deadline.

### Assumptions taken at wrap-up

- **No tag was created.** The submitted build is most likely `7aa80d1` (the tip
  of `main` at the deadline), but which zip was uploaded was never confirmed,
  so tagging was left to the author.
- **`docs/superpowers/` is left untracked on purpose** — the superseded horn
  spec, deliberately never committed.
- **Bandwidth is not part of this repo.** The separate prototype was split out
  on 2026-09-10 into the private repo
  [`adbarc92/bandwidth`](https://github.com/adbarc92/bandwidth) (local clone:
  `../bandwidth`), and **archived on 2026-09-14**. A leftover untracked copy in
  `games/bandwidth` was hash-checked identical to the clone and deleted; it
  was never in this repo's git history.

---

## Session log

*Newest first.*

### 2026-09-11 to 09-14 — ideation, submission, and a ten-item expansion

**Ideation (Sep 11).** Brainstormed ways to spend the unspent budget against
the pillars and DESIGN.md s9, grouped as: fix the one decision, cheap
expansions of what exists, new content, and rule-breakers. The key idea:
**hold is grip, not give** — pressing what is yours gives it, closing a hand
on what is not keeps it, and keeping is taking. It breaks hold-dominance
without contradicting the carving, and supplies the second instance the
parked horn never found. The user chose to build everything, one item at a
time, tracking bytes.

**Submission.** The author submitted at the deadline, before any of the work
below existed.

**Build (Sep 14).** Each item got a short design in chat and explicit
approval, then tests, implementation, a mutation pass, both builds, the
browser suite, and a commit carrying its byte cost. Things worth not
re-deriving:

- **Item 0** binds a press to the site where it *began*, not to last frame's
  site — the harness teleports and presses in one frame, and so does a fresh
  run.
- **Item 1** puts the dandelion after the foal in `SITES` so `SITES[6]` stays
  the foal. Both grip deaths and the stone's dark line are built from one
  `KEPT` string.
- **Item 2**: the first bow position crowded the true ending's first line; it
  was moved up 10 px after looking at the screenshot.
- **Item 3** falls back to the stone when the playfield edge blocks the push
  out of a lethal site (dying at the gate from above).
- **Item 6** needed `harness.mjs`'s AudioContext stub to record
  `setTargetAtTime`; without it the game's `try/catch` let a missing method
  pass as silence. A mutation proves the stub now catches that.
- **Item 7**: the first facing probe let a head moved back on top pass,
  because the neck's round cap covered the probe point. The probe was moved
  to a point only the head covers.
- **Item 9** moved ending texts into `ENDINGS` so fit checks read the real
  string. The third ending is 6 lines in both Chrome and Firefox.
- `visual.test.mjs` sliced its shipped checks with a hardcoded `slice(3)`;
  now it records the length, which the new probes would otherwise have broken.

**Item 10** (death flowers, the horn) was dropped with reasons — see above.

**Wrap-up.** PR #10 opened. `CLAUDE.md`'s pickup block was stale and
malformed (doubled BEGIN/END markers, still "unsubmitted", 76 checks); it was
replaced with one bounded block pointing here, and the durable rules it
carried — the `npm run max` non-determinism and reading DESIGN.md s9 first —
moved out of the block so deleting it loses nothing. The first rewrite of
this file (`db929d3`) had dropped the four older session-log entries below;
they were restored byte-for-byte from `main`.

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
