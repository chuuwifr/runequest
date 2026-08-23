export interface FamilyHistoryEvent {
  year: number;
  title: string;
  location: string;
  description: string;
  outcomes: {
    label: string;
    description: string;
    passionGained?: { type: 'Loyauté' | 'Amour' | 'Dévotion' | 'Honneur' | 'Haine' | 'Peur'; target: string; value: number };
    reputationBonus?: number;
  }[];
}

export const FAMILY_HISTORY_TIMELINE: FamilyHistoryEvent[] = [
  {
    year: 1582,
    title: 'Campagne de Tarshten',
    location: 'Tarsh / Sartar',
    description: 'Le Roi Tarkalor de Sartar mène une offensive héroïque aux côtés des tribus alliées pour repousser les armées d\'invasion lunaires.',
    outcomes: [
      {
        label: 'A combattu avec bravoure',
        description: 'Votre grand-père a survécu aux combats et a reçu une torque d\'argent honorifique de la maison royale.',
        passionGained: { type: 'Loyauté', target: 'Maison de Sartar', value: 60 },
        reputationBonus: 5,
      },
      {
        label: 'Tombé héroïquement au combat',
        description: 'Votre ancêtre est mort en protégeant le Roi, inspirant des chants d\'honneur dans tout le clan.',
        passionGained: { type: 'Haine', target: 'Empire Lunaire', value: 60 },
        reputationBonus: 10,
      },
      {
        label: 'A soigné les blessés',
        description: 'Votre aïeul a servi comme guérisseur et a sauvé la vie de nombreux chefs de clan.',
        passionGained: { type: 'Honneur', target: 'Code du Soignant', value: 60 },
        reputationBonus: 5,
      }
    ]
  },
  {
    year: 1602,
    title: 'La Chute de Boldhome et Conquête de Sartar',
    location: 'Sartar',
    description: 'La capitale montagneuse de Sartar tombe après une trahison et l\'assaut impitoyable de la Phalange Lunaire et de la Chauve-Souris Pourpre.',
    outcomes: [
      {
        label: 'Résistant clandestin',
        description: 'Votre parent a rejoint la rébellion clandestine dans les collines de Kero Fin.',
        passionGained: { type: 'Haine', target: 'Empire Lunaire', value: 70 },
        reputationBonus: 5,
      },
      {
        label: 'Exil en Esrolia',
        description: 'Votre famille a fui vers la grande métropole de Nochet, tissant de nouveaux liens marchands.',
        passionGained: { type: 'Loyauté', target: 'Esrolia / Nochet', value: 60 },
        reputationBonus: 0,
      },
      {
        label: 'Survivant du Siège',
        description: 'Témoin de la terreur de la Chauve-Souris Pourpre, votre parent en a gardé une cicatrice indélébile.',
        passionGained: { type: 'Peur', target: 'Chauve-Souris Pourpre', value: 60 },
        reputationBonus: 0,
      }
    ]
  },
  {
    year: 1621,
    title: 'Le Grand Hiver Sans Soleil',
    location: 'Passe du Dragon',
    description: 'Un hiver surnaturel glacial frappe toute la région : le soleil ne se lève plus, les récoltes pourrissent sous le givre et la famine décime le bétail.',
    outcomes: [
      {
        label: 'Gardiens du Foyer',
        description: 'Votre famille a partagé son grain et maintenu le feu sacré d\'Ernalda allumé pendant 18 mois.',
        passionGained: { type: 'Dévotion', target: 'Ernalda / Déesses de la Terre', value: 65 },
        reputationBonus: 5,
      },
      {
        label: 'Chasseur de Blizzard',
        description: 'Votre parent a bravé le froid glacial pour ramener du gibier et chasser les prédateurs de glace.',
        passionGained: { type: 'Honneur', target: 'Survie du Clan', value: 60 },
        reputationBonus: 5,
      }
    ]
  },
  {
    year: 1625,
    title: 'Le Réveil du Dragon et Libération de Sartar',
    location: 'Temple du Rocher du Dragon',
    description: 'Lors du rituel lunaire du Nouveau Temple, un gigantesque Dragon primordial s\'éveille des entrailles de la terre et dévore l\'armée d\'occupation lunaire ! Sartar se soulève !',
    outcomes: [
      {
        label: 'Combattant de la Libération avec Argrath',
        description: 'Vous avez pris les armes et chassé la garnison lunaire de votre vallée natale !',
        passionGained: { type: 'Loyauté', target: 'Prince Kallyr / Argrath', value: 70 },
        reputationBonus: 10,
      },
      {
        label: 'Témoin du Réveil du Dragon',
        description: 'Vous avez vu de vos propres yeux la tête colossale du Dragon fendre le ciel.',
        passionGained: { type: 'Dévotion', target: 'Puissances Draconiques & Vents', value: 60 },
        reputationBonus: 5,
      }
    ]
  }
];
