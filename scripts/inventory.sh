#!/usr/bin/env bash
# Step 0 · Inventory. Lists the asset folders, probes every video, and checks
# the required asset list from the brief (section 6/7).
# Usage: scripts/inventory.sh            (run from the repo root)
set -uo pipefail
cd "$(dirname "$0")/.."

echo "## Folders"
for d in public/footage public/brand public/fonts public/audio; do
  echo "### $d"
  if [ -d "$d" ]; then
    find "$d" -type f | sort | while read -r f; do
      printf -- "- %s (%s)\n" "$f" "$(du -h "$f" | cut -f1)"
    done
  else
    echo "- (folder missing)"
  fi
done

echo
echo "## Videos"
echo "| File | Stored WxH | Rotation | Displayed WxH | Orientation | fps | Duration (s) | Audio |"
echo "|---|---|---|---|---|---|---|---|"
find public/footage -type f \( -iname '*.mp4' -o -iname '*.mov' -o -iname '*.m4v' -o -iname '*.mkv' \) 2>/dev/null | sort |
while read -r f; do
  w=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of default=nw=1:nk=1 "$f" | head -1)
  h=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of default=nw=1:nk=1 "$f" | head -1)
  fps=$(ffprobe -v error -select_streams v:0 -show_entries stream=avg_frame_rate -of default=nw=1:nk=1 "$f" |
        awk -F/ '{ if ($2 > 0) printf "%.3f", $1/$2; else print $1 }')
  dur=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$f" | awk '{printf "%.2f", $1}')
  # Rotation lives either in the display matrix side data or in the legacy rotate tag.
  rot=$(ffprobe -v error -select_streams v:0 -show_entries stream_side_data=rotation -of default=nw=1:nk=1 "$f" | head -1)
  [ -z "$rot" ] && rot=$(ffprobe -v error -select_streams v:0 -show_entries stream_tags=rotate -of default=nw=1:nk=1 "$f" | head -1)
  rot=${rot:-0}
  dw=$w; dh=$h
  if [ $(( (${rot#-} / 90) % 2 )) -eq 1 ]; then dw=$h; dh=$w; fi
  if [ "$dh" -gt "$dw" ]; then o=vertical; elif [ "$dh" -eq "$dw" ]; then o=square; else o=horizontal; fi
  a=$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 "$f" | paste -sd' ')
  echo "| $f | ${w}x${h} | $rot | ${dw}x${dh} | $o | $fps | $dur | ${a:-none} |"
done

echo
echo "## Required assets"
missing=0
check() { if [ -e "$1" ]; then echo "- [x] $1"; else echo "- [ ] $1 · MISSING ($2)"; missing=$((missing+1)); fi; }
check public/footage/bestof_fgc_2026.mp4   "vertical Best Of, used in S1, S2, S4, S5"
check public/footage/recap_ministere.mp4   "ministry recap, used in S2, S3"
check public/brand/orange_logo_master.png  "packshot, official master artwork only"
for p in ministere onde dgsn add resis; do
  ls public/brand/partners/${p}*.png >/dev/null 2>&1 && echo "- [x] partner logo: $p" ||
    { echo "- [ ] partner logo: $p · MISSING (S3 shows the name in 55 Roman instead)"; missing=$((missing+1)); }
done
ls public/fonts/*Bold* >/dev/null 2>&1 && echo "- [x] Helvetica Neue 75 Bold" ||
  { echo "- [ ] Helvetica Neue 75 Bold · MISSING (drafts fall back to system Helvetica/Arial; blocker for final)"; missing=$((missing+1)); }
ls public/fonts/*Roman* >/dev/null 2>&1 && echo "- [x] Helvetica Neue 55 Roman" ||
  { echo "- [ ] Helvetica Neue 55 Roman · MISSING (drafts fall back; blocker for final)"; missing=$((missing+1)); }
check public/audio/music.wav               "licensed music bed"
check public/audio/orange_sonic_logo.wav   "sonic logo for the packshot"
echo
echo "$missing required asset(s) missing."
