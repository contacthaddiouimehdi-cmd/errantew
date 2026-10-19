import {hasAsset, paths} from './assets';

// Shot ids → source file + in/out in seconds of the source (from footage_log.md).
// Empty until the footage is logged; every scene names the shot it wants and
// renders a labelled placeholder panel while the id is unmapped.

export type Shot = {file: string; in: number; out: number; note?: string};

export const footageMap: Record<string, Shot> = {};

export const shot = (id: string): Shot | null => {
  const s = footageMap[id];
  return s && hasAsset(s.file) ? s : null;
};

export const sources = paths;
