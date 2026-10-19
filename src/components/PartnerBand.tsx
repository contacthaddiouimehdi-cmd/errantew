import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {partnerLogo, partners} from '../assets';
import {fontFamily, fontWeight} from '../fonts';
import {Lang} from '../format';
import {wrapBalanced} from '../measure';
import {core, layout as L, timing, WIDTH} from '../tokens';

// White band holding the approved partner logos at equal optical size, evenly spaced.
// A missing logo is replaced by the partner's name in 55 Roman black; logos are never drawn.
const BAND_H = 240;
const LOGO_H = 120;
const NAME_PX = 32;

export const PartnerBand: React.FC<{lang: Lang; y: number; at: number; out?: number}> = ({lang, y, at, out}) => {
  const frame = useCurrentFrame();
  if (frame < at || (out !== undefined && frame >= out)) return null;
  const opacity = interpolate(frame - at, [0, timing.tileIn], [0, 1], {extrapolateRight: 'clamp'});
  const content = interpolate(frame - at, [timing.textDelay, timing.textDelay + timing.textIn], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const col = (WIDTH - 2 * L.margin) / partners.length;
  return (
    <div style={{position: 'absolute', left: 0, top: y, width: WIDTH, height: BAND_H}}>
      <div style={{position: 'absolute', inset: 0, background: core.white, opacity}} />
      {partners.map((p, i) => {
        const logo = partnerLogo(p.id);
        const cx = L.margin + col * (i + 0.5);
        return (
          <div
            key={p.id}
            style={{position: 'absolute', left: cx - col / 2, top: 0, width: col, height: BAND_H, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: content}}
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
        );
      })}
    </div>
  );
};

export const partnerBandHeight = BAND_H;
