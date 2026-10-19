# Review notes · #ForGoodConnections case study

Living document: open questions, placeholders, deviations. Updated at each checkpoint.

## Status (19 Oct 2026)

| Step | State |
|---|---|
| 0 · Inventory | Done. No assets in the repo (`docs/inventory.md`). |
| 1 · Footage log | **Blocked**: the Drive folder can't be read from the render container. `out/footage_log.md` lists the 36 shots the animatic needs. |
| 2 · Design system | Approved 19 Oct. |
| 3 · Animatic | Built, awaiting checkpoint 3 review: `out/preview/animatic_{en,fr}_internal.mp4` (960×540) and `out/stills/`. |
| 4 · Final | Blocked by the facts and assets listed below. `scripts/render-all.sh` is ready and refuses to run until they are in. |

## Blockers

1. **Footage folder unreachable.** The Drive connector can see the folder `Forgoodconnection` (owner mahdi@pbcompany.net) but not its files, and direct downloads from `drive.google.com` are refused by this cloud environment's network policy. Either fix works:
   - add `drive.google.com`, `drive.usercontent.google.com` and `*.googleusercontent.com` to the environment's Allowed domains (cloud environment menu → Edit → Network access), or
   - share the folder with contacthaddiouimehdi@gmail.com directly (not only by link), so the connector can list and fetch the files.
2. **Licensed music.** Without it, cuts sit on a 50-frame grid (2 s) and the stamp hits on f1875, f1935 and f1995. Everything moves to the real beats once the track is in.
3. **Helvetica Neue 75 Bold / 55 Roman** not supplied. Drafts use FreeSans (a Helvetica clone in the render container).
4. **Orange master logo** (`public/brand/orange_logo_master.png`) and **sonic logo**: the packshot shows a placeholder. The logo is never redrawn.

## Missing, handled by the system (no blocker)

- **Partner logos** (Ministry, ONDE, DGSN, ADD, ReSIS): S3 shows names in 55 Roman black on the white band until approved files land in `public/brand/partners/` (file names starting `ministere`, `onde`, `dgsn`, `add`, `resis`).
- **#ForGoodConnections brand assets**: none used. The hashtag is set in tiles per the Orange video guidelines; no FGC lockup is drawn.

## Facts awaiting the client (`src/facts.ts`)

`npx tsx scripts/check-facts.ts` today: **2 failures** (KIDS, MEHDI_AMRI_NAME), 3 slots dropped.

| Key | Draft shows | Needed | Final behaviour if still missing |
|---|---|---|---|
| KIDS | 1,500+ in an orange-outlined box | Confirm 1,500+ (estimate) vs 749 (documented) | Final blocked |
| MEHDI_AMRI_NAME | "Mehdi Amri" in an orange-outlined box | Confirm "Mehdi Amri" vs "Mehdi El Amri" | Final blocked |
| TEACHERS_TRAINED | [XX] | Result from ministry recap (6,500+ is a target, never shown) | S3 line 12, R7 and the lockup's teachers part are dropped; S5 re-times to fill |
| SCHOOLS_REACHED | [XX] | Result from ministry recap (2,200+ is a target, never shown) | S3 line 12 and R7 dropped |
| STAT_PROBLEM (optional) | slot skipped | Sourced Moroccan cyberbullying figure, if any | Skipped |
| ORGANIC_REACH_EXTRA (optional) | not shown | 309.5K, only if the client approves | Not shown |

Note: the brief says to drop R7 and the lockup's teachers part. I apply the same rule to S3 line 12, which carries the same two numbers.

## Animatic (checkpoint 3)

Timings are final per the arc (3,000 frames, exactly 2:00 at 25 fps, checked with ffprobe). Scene by scene (local frames):

- **S0** f0–125. Internal: title tile at f10, B and C cut in at f30 and f38, 8-frame fade ending f125. External toggle: "Orange" (orange on white) / "presents" f6–56, then the title tile (orange) from f62.
- **S1** 375 frames. Panel shots cut every 50 frames. Lines 2 and 4 on pure black at headline size. Line 4 lands on local f280, the planned first beat hit. The STAT_PROBLEM slot is skipped while null.
- **S2** 250 frames. Split screen; the inactive half dims to 40% for lines 6 and 7, each set under its half. Line 8 on black, headline size.
- **S3** 550 frames. Chapter on black, three recap shots with lines 9–11. "Built with" + partner band on black (f150–260). Line 12 on black with count-ups.
- **S4a** 175 frames: chapter (36), triptych + line 13, the three words cut in 6 frames apart on their panels, then line 14 on black (61 frames).
- **S4b** 200 frames: route drawn over 140 frames, stops every ~20 frames, tour panels at 25% swap at f100. Line 15 in an orange tile.
- **S4c** 100 frames: panel off-centre left. Name super and line 16 on the right.
- **S4d** 300 frames: line 17 alone on black, passport from f55, stamps at f100 / f160 / f220 with matching footage on the right, then line 21.
- **S4e** 125 frames: workshops triptych, line 22 + #EngageForChange cut in under it, live-content triptych with line 23.
- **S5** 550 frames: R1–R5 and R7 get 70 frames each (count-up 20, hold, hard cut, 10-frame flash), R6 gets 60. Lockup f2680–2750.
- **S6** 250 frames: line 24 (2 lines, "holidays" / "vacances" orange), hashtag tile, packshot (10-frame fades, ends on black at f3000).

## Decisions to confirm at checkpoint 3

1. **S4c name super** sits on the right (x 960) with line 16, not lower-left: the panel occupies the left and the brief puts the supers on the right.
2. **R6 press** is set as the names in orange at 150 px over "In the press" in 55 Roman (the colon form "In the press: Le360…" is split across the two tiles).
3. **S4a is tight**: the chapter tile holds 36 frames and line 14 holds 61 frames. If line 14 reads too fast, I can take 10–15 frames from line 13.
4. **Count-ups** show "+" only on the final value (1,500+).
5. **Lines over footage** sit in the lower third (y 930); lines on black are centred, at headline size where the brief asks for weight.

## Decisions confirmed at checkpoint 2

Tile clear space from cap height and baseline; balanced wrapping; stagger offset = the next tile's "o" width with a 4-frame settle; name in white tile / function in black; chapter and mission titles split on " · " into orange + white tiles; mission descriptions capitalised; passport header text; place supers 56/40 px clamped to margins; U+00A0 for French spacing; "Centre ReSIS" (name still to be confirmed by the client).

## Deviations from the brief

- S4c name super position (see above).
- No audio yet: music, natural sound, the −8 dB ducking and the loudness pass come with the licensed track (`render-all.sh` runs the two-pass loudnorm to −16 LUFS / −1 dBTP).
- No subtitles yet: they depend on speech in the footage.
