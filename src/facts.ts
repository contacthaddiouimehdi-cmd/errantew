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

  // Digital campaign, organic, July–September 2026 (FGC_VF storytelling, section 6).
  CAMPAIGN_MONTHS: num(3, {}, 'FGC_VF: 3 months of campaign (Jul–Sep 2026)', true),
  POSTS_FB_ODC: num(15, {}, 'FGC_VF: 15 Facebook ODC posts', true),
  POSTS_IG: num(4, {}, 'FGC_VF: 4 Instagram posts', true),
  POSTS_FB_OM_CROSS: num(4, {}, 'FGC_VF: the 4 Instagram posts cross-posted on Facebook Orange Maroc', true),
  POSTS_TIKTOK: num(4, {}, 'FGC_VF: 4 TikTok posts', true),
  POSTS_LINKEDIN: num(6, {}, 'FGC_VF: 6 LinkedIn posts', true),
  VIEWS_IG_FB_OM: num(123400, {scale: 'K', decimals: 1}, 'FGC_VF: 123.4K views on Instagram + Facebook Orange Maroc (within the 190.7K)', true),
  UNIQUE_VIEWERS: num(37768, {}, 'FGC_VF: 37,768 unique viewers', true),
  MEHDI_COLLAB_VIEWS: num(42751, {}, 'FGC_VF: Mehdi El Amri collab reel (Série #1), 42,751 views, #1 content of the campaign', true),
  MEHDI_INTERACTION_RATE: num(1.6, {decimals: 1, percent: true}, 'FGC_VF: 1.6% interaction on the Mehdi El Amri collab, double the other reels', true),
  MICRO_INFLUENCERS: num(7, {}, 'FGC_VF: + 7 local micro-influencers', true),
  INTERACTIONS: num(1868, {}, 'FGC_VF: 1,868 interactions', true),
  TIKTOK_RATE: num(2.5, {decimals: 1, percent: true}, 'FGC_VF: TikTok 2.5% interaction, the best rate', true),
  LINKEDIN_IMPRESSIONS: num(23400, {scale: 'K', decimals: 1}, 'FGC_VF: LinkedIn 23.4K impressions', true),
  LINKEDIN_CLICKS: num(3856, {}, 'FGC_VF: LinkedIn 3,856 clicks', true),
  FB_ODC_VIEWS: num(33800, {scale: 'K', decimals: 1}, 'FGC_VF: Facebook ODC 33.8K views', true),
  FB_ODC_CLICKS: num(439, {}, 'FGC_VF: Facebook ODC 439 clicks', true),
  ORGANIC_REACH_EXTRA: num(309500, {scale: 'K', decimals: 1}, 'Impressions of 2 sponsored Orange Talents posts citing #ForGoodConnections; reported separately, not in the 190.7K. Show only if the client approves', false, {optional: true}),
  PRESS: {value: 'Le360 · 2M · Hespress', display_en: 'Le360 · 2M · Hespress', display_fr: 'Le360 · 2M · Hespress', source: 'Press present at the event, per the report', confirmed: true} as Fact,
  MEHDI_AMRI_NAME: {value: 'Mehdi El Amri', display_en: 'Mehdi El Amri', display_fr: 'Mehdi El Amri', source: 'Confirmed by the client on 20 Oct 2026 ("Aamri" in the Drive folders is the same person)', confirmed: true} as Fact,
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

// Results the client may never supply. In the final render they are dropped
// (with the lines that carry them) instead of failing; drafts show [XX].
export const droppable: FactKey[] = ['TEACHERS_TRAINED', 'SCHOOLS_REACHED', 'STAT_PROBLEM', 'ORGANIC_REACH_EXTRA'];

// Whether a value-bearing line is shown: always in drafts (as a placeholder if needed),
// in the final only when confirmed or not droppable (check-facts catches the rest).
export const shows = (keys: FactKey[], final: boolean): boolean =>
  !final || keys.every((k) => isReady(k) || !droppable.includes(k));

// Every fact that can appear on screen (S3 line 12, S4 name super, S6 numbers, S1 slot).
export const onScreen: FactKey[] = [
  'CAMPAIGN_MONTHS',
  'ORGANIC_POSTS',
  'PLATFORMS',
  'POSTS_FB_ODC',
  'POSTS_IG',
  'POSTS_FB_OM_CROSS',
  'POSTS_TIKTOK',
  'POSTS_LINKEDIN',
  'VIEWS_IG_FB_OM',
  'UNIQUE_VIEWERS',
  'MEHDI_COLLAB_VIEWS',
  'MEHDI_INTERACTION_RATE',
  'MICRO_INFLUENCERS',
  'INTERACTIONS',
  'TIKTOK_RATE',
  'LINKEDIN_IMPRESSIONS',
  'LINKEDIN_CLICKS',
  'FB_ODC_VIEWS',
  'FB_ODC_CLICKS',
  'PEOPLE_ON_SITE',
  'KIDS',
  'FIELD_TEAM',
  'CITIES',
  'REGIONS',
  'ORGANIC_REACH',
  'PRESS',
  'MEHDI_AMRI_NAME',
  'TEACHERS_TRAINED',
  'SCHOOLS_REACHED',
  'STAT_PROBLEM',
];
