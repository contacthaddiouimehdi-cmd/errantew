import React from 'react';
import {Sequence} from 'remotion';
import {Align, Anim, Super, TileStyle, VAlign, styles} from '../components/Tile';
import {VerticalPanel} from '../components/Panels';
import {T, tx} from '../copy';
import {Lang} from '../format';

export type SceneProps = {lang: Lang; version: 'internal' | 'external'; final: boolean};

// Lower-third position for supers over footage, centre for supers on black.
export const Y_LOWER = 930;
export const Y_CENTRE = 540;

// One storyboard line as a super.
export const Line: React.FC<{
  t: T;
  lang: Lang;
  at: number;
  out?: number;
  exit?: Anim['exit'];
  style?: TileStyle;
  x?: number;
  y?: number;
  align?: Align;
  vAlign?: VAlign;
  maxWidth?: number;
}> = ({t, lang, at, out, exit, style = styles.super(), ...rest}) => (
  <Super text={tx(t, lang)} style={style} anim={{at, out, exit}} {...rest} />
);

// A vertical shot that cuts in at `from` and cuts out after `dur` frames.
export const Shot: React.FC<{id: string; from: number; dur: number; x?: number; opacity?: number}> = ({id, from, dur, x, opacity}) => (
  <Sequence from={from} durationInFrames={dur} layout="none">
    <VerticalPanel id={id} duration={dur} x={x} opacity={opacity} />
  </Sequence>
);
