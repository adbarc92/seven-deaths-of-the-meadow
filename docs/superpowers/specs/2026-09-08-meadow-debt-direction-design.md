# Debt has a direction — design

**Date:** 2026-09-08
**Status:** approved in brainstorming, not yet implemented
**Authority:** subordinate to DESIGN.md, CONTENT.md, ART.md. Where this
document and one of those disagree, they win and this is wrong.

---

## 1. Why

The first playtest (2026-09-08, the author) produced three findings. All were
confirmed in code, not inferred.

**F1 — "hold E at all of them" is a dominant strategy.** Only four of seven
sites read the hold flag at all: `index.html:65` (stone), `:110` (ring) and
`:160` (foal) declare `act()` with no `held` parameter, so tap and hold run
identical code. Of the four that do read it, hold is correct at every one —
tap kills at the bramble, the hollow and the pond, and tap at the gate only
costs you the better ending. **There is no site where tapping is right.**

DESIGN.md s6 claims "every site gets two meanings from one control." In the
shipped game that is false. The mechanic the design calls "the entire input
vocabulary" has one universal answer, which is why the game reads as
arbitrary (deaths look random until you find the trick) and as thin (once
found, no decision remains).

**F2 — the player could not tell a win from a loss.** The author reached the
standard ending and described it as "a long message and then the name of the
game, which made me think that I won."

**F3 — the core loop is implemented backwards from its spec.** DESIGN.md s2
specifies "wake again, seconds from where you failed." `index.html:34`
hardcodes `x: 176, y: 274` — every death returns the player to the wake
stone. The reported consequence was "too averse to doing anything, that made
me bored."

This document addresses **F1 only.** F2 and F3 are deferred; see s8.

## 2. The law

One sentence, never stated in full anywhere in the game:

> **The meadow takes exactly what you put in front of it.**

It already generates all nine existing deaths. It is canon in spirit —
CONTENT.md s1 says "it collects exactly what was offered, no more," and
DESIGN.md s4's bramble row says "it takes what it is offered."

Its unexploited corollary: **a site that owes you fills what you put in front
of it.** Where the debt runs toward the player, *tap is correct*. That is the
decision the game currently lacks, and it is knowledge — so it is carried by
the journal, which makes the journal load-bearing rather than decorative.

Two sites must demonstrate it. One instance is an exception; two is a rule a
player can induce.

## 3. Section A — the hollow inverts once paid

**Current behaviour.** Every revisit kills. Tap dies on "already owed"; hold
dies on "empty hand" because the berry was consumed.

**New behaviour.** Once `run.bands.orange` is set, **tap succeeds**. The
player paid a berry; the comb is theirs; they may take it.

- **No new state.** "Have I paid the hollow" is already `run.bands.orange`.
  DESIGN.md s5's ban on a third scope is untouched.
- **No item.** An earlier draft granted `run.honey`. Cut — nothing consumes
  it, and DESIGN.md s5 says a flag without a consumer is a progression system
  in disguise. The reward is survival and a journal line.
- **It retro-fits the clue.** The hollow's existing first-death line is
  already "The hollow was already owed, and it collected." The moment debt
  runs both ways, that line reads as the game having stated the rule at the
  player's first death.
- **It rewards a revisit**, the behaviour DESIGN.md s4 says the true ending is
  built on and that "almost nobody does the first time."

Hold with no berry still kills. Unchanged, and consistent: an empty hand
presented to a site is still taken.

## 4. Section C — the horn

A new site. DESIGN.md s4 warns against a sixth authored chain on explicit
schedule grounds ("the single most likely cause of schedule failure"). That
premise has expired: the whole s8 build order landed on Sep 3, and 8051 of
13312 bytes are unspent. The user has made the call to spend them.

**What it is.** A horn lying half-sunk in the grass. Not the player's.
ART.md s5 establishes the player as a unicorn whose horn is "the only place
the full rainbow palette touches the player"; ART.md s6 establishes the foal
as the same body with the horn missing, and says that absence "is the only
information the player needs." The game therefore already has a visual
grammar for pieces of a divided thing. The horn speaks it.

**Position:** approximately `128, 168`. Verify at implementation that it
clears the bramble (`58, 214`), the ring (`72, 112`) and the foal's start
(`200, 170`) by more than the sum of the radii. Centre-left is crossed on
every route from the lower sites to the gate: it has been beside the player
the whole game.

