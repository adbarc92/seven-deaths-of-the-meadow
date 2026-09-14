# CONTENT.md — the prose bible

Text is 4 KB of a 13 KB budget: the largest single line item and the place
the game actually lives. This file is the authority on every string that
ships. **Do not improvise game text.** If a line is needed that isn't here,
write it against section 1 and add it here.

---

## 1. Voice

The meadow is not cruel. It is not hungry, angry, or evil. It is **accurate**.
It states a price, the player fails to hear it, and it collects exactly what
was offered — no more. Every death is, from the meadow's side, a completed
transaction conducted in good faith.

That is the whole tonal engine. The pastel palette isn't irony painted over
horror; it's a place where nothing has gone wrong.

**Rules:**

- Second person. Present tense for the world, past tense for deaths.
- **No exclamation marks anywhere in the game.** Not one.
- Never "you die", "game over", "you lose", "try again". The word *death*
  appears only in the counter.
- Deaths: one sentence, two at most, 20 words maximum.
- Never name an emotion the player is supposed to feel.
- Never describe the meadow as wanting to hurt you. It wants to be paid.
- **Zero jokes.** The comedy is entirely in the palette; if the prose is also
  funny, the joke lands twice and the horror never lands at all.
- Never explain a mechanic. If a line contains the words *press*, *hold*,
  *key*, or *button*, it is wrong.

**Journal entries** are stricter: ten words maximum, observational, no verbs
of intent, no causation. The journal records that a thing happened. It never
records why.

    ✅  "The bramble drinks. One thorn was enough."
    ❌  "The bramble wants a single drop of blood in exchange for the berry."

---

## 2. Site text

### Wake stone — indigo (free)

| Trigger | Line |
|---|---|
| tap (first) | You read the carving aloud. Somewhere behind the light, something agrees. |
| tap (repeat) | The same six words. They have not changed. |
| journal | The stone is carved: GIVE, DO NOT TAKE. |
| hold, in the dark | In the dark the carving is only grooves. Under it your fingers find a second line: WHAT YOU KEEP, THE MEADOW KEEPS. |
| journal | The stone, by touch: WHAT YOU KEEP, THE MEADOW KEEPS. |

The carving is the tutorial. Hold is the deliberate act and tap the quick
one, and neither is safe by itself: pressing what is yours gives it, closing
a hand on what is not keeps it, and keeping is taking. The stone says so in
six words and nothing else in the game ever mentions the controls.

The second line exists only in the dark and only by touch. It is the grip
deaths' own sentence, carved — so a player who has died that way finds the
stone said it all along. The code builds both from one string so they can
never drift apart.

### The bramble — red

| Trigger | Line |
|---|---|
| tap | **DEATH** — You reached in openhanded. The bramble took the whole arm as an offer. |
| hold (first) | You press a single thorn until it drinks. A red berry falls loose into your hand. |
| hold (repeat) | **DEATH** — The bramble drank twice. It only ever wanted once. |
| journal | The bramble drinks. One thorn was enough. |
| journal | Open hands are taken whole. |

### The hollow — orange (requires berry)

| Trigger | Line |
|---|---|
| tap | **DEATH** — You took the honey. The hollow was already owed, and it collected. |
| hold, no berry | **DEATH** — You offered an empty hand. The hollow accepted the hand. |
| hold, with berry | You set the red berry down in the hollow. The bees draw back and let the comb go. |
| journal | The hollow was already owed. |
| journal | Bees keep back from the berry. |
| journal | An empty hand is still an offer. |

### The sunflower ring — yellow (requires dusk)

| Trigger | Line |
|---|---|
| enter at noon | **DEATH** — Every face turned to you. For one moment you were the brightest thing in the meadow. |
| hold at dusk | At dusk the faces are all turned down. You walk the ring unlit and unnoticed. |
| hold at dusk, yellow already set | Under the tallest face, written small, there is a name. You do not say it yet. → **sets `trueName`** |
| journal | They turn toward the brightest thing. |
| journal | At noon nothing outshines the ring. |
| journal | Under the tallest face, a name, written small. |

The third journal line is written against section 1 rather than quoted from
the original draft: without it the one replay hook in the game is left to the
player's memory, which is the exact failure section 3 says the journal exists
to prevent. Ten words, observational, no causation.

The second dusk visit is the only optional content in the game and the only
route to the second ending. It is deliberately gated on *going back to a place
after it stopped being dangerous* — a thing almost nobody does the first time.

