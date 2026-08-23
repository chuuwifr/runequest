import React, { useState } from 'react';
import { X, Plus, Search, BookOpen, Sparkles, Check, Flame } from 'lucide-react';
import { Skill } from '../../types/runequest';
import { STANDARD_SKILLS_CATALOG, StandardSkillPreset } from '../../data/equipmentAndItems';

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSkill: (skill: Skill) => void;
  existingSkillNames: string[];
}

export const AddSkillModal: React.FC<AddSkillModalProps> = ({
  isOpen,
  onClose,
  onAddSkill,
  existingSkillNames,
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');

  // Custom Form state
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<Skill['category']>('Connaissances');
  const [customBaseVal, setCustomBaseVal] = useState<number>(25);
  const [customSpecialty, setCustomSpecialty] = useState('');

  if (!isOpen) return null;

  const categories = ['Tous', 'Agilité', 'Communication', 'Connaissances', 'Magie', 'Manipulation', 'Perception', 'Furtivité', 'Armes', 'Boucliers'];

  const filteredPresets = STANDARD_SKILLS_CATALOG.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'Tous' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleSelectPreset = (preset: StandardSkillPreset) => {
    const newSkill: Skill = {
      id: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: preset.name,
      category: preset.category,
      baseVal: preset.baseVal,
      cultBonus: 0,
      occupationalBonus: 0,
      personalBonus: 0,
      totalVal: preset.baseVal,
      experienceCheck: false,
    };
    onAddSkill(newSkill);
    onClose();
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newSkill: Skill = {
      id: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: customName.trim(),
      category: customCategory,
      baseVal: Number(customBaseVal) || 20,
      cultBonus: 0,
      occupationalBonus: 0,
      personalBonus: 0,
      totalVal: Number(customBaseVal) || 20,
      experienceCheck: false,
      specialty: customSpecialty.trim() || undefined,
    };
    onAddSkill(newSkill);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-stone-900 border-2 border-amber-600/60 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/50 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-amber-200">
                Ajouter une Compétence
              </h2>
              <p className="text-xs text-stone-400">
                Enrichissez la fiche avec les compétences canoniques ou créez une expertise sur mesure.
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
            <BookOpen className="w-3.5 h-3.5" /> Compétences Canoniques de Glorantha
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
            <Plus className="w-3.5 h-3.5" /> Créer une Compétence Personnalisée
          </button>
        </div>

        {activeTab === 'preset' ? (
          <div className="space-y-4">
            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row gap-2 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher une compétence..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-stone-950 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Presets List */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {filteredPresets.map((preset) => {
                const alreadyHas = existingSkillNames.includes(preset.name);
                return (
                  <div
                    key={preset.name}
                    className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 hover:border-amber-600/50 flex items-center justify-between gap-3 transition"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-xs text-amber-200">{preset.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-900 text-stone-400 border border-stone-800">
                          {preset.category}
                        </span>
                        <span className="text-[10px] font-mono text-amber-400 font-bold">
                          Base {preset.baseVal}%
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 leading-tight">{preset.description}</p>
                    </div>

                    <button
                      onClick={() => handleSelectPreset(preset)}
                      disabled={alreadyHas}
                      className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                        alreadyHas
                          ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                          : 'bg-amber-700 hover:bg-amber-600 text-stone-950 shadow-md'
                      }`}
                    >
                      {alreadyHas ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Possédée
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" /> Ajouter ({preset.baseVal}%)
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
                  Nom de la compétence *
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="ex: Connaissance de Prax, Lire l'Azké, etc."
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
                  Catégorie de compétence *
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Agilité">Agilité</option>
                  <option value="Communication">Communication</option>
                  <option value="Connaissances">Connaissances</option>
                  <option value="Magie">Magie</option>
                  <option value="Manipulation">Manipulation</option>
                  <option value="Perception">Perception</option>
                  <option value="Furtivité">Furtivité</option>
                  <option value="Armes">Armes</option>
                  <option value="Boucliers">Boucliers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
                  Score Total / Valeur de Base (%) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="150"
                  required
                  value={customBaseVal}
                  onChange={(e) => setCustomBaseVal(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
                  Spécialité / Sous-domaine (Optionnel)
                </label>
                <input
                  type="text"
                  value={customSpecialty}
                  onChange={(e) => setCustomSpecialty(e.target.value)}
                  placeholder="ex: Région des Collines, Nomades, Broos..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
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
                <Plus className="w-4 h-4" /> Ajouter à la Feuille
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
