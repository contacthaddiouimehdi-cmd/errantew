import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {fontFamily, fontWeight} from '../fonts';
import {capHeight, oBox, textWidth, wrapBalanced} from '../measure';
import {core, layout as L, size, TextColour, TileColour, timing, Weight, WIDTH} from '../tokens';

// A tile is the only way text appears on screen. Clear space follows the "o":
// horizontal padding = width of "o", vertical padding = 2/3 of its height, measured
// from the cap height and the baseline (descenders may dip into the bottom padding).

export type Run = {
  text: string;
  weight?: Weight;
  colour?: TextColour;
  measureAs?: string; // reserve the width of the final value while counting up
  placeholder?: boolean; // [XX] draft marker
};

export type TileStyle = {weight: Weight; size: number; tile: TileColour; colour: TextColour};

export type TileLayout = {
  w: number;
  h: number;
  padX: number;
  padY: number;
  baseline: number;
  items: {run: Run; x: number; w: number}[];
  style: TileStyle;
};

const PH_PAD = 0.12; // placeholder box padding, in em

const runWidth = (r: Run, s: TileStyle): number => {
  const w = textWidth(r.measureAs ?? r.text, r.weight ?? s.weight, s.size);
  return r.placeholder ? w + 2 * PH_PAD * s.size : w;
};

export const layoutTile = (runs: Run[], style: TileStyle): TileLayout => {
  const o = oBox(style.weight, style.size);
  const padX = o.w;
  const padY = (o.h * 2) / 3;
  const cap = capHeight(style.weight, style.size);
  let x = padX;
  const items = runs.map((run) => {
    const w = runWidth(run, style);
    const item = {run, x, w};
    x += w;
    return item;
  });
  return {w: x + padX, h: cap + 2 * padY, padX, padY, baseline: padY + cap, items, style};
};

export type Enter = 'fade' | 'cut' | 'settle';
export type Exit = 'fade' | 'cut';

export type Anim = {at: number; out?: number; enter?: Enter; exit?: Exit};

