#!/usr/bin/env bash
# Final · check facts and assets, render EN + FR, loudness pass (−16 LUFS, −1 dBTP).
# Output: out/fgc_case_study_en.mp4, out/fgc_case_study_fr.mp4 (H.264 1080p25 CRF 16, AAC 48 kHz stereo).
set -euo pipefail
cd "$(dirname "$0")/.."

npx tsx scripts/check-facts.ts

missing=0
need() { [ -e "$1" ] || { echo "Missing for final: $1" >&2; missing=1; }; }
ls public/fonts/*Bold* >/dev/null 2>&1 || { echo "Missing for final: Helvetica Neue 75 Bold in public/fonts/" >&2; missing=1; }
ls public/fonts/*Roman* >/dev/null 2>&1 || { echo "Missing for final: Helvetica Neue 55 Roman in public/fonts/" >&2; missing=1; }
need public/brand/orange_logo_master.png
need public/audio/music.wav
need public/audio/orange_sonic_logo.wav
[ "$missing" = 0 ] || { echo "render-all: aborting, assets missing." >&2; exit 1; }

npx remotion bundle src/index.ts --out-dir=out/.bundle --log=error
for lang in en fr; do
  raw=out/.raw_${lang}.mp4
  npx remotion render out/.bundle FGC-CaseStudy "$raw" \
    --props="{\"lang\":\"$lang\",\"version\":\"${VERSION:-internal}\",\"final\":true}" \
    --codec=h264 --crf=16 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=320k --enforce-audio-track --log=error
  # Two-pass loudnorm to −16 LUFS integrated, −1 dBTP.
  stats=$(ffmpeg -hide_banner -i "$raw" -af loudnorm=I=-16:TP=-1:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
  get() { echo "$stats" | grep "\"$1\"" | sed -E 's/.*: "([^"]+)".*/\1/'; }
  ffmpeg -v error -y -i "$raw" -c:v copy \
    -af "loudnorm=I=-16:TP=-1:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true" \
    -c:a aac -b:a 320k -ar 48000 -ac 2 "out/fgc_case_study_${lang}.mp4"
  rm -f "$raw"
  echo "✓ out/fgc_case_study_${lang}.mp4"
done
