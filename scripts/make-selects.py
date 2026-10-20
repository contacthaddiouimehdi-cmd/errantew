"""Conform the selected excerpts (src/selects.json) into render-ready files:
video → public/footage/selects/<id>.mp4, H.264 CRF 14, 1080x1920 (rotation applied,
fill without stretching), 25 fps, AAC 48 kHz stereo; photo → <id>.jpg, max 2400 px,
EXIF orientation applied. Sources live in footage_src/ (not bundled by Remotion).

Usage: python3 scripts/make-selects.py [--force]
"""
import json, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parent.parent
sel = json.loads((root / 'src/selects.json').read_text())['selects']
out = root / 'public/footage/selects'
out.mkdir(parents=True, exist_ok=True)
force = '--force' in sys.argv

def source(rel):
    for base in (root / 'footage_src', root / 'public/footage'):
        if (base / rel).exists():
            return base / rel
    raise FileNotFoundError(rel)

def make(s):
    src = source(s['src'])
    if s.get('image'):
        dst = out / f"{s['id']}.jpg"
        if dst.exists() and not force:
            return f"skip {dst.name}"
        im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
        im.thumbnail((2400, 2400))
        im.save(dst, quality=92)
        return f"photo {dst.name} {im.size}"
    dst = out / f"{s['id']}.mp4"
    if dst.exists() and not force:
        return f"skip {dst.name}"
    cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(s['in']), '-i', str(src), '-t', str(s['dur']),
           '-vf', 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=25,format=yuv420p',
           '-c:v', 'libx264', '-crf', '14', '-preset', 'medium', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2',
           '-movflags', '+faststart', str(dst)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    return f"{'video' if r.returncode == 0 else 'FAIL'} {dst.name} {r.stderr.strip()[:200]}"

with ThreadPoolExecutor(4) as ex:
    for line in ex.map(make, sel):
        print(line)
