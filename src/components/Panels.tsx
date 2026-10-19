import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {shot} from '../footageMap';
import {HEIGHT, layout as L, WIDTH} from '../tokens';
import {PlaceholderBox} from './Placeholder';

// Clip from the footage map; a labelled placeholder while the shot is unlogged.
const Clip: React.FC<{id: string; w: number; h: number; from: number; volume?: number}> = ({id, w, h, from, volume = 0}) => {
  const {fps} = useVideoConfig();
  const s = shot(id);
  if (!s) return <PlaceholderBox x={0} y={0} w={w} h={h} title={`Shot · ${id}`} detail="footage pending" />;
  return (
    <OffthreadVideo
      src={staticFile(s.file)}
      startFrom={Math.round(s.in * fps)}
      endAt={Math.round(s.out * fps)}
      volume={volume}
      style={{width: w, height: h, objectFit: 'cover'}}
      key={`${id}-${from}`}
    />
  );
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
  const scale = pushIn ? interpolate(frame - from, [0, duration], [1, 1 + L.panelPushIn], {extrapolateRight: 'clamp'}) : 1;
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

// Horizontal footage at full frame (recap).
export const FullFrame: React.FC<{id: string; opacity?: number; volume?: number}> = ({id, opacity = 1, volume}) => (
  <AbsoluteFill style={{opacity}}>
    <Clip id={id} w={WIDTH} h={HEIGHT} from={0} volume={volume} />
  </AbsoluteFill>
);

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
