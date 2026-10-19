import {getStaticFiles, staticFile} from 'remotion';

// Asset presence is checked against public/ so missing files render as visible
// placeholders instead of broken media.
const files = (): string[] => {
  try {
    return getStaticFiles().map((f) => f.name);
  } catch {
    return [];
  }
};

export const hasAsset = (path: string): boolean => files().includes(path);

export const assetSrc = (path: string): string | null => (hasAsset(path) ? staticFile(path) : null);

// First file in a folder whose name matches the pattern.
export const findAsset = (folder: string, pattern: RegExp): string | null => {
  const hit = files().find((f) => f.startsWith(folder + '/') && pattern.test(f.slice(folder.length + 1)));
  return hit ?? null;
};

export const paths = {
  bestOf: 'footage/bestof_fgc_2026.mp4',
  recap: 'footage/recap_ministere.mp4',
  logo: 'brand/orange_logo_master.png',
  music: 'audio/music.wav',
  sonicLogo: 'audio/orange_sonic_logo.wav',
} as const;

// Partner logos: only approved files from public/brand/partners/. Never drawn.
export const partners = [
  {id: 'ministere', name: {en: 'Ministry of National Education, Preschool and Sports', fr: "Ministère de l'Éducation nationale, du Préscolaire et des Sports"}, short: {en: 'Ministry of National Education', fr: "Ministère de l'Éducation nationale"}},
  {id: 'onde', name: {en: 'ONDE', fr: 'ONDE'}, short: {en: 'ONDE', fr: 'ONDE'}},
  {id: 'dgsn', name: {en: 'DGSN', fr: 'DGSN'}, short: {en: 'DGSN', fr: 'DGSN'}},
  {id: 'add', name: {en: 'ADD', fr: 'ADD'}, short: {en: 'ADD', fr: 'ADD'}},
  {id: 'resis', name: {en: 'ReSIS Centre', fr: 'Centre ReSIS'}, short: {en: 'ReSIS Centre', fr: 'Centre ReSIS'}},
] as const;

export const partnerLogo = (id: string): string | null =>
  findAsset('brand/partners', new RegExp(`^${id}[^/]*\\.(png|svg)$`, 'i'));
