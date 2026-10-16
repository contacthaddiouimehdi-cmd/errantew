/**
 * Orange Maroc — brand DNA for image prompting.
 *
 * Single source of truth shared by the LLM layer (artDirector.js) and the
 * rule-based fallback (fallbackPrompt.js). Edit values here, not in the prompts.
 *
 * NOTE: values are a working interpretation of the Orange brand photography
 * principles (simple, human, warm, a "touch" of orange) applied to Morocco.
 * Check them against the official Orange brand book before going live.
 */

// Orange core + supporting palette (Orange design system values).
const PALETTE = {
  core: { orange: '#FF7900', black: '#000000', white: '#FFFFFF' },
  supporting: {
    blue: '#4BB4E6',
    green: '#50BE87',
    purple: '#A885D8',
    pink: '#FFB4E6',
    yellow: '#FFD200',
  },
};

// How orange may appear in a photo: one natural object, never a filter or a wash.
const ORANGE_TOUCHES = [
  'a single orange notebook resting on the table',
  'an orange cable snaking across the desk',
  'an orange mug catching the light',
  'an orange sticky note among white ones',
  'the orange spine of a book on a shelf',
  'an orange 3D-printed part on the workbench',
  'an orange chair in the background, slightly out of focus',
  'an orange pen clipped to a sketchbook',
  'a strip of orange tape on a cardboard prototype',
];

// The brand's photographic voice, written for the LLM.
const PHOTO_PRINCIPLES_FR = [
  'Simplicité : un seul sujet clair, une composition épurée, beaucoup d\'air.',
  'Authenticité : une vraie scène, un vrai lieu, de vrais matériaux. Jamais l\'esthétique "stock photo" ou "3D render".',
  'Chaleur humaine : la présence humaine se lit par les gestes, les traces, les objets laissés, jamais par un visage.',
  'Optimisme : lumière naturelle, ambiance positive, énergie de l\'apprentissage.',
  'Une touche d\'orange : un seul objet orange présent naturellement dans la scène. L\'orange est un accent, jamais une dominante, jamais un filtre.',
  'Inclusion : le numérique pour tous (enfants, étudiant·e·s, femmes, entrepreneur·e·s, artisans, grand public).',
];

// Modern Morocco, not a postcard. Max ONE cue per image, always subtle.
const MOROCCAN_TOUCHES = {
  architecture: [
    'sunlight filtered through a carved wooden mashrabiya screen, casting a geometric shadow pattern across the table',
    'a smooth tadelakt wall in warm off-white behind the scene',
    'a tall contemporary arched window framing soft Moroccan daylight',
    'a small band of green-and-white zellige tiles on the edge of a modern workspace',
    'a white Casablanca art-deco facade visible through the window, softly blurred',
    'a bright riad-style inner courtyard converted into a modern workspace',
  ],
  materials: [
    'a cedar-wood tabletop with visible grain',
    'a handwoven wool rug with a minimal geometric pattern on the floor',
    'a terracotta pot with a small green plant',
    'a hammered brass detail catching the light',
  ],
  light: [
    'strong, clean Moroccan afternoon sun with crisp shadows',
    'soft Atlantic-coast morning light, slightly hazy',
    'warm late-afternoon light bouncing off white walls',
  ],
};

// Craft x digital metaphors: the creative signature of these visuals.
// Each pairs a Moroccan know-how with a digital skill, purely visually.
const CRAFT_DIGITAL_METAPHORS = [
  { craft: 'zellige', digital: ['design', 'web', 'mobile'], idea: 'zellige tiles assembled like modular UI components or a pixel grid' },
  { craft: 'tissage (métier à tisser)', digital: ['coding', 'cloud', 'data'], idea: 'threads on a loom as lines of code or network connections, one orange thread running through' },
  { craft: 'poterie', digital: ['fablab', 'orange_fab'], idea: 'clay shaped on a wheel next to a 3D-printed piece — from hand-made prototype to digital fabrication' },
  { craft: 'dinanderie / ciselure', digital: ['cybersecurity', 'coding'], idea: 'an intricate chiselled brass lock pattern as a metaphor for encryption layers' },
  { craft: 'marqueterie (thuya)', digital: ['data', 'project_management'], idea: 'inlaid wood pieces fitting together like a dashboard or a sprint plan' },
  { craft: 'calligraphie', digital: ['design', 'ai'], idea: 'a calligraphy reed pen and ink next to a stylus and tablet — the gesture of writing, old and new' },
  { craft: 'mosaïque en construction', digital: ['ai', 'data'], idea: 'scattered mosaic tiles being sorted by colour, like a model learning patterns' },
  { craft: 'cuir (tannerie, maroquinerie)', digital: ['orange_fab', 'mobile'], idea: 'a leather-crafted notebook cover next to a smartphone prototype — craft becoming a product' },
  { craft: 'réparation (souk des réparateurs)', digital: ['repair', 'fablab'], idea: 'neatly laid-out repair tools and an opened device, every screw in its place' },
];

