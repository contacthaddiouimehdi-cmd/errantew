/**
 * Layer 2 — rule-based fallback, used when the LLM is unavailable.
 * Same brand data and output shape as the LLM layer, so the frontend sees
 * no difference apart from `source: 'fallback'`.
 */

const brand = require('./orangeMarocBrand');
const { buildContext } = require('./workshopContext');
const { enforceBrandRules, buildNegativePrompt } = require('./artDirector');

// Accurate, photographable subjects per category.
const SUBJECTS = {
  orange_fab: [
    'a cardboard product prototype next to a printed pitch storyboard and a stack of business cards',
    'a strategy wall covered in sticky notes grouped into a business-model canvas',
  ],
  coding: [
    'a laptop showing blurred lines of colourful code beside a paper notebook with a hand-drawn algorithm flowchart',
    'two laptops side by side on a shared desk, cables and a coffee cup between them, a pair-programming setup',
  ],
  data: [
    'a monitor showing blurred bar and line charts, with a printed report covered in highlighted figures',
    'a tablet displaying an abstract dashboard next to a calculator and handwritten KPI notes',
  ],
  design: [
    'paper wireframe sketches spread around a tablet with a stylus and a swatch of colour samples',
    'a mood board of fabric, paper and colour chips pinned above a designer desk',
  ],
  project_management: [
    'a kanban board of sticky notes in columns on a glass wall, a marker resting on the ledge',
    'a planning table with index cards, a timer and a laptop showing a blurred task board',
  ],
  ai: [
    'a laptop showing a blurred chat interface beside a notebook full of prompt drafts and arrows',
    'scattered mosaic tiles being sorted by colour into neat groups next to a laptop, a metaphor for pattern learning',
  ],
  mobile: [
    'several smartphones laid out showing blurred app screens beside paper screen sketches',
    'a hand-drawn app user flow on paper next to a phone on a small stand',
  ],
  web: [
    'a widescreen monitor with a blurred website layout and a sketchbook of page wireframes',
    'a laptop and a phone showing the same blurred responsive layout side by side',
  ],
  fablab: [
    'an Arduino board on a breadboard with jumper wires, a soldering iron and a multimeter on a workbench',
    'a 3D printer finishing a small part, freshly printed pieces lined up beside it',
  ],
  kids: [
    'colourful building blocks and a tablet showing blurred block-based code on a low table',
    'a small wheeled robot kit, coloured cables and stickers on a bright classroom table',
  ],
  cloud: [
    'a server rack with neat cable management and status lights, softly lit',
    'a whiteboard diagram of connected boxes and arrows next to a laptop with a blurred terminal',
  ],
  cybersecurity: [
    'an intricate chiselled brass lock beside a laptop with a blurred terminal window',
    'a desk with a hardware security key, a laptop and a notebook of network diagrams',
  ],
  general: [
    'a bright workshop table with laptops, notebooks and coffee cups just after a session',
    'an open notebook, a laptop and a smartphone arranged on a cedar-wood table',
  ],
};

// Topic-specific subjects win over the category list when the title names the tool.
const TOPIC_SUBJECTS = [
  { match: /arduino|breadboard|capteur/, subject: 'an Arduino board on a breadboard with colourful jumper wires, a few LEDs and sensors on a workbench' },
  { match: /impression 3d|imprimante 3d|3d print/, subject: 'a 3D printer finishing a small part, freshly printed pieces lined up beside it' },
  { match: /raspberry/, subject: 'a Raspberry Pi with a small screen and neatly coiled cables on a wooden bench' },
  { match: /scratch/, subject: 'a tablet showing blurred colourful block-based code next to building blocks on a low table' },
  { match: /python/, subject: 'a laptop showing blurred colourful code beside a notebook with a hand-drawn flowchart' },
  { match: /power bi|dashboard|tableau de bord/, subject: 'a monitor with blurred bar and line charts beside a printed report with highlighted figures' },
  { match: /excel/, subject: 'a laptop with a blurred spreadsheet grid, a calculator and handwritten totals' },
  { match: /figma|maquette|wireframe/, subject: 'paper wireframe sketches spread around a tablet with a stylus' },
  { match: /canva|réseaux sociaux|social media/, subject: 'a phone showing a blurred social post layout next to colour swatches and printed photos' },
  { match: /docker|kubernetes|conteneur/, subject: 'neatly stacked shipping-container models beside a laptop with a blurred terminal' },
  { match: /pitch/, subject: 'a cardboard product prototype next to a printed pitch storyboard and a clicker' },
  { match: /phishing|mot de passe|password/, subject: 'a hardware security key and a phone beside a laptop, a sealed envelope on the desk' },
];

