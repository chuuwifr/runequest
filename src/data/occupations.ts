export interface OccupationData {
  id: string;
  name: string;
  englishName: string;
  description: string;
  livingStandard: 'Pauvre' | 'Libre / Ordinaire' | 'Aisé' | 'Noble';
  incomeL: number; // en Lunars par an
  skills: { name: string; category: string; bonus: number }[];
  weapons: string[];
  equipment: string[];
  recommendedCults: string[];
}

export const OCCUPATIONS: OccupationData[] = [
  {
    id: 'warrior_heavy',
    name: 'Guerrier Lourd (Hoplite / Thane)',
    englishName: 'Heavy Infantry / Thane Warrior',
    description: 'Protecteur d\'élite du clan ou de la tribu, armé de pied en cap de bronze, expert dans le maniement de la lance, du bouclier et de l\'épée large.',
    livingStandard: 'Aisé',
    incomeL: 120,
    skills: [
      { name: 'Épée large 1M', category: 'Armes', bonus: 25 },
      { name: 'Bouclier large', category: 'Boucliers', bonus: 25 },
      { name: 'Lance courte 1M', category: 'Armes', bonus: 15 },
      { name: 'Sens du Danger', category: 'Perception', bonus: 15 },
      { name: 'Intimidation', category: 'Communication', bonus: 15 },
      { name: 'Bataille & Tactique', category: 'Connaissances', bonus: 20 },
    ],
    weapons: ['Épée large en bronze (1D8+1)', 'Bouclier grand (16 PV)', 'Javelots x2'],
    equipment: ['Cuirasse de bronze (6 PA)', 'Casque corinthien (6 PA)', 'Grèves de bronze (6 PA)', 'Cape de guerre en laine'],
    recommendedCults: ['Orlanth', 'Humakt', 'Taureau Tempête'],
  },
  {
    id: 'hunter',
    name: 'Chasseur / Éclaireur des Terres Sauvages',
    englishName: 'Hunter / Tracker',
    description: 'Maître des forêts et des cols de montagne, traquant le gibier, guidant les patrouilles et surveillant les frontières hostiles.',
    livingStandard: 'Libre / Ordinaire',
    incomeL: 60,
    skills: [
      { name: 'Arc composite', category: 'Armes', bonus: 25 },
      { name: 'Pistage', category: 'Perception', bonus: 25 },
      { name: 'Furtivité', category: 'Furtivité', bonus: 20 },
      { name: 'Survie en Milieu Sauvage', category: 'Connaissances', bonus: 20 },
      { name: 'Dague de chasse', category: 'Armes', bonus: 15 },
    ],
    weapons: ['Arc composite (1D8+1)', 'Carquois de 20 flèches', 'Dague de chasse (1D4+2)'],
    equipment: ['Armure de cuir durci (3 PA)', 'Bottes montantes', 'Filet de chasse', 'Briquet et silex', 'Outre d\'eau'],
    recommendedCults: ['Orlanth', 'Odayla', 'Waha'],
  },
  {
    id: 'priest_assistant',
    name: 'Prêtre / Prêtresse Adjoint(e)',
    englishName: 'Assistant Shaman / Priest',
    description: 'Serviteur dévoué des dieux, gardien des rites ancestraux, intermédiaire entre la communauté et les puissances runiques de l\'Autre Côté.',
    livingStandard: 'Aisé',
    incomeL: 100,
    skills: [
      { name: 'Méditation Sacrée', category: 'Magie', bonus: 25 },
      { name: 'Histoire du Culte & Mythes', category: 'Connaissances', bonus: 25 },
      { name: 'Chant Rituel', category: 'Communication', bonus: 20 },
      { name: 'Premiers Soins', category: 'Perception', bonus: 15 },
      { name: 'Éloquence', category: 'Communication', bonus: 15 },
    ],
    weapons: ['Bâton sacré (1D6)', 'Dague rituelle (1D4+2)'],
    equipment: ['Robes cérémonielles ornées de runes', 'Encensoir en bronze', 'Huiles saintes', 'Symbole divin en bronze'],
    recommendedCults: ['Ernalda', 'Chalana Arroy', 'Orlanth', 'Lhankor Mhy'],
  },
  {
    id: 'merchant',
    name: 'Marchand / Négociant Caravanier',
    englishName: 'Merchant / Trader',
    description: 'Voyageur intrépide reliant les cités et les tribus isolées, échangeant sel, bronze, vin et soieries sous la protection d\'Issaries.',
    livingStandard: 'Aisé',
    incomeL: 150,
    skills: [
      { name: 'Marchandage', category: 'Communication', bonus: 30 },
      { name: 'Évaluation', category: 'Connaissances', bonus: 20 },
      { name: 'Perspicacité (Humains)', category: 'Perception', bonus: 20 },
      { name: 'Langue étrangère', category: 'Communication', bonus: 20 },
      { name: 'Équitation', category: 'Agilité', bonus: 15 },
    ],
    weapons: ['Épée courte (1D6+1)', 'Petit bouclier rond (12 PV)'],
    equipment: ['Mule de bât harnachée', 'Balance de précision et poids de bronze', 'Tente de voyage', 'Bourse de 80 Lunars'],
    recommendedCults: ['Issaries', 'Ernalda'],
  },
  {
    id: 'scribe_scholar',
    name: 'Scribe / Érudit des Parchemins',
    englishName: 'Scribe / Sage of Lhankor Mhy',
    description: 'Gardien des lois, traducteur de textes anciens et historien assermenté. Porte la barbe sacrée de la sagesse et déchiffre les mystères enfouis.',
    livingStandard: 'Aisé',
    incomeL: 110,
    skills: [
      { name: 'Lecture / Écriture (Heortien & Pelorien)', category: 'Communication', bonus: 30 },
      { name: 'Histoire Ancienne de Glorantha', category: 'Connaissances', bonus: 25 },
      { name: 'Droit Coutumier', category: 'Connaissances', bonus: 20 },
      { name: 'Alchimie & Plantes', category: 'Connaissances', bonus: 15 },
      { name: 'Recherche documentaire', category: 'Perception', bonus: 15 },
    ],
    weapons: ['Gourdin ou canne ferrée (1D6)', 'Dague (1D4+2)'],
    equipment: ['Étui à parchemins imperméable', 'Encre et calames', 'Fausse barbe tressée rituelle', 'Loupe en cristal'],
    recommendedCults: ['Lhankor Mhy', 'Ernalda'],
  },
  {
    id: 'farmer_yeoman',
    name: 'Fermier Franc (Laboureur / Yeoman)',
    englishName: 'Farmer / Free Yeoman',
    description: 'Pilier nourricier de la communauté clanique, travaillant la terre sacrée d\'Ernalda et prêt à prendre les armes en cas de raid ennemi.',
    livingStandard: 'Libre / Ordinaire',
    incomeL: 50,
    skills: [
      { name: 'Agriculture & Élevage', category: 'Connaissances', bonus: 30 },
      { name: 'Hache 1M ou Épieu', category: 'Armes', bonus: 20 },
      { name: 'Fabrication / Artisanat du bois', category: 'Manipulation', bonus: 15 },
      { name: 'Sens de la Météo', category: 'Perception', bonus: 15 },
      { name: 'Lutte', category: 'Agilité', bonus: 15 },
    ],
    weapons: ['Épieu de chasse / Lance (1D8+1)', 'Hache de bûcheron (1D6+2)', 'Fronde (1D6)'],
    equipment: ['Veste de cuir renforcé (2 PA)', 'Outils aratoires', 'Charrette à bœufs (partagée)', 'Provision de grain'],
    recommendedCults: ['Ernalda', 'Orlanth', 'Barntar'],
  },
  {
    id: 'noble_chieftain',
    name: 'Noble / Héritier de Lignée Royale',
    englishName: 'Noble / Tribal Scion',
    description: 'Issu des familles régnantes de Sartar ou d\'Esrolia, formé au commandement, à la diplomatie et au port des armes d\'apparat.',
    livingStandard: 'Noble',
    incomeL: 300,
    skills: [
      { name: 'Commandement & Oratoire', category: 'Communication', bonus: 25 },
      { name: 'Éloquence & Diplomatie', category: 'Communication', bonus: 20 },
      { name: 'Épée large 1M', category: 'Armes', bonus: 20 },
      { name: 'Équitation (Pur-sang)', category: 'Agilité', bonus: 20 },
      { name: 'Héraldique & Généalogie', category: 'Connaissances', bonus: 15 },
    ],
    weapons: ['Épée large ancestrale forgée à froid (1D8+1)', 'Bouclier orné d\'or', 'Arc noble'],
    equipment: ['Armure de plaques de bronze ciselée (6 PA)', 'Cheval de guerre heortien', 'Torque d\'or et manteau de pourpre', 'Bourse de 200 Lunars'],
    recommendedCults: ['Orlanth', 'Ernalda', 'Yelm'],
  },
  {
    id: 'shaman_apprentice',
    name: 'Chaman Nomade / Danseur des Esprits',
    englishName: 'Shaman / Spirit Walker',
    description: 'Voyageur du plan astral, capable de communiquer avec les esprits de la nature, les fantômes des ancêtres et les élémentaires de Prax.',
    livingStandard: 'Libre / Ordinaire',
    incomeL: 70,
    skills: [
      { name: 'Combat Spirituel', category: 'Magie', bonus: 30 },
      { name: 'Voyage Astral / Transe', category: 'Magie', bonus: 25 },
      { name: 'Connaissance des Esprits', category: 'Connaissances', bonus: 20 },
      { name: 'Herboristerie Sacrée', category: 'Connaissances', bonus: 15 },
      { name: 'Pistage des Énergies', category: 'Perception', bonus: 15 },
    ],
    weapons: ['Bâton-fétiche aux crânes (1D6)', 'Fronde des plaines (1D6)'],
    equipment: ['Tambour rituel en peau de bison', 'Hochet à esprits', 'Poudres hallucinogènes', 'Tatouages runiques corporels'],
    recommendedCults: ['Daka Fal', 'Waha', 'Taureau Tempête', 'Corne d\'Abondance'],
  }
];
