import {cssFont} from './fonts';
import {clearSpaceFallback, Weight} from './tokens';

let ctx: CanvasRenderingContext2D | null = null;
const context = (): CanvasRenderingContext2D | null => {
  if (ctx) return ctx;
  if (typeof document === 'undefined') return null;
  ctx = document.createElement('canvas').getContext('2d');
  return ctx;
};

const cache = new Map<string, number>();

const metric = (key: string, compute: (c: CanvasRenderingContext2D) => number, fallback: number): number => {
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  const c = context();
  if (!c) return fallback;
  const v = compute(c);
  cache.set(key, v);
  return v;
};

export const textWidth = (text: string, w: Weight, px: number): number =>
  metric(`w|${w}|${px}|${text}`, (c) => {
    c.font = cssFont(w, px);
    return c.measureText(text).width;
  }, text.length * px * 0.55);

// The "o" sets the tile clear space: horizontal = its width, vertical = 2/3 of its height.
export const oBox = (w: Weight, px: number): {w: number; h: number} => ({
  w: metric(`ow|${w}|${px}`, (c) => {
    c.font = cssFont(w, px);
    const m = c.measureText('o');
    return m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
  }, clearSpaceFallback.x * px),
  h: metric(`oh|${w}|${px}`, (c) => {
    c.font = cssFont(w, px);
    const m = c.measureText('o');
    return m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  }, (clearSpaceFallback.y * px * 3) / 2),
});

export const capHeight = (w: Weight, px: number): number =>
  metric(`cap|${w}|${px}`, (c) => {
    c.font = cssFont(w, px);
    return c.measureText('H').actualBoundingBoxAscent;
  }, px * 0.72);

// Greedy word wrap against a max text width.
export const wrap = (text: string, w: Weight, px: number, maxWidth: number): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (line && textWidth(next, w, px) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
};

// Same number of lines as greedy wrapping, but with the narrowest measure that still fits,
// so lines come out even (no orphans).
export const wrapBalanced = (text: string, w: Weight, px: number, maxWidth: number): string[] => {
  const greedy = wrap(text, w, px, maxWidth);
  if (greedy.length <= 1) return greedy;
  let lo = Math.max(...text.split(' ').map((word) => textWidth(word, w, px)));
  let hi = maxWidth;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (wrap(text, w, px, mid).length <= greedy.length) hi = mid;
    else lo = mid;
  }
  return wrap(text, w, px, hi);
};
