import React from 'react';
import {Composition, Folder} from 'remotion';
import {GalleryComp, galleryItems, MotionTest} from './gallery/Gallery';
import {FPS, HEIGHT, WIDTH} from './tokens';

export const RemotionRoot: React.FC = () => (
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
);
