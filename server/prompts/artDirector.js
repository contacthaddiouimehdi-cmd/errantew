/**
 * Layer 1 — the LLM art director.
 *
 * One OpenAI call turns a workshop brief into 3 distinct visual concepts
 * (faithful / craft x digital / bold), each with a ready-to-use image prompt.
 * The recommended one is returned in the legacy JSON shape the frontend
 * already reads; the other two come back in `alternatives`.
 *
 * Creativity comes from three things the old prompt lacked:
 *   1. a context card (programme, audience, city, season) instead of a bare title,
 *   2. a random "creative seed" picked in code, so two similar briefs diverge,
 *   3. a short memory of recent compositions, so the model stops repeating itself.
 */

const brand = require('./orangeMarocBrand');
const { buildContext } = require('./workshopContext');

const MODEL = process.env.OPENAI_PROMPT_MODEL || 'gpt-4o-mini';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

const COMPOSITION_TYPES = [
  'flat_lay',             // vue du dessus, objets du sujet organisés
  'hero_object',          // un objet emblématique, magnifié
  'environment',          // l'espace de l'atelier, vide mais vivant
  'hands_closeup',        // gros plan sur un geste précis
  'whiteboard',           // schémas, post-its, réflexion en cours
  'contextual_screen',    // écran flouté au cœur d'un contexte riche
  'visual_metaphor',      // un objet poétique qui symbolise le sujet
  'craft_digital',        // artisanat marocain x compétence numérique
  'aftermath',            // la trace : la table juste après l'atelier
  'macro_texture',        // très gros plan sur une matière du sujet
  'unexpected_viewpoint', // reflet, à travers une vitre, plongée, contre-plongée
];

const HUMAN_MODES = ['no_human', 'hands_only', 'back_view', 'over_shoulder', 'silhouette', 'foreground_blur'];

const CREATIVE_ANGLES = ['faithful', 'craft_digital', 'bold'];

// ---------------------------------------------------------------------------
// Anti-monotony memory (in-process; resets on server restart).
// ---------------------------------------------------------------------------
const HISTORY_SIZE = 12;
const history = [];

function remember(entry) {
  history.push(entry);
  if (history.length > HISTORY_SIZE) history.shift();
}

function recentHistory() {
  return history.slice();
}

// ---------------------------------------------------------------------------
// Creative seed: random constraints chosen in code, so the LLM cannot fall
// back on its favourite composition every time.
// ---------------------------------------------------------------------------
function pick(list, rand = Math.random) {
  return list[Math.floor(rand() * list.length)];
}

function buildCreativeSeed(context, rand = Math.random) {
  const recent = new Set(history.slice(-4).map((h) => h.composition_type));
  const freshTypes = COMPOSITION_TYPES.filter((t) => !recent.has(t));
  const metaphors = brand.CRAFT_DIGITAL_METAPHORS.filter((m) => m.digital.includes(context.category));
  const allMoroccan = [...brand.MOROCCAN_TOUCHES.architecture, ...brand.MOROCCAN_TOUCHES.materials];

  return {
    boldComposition: pick(freshTypes.length ? freshTypes : COMPOSITION_TYPES, rand),
    craftMetaphor: pick(metaphors.length ? metaphors : brand.CRAFT_DIGITAL_METAPHORS, rand),
    orangeTouch: pick(brand.ORANGE_TOUCHES, rand),
    moroccanTouch: pick(allMoroccan, rand),
    light: pick(brand.MOROCCAN_TOUCHES.light, rand),
  };
}

