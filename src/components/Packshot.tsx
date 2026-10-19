import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {assetSrc, paths} from '../assets';
import {core, HEIGHT, layout as L, timing, WIDTH} from '../tokens';
import {PlaceholderBox} from './Placeholder';

// Master logo on black, 360 px high, centred; fades in over 10 frames, holds,
// fades out over 10 frames, ends on black. Official artwork only, never redrawn or animated.
// The sonic logo starts with the fade-in.
export const Packshot: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, timing.logoFade, duration - timing.logoFade, duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const logo = assetSrc(paths.logo);
  const sonic = assetSrc(paths.sonicLogo);
  return (
    <AbsoluteFill style={{background: core.black}}>
      {logo ? (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity}}>
          <Img src={logo} style={{height: L.logoHeight, width: 'auto'}} />
        </AbsoluteFill>
      ) : (
        <PlaceholderBox
          x={(WIDTH - L.logoHeight) / 2}
          y={(HEIGHT - L.logoHeight) / 2}
          w={L.logoHeight}
          h={L.logoHeight}
          title="Orange master logo"
          detail="official artwork pending"
          opacity={opacity}
        />
      )}
      {sonic ? (
        <Sequence from={0}>
          <Audio src={sonic} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
