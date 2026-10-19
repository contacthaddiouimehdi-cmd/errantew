import React from 'react';
import {Sequence} from 'remotion';
import {copy, tx} from '../copy';
import {Packshot} from '../components/Packshot';
import {Run, styles, TileStack} from '../components/Tile';
import {typo} from '../format';
import {oBox, wrapBalanced} from '../measure';
import {size} from '../tokens';
import {SceneProps} from './common';

// f2750–3000 (250) · closing line (headline, "holidays" in orange), hashtag tile, packshot.
export const S6Closing: React.FC<SceneProps> = ({lang}) => {
  const [before, word, after] = copy.s6.l24[lang];
  const style = styles.headline();
  const full = typo(before + word + after, lang);
  const lines = wrapBalanced(full, style.weight, style.size, 1728 - 2 * oBox(style.weight, style.size).w);
  // Keep the highlighted word orange on whichever line it lands.
  const runsFor = (line: string): Run[] => {
    const i = line.indexOf(word);
    if (i < 0) return [{text: line}];
    const runs: Run[] = [{text: line.slice(0, i)}, {text: word, colour: 'orange'}, {text: line.slice(i + word.length)}];
    return runs.filter((r) => r.text);
  };
  return (
    <>
      <TileStack x={960} y={540} align="center" vAlign="center" items={lines.map((l) => ({runs: runsFor(l), style, anim: {at: 4, out: 110}}))} />
      <TileStack
        x={960}
        y={540}
        align="center"
        vAlign="center"
        items={[{runs: tx(copy.s6.hashtag, lang), style: {weight: 'bold', size: size.headline, tile: 'orange', colour: 'white'}, anim: {at: 112, out: 180}}]}
      />
      <Sequence from={180} durationInFrames={70} name="Packshot">
        <Packshot duration={70} />
      </Sequence>
    </>
  );
};
