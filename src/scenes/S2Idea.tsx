import React from 'react';
import {useCurrentFrame} from 'remotion';
import {copy, tx} from '../copy';
import {SplitScreen} from '../components/Panels';
import {styles, TileStack} from '../components/Tile';
import {Line, SceneProps, Y_CENTRE, Y_LOWER} from './common';

// f500–750 (250) · split screen: school (recap, left) / tour (Best Of, right).
// Line 6 lights the left half, line 7 the right; line 8 full frame on black, headline size.
export const S2Idea: React.FC<SceneProps> = ({lang}) => {
  const f = useCurrentFrame();
  const active = f < 85 ? 'both' : f < 145 ? 'left' : 'right';
  return (
    <>
      {f < 200 ? <SplitScreen leftId="s2-recap-school" rightId="s2-bestof-tour" active={active} duration={200} /> : null}
      <TileStack x={480} y={250} align="center" vAlign="bottom" items={[{runs: tx(copy.s2.labelSchool, lang), style: styles.label('white', 'black'), anim: {at: 4, out: 200, exit: 'cut'}}]} />
      <TileStack x={1440} y={40} align="center" items={[{runs: tx(copy.s2.labelTour, lang), style: styles.label('white', 'black'), anim: {at: 4, out: 200, exit: 'cut'}}]} />

      <Line t={copy.s2.l5} lang={lang} at={10} out={82} y={Y_LOWER} />
      <Line t={copy.s2.l6} lang={lang} at={88} out={142} x={480} y={Y_LOWER} maxWidth={900} />
      <Line t={copy.s2.l7} lang={lang} at={148} out={198} x={1440} y={Y_LOWER} maxWidth={900} />
      <Line t={copy.s2.l8} lang={lang} at={202} out={250} exit="cut" style={styles.headline()} y={Y_CENTRE} />
    </>
  );
};
