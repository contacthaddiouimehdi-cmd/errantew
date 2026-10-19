import {Lang, typo} from './format';

// All on-screen text, EN + FR. Source: FGC_VF storytelling (19 Oct 2026), FR is the
// master; EN is the adaptation. {KEY} marks a value from facts.ts.
// French spacing before : ! ? % is applied by typo(), so write plain spaces here.

export type T = {en: string; fr: string};

const t = (en: string, fr: string): T => ({en, fr});

export const tx = (s: T, lang: Lang): string => typo(s[lang], lang);

export const copy = {
  s0: {
    presents: {orange: t('Orange', 'Orange'), presents: t('presents', 'présente')},
    title: t('#ForGoodConnections', '#ForGoodConnections'),
    entity: t('Orange Maroc · 2026', 'Orange Maroc · 2026'),
    category: t('A societal & environmental impact', 'Un impact sociétal et environnemental'),
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
  s4: {
    chapter: t('Season 2 · On tour', 'Saison 2 · En tournée'),
    l13: t('Summer 2026. School’s out. Screens aren’t.', 'Été 2026. L’école ferme. Les écrans, jamais.'),
    l14: t('So we went where kids were: the Orange Talents Festival.', 'Alors on est allés là où étaient les enfants : l’Orange Talents Festival.'),
    words: [t('Football', 'Football'), t('Music', 'Musique'), t('Gaming', 'Gaming')],
    l15: t('7 cities · 7 Saturdays · 6 regions', '7 villes · 7 samedis · 6 régions'),
    fn: t('Football freestyler · multiple world panna champion', 'Freestyler football · multiple champion du monde de panna'),
    l16: t('Our ambassador, at all 7 stages.', 'Notre ambassadeur, sur les 7 étapes.'),
  },
  s5: {
    l17: t('To play, you had to earn it.', 'Pour jouer, il fallait le mériter.'),
    passport: t('The Digital Hero passport', 'Le passeport Digital Hero'),
    // Title and description sit in separate tiles, so each starts with a capital (sentence case).
    m1: {title: t('Mission 1 · CyberBoard', 'Mission 1 · CyberBoard'), desc: t('A board game to prevent cyberbullying', 'Un jeu de plateau pour prévenir le cyberharcèlement')},
    m2: {title: t('Mission 2 · Serious Game', 'Mission 2 · Serious Game'), desc: t('A card game on 6 everyday digital topics', 'Un jeu de cartes sur 6 thèmes numériques du quotidien')},
    unlock: {title: t('Unlocked · Gaming zone', 'Débloqué · Zone gaming')},
    l21: t('Digital Hero: certified.', 'Digital Hero : certifié.'),
    l22: t('Outside the Dome, Orange employee volunteers ran workshops with families.', 'Hors du Dôme, des collaborateurs Orange bénévoles animaient des ateliers avec les familles.'),
    hashtag: t('#EngageForChange', '#EngageForChange'),
    l23: t('Before, during, after: live from every stage on 5 platforms.', 'Avant, pendant, après : en direct de chaque étape sur 5 plateformes.'),
  },
  // Six KPI screens: digital impact first, then the ground, then all year.
  s6: {
    setup: {
      hero: t('{CAMPAIGN_MONTHS} months · {ORGANIC_POSTS} posts · {PLATFORMS} platforms', '{CAMPAIGN_MONTHS} mois · {ORGANIC_POSTS} publications · {PLATFORMS} plateformes'),
      branches: [
        {name: t('Facebook ODC', 'Facebook ODC'), value: t('{POSTS_FB_ODC} posts', '{POSTS_FB_ODC} publications')},
        {name: t('Instagram', 'Instagram'), value: t('{POSTS_IG} posts', '{POSTS_IG} publications')},
        {name: t('Facebook Orange Maroc', 'Facebook Orange Maroc'), value: t('{POSTS_FB_OM_CROSS} cross-posts', '{POSTS_FB_OM_CROSS} crossposts')},
        {name: t('TikTok', 'TikTok'), value: t('{POSTS_TIKTOK} posts', '{POSTS_TIKTOK} publications')},
        {name: t('LinkedIn', 'LinkedIn'), value: t('{POSTS_LINKEDIN} posts', '{POSTS_LINKEDIN} publications')},
      ],
    },
    reach: {
      label: t('organic views & impressions', 'vues et impressions organiques'),
      sub1: t('incl. {VIEWS_IG_FB_OM} views on Instagram + Facebook Orange Maroc', 'dont {VIEWS_IG_FB_OM} vues sur Instagram + Facebook Orange Maroc'),
      sub2: t('{UNIQUE_VIEWERS} unique viewers', '{UNIQUE_VIEWERS} spectateurs uniques'),
    },
    mehdi: {
      kicker: t('Collab · {MEHDI_AMRI_NAME}', 'Collab · {MEHDI_AMRI_NAME}'),
      label: t('views · #1 content of the campaign', 'vues · contenu n°1 de la campagne'),
      sub1: t('{MEHDI_INTERACTION_RATE} interaction, twice the other reels', '{MEHDI_INTERACTION_RATE} d’interaction, le double des autres reels'),
      sub2: t('+ {MICRO_INFLUENCERS} local micro-influencers', '+ {MICRO_INFLUENCERS} micro-influenceurs locaux'),
    },
    platforms: {
      label: t('interactions', 'interactions'),
      tiles: [
        {name: t('TikTok', 'TikTok'), lines: [t('{TIKTOK_RATE} interaction', '{TIKTOK_RATE} d’interaction'), t('the best rate', 'le meilleur taux')]},
        {name: t('LinkedIn', 'LinkedIn'), lines: [t('{LINKEDIN_IMPRESSIONS} impressions', '{LINKEDIN_IMPRESSIONS} impressions'), t('{LINKEDIN_CLICKS} clicks', '{LINKEDIN_CLICKS} clics')]},
        {name: t('Facebook ODC', 'Facebook ODC'), lines: [t('{FB_ODC_VIEWS} views', '{FB_ODC_VIEWS} vues'), t('{FB_ODC_CLICKS} clicks', '{FB_ODC_CLICKS} clics')]},
      ],
    },
    ground: {
      label: t('people reached on site', 'personnes touchées sur place'),
      stats: [
        t('{KIDS} kids on the Digital Hero journey', '{KIDS} enfants sur le parcours Digital Hero'),
        t('{FIELD_TEAM} coaches and Orange volunteers', '{FIELD_TEAM} coachs et bénévoles Orange'),
        t('{CITIES} cities · {REGIONS} regions', '{CITIES} villes · {REGIONS} régions'),
      ],
      press: t('In the press: Le360 · 2M · Hespress', 'Dans la presse : Le360 · 2M · Hespress'),
    },
    year: {
      a: t('{TEACHERS_TRAINED} teachers trained', '{TEACHERS_TRAINED} enseignants formés'),
      b: t('{SCHOOLS_REACHED} middle schools', '{SCHOOLS_REACHED} collèges'),
      lockup: t('One programme · Two seasons', 'Un programme · Deux saisons'),
    },
  },
  s7: {
    // [before, highlighted word, after]
    l24: {
      en: ['Good connections don’t take ', 'holidays', '.'],
      fr: ['Les bonnes connexions ne prennent pas de ', 'vacances', '.'],
    },
    hashtag: t('#ForGoodConnections', '#ForGoodConnections'),
  },
} as const;
