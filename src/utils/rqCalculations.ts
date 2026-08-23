import { 
  CharacteristicValues, 
  DerivedAttributes, 
  HitLocation, 
  SkillCategoryModifiers,
  CharacteristicBonusBreakdown
} from '../types/runequest';

/**
 * Calcul du Modificateur Primaire (Primary Modifier) selon RuneQuest: Roleplaying in Glorantha:
 * - 01 à 04 : -10%
 * - 05 à 08 : -5%
 * - 09 à 12 : 0%
 * - 13 à 16 : +5%
 * - 17 à 20 : +10%
 * - 21 à 24 : +15%
 * (+5% par tranche de 4 points au-delà)
 */
export function calculatePrimaryModifier(value: number): number {
  if (value <= 4) return -10;
  if (value <= 8) return -5;
  if (value <= 12) return 0;
  return Math.floor((value - 9) / 4) * 5;
}

/**
 * Calcul du Modificateur Secondaire (Secondary Modifier) :
 * - 01 à 04 : -5%
 * - 05 à 16 : 0%
 * - 17 à 20 : +5%
 * - 21 à 24 : +10%
 * (+5% par tranche de 4 points au-delà)
 */
export function calculateSecondaryModifier(value: number): number {
  if (value <= 4) return -5;
  if (value <= 16) return 0;
  return Math.floor((value - 13) / 4) * 5;
}

/**
 * Calcul du Modificateur Négatif (Negative Modifier - ex: TAI sur Agilité/Furtivité) :
 * - 01 à 04 : +10%
 * - 05 à 08 : +5%
 * - 09 à 12 : 0%
 * - 13 à 16 : -5%
 * - 17 à 20 : -10%
 * - 21 à 24 : -15%
 * (-5% par tranche de 4 points au-delà de 12)
 */
export function calculateNegativeModifier(value: number): number {
  return -calculatePrimaryModifier(value);
}

/**
 * Calcul des Modificateurs de Catégories de Compétences selon les règles canoniques de RQG :
 * 
 * - Agilité : DEX (Primaire) + FOR (Secondaire) + POU (Secondaire) - TAI (Négatif / TAI Primaire)
 * - Communication : CHA (Primaire) + INT (Secondaire) + POU (Secondaire)
 * - Connaissances : INT (Primaire) + POU (Secondaire)
 * - Magie : POU (Primaire) + CHA (Primaire) + INT (Secondaire)
 * - Manipulation : DEX (Primaire) + FOR (Secondaire) + INT (Secondaire) + POU (Secondaire)
 * - Perception : INT (Primaire) + CON (Secondaire) + POU (Secondaire)
 * - Furtivité : DEX (Primaire) + INT (Secondaire) - TAI (Négatif) - POU (Secondaire)
 * - Armes : Manipulation
 * - Boucliers : Agilité
 */
export function calculateSkillCategoryModifiers(chars: CharacteristicValues): SkillCategoryModifiers {
  const { FOR, CON, TAI, INT, POU, DEX, CHA } = chars;

  const primDEX = calculatePrimaryModifier(DEX);
  const primCHA = calculatePrimaryModifier(CHA);
  const primINT = calculatePrimaryModifier(INT);
  const primPOU = calculatePrimaryModifier(POU);
  const primTAI = calculatePrimaryModifier(TAI);

  const secFOR = calculateSecondaryModifier(FOR);
  const secCON = calculateSecondaryModifier(CON);
  const secINT = calculateSecondaryModifier(INT);
  const secPOU = calculateSecondaryModifier(POU);

  // Agilité
  const agilite = primDEX + secFOR + secPOU - primTAI;

  // Communication
  const communication = primCHA + secINT + secPOU;

  // Connaissances
  const connaissances = primINT + secPOU;

  // Magie
  const magie = primPOU + primCHA + secINT;

  // Manipulation
  const manipulation = primDEX + secFOR + secINT + secPOU;

  // Perception
  const perception = primINT + secCON + secPOU;

  // Furtivité
  const furtivite = primDEX + secINT - primTAI - secPOU;

  // Armes et Boucliers
  const armes = manipulation;
  const boucliers = agilite;

  return {
    agilite,
    communication,
    connaissances,
    magie,
    manipulation,
    perception,
    furtivite,
    armes,
    boucliers,
  };
}

