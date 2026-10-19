// Orange Group "Video graphic design" guidelines (Dec 2021), as tokens.
// Every colour, size and timing used on screen comes from here.

export const FPS = 25;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION = 3000;

// Music territory: 100 BPM → one beat every 15 frames at 25 fps. Cuts and hits sit on this grid.
export const BPM = 100;
export const BEAT = (60 / BPM) * FPS;

// Core colours. Text may only use orange, black or white.
export const core = {
  orange: '#FF7900',
  black: '#000000',
  white: '#FFFFFF',
  grey: '#8F8F8F',
} as const;

// Supporting colours: illustrations only, max two per setting.
export const supporting = {
  blue: '#4BB4E6',
  yellow: '#FFD200',
  green: '#50BE87',
  purple: '#A885D8',
  pink: '#FFB4E6',
} as const;

// Illustration-only tints, never backgrounds, never without their supporting colour.
export const tints = {
  light: {yellow: '#FFF6B6', blue: '#B5E8F7', green: '#B8EBD6', purple: '#D9C2F0', pink: '#FFE8F7'},
  // The PDF prints dark blue as "#F085EBD"; RGB 8/94/189 is #085EBD.
  dark: {yellow: '#FFB400', blue: '#085EBD', green: '#0A6E31', purple: '#492191', pink: '#FF8AD4'},
} as const;

// The film's supporting pair, used only inside illustrations (passport, stamps).
export const illustration = {
  a: supporting.blue,
  b: supporting.yellow,
} as const;

export type TextColour = 'orange' | 'black' | 'white';
export type TileColour = 'orange' | 'black' | 'white' | 'grey';

// Legal text colour on each tile colour (white on yellow is never used; yellow is never a tile).
export const textOn: Record<TileColour, TextColour[]> = {
  orange: ['white', 'black'],
  black: ['white', 'orange'],
  white: ['black', 'orange'],
  grey: ['white', 'black'],
};

// Type: Helvetica Neue 75 Bold for headlines, names, places, numbers; 55 Roman for the rest.
export const font = {
  bold: 'FGC Helvetica Neue 75',
  roman: 'FGC Helvetica Neue 55',
  // Drafts only, when the licensed files are absent from public/fonts/.
  // FreeSans is a Helvetica clone present in the render container; real Helvetica Neue is aliased to Inter there.
  fallback: 'FreeSans, "Helvetica Neue", Helvetica, Arial, sans-serif',
} as const;

export type Weight = 'bold' | 'roman';

// Sizes at 1080p.
export const size = {
  heroNumber: 200,
  headline: 96,
  super: 64,
  label: 48,
  labelSmall: 40,
  name: 44,
  fn: 32,
  subtitle: 42,
} as const;

// Motion, in frames at 25 fps ("i" in the guidelines).
export const timing = {
  tileIn: 8, // tile fades in over 8 frames
  textDelay: 4, // text starts on the 5th frame of the tile fade
  textIn: 4, // text fades in over 4 frames
  stackSettle: 4, // second tile of a stack cuts in and settles within 4 frames
  out: 8, // fade out over 8 frames (or hard cut)
  logoFade: 10, // packshot logo fade in / out
  hold: 50, // default hold of a one-line super after its in-animation
  countUp: 20,
  stampSettle: 4,
  stackGap: 6, // frames between cut-ins of successive tiles in a reveal
} as const;

// Layout.
export const layout = {
  margin: 96, // side margins
  titleSafeY: 54, // 5% of 1080
  panel: {w: 600, h: 1067},
  triptych: {gutter: 20, side: 40}, // 40 + 3×600 + 2×20 + 40 = 1920
  panelPushIn: 0.04, // 100% → 104% over the panel's duration, no faster
  routeStroke: 6,
  logoHeight: 360, // 1/3 of frame height
  dimmed: 0.4, // inactive half of the split screen
  routeBackdrop: 0.25, // tour shots behind the route
} as const;

// Clear space fallbacks when the "o" cannot be measured.
export const clearSpaceFallback = {x: 0.57, y: 0.35} as const;
