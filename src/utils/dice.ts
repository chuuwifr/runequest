import { RollResult, RollSuccessLevel } from '../types/runequest';

export function rollDice(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

export function rollD100(): number {
  return rollDice(100);
}

export function rollD20(): number {
  return rollDice(20);
}

export function parseAndRollDiceFormula(formula: string): { total: number; rolls: number[]; formula: string } {
  // Handles things like "1D8+1", "2D6+2", "1D4", "1D10-1", "3D6", "2D6+6"
  const clean = formula.replace(/\s+/g, '').toUpperCase();
  const match = clean.match(/^(\d+)D(\d+)([+-]\d+)?$/);

  if (!match) {
    const num = parseInt(clean, 10);
    return { total: isNaN(num) ? 0 : num, rolls: [], formula };
  }

  const count = parseInt(match[1], 10);
  const sides = parseInt(match[2], 10);
  const modifier = match[3] ? parseInt(match[3], 10) : 0;

  const rolls: number[] = [];
  let sum = 0;
  for (let i = 0; i < count; i++) {
    const r = rollDice(sides);
    rolls.push(r);
    sum += r;
  }

  const total = Math.max(1, sum + modifier);
  return { total, rolls, formula };
}

export function evaluateD100(roll: number, target: number, skillName?: string, characterName?: string): RollResult {
  const critThreshold = Math.max(1, Math.round(target / 20));
  const specialThreshold = Math.max(1, Math.round(target / 5));
  
  // Fumble threshold in RQG:
  // If target <= 95: 96-100 is Fumble (or 96-00)
  // If target > 95: 00 (100) is Fumble, 96-99 is failure
  const fumbleThreshold = target <= 95 ? 96 : 100;

  let level: RollSuccessLevel;
  let detailMessage = '';

  if (roll <= critThreshold) {
    level = 'Critique';
    detailMessage = `Réussite Critique ! (Jet: ${roll} sur seuil ${critThreshold}%). Dégâts maximaux ignorant l'armure ou effet supérieur !`;
  } else if (roll <= specialThreshold) {
    level = 'Spéciale';
    detailMessage = `Réussite Spéciale ! (Jet: ${roll} sur seuil ${specialThreshold}%). Effet perçant/écrasant ou efficacité accrue.`;
  } else if (roll <= target) {
    level = 'Réussite';
    detailMessage = `Réussite ordinaire (Jet: ${roll} ≤ ${target}%).`;
  } else if (roll >= fumbleThreshold) {
    level = 'Maladresse';
    detailMessage = `Maladresse critique ! (Jet: ${roll} ≥ ${fumbleThreshold}%). Arme lâchée, brisée ou incident fâcheux !`;
  } else {
    level = 'Échec';
    detailMessage = `Échec de l'action (Jet: ${roll} > ${target}%).`;
  }

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  return {
    diceRoll: roll,
    targetSkill: target,
    level,
    critThreshold,
    specialThreshold,
    fumbleThreshold,
    skillName,
    characterName,
    timestamp: timeStr,
    detailMessage,
  };
}

export function rollHitLocation(): { roll: number; locationId: string; locationName: string } {
  const roll = rollD20();
  let locationId = 'poitrine';
  let locationName = 'Poitrine';

  if (roll >= 1 && roll <= 4) {
    locationId = 'jambe_droite';
    locationName = 'Jambe Droite';
  } else if (roll >= 5 && roll <= 8) {
    locationId = 'jambe_gauche';
    locationName = 'Jambe Gauche';
  } else if (roll >= 9 && roll <= 11) {
    locationId = 'abdomen';
    locationName = 'Abdomen';
  } else if (roll === 12) {
    locationId = 'poitrine';
    locationName = 'Poitrine';
  } else if (roll >= 13 && roll <= 15) {
    locationId = 'bras_droit';
    locationName = 'Bras Droit';
  } else if (roll >= 16 && roll <= 18) {
    locationId = 'bras_gauche';
    locationName = 'Bras Gauche';
  } else if (roll >= 19 && roll <= 20) {
    locationId = 'tete';
    locationName = 'Tête';
  }

  return { roll, locationId, locationName };
}

export function calculateResistanceChance(activeVal: number, passiveVal: number): number {
  // RQG resistance formula: 50% + (Active - Passive) * 5%
  const chance = 50 + (activeVal - passiveVal) * 5;
  return Math.min(95, Math.max(5, chance));
}
