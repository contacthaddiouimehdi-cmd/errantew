/**
 * Reads a workshop brief and builds a "context card": category, programme,
 * audience, season, city. Fed to the LLM so its concepts fit the real workshop,
 * and used directly by the rule-based fallback.
 *
 * A brief can be a plain title string or an object:
 *   { title, description, program, audience, city, date, format, level }
 * Every field except title is optional; missing ones are inferred.
 */

const { PROGRAMS } = require('./orangeMarocBrand');

// Same categories as server/utils/promptGenerator.js, keyword-detected.
const CATEGORIES = {
  orange_fab: ['startup', 'entrepreneur', 'business', 'pitch', 'levée', 'investisseur', 'business model', 'orange fab', 'incubat', 'accélérat'],
  coding: ['code', 'coding', 'python', 'javascript', 'java', 'react', 'node', 'programmation', 'algorithm', 'git', 'développeur'],
  data: ['data', 'dashboard', 'power bi', 'sql', 'kpi', 'excel', 'analytics', 'tableau', 'statistique', 'visualisation'],
  design: ['design', 'figma', 'canva', 'branding', 'wireframe', 'ui', 'ux', 'maquette', 'graphisme', 'identité visuelle'],
  project_management: ['agile', 'scrum', 'kanban', 'trello', 'notion', 'gestion de projet', 'sprint', 'planning'],
  ai: ['ia', 'ai', 'intelligence artificielle', 'machine learning', 'gpt', 'chatgpt', 'llm', 'prompt', 'deep learning', 'générative'],
  mobile: ['mobile', 'android', 'ios', 'flutter', 'kotlin', 'swift', 'application mobile'],
  web: ['web', 'html', 'css', 'wordpress', 'seo', 'site internet', 'site web', 'e-commerce'],
  fablab: ['fablab', '3d', 'impression 3d', 'arduino', 'raspberry', 'robot', 'électronique', 'découpe laser', 'iot'],
  kids: ['scratch', 'enfant', 'kid', 'initiation', 'super codeurs', 'junior', 'collégien'],
  cloud: ['cloud', 'aws', 'azure', 'docker', 'kubernetes', 'deploy', 'devops', 'serveur'],
  cybersecurity: ['cyber', 'hack', 'pentest', 'firewall', 'kali', 'sécurité', 'phishing', 'mot de passe'],
  repair: ['réparation', 'reparation', 'réparateur', 'master réparateur', 'smartphone repair'],
};

// Category -> default ODC programme when the brief does not name one.
const CATEGORY_PROGRAM = {
  orange_fab: 'orange_fab',
  fablab: 'fablab',
  kids: 'super_codeurs',
  repair: 'master_reparateur',
};

const AUDIENCE_KEYWORDS = {
  kids: ['enfant', 'kid', 'junior', 'collégien', '8-12', '7-14', 'super codeurs'],
  students: ['étudiant', 'etudiant', 'université', 'universite', 'campus', 'odc club', 'école', 'ecole'],
  women: ['femme', 'women', 'entrepreneuse', 'féminin'],
  startups: ['startup', 'entrepreneur', 'porteur de projet', 'fondateur', 'orange fab'],
  makers: ['maker', 'fablab', 'bricol'],
  artisans: ['artisan', 'réparateur', 'coopérative'],
};

function normalize(text) {
  return ` ${String(text || '').toLowerCase()} `;
}

// Short keywords (ia, ui, 3d, sql...) must match whole words, not substrings
// ("ia" inside "initiation").
function hasKeyword(text, word) {
  if (word.length > 3) return text.includes(word);
  return new RegExp(`(^|[^a-z0-9à-ÿ])${word}([^a-z0-9à-ÿ]|$)`).test(text);
}

function detectCategory(text) {
  let best = { key: 'general', score: 0 };
  for (const [key, words] of Object.entries(CATEGORIES)) {
    const score = words.filter((w) => hasKeyword(text, w)).length;
    if (score > best.score) best = { key, score };
  }
  return best.key;
}

function detectAudience(text, program) {
  for (const [key, words] of Object.entries(AUDIENCE_KEYWORDS)) {
    if (words.some((w) => hasKeyword(text, w))) return key;
  }
  return (PROGRAMS[program] && PROGRAMS[program].audience) || 'general';
}

function seasonOf(date) {
  const d = date ? new Date(date) : null;
  if (!d || Number.isNaN(d.getTime())) return null;
  const m = d.getMonth();
  if (m === 11 || m <= 1) return 'winter';
  if (m <= 4) return 'spring';
  if (m <= 7) return 'summer';
  return 'autumn';
}

function buildContext(brief) {
  const b = typeof brief === 'string' ? { title: brief } : { ...(brief || {}) };
  const text = normalize([b.title, b.description, b.program, b.audience, b.level].join(' '));

  const category = detectCategory(text);
  const program = (b.program && PROGRAMS[b.program] ? b.program : null) || CATEGORY_PROGRAM[category] || null;
  const audience = (b.audience && String(b.audience).trim()) || detectAudience(text, program);

  return {
    title: String(b.title || '').trim(),
    description: String(b.description || '').trim(),
    category,
    program,
    programLabel: program ? PROGRAMS[program].label : null,
    programMood: program ? PROGRAMS[program].mood : null,
    audience,
    level: b.level || null,
    city: b.city || null,
    format: b.format || null,
    season: seasonOf(b.date),
    skipAI: category === 'repair', // Master Réparateur uses real photos
  };
}

module.exports = { buildContext, CATEGORIES };
