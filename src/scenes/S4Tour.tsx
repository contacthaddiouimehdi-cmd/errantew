import React from 'react';
import {interpolate, Sequence, useCurrentFrame} from 'remotion';
import {copy, tx} from '../copy';
import {factRun} from '../components/CountUp';
import {triptychX} from '../components/Panels';
import {Passport, passportSize, slotY} from '../components/Passport';
import {ChapterTile, MissionTile, NameSuper} from '../components/Supers';
import {styles, Super, TileStack} from '../components/Tile';
import {TourRoute} from '../components/TourRoute';
import {wrapBalanced, oBox} from '../measure';
import {layout as L, size, timing} from '../tokens';
import {Line, SceneProps, Shot, Y_CENTRE, Y_LOWER} from './common';

// S4a · the switch (175): chapter, triptych crowd/stage/football, the three words one per panel, then line 14 on black.
const S4aSwitch: React.FC<SceneProps> = ({lang}) => (
  <>
    <ChapterTile text={copy.s4a.chapter[lang]} lang={lang} at={2} out={36} />
    {(['s4a-crowd', 's4a-stage', 's4a-football'] as const).map((id, i) => (
      <Shot key={id} id={id} from={36 + i * 6} dur={112 - (36 + i * 6)} x={triptychX[i]} />
    ))}
    <Line t={copy.s4a.l13} lang={lang} at={40} out={100} y={150} />
    {copy.s4a.words.map((w, i) => (
      <TileStack
        key={i}
        x={triptychX[i] + L.panel.w / 2}
        y={880}
        align="center"
        items={[{runs: tx(w, lang), style: styles.super('white', 'black'), anim: {at: 70 + i * 6, out: 112, enter: 'cut', exit: 'cut'}}]}
      />
    ))}
    <Line t={copy.s4a.l14} lang={lang} at={114} out={175} exit="cut" y={Y_CENTRE} />
  </>
);

// S4b · the tour (200): route line with 7 stops over dim (25%) tour panels. No map.
const S4bTour: React.FC<SceneProps> = ({lang}) => (
  <>
    {[0, 1, 2].map((i) => (
      <React.Fragment key={i}>
        <Shot id={`s4b-tour-${i + 1}`} from={0} dur={100} x={triptychX[i]} opacity={L.routeBackdrop} />
        <Shot id={`s4b-tour-${i + 4}`} from={100} dur={100} x={triptychX[i]} opacity={L.routeBackdrop} />
      </React.Fragment>
    ))}
    <TourRoute lang={lang} at={8} draw={140} y={440} out={200} />
    <Line t={copy.s4b.l15} lang={lang} at={156} out={200} exit="cut" style={styles.super('orange', 'white')} y={Y_LOWER - 30} />
  </>
);

// S4c · the ambassador (100): one panel off-centre left, supers on the right.
const S4cAmbassador: React.FC<SceneProps> = ({lang}) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Shot id="s4c-mehdi" from={0} dur={100} x={240} />
      <Line t={copy.s4c.l16} lang={lang} at={24} out={100} exit="cut" x={960} y={420} align="left" maxWidth={864} />
      <NameSuper name={[factRun('MEHDI_AMRI_NAME', lang, frame, 0)]} fn={tx(copy.s4c.fn, lang)} at={8} out={100} x={960} y={860} />
    </>
  );
};

// S4d · the mechanic (300), heart of the film: line 17 alone on black, then the passport
// centre-left with stamps landing on the music hits while the matching footage plays right.
const S4dMechanic: React.FC<SceneProps> = ({lang}) => {
  const frame = useCurrentFrame();
  const px = L.margin;
  const py = (1080 - passportSize.h) / 2;
  const tx0 = px + passportSize.w + 56;
  const panelX = 1920 - 40 - L.panel.w;
  const hits = {m1: 100, m2: 160, unlock: 220};
  const opacity = interpolate(frame, [55, 55 + timing.tileIn], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      <Line t={copy.s4d.l17} lang={lang} at={2} out={55} exit="cut" style={styles.headline()} y={Y_CENTRE} />
      {frame >= 55 ? <Passport lang={lang} x={px} y={py} stamps={hits} opacity={opacity} /> : null}
      <TileStack x={tx0} y={py} items={[{runs: tx(copy.s4d.passport, lang), style: styles.label('black', 'white', 'bold'), anim: {at: 58, out: 300, exit: 'cut'}}]} />
      <Shot id="s4d-dome" from={55} dur={45} x={panelX} />
      <Shot id="s4d-cyberboard" from={100} dur={60} x={panelX} />
      <Shot id="s4d-seriousgame" from={160} dur={60} x={panelX} />
      <Shot id="s4d-gaming" from={220} dur={80} x={panelX} />
      <MissionTile title={copy.s4d.m1.title[lang]} desc={copy.s4d.m1.desc[lang]} lang={lang} at={hits.m1} out={hits.m2} x={tx0} y={py + slotY[0]} />
      <MissionTile title={copy.s4d.m2.title[lang]} desc={copy.s4d.m2.desc[lang]} lang={lang} at={hits.m2} out={hits.unlock} x={tx0} y={py + slotY[1]} />
      <MissionTile title={copy.s4d.unlock.title[lang]} lang={lang} at={hits.unlock} out={255} x={tx0} y={py + slotY[2]} />
      <Line t={copy.s4d.l21} lang={lang} at={256} out={300} exit="cut" style={styles.super('orange', 'white')} x={tx0} y={Y_CENTRE} align="left" maxWidth={600} />
    </>
  );
};

// S4e · around the Dome (125): workshops triptych with #EngageForChange, then live content.
const S4eAround: React.FC<SceneProps> = ({lang}) => {
  const style = styles.super();
  const lines = wrapBalanced(tx(copy.s4e.l22, lang), style.weight, style.size, 1728 - 2 * oBox(style.weight, style.size).w);
  return (
    <>
      {[0, 1, 2].map((i) => (
        <Shot key={i} id={`s4e-workshop-${i + 1}`} from={0} dur={72} x={triptychX[i]} />
      ))}
      <TileStack
        x={960}
        y={1000}
        align="center"
        vAlign="bottom"
        items={[
          ...lines.map((l) => ({runs: l, style, anim: {at: 2, out: 70}})),
          {runs: tx(copy.s4e.hashtag, lang), style: {weight: 'bold' as const, size: size.super, tile: 'orange' as const, colour: 'white' as const}, anim: {at: 30, out: 70, enter: 'settle' as const}},
        ]}
      />
      {[0, 1, 2].map((i) => (
        <Shot key={i} id={`s4e-live-${i + 1}`} from={72 + i * 4} dur={53 - i * 4} x={triptychX[i]} />
      ))}
      <Super text={tx(copy.s4e.l23, lang)} style={style} y={Y_LOWER} anim={{at: 76, out: 125, exit: 'cut'}} />
    </>
  );
};

// f1300–2200 · Season 2, on tour (hero act).
export const S4Tour: React.FC<SceneProps> = (p) => (
  <>
    <Sequence from={0} durationInFrames={175} name="S4a · switch"><S4aSwitch {...p} /></Sequence>
    <Sequence from={175} durationInFrames={200} name="S4b · tour"><S4bTour {...p} /></Sequence>
    <Sequence from={375} durationInFrames={100} name="S4c · ambassador"><S4cAmbassador {...p} /></Sequence>
    <Sequence from={475} durationInFrames={300} name="S4d · mechanic"><S4dMechanic {...p} /></Sequence>
    <Sequence from={775} durationInFrames={125} name="S4e · around the Dome"><S4eAround {...p} /></Sequence>
  </>
);
