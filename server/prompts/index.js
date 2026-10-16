/**
 * Entry point for image-prompt generation. Call this from server/routes/ai.js:
 *
 *   const { generateImagePrompt } = require('../prompts');
 *   const result = await generateImagePrompt(brief);
 *   res.json(result);
 *
 * Tries the LLM art director first, falls back to the rule-based layer on any
 * error (no key, network, invalid JSON). Master Réparateur briefs skip AI.
 */

const { generateWithLLM } = require('./artDirector');
const { generateFallback } = require('./fallbackPrompt');
const { buildContext } = require('./workshopContext');

async function generateImagePrompt(brief, opts = {}) {
  const context = buildContext(brief);
  if (context.skipAI) {
    return { workshop_category: 'repair', skip_ai: true, source: 'real_photos' };
  }

  try {
    return await generateWithLLM(brief, opts);
  } catch (err) {
    if (opts.logger !== false) console.warn(`[prompts] LLM failed, using fallback: ${err.message}`);
    return generateFallback(brief, opts);
  }
}

module.exports = { generateImagePrompt };