### The pond — blue

| Trigger | Line |
|---|---|
| tap | **DEATH** — You drank. The water kept the face that leaned over it, and did not give it back. |
| hold | You kneel with your eyes shut until the surface forgets you. It hands up a blue reflected off nothing. |
| journal | Reflections keep what they take. |
| journal | The pond only takes what it can see. |

### The foal — green (requires blue set)

| Trigger | Line |
|---|---|
| approach | The foal falls in behind you. It does not seem to be deciding anything. |
| any other site while following | **DEATH** — The foal followed you into it. The meadow charges the same price twice. |
| at the pond, tap | The foal drinks where you could not, and is not taken. It looks at you until you understand it was never the one in danger. |
| at the pond, hold | **DEATH** — You kept it close at the water. What you keep, the meadow keeps. |
| journal | The foal follows. |
| journal | It drank and was not taken. |
| journal | The meadow charges the same price twice. |
| journal | Closed hands are kept. |

### The dandelion — no band

| Trigger | Line |
|---|---|
| tap | You blow once. The seeds go up, and nothing is asked for them. |
| tap or hold, once blown | The stalk is bare. There is nothing left on it to give. |
| hold | **DEATH** — You closed your hand around it. What you keep, the meadow keeps. |
| journal | The seeds went. Nothing followed them back. |
| journal | Closed hands are kept. |

Both grip deaths end on the same sentence, the way the foal's two deaths
share "the meadow charges the same price twice." One inverted site is an
exception; two sites saying the same thing is a rule the player can induce.
"Closed hands are kept" answers the bramble's "Open hands are taken whole."

### The gate — violet

| Trigger | Line |
|---|---|
| approach, < 6 bands | **DEATH** — You stepped into the gate unfinished. It sorted you into the colors you had. |
| 6 bands set | The seventh band arrives on its own. Nothing was asked for it. |
| journal | The gate sorts what arrives unfinished. |

---

## 3. Ambient death

| Trigger | Line |
|---|---|
| full dark | **DEATH** — Dark. The meadow closes the way a hand closes. |
| journal | Dark closes the meadow. |

---

## 4. Endings

**Standard** — six bands, no true name:

> The unicorn takes the six colors and gives you the seventh.
> You leave the meadow whole, having paid nothing you were not asked for.
> It watches you the entire way out. It does not look away.

**True** — speaking the name at the gate:

> You say the name written under the tallest face.
> Seven colors come apart into one.
> The thing on the other side was never a unicorn. It was something divided
> seven ways a long time ago, and every rule you learned was it asking,
> politely, to be put back together.
> It does not need the meadow now.
> Neither, it turns out, do you.

The true ending's job is to recontextualize every death as a request rather
than a trap. Do not soften it, do not add a coda, do not add a credits crawl
beyond the title and author line.

---

## 5. UI strings

    title screen:     SEVEN DEATHS OF THE MEADOW
                      it is a nice day. any key.
    journal header:   what you remember
    journal empty:    nothing yet.
    HUD:              {n} deaths   ·   [J] what you remember
    death prompt:     any key
    prompt bar:       [E] {tap verb}   ·   [hold E] {hold verb}

Site verbs for the prompt bar:

| Site | tap | hold |
|---|---|---|
| stone | read | read aloud (in the dark: trace it) |
| bramble | reach in | press a thorn |
| hollow | take honey | set something down |
| ring | walk in | walk the ring |
| pond | drink (with the foal: let it go) | kneel (with the foal: keep it close) |
| foal | touch | wait |
| dandelion | blow | keep it |
| gate | enter | speak |

---

## 6. Anti-patterns

A well-meaning agent will try to add every one of these. All are forbidden.

- **A hint system after N deaths.** The journal is the hint system. Adding a
  second one deletes the pillar.
- **Checkpoints, or persisting bands across death.** Run state resets. Always.
- **Difficulty easing** — slowing a puzzle, widening a window, or forgiving a
  first mistake after repeated failure.
- **Confirmation prompts.** "Are you sure?" is the opposite of this game.
- **Highlighting the interactable**, pulsing it, or arrowing toward it.
- **A death counter that comments on itself** ("you've died a lot!").
- **Any tutorial beyond the wake stone.**
- **Softening a death line** into something apologetic or jokey.

If a playtester says the game is unfair, the fix is a clearer *journal entry*
or a shorter walk back — never a softer rule.
