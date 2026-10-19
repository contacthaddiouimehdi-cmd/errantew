import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {copy, tx} from '../copy';
import {Lang} from '../format';
import {useFontsReady} from '../fonts';
import {oBox} from '../measure';
import {core, size, timing} from '../tokens';
import {factRun, HeroNumber, richRuns} from '../components/CountUp';
import {FullFrame, SplitScreen, Triptych, VerticalPanel} from '../components/Panels';
import {Passport, passportSize, slotY} from '../components/Passport';
import {Packshot} from '../components/Packshot';
import {FootageStandIn, PlaceholderBox} from '../components/Placeholder';
import {ChapterTile, MissionTile, NameSuper, PlaceSuper, Subtitle} from '../components/Supers';
import {layoutTile, styles, Super, TileStack, TileView} from '../components/Tile';
import {TourRoute} from '../components/TourRoute';

// One composition per component, rendered as stills for checkpoint 2.
export type GalleryProps = {bg: 'black' | 'footage'; lang: Lang};

const Caption: React.FC<{text: string}> = ({text}) => (
  <TileStack items={[{runs: text, style: {weight: 'roman', size: 22, tile: 'grey', colour: 'black'}}]} x={24} y={1080 - 24} vAlign="bottom" />
);

const TileSpec: React.FC<{lang: Lang}> = () => {
  const px = 160;
  const l = layoutTile([{text: 'Orange'}], {weight: 'bold', size: px, tile: 'orange', colour: 'white'});
  const x = (1920 - l.w) / 2;
  const y = (1080 - l.h) / 2 - 60;
  const o = oBox('bold', px);
  const guide = {stroke: core.white, strokeWidth: 2, strokeDasharray: '6 6'};
  const note = {weight: 'roman' as const, size: 28, tile: 'black' as const, colour: 'white' as const};
  return (
    <>
      <TileView l={l} x={x} y={y} tileOpacity={1} textOpacity={1} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <line x1={x + l.padX} y1={y - 30} x2={x + l.padX} y2={y + l.h + 30} {...guide} />
        <line x1={x + l.w - l.padX} y1={y - 30} x2={x + l.w - l.padX} y2={y + l.h + 30} {...guide} />
        <line x1={x - 30} y1={y + l.padY} x2={x + l.w + 30} y2={y + l.padY} {...guide} />
        <line x1={x - 30} y1={y + l.baseline} x2={x + l.w + 30} y2={y + l.baseline} {...guide} />
      </svg>
      <TileStack
        x={960}
        y={y + l.h + 60}
        align="center"
        items={[
          {runs: `Horizontal clear space = width of "o" = ${o.w.toFixed(1)} px at ${px} px`, style: note},
          {runs: `Vertical clear space = 2/3 × height of "o" = ${l.padY.toFixed(1)} px, from cap height and baseline`, style: note},
          {runs: 'In: tile 8 frames, text 4 frames from frame 5 · Stack: cut in, 4-frame settle · Out: cut or 8-frame fade', style: note},
        ]}
      />
    </>
  );
};

const Lines: React.FC<{lang: Lang}> = ({lang}) => (
  <>
    <Super text={tx(copy.s1.l1, lang)} style={styles.super()} y={300} anim={{at: 0}} />
    <Super text={tx(copy.s3.l9, lang)} style={styles.super('white', 'black')} y={540} anim={{at: 0}} />
    <Super text={tx(copy.s4a.l14, lang)} style={styles.super('orange', 'white')} y={800} anim={{at: 0}} />
  </>
);

const Opening: React.FC<{lang: Lang}> = ({lang}) => (
  <TileStack
    arrange="stagger"
    x={352}
    y={540}
    vAlign="center"
    items={[
      {runs: tx(copy.s0.title, lang), style: {weight: 'bold', size: size.headline, tile: 'orange', colour: 'white'}, anim: {at: 0}},
      {runs: tx(copy.s0.entity, lang), style: {weight: 'roman', size: size.super, tile: 'white', colour: 'black'}, anim: {at: timing.tileIn + 4, enter: 'settle'}},
      {runs: tx(copy.s0.category, lang), style: {weight: 'roman', size: size.super, tile: 'white', colour: 'orange'}, anim: {at: timing.tileIn + 10, enter: 'settle'}},
    ]}
  />
);

