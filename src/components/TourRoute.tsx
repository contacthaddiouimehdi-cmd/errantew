import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {tour} from '../facts';
import {Lang} from '../format';
import {layout as L, WIDTH} from '../tokens';
import {placeStyles, PlaceSuper} from './Supers';
import {layoutTile} from './Tile';
import {cumulative, Node, Pt, Thread, through} from './Thread';

// The thread traces the tour: a smooth curve left to right with 7 stops, each lighting
// up on its beat (dot cut-in + place/date super). Deliberately not a map: a map of
// Morocco is only allowed if the client supplies an approved one.

const X0 = L.margin;
const X1 = WIDTH - L.margin;
const FIRST = 216;
const STEP = 248; // 216 → 1704
const WAVE = 46;
const SEG = 24;

export const TourRoute: React.FC<{lang: Lang; reach: number[]; out?: number; y?: number}> = ({lang, reach, out, y = 540}) => {
  const frame = useCurrentFrame();
  const start = reach[0] - 12;
  if (frame < start || (out !== undefined && frame >= out)) return null;
  const stops: Pt[] = tour.map((_, i) => [FIRST + i * STEP, y + (i % 2 === 0 ? -WAVE : WAVE)]);
  const pts = through([[X0, y], ...stops, [X1, y]], SEG);
  const cum = cumulative(pts);
  const total = cum[cum.length - 1];
  const fracs = stops.map((_, i) => cum[(i + 1) * SEG] / total);
  const end = reach[reach.length - 1] + 12;
  const to = interpolate(frame, [start, ...reach, end], [0, ...fracs, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      <Thread paths={[pts]} to={to} />
      {stops.map((p, i) => (frame >= reach[i] ? <Node key={i} p={p} r={13} /> : null))}
      {tour.map((stop, i) => {
        const above = i % 2 === 0;
        const half = layoutTile([{text: stop[lang]}], placeStyles.name).w / 2;
        const cx = Math.min(Math.max(stops[i][0], X0 + half), X1 - half);
        return (
          <PlaceSuper
            key={i}
            place={stop[lang]}
            date={stop.date}
            x={cx}
            y={above ? stops[i][1] - 36 : stops[i][1] + 36}
            vAlign={above ? 'bottom' : 'top'}
            anim={{at: reach[i], out, exit: 'cut'}}
          />
        );
      })}
    </>
  );
};
