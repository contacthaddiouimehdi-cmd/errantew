import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {fontFamily, fontWeight} from '../fonts';
import {Lang} from '../format';
import {core, illustration, timing} from '../tokens';
import {draw, ease, Pt, roundedRect, slice} from './Thread';

// Flat illustration: black card, orange accents, white type. Supporting colours
// (blue, yellow) appear only on the mission stamps.

export type StampKind = 'm1' | 'm2' | 'unlock';

const W = 460;
const H = 720;
const HEADER = 150;
const R = 78;
export const passportSize = {w: W, h: H};
export const slotY = [HEADER + 112, HEADER + 292, HEADER + 472]; // stamp centres, card coordinates
const slotX = W / 2;

const stampFill: Record<StampKind, string> = {m1: illustration.a, m2: illustration.b, unlock: core.orange};
const stampTilt: Record<StampKind, number> = {m1: -8, m2: 6, unlock: -4};

const Icon: React.FC<{kind: StampKind}> = ({kind}) => {
  if (kind === 'm1') {
    // CyberBoard: a board with two pawns.
    return (
      <g>
        <rect x={-34} y={-34} width={68} height={68} fill={core.white} stroke={core.black} strokeWidth={6} />
        <line x1={0} y1={-34} x2={0} y2={34} stroke={core.black} strokeWidth={4} />
        <line x1={-34} y1={0} x2={34} y2={0} stroke={core.black} strokeWidth={4} />
        <circle cx={-17} cy={-17} r={9} fill={core.black} />
        <circle cx={17} cy={17} r={9} fill={core.orange} />
      </g>
    );
  }
  if (kind === 'm2') {
    // Serious Game: two story cards.
    return (
      <g>
        <rect x={-34} y={-38} width={46} height={66} fill={core.white} stroke={core.black} strokeWidth={5} transform="rotate(-12)" />
        <rect x={-8} y={-30} width={46} height={66} fill={core.white} stroke={core.black} strokeWidth={5} transform="rotate(10)" />
      </g>
    );
  }
  // Gaming zone: a generic controller, no publisher marks.
  return (
    <g>
      <rect x={-42} y={-22} width={84} height={44} rx={22} fill={core.white} />
      <rect x={-30} y={-4} width={20} height={8} fill={core.black} />
      <rect x={-24} y={-10} width={8} height={20} fill={core.black} />
      <circle cx={18} cy={-5} r={5} fill={core.black} />
      <circle cx={28} cy={5} r={5} fill={core.black} />
    </g>
  );
};

