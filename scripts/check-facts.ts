// Fails (exit 1) if any fact shown on screen is null or unconfirmed, unless it is
// droppable/optional, in which case the final render drops the lines that carry it.
// Also checks that every count-up lands exactly on its display string.
import {droppable, Fact, facts, isReady, onScreen} from '../src/facts';
import {formatNumber} from '../src/format';

let errors = 0;
for (const key of onScreen) {
  const f: Fact = facts[key];
  if (isReady(key)) {
    console.log(`  ok       ${key} = ${f.display_en} / ${f.display_fr}`);
  } else if (droppable.includes(key) || f.optional) {
    console.log(`  dropped  ${key} (${f.value === null ? 'null' : 'unconfirmed'}): lines carrying it are removed from the final`);
  } else {
    console.error(`  FAIL     ${key} (${f.value === null ? 'null' : 'unconfirmed'}): ${f.source}`);
    errors++;
  }
  if (f.count) {
    for (const lang of ['en', 'fr'] as const) {
      const shown = formatNumber(f.count.to, lang, f.count);
      const expected = lang === 'en' ? f.display_en : f.display_fr;
      if (shown !== expected) {
        console.error(`  FAIL     ${key} count-up ends on "${shown}" but displays "${expected}" (${lang})`);
        errors++;
      }
    }
  }
}
if (errors) {
  console.error(`\ncheck-facts: ${errors} problem(s). Confirm the values in src/facts.ts before the final render.`);
  process.exit(1);
}
console.log('\ncheck-facts: passed.');
