import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {display, Fact, FactKey, facts, isReady} from '../facts';
import {formatNumber, Lang, typo} from '../format';
import {size as sz, timing} from '../tokens';
import {Anim, Run, TileStack, TileStyle} from './Tile';

// Value of a fact at a given frame: counts up over 20 frames (gentle ease-out) to the
// exact display string. Unconfirmed values keep a visible orange-outlined box; null shows [XX].
export const factRun = (key: FactKey, lang: Lang, frame: number, at: number, run: Partial<Run> = {}): Run => {
  const f: Fact = facts[key];
  const final = display(key, lang);
  if (final === null) return {...run, text: '[XX]', placeholder: true};
  let text = final;
  // Small values (under 20, percentages) land directly: counting to 3 is only flicker.
  if (f.count && f.count.to >= 20) {
    const p = interpolate(frame - at, [0, timing.countUp], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });
    // The "+" belongs to the final value only.
    text = formatNumber(f.count.to * p, lang, {...f.count, plus: f.count.plus && p >= 1});
  }
  return {...run, text, measureAs: f.count ? final : undefined, placeholder: !isReady(key)};
};

// "{KEY} teachers trained" → runs, numbers styled by numberRun.
export const richRuns = (template: string, lang: Lang, frame: number, at: number, numberRun: Partial<Run> = {}): Run[] =>
  typo(template, lang)
    .split(/(\{[A-Z_]+\})/)
    .filter(Boolean)
    .map((part) => {
      const m = part.match(/^\{([A-Z_]+)\}$/);
      return m ? factRun(m[1] as FactKey, lang, frame, at, numberRun) : {text: part};
    });

// S5 result: hero number (orange, 75 Bold, 200 px) over its label (white, 55 Roman, 48 px).
export const HeroNumber: React.FC<{
  runs: (frame: number) => Run[]; // number runs, built per frame
  label: string;
  x?: number;
  y?: number;
  anim: Anim;
}> = ({runs, label, x = 960, y = 540, anim}) => {
  const frame = useCurrentFrame();
  const number: TileStyle = {weight: 'bold', size: sz.heroNumber, tile: 'black', colour: 'orange'};
  const caption: TileStyle = {weight: 'roman', size: sz.label, tile: 'black', colour: 'white'};
  return (
    <TileStack
      items={[
        {runs: runs(frame), style: number, anim},
        {runs: label, style: caption, anim},
      ]}
      x={x}
      y={y}
      align="center"
      vAlign="center"
    />
  );
};
