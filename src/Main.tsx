import React from 'react';
import {AbsoluteFill, Audio, Sequence} from 'remotion';
import {assetSrc, paths} from './assets';
import {useFontsReady} from './fonts';
import {S0Opening} from './scenes/S0Opening';
import {S1Problem} from './scenes/S1Problem';
import {S2Idea} from './scenes/S2Idea';
import {S3School} from './scenes/S3School';
import {S4Tour} from './scenes/S4Tour';
import {S5Mechanic} from './scenes/S5Mechanic';
import {S6Numbers} from './scenes/S6Numbers';
import {S7Closing} from './scenes/S7Closing';
import {SceneProps} from './scenes/common';
import {core} from './tokens';

// Arc at 25 fps, 3,000 frames (FGC_VF storytelling).
export const scenes = [
  {id: 'S0', name: 'S0 · Title', from: 0, dur: 125, C: S0Opening},
  {id: 'S1', name: 'S1 · The problem', from: 125, dur: 375, C: S1Problem},
  {id: 'S2', name: 'S2 · The idea', from: 500, dur: 250, C: S2Idea},
  {id: 'S3', name: 'S3 · Season 1, at school', from: 750, dur: 550, C: S3School},
  {id: 'S4', name: 'S4 · Season 2, on tour', from: 1300, dur: 475, C: S4Tour},
  {id: 'S5', name: 'S5 · The mechanic', from: 1775, dur: 425, C: S5Mechanic},
  {id: 'S6', name: 'S6 · The numbers', from: 2200, dur: 550, C: S6Numbers},
  {id: 'S7', name: 'S7 · Closing', from: 2750, dur: 250, C: S7Closing},
] as const;

export const Main: React.FC<SceneProps> = (props) => {
  const ready = useFontsReady();
  const music = assetSrc(paths.music);
  return (
    <AbsoluteFill style={{background: core.black}}>
      {ready
        ? scenes.map(({id, name, from, dur, C}) => (
            <Sequence key={id} from={from} durationInFrames={dur} name={name}>
              <C {...props} />
            </Sequence>
          ))
        : null}
      {music ? <Audio src={music} /> : null}
    </AbsoluteFill>
  );
};