**Drawing:** a single tapered spiral built from a loop over arcs, per ART.md
s4's 40-character path limit. Shape-distinct at silhouette per s1 — nothing
else in the game is a vertical spike. Its gradient is flavour only; colour is
never a puzzle input.

**Behaviour — deliberately inverted from every other site:**

| Verb | Result |
|---|---|
| Hold (offer, kneel, set down) | **DEATH** |
| Tap (take it) | Correct. Sets `run.piece = 1`. |

This is the mechanism that breaks F1. A player running "hold everything"
walks into the one site where holding is the mistake and dies, and must work
out why. With s3 that is two instances of the same law.

`run.piece` is run state, destroyed on death, consistent with DESIGN.md s5.
It is a carryable like `run.berry`; ART.md s1 calls the berry "the only
carryable item in the game" and that line needs updating.

## 5. The third ending

`run.end` currently takes 1 (standard) and 2 (true). Add 3: **name + piece +
gate.**

The true ending already says the thing beyond the gate was "asking, politely,
to be put back together." The piece makes that literal rather than
metaphorical. Endings 1 and 2 are untouched, so CONTENT.md s4's "do not add a
coda" holds — this is a third branch, not an extension.

Gating: `run.end = held && run.name ? (run.piece ? 3 : 2) : 1`.

**Draft prose, for the user's revision — CONTENT.md owns every string:**

> You say the name written under the tallest face.
> Seven colors come apart into one, and one of them is in your hands.
> You give the horn back. It is the only thing you carried out of the
> meadow that the meadow did not take from something else first.
> The thing on the other side stands up whole, and is smaller than you
> expected.
> It walks out past you, and does not need the gate to do it.

Checked against CONTENT.md s1: second person, no exclamation, no named
emotion, no joke, no mechanic named. **Not final** — the voice is the user's.

## 6. State, budget, docs

**State.** One new run flag, `run.piece`. No meta field, no third scope.

**Budget.** Estimate 500–800 bytes: one site, three or four strings, the
ending branch, the horn drawing. Against 8051 free. `npm run max` is the only
authority on the real number.

**Documents that must change** — all three have authority over subject matter
this touches, so the code change is not complete until they are updated:

- **DESIGN.md s4** — content spine gains a site; the dependency graph gains
  the horn; s6's "every site gets two meanings" claim is currently false and
  must be corrected regardless of this work.
- **CONTENT.md s2** — the horn's strings; the hollow's revisit line. s4 — the
  third ending.
- **ART.md s1** — "the red berry is the only carryable item" becomes false.
  s4 — the horn's drawing convention.

## 7. Testing

- `npm test` — 76 existing checks must stay green. Add: hold at the horn
  kills; tap at the horn sets `run.piece`; tap at the hollow kills before
  orange and succeeds after; `run.piece` does not survive `newRun()`;
  ending 3 selects only with name and piece; the new journal lines stay
  within ten words and record no causation (the existing prose test covers
  this once the lines are reachable in a test run).
- `npm run shots` — Chrome and Firefox, plus a probe that the horn is
  distinguishable at silhouette and the ending-3 text block fits.
- **Mutation-check every new test.** The Sep 3 log records repeated cases of
  tests passing for the wrong reason. Confirm each new test fails when the
  behaviour it asserts is reversed.

## 8. Out of scope

- **F2 (win is unreadable) and F3 (respawn ignores the spec).** Deferred by
  the user's explicit choice to try A and C first. F3 is a two-number change
  and is the recommended rider on this work, because A and C both *add*
  deaths and the full-length walk back is what produced the reported boredom.
  Evaluating "how it feels" with F3 still present risks measuring the walk
  rather than the mechanic.
- Re-voicing the nine journal lines to a shared grammar (the "underlying
  logic" discussion of 2026-09-08). Wanted, not in this change.
- The stone, ring and foal continuing to ignore `held`. Not required to break
  the dominant strategy, and changing them is a larger content question.
- Submission. The entry remains unsubmitted with the deadline on Sep 13.

## 9. Risks

1. **Schedule.** Five days, and this adds a chain the design doc warned
   against. Mitigation: submit a green build before starting.
2. **Two exceptions become the new dominant strategy** ("hold everything
   except the horn and the paid hollow"). Accepted — that strategy is
   *knowledge*, which is the pillar, and it is exactly what the journal
   exists to carry.
3. **The horn's death is unfair on first contact.** A player is killed for
   the verb the whole game has taught them. Mitigated by the journal line and
   by the hollow teaching the same law with no death attached. Watch for it
   in the next playtest.
4. **Prose is not final.** All strings here are drafts pending the user.
