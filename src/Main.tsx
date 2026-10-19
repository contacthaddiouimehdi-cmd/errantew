import React from 'react';
import {AbsoluteFill, Audio, Sequence} from 'remotion';
import {assetSrc, paths} from './assets';
import {useFontsReady} from './fonts';
import {S0Opening} from './scenes/S0Opening';
import {S1Problem} from './scenes/S1Problem';
import {S2Idea} from './scenes/S2Idea';
import {S3School} from './scenes/S3School';
import {S4Tour} from './scenes/S4Tour';
import {S5Results} from './scenes/S5Results';
import {S6Closing} from './scenes/S6Closing';
import {SceneProps} from './scenes/common';
import {core} from './tokens';

// Arc at 25 fps, 3,000 frames (brief section 2).
export const scenes = [
  {id: 'S0', name: 'S0 · Opening', from: 0, dur: 125, C: S0Opening, key: 100},
  {id: 'S1', name: 'S1 · The problem', from: 125, dur: 375, C: S1Problem, key: 60},
  {id: 'S2', name: 'S2 · The idea', from: 500, dur: 250, C: S2Idea, key: 120},
  {id: 'S3', name: 'S3 · Season 1, at school', from: 750, dur: 550, C: S3School, key: 210},
  {id: 'S4', name: 'S4 · Season 2, on tour', from: 1300, dur: 900, C: S4Tour, key: 712},
  {id: 'S5', name: 'S5 · Results', from: 2200, dur: 550, C: S5Results, key: 40},
  {id: 'S6', name: 'S6 · Closing', from: 2750, dur: 250, C: S6Closing, key: 60},
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
