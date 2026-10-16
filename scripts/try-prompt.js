#!/usr/bin/env node
/**
 * Try the prompting system on a brief from the command line.
 *
 *   OPENAI_API_KEY=sk-... node scripts/try-prompt.js "Initiation à Arduino" --audience kids --city Rabat
 *   node scripts/try-prompt.js "Pitch ta startup" --program orange_fab   (no key -> fallback)
 *   node scripts/try-prompt.js "..." --debug   (also prints the system + user messages)
 *   node scripts/try-prompt.js "..." --times 3 (3 runs in one process: checks anti-repetition)
 */

const { generateImagePrompt } = require('../server/prompts');
const { buildSystemPrompt, buildUserMessage, buildCreativeSeed, recentHistory } = require('../server/prompts/artDirector');
const { buildContext } = require('../server/prompts/workshopContext');

function parseArgs(argv) {
  const brief = { title: '' };
  let debug = false;
  let times = 1;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--debug') debug = true;
    else if (arg === '--times') times = Math.max(1, parseInt(argv[++i], 10) || 1);
    else if (arg.startsWith('--')) brief[arg.slice(2)] = argv[++i];
    else brief.title = brief.title ? `${brief.title} ${arg}` : arg;
  }
  return { brief, debug, times };
}

(async () => {
  const { brief, debug, times } = parseArgs(process.argv.slice(2));
  if (!brief.title) {
    console.error('Usage: node scripts/try-prompt.js "<workshop title>" [--description ...] [--program ...] [--audience ...] [--city ...] [--date YYYY-MM-DD] [--debug]');
    process.exit(1);
  }

  if (debug) {
    const context = buildContext(brief);
    console.log('--- CONTEXT ---\n', context);
    console.log('\n--- SYSTEM PROMPT ---\n' + buildSystemPrompt());
    console.log('\n--- USER MESSAGE (example seed) ---\n' + buildUserMessage(context, buildCreativeSeed(context), recentHistory()));
    console.log('\n--- RESULT ---');
  }

  if (times === 1) {
    console.log(JSON.stringify(await generateImagePrompt(brief), null, 2));
    return;
  }

  for (let run = 1; run <= times; run++) {
    const r = await generateImagePrompt(brief);
    console.log(`\n#${run} [${r.source}] ${r.creative_angle || '-'} / ${r.composition_type} / ${r.human_presence_mode} — ${r.concept_title || ''}`);
    console.log(`   subject: ${r.main_subject}`);
    console.log(`   prompt:  ${r.image_prompt}`);
  }
})();