/**
 * Détail des contributions pour chaque caractéristique
 */
export function getCharacteristicBonusBreakdowns(chars: CharacteristicValues): CharacteristicBonusBreakdown[] {
  const statLabels: { [key in keyof CharacteristicValues]: string } = {
    FOR: 'Force (FOR)',
    CON: 'Constitution (CON)',
    TAI: 'Taille (TAI)',
    INT: 'Intelligence (INT)',
    POU: 'Pouvoir (POU)',
    DEX: 'Dextérité (DEX)',
    CHA: 'Charisme (CHA)',
  };

  return (Object.keys(chars) as (keyof CharacteristicValues)[]).map((key) => {
    const val = chars[key];
    return {
      stat: key,
      statName: statLabels[key],
      value: val,
      primary: calculatePrimaryModifier(val),
      secondary: calculateSecondaryModifier(val),
      negative: calculateNegativeModifier(val),
    };
  });
}

/**
 * Explication détaillée formule par catégorie
 */
export function getCategoryFormulaDetails(category: string, chars: CharacteristicValues) {
  const { FOR, CON, TAI, INT, POU, DEX, CHA } = chars;

  const primDEX = calculatePrimaryModifier(DEX);
  const primCHA = calculatePrimaryModifier(CHA);
  const primINT = calculatePrimaryModifier(INT);
  const primPOU = calculatePrimaryModifier(POU);
  const primTAI = calculatePrimaryModifier(TAI);

  const secFOR = calculateSecondaryModifier(FOR);
  const secCON = calculateSecondaryModifier(CON);
  const secINT = calculateSecondaryModifier(INT);
  const secPOU = calculateSecondaryModifier(POU);

  switch (category) {
    case 'Agilité':
      return {
        formula: 'DEX (Prim) + FOR (Sec) + POU (Sec) - TAI (Prim)',
        parts: [
          { name: `DEX (${DEX}) [Prim]`, val: primDEX },
          { name: `FOR (${FOR}) [Sec]`, val: secFOR },
          { name: `POU (${POU}) [Sec]`, val: secPOU },
          { name: `TAI (${TAI}) [Négatif]`, val: -primTAI },
        ],
        total: primDEX + secFOR + secPOU - primTAI,
      };
    case 'Communication':
      return {
        formula: 'CHA (Prim) + INT (Sec) + POU (Sec)',
        parts: [
          { name: `CHA (${CHA}) [Prim]`, val: primCHA },
          { name: `INT (${INT}) [Sec]`, val: secINT },
          { name: `POU (${POU}) [Sec]`, val: secPOU },
        ],
        total: primCHA + secINT + secPOU,
      };
    case 'Connaissances':
      return {
        formula: 'INT (Prim) + POU (Sec)',
        parts: [
          { name: `INT (${INT}) [Prim]`, val: primINT },
          { name: `POU (${POU}) [Sec]`, val: secPOU },
        ],
        total: primINT + secPOU,
      };
    case 'Magie':
      return {
        formula: 'POU (Prim) + CHA (Prim) + INT (Sec)',
        parts: [
          { name: `POU (${POU}) [Prim]`, val: primPOU },
          { name: `CHA (${CHA}) [Prim]`, val: primCHA },
          { name: `INT (${INT}) [Sec]`, val: secINT },
        ],
        total: primPOU + primCHA + secINT,
      };
    case 'Manipulation':
      return {
        formula: 'DEX (Prim) + FOR (Sec) + INT (Sec) + POU (Sec)',
        parts: [
          { name: `DEX (${DEX}) [Prim]`, val: primDEX },
          { name: `FOR (${FOR}) [Sec]`, val: secFOR },
          { name: `INT (${INT}) [Sec]`, val: secINT },
          { name: `POU (${POU}) [Sec]`, val: secPOU },
        ],
        total: primDEX + secFOR + secINT + secPOU,
      };
    case 'Perception':
      return {
        formula: 'INT (Prim) + CON (Sec) + POU (Sec)',
        parts: [
          { name: `INT (${INT}) [Prim]`, val: primINT },
          { name: `CON (${CON}) [Sec]`, val: secCON },
          { name: `POU (${POU}) [Sec]`, val: secPOU },
        ],
        total: primINT + secCON + secPOU,
      };
    case 'Furtivité':
      return {
        formula: 'DEX (Prim) + INT (Sec) - TAI (Prim) - POU (Sec)',
        parts: [
          { name: `DEX (${DEX}) [Prim]`, val: primDEX },
          { name: `INT (${INT}) [Sec]`, val: secINT },
          { name: `TAI (${TAI}) [Négatif]`, val: -primTAI },
          { name: `POU (${POU}) [Sec Nég.]`, val: -secPOU },
        ],
        total: primDEX + secINT - primTAI - secPOU,
      };
    case 'Armes':
      return {
        formula: 'Lié à la Manipulation (DEX + FOR + INT + POU)',
        parts: [
          { name: `DEX (${DEX}) [Prim]`, val: primDEX },
          { name: `FOR (${FOR}) [Sec]`, val: secFOR },
          { name: `INT (${INT}) [Sec]`, val: secINT },
          { name: `POU (${POU}) [Sec]`, val: secPOU },
        ],
        total: primDEX + secFOR + secINT + secPOU,
      };
    case 'Boucliers':
      return {
        formula: 'Lié à l\'Agilité (DEX + FOR + POU - TAI)',
        parts: [
          { name: `DEX (${DEX}) [Prim]`, val: primDEX },
          { name: `FOR (${FOR}) [Sec]`, val: secFOR },
          { name: `POU (${POU}) [Sec]`, val: secPOU },
          { name: `TAI (${TAI}) [Négatif]`, val: -primTAI },
        ],
        total: primDEX + secFOR + secPOU - primTAI,
      };
    default:
      return {
        formula: 'Aucun modificateur',
        parts: [],
        total: 0,
      };
  }
}

