# Seven Deaths of the Meadow — js13kGames 2026

**Theme:** Unicorns and Rainbows
**Deadline:** 2026-09-13, 13:00 CEST (05:00 America/Denver)
**Hard limit:** 13,312 bytes, zipped, everything included

---

## 1. What this is

A sunlit pastel meadow with a unicorn shrine at its center. The player dies in
about ninety seconds. Nothing carries over between runs except what the player
personally figured out — no stats, no unlocks, no currency, no upgrades.

Fear & Hunger's logic rendered in candy colors. The cheerfulness is not irony
laid over horror; it is the horror. The meadow is not malicious. It is
transactional, and the player does not know the terms.

**Design pillar:** knowledge is the only progression. If a change makes the
player *stronger* rather than *better informed*, reject it.

**Second pillar — diegesis.** Every rule the player learns must be legible
inside the fiction. No tutorial text, no tooltips explaining mechanics, no
UI that the character couldn't be said to perceive. The rainbow HUD is the
one exception and it is diegetic too: it is the gate, seen from anywhere.

---

## 2. Core loop

    wake → explore → touch the wrong thing → die with a line that
    teaches → wake again, seconds from where you failed

Two rules govern every other decision in this document:

**R1. Under 20 seconds from respawn to any puzzle state.**
No long walks. The meadow is one screen; traversal is not content. If a
future change makes any site slower to reach, the change is wrong.

**R2. Every death line names the lesson, not the event.**
Not "The bramble killed you." Instead: *The bramble drank twice. It only ever
wanted once.* One line, drawn over the frozen frame. No death screen, no fade,
no stats. Any key and you're back.

---

## 3. The journal (non-negotiable)

An auto-journal records what the player **observed**, verbatim. It never
records what an observation means.

    ✅  "The bramble drinks. One thorn was enough."
    ❌  "Press a single thorn to safely harvest the berry."

Rationale: judges and voters give a 13k entry three minutes, not three hours.
Fear & Hunger earns its opacity over twenty hours of investment; this entry
has no such goodwill. Without the journal, players hit the fourth death,
conclude the game is arbitrary, and score it as unfair. With it, the
inference still belongs to the player — which is the pillar — but the raw
material is not lost to memory.

The journal is also the answer to "is this diegetic?" — it is the character's
memory, faithfully recording and stubbornly failing to understand.

Persists across death. Toggled with `J`. Never more than one screen.

---

## 4. Content spine

Seven ways to die. **Five are authored puzzle chains; two are ambient.**
Seven authored chains is the single most likely cause of schedule failure —
do not add a sixth.

| Band | Site | What kills you | What the death teaches |
|---|---|---|---|
| Red | The bramble | Reaching in openhanded | It takes what it is offered — offer once, deliberately |
| Orange | The hollow | Taking honey | Something already paid for this; leave the berry in trade |
| Yellow | The sunflower ring | Standing in it at noon | They turn toward the brightest thing. Come at dusk. |
| Green | The foal | Letting it follow you anywhere else | It has exactly one place it is allowed to go |
| Blue | The pond | Drinking | Reflections keep what they take. Approach with eyes closed. |

**Indigo** is free. It is carved on the wake stone where the player starts:
*GIVE, DO NOT TAKE.* Reading it sets the band. Its job is to teach, in the
first ten seconds and without a tutorial, that the gate wants **acts**, not
items.

**Violet** opens on its own when the other six are set. It is the reward, and
it is the only moment in the game that is purely generous.

**The two ambient deaths:**
- Approaching the gate with fewer than six bands set.
- Full dark. The run has a soft clock; when it runs out, the meadow closes.
  (The clock is also what makes the yellow puzzle work — noon and dusk are
  positions on it.)

### Dependency graph

    stone (indigo, free)
      └─ bramble (red) ──gives berry──> hollow (orange)
      └─ sunflower ring (yellow, needs dusk)
      └─ pond (blue)
           └─ foal (green, must be led to the pond)
                └─ gate (violet) ──> ending

The foal depending on the pond is deliberate: it forces the player to have
solved blue before green is even attemptable, which paces the back half
without adding content.

### Ending

Two endings, gated on knowledge, not on completion.

