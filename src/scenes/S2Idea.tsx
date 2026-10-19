import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {copy, tx} from '../copy';
import {SplitScreen} from '../components/Panels';
import {styles, TileStack} from '../components/Tile';
import {ease, knot, line, Node, Thread} from '../components/Thread';
import {Line, SceneProps, Y_LOWER} from './common';
import {KNOT_END, KNOT_Y} from './S1Problem';

// f500–750 (250) · the idea. The knot unties (line 5), the thread swings upright and
// splits the screen: school (recap) left, tour (Best Of) right. On black, the two halves
// of the thread weld back together at the centre (line 8). Beats on local 10 + 15n.
export const S2Idea: React.FC<SceneProps> = ({lang}) => {
  const f = useCurrentFrame();
  const active = f < 100 ? 'both' : f < 160 ? 'left' : 'right';

  // 0–70 untie, 70–85 swing to vertical, 85–205 divider, 205–220 weld.
  let thread: React.ReactNode = null;
  if (f < 70) {
    thread = (
      <Thread
        paths={[knot(0, 1920, KNOT_Y, [
          {cx: 930, r: ease(f, 0, 50, KNOT_END.r1, 0), dir: 1},
          {cx: 990, r: ease(f, 0, 50, KNOT_END.r2, 0), dir: -1},
        ])]}
      />
    );
  } else if (f < 205) {
    const p = ease(f, 70, 15);
    const cy = interpolate(p, [0, 1], [KNOT_Y, 540]);
    const half = interpolate(p, [0, 1], [960, 540]);
    const a = (p * Math.PI) / 2;
    thread = <Thread paths={[line([960 - half * Math.cos(a), cy - half * Math.sin(a)], [960 + half * Math.cos(a), cy + half * Math.sin(a)])]} />;
  } else {
    const k = ease(f, 205, 15);
    thread = (
      <>
        <Thread paths={[line([0, 640], [960 * k, 640]), line([1920, 640], [1920 - 960 * k, 640])]} head={k < 1} />
        {f >= 220 ? <Node p={[960, 640]} /> : null}
      </>
    );
  }

  return (
    <>
      {f >= 85 && f < 205 ? <SplitScreen leftId="s2-recap-school" rightId="s2-bestof-tour" active={active} duration={120} /> : null}
      {thread}
      <TileStack x={480} y={250} align="center" vAlign="bottom" items={[{runs: tx(copy.s2.labelSchool, lang), style: styles.label('white', 'black'), anim: {at: 89, out: 205, exit: 'cut'}}]} />
      <TileStack x={1440} y={40} align="center" items={[{runs: tx(copy.s2.labelTour, lang), style: styles.label('white', 'black'), anim: {at: 89, out: 205, exit: 'cut'}}]} />

      <Line t={copy.s2.l5} lang={lang} at={4} out={70} style={styles.super()} y={430} />
      <Line t={copy.s2.l6} lang={lang} at={100} out={157} x={480} y={Y_LOWER} maxWidth={880} />
      <Line t={copy.s2.l7} lang={lang} at={160} out={202} x={1440} y={Y_LOWER} maxWidth={880} />
      <Line t={copy.s2.l8} lang={lang} at={205} out={250} exit="cut" style={styles.headline()} y={470} />
    </>
  );
};
