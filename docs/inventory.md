# Step 0 · Inventory (19 Oct 2026)

Re-run at any time with `scripts/inventory.sh` (folders, ffprobe table, required-asset checklist).
Contact sheets for step 1: `scripts/contact-sheets.sh` → `out/contact-sheets/<video>/sheet_NNN.png`
(1 fps, source timecode burned in, rotation-aware; tested on a synthetic 16:9 clip and a −90° phone clip).

## Repository

The repo contains only `README.md`. `public/` does not exist yet, so **every asset in section 6/7 is missing**.

| Asset | Status | Blocks |
|---|---|---|
| `public/footage/bestof_fgc_2026.mp4` (9:16 Best Of) | missing | footage log, S1, S2, S4, S5 |
| `public/footage/recap_ministere.mp4` (ministry recap) | missing | footage log, S2, S3 |
| `public/footage/raw/` (optional extras) | missing | optional |
| `public/brand/orange_logo_master.png` (official master) | missing | S6 packshot |
| `public/brand/partners/` Ministry, ONDE, DGSN, ADD, ReSIS | missing | S3 (names in 55 Roman until supplied) |
| `public/fonts/` Helvetica Neue 75 Bold + 55 Roman | missing | final render (drafts can fall back) |
| `public/audio/music.wav` (licensed) | missing | animatic timing to the beat, S1, S5 rhythm |
| `public/audio/orange_sonic_logo.wav` | missing | S6 packshot |

ffprobe: nothing to probe yet.

## What I found in your Google Drive (read-only search, nothing downloaded)

| Drive location | Contents | Possible use |
|---|---|---|
| Orange Talents 2026 / **For Good Connections** (shared by m.mezzourh@pbcompany.net) | empty | the natural home for the Best Of |
| Orange Talents 2026 / Finale - Casablanca, Prises villes, Orange Money | no files visible to me | — |
| **Tournée harcèlement** (shared by hbenramdane@gmail.com, Apr 2026) | ~35 WhatsApp photos in 7 regional folders (Drâa-Tafilalet, Laâyoune-Sakia El Hamra, Guelmim-Oued Noun, Rabat-Salé-Kénitra, Fès-Meknès, Souss-Massa, L'Oriental) | possibly Season 1 school-programme stills for S3 → **please confirm what this tour is before I use any of it** |
| **Logos partenaires** (shared by leila.meherzi@gmail.com, May 2026) | no files visible to me | possibly the S3 partner logos |
| Rapport_ForGoodConnections_2026 / _T3_2026 (several versions) | post-op report decks | source for facts.ts (already summarised in the brief) |

No Best Of, ministry recap, Orange master logo, Helvetica Neue files, music or sonic logo turned up.

## Things to watch for when the footage arrives

- **Frame rate.** The comp is 25 fps. If the Best Of is 30 or 29.97 fps (typical for phone/social edits), I will conform it in Remotion and note it; no re-timing of action.
- **Rotation.** Phone files often store 1920×1080 with a −90° flag. The scripts handle this; the footage log will record the displayed orientation.
- **Speech.** Any intelligible Darija/French/Arabic needs subtitles; unclear lines get `[?]` in footage_log.md for you.
