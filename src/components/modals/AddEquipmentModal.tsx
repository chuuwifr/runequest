import React, { useState } from 'react';
import { X, Plus, Search, BookOpen, Package, Shield, Sparkles, Check } from 'lucide-react';
import { STANDARD_GEAR_CATALOG, StandardGearItem } from '../../data/equipmentAndItems';

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEquipment: (itemDescription: string) => void;
  existingEquipment: string[];
}

export const AddEquipmentModal: React.FC<AddEquipmentModalProps> = ({
  isOpen,
  onClose,
  onAddEquipment,
  existingEquipment,
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');

  // Custom Form state
  const [customName, setCustomName] = useState('');
  const [customQuantity, setCustomQuantity] = useState('1');
  const [customDetails, setCustomDetails] = useState('');

  if (!isOpen) return null;

  const categories = ['Tous', 'Survie & Voyage', 'Soins & Alchimie', 'Sacré & Magie', 'Outils & Artisanat', 'Montures & Animaux', 'Luxe & Commerce'];

  const filteredItems = STANDARD_GEAR_CATALOG.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'Tous' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleSelectPreset = (item: StandardGearItem) => {
    const formatted = `${item.name} (${item.category}, ${item.costLunars} L)`;
    onAddEquipment(formatted);
    onClose();
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const qty = customQuantity.trim() && customQuantity !== '1' ? ` (x${customQuantity})` : '';
    const details = customDetails.trim() ? ` — ${customDetails.trim()}` : '';
    const formatted = `${customName.trim()}${qty}${details}`;

    onAddEquipment(formatted);
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
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-amber-200">
                Ajouter un Équipement ou Objet
              </h2>
              <p className="text-xs text-stone-400">
                Matériel d'aventurier, trousses de soins de Chalana Arroy, cristaux de PM et montures.
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
            <BookOpen className="w-3.5 h-3.5" /> Catalogue d'Équipement ({STANDARD_GEAR_CATALOG.length} objets)
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
            <Plus className="w-3.5 h-3.5" /> Objet Personnalisé
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
                  placeholder="Rechercher (sac, corde, torche, élixir, cristal, tente...)"
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
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 hover:border-amber-600/50 flex items-center justify-between gap-3 transition"
                >
                  <div className="space-y-0.5 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-xs text-amber-200">{item.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-900 text-stone-400 border border-stone-800">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-mono text-amber-400">
                        {item.costLunars} L
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-tight">{item.description}</p>
                  </div>

                  <button
                    onClick={() => handleSelectPreset(item)}
                    className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-stone-950 text-xs font-serif font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ajouter
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateCustom} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
                  Nom de l'objet ou possession *
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="ex: Cape d'invisibilité, Corne de brume, Fiole de venin..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
                  Quantité
                </label>
                <input
                  type="text"
                  value={customQuantity}
                  onChange={(e) => setCustomQuantity(e.target.value)}
                  placeholder="1, 5, 20..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
                Détails, propriétés ou poids (Optionnel)
              </label>
              <input
                type="text"
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                placeholder="ex: Gravé de la Rune de Vérité, Valeur 50 L, +5% en Furtivité..."
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
                <Plus className="w-4 h-4" /> Ajouter au Sac
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
