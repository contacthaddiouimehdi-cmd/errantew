"""Overview sheets for a folder of rushes: one row per clip, 6 evenly spaced frames,
labelled with the clip's path and duration. Used to pick shots before logging exact
in/out points on the 1 fps contact sheets.

Usage: python3 scripts/clip-overview.py public/footage/raw out/overview
"""
import json, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

src, dst = Path(sys.argv[1]), Path(sys.argv[2])
dst.mkdir(parents=True, exist_ok=True)
FRAMES, ROWS, TH = 6, 6, 300  # frames per clip, clips per sheet, thumb height
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', 18)
clips = sorted(p for p in src.rglob('*') if p.suffix.lower() in {'.mov', '.mp4', '.m4v'})

def duration(p):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', str(p)], capture_output=True, text=True).stdout
    return float(json.loads(out)['format']['duration'])

def frame(p, t):
    out = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.2f}', '-i', str(p), '-frames:v', '1', '-vf', f'scale=-2:{TH}', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
    from io import BytesIO
    return Image.open(BytesIO(out)).convert('RGB') if out else Image.new('RGB', (TH * 9 // 16, TH), (40, 40, 40))

rows = []
for p in clips:
    d = duration(p)
    thumbs = [frame(p, d * (i + 0.5) / FRAMES) for i in range(FRAMES)]
    w = sum(t.width for t in thumbs) + 6 * (FRAMES + 1)
    row = Image.new('RGB', (max(w, 900), TH + 40), (32, 32, 32))
    x = 6
    for i, t in enumerate(thumbs):
        row.paste(t, (x, 34))
        ImageDraw.Draw(row).text((x + 4, 36), f'{d * (i + 0.5) / FRAMES:.1f}s', font=font, fill=(255, 255, 255))
        x += t.width + 6
    ImageDraw.Draw(row).text((6, 6), f'{p.relative_to(src)}  ·  {d:.1f}s', font=font, fill=(255, 121, 0))
    rows.append(row)

for s in range(0, len(rows), ROWS):
    chunk = rows[s:s + ROWS]
    sheet = Image.new('RGB', (max(r.width for r in chunk), sum(r.height for r in chunk)), (32, 32, 32))
    y = 0
    for r in chunk:
        sheet.paste(r, (0, y))
        y += r.height
    sheet.save(dst / f'overview_{s // ROWS + 1:02d}.jpg', quality=85)
print(f'{len(clips)} clips → {(len(rows) + ROWS - 1) // ROWS} sheets in {dst}')
