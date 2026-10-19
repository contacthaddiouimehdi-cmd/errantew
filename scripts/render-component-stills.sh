#!/usr/bin/env bash
# Checkpoint 2 · one still per component, on black and (where it applies) on footage.
# Output: out/stills/components/<Component>_<bg>_<lang>.png
set -euo pipefail
cd "$(dirname "$0")/.."
LANGS=${LANGS:-en}
out=out/stills/components
mkdir -p "$out"
npx remotion bundle src/index.ts --out-dir=out/.bundle >/dev/null
# name:frame:footageBg, read from the gallery definition
items=$(node -e '
  const src = require("fs").readFileSync("src/gallery/Gallery.tsx", "utf8");
  const re = /^\s{2}["\x27]?([A-Za-z-]+)["\x27]?: \{\s*frame: (\d+),(\s*footageBg: false)?/gm;
  let m; while ((m = re.exec(src))) console.log(`${m[1]}:${m[2]}:${m[3] ? 0 : 1}`);
')
for spec in $items; do
  IFS=: read -r name frame footage <<<"$spec"
  for lang in $LANGS; do
    for bg in black footage; do
      [ "$bg" = footage ] && [ "$footage" = 0 ] && continue
      npx remotion still out/.bundle "C-$name" "$out/${name}_${bg}_${lang}.png" \
        --frame="$frame" --props="{\"bg\":\"$bg\",\"lang\":\"$lang\",\"item\":\"$name\"}" --log=error
      echo "✓ ${name}_${bg}_${lang}"
    done
  done
done
