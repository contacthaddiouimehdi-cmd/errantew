#!/usr/bin/env bash
# Checkpoint 3 · animatic: low-res preview MP4 + one full-res still per scene (key frames).
# Usage: scripts/render-preview.sh [en|fr] [internal|external]
set -euo pipefail
cd "$(dirname "$0")/.."
LANG_=${1:-en}
VERSION=${2:-internal}
props="{\"lang\":\"$LANG_\",\"version\":\"$VERSION\",\"final\":false}"
mkdir -p out/preview out/stills
npx remotion bundle src/index.ts --out-dir=out/.bundle --log=error
# id:frame — key frames chosen to show each scene's main idea
for spec in S0:100 S1a:185 S1b:275 S1c:465 S2a:530 S2b:630 S2c:735 S3a:790 S3b:990 S3c:1180 S3d:1250 S4a:1450 S4b:1500 S4c:1645 S4d:1740 S5a:1839 S5b:1960 S5c:1990 S5d:2105 S6a:2270 S6b:2350 S6c:2440 S6d:2530 S6e:2620 S6f:2735 S7a:2810 S7b:2960; do
  id=${spec%%:*}; frame=${spec##*:}
  npx remotion still out/.bundle FGC-CaseStudy "out/stills/${id}_${LANG_}_${VERSION}.png" --frame="$frame" --props="$props" --log=error
  echo "✓ still $id (f$frame)"
done
if [ "${STILLS_ONLY:-0}" != 1 ]; then
  out=out/preview/animatic_${LANG_}_${VERSION}.mp4
  npx remotion render out/.bundle FGC-CaseStudy "$out" \
    --props="$props" --scale="${SCALE:-0.5}" --codec=h264 --crf="${CRF:-26}" --log=error
  # Temp 100 BPM beat guide so the edit can be judged on rhythm (preview only, not the music).
  [ -f out/preview/beat_guide_100bpm.wav ] || bash scripts/beat-guide.sh
  ffmpeg -v error -y -i "$out" -i out/preview/beat_guide_100bpm.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest "${out%.mp4}_beatguide.mp4"
  echo "✓ $out (silent) and ${out%.mp4}_beatguide.mp4 (temp beat guide)"
fi
