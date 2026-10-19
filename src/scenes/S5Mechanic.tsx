import React from 'react';
import {useCurrentFrame} from 'remotion';
import {copy, tx} from '../copy';
import {triptychX} from '../components/Panels';
import {Passport, passportSize, slotY} from '../components/Passport';
import {MissionTile} from '../components/Supers';
import {styles, TileStack} from '../components/Tile';
import {draw, line, Thread} from '../components/Thread';
import {oBox, wrapBalanced} from '../measure';
import {layout as L, size} from '../tokens';
import {Line, SceneProps, Shot, Y_CENTRE, Y_LOWER} from './common';

// f1775–2200 (425) · the mechanic: to play, you had to learn first. Beats on local 10 + 15n.
// The thread draws the passport, stamps land on the beat, the thread turns like a key.
export const S5Mechanic: React.FC<SceneProps> = ({lang}) => {
  const f = useCurrentFrame();
  const px = L.margin;
  const py = (1080 - passportSize.h) / 2;
  const tx0 = px + passportSize.w + 56;
  const panelX = 1920 - 40 - L.panel.w;
  const hits = {m1: 100, m2: 145, unlock: 190};
  const style = styles.super();
  const lines22 = wrapBalanced(tx(copy.s5.l22, lang), style.weight, style.size, 1728 - 2 * oBox(style.weight, style.size).w);
  return (
    <>
      {/* Line 17 on black, the thread alone. */}
      {f < 55 ? <Thread paths={[line([0, 660], [1920, 660])]} to={draw(f, 0, 50)} /> : null}
      <Line t={copy.s5.l17} lang={lang} at={4} out={55} exit="cut" style={styles.headline()} y={450} />

      {/* The passport, drawn by the thread; Dome footage on the right. */}
      {f >= 55 && f < 280 ? <Passport lang={lang} x={px} y={py} stamps={hits} outlineAt={55} keyAt={172} /> : null}
      <TileStack x={tx0} y={py} items={[{runs: tx(copy.s5.passport, lang), style: styles.label('black', 'white', 'bold'), anim: {at: 70, out: 280, exit: 'cut'}}]} />
      <Shot id="s5-dome" from={55} dur={45} x={panelX} />
      <Shot id="s5-cyberboard" from={100} dur={45} x={panelX} />
      <Shot id="s5-seriousgame" from={145} dur={45} x={panelX} />
      <Shot id="s5-gaming" from={190} dur={45} x={panelX} />
      <Shot id="s5-certificates" from={235} dur={45} x={panelX} />
      <MissionTile title={copy.s5.m1.title[lang]} desc={copy.s5.m1.desc[lang]} lang={lang} at={hits.m1} out={hits.m2} x={tx0} y={py + slotY[0]} />
      <MissionTile title={copy.s5.m2.title[lang]} desc={copy.s5.m2.desc[lang]} lang={lang} at={hits.m2} out={hits.unlock} x={tx0} y={py + slotY[1]} />
      <MissionTile title={copy.s5.unlock.title[lang]} lang={lang} at={hits.unlock} out={235} x={tx0} y={py + slotY[2]} />
      <Line t={copy.s5.l21} lang={lang} at={235} out={280} exit="cut" style={styles.super('orange', 'white')} x={tx0} y={Y_CENTRE} align="left" maxWidth={600} />

      {/* Around the Dome: volunteers with families, then live content. */}
      {[0, 1, 2].map((i) => (
        <Shot key={i} id={`s5-workshop-${i + 1}`} from={280} dur={75} x={triptychX[i]} />
      ))}
      <TileStack
        x={960}
        y={1000}
        align="center"
        vAlign="bottom"
        items={[
          ...lines22.map((l) => ({runs: l, style, anim: {at: 282, out: 352}})),
          {runs: tx(copy.s5.hashtag, lang), style: {weight: 'bold' as const, size: size.super, tile: 'orange' as const, colour: 'white' as const}, anim: {at: 310, out: 352, enter: 'settle' as const}},
        ]}
      />
      {[0, 1, 2].map((i) => (
        <Shot key={i} id={`s5-live-${i + 1}`} from={355 + i * 6} dur={70 - i * 6} x={triptychX[i]} />
      ))}
      <Line t={copy.s5.l23} lang={lang} at={359} out={425} exit="cut" y={Y_LOWER} />
    </>
  );
};
