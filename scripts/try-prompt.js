#!/usr/bin/env node
/**
 * Try the prompting system on a brief from the command line.
 *
 *   OPENAI_API_KEY=sk-... node scripts/try-prompt.js "Initiation à Arduino" --audience kids --city Rabat
 *   node scripts/try-prompt.js "Pitch ta startup" --program orange_fab   (no key -> fallback)
 *   node scripts/try-prompt.js "..." --debug   (also prints the system + user messages)
 */

const { generateImagePrompt } = require('../server/prompts');
const { buildSystemPrompt, buildUserMessage, buildCreativeSeed, recentHistory } = require('../server/prompts/artDirector');
const { buildContext } = require('../server/prompts/workshopContext');

function parseArgs(argv) {
  const brief = { title: '' };
  let debug = false;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--debug') debug = true;
    else if (arg.startsWith('--')) brief[arg.slice(2)] = argv[++i];
    else brief.title = brief.title ? `${brief.title} ${arg}` : arg;
  }
  return { brief, debug };
}

(async () => {
  const { brief, debug } = parseArgs(process.argv.slice(2));
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

  const result = await generateImagePrompt(brief);
  console.log(JSON.stringify(result, null, 2));
})();