const Numbers: React.FC<{lang: Lang}> = ({lang}) => {
  const frame = useCurrentFrame();
  return (
    <>
      <HeroNumber runs={(f) => [factRun('PEOPLE_ON_SITE', lang, f, 0)]} label={tx(copy.s5.r1, lang)} y={330} anim={{at: 0}} />
      <TileStack
        x={960}
        y={760}
        align="center"
        items={[
          {runs: richRuns(copy.s3.l12a[lang], lang, frame, 0, {colour: 'orange', weight: 'bold'}), style: styles.super('black', 'white', 'roman')},
          {runs: richRuns(copy.s5.lockupKids[lang], lang, frame, 0, {colour: 'orange', weight: 'bold'}), style: styles.super('black', 'white', 'roman')},
        ]}
      />
    </>
  );
};

const PassportDemo: React.FC<{lang: Lang}> = ({lang}) => {
  const px = 96;
  const py = (1080 - passportSize.h) / 2;
  return (
    <>
      <Passport lang={lang} x={px} y={py} stamps={{m1: 0, m2: 0, unlock: 0}} />
      <MissionTile title={copy.s4d.m2.title[lang]} desc={copy.s4d.m2.desc[lang]} lang={lang} at={0} x={px + passportSize.w + 56} y={py + slotY[1]} />
      <VerticalPanel id="s4d-dome-1" x={1920 - 40 - 600} pushIn={false} />
    </>
  );
};

export const galleryItems: Record<string, {frame: number; render: (lang: Lang) => React.ReactNode; footageBg?: boolean}> = {
  'Tile-spec': {frame: 30, render: (lang) => <TileSpec lang={lang} />},
  Tile: {frame: 30, render: (lang) => <Lines lang={lang} />},
  TileStack: {frame: 40, render: (lang) => <Opening lang={lang} />},
  ChapterTile: {frame: 40, render: (lang) => <ChapterTile text={copy.s3.chapter[lang]} lang={lang} at={0} />},
  NameSuper: {
    frame: 40,
    render: (lang) => <NameSuper name={[factRun('MEHDI_AMRI_NAME', lang, 0, 0)]} fn={tx(copy.s4c.fn, lang)} at={0} />,
  },
  PlaceSuper: {frame: 40, render: (lang) => <PlaceSuper place="Agadir" date="11.07" x={960} y={540} vAlign="top" anim={{at: 0}} />},
  CountUp: {frame: 40, render: (lang) => <Numbers lang={lang} />},
  Subtitle: {
    frame: 10,
    render: (lang) => <Subtitle text="[Subtitle sample: 55 Roman, 42 px, white on black tile, bottom-centre, two lines maximum]" lang={lang} at={0} out={100} />,
  },
  Placeholder: {
    frame: 10,
    render: (lang) => (
      <>
        <TileStack x={960} y={360} align="center" items={[{runs: richRuns(copy.s3.l12b[lang], lang, 0, 0, {colour: 'orange', weight: 'bold'}), style: styles.super()}]} />
        <PlaceholderBox x={660} y={520} w={600} h={300} title="Shot · s3-classroom" detail="footage pending" />
      </>
    ),
  },
  VerticalPanel: {frame: 10, footageBg: false, render: () => <VerticalPanel id="s1-phones-1" pushIn={false} />},
  Triptych: {frame: 10, footageBg: false, render: () => <Triptych ids={['s4a-crowd', 's4a-stage', 's4a-football']} />},
  SplitScreen: {
    frame: 30,
    footageBg: false,
    render: (lang) => (
      <>
        <SplitScreen leftId="s2-recap-school" rightId="s2-bestof-tour" active="left" />
        <TileStack x={480} y={160} align="center" items={[{runs: tx(copy.s2.labelSchool, lang), style: styles.label('white', 'black')}]} />
        <TileStack x={1440} y={40} align="center" items={[{runs: tx(copy.s2.labelTour, lang), style: styles.label('white', 'black')}]} />
        <Super text={tx(copy.s2.l6, lang)} style={styles.super()} y={900} anim={{at: 0}} />
      </>
    ),
  },
  TourRoute: {
    frame: 200,
    footageBg: false,
    render: (lang) => (
      <>
        {[0, 1, 2].map((i) => (
          <VerticalPanel key={i} id={`s4b-tour-${i + 1}`} x={40 + i * 620} pushIn={false} opacity={0.25} />
        ))}
        <TourRoute lang={lang} at={0} draw={140} />
      </>
    ),
  },
  Passport: {frame: 20, footageBg: false, render: (lang) => <PassportDemo lang={lang} />},
  Packshot: {frame: 30, footageBg: false, render: () => <Packshot duration={70} />},
  FullFrame: {frame: 10, footageBg: false, render: () => <FullFrame id="s3-recap-1" />},
};

