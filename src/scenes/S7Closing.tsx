import React from 'react';
import {Sequence, useCurrentFrame} from 'remotion';
import {copy, tx} from '../copy';
import {Packshot} from '../components/Packshot';
import {layoutTile, Run, styles, TileStack} from '../components/Tile';
import {draw, line, Thread} from '../components/Thread';
import {typo} from '../format';
import {oBox, textWidth, wrapBalanced} from '../measure';
import {size} from '../tokens';
import {SceneProps} from './common';

// f2750–3000 (250) · closing line, the thread underlines "holidays" / "vacances",
// hashtag tile, then the packshot. The thread is gone before the logo appears.
export const S7Closing: React.FC<SceneProps> = ({lang}) => {
  const f = useCurrentFrame();
  const [before, word, after] = copy.s7.l24[lang];
  const style = styles.headline();
  const lines = wrapBalanced(typo(before + word + after, lang), style.weight, style.size, 1728 - 2 * oBox(style.weight, style.size).w);
  const runsFor = (l: string): Run[] => {
    const i = l.indexOf(word);
    if (i < 0) return [{text: l}];
    const runs: Run[] = [{text: l.slice(0, i)}, {text: word, colour: 'orange'}, {text: l.slice(i + word.length)}];
    return runs.filter((r) => r.text);
  };
  // Where the highlighted word sits, to underline it.
  const layouts = lines.map((l) => layoutTile(runsFor(l), style));
  const total = layouts.reduce((s, l) => s + l.h, 0);
  let top = 540 - total / 2;
  let underline: [number, number, number] | null = null;
  layouts.forEach((l, i) => {
    const k = lines[i].indexOf(word);
    if (k >= 0) {
      const x = 960 - l.w / 2 + l.padX + textWidth(lines[i].slice(0, k), style.weight, style.size);
      underline = [x, x + textWidth(word, style.weight, style.size), top + l.baseline + size.headline * 0.2];
    }
    top += l.h;
  });
  const u = underline as [number, number, number] | null;
  return (
    <>
      <TileStack x={960} y={540} align="center" vAlign="center" items={lines.map((l) => ({runs: runsFor(l), style, anim: {at: 4, out: 110}}))} />
      {u && f >= 28 && f < 110 ? <Thread paths={[line([u[0], u[2]], [u[1], u[2]])]} to={draw(f, 28, 14)} /> : null}
      <TileStack
        x={960}
        y={540}
        align="center"
        vAlign="center"
        items={[{runs: tx(copy.s7.hashtag, lang), style: {weight: 'bold', size: size.headline, tile: 'orange', colour: 'white'}, anim: {at: 112, out: 180}}]}
      />
      <Sequence from={180} durationInFrames={70} name="Packshot">
        <Packshot duration={70} />
      </Sequence>
    </>
  );
};
