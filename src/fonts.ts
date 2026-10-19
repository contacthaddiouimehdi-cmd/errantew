import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import {findAsset} from './assets';
import {font, Weight} from './tokens';

// Licensed Helvetica Neue from public/fonts/. When a file is missing the family
// falls back to the system stack: acceptable for drafts, a blocker for the final.
const sources: Record<Weight, RegExp> = {
  bold: /(75|bold).*\.(otf|ttf|woff2?)$/i,
  roman: /(55|roman|regular).*\.(otf|ttf|woff2?)$/i,
};

const cssWeight: Record<Weight, string> = {bold: '700', roman: '400'};

export const fontFiles = (): Record<Weight, string | null> => ({
  bold: findAsset('fonts', sources.bold),
  roman: findAsset('fonts', sources.roman),
});

let loading: Promise<void> | null = null;

const load = (): Promise<void> => {
  if (loading) return loading;
  const files = fontFiles();
  loading = Promise.all(
    (Object.keys(files) as Weight[]).map(async (w) => {
      const file = files[w];
      if (!file) return;
      const face = new FontFace(font[w], `url(${staticFile(file)})`, {weight: cssWeight[w]});
      await face.load();
      (document.fonts as unknown as {add: (f: FontFace) => void}).add(face);
    }),
  ).then(() => undefined);
  return loading;
};

export const fontFamily = (w: Weight): string => `"${font[w]}", ${font.fallback}`;
export const fontWeight = (w: Weight): number => Number(cssWeight[w]);
export const cssFont = (w: Weight, px: number): string => `${fontWeight(w)} ${px}px ${fontFamily(w)}`;

// Re-renders once fonts are in, so text measurement uses the real metrics.
export const useFontsReady = (): boolean => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender('Loading Helvetica Neue'));
  useEffect(() => {
    load()
      .catch((e) => console.warn('Font load failed, using fallback', e))
      .then(() => document.fonts.ready)
      .then(() => {
        setReady(true);
        continueRender(handle);
      });
  }, [handle]);
  return ready;
};
