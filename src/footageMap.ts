import {hasAsset, paths} from './assets';

// Shot ids → source file + in/out in seconds of the source (from footage_log.md).
// Every scene names the shot it wants; until an id is mapped here and its file is
// present, the scene renders a labelled placeholder panel.

export type Shot = {file: string; in: number; out: number; note?: string};

export const footageMap: Record<string, Shot> = {};

export const shot = (id: string): Shot | null => {
  const s = footageMap[id];
  return s && hasAsset(s.file) ? s : null;
};

export const sources = paths;

// What each scene needs (FGC_VF storytelling), for the footage log and the placeholders.
// v = vertical (Best Of), h = horizontal (ministry recap).
export const wantedShots: Record<string, {o: 'v' | 'h'; want: string}> = {
  's1-phone-1': {o: 'v', want: 'A kid on their phone · notification sounds'},
  's1-phone-2': {o: 'v', want: 'Kids on phones, second angle'},
  's1-crowd-1': {o: 'v', want: 'Kids, crowd · real school bell'},
  's1-crowd-2': {o: 'v', want: 'Kids in the crowd, neutral or smiling faces'},
  's2-recap-school': {o: 'h', want: 'Ministry recap · school programme'},
  's2-bestof-tour': {o: 'v', want: 'Best Of · festival, kids playing'},
  's3-recap-1': {o: 'h', want: 'Ministry recap, full frame · the national programme'},
  's3-recap-2': {o: 'h', want: 'Teacher training · speech extract (name super if someone speaks)'},
  's4-crowd': {o: 'v', want: 'Festival crowd'},
  's4-stage': {o: 'v', want: 'Music stage'},
  's4-football': {o: 'v', want: 'Football'},
  's4-crowd-2': {o: 'v', want: 'Crowd, cut on the beat'},
  's4-stage-2': {o: 'v', want: 'Stage, cut on the beat'},
  's4-football-2': {o: 'v', want: 'Football, cut on the beat'},
  's4-gaming': {o: 'v', want: 'Gaming (no publisher logos visible)'},
  's4-tour-1': {o: 'v', want: 'Tour stage A (25% behind the route)'},
  's4-tour-2': {o: 'v', want: 'Tour stage B (25%)'},
  's4-tour-3': {o: 'v', want: 'Tour stage C (25%)'},
  's4-mehdi': {o: 'v', want: 'Mehdi Amri freestyle · the thread follows the ball'},
  's5-dome': {o: 'v', want: 'Kids entering the Orange Dome'},
  's5-cyberboard': {o: 'v', want: 'Kids playing CyberBoard'},
  's5-seriousgame': {o: 'v', want: 'Kids playing the Serious Game cards'},
  's5-gaming': {o: 'v', want: 'Gaming zone unlocked · cheers'},
  's5-certificates': {o: 'v', want: 'Digital Hero certificates handed out'},
  's5-workshop-1': {o: 'v', want: 'Orange volunteers with families'},
  's5-workshop-2': {o: 'v', want: 'Family workshop, second angle'},
  's5-workshop-3': {o: 'v', want: 'Volunteers in Orange T-shirts'},
  's5-live-1': {o: 'v', want: 'Phones filming'},
  's5-live-2': {o: 'v', want: 'Stories shot live'},
  's5-live-3': {o: 'v', want: 'Live from the stage'},
  's6-mehdi-reel': {o: 'v', want: 'Reel Série #1 · Mehdi Amri collab (excerpt)'},
  's6-flash-1': {o: 'v', want: 'Field flash · smiles'},
  's6-flash-2': {o: 'v', want: 'Field flash · crowd'},
  's6-flash-3': {o: 'v', want: 'Field flash · phones, social'},
  's6-flash-4': {o: 'v', want: 'Field flash · coaches and volunteers'},
  's6-flash-5': {o: 'v', want: 'Field flash · certificates'},
};
