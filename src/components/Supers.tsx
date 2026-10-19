import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Lang, typo} from '../format';
import {oBox, wrapBalanced} from '../measure';
import {HEIGHT, layout as L, size, timing, WIDTH} from '../tokens';
import {Anim, Run, TileStack, TileStyle} from './Tile';

// "Season 1 · At school" → orange tile (75 Bold) with a white tile (55 Roman) cut in under it.
export const ChapterTile: React.FC<{text: string; lang: Lang; at: number; out?: number; x?: number; y?: number}> = ({
  text,
  lang,
  at,
  out,
  x = L.margin,
  y = HEIGHT / 2,
}) => {
  const [head, tail] = typo(text, lang).split(' · ');
  return (
    <TileStack
      arrange="stagger"
      x={x}
      y={y}
      vAlign="center"
      items={[
        {runs: head, style: {weight: 'bold', size: size.headline, tile: 'orange', colour: 'white'}, anim: {at, out}},
        {runs: tail, style: {weight: 'roman', size: size.super, tile: 'white', colour: 'black'}, anim: {at: at + timing.tileIn, out, enter: 'settle'}},
      ]}
    />
  );
};

// Name (75 Bold, 44 px) and function (55 Roman, 32 px), each in its own tile, stacked,
// left-aligned, lower-left of frame.
export const NameSuper: React.FC<{name: Run[] | string; fn: string; at: number; out?: number; x?: number; y?: number}> = ({
  name,
  fn,
  at,
  out,
  x = L.margin,
  y = HEIGHT - 120,
}) => (
  <TileStack
    x={x}
    y={y}
    vAlign="bottom"
    items={[
      {runs: name, style: {weight: 'bold', size: size.name, tile: 'white', colour: 'black'}, anim: {at, out}},
      {runs: fn, style: {weight: 'roman', size: size.fn, tile: 'black', colour: 'white'}, anim: {at: at + timing.tileIn, out, enter: 'settle'}},
    ]}
  />
);

// Place name (75 Bold) over its date (55 Roman). Anchored by its centre-x on the given point.
export const placeStyles = {
  name: {weight: 'bold', size: 56, tile: 'white', colour: 'black'} as TileStyle,
  date: {weight: 'roman', size: 40, tile: 'black', colour: 'white'} as TileStyle,
};

export const PlaceSuper: React.FC<{place: string; date: string; x: number; y: number; vAlign?: 'top' | 'bottom'; anim: Anim}> = ({
  place,
  date,
  x,
  y,
  vAlign = 'top',
  anim,
}) => (
  <TileStack
    x={x}
    y={y}
    align="center"
    vAlign={vAlign}
    items={[
      {runs: place, style: placeStyles.name, anim},
      {runs: date, style: placeStyles.date, anim: {...anim, at: anim.at + timing.tileIn, enter: 'settle'}},
    ]}
  />
);

// Subtitles: 55 Roman, 42 px, white on black tiles, bottom-centre, max two lines.
export const Subtitle: React.FC<{text: string; lang: Lang; at: number; out: number}> = ({text, lang, at, out}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= out) return null;
  const style: TileStyle = {weight: 'roman', size: size.subtitle, tile: 'black', colour: 'white'};
  const lines = wrapBalanced(typo(text, lang), 'roman', size.subtitle, 1400 - 2 * oBox('roman', size.subtitle).w);
  if (lines.length > 2) console.warn(`Subtitle over two lines: "${text}"`);
  return (
    <TileStack
      items={lines.slice(0, 2).map((l) => ({runs: l, style, anim: {at, out, enter: 'cut', exit: 'cut'}}))}
      x={WIDTH / 2}
      y={HEIGHT - 72}
      align="center"
      vAlign="bottom"
    />
  );
};

// Mission stamp title: "Mission 2 · Serious Game" → orange tile + white tile (75 Bold),
// description in 55 Roman, wrapped and flush under the title.
export const MissionTile: React.FC<{
  title: string;
  desc?: string;
  lang: Lang;
  at: number;
  out?: number;
  x: number;
  y: number;
  maxWidth?: number;
  vAlign?: 'top' | 'center' | 'bottom';
}> = ({title, desc, lang, at, out, x, y, maxWidth = 620, vAlign = 'center'}) => {
  const [head, tail] = typo(title, lang).split(' · ');
  const descStyle: TileStyle = {weight: 'roman', size: size.labelSmall, tile: 'black', colour: 'white'};
  const lines = desc ? wrapBalanced(typo(desc, lang), 'roman', size.labelSmall, maxWidth - 2 * oBox('roman', size.labelSmall).w) : [];
  return (
    <TileStack
      arrange="stagger"
      x={x}
      y={y}
      vAlign={vAlign}
      items={[
        {runs: head, style: {weight: 'bold', size: size.super, tile: 'orange', colour: 'white'}, anim: {at, out, enter: 'cut', exit: out === undefined ? undefined : 'cut'}},
        {runs: tail, style: {weight: 'bold', size: size.super, tile: 'white', colour: 'black'}, anim: {at, out, enter: 'settle', exit: 'cut'}},
        ...lines.map((l, i) => ({
          runs: l,
          style: descStyle,
          flush: i > 0,
          anim: {at: at + timing.tileIn, out, exit: 'cut'} as Anim,
        })),
      ]}
    />
  );
};
