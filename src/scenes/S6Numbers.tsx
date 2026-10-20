import React from 'react';
import {useCurrentFrame} from 'remotion';
import {copy, tx} from '../copy';
import {factRun, HeroNumber, richRuns} from '../components/CountUp';
import {Run, styles, TileStack, TileStyle} from '../components/Tile';
import {branch, draw, drop, ellipse, line, Node, Pt, Thread} from '../components/Thread';
import {shows} from '../facts';
import {Lang} from '../format';
import {size} from '../tokens';
import {SceneProps, Shot} from './common';

// f2200–2750 (550) · the numbers: digital impact first, then the ground, then all year.
// Six screens on black (6 beats each, beats on local 5 + 15n); the thread splits into
// branches and every number lands on it with a counter; a 10-frame field flash between screens.
const N = {colour: 'orange' as const, weight: 'bold' as const};
export const SCREENS = [0, 95, 185, 275, 365, 455];
const FLASHES = [85, 175, 265, 355, 445];

const small = (w: 'bold' | 'roman' = 'roman', tile: TileStyle['tile'] = 'black', colour: TileStyle['colour'] = 'white'): TileStyle => ({weight: w, size: size.labelSmall, tile, colour});

const visible = (f: number, a: number, b: number) => f >= a && f < b;

// 1 · The setup: 3 months · 29 posts · 5 platforms, the thread splits into 5 branches.
const Setup: React.FC<{lang: Lang; f: number}> = ({lang, f}) => {
  const a = SCREENS[0];
  const split: Pt = [600, 650];
  const ends: Pt[] = [410, 530, 650, 770, 890].map((y) => [880, y]);
  const b = copy.s6.setup.branches;
  return (
    <>
      <TileStack x={960} y={200} align="center" vAlign="center" items={[{runs: richRuns(copy.s6.setup.hero[lang], lang, f, a + 5, N), style: styles.headline(), anim: {at: a + 2, out: FLASHES[0], exit: 'cut'}}]} />
      <Thread paths={[line([0, 650], split)]} to={draw(f, a + 12, 12)} />
      {ends.map((e, i) => (f >= a + 24 + i * 2 ? <Thread key={i} paths={[branch(split, e)]} to={draw(f, a + 24 + i * 2, 12)} /> : null))}
      {ends.map((e, i) => (f >= a + 36 + i * 2 ? <Node key={`n${i}`} p={e} r={10} /> : null))}
      {b.map((br, i) => (
        <TileStack
          key={i}
          x={ends[i][0] + 34}
          y={ends[i][1]}
          vAlign="center"
          items={[{runs: [{text: `${tx(br.name, lang)}  `, weight: 'bold'}, ...richRuns(br.value[lang], lang, f, a + 36 + i * 2, N)], style: small('roman', 'white', 'black'), anim: {at: a + 36 + i * 2, out: FLASHES[0], exit: 'cut'}}]}
        />
      ))}
    </>
  );
};

// 2 · The reach: 190.7K, the thread underlines it, the platforms stack below.
const Reach: React.FC<{lang: Lang; f: number}> = ({lang, f}) => {
  const a = SCREENS[1];
  return (
    <>
      <HeroNumber runs={(fr) => [factRun('ORGANIC_REACH', lang, fr, a)]} label={tx(copy.s6.reach.label, lang)} y={360} anim={{at: a, out: FLASHES[1], exit: 'cut'}} />
      <Thread paths={[line([0, 600], [1920, 600])]} to={draw(f, a + 10, 18)} />
      <TileStack
        x={960}
        y={640}
        align="center"
        items={[
          {runs: richRuns(copy.s6.reach.sub1[lang], lang, f, a + 22, N), style: styles.label(), anim: {at: a + 22, out: FLASHES[1], exit: 'cut'}},
          {runs: richRuns(copy.s6.reach.sub2[lang], lang, f, a + 30, N), style: styles.label(), anim: {at: a + 30, out: FLASHES[1], enter: 'settle', exit: 'cut'}},
        ]}
      />
    </>
  );
};

// 3 · The Mehdi El Amri effect: reel in a panel, the thread runs from it to the numbers.
const Mehdi: React.FC<{lang: Lang; f: number}> = ({lang, f}) => {
  const a = SCREENS[2];
  const out = FLASHES[2];
  const x = 990;
  return (
    <>
      <Shot id="s6-mehdi-reel" from={a} dur={out - a} x={240} />
      <Thread paths={[line([840, 540], [930, 540]), line([930, 540], [930, 250]), line([930, 540], [930, 830])]} to={draw(f, a + 4, 14)} />
      {f >= a + 18 ? <Node p={[930, 540]} r={10} /> : null}
      <TileStack
        x={x}
        y={540}
        vAlign="center"
        items={[
          {runs: richRuns(copy.s6.mehdi.kicker[lang], lang, f, a, {}), style: {weight: 'bold', size: size.label, tile: 'orange', colour: 'white'}, anim: {at: a + 4, out, exit: 'cut'}},
          {runs: [factRun('MEHDI_COLLAB_VIEWS', lang, f, a + 10)], style: {weight: 'bold', size: size.heroNumber, tile: 'black', colour: 'orange'}, anim: {at: a + 10, out, exit: 'cut'}, flush: true},
          {runs: tx(copy.s6.mehdi.label, lang), style: small(), anim: {at: a + 10, out, exit: 'cut'}, flush: true},
          {runs: richRuns(copy.s6.mehdi.sub1[lang], lang, f, a + 30, N), style: small(), anim: {at: a + 30, out, enter: 'settle', exit: 'cut'}, flush: true},
          {runs: richRuns(copy.s6.mehdi.sub2[lang], lang, f, a + 36, N), style: small(), anim: {at: a + 36, out, enter: 'settle', exit: 'cut'}, flush: true},
        ]}
      />
    </>
  );
};

