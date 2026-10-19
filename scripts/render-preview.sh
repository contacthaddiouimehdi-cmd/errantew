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
for spec in S0:100 S1:185 S2:620 S3a:840 S3b:960 S3c:1230 S4a:1395 S4b:1645 S4c:1735 S4d:2005 S4e:2120 S5:2240 S5-lockup:2720 S6:2810 S6-packshot:2960; do
  id=${spec%%:*}; frame=${spec##*:}
  npx remotion still out/.bundle FGC-CaseStudy "out/stills/${id}_${LANG_}_${VERSION}.png" --frame="$frame" --props="$props" --log=error
  echo "✓ still $id (f$frame)"
done
if [ "${STILLS_ONLY:-0}" != 1 ]; then
  npx remotion render out/.bundle FGC-CaseStudy "out/preview/animatic_${LANG_}_${VERSION}.mp4" \
    --props="$props" --scale=0.5 --codec=h264 --crf=26 --log=error
  echo "✓ out/preview/animatic_${LANG_}_${VERSION}.mp4"
fi
