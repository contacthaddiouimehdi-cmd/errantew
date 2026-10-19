import {Lang, typo} from './format';

// All on-screen text, EN + FR (brief section 3). {KEY} marks a value from facts.ts.
// French spacing before : ! ? % is applied by typo(), so write plain spaces here.

export type T = {en: string; fr: string};

const t = (en: string, fr: string): T => ({en, fr});

export const tx = (s: T, lang: Lang): string => typo(s[lang], lang);

export const copy = {
  s0: {
    presents: {orange: t('Orange', 'Orange'), presents: t('presents', 'présente')},
    title: t('#ForGoodConnections', '#ForGoodConnections'),
    entity: t('Orange Maroc · 2026', 'Orange Maroc · 2026'),
    category: t('Best societal & environmental activation', 'Meilleure activation sociétale et environnementale'),
  },
  s1: {
    l1: t('For kids, the playground is now online.', 'Pour les enfants, la cour de récré est désormais en ligne.'),
    l2: t('So is bullying.', 'Le harcèlement aussi.'),
    l3: t('It doesn’t stop when the bell rings.', 'Il ne s’arrête pas à la sonnerie.'),
    l4: t('And it never takes a summer break.', 'Et il ne prend jamais de vacances.'),
    stat: t('{STAT_PROBLEM}', '{STAT_PROBLEM}'),
  },
  s2: {
    labelSchool: t('Sept → June · At school', 'Sept. → juin · À l’école'),
    labelTour: t('July → Aug · On tour', 'Juil. → août · En tournée'),
    l5: t('So protection had to work all year round.', 'La protection devait donc tenir toute l’année.'),
    l6: t('At school, with the Ministry.', 'À l’école, avec le Ministère.'),
    l7: t('In summer, where kids play.', 'L’été, là où les enfants jouent.'),
    l8: t('One programme. Two seasons.', 'Un programme. Deux saisons.'),
  },
  s3: {
    chapter: t('Season 1 · At school', 'Saison 1 · À l’école'),
    l9: t('A national programme against bullying and cyberbullying.', 'Un programme national contre le harcèlement et le cyberharcèlement.'),
    builtWith: t('Built with', 'Construit avec'),
    l10: t('Teachers trained to spot, prevent and handle bullying.', 'Des enseignants formés pour repérer, prévenir et traiter le harcèlement.'),
    l11: t('Resource teams inside middle schools.', 'Des équipes ressources au cœur des collèges.'),
    l12a: t('{TEACHERS_TRAINED} teachers trained', '{TEACHERS_TRAINED} enseignants formés'),
    l12b: t('{SCHOOLS_REACHED} middle schools', '{SCHOOLS_REACHED} collèges'),
  },
  s4a: {
    chapter: t('Season 2 · On tour', 'Saison 2 · En tournée'),
    l13: t('Summer 2026. School’s out. Screens aren’t.', 'Été 2026. L’école ferme. Les écrans, jamais.'),
    l14: t('So we went where kids were: the Orange Talents Festival.', 'Alors on est allés là où étaient les enfants : l’Orange Talents Festival.'),
    words: [t('Football', 'Football'), t('Music', 'Musique'), t('Gaming', 'Gaming')],
  },
  s4b: {
    l15: t('7 cities · 7 Saturdays · 6 regions', '7 villes · 7 samedis · 6 régions'),
  },
  s4c: {
    name: t('{MEHDI_AMRI_NAME}', '{MEHDI_AMRI_NAME}'),
    fn: t('Football freestyler · multiple world panna champion', 'Freestyler football · multiple champion du monde de panna'),
    l16: t('Our ambassador, at all 7 stages.', 'Notre ambassadeur, sur les 7 étapes.'),
  },
  s4d: {
    l17: t('To play, you had to earn it.', 'Pour jouer, il fallait le mériter.'),
    passport: t('The Digital Hero passport', 'Le passeport Digital Hero'),
    // Title and description sit in separate tiles, so each starts with a capital (sentence case).
    m1: {title: t('Mission 1 · CyberBoard', 'Mission 1 · CyberBoard'), desc: t('A board game to prevent cyberbullying', 'Un jeu de plateau pour prévenir le cyberharcèlement')},
    m2: {title: t('Mission 2 · Serious Game', 'Mission 2 · Serious Game'), desc: t('A story card game on 6 everyday digital topics', 'Un jeu de cartes narratif sur 6 thèmes numériques du quotidien')},
    unlock: {title: t('Unlocked · Gaming zone', 'Débloqué · Zone gaming')},
    l21: t('Digital Hero: certified.', 'Digital Hero : certifié.'),
  },
  s4e: {
    l22: t('Outside the Dome, Orange volunteers ran safety workshops with families.', 'Hors du Dôme, des collaborateurs Orange bénévoles animaient des ateliers avec les familles.'),
    hashtag: t('#EngageForChange', '#EngageForChange'),
    l23: t('Before, during, after: live from every stage on 5 platforms.', 'Avant, pendant, après : en direct de chaque étape sur 5 plateformes.'),
  },
  s5: {
    r1: t('people reached on site', 'personnes touchées sur place'),
    r2: t('kids on the Digital Hero journey', 'enfants sur le parcours Digital Hero'),
    r3: t('coaches and Orange volunteers on the ground', 'coachs et bénévoles Orange sur le terrain'),
    r4: t('cities · regions', 'villes · régions'),
    r5: t('organic views & impressions · 29 posts · 5 platforms', 'vues et impressions organiques · 29 publications · 5 plateformes'),
    r6: t('In the press: Le360 · 2M · Hespress', 'Dans la presse : Le360 · 2M · Hespress'),
    r7: t('teachers trained · middle schools, all year', 'enseignants formés · collèges, toute l’année'),
    lockupA: t('One programme · Two seasons', 'Un programme · Deux saisons'),
    lockupTeachers: t('{TEACHERS_TRAINED} teachers', '{TEACHERS_TRAINED} enseignants'),
    lockupKids: t('{KIDS} kids', '{KIDS} enfants'),
    lockupPeople: t('{PEOPLE_ON_SITE} people', '{PEOPLE_ON_SITE} personnes'),
  },
  s6: {
    // [before, highlighted word, after]
    l24: {
      en: ['Good connections don’t take ', 'holidays', '.'],
      fr: ['Les bonnes connexions ne prennent pas de ', 'vacances', '.'],
    },
    hashtag: t('#ForGoodConnections', '#ForGoodConnections'),
  },
} as const;
