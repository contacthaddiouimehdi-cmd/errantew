import {formatNumber, Lang, NumberFormat} from './format';

// Single source of truth for every number and name on screen (brief section 4).
// Unconfirmed or null values render as a visible [XX] placeholder in drafts;
// scripts/check-facts.ts fails the final render on any of them, except
// optional slots, which are dropped instead.

export type Fact = {
  value: number | string | null;
  display_en: string | null;
  display_fr: string | null;
  source: string;
  confirmed: boolean;
  optional?: boolean;
  // Present when the value counts up on screen; formatNumber(count.to) must equal the display strings.
  count?: {to: number} & NumberFormat;
};

const num = (to: number, f: NumberFormat, source: string, confirmed: boolean, extra: Partial<Fact> = {}): Fact => ({
  value: to,
  display_en: formatNumber(to, 'en', f),
  display_fr: formatNumber(to, 'fr', f),
  source,
  confirmed,
  count: {to, ...f},
  ...extra,
});

const missing = (source: string, extra: Partial<Fact> = {}): Fact => ({
  value: null,
  display_en: null,
  display_fr: null,
  source,
  confirmed: false,
  ...extra,
});

export const facts = {
  PEOPLE_ON_SITE: num(12000, {}, 'Post-op report: people in direct contact with the FGC space during the festival', true),
  KIDS: num(1500, {plus: true}, 'Post-op report, estimate; 749 documented in forms (69% aged 11–16). Client to confirm which figure to show', false),
  FIELD_TEAM: num(80, {}, '63 coaches/animators + 17 Orange employee volunteers (#EngageForChange)', true),
  CITIES: num(7, {}, 'Agadir, El Jadida, Mehdia, Nador, Tangier, Essaouira, Casablanca', true),
  REGIONS: num(6, {}, 'Souss-Massa, Casablanca-Settat, Rabat-Salé-Kénitra, Oriental, Tanger-Tétouan-Al Hoceima, Marrakech-Safi', true),
  ORGANIC_REACH: num(190700, {scale: 'K', decimals: 1}, '29 organic posts (15 FB ODC, 4 IG, 4 TikTok, 6 LinkedIn); views + impressions incl. 23.4K LinkedIn', true),
  ORGANIC_POSTS: num(29, {}, 'Post-op report: 29 organic posts', true),
  PLATFORMS: num(5, {}, 'Post-op report: 5 platforms', true),
  ORGANIC_REACH_EXTRA: num(309500, {scale: 'K', decimals: 1}, 'Impressions of 2 sponsored Orange Talents posts citing #ForGoodConnections; reported separately, not in the 190.7K. Show only if the client approves', false, {optional: true}),
  PRESS: {value: 'Le360 · 2M · Hespress', display_en: 'Le360 · 2M · Hespress', display_fr: 'Le360 · 2M · Hespress', source: 'Press present at the event, per the report', confirmed: true} as Fact,
  MEHDI_AMRI_NAME: {value: 'Mehdi Amri', display_en: 'Mehdi Amri', display_fr: 'Mehdi Amri', source: 'Report spells it both "Mehdi Amri" and "Mehdi El Amri". Client to confirm', confirmed: false} as Fact,
  TEACHERS_TRAINED: missing('From the ministry programme recap. Announced target was 6,500+ teachers by 2026: a target, never show it as a result'),
  SCHOOLS_REACHED: missing('Same. Announced target was 2,200+ middle schools by 2026'),
  STAT_PROBLEM: missing('A sourced Moroccan cyberbullying statistic, if the client provides one', {optional: true}),
} satisfies Record<string, Fact>;

export type FactKey = keyof typeof facts;

export const isReady = (k: FactKey): boolean => {
  const f: Fact = facts[k];
  return f.value !== null && f.confirmed;
};

export const display = (k: FactKey, lang: Lang): string | null => {
  const f: Fact = facts[k];
  return lang === 'fr' ? f.display_fr : f.display_en;
};

// Tour stops (TOUR_DATES).
export const tour = [
  {en: 'Agadir', fr: 'Agadir', date: '11.07'},
  {en: 'El Jadida', fr: 'El Jadida', date: '18.07'},
  {en: 'Mehdia', fr: 'Mehdia', date: '25.07'},
  {en: 'Nador', fr: 'Nador', date: '01.08'},
  {en: 'Tangier', fr: 'Tanger', date: '08.08'},
  {en: 'Essaouira', fr: 'Essaouira', date: '15.08'},
  {en: 'Casablanca', fr: 'Casablanca', date: '22.08'},
] as const;