// A stamp lands with a hard cut and a 4-frame settle (108% → 100%, ease-out). No bounce.
export const Stamp: React.FC<{kind: StampKind; cx: number; cy: number; at: number}> = ({kind, cx, cy, at}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const s = interpolate(frame - at, [0, timing.stampSettle], [1.08, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${stampTilt[kind]}) scale(${s})`}>
      <circle r={R} fill={stampFill[kind]} />
      <circle r={R - 12} fill="none" stroke={core.white} strokeWidth={4} />
      <Icon kind={kind} />
    </g>
  );
};

const EmptySlot: React.FC<{cy: number; label: 'lock' | string}> = ({cy, label}) => (
  <g transform={`translate(${slotX} ${cy})`}>
    <circle r={R} fill="none" stroke={core.grey} strokeWidth={4} strokeDasharray="12 10" />
    {label === 'lock' ? (
      <g>
        <rect x={-22} y={-6} width={44} height={34} fill={core.white} />
        <path d="M -14 -6 V -18 A 14 14 0 0 1 14 -18 V -6" fill="none" stroke={core.white} strokeWidth={7} />
      </g>
    ) : (
      <text textAnchor="middle" y={22} fill={core.white} fontFamily={fontFamily('bold')} fontWeight={fontWeight('bold')} fontSize={64}>
        {label}
      </text>
    )}
  </g>
);

// Thread-drawn outline of the card, in card coordinates.
const outline = (): Pt[] => roundedRect(3, 3, W - 6, H - 6, 28);

// The thread turns like a key in the lock slot before the gaming zone unlocks.
const Key: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const k = draw(frame, at, 8);
  const turn = ease(frame, at + 8, 10, 0, 90);
  const shaft = 70 * k;
  return (
    <g transform={`translate(${slotX} ${slotY[2]}) rotate(${turn})`}>
      <circle cx={-34} cy={0} r={18} fill="none" stroke={core.orange} strokeWidth={6} strokeDasharray={`${113 * k} 200`} />
      <line x1={-16} y1={0} x2={-16 + shaft} y2={0} stroke={core.orange} strokeWidth={6} strokeLinecap="round" />
      {k >= 1 ? (
        <>
          <line x1={34} y1={0} x2={34} y2={16} stroke={core.orange} strokeWidth={6} strokeLinecap="round" />
          <line x1={20} y1={0} x2={20} y2={12} stroke={core.orange} strokeWidth={6} strokeLinecap="round" />
        </>
      ) : null}
    </g>
  );
};

export const Passport: React.FC<{
  lang: Lang;
  x: number;
  y: number;
  stamps: {m1?: number; m2?: number; unlock?: number}; // frames each stamp lands
  opacity?: number;
  outlineAt?: number; // the thread draws the card outline over 20 frames, then the card fills in
  keyAt?: number; // the thread turns like a key in the lock slot
}> = ({lang, x, y, stamps, opacity = 1, outlineAt, keyAt}) => {
  const frame = useCurrentFrame();
  const landed = (at?: number) => at !== undefined && frame >= at;
  const traced = outlineAt === undefined ? 1 : draw(frame, outlineAt, 20);
  const fill = outlineAt === undefined ? 1 : ease(frame, outlineAt + 18, timing.tileIn);
  const ring = slice(outline(), 0, traced);
  const head = ring[ring.length - 1];
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: x, top: y, opacity, overflow: 'visible'}}>
      <g opacity={fill}>
        <rect x={3} y={3} width={W - 6} height={H - 6} rx={28} fill={core.black} />
        <path d={`M 3 31 A 28 28 0 0 1 31 3 H ${W - 31} A 28 28 0 0 1 ${W - 3} 31 V ${HEADER} H 3 Z`} fill={core.orange} />
        {/* Shield emblem */}
        <path d="M 52 40 H 112 V 80 Q 112 112 82 124 Q 52 112 52 80 Z" fill={core.white} />
        <text x={136} y={78} fill={core.white} fontFamily={fontFamily('bold')} fontWeight={fontWeight('bold')} fontSize={44}>
          Digital Hero
        </text>
        <text x={136} y={118} fill={core.white} fontFamily={fontFamily('roman')} fontWeight={fontWeight('roman')} fontSize={30}>
          {lang === 'fr' ? 'Passeport' : 'Passport'}
        </text>
        {landed(stamps.m1) ? null : <EmptySlot cy={slotY[0]} label="1" />}
        {landed(stamps.m2) ? null : <EmptySlot cy={slotY[1]} label="2" />}
        {landed(stamps.unlock) || (keyAt !== undefined && frame >= keyAt) ? null : <EmptySlot cy={slotY[2]} label="lock" />}
      </g>
      {ring.length > 1 ? (
        <path d={ring.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ')} fill="none" stroke={core.orange} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
      ) : null}
      {traced > 0 && traced < 1 ? <circle cx={head[0]} cy={head[1]} r={8} fill={core.white} stroke={core.orange} strokeWidth={4} /> : null}
      {keyAt !== undefined && !landed(stamps.unlock) ? <Key at={keyAt} /> : null}
      {stamps.m1 !== undefined ? <Stamp kind="m1" cx={slotX} cy={slotY[0]} at={stamps.m1} /> : null}
      {stamps.m2 !== undefined ? <Stamp kind="m2" cx={slotX} cy={slotY[1]} at={stamps.m2} /> : null}
      {stamps.unlock !== undefined ? <Stamp kind="unlock" cx={slotX} cy={slotY[2]} at={stamps.unlock} /> : null}
    </svg>
  );
};
