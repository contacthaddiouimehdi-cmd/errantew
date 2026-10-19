#!/usr/bin/env bash
# Temp 100 BPM beat guide for previews only (NOT the music; the film uses only the licensed track).
# Beat = 0.6 s = 15 frames at 25 fps, phase-locked to frame 0.
# 0–16.2 s soft hats · 16.2 s kick enters (S1 line 4, first hit) · 52.2 s full groove (S4) · 117.2 s silence (packshot).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out/preview
P=0.6
KICK="0.7*sin(2*PI*(45+90*exp(-mod(t,$P)*25))*mod(t,$P))*exp(-mod(t,$P)*9)"
HAT="(random(0)*2-1)*exp(-mod(t+0.3,$P)*70)"
SHAKER="(random(1)*2-1)*exp(-mod(t,0.15)*90)"
EXPR="between(t,0,16.2)*0.05*$HAT + between(t,16.2,117.2)*($KICK + 0.10*$HAT) + between(t,52.2,117.2)*0.04*$SHAKER"
ffmpeg -v error -y -f lavfi -i "aevalsrc=exprs='$EXPR':s=48000:d=120" -ac 2 -af "volume=-6dB" out/preview/beat_guide_100bpm.wav
echo "✓ out/preview/beat_guide_100bpm.wav"
