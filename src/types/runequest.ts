export type ElementalRune = 'Air' | 'Terre' | 'Feu' | 'Eau' | 'Ténèbres' | 'Lune';

export type PowerRune = 
  | 'Fertilité' | 'Mort'
  | 'Harmonie' | 'Désaccord'
  | 'Vérité' | 'Illusion'
  | 'Stase' | 'Mouvement'
  | 'Homme' | 'Bête'
  | 'Esprit' | 'Magie' | 'Maîtrise';

export type RuneType = ElementalRune | PowerRune;

export interface CharacteristicValues {
  FOR: number; // Force (STR)
  CON: number; // Constitution (CON)
  TAI: number; // Taille (SIZ)
  INT: number; // Intelligence (INT)
  POU: number; // Pouvoir (POW)
  DEX: number; // Dextérité (DEX)
  CHA: number; // Charisme (CHA)
}

export interface SkillCategoryModifiers {
  agilite: number;
  communication: number;
  connaissances: number;
  magie: number;
  manipulation: number;
  perception: number;
  furtivite: number;
  armes: number;
  boucliers: number;
}

export interface CharacteristicBonusBreakdown {
  stat: keyof CharacteristicValues;
  statName: string;
  value: number;
  primary: number;
  secondary: number;
  negative: number;
}

export interface DerivedAttributes {
  hpMax: number; // Points de Vie totaux
  magicPointsMax: number; // Points de Magie
  damageBonus: string; // ex: +1D4, +1D6, 0, -1D4
  healingRate: number; // Taux de guérison naturel par semaine
  srDex: number; // Strike Rank Dextérité
  srSize: number; // Strike Rank Taille
  spiritCombatDamage: string; // Dégâts de combat spirituel
  maxEncumbrance: number; // Encombrement maximal sans pénalité (FOR)
  movementRate: number; // Vitesse de déplacement de base (8m)
  categoryModifiers: SkillCategoryModifiers; // Bonus/Malus par catégorie de compétence
}

export type BodyPart = 'jambe_droite' | 'jambe_gauche' | 'abdomen' | 'poitrine' | 'bras_droit' | 'bras_gauche' | 'tete';

export interface HitLocation {
  id: BodyPart;
  name: string;
  rollRange: string; // ex: "01-04"
  d20Range: number[]; // ex: [1, 2, 3, 4]
  hpMax: number;
  hpCurrent: number;
  armorPoints: number;
  armorType: string;
  isSevered?: boolean;
  isMaimed?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Agilité' | 'Communication' | 'Connaissances' | 'Magie' | 'Manipulation' | 'Perception' | 'Furtivité' | 'Armes' | 'Boucliers' | 'Passions';
  baseVal: number;
  categoryMod?: number; // Modificateur issu des caractéristiques
  cultBonus: number;
  occupationalBonus: number;
  personalBonus: number;
  totalVal: number;
  experienceCheck: boolean;
  specialty?: string;
}

export interface Weapon {
  id: string;
  name: string;
  category: 'Corps à corps' | 'Distance' | 'Bouclier' | 'Arme naturelle';
  sr: number; // Weapon Strike Rank
  damage: string; // ex: "1D8+1"
  hasDamageBonus: boolean;
  hpMax: number; // Solidité / Points de vie de l'arme
  hpCurrent: number;
  skillName: string;
  range?: string;
  notes?: string;
}

export interface ArmorItem {
  id: string;
  name: string;
  location: BodyPart[];
  armorPoints: number;
  encumbrance: number;
  material: string;
}

export interface RuneAffinity {
  rune: RuneType;
  value: number;
  category: 'Élément' | 'Puissance';
}

export interface Passion {
  id: string;
  type: 'Loyauté' | 'Amour' | 'Dévotion' | 'Honneur' | 'Haine' | 'Peur';
  target: string; // ex: "Sartar", "Famille", "Orlanth", "Empire Lunaire"
  value: number;
}

export interface Spell {
  id: string;
  name: string;
  englishName?: string;
  type: 'Esprit' | 'Runique' | 'Sorcellerie';
  rune?: RuneType;
  cults?: string[];
  cost: string; // ex: "1 PM", "2 Points de Rune", "Variable"
  range: string; // ex: "Toucher", "50m", "À vue"
  duration: string; // ex: "15 min", "Instantané", "Temporelle"
  isStackable: boolean;
  description: string;
}

export interface CultAffiliation {
  cultId: string;
  cultName: string;
  rank: 'Laïc' | 'Initié' | 'Seigneur des Runes' | 'Prêtre des Runes' | 'Grand Prêtre';
  runePointsMax: number;
  runePointsCurrent: number;
  holyDay: string;
}

export interface Adventurer {
  id: string;
  name: string;
  gender: 'Homme' | 'Femme' | 'Autre';
  age: number;
  homeland: string;
  tribe?: string;
  clan?: string;
  occupation: string;
  livingStandard: 'Pauvre' | 'Libre / Ordinaire' | 'Aisé' | 'Noble';
  cults: CultAffiliation[];
  characteristics: CharacteristicValues;
  derived: DerivedAttributes;
  currentHp: number;
  currentMagicPoints: number;
  runes: RuneAffinity[];
  passions: Passion[];
  skills: Skill[];
  weapons: Weapon[];
  hitLocations: HitLocation[];
  spells: Spell[];
  boundSpirits?: {
    name: string;
    type: string;
    pow: number;
    magicPoints: number;
    spells: string[];
  }[];
  equipment: string[];
  currency: {
    clacks: number; // Cuivre
    lunars: number; // Argent
    wheels: number; // Or
  };
  notes: string;
  familyHistory?: string[];
  avatarUrl?: string;
}

export type RollSuccessLevel = 'Critique' | 'Spéciale' | 'Réussite' | 'Échec' | 'Maladresse';

export interface RollResult {
  diceRoll: number;
  targetSkill: number;
  level: RollSuccessLevel;
  critThreshold: number;
  specialThreshold: number;
  fumbleThreshold: number;
  skillName?: string;
  characterName?: string;
  timestamp: string;
  detailMessage: string;
}
