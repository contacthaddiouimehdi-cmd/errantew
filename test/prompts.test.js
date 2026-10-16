const { test } = require('node:test');
const assert = require('node:assert/strict');

const { buildContext } = require('../server/prompts/workshopContext');
const artDirector = require('../server/prompts/artDirector');
const { generateFallback } = require('../server/prompts/fallbackPrompt');
const { generateImagePrompt } = require('../server/prompts');

const seeded = (seed = 1) => () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};

function concept(overrides = {}) {
  return {
    title: 'Le métier à tisser du code',
    creative_angle: 'craft_digital',
    visual_strategy: 'Relier le tissage au code.',
    composition_type: 'craft_digital',
    human_presence_mode: 'hands_only',
    environment: 'a bright Rabat co-working space',
    main_subject: 'a loom with an orange thread next to a laptop',
    orange_touch: 'one orange thread',
    moroccan_touch: 'cedar-wood table',
    lighting: 'soft morning light',
    image_prompt: 'An editorial photograph of a loom beside a laptop.',
    extra_negatives: ['tangled mess'],
    design_notes_for_studio: 'Titre en haut à gauche.',
    ...overrides,
  };
}

function mockFetch(payload, calls = []) {
  return async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body) });
    return { ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify(payload) } }] }) };
  };
}

test('context: detects category, programme and audience', () => {
  const kids = buildContext({ title: 'Initiation à Scratch pour enfants' });
  assert.equal(kids.category, 'kids');
  assert.equal(kids.program, 'super_codeurs');
  assert.equal(kids.audience, 'kids');

  const fab = buildContext('Pitch ta startup devant des investisseurs');
  assert.equal(fab.category, 'orange_fab');
  assert.equal(fab.audience, 'startups');

  assert.equal(buildContext('Atelier Réparation de smartphones').skipAI, true);
});

test('context: short keywords match whole words only', () => {
  // "initiation" contains "ia" but is not an AI workshop
  assert.notEqual(buildContext('Initiation au tricot numérique').category, 'ai');
  assert.equal(buildContext("Découvrir l'IA générative").category, 'ai');
});

test('system prompt carries the Orange Maroc rules', () => {
  const sp = artDirector.buildSystemPrompt();
  for (const rule of ['ZÉRO VISAGE', 'ZÉRO TEXTE', 'ARTISANAT x NUMÉRIQUE', 'CARTE POSTALE', 'faithful', 'craft_digital', 'bold']) {
    assert.ok(sp.includes(rule), `missing: ${rule}`);
  }
});

test('LLM path: sends strict json_schema and returns legacy shape + alternatives', async () => {
  const calls = [];
  const payload = {
    workshop_category: 'coding',
    context_reading: 'Apprendre à coder pour se reconvertir.',
    recommended_index: 1,
    concepts: [
      concept({ creative_angle: 'faithful', composition_type: 'contextual_screen', title: 'A' }),
      concept({ title: 'B' }),
      concept({ creative_angle: 'bold', composition_type: 'unexpected_viewpoint', title: 'C' }),
    ],
  };

  const result = await artDirector.generateWithLLM(
    { title: 'Python pour débutants', city: 'Rabat' },
    { apiKey: 'test', fetchImpl: mockFetch(payload, calls), random: seeded() },
  );

  const body = calls[0].body;
  assert.equal(body.response_format.type, 'json_schema');
  assert.equal(body.response_format.json_schema.strict, true);
  assert.match(body.messages[1].content, /Ville : Rabat/);

  // legacy fields the frontend already reads
  for (const key of ['workshop_category', 'visual_strategy', 'composition_type', 'human_presence_mode',
    'environment', 'main_subject', 'image_prompt', 'negative_prompt', 'design_notes_for_studio']) {
    assert.ok(result[key], `missing ${key}`);
  }
  assert.equal(result.concept_title, 'B');
  assert.equal(result.source, 'llm');
  assert.equal(result.alternatives.length, 2);
  assert.match(result.image_prompt, /No human face/);
  assert.match(result.image_prompt, /no readable text/);
  assert.match(result.negative_prompt, /tangled mess/);
  assert.match(result.negative_prompt, /camel/);
});

test('LLM path: remembers recent compositions and lists them next time', async () => {
  const payload = { workshop_category: 'data', context_reading: '-', recommended_index: 0, concepts: [concept({ composition_type: 'macro_texture', main_subject: 'brass lock macro' })] };
  await artDirector.generateWithLLM('Power BI', { apiKey: 'k', fetchImpl: mockFetch(payload) });

  const calls = [];
  await artDirector.generateWithLLM('Power BI avancé', { apiKey: 'k', fetchImpl: mockFetch(payload, calls) });
  assert.match(calls[0].body.messages[1].content, /DÉJÀ UTILISÉ RÉCEMMENT[\s\S]*macro_texture : brass lock macro/);
});

test('shapeResponse: invalid recommended index and human mode are corrected', () => {
  const ctx = buildContext('Figma');
  const r = artDirector.shapeResponse(
    { context_reading: '', recommended_index: 7, concepts: [concept({ human_presence_mode: 'full_face' })] },
    ctx,
  );
  assert.equal(r.human_presence_mode, 'no_human');
  assert.equal(r.alternatives.length, 0);
  assert.throws(() => artDirector.shapeResponse({ concepts: [] }, ctx));
});

test('fallback: same shape, brand clauses, kids never get back_view', () => {
  for (let s = 1; s < 30; s++) {
    const r = generateFallback({ title: 'Super Codeurs : mon premier jeu', audience: 'kids' }, { random: seeded(s) });
    assert.ok(['no_human', 'hands_only'].includes(r.human_presence_mode));
    assert.match(r.image_prompt, /No human face/);
    assert.equal(r.source, 'fallback');
  }
});

test('fallback: the tool named in the title drives the subject', () => {
  const r = generateFallback('Initiation à Arduino', { random: seeded(3) });
  assert.match(r.main_subject, /Arduino/);
});

test('entry point: falls back without a key, skips AI for repair', async () => {
  const saved = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  try {
    const r = await generateImagePrompt('Docker et Kubernetes', { logger: false });
    assert.equal(r.source, 'fallback');
    assert.equal(r.workshop_category, 'cloud');
    assert.equal((await generateImagePrompt('Master Réparateur')).skip_ai, true);
  } finally {
    if (saved !== undefined) process.env.OPENAI_API_KEY = saved;
  }
});
