import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {partnerLogo, partners} from '../assets';
import {fontFamily, fontWeight} from '../fonts';
import {Lang} from '../format';
import {wrapBalanced} from '../measure';
import {core, layout as L, timing, WIDTH} from '../tokens';
import {line, Node, Pt, Thread} from './Thread';

// White band holding the approved partner logos at equal optical size, evenly spaced.
// The orange thread runs along it and links the partners one by one: each appears when
// the thread reaches its node. A missing logo is replaced by the partner's name in
// 55 Roman black; logos are never drawn.
const BAND_H = 280;
const LOGO_H = 110;
const NAME_PX = 30;
const col = (WIDTH - 2 * L.margin) / partners.length;
export const partnerX = partners.map((_, i) => L.margin + col * (i + 0.5));

export const PartnerBand: React.FC<{lang: Lang; y: number; at: number; reach: number[]; out?: number}> = ({lang, y, at, reach, out}) => {
  const frame = useCurrentFrame();
  if (frame < at || (out !== undefined && frame >= out)) return null;
  const band = interpolate(frame - at, [0, timing.tileIn], [0, 1], {extrapolateRight: 'clamp'});
  const ty = y + BAND_H - 64;
  const path: Pt[] = line([0, ty], [WIDTH, ty]);
  const frac = (x: number) => x / WIDTH;
  const end = reach[reach.length - 1] + 12;
  const to = interpolate(frame, [reach[0] - 10, ...reach, end], [0, ...partnerX.map(frac), 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: y, width: WIDTH, height: BAND_H, background: core.white, opacity: band}} />
      <Thread paths={[path]} to={to} />
      {partners.map((p, i) => {
        if (frame < reach[i]) return null;
        const logo = partnerLogo(p.id);
        const fade = interpolate(frame - reach[i], [0, timing.textIn], [0, 1], {extrapolateRight: 'clamp'});
        return (
          <React.Fragment key={p.id}>
            <Node p={[partnerX[i], ty]} r={11} />
            <div
              style={{position: 'absolute', left: partnerX[i] - col / 2, top: y, width: col, height: BAND_H - 90, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: fade}}
            >
              {logo ? (
                <Img src={staticFile(logo)} style={{maxHeight: LOGO_H, maxWidth: col - 60, objectFit: 'contain'}} />
              ) : (
                <div style={{textAlign: 'center', color: core.black, fontFamily: fontFamily('roman'), fontWeight: fontWeight('roman'), fontSize: NAME_PX, lineHeight: 1.15}}>
                  {wrapBalanced(p.name[lang], 'roman', NAME_PX, col - 60).map((l) => (
                    <div key={l}>{l}</div>
                  ))}
                </div>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

export const partnerBandHeight = BAND_H;