// 4 · Every platform plays its part: 1,868 interactions, the thread drops to three platform tiles.
const Platforms: React.FC<{lang: Lang; f: number}> = ({lang, f}) => {
  const a = SCREENS[3];
  const out = FLASHES[3];
  const xs = [420, 960, 1500];
  const top: Pt = [960, 470];
  return (
    <>
      <HeroNumber runs={(fr) => [factRun('INTERACTIONS', lang, fr, a)]} label={tx(copy.s6.platforms.label, lang)} y={250} anim={{at: a, out, exit: 'cut'}} />
      {xs.map((x, i) => (f >= a + 10 ? <Thread key={i} paths={[drop(top, [x, 610])]} to={draw(f, a + 10, 14)} /> : null))}
      {f >= a + 24 ? xs.map((x, i) => <Node key={`n${i}`} p={[x, 610]} r={10} />) : null}
      {copy.s6.platforms.tiles.map((t, i) => (
        <TileStack
          key={i}
          x={xs[i]}
          y={640}
          align="center"
          items={[
            {runs: tx(t.name, lang), style: styles.label('white', 'black', 'bold'), anim: {at: a + 24 + i * 3, out, exit: 'cut'}},
            ...t.lines.map((l, k) => ({runs: richRuns(l[lang], lang, f, a + 30 + i * 3, N) as Run[], style: small(), anim: {at: a + 30 + i * 3 + k * 4, out, enter: 'settle' as const, exit: 'cut' as const}})),
          ]}
        />
      ))}
    </>
  );
};

// 5 · On the ground: 12,000 people, the thread links the field results, press.
const Ground: React.FC<{lang: Lang; f: number}> = ({lang, f}) => {
  const a = SCREENS[4];
  const out = FLASHES[4];
  return (
    <>
      <HeroNumber runs={(fr) => [factRun('PEOPLE_ON_SITE', lang, fr, a)]} label={tx(copy.s6.ground.label, lang)} y={290} anim={{at: a, out, exit: 'cut'}} />
      <Thread paths={[line([0, 525], [1920, 525])]} to={draw(f, a + 10, 18)} />
      <TileStack
        x={960}
        y={560}
        align="center"
        items={[
          ...copy.s6.ground.stats.map((s, i) => ({runs: richRuns(s[lang], lang, f, a + 18 + i * 5, N), style: styles.label(), anim: {at: a + 18 + i * 5, out, enter: (i ? 'settle' : 'fade') as 'settle' | 'fade', exit: 'cut' as const}})),
          {runs: tx(copy.s6.ground.press, lang), style: small('bold', 'white', 'black'), anim: {at: a + 40, out, enter: 'settle', exit: 'cut'}},
        ]}
      />
    </>
  );
};

// 6 · All year: teachers · schools, then "One programme · Two seasons"; the thread closes around it.
const Year: React.FC<{lang: Lang; f: number; final: boolean}> = ({lang, f, final}) => {
  const a = SCREENS[5];
  const numbers = shows(['TEACHERS_TRAINED', 'SCHOOLS_REACHED'], final);
  const lock = numbers ? a + 50 : a;
  return (
    <>
      {numbers ? (
        <TileStack
          x={960}
          y={540}
          align="center"
          vAlign="center"
          items={[
            {runs: richRuns(copy.s6.year.a[lang], lang, f, a, N), style: styles.super('black', 'white', 'roman'), anim: {at: a, out: lock, exit: 'cut'}},
            {runs: richRuns(copy.s6.year.b[lang], lang, f, a, N), style: styles.super('black', 'white', 'roman'), anim: {at: a + 6, out: lock, enter: 'settle', exit: 'cut'}},
          ]}
        />
      ) : null}
      {f >= lock ? <Thread paths={[ellipse(960, 540, 820, 190, Math.PI)]} to={draw(f, lock, 26)} /> : null}
      <TileStack x={960} y={540} align="center" vAlign="center" items={[{runs: tx(copy.s6.year.lockup, lang), style: {weight: 'bold', size: size.headline, tile: 'orange', colour: 'white'}, anim: {at: lock, out: 550}}]} />
    </>
  );
};

export const S6Numbers: React.FC<SceneProps> = ({lang, final}) => {
  const f = useCurrentFrame();
  return (
    <>
      {visible(f, SCREENS[0], FLASHES[0]) ? <Setup lang={lang} f={f} /> : null}
      {visible(f, SCREENS[1], FLASHES[1]) ? <Reach lang={lang} f={f} /> : null}
      {visible(f, SCREENS[2], FLASHES[2]) ? <Mehdi lang={lang} f={f} /> : null}
      {visible(f, SCREENS[3], FLASHES[3]) ? <Platforms lang={lang} f={f} /> : null}
      {visible(f, SCREENS[4], FLASHES[4]) ? <Ground lang={lang} f={f} /> : null}
      {f >= SCREENS[5] ? <Year lang={lang} f={f} final={final} /> : null}
      {FLASHES.map((at, i) => (
        <Shot key={i} id={`s6-flash-${i + 1}`} from={at} dur={10} />
      ))}
    </>
  );
};