The unicorn's **true name** is discoverable only in the sunflower ring at
dusk — i.e. only if the player goes back to a site *after* it stopped being
dangerous, which almost nobody does the first time. Speaking it at the gate
gives the second ending.

This costs roughly 300 bytes and is the entry's replay hook. Voters who
finish and then discover there was more will come back. Do not cut it.

---

## 5. State model

Two scopes. Getting this boundary right is the whole game.

**Run state — destroyed on death.**
`x, y, bands{}, berry, foalFollowing, clock, dead`

**Meta state — survives death.**
`journal[], deaths`

That is the complete list. If a proposed feature needs a third scope or a
new meta field, it is almost certainly a progression system in disguise.
Reject it and cite the pillar.

**No save. No localStorage.** The player closing the tab and coming back
knowing everything is the correct behavior, and it costs zero bytes.

---

## 6. Interaction: one verb

There is one interact key (`E`, or a tap). Intent is expressed by **duration**,
not by a menu:

- **Tap** — grab, take, reach. The greedy reading.
- **Hold** (500 ms, with a filling ring so it is discoverable) — press, offer,
  give, wait. The deliberate reading.

This is the entire input vocabulary beyond movement. It carries the theme
(*GIVE, DO NOT TAKE* is literally tap vs. hold), it is free to explain because
the carving explains it, and it means every site gets two meanings from one
control.

Do not add a second verb. Do not add an inventory screen. Items are single
flags on run state and the prompt line says what you're holding.

---

## 7. Byte budget

13,312 bytes zipped. These are targets to check against daily, not estimates.

| Subsystem | Budget |
|---|---|
| Text — prose, death lines, journal entries | 4.0 KB |
| Engine — loop, input, state machine, flags | 3.0 KB |
| Rendering — procedural meadow, sites, gradient rainbow | 2.5 KB |
| UI — title, journal panel, gate | 1.0 KB |
| Audio | 1.0 KB |
| Headroom | 1.8 KB |

Text being the largest line is correct. It is the game, and English gzips
extremely well — prose is the cheapest content in this format.

**Zero image assets.** Everything is canvas paths and gradients. The rainbow
is a `createLinearGradient` with seven stops, which is close to the cheapest
possible visual payoff available under the theme.

Toolchain: `esbuild` → `roadroller` → `advzip -4`. Nothing else. Do not add
Kontra or LittleJS — there is no sprite system to justify a sprite library.

---

## 8. Build order

Submissions are already open and entries can be updated. **Submit a working
build on Sep 9 and re-submit every day after.** That is the insurance policy
against the last three days evaporating.

| Dates | Deliverable |
|---|---|
| Sep 3 | Repo, build pipeline, size gate that fails the build over 13,312 bytes. Ship an empty zipped canvas. |
| Sep 4–5 | Vertical slice: one site, both deaths, instant restart, journal, rainbow HUD |
| Sep 6–7 | Content pass 1 — three bands, all death lines |
| Sep 8–9 | Content pass 2 — remaining bands, gate, both endings. **Submit.** |
| Sep 10–11 | Audio, palette, touch controls (Mobile is a separate category and is nearly free here — four verbs, no twitch input) |
| Sep 12 | Compression pass. Watch one stranger play. Fix the single thing they quit over. Final submit. |

If a day slips, cut a band and reassign its color to an ambient death. Never
cut the journal, the endings, or R1.

---

## 9. Explicit non-goals

For any agent working on this: these are not oversights.

- **No engine, no framework, no reusable systems.** Five puzzles is fewer
  than the abstraction that would describe them. Hardcode each site. The
  codebase is thrown away on Sep 14.
- No entity-component system, no scene graph, no event bus.
- No data-driven puzzle definition format.
- No difficulty settings, no accessibility toggles beyond a colorblind-safe
  palette baked in from the start.
- No procedural generation of sites. Five hand-authored sites, fixed layout.
- No combat, no health bar, no stamina. Death is binary and instant.
- No multiplayer, no leaderboard, no Online category entry.
- No TypeScript. No bundler config beyond one esbuild invocation.

Anything on this list that gets built is bytes taken from prose, which is
where the game actually lives.
