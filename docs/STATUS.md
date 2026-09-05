# Status — Seven Deaths of the Meadow

## State summary

*Rewritten in place each session.*

**TL;DR.** The game is content-complete, verified, and **finished as a build**.
The remaining work is still not code: **set `AUTHOR`, submit, and watch one
person play.** Both need a human. Nothing is in flight — clean tree, no open
PRs, no branches, no worktrees, no background processes.

**Where the schedule stands.** Deadline **05:00 America/Denver, Sep 13, 2026** —
**eight days out**. The DESIGN.md s8 build order (Sep 3–12) all landed on Sep 3.
The spare days belong to playtesting and submission, not to new systems
(DESIGN.md s9).

**Readiness:** submittable, **still not submitted**. Re-verified 2026-09-05 at
`eaaead8`:

| Check | Result |
|---|---|
| `npm run max` | green — **5215 / 13312 bytes (8097 free)** |
| `npm test` | **76 passed, 0 failed** |
| `npm run shots` | not re-run this session — last passed 2026-09-03 at `d239aa4`, tree unchanged since |

⚠️ **`npm run max` is not deterministic.** It produced **5215** bytes on Sep 5
against byte-identical game code that produced **5193** on Sep 3 (`eaaead8` is a
docs-only commit). Roadroller's parameter search lands differently between runs.
Nothing is wrong — but *the number you submit is the number in the zip you
actually upload*, so re-read it from the build output at submit time rather than
quoting this doc, and see gap 7 about tagging.

### Known gaps

1. **The entry has not been submitted.** Still the only time-sensitive item, and
   now four days past the plan's own Sep 9 submit date. DESIGN.md s8 makes
   "submit a working build and re-submit daily" the hedge against the last days
   evaporating; JS13K.md s5 confirms entries update freely until the deadline.
   Nothing is gained by waiting.
2. **`AUTHOR` is empty.** [index.html](../index.html) line 25 is
   `const AUTHOR = '';`; line 446 skips the byline while blank. One-line fix,
   blocks gap 1, needs a human decision. **Do not invent a name.**
3. **No human has played it.** Unchanged. A full playtest protocol now exists
   (see below) but no session has been run.
4. **The iframe is never tested — new finding, see this session's log.**
   All three test entry points load the game as a top-level document
   ([visual.test.mjs](../visual.test.mjs) lines 27, 155, 221). js13k serves
   entries **in an iframe**, and the arrow/space scroll-prevention fix from PR #3
   was written *specifically because of* that context. The fix has never been
   exercised in the condition that motivated it. Two operator checks and one
   automated fix are described in the log entry below. **NOT RUN — not failed.**
5. **8.1 KB of budget unspent.** Standing decision, not an oversight
   (DESIGN.md s4 and s9). Spending it needs an explicit call from the user.
6. **No audio mute, and the audio has never been *heard*.** Headless Chrome
   produces no sound, so all 76 checks say nothing about how it sounds. The death
   tone is a 98 Hz triangle held 1.4 s ([index.html](../index.html) line 49).
   DESIGN.md s9 rules out a settings toggle, so if it is unpleasant the fix is a
   volume/duration number, not a mute.
7. **No git tag on any build.** Cheap insurance for "which bytes did I submit?",
   and now more clearly worth doing given the nondeterminism noted above.

### Next steps

1. **Set `AUTHOR`, `npm run max`, upload `game.zip`, tag the commit.** Ten
   minutes. Converts a finished game into an entered one. Re-submit whenever
   anything changes, through Sep 13.
2. **Close the iframe gap** (gap 4) — either the two manual checks or, better,
   an automated iframe case in [visual.test.mjs](../visual.test.mjs). This is the
   highest-value engineering work left, because an entry that appears not to
   respond on the js13k play page loses votes for a reason unrelated to the game.
3. **Run one playtest session** using the protocol below. Fix the single thing
   they quit over — a clearer journal entry or a shorter walk, **never a softer
   rule** (CONTENT.md s6).
4. **Decide whether any of the 8.1 KB gets spent**, or declare the entry done and
   coast to the deadline on daily re-submits.

---

## Session log

*Newest first.*

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