// ---------------------------------------------------------------------------
// Prompts
// ---------------------------------------------------------------------------
function buildSystemPrompt() {
  return `Tu es le Directeur Artistique de l'Orange Digital Center Maroc.
Tu transformes le brief d'un atelier en concepts photographiques qui servent de visuels de communication (réseaux sociaux, affiches, site).
Le modèle d'image (gpt-image) comprend mieux les descriptions narratives en phrases complètes que les listes de mots-clés.

=== ADN VISUEL ORANGE MAROC ===
${brand.PHOTO_PRINCIPLES_FR.map((p) => `- ${p}`).join('\n')}

=== LE MAROC D'AUJOURD'HUI, PAS UNE CARTE POSTALE ===
- Le décor est un Maroc moderne, urbain, connecté : coworkings, campus, FabLabs, ateliers lumineux.
- Une seule touche marocaine par image, subtile et naturelle (une ombre de moucharabieh, un mur en tadelakt, une bande de zellige, du bois de cèdre, la lumière du Maroc). Elle peut être absente si elle force la scène.
- INTERDIT : chameaux, dunes, souks touristiques, costumes folkloriques, orientalisme, tout cliché exotique.

=== SIGNATURE CRÉATIVE : ARTISANAT x NUMÉRIQUE ===
Le Maroc a une culture du geste et du motif. Rapproche un savoir-faire marocain d'une compétence numérique quand cela éclaire le sujet :
zellige = composants UI / pixels ; métier à tisser = code ou réseau ; poterie = prototypage / impression 3D ; ciselure du laiton = couches de chiffrement ; marqueterie = tableau de bord ; calligraphie = typographie / design.
La métaphore doit rester lisible et photographiable : de vrais objets, pas d'effet magique.

=== RÈGLE ABSOLUE : ZÉRO VISAGE ===
Aucun visage humain, jamais : ni yeux, ni bouche, ni profil, ni reflet. La présence humaine passe par les mains, le dos, une silhouette, un flou de premier plan, ou les traces laissées (tasse, carnet ouvert, veste sur une chaise).
Pour les enfants : petites mains uniquement, rien qui permette de les identifier.

=== RÈGLE D'OR : ZÉRO TEXTE ===
Aucun texte lisible, logo, lettre ou marque dans l'image. Les écrans montrent des formes d'interface abstraites et floues.

=== FIDÉLITÉ AU SUJET ===
Les objets doivent être exacts pour le sujet : un atelier Arduino montre une vraie carte, des fils, une breadboard ; un atelier Power BI montre des graphiques flous sur écran et des notes chiffrées ; un atelier pitch montre un prototype, des cartes de présentation. Pas d'icônes flottantes, pas d'hologrammes, pas de cerveau lumineux.

=== TES 3 CONCEPTS (obligatoirement différents) ===
1. "faithful" : la scène la plus juste et concrète de l'atelier, celle qu'un participant reconnaîtrait.
2. "craft_digital" : la métaphore Artisanat x Numérique, appuyée sur la piste fournie dans le message.
3. "bold" : l'angle audacieux, avec la composition imposée dans le message, un point de vue inattendu.
Les 3 concepts doivent différer par la composition, le sujet principal ET la présence humaine.
Choisis dans "recommended_index" (0, 1 ou 2) le concept le plus fort pour CET atelier et CE public.

=== RÉDACTION DE "image_prompt" (en ANGLAIS) ===
80 à 140 mots, en phrases complètes, dans cet ordre : type de photo et cadrage ; lieu ; sujet principal et ses détails exacts ; présence humaine ; touche orange ; touche marocaine éventuelle ; lumière ; ambiance. Style : photographie éditoriale réaliste, objectif 35 mm ou 50 mm, faible profondeur de champ, grain naturel.

Réponds uniquement avec le JSON demandé. Champs "visual_strategy", "design_notes_for_studio", "title", "context_reading" en français ; les champs descriptifs de la scène et "image_prompt" en anglais.`;
}

function buildUserMessage(context, seed, recent) {
  const lines = [
    '=== BRIEF DE L\'ATELIER ===',
    `Titre : ${context.title || '(non précisé)'}`,
    context.description && `Description : ${context.description}`,
    `Catégorie détectée : ${context.category}`,
    context.programLabel && `Programme ODC : ${context.programLabel} — ambiance : ${context.programMood}`,
    `Public : ${context.audience} — ${brand.AUDIENCE_DIRECTION[context.audience] || brand.AUDIENCE_DIRECTION.general}`,
    context.level && `Niveau : ${context.level}`,
    context.city && `Ville : ${context.city} (inspire-toi de sa lumière et de son architecture, sans cliché)`,
    context.format && `Format : ${context.format}`,
    context.season && `Saison : ${context.season}`,
    '',
    '=== PISTES CRÉATIVES IMPOSÉES (tirées au sort) ===',
    `Concept "craft_digital" : pars de « ${seed.craftMetaphor.craft} » — ${seed.craftMetaphor.idea}.`,
    `Concept "bold" : composition imposée = ${seed.boldComposition}.`,
    `Touche orange suggérée (au moins un concept) : ${seed.orangeTouch}.`,
    `Touche marocaine suggérée (au moins un concept) : ${seed.moroccanTouch}.`,
    `Lumière suggérée : ${seed.light}.`,
  ];

  if (recent.length) {
    lines.push(
      '',
      '=== DÉJÀ UTILISÉ RÉCEMMENT (à NE PAS répéter) ===',
      ...recent.map((h) => `- ${h.composition_type} : ${h.main_subject}`),
    );
  }

  return lines.filter((l) => l !== null && l !== undefined && l !== false).join('\n');
}

