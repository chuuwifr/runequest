import { Adventurer } from '../types/runequest';
import { calculateDerivedAttributes, generateHitLocations } from '../utils/rqCalculations';

const vasanaChars = { FOR: 15, CON: 14, TAI: 13, INT: 14, POU: 16, DEX: 15, CHA: 15 };
const vasanaDerived = calculateDerivedAttributes(vasanaChars);
const vasanaHitLocations = generateHitLocations(vasanaDerived.hpMax, 5, 'Cuirasse de bronze & Cuir');

export const PREMADE_ADVENTURERS: Adventurer[] = [
  {
    id: 'vasana',
    name: 'Vasana fille de Farnan',
    gender: 'Femme',
    age: 21,
    homeland: 'Sartar (Tribu Colymar)',
    tribe: 'Colymar',
    clan: 'Ernaldori',
    occupation: 'Guerrière / Chevaucheuse de Bison (Vrokiti)',
    livingStandard: 'Aisé',
    characteristics: vasanaChars,
    derived: vasanaDerived,
    currentHp: vasanaDerived.hpMax,
    currentMagicPoints: vasanaDerived.magicPointsMax,
    cults: [
      {
        cultId: 'orlanth',
        cultName: 'Orlanth Aventurier',
        rank: 'Initié',
        runePointsMax: 3,
        runePointsCurrent: 3,
        holyDay: 'Jour des Vents',
      }
    ],
    runes: [
      { rune: 'Air', value: 75, category: 'Élément' },
      { rune: 'Terre', value: 50, category: 'Élément' },
      { rune: 'Feu', value: 25, category: 'Élément' },
      { rune: 'Mouvement', value: 70, category: 'Puissance' },
      { rune: 'Stase', value: 30, category: 'Puissance' },
      { rune: 'Mort', value: 65, category: 'Puissance' },
      { rune: 'Fertilité', value: 35, category: 'Puissance' },
    ],
    passions: [
      { id: 'p1', type: 'Loyauté', target: 'Sartar & Princesse Kallyr', value: 75 },
      { id: 'p2', type: 'Amour', target: 'Famille & Bison Vrokiti', value: 70 },
      { id: 'p3', type: 'Haine', target: 'Empire Lunaire', value: 80 },
      { id: 'p4', type: 'Honneur', target: 'Honneur du Guerrier', value: 70 },
    ],
    skills: [
      { id: 's1', name: 'Épée large 1M', category: 'Armes', baseVal: 15, cultBonus: 20, occupationalBonus: 35, personalBonus: 10, totalVal: 80, experienceCheck: false },
      { id: 's2', name: 'Lance de cavalerie', category: 'Armes', baseVal: 15, cultBonus: 0, occupationalBonus: 40, personalBonus: 15, totalVal: 70, experienceCheck: false },
      { id: 's3', name: 'Bouclier large', category: 'Boucliers', baseVal: 15, cultBonus: 15, occupationalBonus: 30, personalBonus: 15, totalVal: 75, experienceCheck: false },
      { id: 's4', name: 'Arc composite', category: 'Armes', baseVal: 10, cultBonus: 0, occupationalBonus: 30, personalBonus: 15, totalVal: 55, experienceCheck: false },
      { id: 's5', name: 'Équitation (Bison)', category: 'Agilité', baseVal: 10, cultBonus: 0, occupationalBonus: 45, personalBonus: 20, totalVal: 75, experienceCheck: false },
      { id: 's6', name: 'Saut', category: 'Agilité', baseVal: 15, cultBonus: 15, occupationalBonus: 20, personalBonus: 10, totalVal: 60, experienceCheck: false },
      { id: 's7', name: 'Sens du Danger', category: 'Perception', baseVal: 25, cultBonus: 0, occupationalBonus: 20, personalBonus: 15, totalVal: 60, experienceCheck: false },
      { id: 's8', name: 'Bataille & Tactique', category: 'Connaissances', baseVal: 10, cultBonus: 0, occupationalBonus: 35, personalBonus: 10, totalVal: 55, experienceCheck: false },
      { id: 's9', name: 'Premiers Soins', category: 'Perception', baseVal: 10, cultBonus: 0, occupationalBonus: 15, personalBonus: 15, totalVal: 40, experienceCheck: false },
    ],
    weapons: [
      { id: 'w1', name: 'Épée large de bronze', category: 'Corps à corps', sr: 2, damage: '1D8+1', hasDamageBonus: true, hpMax: 12, hpCurrent: 12, skillName: 'Épée large 1M' },
      { id: 'w2', name: 'Lance de cavalerie', category: 'Corps à corps', sr: 1, damage: '1D10+1', hasDamageBonus: true, hpMax: 10, hpCurrent: 10, skillName: 'Lance de cavalerie' },
      { id: 'w3', name: 'Bouclier large en bronze', category: 'Bouclier', sr: 3, damage: '1D6', hasDamageBonus: true, hpMax: 16, hpCurrent: 16, skillName: 'Bouclier large' },
      { id: 'w4', name: 'Arc composite', category: 'Distance', sr: 2, damage: '1D8+1', hasDamageBonus: false, hpMax: 8, hpCurrent: 8, skillName: 'Arc composite', range: '100m' },
    ],
    hitLocations: vasanaHitLocations,
    spells: [
      { id: 'sp1', name: 'Lame de Feu', type: 'Esprit', cost: '4 PM', range: 'Toucher', duration: '15 min', isStackable: false, description: 'L\'arme inflige 3D6 points de dégâts de feu purs.' },
      { id: 'sp2', name: 'Mobilité', type: 'Esprit', cost: '1 PM', range: 'Toucher', duration: '15 min', isStackable: false, description: 'Double le mouvement et confère +10% à l\'Agilité.' },
      { id: 'sp3', name: 'Protection 2', type: 'Esprit', cost: '2 PM', range: 'Personnelle', duration: '15 min', isStackable: true, description: '+2 PA magiques sur toutes les localisations.' },
      { id: 'sp4', name: 'Foudre d\'Orlanth', type: 'Runique', rune: 'Air', cults: ['Orlanth'], cost: '1 Point de Rune / dé', range: '100m', duration: 'Instantané', isStackable: true, description: '1D6 dégâts par PR dépensé sans armure métallique.' },
    ],
    equipment: [
      'Bison de monte fidèle nommé "Tonnerre-Gris"',
      'Selle de guerre heortienne et caparaçon de cuir',
      'Torque d\'argent de bravoure',
      'Corne de brume en os',
      'Rations de voyage pour 1 semaine',
    ],
    currency: { clacks: 45, lunars: 120, wheels: 2 },
    notes: 'Héroïne de la tribu Colymar, vétéran du Siège de Nochet et du Réveil du Dragon. Son bison géant combat à ses côtés avec une férocité redoutable.',
    familyHistory: [
      '1582 : Grand-père Farnan récompensé par le Roi Tarkalor à Tarshten.',
      '1602 : Père tombé lors de la prise de Boldhome par les Lunaires.',
      '1625 : A mené la charge des chevaucheurs de bison lors du Réveil du Dragon.'
    ]
  },
  {
    id: 'harmast',
    name: 'Harmast le Chasseur du Vent',
    gender: 'Homme',
    age: 22,
    homeland: 'Sartar (Tribu Culbrea)',
    occupation: 'Chasseur & Éclaireur',
    livingStandard: 'Libre / Ordinaire',
    characteristics: { FOR: 13, CON: 16, TAI: 11, INT: 13, POU: 14, DEX: 17, CHA: 12 },
    derived: calculateDerivedAttributes({ FOR: 13, CON: 16, TAI: 11, INT: 13, POU: 14, DEX: 17, CHA: 12 }),
    currentHp: 14,
    currentMagicPoints: 14,
    cults: [
      { cultId: 'orlanth', cultName: 'Orlanth Aventurier', rank: 'Initié', runePointsMax: 3, runePointsCurrent: 3, holyDay: 'Jour des Vents' }
    ],
    runes: [
      { rune: 'Air', value: 70, category: 'Élément' },
      { rune: 'Mouvement', value: 75, category: 'Puissance' },
      { rune: 'Bête', value: 60, category: 'Puissance' },
    ],
    passions: [
      { id: 'hp1', type: 'Loyauté', target: 'Tribu Culbrea', value: 65 },
      { id: 'hp2', type: 'Haine', target: 'Trolls & Broos', value: 70 },
      { id: 'hp3', type: 'Amour', target: 'Clan', value: 60 },
    ],
    skills: [
      { id: 'hs1', name: 'Arc composite', category: 'Armes', baseVal: 10, cultBonus: 0, occupationalBonus: 40, personalBonus: 25, totalVal: 75, experienceCheck: false },
      { id: 'hs2', name: 'Pistage', category: 'Perception', baseVal: 25, cultBonus: 0, occupationalBonus: 35, personalBonus: 15, totalVal: 75, experienceCheck: false },
      { id: 'hs3', name: 'Furtivité', category: 'Furtivité', baseVal: 10, cultBonus: 0, occupationalBonus: 35, personalBonus: 25, totalVal: 70, experienceCheck: false },
      { id: 'hs4', name: 'Dague de chasse', category: 'Armes', baseVal: 15, cultBonus: 0, occupationalBonus: 25, personalBonus: 20, totalVal: 60, experienceCheck: false },
    ],
    weapons: [
      { id: 'hw1', name: 'Arc composite heortien', category: 'Distance', sr: 1, damage: '1D8+1', hasDamageBonus: false, hpMax: 8, hpCurrent: 8, skillName: 'Arc composite', range: '100m' },
      { id: 'hw2', name: 'Dague en bronze', category: 'Corps à corps', sr: 3, damage: '1D4+2', hasDamageBonus: false, hpMax: 8, hpCurrent: 8, skillName: 'Dague de chasse' },
    ],
    hitLocations: generateHitLocations(14, 3, 'Cuir souple & Cuir bouilli'),
    spells: [
      { id: 'hsp1', name: 'Flèche Véloce', type: 'Esprit', cost: '1 PM', range: 'Toucher', duration: '1 round', isStackable: false, description: '+15% toucher et +3 dégâts à la flèche.' },
      { id: 'hsp2', name: 'Mobilité', type: 'Esprit', cost: '1 PM', range: 'Toucher', duration: '15 min', isStackable: false, description: 'Double la vitesse de course.' },
    ],
    equipment: ['Carquois d\'écorce avec 24 flèches de bronze', 'Cape de camouflage verte', 'Corde de chanvre 15m', 'Briquet et amadou'],
    currency: { clacks: 30, lunars: 45, wheels: 0 },
    notes: 'Éclaireur hors-pair capable de se fondre dans les broussailles de la passe et de repérer les embuscades à des lieues.',
  },
  {
    id: 'yanioth',
    name: 'Yanioth la Gardienne des Récoltes',
    gender: 'Femme',
    age: 20,
    homeland: 'Esrolia (Terres de Nochet)',
    occupation: 'Prêtresse d\'Ernalda',
    livingStandard: 'Aisé',
    characteristics: { FOR: 10, CON: 15, TAI: 12, INT: 16, POU: 17, DEX: 12, CHA: 16 },
    derived: calculateDerivedAttributes({ FOR: 10, CON: 15, TAI: 12, INT: 16, POU: 17, DEX: 12, CHA: 16 }),
    currentHp: 14,
    currentMagicPoints: 17,
    cults: [
      { cultId: 'ernalda', cultName: 'Ernalda la Reine de la Terre', rank: 'Initié', runePointsMax: 3, runePointsCurrent: 3, holyDay: 'Jour de l\'Argile' }
    ],
    runes: [
      { rune: 'Terre', value: 80, category: 'Élément' },
      { rune: 'Fertilité', value: 75, category: 'Puissance' },
      { rune: 'Harmonie', value: 70, category: 'Puissance' },
    ],
    passions: [
      { id: 'yp1', type: 'Dévotion', target: 'Ernalda', value: 80 },
      { id: 'yp2', type: 'Amour', target: 'Maison de Nochet', value: 75 },
      { id: 'yp3', type: 'Honneur', target: 'Hospitalité Sacrée', value: 70 },
    ],
    skills: [
      { id: 'ys1', name: 'Premiers Soins', category: 'Perception', baseVal: 10, cultBonus: 25, occupationalBonus: 30, personalBonus: 15, totalVal: 80, experienceCheck: false },
      { id: 'ys2', name: 'Marchandage', category: 'Communication', baseVal: 20, cultBonus: 15, occupationalBonus: 25, personalBonus: 10, totalVal: 70, experienceCheck: false },
      { id: 'ys3', name: 'Méditation Sacrée', category: 'Magie', baseVal: 0, cultBonus: 25, occupationalBonus: 30, personalBonus: 15, totalVal: 70, experienceCheck: false },
    ],
    weapons: [
      { id: 'yw1', name: 'Faucille sacrée en bronze', category: 'Corps à corps', sr: 3, damage: '1D6+1', hasDamageBonus: false, hpMax: 8, hpCurrent: 8, skillName: 'Faucille' },
    ],
    hitLocations: generateHitLocations(14, 2, 'Robes renforcées de lin et cuir'),
    spells: [
      { id: 'ysp1', name: 'Soin 3', type: 'Esprit', cost: '3 PM', range: 'Toucher', duration: 'Instantané', isStackable: true, description: 'Restaure 3 PV à la cible.' },
      { id: 'ysp2', name: 'Bénédiction des Récoltes', type: 'Runique', rune: 'Terre', cults: ['Ernalda'], cost: '1 PR', range: '1 km²', duration: 'Saison', isStackable: false, description: 'Protège et fertilise la terre.' },
    ],
    equipment: ['Robes brodées d\'or et de soie esrolienne', 'Sac de graines bénies', 'Encensoir d\'argile sacrée', 'Herbes médicinales'],
    currency: { clacks: 50, lunars: 180, wheels: 3 },
    notes: 'Prêtresse d\'une grande lignée matriarcale, capable d\'apaiser les querelles de sang et de redonner vie aux terres dévastées.',
  }
];
