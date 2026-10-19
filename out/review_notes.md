# Review notes · #ForGoodConnections case study

Living document: open questions, placeholders, deviations. Updated at each checkpoint.

## Status (19 Oct 2026)

| Step | State |
|---|---|
| 0 · Inventory | Done. No assets in the repo (`docs/inventory.md`). |
| 1 · Footage log | **Blocked**: the shared Drive folder "Forgoodconnection" cannot be read from the render container (see Blockers). |
| 2 · Design system | Built, awaiting checkpoint 2 review (your go-ahead on 19 Oct: "start with the elements available"). |
| 3 · Animatic | Not started. |
| 4 · Final | Not started. |

## Blockers

1. **Footage folder unreachable.** The Drive connector can see the folder `Forgoodconnection` (owner mahdi@pbcompany.net) but not its files, and direct downloads from `drive.google.com` are refused by this cloud environment's network policy. Either fix works:
   - add `drive.google.com`, `drive.usercontent.google.com` and `*.googleusercontent.com` to the environment's Allowed domains (cloud environment menu → Edit → Network access), or
   - share the folder with contacthaddiouimehdi@gmail.com directly (not only by link), so the connector can list and fetch the files.
2. **Helvetica Neue 75 Bold / 55 Roman** not supplied. Drafts use FreeSans (a Helvetica clone in the render container). The final must not ship on the fallback.
3. **Orange master logo** (`public/brand/orange_logo_master.png`) and **sonic logo**: the packshot shows a placeholder. Logo is never redrawn.
4. **Licensed music**: needed before the animatic is locked to the beat.

## Missing, handled by the system (no blocker)

- **Partner logos** (Ministry, ONDE, DGSN, ADD, ReSIS): S3 shows names in 55 Roman black on the white band until approved files land in `public/brand/partners/` (file names starting `ministere`, `onde`, `dgsn`, `add`, `resis`).
- **#ForGoodConnections brand assets**: none used. The hashtag is set in tiles per the Orange video guidelines; no FGC lockup is drawn.

## Facts awaiting the client (`src/facts.ts`)

| Key | Draft shows | Needed |
|---|---|---|
| KIDS | 1,500+ in an orange-outlined box | Confirm 1,500+ (estimate) vs 749 (documented) |
| MEHDI_AMRI_NAME | "Mehdi Amri" in an orange-outlined box | Confirm "Mehdi Amri" vs "Mehdi El Amri" |
| TEACHERS_TRAINED | [XX] | Result from ministry recap (6,500+ is a target, never shown) |
| SCHOOLS_REACHED | [XX] | Result from ministry recap (2,200+ is a target, never shown) |
| STAT_PROBLEM (optional) | slot dropped | Sourced Moroccan cyberbullying figure, if any |
| ORGANIC_REACH_EXTRA (optional) | not shown | 309.5K, only if the client approves |

## Design decisions to confirm at checkpoint 2

1. **Tile vertical clear space** is measured from the cap height and the baseline (2/3 of the "o" height each side), so descenders dip into the bottom padding. Lines with and without descenders then share one tile height.
2. **Wrapped supers** become one tile per line, stacked flush and centred, with balanced line breaks (no orphan words).
3. **Stacked tiles** ("cut in under the first"): offset right by the second tile's own "o" width. The settle is a 12 px rise over 4 frames, ease-out.
4. **Name and function**: name in a white tile with black text, function in a black tile with white text.
5. **Chapter tiles and mission titles** split on " · ": first part orange tile (75 Bold), second part white tile, cut in under it.
6. **Mission descriptions** start with a capital ("A board game…") because they sit in their own tile (sentence case), unlike the em-dash form in the brief.
7. **Passport** carries "Digital Hero / Passport" in white inside its orange header (part of the illustration). Stamps: blue (CyberBoard), yellow (Serious Game), orange (Gaming zone). Blue and yellow appear nowhere else in the film.
8. **Place supers** on the tour route: name 56 px (75 Bold) in white tiles, date 40 px (55 Roman) on black. Stops alternate above and below the line, and end tiles are clamped inside the 96 px margins.
9. **French spacing** uses U+00A0 (non-breaking space) before : ! ? % and as the thousands separator. Tell me if you prefer the narrow U+202F before ! ? and in numbers.
10. **ReSIS in French** is written "Centre ReSIS". Please confirm the official name.

## Deviations from the brief

- None in the design system so far. Footage-dependent stills use a labelled grey gradient stand-in instead of real footage.
