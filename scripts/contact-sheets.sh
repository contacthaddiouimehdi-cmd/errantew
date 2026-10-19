#!/usr/bin/env bash
# Step 1 · Contact sheets: 1 frame per second, tiled, source timecode burned in.
# Output: out/contact-sheets/<video-name>/sheet_001.png, sheet_002.png, ...
# Usage: scripts/contact-sheets.sh [video ...]   (default: every video in public/footage, recursive)
set -euo pipefail
cd "$(dirname "$0")/.."

FONT=${FONT:-/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf}
THUMB_H=${THUMB_H:-320}   # thumbnail height in px; width follows the displayed aspect

if [ $# -gt 0 ]; then videos=("$@"); else
  mapfile -t videos < <(find public/footage -type f \( -iname '*.mp4' -o -iname '*.mov' -o -iname '*.m4v' -o -iname '*.mkv' \) | sort)
fi
[ ${#videos[@]} -eq 0 ] && { echo "No videos found in public/footage." >&2; exit 1; }

for f in "${videos[@]}"; do
  name=$(basename "${f%.*}")
  dir=out/contact-sheets/$name
  rm -rf "$dir"; mkdir -p "$dir"
  # ffmpeg auto-rotates on decode, so swap stored dimensions for 90/270 degree clips.
  w=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of default=nw=1:nk=1 "$f" | head -1)
  h=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of default=nw=1:nk=1 "$f" | head -1)
  rot=$(ffprobe -v error -select_streams v:0 -show_entries stream_side_data=rotation -of default=nw=1:nk=1 "$f" | head -1)
  [ -z "$rot" ] && rot=$(ffprobe -v error -select_streams v:0 -show_entries stream_tags=rotate -of default=nw=1:nk=1 "$f" | head -1)
  rot=${rot:-0}
  if [ $(( (${rot#-} / 90) % 2 )) -eq 1 ]; then t=$w; w=$h; h=$t; fi
  # Vertical clips: 10 x 3 per sheet. Horizontal: 6 x 5. Both read left to right, top to bottom.
  if [ "$h" -gt "$w" ]; then grid=10x3; else grid=6x5; fi
  ffmpeg -v error -y -i "$f" -vf "\
fps=1,scale=-2:${THUMB_H},\
drawbox=x=0:y=ih-34:w=iw:h=34:color=black@0.75:t=fill,\
drawtext=fontfile=${FONT}:text='%{pts\:hms}':x=8:y=h-27:fontsize=20:fontcolor=white,\
tile=${grid}:margin=6:padding=6:color=0x202020" \
    -fps_mode passthrough "$dir/sheet_%03d.png"
  echo "$f → $dir ($(ls "$dir" | wc -l) sheet(s), ${w}x${h}, grid $grid)"
done
