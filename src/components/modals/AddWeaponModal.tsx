import React, { useState } from 'react';
import { X, Plus, Swords, Search, BookOpen, Shield, Check } from 'lucide-react';
import { Weapon } from '../../types/runequest';
import { STANDARD_WEAPONS_CATALOG } from '../../data/equipmentAndItems';

interface AddWeaponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWeapon: (weapon: Weapon) => void;
  existingSkillNames: string[];
}

export const AddWeaponModal: React.FC<AddWeaponModalProps> = ({
  isOpen,
  onClose,
  onAddWeapon,
  existingSkillNames,
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');
  const [search, setSearch] = useState('');

  // Custom Form state
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<Weapon['category']>('Corps à corps');
  const [customSr, setCustomSr] = useState<number>(2);
  const [customDamage, setCustomDamage] = useState('1D8+1');
  const [customHasDb, setCustomHasDb] = useState(true);
  const [customHp, setCustomHp] = useState<number>(10);
  const [customSkillName, setCustomSkillName] = useState('Épée Large 1M');
  const [customRange, setCustomRange] = useState('');
  const [customNotes, setCustomNotes] = useState('');

  if (!isOpen) return null;

  const filteredWeapons = STANDARD_WEAPONS_CATALOG.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.skillName.toLowerCase().includes(search.toLowerCase()) ||
    (w.notes && w.notes.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelectPreset = (preset: typeof STANDARD_WEAPONS_CATALOG[0]) => {
    const newWeapon: Weapon = {
      id: `wep_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      ...preset,
    };
    onAddWeapon(newWeapon);
    onClose();
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newWeapon: Weapon = {
      id: `wep_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: customName.trim(),
      category: customCategory,
      sr: Number(customSr) || 2,
      damage: customDamage.trim() || '1D6',
      hasDamageBonus: customHasDb,
      hpMax: Number(customHp) || 10,
      hpCurrent: Number(customHp) || 10,
      skillName: customSkillName.trim() || 'Armes',
      range: customRange.trim() || undefined,
      notes: customNotes.trim() || undefined,
    };

    onAddWeapon(newWeapon);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-stone-900 border-2 border-amber-600/60 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/50 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-amber-200">
                Équiper une Arme ou un Bouclier
              </h2>
              <p className="text-xs text-stone-400">
                Armurerie de bronze gloranthienne, arcs de corne, boucliers d'hoplite et armes custom.
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

        {/* Tab Toggle */}
        <div className="flex gap-2 p-1 rounded-xl bg-stone-950 border border-stone-800 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('preset')}
            className={`flex-1 py-2 rounded-lg font-serif text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'preset'
                ? 'bg-amber-600 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Armurerie Canonique ({STANDARD_WEAPONS_CATALOG.length} armes)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2 rounded-lg font-serif text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-amber-600 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Forger une Arme sur Mesure
          </button>
        </div>

        {activeTab === 'preset' ? (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une arme (épée, lance, arc, hache, bouclier...)"
                className="w-full bg-stone-950 border border-stone-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Weapon Presets Grid */}
            <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
              {filteredWeapons.map((weapon, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 hover:border-amber-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif font-bold text-xs text-amber-200">{weapon.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-900 text-stone-400 border border-stone-800">
                        {weapon.category}
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold">
                        Dégâts : {weapon.damage} {weapon.hasDamageBonus ? '+ BD' : ''}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">
                        SR : {weapon.sr} | PV : {weapon.hpMax}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Compétence : <strong className="text-stone-300">{weapon.skillName}</strong> {weapon.notes ? `— ${weapon.notes}` : ''}
                    </p>
                  </div>

                  <button
                    onClick={() => handleSelectPreset(weapon)}
                    className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-stone-950 text-xs font-serif font-bold transition flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap self-end sm:self-center shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" /> Équiper
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateCustom} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
                  Nom de l'arme / bouclier *
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="ex: Kopis sartarite, Lance du Tonnerre, Bouclier de fer..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
                  Catégorie *
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Corps à corps">Corps à corps</option>
                  <option value="Distance">Distance / Projectile</option>
                  <option value="Bouclier">Bouclier / Parade</option>
                  <option value="Arme naturelle">Arme naturelle / Bête</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
                  Formule de Dégâts *
                </label>
                <input
                  type="text"
                  required
                  value={customDamage}
                  onChange={(e) => setCustomDamage(e.target.value)}
                  placeholder="ex: 1D8+1, 2D6, 1D10+2, 1D4..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
                  Rang d'Action d'Arme (SR d'Arme)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={customSr}
                  onChange={(e) => setCustomSr(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
                  Compétence Liée *
                </label>
                <input
                  type="text"
                  required
                  value={customSkillName}
                  onChange={(e) => setCustomSkillName(e.target.value)}
                  placeholder="ex: Épée Large 1M, Hache, Arc composite..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
                  Points de Vie de l'Arme / Solidité (PV)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={customHp}
                  onChange={(e) => setCustomHp(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="db_check"
                checked={customHasDb}
                onChange={(e) => setCustomHasDb(e.target.checked)}
                className="rounded border-stone-700 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="db_check" className="text-xs text-stone-300 cursor-pointer">
                Bénéficie du Bonus aux Dégâts (BD) de l'aventurier
              </label>
            </div>

            <div>
              <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
                Notes & Propriétés spéciales (Portée, effets...)
              </label>
              <input
                type="text"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="ex: Portée 80m, Transperce les armures de cuir, etc."
                className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="pt-3 border-t border-stone-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-serif font-bold transition cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-serif font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" /> Forger & Équiper
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