// Things that break the brand or feel generic. Merged into every negative prompt.
const BRAND_NEGATIVES = [
  // people
  'face', 'facial features', 'eyes', 'mouth', 'nose', 'smile', 'full frontal portrait',
  'looking at camera', 'headshot', 'group photo', 'crowd', 'selfie',
  // style
  'cartoon', 'illustration', '3d render', 'cgi', 'plastic look', 'oversaturated',
  'text overlay', 'letters', 'typography', 'watermark', 'logo', 'banner',
  // orange misuse
  'orange color cast', 'orange filter', 'overly orange', 'orange-dominant scene',
  // tech clichés
  'neon', 'cyberpunk', 'binary code floating', 'hologram', 'glowing brain',
  'robot hand touching human hand', 'matrix rain', 'hooded hacker', 'padlock icon',
  // Morocco clichés
  'camel', 'desert dunes', 'souk stall', 'snake charmer', 'tourist postcard',
  'orientalist painting', 'folkloric costume',
];

// ODC Maroc programmes and the audiences they serve.
const PROGRAMS = {
  odc_club: { label: 'ODC Club (université)', audience: 'students', mood: 'énergie de campus, entraide, projets étudiants' },
  ecole_du_code: { label: 'École du Code', audience: 'young_adults', mood: 'concentration, progression, reconversion vers le numérique' },
  fablab: { label: 'FabLab Solidaire', audience: 'makers', mood: 'fabrication, prototypage, faire de ses mains' },
  orange_fab: { label: 'Orange Fab Maroc', audience: 'startups', mood: 'ambition, croissance, partenariats, innovation' },
  super_codeurs: { label: 'Super Codeurs', audience: 'kids', mood: 'jeu, curiosité, couleurs, découverte' },
  master_reparateur: { label: 'Master Réparateur', audience: 'artisans', mood: 'savoir-faire, précision, seconde vie des objets' },
};

// How the audience changes the visual treatment.
const AUDIENCE_DIRECTION = {
  kids: 'Point de vue bas, à hauteur d\'enfant. Objets ludiques et colorés (palette secondaire Orange autorisée : bleu, vert, jaune, rose, violet en petites touches). Petites mains uniquement, jamais d\'enfant identifiable.',
  students: 'Ambiance campus vivante : sacs à dos, cafés, post-its, travail en binôme suggéré par deux paires de mains.',
  young_adults: 'Sérieux et motivant : poste de travail concentré, progression visible (notes, checklists).',
  makers: 'Établi, outils, matières brutes, prototypes imparfaits mais prometteurs.',
  startups: 'Éditorial business premium : pitch, prototypes de produit, tableaux de stratégie, espace de coworking.',
  artisans: 'Respect du geste et de l\'outil, lumière d\'atelier, objets réparés avec soin.',
  women: 'Mains et gestes affirmés, environnement professionnel ambitieux. Éviter tout stéréotype de genre (pas de rose par défaut).',
  general: 'Accueillant et accessible : le numérique comme quelque chose de concret et à portée de main.',
};

const NO_FACE_CLAUSE =
  'No human face is visible anywhere in the image: no eyes, no mouth, no profile, no reflection of a face.';

const NO_TEXT_CLAUSE =
  'There is no readable text, logo, letter or brand mark anywhere in the image; screens show only abstract, blurred interface shapes.';

module.exports = {
  PALETTE,
  ORANGE_TOUCHES,
  PHOTO_PRINCIPLES_FR,
  MOROCCAN_TOUCHES,
  CRAFT_DIGITAL_METAPHORS,
  BRAND_NEGATIVES,
  PROGRAMS,
  AUDIENCE_DIRECTION,
  NO_FACE_CLAUSE,
  NO_TEXT_CLAUSE,
};
