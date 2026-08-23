export interface HomelandData {
  id: string;
  name: string;
  englishName: string;
  description: string;
  culture: string;
  primaryRunes: string[];
  characteristicBonuses: { [key: string]: number };
  baseSkills: { name: string; category: string; value: number }[];
  passions: { type: 'Loyauté' | 'Amour' | 'Dévotion' | 'Honneur' | 'Haine' | 'Peur'; target: string; value: number }[];
  lore: string;
}

export const HOMELANDS: HomelandData[] = [
  {
    id: 'sartar',
    name: 'Sartar',
    englishName: 'Sartar',
    culture: 'Heortien / Montagnard',
    primaryRunes: ['Air', 'Mouvement', 'Terre'],
    description: 'Royaume montagneux et fier de la Passe du Dragon, patrie des adorateurs d\'Orlanth et d\'Ernalda, célèbre pour sa résistance farouche contre l\'Empire Lunaire.',
    characteristicBonuses: { POU: 1 },
    baseSkills: [
      { name: 'Coutumes (Sartar)', category: 'Connaissances', value: 25 },
      { name: 'Langue natale (Heortien)', category: 'Communication', value: 50 },
      { name: 'Équitation (Cheval)', category: 'Agilité', value: 10 },
      { name: 'Escalade', category: 'Agilité', value: 25 },
      { name: 'Saut', category: 'Agilité', value: 15 },
    ],
    passions: [
      { type: 'Loyauté', target: 'Sartar / Tribu', value: 60 },
      { type: 'Amour', target: 'Famille / Clan', value: 60 },
      { type: 'Haine', target: 'Empire Lunaire', value: 60 },
    ],
    lore: 'Fondé par le héros Sartar qui unit les tribus grâce au pouvoir de l\'Amitié et de la Magie. Après des décennies d\'occupation lunaire, le royaume vient de se libérer lors du Réveil du Dragon.',
  },
  {
    id: 'esrolia',
    name: 'Esrolia',
    englishName: 'Esrolia',
    culture: 'Matriarcat des Terres de l\'Ombre',
    primaryRunes: ['Terre', 'Fertilité', 'Harmonie'],
    description: 'La plus riche et peuplée des nations de Glorantha du Sud, gouvernée par des reines et les grandes prêtresses d\'Ernalda dans la métropole géante de Nochet.',
    characteristicBonuses: { CHA: 1 },
    baseSkills: [
      { name: 'Coutumes (Esrolia)', category: 'Connaissances', value: 25 },
      { name: 'Langue natale (Esrolien)', category: 'Communication', value: 50 },
      { name: 'Marchandage', category: 'Communication', value: 20 },
      { name: 'Perspicacité (Humains)', category: 'Perception', value: 20 },
      { name: 'Navigation (Côtier)', category: 'Agilité', value: 15 },
    ],
    passions: [
      { type: 'Loyauté', target: 'Maison Esrolienne / Nochet', value: 60 },
      { type: 'Amour', target: 'Famille', value: 60 },
      { type: 'Dévotion', target: 'Ernalda / Déesses de la Terre', value: 60 },
    ],
    lore: 'Une terre d\'abondance où les hommes combattent pour la gloire des Matriarches et où les navires du monde entier mouillent dans le port de Nochet.',
  },
  {
    id: 'prax',
    name: 'Prax (Plaines Sauvages)',
    englishName: 'Prax',
    culture: 'Nomade des Bêtes',
    primaryRunes: ['Bête', 'Air', 'Mort'],
    description: 'Vastes steppes arides peuplées par les Cinq Grandes Tribus Nomades (Bison, Grand Lama, Impala, Antilope Noire, Rhinocéros) jurées au culte de Waha.',
    characteristicBonuses: { CON: 1 },
    baseSkills: [
      { name: 'Coutumes (Prax)', category: 'Connaissances', value: 25 },
      { name: 'Langue natale (Praxien)', category: 'Communication', value: 50 },
      { name: 'Équitation (Monture de tribu)', category: 'Agilité', value: 35 },
      { name: 'Pistage', category: 'Perception', value: 25 },
      { name: 'Survie (Prax)', category: 'Connaissances', value: 30 },
    ],
    passions: [
      { type: 'Loyauté', target: 'Tribu Nomade / Clan', value: 60 },
      { type: 'Haine', target: 'Cavaliers de Chevaux', value: 60 },
      { type: 'Honneur', target: 'Pacte de Waha', value: 60 },
    ],
    lore: 'Dans les plaines roussies par la Désolation de Genert, la survie repose sur le lien sacré unissant le cavalier et sa bête nourricière.',
  },
  {
    id: 'tarsh',
    name: 'Tarsh (Tarsh Lunaire & Vieux Tarsh)',
    englishName: 'Tarsh',
    culture: 'Sartarite Impérialisé / Ancien',
    primaryRunes: ['Feu', 'Terre', 'Lune'],
    description: 'Royaume frontalier prospère, déchiré entre la dynastie royale acquise à l\'Empire Lunaire et les rebelles orlanthis traditionalistes du Vieux Tarsh.',
    characteristicBonuses: { INT: 1 },
    baseSkills: [
      { name: 'Coutumes (Tarsh)', category: 'Connaissances', value: 25 },
      { name: 'Langue natale (Tarshite)', category: 'Communication', value: 50 },
      { name: 'Langue (Nouvelle Pelorienne)', category: 'Communication', value: 20 },
      { name: 'Équitation', category: 'Agilité', value: 15 },
    ],
    passions: [
      { type: 'Loyauté', target: 'Roi de Tarsh ou Vieux Tarsh', value: 60 },
      { type: 'Amour', target: 'Famille', value: 60 },
    ],
    lore: 'Célèbre pour ses vignobles, ses forteresses et le majestueux Temple de la Lune Rousse surplombant le fleuve Oslir.',
  },
  {
    id: 'grazelands',
    name: 'Les Pâturages (Grazelands)',
    englishName: 'Grazelands',
    culture: 'Filles du Cheval Pur',
    primaryRunes: ['Feu', 'Bête', 'Stase'],
    description: 'Terres de collines fertiles gouvernées par la Reine des Pâturages et les fiers cavaliers du Peuple du Cheval Pur, adorateurs de Yelm et de la Mère Cheval.',
    characteristicBonuses: { DEX: 1 },
    baseSkills: [
      { name: 'Coutumes (Pâturages)', category: 'Connaissances', value: 25 },
      { name: 'Langue natale (Grazelander)', category: 'Communication', value: 50 },
      { name: 'Équitation (Cheval)', category: 'Agilité', value: 40 },
      { name: 'Tir à l\'arc composite', category: 'Armes', value: 25 },
    ],
    passions: [
      { type: 'Loyauté', target: 'Reine des Pâturages', value: 60 },
      { type: 'Honneur', target: 'Code du Cheval Pur', value: 60 },
      { type: 'Haine', target: 'Pousseurs de charrue', value: 60 },
    ],
    lore: 'Une caste aristocratique équestre qui règne sur des paysans heortiens asservis et protège la pureté de ses coursiers divins.',
  },
  {
    id: 'lunar_provinces',
    name: 'Provinces Lunaires (Holay, Aggar, Vanch)',
    englishName: 'Lunar Provinces',
    culture: 'Provinciale Lunaire',
    primaryRunes: ['Lune', 'Illusion', 'Feu'],
    description: 'Provinces conquises et intégrées au puissant Empire Lunaire, baignées par la douce lumière rouge de la Déesse et de ses missionnaires.',
    characteristicBonuses: { CHA: 1 },
    baseSkills: [
      { name: 'Coutumes (Provinces Lunaires)', category: 'Connaissances', value: 25 },
      { name: 'Langue natale (Pelorien provincial)', category: 'Communication', value: 50 },
      { name: 'Langue (Nouvelle Pelorienne)', category: 'Communication', value: 25 },
      { name: 'Intrigue', category: 'Communication', value: 20 },
    ],
    passions: [
      { type: 'Loyauté', target: 'Empire Lunaire', value: 60 },
      { type: 'Dévotion', target: 'Les Sept Mères', value: 60 },
    ],
    lore: 'Les habitants vivent sous la Pax Lunara, où la magie lunaire brise les tabous anciens pour promettre l\'illumination universelle.',
  }
];
