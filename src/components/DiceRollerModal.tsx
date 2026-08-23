import React, { useState } from 'react';
import { Dice1, Dice3, Dice5, Dices, X, RefreshCw, Sparkles, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';
import { evaluateD100, rollDice, rollHitLocation, parseAndRollDiceFormula, calculateResistanceChance } from '../utils/dice';
import { RollResult } from '../types/runequest';

interface DiceRollerModalProps {
  isOpen: boolean;
  onClose: () => void;
  rollHistory: RollResult[];
  onAddRoll: (result: RollResult) => void;
}

export const DiceRollerModal: React.FC<DiceRollerModalProps> = ({
  isOpen,
  onClose,
  rollHistory,
  onAddRoll,
}) => {
  const [targetSkill, setTargetSkill] = useState<number>(65);
  const [skillLabel, setSkillLabel] = useState<string>('Attaque Épée large');
  const [customFormula, setCustomFormula] = useState<string>('1D8+1+1D4');
  const [formulaResult, setFormulaResult] = useState<{ total: number; rolls: number[]; formula: string } | null>(null);
  
  // Opposed Test
  const [activePow, setActivePow] = useState<number>(14);
  const [passivePow, setPassivePow] = useState<number>(12);
  const [opposedResult, setOpposedResult] = useState<{ chance: number; roll: number; success: boolean } | null>(null);

  // Hit location test
  const [hitLocResult, setHitLocResult] = useState<{ roll: number; locationName: string } | null>(null);

  if (!isOpen) return null;

  const handleRollD100 = () => {
    const roll = rollDice(100);
    const result = evaluateD100(roll, targetSkill, skillLabel);
    onAddRoll(result);
  };

  const handleRollFormula = () => {
    const res = parseAndRollDiceFormula(customFormula);
    setFormulaResult(res);
  };

  const handleRollHitLocation = () => {
    const loc = rollHitLocation();
    setHitLocResult({ roll: loc.roll, locationName: loc.locationName });
  };

  const handleRollOpposed = () => {
    const chance = calculateResistanceChance(activePow, passivePow);
    const roll = rollDice(100);
    const success = roll <= chance;
    setOpposedResult({ chance, roll, success });
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Critique':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/60 px-2 py-0.5 rounded font-bold">✨ Réussite Critique (01-{Math.round(targetSkill/20)}%)</span>;
      case 'Spéciale':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 px-2 py-0.5 rounded font-bold">🌟 Spéciale (01-{Math.round(targetSkill/5)}%)</span>;
      case 'Réussite':
        return <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 px-2 py-0.5 rounded font-bold">✓ Réussite</span>;
      case 'Maladresse':
        return <span className="bg-red-950 text-red-400 border border-red-600 px-2 py-0.5 rounded font-bold">💥 MALADRESSE (96-100%)</span>;
      default:
        return <span className="bg-rose-500/20 text-rose-300 border border-rose-500/60 px-2 py-0.5 rounded font-bold">✕ Échec</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-amber-600/40 rounded-xl shadow-2xl shadow-amber-950/50 text-stone-100 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 bg-stone-950/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-900/30 border border-amber-600/40 text-amber-400">
              <Dices className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-amber-200">Simulateur de Dés Gloranthien</h2>
              <p className="text-xs text-stone-400">Table de résolution D100, Dégâts, Localisations & Opposition RQG</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Tabs / Sections */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Section 1: Main D100 Roll */}
          <div className="p-4 rounded-lg bg-stone-950/60 border border-amber-600/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-amber-300 text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" /> Jet de Compétence D100 (% de Réussite)
              </span>
              <span className="text-xs text-stone-400">Critique: ≤ {Math.max(1, Math.round(targetSkill / 20))}% | Spéciale: ≤ {Math.max(1, Math.round(targetSkill / 5))}%</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-stone-400 block mb-1">Nom du Test / Compétence</label>
                <input
                  type="text"
                  value={skillLabel}
                  onChange={(e) => setSkillLabel(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded px-3 py-1.5 text-sm text-stone-200 focus:border-amber-500 focus:outline-none"
                  placeholder="Ex: Épée large, Esquive..."
                />
              </div>
              <div>
                <label className="text-xs text-stone-400 block mb-1">Seuil de Compétence (%) : {targetSkill}%</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="150"
                    value={targetSkill}
                    onChange={(e) => setTargetSkill(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="1"
                    max="250"
                    value={targetSkill}
                    onChange={(e) => setTargetSkill(Number(e.target.value))}
                    className="w-16 bg-stone-800 border border-stone-700 rounded px-2 py-1 text-center font-mono font-bold text-amber-300 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleRollD100}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold font-serif shadow-lg shadow-amber-900/40 flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-95"
              >
                <Dices className="h-5 w-5 text-stone-950" /> Lancer D100
              </button>
            </div>
          </div>

          {/* Section 2: Quick Damage & Formula + Hit Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Custom Formula */}
            <div className="p-4 rounded-lg bg-stone-950/60 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-amber-400 text-sm flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-orange-400" /> Dégâts & Formule
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customFormula}
                  onChange={(e) => setCustomFormula(e.target.value)}
                  className="flex-1 bg-stone-800 border border-stone-700 rounded px-3 py-1.5 text-sm font-mono text-stone-200"
                  placeholder="1D8+1, 2D6+2..."
                />
                <button
                  onClick={handleRollFormula}
                  className="px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-600 text-sm font-bold flex items-center gap-1"
                >
                  Lancer
                </button>
              </div>
              {formulaResult && (
                <div className="p-2.5 rounded bg-stone-900 border border-amber-500/40 flex items-center justify-between">
                  <span className="text-xs text-stone-400">Résultat [{formulaResult.formula}] :</span>
                  <span className="text-xl font-mono font-bold text-amber-300">
                    {formulaResult.total} <span className="text-xs text-stone-400 font-normal">({formulaResult.rolls.join(', ')})</span>
                  </span>
                </div>
              )}
            </div>

            {/* Hit Location */}
            <div className="p-4 rounded-lg bg-stone-950/60 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-amber-400 text-sm flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" /> Localisation D20
                </span>
                <button
                  onClick={handleRollHitLocation}
                  className="px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-stone-600 text-xs font-bold"
                >
                  Tirer D20
                </button>
              </div>
              <div className="p-2.5 rounded bg-stone-900 border border-stone-700 min-h-[50px] flex items-center justify-between">
                {hitLocResult ? (
                  <>
                    <span className="text-xs text-stone-400">Jet D20 = {hitLocResult.roll} :</span>
                    <span className="text-sm font-bold text-emerald-300">{hitLocResult.locationName}</span>
                  </>
                ) : (
                  <span className="text-xs text-stone-500 italic">Cliquez sur Tirer D20 pour obtenir une localisation</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Opposed Resistance (POU vs POU / STR vs SIZ) */}
          <div className="p-4 rounded-lg bg-stone-950/60 border border-stone-800 space-y-3">
            <span className="font-serif font-bold text-stone-300 text-sm">
              Table de Résistance Opposée (ex: POU vs POU, FOR vs TAI)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-center">
              <div>
                <label className="text-xs text-stone-400 block mb-1">Valeur Active</label>
                <input
                  type="number"
                  value={activePow}
                  onChange={(e) => setActivePow(Number(e.target.value))}
                  className="w-full bg-stone-800 border border-stone-700 rounded px-2 py-1 text-center font-mono font-bold text-amber-300 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-stone-400 block mb-1">Valeur Passive</label>
                <input
                  type="number"
                  value={passivePow}
                  onChange={(e) => setPassivePow(Number(e.target.value))}
                  className="w-full bg-stone-800 border border-stone-700 rounded px-2 py-1 text-center font-mono font-bold text-stone-300 text-sm"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <button
                  onClick={handleRollOpposed}
                  className="w-full py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-amber-400 border border-amber-600/40 text-xs font-bold"
                >
                  Tester Opposition
                </button>
              </div>
            </div>
            {opposedResult && (
              <div className="p-2.5 rounded bg-stone-900 border border-stone-700 text-xs flex items-center justify-between">
                <span>Chance calculée : <strong className="text-amber-300">{opposedResult.chance}%</strong> (Jet: {opposedResult.roll})</span>
                <span className={`font-bold px-2 py-0.5 rounded ${opposedResult.success ? 'bg-emerald-950 text-emerald-300 border border-emerald-600' : 'bg-rose-950 text-rose-300 border border-rose-600'}`}>
                  {opposedResult.success ? '✓ Opposition Réussie' : '✕ Échec Opposition'}
                </span>
              </div>
            )}
          </div>

          {/* Section 4: History */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Historique des Lancers Récents</h3>
            {rollHistory.length === 0 ? (
              <p className="text-xs text-stone-500 italic">Aucun jet enregistré pour l'instant.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {rollHistory.slice(0, 10).map((r, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-stone-950 border border-stone-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-stone-400">[{r.timestamp}]</span>
                      <span className="font-semibold text-stone-200">{r.skillName || 'Jet D100'} :</span>
                      <span className="font-mono font-bold text-amber-400">Jet {r.diceRoll}</span>
                      <span className="text-stone-500">(sur {r.targetSkill}%)</span>
                    </div>
                    <div>{getLevelBadge(r.level)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-800 bg-stone-950/80 px-6 py-3 flex justify-between items-center text-xs text-stone-400">
          <span>Règles RuneQuest: Roleplaying in Glorantha</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
