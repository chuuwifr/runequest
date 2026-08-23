import React, { useState } from 'react';
import { Users, Dices, Copy, Swords, Shield, Heart, Zap, Sparkles, Check, Flame } from 'lucide-react';
import { rollDice, parseAndRollDiceFormula } from '../utils/dice';
import { calculateDerivedAttributes, generateHitLocations } from '../utils/rqCalculations';
import { RuneBadge } from './RuneBadge';

interface GeneratedNpc {
  id: string;
  name: string;
  archetype: string;
  homeland: string;
  cult: string;
  chars: { FOR: number; CON: number; TAI: number; INT: number; POU: number; DEX: number; CHA: number };
  hpMax: number;
  mpMax: number;
  damageBonus: string;
  srDex: number;
  srSize: number;
  armorPoints: number;
  weapons: { name: string; damage: string; skill: number; sr: number }[];
  spells: string[];
  passions: string[];
}

export const NpcGeneratorView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [npcList, setNpcList] = useState<GeneratedNpc[]>([
    {
      id: 'npc_1',
      name: 'Varkor le Farouche',
      archetype: 'Guerrier Sartarite',
      homeland: 'Sartar (Tribu Colymar)',
      cult: 'Orlanth Aventurier',
      chars: { FOR: 15, CON: 14, TAI: 13, INT: 12, POU: 13, DEX: 14, CHA: 11 },
      hpMax: 14,
      mpMax: 13,
      damageBonus: '+1D4',
      srDex: 3,
      srSize: 2,
      armorPoints: 5,
      weapons: [
        { name: 'Épée large en bronze', damage: '1D8+1+1D4', skill: 70, sr: 7 },
        { name: 'Bouclier large', damage: '1D6+1D4', skill: 65, sr: 8 },
        { name: 'Javelot de jet', damage: '1D10', skill: 55, sr: 3 },
      ],
      spells: ['Lame de Feu (4 PM)', 'Protection 2 (2 PM)', 'Mobilité (1 PM)'],
      passions: ['Loyauté (Sartar) 70%', 'Haine (Empire Lunaire) 75%'],
    },
    {
      id: 'npc_2',
      name: 'Krogg Crâne-Fendu',
      archetype: 'Troll Sombre Guerrier (Uz)',
      homeland: 'Monts de Gué-du-Danger',
      cult: 'Kyger Litor / Zorak Zoran',
      chars: { FOR: 21, CON: 18, TAI: 20, INT: 10, POU: 12, DEX: 11, CHA: 8 },
      hpMax: 19,
      mpMax: 12,
      damageBonus: '+2D6',
      srDex: 3,
      srSize: 1,
      armorPoints: 6,
      weapons: [
        { name: 'Masse de plomb à 2 mains', damage: '2D6+2+2D6', skill: 75, sr: 5 },
        { name: 'Morsure de troll', damage: '1D8+2D6', skill: 60, sr: 7 },
      ],
      spells: ['Ombre Protectrice (2 PM)', 'Force (2 PM)', 'Démoralisation (2 PM)'],
      passions: ['Haine (Soleil / Elfes) 80%', 'Loyauté (Matriarche Uz) 70%'],
    },
    {
      id: 'npc_3',
      name: 'Centurion Marcus Vorenus',
      archetype: 'Officier de la Phalange Lunaire',
      homeland: 'Pelor / Tarsh Lunaire',
      cult: 'Les Sept Mères / Yanafal Tarnils',
      chars: { FOR: 14, CON: 15, TAI: 14, INT: 15, POU: 15, DEX: 13, CHA: 14 },
      hpMax: 15,
      mpMax: 15,
      damageBonus: '+1D4',
      srDex: 3,
      srSize: 2,
      armorPoints: 6,
      weapons: [
        { name: 'Cimeterre d\'officier', damage: '1D8+1+1D4', skill: 75, sr: 7 },
        { name: 'Bouclier de légion', damage: '1D6+1D4', skill: 70, sr: 8 },
      ],
      spells: ['Glamour (2 PM)', 'Rayon Lunaire (1 PM)', 'Protection 3 (3 PM)'],
      passions: ['Loyauté (Empire Lunaire) 80%', 'Dévotion (Déesse Rouge) 75%'],
    },
    {
      id: 'npc_4',
      name: 'Raskar la Peste',
      archetype: 'Pillard Broo du Chaos',
      homeland: 'Désolation de Balazar',
      cult: 'Thed / Malia (Chaos)',
      chars: { FOR: 12, CON: 16, TAI: 10, INT: 11, POU: 14, DEX: 15, CHA: 6 },
      hpMax: 13,
      mpMax: 14,
      damageBonus: '0',
      srDex: 2,
      srSize: 2,
      armorPoints: 2,
      weapons: [
        { name: 'Épée rouillée empoisonnée', damage: '1D6+1 + Poison POT 12', skill: 55, sr: 6 },
        { name: 'Cornes de bouc', damage: '1D8', skill: 50, sr: 7 },
      ],
      spells: ['Perturbation (1 PM)', 'Peste Insidieuse (2 PM)'],
      passions: ['Haine (Tout ce qui vit) 85%'],
    },
  ]);

  const handleGenerateRandomNpc = (archetypeName: string) => {
    const roll3D6 = () => rollDice(6) + rollDice(6) + rollDice(6);
    const roll2D6Plus6 = () => rollDice(6) + rollDice(6) + 6;

    let c = { FOR: roll3D6(), CON: roll3D6(), TAI: roll2D6Plus6(), INT: roll2D6Plus6(), POU: roll3D6(), DEX: roll3D6(), CHA: roll3D6() };
    let homeland = 'Sartar';
    let cult = 'Orlanth';
    let armor = 4;
    let weapons = [{ name: 'Épée large', damage: '1D8+1', skill: 60, sr: 7 }];
    let spells = ['Soin (1 PM)', 'Protection (2 PM)'];
    let passions = ['Loyauté (Tribu) 60%'];

    if (archetypeName === 'sartar_warrior') {
      c.FOR = Math.max(14, c.FOR);
      armor = 5;
      weapons = [
        { name: 'Épée large en bronze', damage: '1D8+1+1D4', skill: 65 + rollDice(20), sr: 7 },
        { name: 'Bouclier large', damage: '1D6+1D4', skill: 60 + rollDice(15), sr: 8 },
      ];
      spells = ['Lame de Feu (4 PM)', 'Protection 2 (2 PM)'];
      passions = ['Loyauté (Sartar) 75%', 'Haine (Lunaires) 70%'];
    } else if (archetypeName === 'prax_nomad') {
      homeland = 'Prax (Plaines Sauvages)';
      cult = 'Waha / Taureau Tempête';
      armor = 3;
      weapons = [
        { name: 'Lance de monte', damage: '1D10+1+1D4', skill: 70 + rollDice(15), sr: 6 },
        { name: 'Arc composite', damage: '1D8+1', skill: 65 + rollDice(20), sr: 3 },
      ];
      spells = ['Force (2 PM)', 'Flèche Véloce (1 PM)'];
      passions = ['Loyauté (Tribu Nomade) 75%', 'Haine (Chevaux) 60%'];
    } else if (archetypeName === 'lunar_soldier') {
      homeland = 'Tarsh Lunaire';
      cult = 'Les Sept Mères';
      armor = 6;
      weapons = [
        { name: 'Pique d\'hoplite', damage: '1D10+1+1D4', skill: 65 + rollDice(15), sr: 6 },
        { name: 'Cimeterre', damage: '1D8+1+1D4', skill: 60 + rollDice(15), sr: 7 },
      ];
      spells = ['Rayon Lunaire (1 PM)', 'Glamour (2 PM)'];
      passions = ['Loyauté (Empire Lunaire) 75%'];
    }

    const derived = calculateDerivedAttributes(c);
    const newNpc: GeneratedNpc = {
      id: 'npc_' + Date.now(),
      name: `Guerrier ${homeland} #${rollDice(99)}`,
      archetype: archetypeName,
      homeland,
      cult,
      chars: c,
      hpMax: derived.hpMax,
      mpMax: derived.magicPointsMax,
      damageBonus: derived.damageBonus,
      srDex: derived.srDex,
      srSize: derived.srSize,
      armorPoints: armor,
      weapons,
      spells,
      passions,
    };

    setNpcList([newNpc, ...npcList]);
  };

  const handleCopyNpc = (npc: GeneratedNpc) => {
    const text = `=== ${npc.name} (${npc.archetype}) ===\nPatrie: ${npc.homeland} | Culte: ${npc.cult}\nFOR ${npc.chars.FOR} CON ${npc.chars.CON} TAI ${npc.chars.TAI} INT ${npc.chars.INT} POU ${npc.chars.POU} DEX ${npc.chars.DEX} CHA ${npc.chars.CHA}\nPV: ${npc.hpMax} | PM: ${npc.mpMax} | Dégâts: ${npc.damageBonus} | Armure: ${npc.armorPoints} PA\nArmes: ${npc.weapons.map((w) => `${w.name} (${w.skill}%, ${w.damage})`).join(' / ')}\nSorts: ${npc.spells.join(', ')}\nPassions: ${npc.passions.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(npc.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 text-stone-100 font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border border-amber-800/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-900/30 border border-amber-600/50 text-amber-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-amber-200">
                Bestiaire & Générateur de PNJ Gloranthiens
              </h1>
              <p className="text-xs text-stone-400">
                Générez en 1 clic des adversaires équilibrés, monstres et alliés pour vos scénarios.
              </p>
            </div>
          </div>

          {/* Generator Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleGenerateRandomNpc('sartar_warrior')}
              className="px-3 py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-stone-950 font-serif font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Dices className="h-4 w-4" /> + Guerrier Sartarite
            </button>
            <button
              onClick={() => handleGenerateRandomNpc('prax_nomad')}
              className="px-3 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 text-xs font-serif font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Dices className="h-4 w-4" /> + Nomade de Prax
            </button>
            <button
              onClick={() => handleGenerateRandomNpc('lunar_soldier')}
              className="px-3 py-2 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-serif font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Dices className="h-4 w-4" /> + Phalange Lunaire
            </button>
          </div>
        </div>
      </div>

      {/* NPC Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {npcList.map((npc) => (
          <div
            key={npc.id}
            className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-600/50 space-y-4 flex flex-col justify-between transition shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-amber-200">{npc.name}</h3>
                  <p className="text-xs text-stone-400">
                    <strong className="text-stone-300">{npc.archetype}</strong> • {npc.homeland}
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-stone-950 text-amber-300 border border-stone-800">
                  {npc.cult}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs p-2 rounded-lg bg-stone-950 border border-stone-800">
                <div><span className="text-[9px] text-stone-500 block">FOR</span>{npc.chars.FOR}</div>
                <div><span className="text-[9px] text-stone-500 block">CON</span>{npc.chars.CON}</div>
                <div><span className="text-[9px] text-stone-500 block">TAI</span>{npc.chars.TAI}</div>
                <div><span className="text-[9px] text-stone-500 block">INT</span>{npc.chars.INT}</div>
                <div><span className="text-[9px] text-stone-500 block">POU</span>{npc.chars.POU}</div>
                <div><span className="text-[9px] text-stone-500 block">DEX</span>{npc.chars.DEX}</div>
                <div><span className="text-[9px] text-stone-500 block">CHA</span>{npc.chars.CHA}</div>
              </div>

              {/* Core Attributes */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-stone-950 border border-stone-800">
                  <span className="text-[10px] text-stone-500 block">PV Max / PM</span>
                  <strong className="text-emerald-400 font-mono">{npc.hpMax} PV</strong> / <strong className="text-cyan-400 font-mono">{npc.mpMax} PM</strong>
                </div>
                <div className="p-2 rounded bg-stone-950 border border-stone-800">
                  <span className="text-[10px] text-stone-500 block">Bonus Dégâts</span>
                  <strong className="text-amber-400 font-mono">{npc.damageBonus}</strong>
                </div>
                <div className="p-2 rounded bg-stone-950 border border-stone-800">
                  <span className="text-[10px] text-stone-500 block">Armure Corporelle</span>
                  <strong className="text-stone-200 font-mono">{npc.armorPoints} PA</strong>
                </div>
              </div>

              {/* Weapons */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-serif font-bold text-stone-400 uppercase tracking-wider block">Armes & Attaques</span>
                {npc.weapons.map((w, idx) => (
                  <div key={idx} className="p-2 rounded bg-stone-950 border border-stone-800 flex items-center justify-between">
                    <span className="font-bold text-stone-200">{w.name} ({w.damage})</span>
                    <span className="font-mono text-amber-300">{w.skill}% (SR {w.sr})</span>
                  </div>
                ))}
              </div>

              {/* Spells & Passions */}
              <div className="space-y-1 text-xs">
                <div className="text-stone-400">
                  <strong className="text-cyan-300">Sorts :</strong> {npc.spells.join(' • ')}
                </div>
                <div className="text-stone-400">
                  <strong className="text-amber-300">Passions :</strong> {npc.passions.join(' • ')}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
              <button
                onClick={() => handleCopyNpc(npc)}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-serif font-bold flex items-center gap-1.5"
              >
                {copiedId === npc.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedId === npc.id ? 'Copié !' : 'Copier Statblock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
