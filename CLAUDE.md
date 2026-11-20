# CLAUDE.md

<!-- BEGIN: ACTIVE-SESSION-PICKUP — remove this block when feat/meadow-expansion (PR #10) merges to main -->
## Active session pickup

If the current branch is `feat/meadow-expansion` (check with
`git rev-parse --abbrev-ref HEAD`), or PR #10 is still open, read
[`docs/STATUS.md`](docs/STATUS.md) before doing anything else. Its State
summary (2026-09-14) is the handoff. It documents:

- the ten-item post-jam expansion on that branch — one commit per item, each
  with its byte cost — up for review as
  [PR #10](https://github.com/adbarc92/seven-deaths-of-the-meadow/pull/10),
- the entry's status: submitted at the deadline, from `main` before the branch,
- adaptations and test bugs caught along the way, so they are not re-derived,
- the prioritised next steps: merge, play the branch, redraft item 9's prose
  (the third ending), listen to the audio.

If the branch has merged or changed, this section is stale — delete this block
and trust STATUS.md.
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

Before proposing any *new* work, read **DESIGN.md section 9** — a list of
things that look like oversights and are not. Spending the remaining byte
budget needs an explicit call from the user; one was made for the items in
PR #10.

## Commands

```sh
npm run build   # writes game.zip, exits non-zero over 13312 bytes
npm run max     # slower roadroller search — this is what ships
npm test        # 137 headless checks, no browser
npm run shots   # Chrome + Firefox: screenshots, pixel probes, extracted-zip smoke test
```

The size gate *is* the build. Never report progress without the byte count, and
never quote one from memory or from a doc: `npm run max` is not deterministic
(about ±15 bytes between runs). Re-run it and read the number off the build.
For a stable per-change delta, compare the `minify` candidate, which is
deterministic.
