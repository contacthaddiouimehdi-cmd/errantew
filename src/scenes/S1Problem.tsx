import React from 'react';
import {copy, tx} from '../copy';
import {display} from '../facts';
import {styles, TileStack} from '../components/Tile';
import {Line, SceneProps, Shot, Y_CENTRE, Y_LOWER} from './common';

// f125–500 (375) · centred vertical panel, Best Of shots cut every bar.
// Lines 2 and 4 play on pure black for weight; first beat hit on line 4 (local 280).
export const S1Problem: React.FC<SceneProps> = ({lang}) => {
  const stat = display('STAT_PROBLEM', lang); // optional slot: skipped while null
  return (
    <>
      <Shot id="s1-phones-1" from={0} dur={50} />
      <Shot id="s1-phones-2" from={50} dur={50} />
      <Line t={copy.s1.l1} lang={lang} at={8} out={98} y={Y_LOWER} />

      <Line t={copy.s1.l2} lang={lang} at={104} out={175} exit="cut" style={styles.headline()} y={stat ? 470 : Y_CENTRE} />
      {stat ? (
        <TileStack x={960} y={560} align="center" items={[{runs: tx(copy.s1.stat, lang).replace('{STAT_PROBLEM}', stat), style: styles.label(), anim: {at: 130, out: 175, exit: 'cut'}}]} />
      ) : null}

      <Shot id="s1-crowd-1" from={175} dur={50} />
      <Shot id="s1-phones-3" from={225} dur={50} />
      <Line t={copy.s1.l3} lang={lang} at={180} out={272} y={Y_LOWER} />

      <Line t={copy.s1.l4} lang={lang} at={280} out={375} exit="cut" style={styles.headline()} y={Y_CENTRE} />
    </>
  );
};
