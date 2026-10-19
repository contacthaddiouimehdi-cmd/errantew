import React from 'react';
import {core} from '../tokens';
import {styles, TileStack} from './Tile';

// Draft-only stand-in for a missing shot, logo or illustration. Grey outline, label in tiles.
export const PlaceholderBox: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  detail?: string;
  opacity?: number;
}> = ({x, y, w, h, title, detail, opacity = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity}}>
    <div style={{position: 'absolute', inset: 0, border: `3px dashed ${core.grey}`, background: core.black}} />
    <TileStack
      items={[
        {runs: title, style: {...styles.label('black', 'white', 'bold'), size: 32}},
        ...(detail ? [{runs: detail, style: {...styles.label('black', 'orange', 'roman'), size: 26}}] : []),
      ]}
      x={w / 2}
      y={h / 2}
      align="center"
      vAlign="center"
    />
  </div>
);

// Background used for "on footage" component stills until real footage is logged:
// a light-to-dark sweep so tiles can be judged on both bright and dark images.
export const FootageStandIn: React.FC = () => (
  <div style={{position: 'absolute', inset: 0}}>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(100deg, #e9e4dc 0%, #b9b2a7 35%, #5d5953 65%, #1d1c1a 100%)'}} />
    <TileStack
      items={[{runs: 'Footage stand-in · real footage not yet logged', style: {...styles.label('black', 'white', 'roman'), size: 24}}]}
      x={1920 - 24}
      y={24}
      align="right"
    />
  </div>
);
