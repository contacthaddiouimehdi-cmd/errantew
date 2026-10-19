import React from 'react';
import {Composition, Folder} from 'remotion';
import {GalleryComp, galleryItems, MotionTest} from './gallery/Gallery';
import {Main} from './Main';
import {DURATION, FPS, HEIGHT, WIDTH} from './tokens';

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id="FGC-CaseStudy"
    component={Main}
    durationInFrames={DURATION}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{lang: 'en' as 'en' | 'fr', version: 'internal' as 'internal' | 'external', final: false}}
  />
  <Folder name="Components">
    {Object.keys(galleryItems).map((item) => (
      <Composition
        key={item}
        id={`C-${item}`}
        component={GalleryComp}
        durationInFrames={250}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{bg: 'black' as const, lang: 'en' as const, item}}
      />
    ))}
    <Composition id="C-MotionTest" component={MotionTest} durationInFrames={320} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{lang: 'en' as const}} />
  </Folder>
  </>
);
