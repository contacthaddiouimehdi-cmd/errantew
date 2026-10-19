import React from 'react';
import {copy, tx} from '../copy';
import {TileStack} from '../components/Tile';
import {size} from '../tokens';
import {SceneProps} from './common';

// f0–125 · programme title tiles on black. Internal (default): no "Orange presents".
// External: "Orange" / "presents" first, then the title in a different tile colour.
export const S0Opening: React.FC<SceneProps> = ({lang, version}) => {
  const external = version === 'external';
  const t = external ? 62 : 10;
  return (
    <>
      {external ? (
        <TileStack
          arrange="stagger"
          align="group"
          x={960}
          y={540}
          vAlign="center"
          items={[
            {runs: tx(copy.s0.presents.orange, lang), style: {weight: 'bold', size: size.headline, tile: 'white', colour: 'orange'}, anim: {at: 6, out: 56}},
            {runs: tx(copy.s0.presents.presents, lang), style: {weight: 'roman', size: size.super, tile: 'white', colour: 'black'}, anim: {at: 18, out: 56, enter: 'settle'}},
          ]}
        />
      ) : null}
      <TileStack
        arrange="stagger"
        align="group"
        x={960}
        y={540}
        vAlign="center"
        items={[
          {runs: tx(copy.s0.title, lang), style: {weight: 'bold', size: size.headline, tile: 'orange', colour: 'white'}, anim: {at: t, out: 125}},
          {runs: tx(copy.s0.entity, lang), style: {weight: 'roman', size: size.super, tile: 'white', colour: 'black'}, anim: {at: t + 20, out: 125, enter: 'settle'}},
          {runs: tx(copy.s0.category, lang), style: {weight: 'roman', size: size.super, tile: 'white', colour: 'orange'}, anim: {at: t + 28, out: 125, enter: 'settle'}},
        ]}
      />
    </>
  );
};