/**
 * Formatage string d'un modificateur (ex: "+5%", "-5%", "0%")
 */
export function formatModifier(mod: number): string {
  if (mod > 0) return `+${mod}%`;
  if (mod < 0) return `${mod}%`;
  return '0%';
}

/**
 * Table d'opposition BRP (ex: Test de Résistance POU vs POU, FOR vs TAI)
 * 50% + (Actif - Passif) * 5% (min 5%, max 95%)
 */
export function calculateResistanceChance(activeStat: number, passiveStat: number): number {
  const chance = 50 + (activeStat - passiveStat) * 5;
  return Math.max(5, Math.min(95, chance));
}

export function calculateDerivedAttributes(chars: CharacteristicValues): DerivedAttributes {
  const { FOR, CON, TAI, INT, POU, DEX, CHA } = chars;

  // Total Hit Points based on CON + TAI
  const conPlusSize = CON + TAI;
  let hpMax = Math.ceil(conPlusSize / 2);
  if (hpMax < 3) hpMax = 3;

  // Magic Points
  const magicPointsMax = POU;

  // Damage Bonus from STR + SIZ
  const strPlusSize = FOR + TAI;
  let damageBonus = '0';
  if (strPlusSize <= 12) damageBonus = '-1D4';
  else if (strPlusSize <= 24) damageBonus = '0';
  else if (strPlusSize <= 32) damageBonus = '+1D4';
  else if (strPlusSize <= 40) damageBonus = '+1D6';
  else if (strPlusSize <= 56) damageBonus = '+2D6';
  else if (strPlusSize <= 72) damageBonus = '+3D6';
  else damageBonus = '+4D6';

  // Healing Rate from CON
  let healingRate = 2;
  if (CON <= 6) healingRate = 1;
  else if (CON <= 12) healingRate = 2;
  else if (CON <= 18) healingRate = 3;
  else if (CON <= 24) healingRate = 4;
  else healingRate = 5;

  // Strike Rank DEX
  let srDex = 3;
  if (DEX <= 5) srDex = 5;
  else if (DEX <= 9) srDex = 4;
  else if (DEX <= 15) srDex = 3;
  else if (DEX <= 19) srDex = 2;
  else srDex = 1;

  // Strike Rank SIZ
  let srSize = 1;
  if (TAI <= 6) srSize = 3;
  else if (TAI <= 14) srSize = 2;
  else if (TAI <= 21) srSize = 1;
  else srSize = 0;

  // Spirit Combat Damage (POW + CHA)
  const powPlusCha = POU + CHA;
  let spiritCombatDamage = '1D6';
  if (powPlusCha <= 12) spiritCombatDamage = '1D3';
  else if (powPlusCha <= 24) spiritCombatDamage = '1D6';
  else if (powPlusCha <= 32) spiritCombatDamage = '1D6+1';
  else if (powPlusCha <= 40) spiritCombatDamage = '1D6+3';
  else if (powPlusCha <= 56) spiritCombatDamage = '2D6+3';
  else spiritCombatDamage = '3D6+3';

  // Max Encumbrance = FOR
  const maxEncumbrance = FOR;

  // Movement rate standard = 8m
  const movementRate = 8;

  // Category Modifiers
  const categoryModifiers = calculateSkillCategoryModifiers(chars);

  return {
    hpMax,
    magicPointsMax,
    damageBonus,
    healingRate,
    srDex,
    srSize,
    spiritCombatDamage,
    maxEncumbrance,
    movementRate,
    categoryModifiers,
  };
}

