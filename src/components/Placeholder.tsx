import React from 'react';
import {core} from '../tokens';
import {wrapBalanced} from '../measure';
import {styles, TileStack} from './Tile';

// Draft-only stand-in for a missing shot, logo or illustration: dashed grey outline,
// what the shot should show (white) and its id (orange), so the edit reads without footage.
export const PlaceholderBox: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  detail?: string;
  opacity?: number;
}> = ({x, y, w, h, title, detail, opacity = 1}) => {
  const titleStyle = {...styles.label('black', 'white', 'bold'), size: w > 700 ? 40 : 30};
  const lines = wrapBalanced(title, 'bold', titleStyle.size, Math.min(w, 900) - 80);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity}}>
      <div style={{position: 'absolute', inset: 0, border: `3px dashed ${core.grey}`, background: '#141414'}} />
      <TileStack
        items={[
          ...lines.map((l) => ({runs: l, style: titleStyle})),
          ...(detail ? [{runs: detail, style: {...styles.label('black', 'orange', 'roman'), size: 24}}] : []),
        ]}
        x={w / 2}
        y={h / 2}
        align="center"
        vAlign="center"
      />
    </div>
  );
};

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