function pickSubject(context, rand) {
  const text = `${context.title} ${context.description}`.toLowerCase();
  const topic = TOPIC_SUBJECTS.find((t) => t.match.test(text));
  return topic ? topic.subject : pick(SUBJECTS[context.category] || SUBJECTS.general, rand);
}

const COMPOSITIONS = {
  flat_lay: 'Shot from directly above as a carefully arranged flat-lay.',
  hands_closeup: 'A close-up at table height, shallow depth of field.',
  environment: 'A wide shot of the space with generous negative space for a title.',
  hero_object: 'A low three-quarter angle that makes the main object the hero of the frame.',
};

const HUMAN_PROSE = {
  no_human: 'There is no person in the frame; the scene feels as if someone just stepped away.',
  hands_only: 'Only the hands of one person are visible, mid-gesture, working on the subject.',
  back_view: 'A single person is seen from behind, focused on the work.',
  foreground_blur: 'A person is heavily blurred in the foreground, out of focus.',
};

function pick(list, rand) {
  return list[Math.floor(rand() * list.length)];
}

function generateFallback(brief, { random = Math.random } = {}) {
  const context = buildContext(brief);
  const subject = pickSubject(context, random);
  const compositionType = pick(Object.keys(COMPOSITIONS), random);
  const humanMode = context.audience === 'kids'
    ? pick(['no_human', 'hands_only'], random)
    : pick(Object.keys(HUMAN_PROSE), random);
  const orangeTouch = pick(brand.ORANGE_TOUCHES, random);
  const moroccanTouch = pick(brand.MOROCCAN_TOUCHES.architecture, random);
  const light = pick(brand.MOROCCAN_TOUCHES.light, random);
  const style = context.category === 'orange_fab'
    ? 'like a premium business magazine editorial'
    : 'like a premium editorial photograph for a tech education magazine';

  const imagePrompt = enforceBrandRules(
    `A natural, realistic editorial photograph illustrating "${context.title}". `
    + `${COMPOSITIONS[compositionType]} The scene is set in a modern Moroccan workspace with ${moroccanTouch}. `
    + `The main subject is ${subject}. ${HUMAN_PROSE[humanMode]} `
    + `A single touch of orange: ${orangeTouch}. The lighting is ${light}. `
    + `The aesthetic is warm, simple and optimistic, ${style}, shot on a 35mm lens with shallow depth of field and natural grain.`,
  );

  return {
    workshop_category: context.category,
    visual_strategy: `Scène concrète de l'atelier « ${context.title} », ancrée dans un Maroc moderne, avec une touche d'orange.`,
    composition_type: compositionType,
    human_presence_mode: humanMode,
    environment: `modern Moroccan workspace with ${moroccanTouch}`,
    main_subject: subject,
    image_prompt: imagePrompt,
    negative_prompt: buildNegativePrompt(),
    design_notes_for_studio: 'Prompt généré sans IA (mode secours). Garder une zone calme pour le titre ; vérifier que la touche orange reste discrète.',
    orange_touch: orangeTouch,
    moroccan_touch: moroccanTouch,
    lighting: light,
    alternatives: [],
    source: 'fallback',
  };
}

module.exports = { generateFallback, SUBJECTS, TOPIC_SUBJECTS };