// Motion check: S0 internal opening as specified (A fades in, B and C cut in under it,
// 8-frame fade out ending on f125), then a name super in/out, then the three stamps landing.
export const MotionTest: React.FC<{lang: Lang}> = ({lang}) => {
  const ready = useFontsReady();
  const frame = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{background: core.black}} />;
  const name = (f: number) => [factRun('MEHDI_AMRI_NAME', lang, f, 0)];
  return (
    <AbsoluteFill style={{background: core.black}}>
      <TileStack
        arrange="stagger"
        x={352}
        y={540}
        vAlign="center"
        items={[
          {runs: tx(copy.s0.title, lang), style: {weight: 'bold', size: size.headline, tile: 'orange', colour: 'white'}, anim: {at: 10, out: 125}},
          {runs: tx(copy.s0.entity, lang), style: {weight: 'roman', size: size.super, tile: 'white', colour: 'black'}, anim: {at: 30, out: 125, enter: 'settle'}},
          {runs: tx(copy.s0.category, lang), style: {weight: 'roman', size: size.super, tile: 'white', colour: 'orange'}, anim: {at: 36, out: 125, enter: 'settle'}},
        ]}
      />
      <NameSuper name={name(0)} fn={tx(copy.s4c.fn, lang)} at={135} out={215} />
      <Passport lang={lang} x={96} y={(1080 - passportSize.h) / 2} stamps={{m1: 240, m2: 262, unlock: 284}} opacity={frame >= 225 ? 1 : 0} />
      <MissionTile title={copy.s4d.m1.title[lang]} desc={copy.s4d.m1.desc[lang]} lang={lang} at={240} out={262} x={96 + passportSize.w + 56} y={(1080 - passportSize.h) / 2 + slotY[0]} />
      <MissionTile title={copy.s4d.m2.title[lang]} desc={copy.s4d.m2.desc[lang]} lang={lang} at={262} out={284} x={96 + passportSize.w + 56} y={(1080 - passportSize.h) / 2 + slotY[1]} />
      <MissionTile title={copy.s4d.unlock.title[lang]} lang={lang} at={284} x={96 + passportSize.w + 56} y={(1080 - passportSize.h) / 2 + slotY[2]} />
    </AbsoluteFill>
  );
};

export const GalleryComp: React.FC<GalleryProps & {item: string}> = ({bg, lang, item}) => {
  const ready = useFontsReady();
  const entry = galleryItems[item];
  return (
    <AbsoluteFill style={{background: core.black}}>
      {bg === 'footage' ? <FootageStandIn /> : null}
      {ready ? entry.render(lang) : null}
      {ready ? <Caption text={`${item} · ${bg === 'footage' ? 'on footage' : 'on black'} · ${lang.toUpperCase()}`} /> : null}
    </AbsoluteFill>
  );
};
