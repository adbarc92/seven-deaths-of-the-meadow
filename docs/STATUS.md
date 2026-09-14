# Status — Seven Deaths of the Meadow

## State summary

*Rewritten in place each session.*

**TL;DR.** The author submitted the entry at the deadline, from `main` as it
stood before this session's work. After the deadline, a ten-item expansion
was designed item by item and built on `feat/meadow-expansion` — one commit
per item, each with its byte cost — and is up for review as a PR. **No human
has played the branch yet.**

**Where the schedule stands.** The deadline (05:00 America/Denver, Sep 13,
2026) has passed and the entry is submitted. JS13K.md s5 only promises free
updates *until* the deadline, so treat the submitted build as the judged one
unless the organisers say otherwise. The branch is post-jam work.

**The byte budget is now being spent** — by the user's explicit call on
2026-09-11, which retires the "unspent budget is a standing decision" note.

**Readiness — branch `feat/meadow-expansion`, verified 2026-09-14:**

| Check | Result |
|---|---|
| `npm run max` | green — **6151 / 13312 bytes (7161 free)**. Still non-deterministic by ~±15; read the number off the build you ship. |
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
   ending ("Whole") and the two new ring lines were accepted "for now". CONTENT.md
   s4 marks the ending as a first draft.
3. **Audio is unheard.** Item 6's tests prove what the game asks the audio
   graph for, not what a speaker plays.
4. **The dusk wait on the winning path remains.** Respawn keeps position but
   still resets the clock — keeping the clock would be a checkpoint (CONTENT.md
   s6). The sun makes the wait legible; it does not shorten it.
5. **No blind playtest.** The Sep 5 protocol still applies; add: does anyone
   find the dark carving, or the full name?
6. **`npm run shots` flake** — one unexplained crash on Sep 10. Every run this
   session was clean.
7. **The submitted build is untagged**, and its byte count was not recorded.
8. **CLAUDE.md's pickup block is stale** (unsubmitted, 76 checks). STATUS wins.

### Considered and dropped (2026-09-14)

- **Death flowers** (a flower where you last died). A new meta field
  (DESIGN.md s5), marks the site that killed you (CONTENT.md s6), and
  redundant now that item 3 wakes you on that spot.
- **The horn** (hold kills, tap takes). Its purpose — breaking the
  hold-everything strategy — is done by item 1; its "name + horn" ending would
  collide with item 9's; its silhouette clash with the player's horn (ART.md
  s1) was never solved. The v1 spec under `docs/superpowers/specs/` stays
  untracked and superseded.

### Next steps

1. **Review and merge the PR.**
2. **Play the branch**, ideally blind. Watch the dandelion → foal sequence.
3. **Redraft item 9's prose** (gap 2).
4. **Listen to the ambience** (gap 3).

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
