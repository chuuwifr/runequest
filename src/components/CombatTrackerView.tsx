import React, { useState } from 'react';
import { Swords, Plus, Trash2, Shield, Heart, Zap, RefreshCw, Dices, ChevronRight, AlertTriangle } from 'lucide-react';
import { rollDice, rollHitLocation, parseAndRollDiceFormula } from '../utils/dice';

interface Combatant {
  id: string;
  name: string;
  type: 'PJ' | 'PNJ' | 'Monstre';
  strikeRank: number;
  hpCurrent: number;
  hpMax: number;
  armorPoints: number;
  weapon: string;
  damage: string;
  notes?: string;
  hasActed: boolean;
}

export const CombatTrackerView: React.FC = () => {
  const [round, setRound] = useState(1);
  const [currentSr, setCurrentSr] = useState(1);
  const [combatants, setCombatants] = useState<Combatant[]>([
    {
      id: 'c1',
      name: 'Vasana (Bison Vrokiti)',
      type: 'PJ',
      strikeRank: 3,
      hpCurrent: 15,
      hpMax: 15,
      armorPoints: 5,
      weapon: 'Épée large en bronze',
      damage: '1D8+1+1D4',
      hasActed: false,
    },
    {
      id: 'c2',
      name: 'Harmast le Chasseur',
      type: 'PJ',
      strikeRank: 2,
      hpCurrent: 14,
      hpMax: 14,
      armorPoints: 3,
      weapon: 'Arc composite heortien',
      damage: '1D8+1',
      hasActed: false,
    },
    {
      id: 'c3',
      name: 'Phalange Lunaire Tarshite',
      type: 'PNJ',
      strikeRank: 4,
      hpCurrent: 13,
      hpMax: 13,
      armorPoints: 6,
      weapon: 'Pique d\'hoplite & Bouclier',
      damage: '1D10+1+1D4',
      hasActed: false,
    },
    {
      id: 'c4',
      name: 'Broo Voleur de Bétail',
      type: 'Monstre',
      strikeRank: 5,
      hpCurrent: 11,
      hpMax: 11,
      armorPoints: 2,
      weapon: 'Gourdin à pointes & Morsure',
      damage: '1D6+1+1D4',
      hasActed: false,
    },
  ]);

  // Form for new combatant
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'PJ' | 'PNJ' | 'Monstre'>('PNJ');
  const [newSr, setNewSr] = useState(3);
  const [newHp, setNewHp] = useState(12);
  const [newArmor, setNewArmor] = useState(4);
  const [newWeapon, setNewWeapon] = useState('Épée courte & Bouclier');
  const [newDamage, setNewDamage] = useState('1D6+1');

  // Combat Log
  const [combatLogs, setCombatLogs] = useState<string[]>([
    '⚔️ Début du Round 1 : Les combattants préparent leurs armes.',
  ]);

  const handleNextSr = () => {
    if (currentSr < 12) {
      setCurrentSr(currentSr + 1);
    } else {
      // New Round
      setRound(round + 1);
      setCurrentSr(1);
      setCombatants(combatants.map((c) => ({ ...c, hasActed: false })));
      setCombatLogs((prev) => [`⚔️ Début du Round ${round + 1}`, ...prev]);
    }
  };

  const handleAddCombatant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newC: Combatant = {
      id: 'c_' + Date.now(),
      name: newName,
      type: newType,
      strikeRank: Number(newSr),
      hpCurrent: Number(newHp),
      hpMax: Number(newHp),
      armorPoints: Number(newArmor),
      weapon: newWeapon,
      damage: newDamage,
      hasActed: false,
    };

    setCombatants([...combatants, newC]);
    setNewName('');
    setCombatLogs((prev) => [`+ ${newC.name} (${newC.type}) rejoint le combat au SR ${newC.strikeRank}.`, ...prev]);
  };

  const handleDeleteCombatant = (id: string) => {
    setCombatants(combatants.filter((c) => c.id !== id));
  };

  const handleApplyDamage = (c: Combatant) => {
    const dmgRoll = parseAndRollDiceFormula(c.damage);
    const loc = rollHitLocation();
    const netDmg = Math.max(0, dmgRoll.total - c.armorPoints);

    const logEntry = `🎲 ${c.name} frappe avec [${c.weapon}] ! Dégâts bruts: ${dmgRoll.total} (${dmgRoll.rolls.join('+')}) sur ${loc.locationName} (D20=${loc.roll}). Après armure (${c.armorPoints} PA) = ${netDmg} dégâts effectifs.`;
    setCombatLogs((prev) => [logEntry, ...prev]);
  };

  const handleHpDelta = (id: string, delta: number) => {
    setCombatants(
      combatants.map((c) => {
        if (c.id === id) {
          const next = Math.max(0, Math.min(c.hpMax, c.hpCurrent + delta));
          return { ...c, hpCurrent: next };
        }
        return c;
      })
    );
  };

  // Sort combatants by SR
  const sortedCombatants = [...combatants].sort((a, b) => a.strikeRank - b.strikeRank);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 text-stone-100 font-sans">
      {/* Header Banner & Round Manager */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border border-amber-800/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-900/30 border border-amber-600/50 text-amber-400">
              <Swords className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-amber-200">
                Gestionnaire de Combat & Rangs d'Action
              </h1>
              <p className="text-xs text-stone-400">
                Organisation de l'initiative par Strike Rank (SR 1 à 12), suivi des points de vie et calcul des dégâts localisés.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-stone-950 border border-amber-600/40 text-center">
              <div className="text-[10px] text-stone-400 uppercase font-semibold">Round de Combat</div>
              <strong className="text-xl font-mono text-amber-300">Round {round}</strong>
            </div>

            <button
              onClick={handleNextSr}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-serif font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer transition transform hover:scale-105"
            >
              <span>{currentSr < 12 ? `Avancer au SR ${currentSr + 1}` : 'Passer au Round Suivant'}</span>
              <ChevronRight className="h-4 w-4 text-stone-950" />
            </button>
          </div>
        </div>

        {/* Strike Rank Timeline (1 to 12) */}
        <div className="pt-2 border-t border-stone-800">
          <div className="text-xs font-serif font-bold text-stone-400 mb-2 flex items-center justify-between">
            <span>Chronologie d'Initiative (Strike Ranks 1 à 12)</span>
            <span className="text-amber-300">Rang Actuel : SR {currentSr}</span>
          </div>

          <div className="grid grid-cols-12 gap-1 sm:gap-1.5 text-center">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((srNum) => {
              const isActive = srNum === currentSr;
              const hasActors = combatants.some((c) => c.strikeRank === srNum);
              return (
                <div
                  key={srNum}
                  onClick={() => setCurrentSr(srNum)}
                  className={`p-2 rounded-lg border text-xs font-mono font-bold transition cursor-pointer flex flex-col items-center justify-center ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-md ring-2 ring-amber-400'
                      : hasActors
                      ? 'bg-amber-950/40 text-amber-300 border-amber-700'
                      : 'bg-stone-950/60 text-stone-500 border-stone-800'
                  }`}
                >
                  <span className="text-[10px]">SR</span>
                  <span>{srNum}</span>
                  {hasActors && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1"></span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Combatants & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Combatants List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-base text-amber-200">
              Combattants Engagés ({sortedCombatants.length})
            </h2>
            <button
              onClick={() => {
                setRound(1);
                setCurrentSr(1);
                setCombatants(combatants.map((c) => ({ ...c, hpCurrent: c.hpMax, hasActed: false })));
              }}
              className="text-xs text-stone-400 hover:text-amber-300 flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Réinitialiser
            </button>
          </div>

          <div className="space-y-3">
            {sortedCombatants.map((c) => {
              const isCurrentTurn = c.strikeRank === currentSr;
              const isDead = c.hpCurrent <= 0;

              return (
                <div
                  key={c.id}
                  className={`p-4 rounded-xl border transition space-y-3 shadow-md ${
                    isCurrentTurn
                      ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-400/50'
                      : isDead
                      ? 'bg-stone-950/50 border-red-900/60 opacity-60'
                      : 'bg-stone-900/80 border-stone-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                          c.type === 'PJ'
                            ? 'bg-cyan-950/60 text-cyan-300 border-cyan-700'
                            : c.type === 'Monstre'
                            ? 'bg-red-950/60 text-red-300 border-red-700'
                            : 'bg-stone-800 text-amber-300 border-stone-700'
                        }`}
                      >
                        SR {c.strikeRank}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-bold text-sm text-stone-100">{c.name}</h3>
                          <span className="text-[10px] text-stone-400">({c.type})</span>
                        </div>
                        <p className="text-[11px] text-stone-400">
                          {c.weapon} ({c.damage}) • Armure : <strong className="text-amber-300">{c.armorPoints} PA</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* HP controls */}
                      <div className="flex items-center gap-1.5 p-1 rounded bg-stone-950 border border-stone-800">
                        <button
                          onClick={() => handleHpDelta(c.id, -1)}
                          className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300"
                        >
                          -1
                        </button>
                        <span className={`font-mono text-xs font-bold px-1.5 ${isDead ? 'text-red-400' : 'text-emerald-400'}`}>
                          {c.hpCurrent}/{c.hpMax} PV
                        </span>
                        <button
                          onClick={() => handleHpDelta(c.id, 1)}
                          className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300"
                        >
                          +1
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteCombatant(c.id)}
                        className="p-1.5 rounded text-stone-500 hover:text-red-400"
                        title="Retirer du combat"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs">
                    <button
                      onClick={() => handleApplyDamage(c)}
                      className="px-3 py-1.5 rounded bg-amber-700 hover:bg-amber-600 text-stone-950 font-serif font-bold flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Dices className="h-3.5 w-3.5" /> Lancer Attaque & Dégâts
                    </button>

                    {isDead && (
                      <span className="text-xs text-red-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" /> Hors de Combat / Inconscient
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Add Combatant Form & Combat Log */}
        <div className="lg:col-span-4 space-y-6">
          {/* Add Combatant Form */}
          <form onSubmit={handleAddCombatant} className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-3">
            <h3 className="font-serif font-bold text-sm text-amber-200 flex items-center gap-2">
              <Plus className="h-4 w-4 text-amber-400" /> Ajouter un Combattant
            </h3>

            <div>
              <label className="text-[11px] text-stone-400 block mb-0.5">Nom</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Éclaireur Troll, Cavalier..."
                className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 text-xs text-stone-200"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-stone-400 block mb-0.5">Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-2 py-1.5 text-xs text-stone-200"
                >
                  <option value="PJ">PJ</option>
                  <option value="PNJ">PNJ</option>
                  <option value="Monstre">Monstre</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-stone-400 block mb-0.5">SR Total (1-12)</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={newSr}
                  onChange={(e) => setNewSr(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-2 py-1.5 text-xs font-mono text-amber-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-stone-400 block mb-0.5">PV Max</label>
                <input
                  type="number"
                  value={newHp}
                  onChange={(e) => setNewHp(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-2 py-1.5 text-xs font-mono text-stone-200"
                />
              </div>
              <div>
                <label className="text-[11px] text-stone-400 block mb-0.5">Armure (PA)</label>
                <input
                  type="number"
                  value={newArmor}
                  onChange={(e) => setNewArmor(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-2 py-1.5 text-xs font-mono text-stone-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-stone-950 font-serif font-bold text-xs shadow flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Ajouter au Combat
            </button>
          </form>

          {/* Combat Log */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
            <h3 className="font-serif font-bold text-xs text-amber-300 uppercase tracking-wider">
              Journal des Événements de Combat
            </h3>
            <div className="space-y-1.5 max-h-56 overflow-y-auto text-xs text-stone-300 font-mono pr-1">
              {combatLogs.map((log, i) => (
                <div key={i} className="p-2 rounded bg-stone-900 border border-stone-800/80 leading-relaxed text-[11px]">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
