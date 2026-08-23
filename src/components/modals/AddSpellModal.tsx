import React, { useState } from 'react';
import { X, Plus, Search, BookOpen, Crown, Zap, Sparkles, Check, Flame } from 'lucide-react';
import { Spell, RuneType } from '../../types/runequest';
import { SPELLS_DATABASE } from '../../data/spells';
import { RuneBadge } from '../RuneBadge';

interface AddSpellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSpell: (spell: Spell) => void;
  existingSpellIds: string[];
}

export const AddSpellModal: React.FC<AddSpellModalProps> = ({
  isOpen,
  onClose,
  onAddSpell,
  existingSpellIds,
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('Tous');

  // Custom Form state
  const [customName, setCustomName] = useState('');
  const [customEnglishName, setCustomEnglishName] = useState('');
  const [customType, setCustomType] = useState<Spell['type']>('Esprit');
  const [customRune, setCustomRune] = useState<RuneType | ''>('');
  const [customCost, setCustomCost] = useState('1 PM');
  const [customRange, setCustomRange] = useState('Toucher');
  const [customDuration, setCustomDuration] = useState('15 min');
  const [customIsStackable, setCustomIsStackable] = useState(false);
  const [customDescription, setCustomDescription] = useState('');

  if (!isOpen) return null;

  const runesList: RuneType[] = [
    'Air', 'Terre', 'Feu', 'Eau', 'Ténèbres', 'Lune',
    'Mort', 'Fertilité', 'Harmonie', 'Désaccord', 'Vérité', 'Illusion',
    'Stase', 'Mouvement', 'Homme', 'Bête', 'Esprit', 'Magie', 'Maîtrise'
  ];

  const filteredSpells = SPELLS_DATABASE.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.englishName && s.englishName.toLowerCase().includes(search.toLowerCase())) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'Tous' || s.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleSelectPreset = (spell: Spell) => {
    onAddSpell(spell);
    onClose();
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newSpell: Spell = {
      id: `spell_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: customName.trim(),
      englishName: customEnglishName.trim() || undefined,
      type: customType,
      rune: (customRune as RuneType) || undefined,
      cost: customCost.trim() || '1 PM',
      range: customRange.trim() || 'Toucher',
      duration: customDuration.trim() || '15 min',
      isStackable: customIsStackable,
      description: customDescription.trim() || 'Sortilège invoqué selon les rites divins et chamaniques.',
    };

    onAddSpell(newSpell);
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
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-amber-200">
                Inscrire un Sort dans le Grimoire
              </h2>
              <p className="text-xs text-stone-400">
                Apprenez un sort canonique de Glorantha ou inventez un mystère runique unique.
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
                ? 'bg-cyan-700 text-stone-100 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Grimoire Canonique de Glorantha ({SPELLS_DATABASE.length} sorts)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2 rounded-lg font-serif text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-cyan-700 text-stone-100 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Créer un Sort Sur Mesure
          </button>
        </div>

        {activeTab === 'preset' ? (
          <div className="space-y-4">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-2 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher par nom, effet, description..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex gap-1">
                {['Tous', 'Esprit', 'Runique', 'Sorcellerie'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-serif transition cursor-pointer ${
                      selectedType === t
                        ? 'bg-amber-600/40 text-amber-300 border border-amber-500'
                        : 'bg-stone-950 text-stone-400 border border-stone-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Spells List */}
            <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
              {filteredSpells.map((spell) => {
                const alreadyHas = existingSpellIds.includes(spell.id) || existingSpellIds.includes(spell.name);
                return (
                  <div
                    key={spell.id}
                    className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 hover:border-cyan-600/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-serif font-bold text-xs text-amber-200">{spell.name}</span>
                        {spell.englishName && (
                          <span className="text-[10px] text-stone-500 font-mono">({spell.englishName})</span>
                        )}
                        <span className={`text-[9px] px-1.5 py-0.2 rounded border ${
                          spell.type === 'Runique' ? 'bg-amber-950 text-amber-300 border-amber-600' :
                          spell.type === 'Esprit' ? 'bg-cyan-950 text-cyan-300 border-cyan-600' :
                          'bg-purple-950 text-purple-300 border-purple-600'
                        }`}>
                          {spell.type}
                        </span>
                        {spell.rune && <RuneBadge rune={spell.rune} size="sm" />}
                        <span className="text-[10px] font-mono text-stone-400">Coût: {spell.cost}</span>
                      </div>
                      <p className="text-[11px] text-stone-300 leading-relaxed line-clamp-2">{spell.description}</p>
                    </div>

                    <button
                      onClick={() => handleSelectPreset(spell)}
                      disabled={alreadyHas}
                      className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap self-end sm:self-center ${
                        alreadyHas
                          ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                          : 'bg-cyan-700 hover:bg-cyan-600 text-white shadow-md'
                      }`}
                    >
                      {alreadyHas ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Appris
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" /> Inscrire
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateCustom} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
                  Nom du sortilège *
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="ex: Foudre d'Orlanth, Bouclier de Terre, Vision Spirituelle..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
                  Type de magie *
                </label>
                <select
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Esprit">✨ Magie des Esprits (Spirit Magic)</option>
                  <option value="Runique">⚡ Magie Runique Divine (Rune Magic)</option>
                  <option value="Sorcellerie">📜 Sorcellerie Érudite (Sorcery)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
                  Coût (PM ou Points de Rune) *
                </label>
                <input
                  type="text"
                  required
                  value={customCost}
                  onChange={(e) => setCustomCost(e.target.value)}
                  placeholder="ex: 2 PM, 1 Point de Rune, Variable..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
                  Rune associée (Optionnel)
                </label>
                <select
                  value={customRune}
                  onChange={(e) => setCustomRune(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Aucune Rune spécifique</option>
                  {runesList.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
                  Portée & Durée
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={customRange}
                    onChange={(e) => setCustomRange(e.target.value)}
                    placeholder="Portée (ex: Toucher, 50m)"
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-cyan-500"
                  />
                  <input
                    type="text"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    placeholder="Durée (ex: 15 min, Instantané)"
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="stackable_check"
                  checked={customIsStackable}
                  onChange={(e) => setCustomIsStackable(e.target.checked)}
                  className="rounded border-stone-700 text-cyan-600 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="stackable_check" className="text-xs text-stone-300 cursor-pointer">
                  Sortilège cumulable (Stackable)
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
                Description des effets magiques *
              </label>
              <textarea
                rows={3}
                required
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Détaillez les dégâts, protections, jets d'opposition ou bénédictions accordées..."
                className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-cyan-500"
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
                className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-serif font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" /> Enregistrer le Sort
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
