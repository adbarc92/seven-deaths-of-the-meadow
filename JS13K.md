# JS13K.md — competition constraints and shipping pipeline

Background an agent working on this will not have from training data. Verified
against js13kgames.com and the 2026 announcement, September 2026.

---

## 1. The competition

js13kGames is a JavaScript game jam running yearly since 2012, organized by
Andrzej Mazur (Enclave Games). 2026 is the fifteenth edition. It runs on fixed
dates every year: **13 Aug 13:00 CEST → 13 Sep 13:00 CEST**. For this entry
the deadline is **05:00 America/Denver on Sep 13, 2026**.

**Theme: Unicorns and Rainbows.** The organizers explicitly invited any
interpretation — kid-friendly unicorns, evil unicorns, rainbows as set
dressing. The theme came out of a suggestion that *fun* be weighted in
judging. Note the field this creates: a large share of ~200 entries will be
either sincere-cute or gore-shock. This entry's whole competitive position is
being neither — cute surface, no gore, dread from arithmetic.

Roughly 160–250 entries per year. Top 100 get t-shirts; there are 20+ prize
types. Every entry receives at least one written expert review, plus peer
comments.

## 2. Hard rules

- **13,312 bytes maximum, zipped.** Everything: code, assets, fonts, audio.
- **No external services or libraries at runtime.** No CDN, no Google Fonts,
  no remote asset fetch. The zip must run offline from a local `index.html`.
- Assets count against the limit. This entry ships zero assets by design —
  everything is canvas paths and gradients.
- Entry must run in a browser from `index.html` at the root of the zip.
- Unminified source may live in a public repo; only the zip is measured.

Categories entered: **Desktop** and **Mobile**. Mobile is a separate ranking
and touch support is cheap here — four verbs, no twitch input, no precision
aiming. Not entering WebXR, Online, or Wavedash.

The **Unfinished** category exists for incomplete entries. It is the floor,
not the plan; see the day-9 submit rule in DESIGN.md section 8.

## 3. Build pipeline

    esbuild --minify  →  inline into index.html  →  roadroller  →  zip -9  →  advzip -z -4

Notes from prior years' winners, worth knowing before improvising:

- Concatenating everything into one file, minifying, then packing beats any
  multi-file arrangement. There is no benefit to module structure in the zip.
- **advzip typically saves ~800–1000 bytes** over plain `zip`. That is 7% of
  the entire budget for one command. Never ship without it.
- Roadroller is a self-extracting JS packer that usually beats terser-alone by
  a wide margin on code-heavy entries. It costs ~2 KB of decoder stub, so it
  only pays off above roughly 6–8 KB of minified JS. **Measure both ways** —
  below that threshold, plain minify + advzip wins.
- Prose gzips extremely well and does *not* benefit from roadroller the way
  code does. Since this entry is text-heavy, run the A/B every time the
  content grows substantially.
- Short identifiers matter less than repeated substrings. Reusing the same
  phrasing across death lines is a compression win *and* a voice win.

## 4. Size discipline

`build.sh` fails the build over 13,312 bytes. Run it on every commit; never
let the number be a surprise on the final day.

Report the number in every progress update, in the form:

    3804 / 13312 bytes (9508 free)

If the budget gets tight, cut in this order:

1. Visual polish on sites (they are procedural — reduce iteration counts)
2. Audio
3. A band, reassigning its color to an ambient death

**Never cut**, at any budget: the journal, the second ending, or the under-20-
seconds respawn rule. Those three are the entry.

## 5. Submission

The submit form is already open and **entries can be updated until the
deadline**. This is why the plan submits a working build on Sep 9 and
re-submits daily. There is no reason to hold a build back.

Practical checklist for the final submit:
- Test the actual zip, extracted, opened as a local file — not the dev server.
- Test in Firefox as well as Chrome. Canvas text metrics differ slightly.
- Test on a phone in portrait. The 320×320 logical space letterboxes fine, but
  confirm touch input actually fires.
- Submit hours early. The cutoff is 05:00 local and the server gets hammered.