export function generateHitLocations(totalHp: number, defaultArmor = 0, defaultArmorType = 'Vêtements'): HitLocation[] {
  const legHp = Math.ceil(totalHp / 3);
  const abdomenHp = Math.ceil(totalHp / 3);
  const chestHp = Math.ceil(totalHp * 0.4) > legHp ? Math.ceil(totalHp * 0.4) : legHp + 1;
  const armHp = Math.ceil(totalHp / 4);
  const headHp = Math.ceil(totalHp / 3);

  return [
    {
      id: 'jambe_droite',
      name: 'Jambe Droite',
      rollRange: '01–04',
      d20Range: [1, 2, 3, 4],
      hpMax: legHp,
      hpCurrent: legHp,
      armorPoints: defaultArmor,
      armorType: defaultArmorType,
    },
    {
      id: 'jambe_gauche',
      name: 'Jambe Gauche',
      rollRange: '05–08',
      d20Range: [5, 6, 7, 8],
      hpMax: legHp,
      hpCurrent: legHp,
      armorPoints: defaultArmor,
      armorType: defaultArmorType,
    },
    {
      id: 'abdomen',
      name: 'Abdomen',
      rollRange: '09–11',
      d20Range: [9, 10, 11],
      hpMax: abdomenHp,
      hpCurrent: abdomenHp,
      armorPoints: defaultArmor,
      armorType: defaultArmorType,
    },
    {
      id: 'poitrine',
      name: 'Poitrine',
      rollRange: '12',
      d20Range: [12],
      hpMax: chestHp,
      hpCurrent: chestHp,
      armorPoints: defaultArmor,
      armorType: defaultArmorType,
    },
    {
      id: 'bras_droit',
      name: 'Bras Droit',
      rollRange: '13–15',
      d20Range: [13, 14, 15],
      hpMax: armHp,
      hpCurrent: armHp,
      armorPoints: defaultArmor,
      armorType: defaultArmorType,
    },
    {
      id: 'bras_gauche',
      name: 'Bras Gauche',
      rollRange: '16–18',
      d20Range: [16, 17, 18],
      hpMax: armHp,
      hpCurrent: armHp,
      armorPoints: defaultArmor,
      armorType: defaultArmorType,
    },
    {
      id: 'tete',
      name: 'Tête',
      rollRange: '19–20',
      d20Range: [19, 20],
      hpMax: headHp,
      hpCurrent: headHp,
      armorPoints: defaultArmor,
      armorType: defaultArmorType,
    },
  ];
}
