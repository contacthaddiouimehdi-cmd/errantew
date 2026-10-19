# Review notes · #ForGoodConnections case study

Living document: open questions, placeholders, deviations. Updated at each checkpoint.

## Status (19 Oct 2026)

| Step | State |
|---|---|
| 0 · Inventory | Done. No assets in the repo (`docs/inventory.md`). |
| 1 · Footage log | **Blocked**: footage unreachable. `out/footage_log.md` lists the 36 shots the film needs. |
| 2 · Design system | Approved 19 Oct. |
| 3 · Animatic | **v2 rebuilt on the FGC_VF storytelling** (orange thread, digital impact, 100 BPM grid). Awaiting review. |
| 4 · Final | Blocked by the facts and assets below. `scripts/render-all.sh` refuses to run until they are in. |

Previews: `out/preview/animatic_{en,fr}_internal_beatguide.mp4` (1080p, with a temp 100 BPM beat guide) and silent versions. Stills: `out/stills/` (27 key frames per language).

## What changed in v2 (FGC_VF)

- **The orange thread** runs through the whole film (`src/components/Thread.tsx`): it ties a knot (S1 line 2), grows into a tangle (line 4), unties (line 5), swings upright to split the screen, welds back at the centre (line 8), links the partners one by one, branches into a network of schools, runs like a road (line 14), traces the route with 7 stops on 7 beats, follows Mehdi's ball, draws the passport, turns like a key, splits into branches for the numbers, closes around "One programme · Two seasons" and underlines "holidays" / "vacances". It is gone before the packshot and never touches the logo.
- **Digital impact first**: S6 is now six KPI screens (setup, reach, Mehdi Amri effect, platforms, ground, all year), from the campaign's organic figures (Jul–Sep 2026).
- **100 BPM grid**: every cut, stamp, route stop and screen change sits on a beat (15 frames). The licensed track should be 100 BPM, phase-aligned to frame 0.
- **Title tile C** is now "A societal & environmental impact" / "Un impact sociétal et environnemental", per FGC_VF.
- **Mission 2** description follows FGC_VF ("Un jeu de cartes sur 6 thèmes numériques du quotidien").
- **Small numbers** (under 20, and percentages) land directly; only larger numbers count up.
- **Placeholders** now say what each shot should show.

## To confirm with you / Orange

1. **Brief conflict, engagement rates.** The original brief said never to show engagement rates; FGC_VF shows "1.6% interaction" (Mehdi collab) and "TikTok 2.5% interaction". I followed FGC_VF. Confirm, or I drop those two lines.
2. **English adaptation** of the FGC_VF lines is mine (FR is the master). Check in particular: "Mehdi Amri collab", "#1 content of the campaign", "twice the other reels", "4 cross-posts" (Facebook Orange Maroc branch).
3. **Facebook Orange Maroc branch** in screen 1 shows "4 cross-posts" (the 4 Instagram posts), so the five branches add up to 33 while the hero says 29 posts. Alternative: show that branch without a number.
4. **Mehdi Amri name**, used in S4 and in the S6 kicker, still unconfirmed (Mehdi Amri / Mehdi El Amri).
5. Optional, not shown: + 309.5K sponsored impressions, + 47 followers, 1.0% global interaction rate (FGC_VF lists them as optional or not shown).

## Blockers

1. **Footage unreachable.** The Drive folders (Forgoodconnection; Orange Talents 2026 / For Good Connections), the Instagram reel and the LinkedIn post are all refused by this cloud environment's network policy, and the Drive connector can see the folders but not their files. Fix: add `drive.google.com`, `drive.usercontent.google.com` and `*.googleusercontent.com` to the environment's Allowed domains (cloud environment menu → Edit → Network access), or share the folders directly with contacthaddiouimehdi@gmail.com.
2. **Licensed music** (100 BPM, two proposals expected per FGC_VF). The preview uses a temp beat guide (`scripts/beat-guide.sh`), never the final audio.
3. **Helvetica Neue 75 Bold / 55 Roman**. Drafts use FreeSans.
4. **Orange master logo** and **sonic logo**. The packshot shows a placeholder.

## Missing, handled by the system (no blocker)

- **Partner logos** (Ministry, ONDE, DGSN, ADD, ReSIS): names in 55 Roman black on the white band until approved files land in `public/brand/partners/`.
- **#ForGoodConnections brand assets**: none used; the hashtag is set in tiles.

## Facts (`src/facts.ts`)

`npx tsx scripts/check-facts.ts`: **2 failures** (KIDS, MEHDI_AMRI_NAME); TEACHERS_TRAINED, SCHOOLS_REACHED, STAT_PROBLEM dropped in the final if still null. All FGC_VF digital figures are entered as confirmed with FGC_VF as their source.

| Key | Draft shows | Needed | Final behaviour if still missing |
|---|---|---|---|
| KIDS | 1,500+ in an orange-outlined box | 1,500+ (estimate) vs 749 (documented) | Final blocked |
| MEHDI_AMRI_NAME | "Mehdi Amri" in an orange-outlined box | Spelling | Final blocked |
| TEACHERS_TRAINED / SCHOOLS_REACHED | [XX] | Ministry results (targets never shown) | S3 line 12 and S6 screen 6 numbers dropped; the lockup stays |

## Timeline (25 fps, 3,000 frames, 2:00; beats every 15 frames)

| Scene | Frames | Content |
|---|---|---|
| S0 Title | 0–125 | Title tiles on black |
| S1 Problem | 125–500 | Lines 1–4; knot on line 2, tangle on line 4 (first beat, f405) |
| S2 Idea | 500–750 | Untie, split screen (divider = thread), weld on line 8 |
| S3 Season 1 | 750–1300 | Chapter, partners linked by the thread, network, numbers |
| S4 Season 2 | 1300–1775 | Triptych, road, words, route (stops f1530–1620), Mehdi + ball thread |
| S5 Mechanic | 1775–2200 | Passport drawn by the thread, stamps f1875 / f1920 / key / f1965, certified, workshops, live |
| S6 Numbers | 2200–2750 | Six screens, flashes between |
| S7 Closing | 2750–3000 | Line 24 underlined, hashtag, packshot from f2930 |

## Deviations from the original brief

- Engagement rates shown (see "To confirm" 1).
- S4 name super on the right of the Mehdi panel.
- No audio yet beyond the temp beat guide; no subtitles yet (they depend on speech in the footage).
