import React from 'react';
import {Easing, interpolate} from 'remotion';
import {core, HEIGHT, layout as L, WIDTH} from '../tokens';

// The orange thread (le fil orange): one continuous 6 px orange line that changes role
// in every sequence: knot, divider, road, route, passport outline, key, branches,
// underline. Flat, solid, drawn on with a gentle ease-out. It never touches the logo.

export type Pt = [number, number];

export const cumulative = (pts: Pt[]): number[] => {
  const c = [0];
  for (let i = 1; i < pts.length; i++) c.push(c[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return c;
};

const at = (pts: Pt[], cum: number[], d: number): Pt => {
  if (d <= 0) return pts[0];
  const total = cum[cum.length - 1];
  if (d >= total) return pts[pts.length - 1];
  let i = 1;
  while (cum[i] < d) i++;
  const k = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
  return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k];
};

// Sub-path between fractions a and b of the total length.
export const slice = (pts: Pt[], a: number, b: number): Pt[] => {
  if (pts.length < 2 || b <= a) return [];
  const cum = cumulative(pts);
  const total = cum[cum.length - 1];
  const da = a * total;
  const db = b * total;
  const out: Pt[] = [at(pts, cum, da)];
  for (let i = 0; i < pts.length; i++) if (cum[i] > da && cum[i] < db) out.push(pts[i]);
  out.push(at(pts, cum, db));
  return out;
};

export const pointAt = (pts: Pt[], f: number): Pt => {
  const cum = cumulative(pts);
  return at(pts, cum, f * cum[cum.length - 1]);
};

const toD = (pts: Pt[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');

// Draw-on progress: gentle ease-out (guidelines: linear or gentle ease-out only).
export const draw = (frame: number, start: number, dur: number): number =>
  interpolate(frame, [start, start + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

export const ease = (frame: number, start: number, dur: number, from = 0, to = 1): number =>
  interpolate(frame, [start, start + dur], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

export type ThreadProps = {
  paths: Pt[][]; // drawn together with the same progress
  from?: number; // 0–1, tail
  to?: number; // 0–1, head
  head?: boolean; // white leading dot while drawing
  opacity?: number;
  width?: number;
  dash?: [number, number];
  dashOffset?: number;
};

export const Thread: React.FC<ThreadProps> = ({paths, from = 0, to = 1, head = true, opacity = 1, width = L.routeStroke, dash, dashOffset = 0}) => (
  <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', left: 0, top: 0, opacity, overflow: 'visible'}}>
    {paths.map((pts, i) => {
      const part = slice(pts, from, to);
      if (part.length < 2) return null;
      const end = part[part.length - 1];
      return (
        <g key={i}>
          <path
            d={toD(part)}
            fill="none"
            stroke={core.orange}
            strokeWidth={width}
            strokeLinecap={dash ? 'butt' : 'round'}
            strokeLinejoin="round"
            strokeDasharray={dash ? dash.join(' ') : undefined}
            strokeDashoffset={dashOffset}
          />
          {head && to < 1 && to > 0 ? <circle cx={end[0]} cy={end[1]} r={8} fill={core.white} stroke={core.orange} strokeWidth={4} /> : null}
        </g>
      );
    })}
  </svg>
);

// Node dot on the thread (stops, partners, branch ends): hard cut, no bounce.
export const Node: React.FC<{p: Pt; r?: number}> = ({p, r = 12}) => (
  <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    <circle cx={p[0]} cy={p[1]} r={r} fill={core.white} stroke={core.orange} strokeWidth={6} />
  </svg>
);

// ---------- Path generators ----------

export const line = (a: Pt, b: Pt, n = 2): Pt[] =>
  Array.from({length: n}, (_, i) => [a[0] + ((b[0] - a[0]) * i) / (n - 1), a[1] + ((b[1] - a[1]) * i) / (n - 1)] as Pt);

export type Loop = {cx: number; r: number; dir: 1 | -1};

// A horizontal thread with cursive loops that cross themselves (the knot). r → 0 unties it.
export const knot = (x0: number, x1: number, y: number, loops: Loop[]): Pt[] => {
  const pts: Pt[] = [[x0, y]];
  const sorted = [...loops].sort((p, q) => p.cx - q.cx);
  for (const {cx, r, dir} of sorted) {
    const w = r * 1.3;
    const s = cx - w / 2;
    pts.push([s, y]);
    const n = 90;
    for (let i = 1; i <= n; i++) {
      const t = i / n;
      pts.push([s + w * t + r * Math.sin(2 * Math.PI * t), y - dir * r * (1 - Math.cos(2 * Math.PI * t))]);
    }
  }
  pts.push([x1, y]);
  return pts;
};

export const bezier = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, n = 60): Pt[] =>
  Array.from({length: n + 1}, (_, i) => {
    const t = i / n;
    const u = 1 - t;
    return [
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ] as Pt;
  });

// Smooth horizontal S-curve from a to b (branches).
export const branch = (a: Pt, b: Pt): Pt[] => {
  const mx = (a[0] + b[0]) / 2;
  return bezier(a, [mx, a[1]], [mx, b[1]], b);
};

// Smooth vertical S-curve from a down to b.
export const drop = (a: Pt, b: Pt): Pt[] => {
  const my = (a[1] + b[1]) / 2;
  return bezier(a, [a[0], my], [b[0], my], b);
};

export const ellipse = (cx: number, cy: number, rx: number, ry: number, start = -Math.PI / 2, n = 180): Pt[] =>
  Array.from({length: n + 1}, (_, i) => {
    const a = start + (2 * Math.PI * i) / n;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as Pt;
  });

// Rounded rectangle, clockwise from the middle of the top edge.
export const roundedRect = (x: number, y: number, w: number, h: number, r: number): Pt[] => {
  const pts: Pt[] = [[x + w / 2, y]];
  const corner = (cx: number, cy: number, a0: number) => {
    for (let i = 0; i <= 12; i++) {
      const a = a0 + (Math.PI / 2) * (i / 12);
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
  };
  pts.push([x + w - r, y]);
  corner(x + w - r, y + r, -Math.PI / 2);
  pts.push([x + w, y + h - r]);
  corner(x + w - r, y + h - r, 0);
  pts.push([x + r, y + h]);
  corner(x + r, y + h - r, Math.PI / 2);
  pts.push([x, y + r]);
  corner(x + r, y + r, Math.PI);
  pts.push([x + w / 2, y]);
  return pts;
};

// Smooth curve through points (Catmull-Rom), for the tour route and the ball path.
export const through = (pts: Pt[], n = 24): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};
