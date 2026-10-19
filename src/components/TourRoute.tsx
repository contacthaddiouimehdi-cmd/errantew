import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {tour} from '../facts';
import {Lang} from '../format';
import {core, layout as L, WIDTH} from '../tokens';
import {placeStyles, PlaceSuper} from './Supers';
import {layoutTile} from './Tile';

// A horizontal route drawn left to right (orange, 6 px) with 7 stops. Each stop pops in
// as the line reaches it: a dot (hard cut) and its place/date super (tile motion).
// Deliberately not a map: a map of Morocco is only allowed if the client supplies an approved one.

const X0 = L.margin;
const X1 = WIDTH - L.margin;
const FIRST = 216;
const STEP = 248; // 216 → 1704
export const stopX = tour.map((_, i) => FIRST + i * STEP);

export const TourRoute: React.FC<{lang: Lang; at: number; draw: number; out?: number; y?: number}> = ({lang, at, draw, out, y = 540}) => {
  const frame = useCurrentFrame();
  if (frame < at || (out !== undefined && frame >= out)) return null;
  const head = interpolate(frame, [at, at + draw], [X0, X1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const reach = (x: number) => at + Math.round(((x - X0) / (X1 - X0)) * draw);
  return (
    <>
      <svg width={WIDTH} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={X0} y1={y} x2={head} y2={y} stroke={core.orange} strokeWidth={L.routeStroke} />
        {stopX.map((x, i) =>
          frame >= reach(x) ? <circle key={i} cx={x} cy={y} r={13} fill={core.white} stroke={core.orange} strokeWidth={6} /> : null,
        )}
      </svg>
      {tour.map((stop, i) => {
        const above = i % 2 === 0;
        const half = layoutTile([{text: stop[lang]}], placeStyles.name).w / 2;
        const cx = Math.min(Math.max(stopX[i], X0 + half), X1 - half);
        return (
          <PlaceSuper
            key={i}
            place={stop[lang]}
            date={stop.date}
            x={cx}
            y={above ? y - 40 : y + 40}
            vAlign={above ? 'bottom' : 'top'}
            anim={{at: reach(stopX[i]), out}}
          />
        );
      })}
    </>
  );
};