// Guideline motion: tile fades in over 8 frames, its text over 4 frames from the 5th;
// stacked tiles cut in and settle within 4 frames; out is a cut or an 8-frame fade.
export const tileAnim = (frame: number, a: Anim) => {
  const local = frame - a.at;
  const hidden = {visible: false, tile: 0, text: 0, dy: 0};
  if (local < 0) return hidden;
  let tile = 1;
  let text = 1;
  let dy = 0;
  const enter = a.enter ?? 'fade';
  if (enter === 'fade') {
    tile = interpolate(local, [0, timing.tileIn], [0, 1], {extrapolateRight: 'clamp'});
    text = interpolate(local, [timing.textDelay, timing.textDelay + timing.textIn], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  } else if (enter === 'settle') {
    dy = interpolate(local, [0, timing.stackSettle], [12, 0], {
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    });
  }
  if (a.out !== undefined) {
    if ((a.exit ?? 'fade') === 'cut') {
      if (frame >= a.out) return hidden;
    } else {
      const k = interpolate(frame, [a.out - timing.out, a.out], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      if (k <= 0) return hidden;
      tile *= k;
      text *= k;
    }
  }
  return {visible: true, tile, text, dy};
};

const fill: Record<TileColour | TextColour, string> = {
  orange: core.orange,
  black: core.black,
  white: core.white,
  grey: core.grey,
};

export const TileView: React.FC<{
  l: TileLayout;
  x: number;
  y: number;
  tileOpacity: number;
  textOpacity: number;
}> = ({l, x, y, tileOpacity, textOpacity}) => {
  const {style} = l;
  return (
    <svg
      width={l.w}
      height={l.h}
      style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}
      viewBox={`0 0 ${l.w} ${l.h}`}
    >
      <rect width={l.w} height={l.h} fill={fill[style.tile]} opacity={tileOpacity} />
      <g opacity={textOpacity}>
        {l.items.map(({run, x: rx, w}, i) => {
          const weight = run.weight ?? style.weight;
          const common = {
            fontFamily: fontFamily(weight),
            fontWeight: fontWeight(weight),
            fontSize: style.size,
            style: {whiteSpace: 'pre' as const, fontKerning: 'normal' as const},
          };
          if (run.placeholder) {
            const pad = PH_PAD * style.size;
            const cap = l.baseline - l.padY;
            return (
              <g key={i}>
                <rect x={rx} y={l.padY - pad} width={w} height={cap + 2 * pad} fill={core.black} stroke={core.orange} strokeWidth={3} />
                <text {...common} x={rx + pad} y={l.baseline} fill={core.orange}>
                  {run.text}
                </text>
              </g>
            );
          }
          // Count-ups reserve the final value's width; centre the live value inside it.
          const live = run.measureAs ? textWidth(run.text, weight, style.size) : w;
          return (
            <text key={i} {...common} x={rx + (w - live) / 2} y={l.baseline} fill={fill[run.colour ?? style.colour]}>
              {run.text}
            </text>
          );
        })}
      </g>
    </svg>
  );
};

export type Align = 'left' | 'center' | 'right';
export type VAlign = 'top' | 'center' | 'bottom';

export type StackItem = {runs: Run[] | string; style: TileStyle; anim?: Anim; flush?: boolean}; // flush: no stagger offset for this tile

export const toRuns = (r: Run[] | string): Run[] => (typeof r === 'string' ? [{text: r}] : r);

// Tiles stacked directly under each other. "stagger" offsets each following tile to the
// right by its own clear space (guideline stack); "flush" aligns them (wrapped lines, name supers).
export const TileStack: React.FC<{
  items: StackItem[];
  x: number;
  y: number;
  align?: Align;
  vAlign?: VAlign;
  arrange?: 'stagger' | 'flush';
  anim?: Anim; // default for items without their own
}> = ({items, x, y, align = 'left', vAlign = 'top', arrange = 'flush', anim = {at: 0}}) => {
  const frame = useCurrentFrame();
  const layouts = items.map((it) => layoutTile(toRuns(it.runs), it.style));
  const total = layouts.reduce((s, l) => s + l.h, 0);
  let top = vAlign === 'top' ? y : vAlign === 'center' ? y - total / 2 : y - total;
  let offset = 0;
  return (
    <>
      {layouts.map((l, i) => {
        if (i > 0 && arrange === 'stagger' && !items[i].flush) offset += l.padX;
        const left = align === 'left' ? x + offset : align === 'center' ? x - l.w / 2 + offset : x - l.w - offset;
        const a = tileAnim(frame, items[i].anim ?? anim);
        const ty = top;
        top += l.h;
        if (!a.visible) return null;
        return <TileView key={i} l={l} x={left} y={ty + a.dy} tileOpacity={a.tile} textOpacity={a.text} />;
      })}
    </>
  );
};

// A super: one sentence, wrapped to the available width, one tile per line, all on one animation.
export const Super: React.FC<{
  text: string;
  style: TileStyle;
  x?: number;
  y?: number;
  align?: Align;
  vAlign?: VAlign;
  maxWidth?: number;
  anim: Anim;
}> = ({text, style, x = WIDTH / 2, y = 540, align = 'center', vAlign = 'center', maxWidth = WIDTH - 2 * L.margin, anim}) => {
  const o = oBox(style.weight, style.size);
  const lines = wrapBalanced(text, style.weight, style.size, maxWidth - 2 * o.w);
  return (
    <TileStack
      items={lines.map((line) => ({runs: line, style}))}
      x={x}
      y={y}
      align={align}
      vAlign={vAlign}
      anim={anim}
    />
  );
};

export const styles = {
  headline: (tile: TileColour = 'black', colour: TextColour = 'white'): TileStyle => ({weight: 'bold', size: size.headline, tile, colour}),
  super: (tile: TileColour = 'black', colour: TextColour = 'white', weight: Weight = 'bold'): TileStyle => ({weight, size: size.super, tile, colour}),
  label: (tile: TileColour = 'black', colour: TextColour = 'white', weight: Weight = 'roman'): TileStyle => ({weight, size: size.label, tile, colour}),
};
