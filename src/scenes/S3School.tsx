import React from 'react';
import {Sequence, useCurrentFrame} from 'remotion';
import {copy, tx} from '../copy';
import {richRuns} from '../components/CountUp';
import {FullFrame} from '../components/Panels';
import {PartnerBand, partnerBandHeight} from '../components/PartnerBand';
import {ChapterTile} from '../components/Supers';
import {styles, TileStack} from '../components/Tile';
import {shows} from '../facts';
import {Line, SceneProps, Y_LOWER} from './common';

// f750–1300 (550) · Season 1, the institutional backbone, on full-frame recap footage.
export const S3School: React.FC<SceneProps> = ({lang, final}) => {
  const frame = useCurrentFrame();
  const numbers = shows(['TEACHERS_TRAINED', 'SCHOOLS_REACHED'], final);
  const end3 = numbers ? 435 : 550;
  const bandY = 540 - partnerBandHeight / 2 + 40;
  const number = {colour: 'orange' as const, weight: 'bold' as const};
  return (
    <>
      <ChapterTile text={copy.s3.chapter[lang]} lang={lang} at={4} out={60} />

      <Sequence from={60} durationInFrames={90} layout="none">
        <FullFrame id="s3-recap-1" />
      </Sequence>
      <Line t={copy.s3.l9} lang={lang} at={66} out={148} y={Y_LOWER - 40} />

      <TileStack x={960} y={bandY - 24} align="center" vAlign="bottom" items={[{runs: tx(copy.s3.builtWith, lang), style: styles.super(), anim: {at: 154, out: 260, exit: 'cut'}}]} />
      <PartnerBand lang={lang} y={bandY} at={158} out={260} />

      <Sequence from={260} durationInFrames={95} layout="none">
        <FullFrame id="s3-recap-2" />
      </Sequence>
      <Line t={copy.s3.l10} lang={lang} at={266} out={352} y={Y_LOWER - 40} />

      <Sequence from={355} durationInFrames={end3 - 355} layout="none">
        <FullFrame id="s3-recap-3" />
      </Sequence>
      <Line t={copy.s3.l11} lang={lang} at={360} out={end3 - 3} y={Y_LOWER} />

      {numbers ? (
        <TileStack
          x={960}
          y={540}
          align="center"
          vAlign="center"
          items={[
            {runs: richRuns(copy.s3.l12a[lang], lang, frame, 440, number), style: styles.super('black', 'white', 'roman'), anim: {at: 440, out: 550}},
            {runs: richRuns(copy.s3.l12b[lang], lang, frame, 440, number), style: styles.super('black', 'white', 'roman'), anim: {at: 440, out: 550}},
          ]}
        />
      ) : null}
    </>
  );
};
