import React from 'react';
import {useCurrentFrame} from 'remotion';
import {copy, T, tx} from '../copy';
import {factRun, HeroNumber, richRuns} from '../components/CountUp';
import {Run, styles, TileStack} from '../components/Tile';
import {FactKey, facts, shows} from '../facts';
import {Lang} from '../format';
import {size} from '../tokens';
import {SceneProps, Shot} from './common';

// f2200–2750 (550) · each result: big orange number + white label, count-up 20 frames,
// hold, hard cut to a 10-frame footage flash, next. Lockup from f2680.
const RESULTS_END = 480;
const FLASH = 10;

type Result = {id: string; weight: number; keys: FactKey[]; number?: (lang: Lang, f: number, at: number) => Run[]; label: T};

const sep: Run = {text: ' · '};

const results: Result[] = [
  {id: 'R1', weight: 70, keys: ['PEOPLE_ON_SITE'], number: (l, f, a) => [factRun('PEOPLE_ON_SITE', l, f, a)], label: copy.s5.r1},
  {id: 'R2', weight: 70, keys: ['KIDS'], number: (l, f, a) => [factRun('KIDS', l, f, a)], label: copy.s5.r2},
  {id: 'R3', weight: 70, keys: ['FIELD_TEAM'], number: (l, f, a) => [factRun('FIELD_TEAM', l, f, a)], label: copy.s5.r3},
  {id: 'R4', weight: 70, keys: ['CITIES', 'REGIONS'], number: (l, f, a) => [factRun('CITIES', l, f, a), sep, factRun('REGIONS', l, f, a)], label: copy.s5.r4},
  {id: 'R5', weight: 70, keys: ['ORGANIC_REACH'], number: (l, f, a) => [factRun('ORGANIC_REACH', l, f, a)], label: copy.s5.r5},
  {id: 'R6', weight: 60, keys: ['PRESS'], label: copy.s5.r6},
  {
    id: 'R7',
    weight: 70,
    keys: ['TEACHERS_TRAINED', 'SCHOOLS_REACHED'],
    number: (l, f, a) => [factRun('TEACHERS_TRAINED', l, f, a), sep, factRun('SCHOOLS_REACHED', l, f, a)],
    label: copy.s5.r7,
  },
];

// Slot lengths scale to fill f0–480 whatever results are dropped.
export const schedule = (final: boolean) => {
  const shown = results.filter((r) => shows(r.keys, final));
  const total = shown.reduce((s, r) => s + r.weight, 0);
  let at = 0;
  return shown.map((r, i) => {
    const end = i === shown.length - 1 ? RESULTS_END : at + Math.round((r.weight / total) * RESULTS_END);
    const slot = {...r, at, end};
    at = end;
    return slot;
  });
};

const Press: React.FC<{lang: Lang; at: number; out: number}> = ({lang, at, out}) => {
  // "In the press: Le360 · 2M · Hespress" set as names (hero) over the lead-in (label).
  const [lead, names] = tx(copy.s5.r6, lang).split(/\s?:\s/);
  return (
    <TileStack
      x={960}
      y={540}
      align="center"
      vAlign="center"
      items={[
        {runs: names ?? facts.PRESS.display_en ?? '', style: {weight: 'bold', size: 150, tile: 'black', colour: 'orange'}, anim: {at, out, exit: 'cut'}},
        {runs: lead, style: styles.label('black', 'white', 'roman'), anim: {at, out, exit: 'cut'}},
      ]}
    />
  );
};

export const S5Results: React.FC<SceneProps> = ({lang, final}) => {
  const frame = useCurrentFrame();
  const slots = schedule(final);
  const teachers = shows(['TEACHERS_TRAINED'], final);
  const n = {colour: 'orange' as const, weight: 'bold' as const};
  const sepRun: Run[] = [{text: ' · '}];
  const lockupNumbers: Run[] = [
    ...(teachers ? [...richRuns(copy.s5.lockupTeachers[lang], lang, frame, 480, n), ...sepRun] : []),
    ...richRuns(copy.s5.lockupKids[lang], lang, frame, 480, n),
    ...sepRun,
    ...richRuns(copy.s5.lockupPeople[lang], lang, frame, 480, n),
  ];
  return (
    <>
      {slots.map((s, i) => {
        const cut = s.end - FLASH;
        return (
          <React.Fragment key={s.id}>
            {s.number ? (
              <HeroNumber runs={(f) => s.number!(lang, f, s.at)} label={tx(s.label, lang)} anim={{at: s.at, out: cut, exit: 'cut'}} />
            ) : (
              <Press lang={lang} at={s.at} out={cut} />
            )}
            <Shot id={`s5-flash-${i + 1}`} from={cut} dur={FLASH} />
          </React.Fragment>
        );
      })}
      <TileStack
        arrange="stagger"
        align="group"
        x={960}
        y={540}
        vAlign="center"
        items={[
          {runs: tx(copy.s5.lockupA, lang), style: {weight: 'bold', size: size.headline, tile: 'orange', colour: 'white'}, anim: {at: 480, out: 550}},
          {runs: lockupNumbers, style: {weight: 'roman', size: size.super, tile: 'white', colour: 'black'}, anim: {at: 492, out: 550, enter: 'settle'}},
        ]}
      />
    </>
  );
};
