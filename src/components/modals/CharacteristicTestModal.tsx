import React, { useState } from 'react';
import { X, Dices, Swords, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { CharacteristicValues, RollResult } from '../../types/runequest';
import { rollDice, evaluateD100 } from '../../utils/dice';
import { calculateResistanceChance } from '../../utils/rqCalculations';

interface CharacteristicTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  characteristics: CharacteristicValues;
  characterName: string;
  initialStat?: keyof CharacteristicValues;
  onAddRollResult: (res: RollResult) => void;
}

export const CharacteristicTestModal: React.FC<CharacteristicTestModalProps> = ({
  isOpen,
  onClose,
  characteristics,
  characterName,
  initialStat = 'FOR',
  onAddRollResult,
}) => {
  const [selectedStat, setSelectedStat] = useState<keyof CharacteristicValues>(initialStat);
  const [testMode, setTestMode] = useState<'multiplier' | 'opposed'>('multiplier');
  const [multiplier, setMultiplier] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [opposedValue, setOpposedValue] = useState<number>(14);

  if (!isOpen) return null;

  const statNames: { [key in keyof CharacteristicValues]: string } = {
    FOR: 'Force (FOR)',
    CON: 'Constitution (CON)',
    TAI: 'Taille (TAI)',
    INT: 'Intelligence (INT)',
    POU: 'Pouvoir (POU)',
    DEX: 'Dextérité (DEX)',
    CHA: 'Charisme (CHA)',
  };

  const statVal = characteristics[selectedStat];
  const targetThreshold = statVal * multiplier;
  const opposedChance = calculateResistanceChance(statVal, opposedValue);

  const handleRollMultiplier = () => {
    const roll = rollDice(100);
    const difficultyName = 
      multiplier === 5 ? 'Normal (x5)' :
      multiplier === 4 ? 'Difficile (x4)' :
      multiplier === 3 ? 'Très Difficile (x3)' :
      multiplier === 2 ? 'Héroïque (x2)' : 'Quasi-Impossible (x1)';

    const result = evaluateD100(
      roll, 
      targetThreshold, 
      `Test de ${selectedStat} [${difficultyName}]`, 
      characterName
    );
    onAddRollResult(result);
    onClose();
  };

  const handleRollOpposed = () => {
    const roll = rollDice(100);
    const result = evaluateD100(
      roll, 
      opposedChance, 
      `Résistance ${selectedStat} (${statVal}) vs (${opposedValue})`, 
      characterName
    );
    onAddRollResult(result);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-stone-900 border-2 border-amber-600/60 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/50 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Dices className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-amber-200">
                Jet de Caractéristique
              </h2>
              <p className="text-xs text-stone-400">
                Lancer un test sous un multiplicateur ou un jet de résistance opposé.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Stat selector buttons */}
          <div>
            <label className="block text-xs font-serif font-bold text-amber-300 mb-1.5">
              Choisir la Caractéristique :
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {(Object.keys(characteristics) as (keyof CharacteristicValues)[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStat(st)}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                    selectedStat === st
                      ? 'border-amber-400 bg-amber-600 text-stone-950 font-bold shadow'
                      : 'border-stone-800 bg-stone-950 text-stone-300 hover:border-stone-700'
                  }`}
                >
                  <span className="text-[10px] block font-serif">{st}</span>
                  <span className="font-mono text-xs">{characteristics[st]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Test Mode Switch */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTestMode('multiplier')}
              className={`py-2 rounded-lg text-xs font-serif font-bold transition cursor-pointer border ${
                testMode === 'multiplier'
                  ? 'bg-amber-600/30 text-amber-300 border-amber-500'
                  : 'bg-stone-950 text-stone-400 border-stone-800'
              }`}
            >
              Multiplicateur (x1 à x5)
            </button>
            <button
              type="button"
              onClick={() => setTestMode('opposed')}
              className={`py-2 rounded-lg text-xs font-serif font-bold transition cursor-pointer border ${
                testMode === 'opposed'
                  ? 'bg-amber-600/30 text-amber-300 border-amber-500'
                  : 'bg-stone-950 text-stone-400 border-stone-800'
              }`}
            >
              Table des Oppositions (vs)
            </button>
          </div>

          {testMode === 'multiplier' ? (
            <div className="space-y-3 p-4 rounded-xl bg-stone-950 border border-stone-800">
              <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
                Degré de Difficulté :
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { mul: 5, label: 'x5 (Normal)' },
                  { mul: 4, label: 'x4 (Difficile)' },
                  { mul: 3, label: 'x3 (Très diff.)' },
                  { mul: 2, label: 'x2 (Héroïque)' },
                  { mul: 1, label: 'x1 (Pur)' },
                ].map(({ mul, label }) => (
                  <button
                    key={mul}
                    type="button"
                    onClick={() => setMultiplier(mul as any)}
                    className={`p-2 rounded-lg text-center text-xs font-mono transition cursor-pointer border ${
                      multiplier === mul
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow'
                        : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="text-[10px] truncate">{label}</div>
                    <div className="font-bold">{statVal * mul}%</div>
                  </button>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-between text-xs">
                <span className="text-stone-300">
                  Test de <strong>{statNames[selectedStat]}</strong> sous :
                </span>
                <span className="font-mono font-bold text-base text-amber-300 bg-stone-950 px-2 py-0.5 rounded border border-amber-600/40">
                  {targetThreshold}%
                </span>
              </div>

              <button
                type="button"
                onClick={handleRollMultiplier}
                className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-serif font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition"
              >
                <Dices className="w-4 h-4" /> Lancer le Test D100 ({targetThreshold}%)
              </button>
            </div>
          ) : (
            <div className="space-y-3 p-4 rounded-xl bg-stone-950 border border-stone-800">
              <div>
                <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
                  Valeur de la Caractéristique Opposée (Adversaire / Sort / Poison) :
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={opposedValue}
                  onChange={(e) => setOpposedValue(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="text-stone-300">
                    {selectedStat} ({statVal}) vs Adversaire ({opposedValue})
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono">
                    Formule : 50% + ({statVal} - {opposedValue}) × 5%
                  </div>
                </div>
                <span className="font-mono font-bold text-base text-emerald-400 bg-stone-950 px-2 py-0.5 rounded border border-emerald-700/50">
                  {opposedChance}%
                </span>
              </div>

              <button
                type="button"
                onClick={handleRollOpposed}
                className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-serif font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition"
              >
                <Swords className="w-4 h-4" /> Résoudre l'Opposition D100 ({opposedChance}%)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
