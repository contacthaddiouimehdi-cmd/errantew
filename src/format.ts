export type Lang = 'en' | 'fr';

export const NBSP = ' ';

export type NumberFormat = {
  decimals?: number;
  scale?: 'K'; // 190,700 → 190.7K / 190,7 K
  plus?: boolean; // 1,500+
};

// EN: 12,000 · 1,500+ · 190.7K. FR: 12 000 · 1 500+ · 190,7 K (non-breaking spaces).
export const formatNumber = (n: number, lang: Lang, f: NumberFormat = {}): string => {
  const scaled = f.scale === 'K' ? n / 1000 : n;
  const decimals = f.decimals ?? 0;
  const fixed = scaled.toFixed(decimals);
  const [int, dec] = fixed.split('.');
  const group = lang === 'fr' ? NBSP : ',';
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, group);
  const body = dec ? `${grouped}${lang === 'fr' ? ',' : '.'}${dec}` : grouped;
  const suffix = f.scale === 'K' ? (lang === 'fr' ? `${NBSP}K` : 'K') : '';
  return `${body}${suffix}${f.plus ? '+' : ''}`;
};

// French typography: non-breaking space before : ! ? and before %.
export const frTypo = (s: string): string =>
  s.replace(/(\S)[  ]?([:!?%])(?=\s|$|[.,)])/g, `$1${NBSP}$2`);

export const typo = (s: string, lang: Lang): string => (lang === 'fr' ? frTypo(s) : s);
