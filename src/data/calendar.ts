export interface GloranthanSeason {
  id: string;
  name: string;
  englishName: string;
  element: string;
  rune: string;
  description: string;
  weeksCount: number;
}

export interface GloranthanWeek {
  name: string;
  rune: string;
}

export interface GloranthanDay {
  name: string;
  englishName: string;
  associatedGod: string;
  description: string;
}

export const SEASONS: GloranthanSeason[] = [
  {
    id: 'sea',
    name: 'Saison de la Mer',
    englishName: 'Sea Season',
    element: 'Eau',
    rune: 'Eau',
    description: 'Le dégel printanier, les pluies fécondantes, le renouveau de la vie dans les vallées et les plaines.',
    weeksCount: 8,
  },
  {
    id: 'fire',
    name: 'Saison du Feu',
    englishName: 'Fire Season',
    element: 'Feu',
    rune: 'Feu',
    description: 'La chaleur étouffante de l\'été, le soleil brûlant de Yelm au zénith, la saison des campagnes militaires et des voyages.',
    weeksCount: 8,
  },
  {
    id: 'earth',
    name: 'Saison de la Terre',
    englishName: 'Earth Season',
    element: 'Terre',
    rune: 'Terre',
    description: 'Le temps des grandes moissons d\'Ernalda, des vendanges, des fêtes de la bière et du stockage pour l\'hiver.',
    weeksCount: 8,
  },
  {
    id: 'darkness',
    name: 'Saison de l\'Obscurité',
    englishName: 'Darkness Season',
    element: 'Ténèbres',
    rune: 'Ténèbres',
    description: 'Le grand froid, les nuits sans fin, la montée des créatures de l\'Ombre et des Trolls.',
    weeksCount: 8,
  },
  {
    id: 'storm',
    name: 'Saison des Tempêtes',
    englishName: 'Storm Season',
    element: 'Air',
    rune: 'Air',
    description: 'Les ouragans et les colères d\'Orlanth, les vents violents et la neige déchaînée sur les pics de Kero Fin.',
    weeksCount: 8,
  },
  {
    id: 'sacred',
    name: 'Saison Sacrée (Temps Sacré)',
    englishName: 'Sacred Time',
    element: 'Chaos & Renaissance',
    rune: 'Magie',
    description: 'Les 2 semaines saintes hors du temps où le Grand Compromis cosmique est rejoué par les rituels des cultes.',
    weeksCount: 2,
  },
];

export const DAYS_OF_WEEK: GloranthanDay[] = [
  { name: 'Jour du Gel', englishName: 'Freezingday', associatedGod: 'Valind / Ténèbres', description: 'Jour propice aux affaires sérieuses, à la chasse et aux dieux du froid.' },
  { name: 'Jour de l\'Eau', englishName: 'Waterday', associatedGod: 'Magasta / Eau', description: 'Jour du nettoyage, de la navigation et des rituels fluviaux.' },
  { name: 'Jour de l\'Argile', englishName: 'Clayday', associatedGod: 'Ernalda / Terre', description: 'Jour des artisans, du travail de la terre et des cultes féminins.' },
  { name: 'Jour des Vents', englishName: 'Windsday', associatedGod: 'Orlanth / Air', description: 'Jour de repos pour les Heortiens, fête des guerriers et des oracles.' },
  { name: 'Jour du Feu', englishName: 'Fireday', associatedGod: 'Yelm / Feu', description: 'Jour des conseils tribaux, de la justice et de l\'éclairage des autels.' },
  { name: 'Jour Sauvage', englishName: 'Wildday', associatedGod: 'Urox / Bêtes', description: 'Jour imprévisible, célébrations sauvages, chasses au chaos.' },
  { name: 'Jour des Dieux', englishName: 'Godday', associatedGod: 'Le Panthéon', description: 'Le grand jour saint hebdomadaire de culte, de sacrifice et de magie.' },
];

export const WEEKS_NAMES: GloranthanWeek[] = [
  { name: 'Semaine du Désordre', rune: 'Désaccord' },
  { name: 'Semaine de l\'Harmonie', rune: 'Harmonie' },
  { name: 'Semaine de la Mort', rune: 'Mort' },
  { name: 'Semaine de la Fertilité', rune: 'Fertilité' },
  { name: 'Semaine de la Stase', rune: 'Stase' },
  { name: 'Semaine du Mouvement', rune: 'Mouvement' },
  { name: 'Semaine de l\'Illusion', rune: 'Illusion' },
  { name: 'Semaine de la Vérité', rune: 'Vérité' },
];

export const LUNAR_PHASES = [
  { name: 'Lune Noire (Mourante)', effect: 'Magie lunaire affaiblie (-20%), magie orlanthie puissante' },
  { name: 'Lune Croissante', effect: 'Magie lunaire normale' },
  { name: 'Pleine Lune Rousse', effect: 'Magie lunaire à son apogée (+20%), illumination aisée' },
  { name: 'Lune Décroissante', effect: 'Magie lunaire normale' },
];

export function generateRandomWeather(seasonId: string): { weather: string; wind: string; omen: string } {
  const weathers: { [key: string]: string[] } = {
    sea: ['Pluie fine vivifiante', 'Ciel doux et brumes matinales', 'Averse torrentielle de printemps', 'Brise tiède et rosée abondante'],
    fire: ['Soleil implacable et ciel d\'azur', 'Chaleur écrasante et mirages', 'Orage de chaleur sec', 'Temps sec et poussiéreux'],
    earth: ['Temps doux et brumes d\'or', 'Ciel nuageux et vent tiède', 'Pluie d\'automne bienfaisante', 'Fraîcheur des soirs de récolte'],
    darkness: ['Givre mordant et brouillard épais', 'Chute de neige lourde', 'Nuit glaciale sans lune', 'Bruine glacée et sol pétrifié'],
    storm: ['Ouragan déchaîné et tonnerre sourd', 'Bourrasques de neige violentes', 'Pluie battante et éclairs d\'Orlanth', 'Rafales glacées'],
    sacred: ['Ciel irisé aux aurores mystiques', 'Temps suspendu et silence surnaturel', 'Éclairs célestes sans nuages', 'Lumière dorée surnaturelle'],
  };

  const winds = ['Brise légère', 'Vent modéré du Sud', 'Vents violents d\'Orlanth du Nord', 'Calme plat mystique', 'Bourrasque tourbillonnante'];
  const omens = [
    'Un vol de corbeaux sacrés traverse le ciel vers l\'Ouest.',
    'Une odeur d\'ozone et de terre mouillée emplit l\'air.',
    'Les runes gravées sur les pierres du clan luisent d\'une faible lueur bleue.',
    'Le soleil se couche avec un éclat couleur de bronze pur.',
    'Un aigle d\'Orlanth pousse un cri strident au sommet de la falaise.',
    'Les étoiles de la Constellation du Dragon semblent pulser doucement.',
  ];

  const seasonWeathers = weathers[seasonId] || weathers['sea'];
  const weather = seasonWeathers[Math.floor(Math.random() * seasonWeathers.length)];
  const wind = winds[Math.floor(Math.random() * winds.length)];
  const omen = omens[Math.floor(Math.random() * omens.length)];

  return { weather, wind, omen };
}