// ---------------------------------------------------------------------------
// Structured-output schema (OpenAI json_schema, strict mode)
// ---------------------------------------------------------------------------
const CONCEPT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'title', 'creative_angle', 'visual_strategy', 'composition_type', 'human_presence_mode',
    'environment', 'main_subject', 'orange_touch', 'moroccan_touch', 'lighting',
    'image_prompt', 'extra_negatives', 'design_notes_for_studio',
  ],
  properties: {
    title: { type: 'string', description: 'Nom court du concept, en français' },
    creative_angle: { type: 'string', enum: CREATIVE_ANGLES },
    visual_strategy: { type: 'string', description: 'Intention créative, en français, 1-2 phrases' },
    composition_type: { type: 'string', enum: COMPOSITION_TYPES },
    human_presence_mode: { type: 'string', enum: HUMAN_MODES },
    environment: { type: 'string', description: 'Lieu, en anglais' },
    main_subject: { type: 'string', description: 'Sujet central, en anglais' },
    orange_touch: { type: 'string', description: "L'objet orange de la scène, en anglais" },
    moroccan_touch: { type: 'string', description: 'La touche marocaine, en anglais, ou "none"' },
    lighting: { type: 'string', description: 'Lumière, en anglais' },
    image_prompt: { type: 'string', description: 'Prompt final complet en anglais, 80-140 mots' },
    extra_negatives: { type: 'array', items: { type: 'string' }, description: 'Éléments à éviter propres à ce concept, en anglais' },
    design_notes_for_studio: { type: 'string', description: 'Conseils au graphiste (zone libre pour le titre, recadrage...), en français' },
  },
};

const RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['workshop_category', 'context_reading', 'recommended_index', 'concepts'],
  properties: {
    workshop_category: { type: 'string' },
    context_reading: { type: 'string', description: "Ce que l'atelier apporte vraiment à son public, en français, 1 phrase" },
    recommended_index: { type: 'integer', description: '0, 1 ou 2' },
    concepts: { type: 'array', items: CONCEPT_SCHEMA, description: 'Exactement 3 concepts : faithful, craft_digital, bold' },
  },
};

// ---------------------------------------------------------------------------
// Post-processing: enforce brand rules even if the model slips.
// ---------------------------------------------------------------------------
function enforceBrandRules(prompt) {
  let out = String(prompt || '').trim();
  if (!/no human face/i.test(out)) out += ` ${brand.NO_FACE_CLAUSE}`;
  if (!/no readable text/i.test(out)) out += ` ${brand.NO_TEXT_CLAUSE}`;
  return out;
}

function buildNegativePrompt(extra = []) {
  return [...new Set([...brand.BRAND_NEGATIVES, ...extra.map((s) => String(s).trim()).filter(Boolean)])].join(', ');
}

function toLegacyShape(concept, context, extras) {
  return {
    workshop_category: context.category,
    visual_strategy: concept.visual_strategy,
    composition_type: concept.composition_type,
    human_presence_mode: HUMAN_MODES.includes(concept.human_presence_mode) ? concept.human_presence_mode : 'no_human',
    environment: concept.environment,
    main_subject: concept.main_subject,
    image_prompt: enforceBrandRules(concept.image_prompt),
    negative_prompt: buildNegativePrompt(concept.extra_negatives),
    design_notes_for_studio: concept.design_notes_for_studio,
    // New fields (ignored by older frontends)
    concept_title: concept.title,
    creative_angle: concept.creative_angle,
    orange_touch: concept.orange_touch,
    moroccan_touch: concept.moroccan_touch,
    lighting: concept.lighting,
    ...extras,
  };
}

function shapeResponse(raw, context) {
  const concepts = Array.isArray(raw.concepts) ? raw.concepts.slice(0, 3) : [];
  if (!concepts.length) throw new Error('LLM returned no concepts');

  const idx = Number.isInteger(raw.recommended_index) && concepts[raw.recommended_index] ? raw.recommended_index : 0;
  const main = concepts[idx];
  const alternatives = concepts
    .filter((_, i) => i !== idx)
    .map((c) => toLegacyShape(c, context, {}));

  return toLegacyShape(main, context, {
    context_reading: raw.context_reading,
    alternatives,
    source: 'llm',
  });
}

// ---------------------------------------------------------------------------
// OpenAI call
// ---------------------------------------------------------------------------
async function callOpenAI(messages, { apiKey, model = MODEL, temperature = 0.9, fetchImpl = fetch } = {}) {
  const res = await fetchImpl(OPENAI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      temperature,
      messages,
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'odc_visual_concepts', strict: true, schema: RESPONSE_SCHEMA },
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`OpenAI ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!content) throw new Error('OpenAI returned an empty message');
  return JSON.parse(content);
}

/**
 * Generate concepts with the LLM. Throws on any failure so the caller can
 * fall back to the rule-based layer.
 */
async function generateWithLLM(brief, opts = {}) {
  const apiKey = opts.apiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set');

  const context = buildContext(brief);
  const seed = buildCreativeSeed(context, opts.random);
  const messages = [
    { role: 'system', content: buildSystemPrompt() },
    { role: 'user', content: buildUserMessage(context, seed, recentHistory()) },
  ];

  const raw = await callOpenAI(messages, { ...opts, apiKey });
  const result = shapeResponse(raw, context);
  remember({ composition_type: result.composition_type, main_subject: result.main_subject });
  return result;
}

module.exports = {
  generateWithLLM,
  // exported for tests and for tweaking from ai.js
  buildSystemPrompt,
  buildUserMessage,
  buildCreativeSeed,
  shapeResponse,
  enforceBrandRules,
  buildNegativePrompt,
  RESPONSE_SCHEMA,
  COMPOSITION_TYPES,
  HUMAN_MODES,
  recentHistory,
};
