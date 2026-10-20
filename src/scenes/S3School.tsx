import React from 'react';
import {Sequence, useCurrentFrame} from 'remotion';
import {copy, tx} from '../copy';
import {richRuns} from '../components/CountUp';
import {FullFrame} from '../components/Panels';
import {PartnerBand, partnerBandHeight} from '../components/PartnerBand';
import {ChapterTile} from '../components/Supers';
import {styles, TileStack} from '../components/Tile';
import {branch, draw, line, Node, Pt, Thread} from '../components/Thread';
import {shows} from '../facts';
import {Line, SceneProps, Y_LOWER} from './common';

// f750–1300 (550) · Season 1, the institutional backbone. Beats on local 15n.
// The thread links the partners one by one, then branches into a small network
// (resource teams in middle schools).

type Seg = {a: Pt; b: Pt; at: number};
const NET: Seg[] = (() => {
  const root: Pt = [0, 760];
  const hub: Pt = [470, 760];
  const l1: Pt[] = [[860, 590], [860, 760], [860, 930]];
  const l2: [number, Pt][] = [[0, [1260, 520]], [0, [1260, 650]], [1, [1260, 760]], [2, [1260, 870]], [2, [1260, 990]]];
  const l3: Pt[] = l2.map(([, p]) => [1660, p[1]]);
  return [
    {a: root, b: hub, at: 360},
    ...l1.map((p) => ({a: hub, b: p, at: 375})),
    ...l2.map(([i, p]) => ({a: l1[i], b: p, at: 390})),
    ...l2.map(([, p], i) => ({a: p, b: l3[i], at: 405})),
  ];
})();

const Network: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {NET.map((s, i) => {
        if (frame < s.at) return null;
        const pts = s.a[1] === s.b[1] ? line(s.a, s.b) : branch(s.a, s.b);
        return <Thread key={i} paths={[pts]} to={draw(frame, s.at, 15)} />;
      })}
      {NET.map((s, i) => (frame >= s.at + 15 && i > 0 ? <Node key={`n${i}`} p={s.b} r={11} /> : null))}
      {frame >= 375 ? <Node p={NET[0].b} r={11} /> : null}
    </>
  );
};

export const S3School: React.FC<SceneProps> = ({lang, final}) => {
  const frame = useCurrentFrame();
  const numbers = shows(['TEACHERS_TRAINED', 'SCHOOLS_REACHED'], final);
  const endNet = numbers ? 450 : 550;
  const bandY = 540 - partnerBandHeight / 2 + 40;
  const number = {colour: 'orange' as const, weight: 'bold' as const};
  return (
    <>
      <Sequence from={0} durationInFrames={150} layout="none">
        <FullFrame id="s3-recap-1" duration={150} />
      </Sequence>
      <ChapterTile text={copy.s3.chapter[lang]} lang={lang} at={0} out={60} />
      <Line t={copy.s3.l9} lang={lang} at={60} out={147} y={Y_LOWER - 40} />

      <TileStack x={960} y={bandY - 24} align="center" vAlign="bottom" items={[{runs: tx(copy.s3.builtWith, lang), style: styles.super(), anim: {at: 150, out: 270, exit: 'cut'}}]} />
      <PartnerBand lang={lang} y={bandY} at={150} reach={[165, 180, 195, 210, 225]} out={270} />

      <Sequence from={270} durationInFrames={90} layout="none">
        <FullFrame id="s3-recap-2" duration={90} />
      </Sequence>
      <Line t={copy.s3.l10} lang={lang} at={274} out={357} y={Y_LOWER - 40} />

      <Sequence from={360} durationInFrames={endNet - 360} layout="none">
        <FullFrame id="s3-team" opacity={0.3} duration={endNet - 360} />
      </Sequence>
      {frame >= 360 && frame < endNet ? <Network /> : null}
      <Line t={copy.s3.l11} lang={lang} at={364} out={endNet - 3} y={300} />

      {numbers ? (
        <TileStack
          x={960}
          y={540}
          align="center"
          vAlign="center"
          items={[
            {runs: richRuns(copy.s3.l12a[lang], lang, frame, 450, number), style: styles.super('black', 'white', 'roman'), anim: {at: 450, out: 550}},
            {runs: richRuns(copy.s3.l12b[lang], lang, frame, 450, number), style: styles.super('black', 'white', 'roman'), anim: {at: 456, out: 550, enter: 'settle'}},
          ]}
        />
      ) : null}
    </>
  );
};
