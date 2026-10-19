import React from 'react';
import {useCurrentFrame} from 'remotion';
import {copy, tx} from '../copy';
import {display} from '../facts';
import {styles, TileStack} from '../components/Tile';
import {draw, ease, knot, Thread} from '../components/Thread';
import {Line, SceneProps, Shot, Y_LOWER} from './common';

// f125–500 (375) · the problem. Tension comes from the thread and the sound, never from
// the kids: on black, the orange thread ties a knot (line 2), then the knot grows (line 4,
// first beat). Beats fall on local 10 + 15n.
export const KNOT_Y = 740;
export const KNOT_END = {r1: 130, r2: 110}; // state handed to S2, which unties it

export const S1Problem: React.FC<SceneProps> = ({lang}) => {
  const frame = useCurrentFrame();
  const stat = display('STAT_PROBLEM', lang); // optional slot: skipped while null
  const knot2 = knot(0, 1920, KNOT_Y, [{cx: 960, r: 70, dir: 1}]);
  const knot4 = knot(0, 1920, KNOT_Y, [
    {cx: 930, r: ease(frame, 280, 95, 70, KNOT_END.r1), dir: 1},
    {cx: 990, r: ease(frame, 288, 87, 0, KNOT_END.r2), dir: -1},
  ]);
  return (
    <>
      <Shot id="s1-phone-1" from={0} dur={55} />
      <Shot id="s1-phone-2" from={55} dur={45} />
      <Line t={copy.s1.l1} lang={lang} at={4} out={100} y={Y_LOWER} />

      {frame >= 100 && frame < 175 ? <Thread paths={[knot2]} to={draw(frame, 100, 26)} /> : null}
      <Line t={copy.s1.l2} lang={lang} at={104} out={175} exit="cut" style={styles.headline()} y={380} />
      {stat ? (
        <TileStack x={960} y={500} align="center" items={[{runs: tx(copy.s1.stat, lang).replace('{STAT_PROBLEM}', stat), style: styles.label(), anim: {at: 130, out: 175, exit: 'cut'}}]} />
      ) : null}

      <Shot id="s1-crowd-1" from={175} dur={60} />
      <Shot id="s1-crowd-2" from={235} dur={45} />
      <Line t={copy.s1.l3} lang={lang} at={180} out={277} y={Y_LOWER} />

      {frame >= 280 ? <Thread paths={[knot4]} to={draw(frame, 280, 10)} /> : null}
      <Line t={copy.s1.l4} lang={lang} at={280} out={375} exit="cut" style={styles.headline()} y={380} />
    </>
  );
};
