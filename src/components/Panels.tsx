import React from 'react';
import {AbsoluteFill, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {shot, wantedShots} from '../footageMap';
import {HEIGHT, layout as L, WIDTH} from '../tokens';
import {PlaceholderBox} from './Placeholder';

// Clip (or photo) from the footage map; a labelled placeholder while the shot is unlogged.
// Natural sound plays at the select's level unless the caller overrides it.
const Clip: React.FC<{id: string; w: number; h: number; from: number; volume?: number}> = ({id, w, h, volume}) => {
  const s = shot(id);
  if (!s) return <PlaceholderBox x={0} y={0} w={w} h={h} title={wantedShots[id]?.want ?? `Shot · ${id}`} detail={`${id} · footage pending`} />;
  const style = {width: w, height: h, objectFit: 'cover' as const};
  if (s.image) return <Img src={staticFile(s.file)} style={style} />;
  return <OffthreadVideo src={staticFile(s.file)} volume={volume ?? s.volume} style={style} />;
};

// Vertical shot as a clean 600 × 1067 panel on black. Square corners, never stretched,
// never cropped to 16:9. Optional slow push-in, 100% → 104% over the panel's life.
export const VerticalPanel: React.FC<{
  id: string;
  x?: number; // left edge; default centred
  y?: number;
  from?: number; // frame the panel cuts in
  duration?: number; // for the push-in
  pushIn?: boolean;
  opacity?: number;
  volume?: number;
}> = ({id, x = (WIDTH - L.panel.w) / 2, y = (HEIGHT - L.panel.h) / 2, from = 0, duration = 100, pushIn = true, opacity = 1, volume}) => {
  const frame = useCurrentFrame();
  if (frame < from) return null;
  // Placeholders stay unscaled so their outline is not pushed out of the panel.
  const scale = pushIn && shot(id) ? interpolate(frame - from, [0, duration], [1, 1 + L.panelPushIn], {extrapolateRight: 'clamp'}) : 1;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: L.panel.w, height: L.panel.h, overflow: 'hidden', opacity}}>
      <div style={{width: '100%', height: '100%', transform: `scale(${scale})`}}>
        <Clip id={id} w={L.panel.w} h={L.panel.h} from={from} volume={volume} />
      </div>
    </div>
  );
};

// Three 600 × 1067 panels, 20 px gutters, 40 px side margins: fills 1920 exactly.
export const triptychX = [0, 1, 2].map((i) => L.triptych.side + i * (L.panel.w + L.triptych.gutter));

export const Triptych: React.FC<{ids: [string, string, string]; cuts?: [number, number, number]; duration?: number}> = ({
  ids,
  cuts = [0, 0, 0],
  duration = 100,
}) => (
  <>
    {ids.map((id, i) => (
      <VerticalPanel key={i} id={id} x={triptychX[i]} from={cuts[i]} duration={duration} />
    ))}
  </>
);

// Horizontal footage or photo at full frame, with the same slow push-in (100% → 104%).
export const FullFrame: React.FC<{id: string; opacity?: number; volume?: number; duration?: number}> = ({id, opacity = 1, volume, duration = 150}) => {
  const frame = useCurrentFrame();
  const scale = shot(id) ? interpolate(frame, [0, duration], [1, 1 + L.panelPushIn], {extrapolateRight: 'clamp'}) : 1;
  return (
    <AbsoluteFill style={{opacity, overflow: 'hidden'}}>
      <div style={{width: WIDTH, height: HEIGHT, transform: `scale(${scale})`}}>
        <Clip id={id} w={WIDTH} h={HEIGHT} from={0} volume={volume} />
      </div>
    </AbsoluteFill>
  );
};

// Left half: 16:9 recap scaled into the half (960 × 540). Right half: vertical panel.
// The inactive half dims to 40%.
export const SplitScreen: React.FC<{
  leftId: string;
  rightId: string;
  active?: 'left' | 'right' | 'both';
  duration?: number;
}> = ({leftId, rightId, active = 'both', duration = 250}) => {
  const half = WIDTH / 2;
  const lw = half;
  const lh = (half * 9) / 16;
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: (HEIGHT - lh) / 2, width: lw, height: lh, overflow: 'hidden', opacity: active === 'right' ? L.dimmed : 1}}>
        <Clip id={leftId} w={lw} h={lh} from={0} />
      </div>
      <VerticalPanel id={rightId} x={half + (half - L.panel.w) / 2} duration={duration} opacity={active === 'left' ? L.dimmed : 1} />
    </>
  );
};
