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

// What each scene needs, for the footage log. v = vertical (Best Of), h = horizontal (recap).
export const wantedShots: Record<string, {o: 'v' | 'h'; want: string}> = {
  's1-phones-1': {o: 'v', want: 'S1 · kids on phones, close'},
  's1-phones-2': {o: 'v', want: 'S1 · kids on phones / screens'},
  's1-crowd-1': {o: 'v', want: 'S1 · kids in the crowd'},
  's1-phones-3': {o: 'v', want: 'S1 · kids on phones, second angle'},
  's2-recap-school': {o: 'h', want: 'S2 left · classroom / school programme'},
  's2-bestof-tour': {o: 'v', want: 'S2 right · festival, kids playing'},
  's3-recap-1': {o: 'h', want: 'S3 · national programme, institutional moment'},
  's3-recap-2': {o: 'h', want: 'S3 · teacher training session'},
  's3-recap-3': {o: 'h', want: 'S3 · middle school, resource team'},
  's4a-crowd': {o: 'v', want: 'S4a triptych · festival crowd'},
  's4a-stage': {o: 'v', want: 'S4a triptych · music stage'},
  's4a-football': {o: 'v', want: 'S4a triptych · football'},
  's4b-tour-1': {o: 'v', want: 'S4b backdrop · tour stage A (25%)'},
  's4b-tour-2': {o: 'v', want: 'S4b backdrop · tour stage B (25%)'},
  's4b-tour-3': {o: 'v', want: 'S4b backdrop · tour stage C (25%)'},
  's4b-tour-4': {o: 'v', want: 'S4b backdrop · tour stage D (25%)'},
  's4b-tour-5': {o: 'v', want: 'S4b backdrop · tour stage E (25%)'},
  's4b-tour-6': {o: 'v', want: 'S4b backdrop · tour stage F (25%)'},
  's4c-mehdi': {o: 'v', want: 'S4c · best Mehdi Amri freestyle'},
  's4d-dome': {o: 'v', want: 'S4d · kids entering / inside the Dome'},
  's4d-cyberboard': {o: 'v', want: 'S4d · kids playing CyberBoard'},
  's4d-seriousgame': {o: 'v', want: 'S4d · kids playing the Serious Game cards'},
  's4d-gaming': {o: 'v', want: 'S4d · gaming zone unlocked (no publisher logos visible)'},
  's4e-workshop-1': {o: 'v', want: 'S4e · family workshop, volunteer in Orange T-shirt'},
  's4e-workshop-2': {o: 'v', want: 'S4e · family workshop, second angle'},
  's4e-workshop-3': {o: 'v', want: 'S4e · volunteers with parents'},
  's4e-live-1': {o: 'v', want: 'S4e · phones filming / live content'},
  's4e-live-2': {o: 'v', want: 'S4e · stories being shot'},
  's4e-live-3': {o: 'v', want: 'S4e · live from the stage'},
  's5-flash-1': {o: 'v', want: 'S5 flash · best smiles'},
  's5-flash-2': {o: 'v', want: 'S5 flash · crowd'},
  's5-flash-3': {o: 'v', want: 'S5 flash · coaches / volunteers'},
  's5-flash-4': {o: 'v', want: 'S5 flash · tour stage'},
  's5-flash-5': {o: 'v', want: 'S5 flash · filming / social'},
  's5-flash-6': {o: 'v', want: 'S5 flash · press / media moment'},
  's5-flash-7': {o: 'v', want: 'S5 flash · Digital Hero certificate moment'},
};
