# ART.md — palette and drawing conventions

Zero image assets. Everything is canvas paths, arcs, ellipses, and gradients.
This file exists because "draw it procedurally" is the kind of instruction an
agent will interpret twelve different ways across twelve sites.

---

## 1. The colorblind constraint

The game is named after a rainbow and has seven color-coded bands. **Color
must never be a puzzle input.**

Puzzle inputs are, in every case: *which site you are at*, *which verb you
use*, *what you are carrying*, and *what time it is*. Never *what color
something is*. A player with full deuteranopia must be able to complete the
game with identical information.

Consequences an agent must preserve:

- The rainbow HUD is **position-coded**. Bands always occupy the same seven
  slots in the same left-to-right order. Set/unset is signalled by
  fill-vs-grey and by the band being *drawn at all*, not by hue.
- No site ever asks the player to match a color to another color.
- The red berry is identified in prose as "the red berry" and is the only
  carryable item in the game. Its color is flavor; its identity is
  "the thing you are holding".
- Sites are **shape-distinct at silhouette**: the bramble is a tangle of arcs,
  the stone is a flat ellipse with rules, the hollow is a dark opening, the
  ring is a circle of tall stalks, the pond is a filled ellipse, the foal
  moves. None of them need color to be told apart.

If a proposed puzzle requires distinguishing red from green, it is rejected
on this rule alone, regardless of how good it is.

## 2. Palette

Seven band hues, in fixed order:

    red      #ff5b6e
    orange   #ffa24b
    yellow   #ffe066
    green    #7ddb8f
    blue     #6fc4ff
    indigo   #9a8cff
    violet   #d98cff

Environment:

    meadow near   #cfeecb
    meadow far    #8fc79a
    sky           #ffe9f3   (vertical fade into meadow near)
    bramble dark  #4a3b57
    stone         #9a94a8   / rules #6d6679
    unicorn       #fffaff
    letterbox     #120f18
    death text    #ffdce3   on rgba(18,15,24,.82)

Everything in the playfield is high-value and low-saturation-contrast. The
only genuinely dark colors in the game are the bramble, the letterbox, and
the death overlay. That contrast is doing the tonal work — keep it scarce.

## 3. Time of day

Noon, dusk, and dark are a **single translucent fillRect over the playfield**,
plus a flower-alpha multiplier. Do not re-tint individual elements.

    noon   no overlay,                    flower alpha 0.75
    dusk   rgba(90,60,110,.28),           flower alpha 0.45
    dark   rgba(18,15,24,.72),            flower alpha 0.15

Dusk must be unmistakable at a glance — a player who can't tell what time it
is cannot solve yellow, and that failure will read as unfairness rather than
as a puzzle. If the tint is subtle, it is wrong.

## 4. Drawing conventions

- Logical space is **320×320**, letterboxed and scaled to the smaller viewport
  dimension. All coordinates in source are logical.
- Never a path-data string longer than ~40 characters. If a shape needs more,
  build it from a loop over arcs — loops compress, coordinate lists do not.
- Reuse `createLinearGradient` results where possible; each one costs bytes.
- Line width 1.4 for organic things (bramble, stalks), 0.7 for carved detail.
- Scenery randomness is **seeded and precomputed once** at load. Nothing in the
  playfield may shimmer between frames or differ between runs — the meadow
  being identical every time is a design point, not just a perf one.
- Fonts: `sans-serif` only, sizes 6/7/8px in logical space. No webfont, no
  custom letterforms, no font stack.

## 5. The unicorn

The player character is currently four ellipses and a gradient horn. It reads
at scale but it is the weakest thing on screen, and it is the thing the theme
is named for.

Budget ~200 bytes for it on Sep 10–11, not before. When improving it:

- Silhouette first: legs and a mane read at 12px; facial detail does not.
- The horn gradient (violet → yellow) is the only place the full rainbow
  palette touches the player. Keep that.
- Do not animate a walk cycle. A two-frame bob tied to movement is enough and
  costs almost nothing.
- Do not make it expressive. The player character has no reactions to
  anything, including its own deaths.

## 6. What the foal looks like

Same construction as the player at 0.6 scale, no horn. That is the entire
spec — the resemblance is the point, and the missing horn is the only
information the player needs about what the foal is and what the meadow
eventually expects it to become.
