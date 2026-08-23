import React, { useState } from 'react';
import { X, Plus, Heart, Flame, Shield } from 'lucide-react';
import { Passion } from '../../types/runequest';

interface AddPassionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPassion: (passion: Passion) => void;
}

export const AddPassionModal: React.FC<AddPassionModalProps> = ({
  isOpen,
  onClose,
  onAddPassion,
}) => {
  const [passionType, setPassionType] = useState<Passion['type']>('Loyauté');
  const [target, setTarget] = useState('');
  const [value, setValue] = useState<number>(60);

  if (!isOpen) return null;

  const suggestions: Record<Passion['type'], string[]> = {
    'Loyauté': ['Sartar', 'Tribu Colymar', 'Clan Ernaldori', 'Roi Kallyr', 'Compagnons d\'armes', 'Reine Leika'],
    'Amour': ['Famille', 'Conjoint(e)', 'Enfants', 'Terre natale', 'Clan'],
    'Dévotion': ['Orlanth le Roi des Tempêtes', 'Ernalda la Terre Mère', 'Humakt le Dieu de la Mort', 'Chalana Arroy', 'Sept Mères', 'Taureau Tempête'],
    'Honneur': ['Code guerrier sartarite', 'Parole donnée', 'Serment d\'armes'],
    'Haine': ['Empire Lunaire', 'Broos du Chaos', 'Trolls sombres de Gué du Canard', 'Uz', 'Tribus rivales de Prax'],
    'Peur': ['Dragons ancestraux', 'Chaos & Walktapus', 'La Grande Chauve-souris écarlate'],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim()) return;

    const newPassion: Passion = {
      id: `passion_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: passionType,
      target: target.trim(),
      value: Number(value) || 60,
    };

    onAddPassion(newPassion);
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
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-amber-200">
                Ajouter une Passion ou Serment
              </h2>
              <p className="text-xs text-stone-400">
                Les passions fournissent des bonus d'inspiration héroïques majeurs (+20% ou +50%).
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
              Type de Passion *
            </label>
            <select
              value={passionType}
              onChange={(e) => {
                setPassionType(e.target.value as any);
                setTarget('');
              }}
              className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="Loyauté">🛡️ Loyauté (Clan, Roi, Tribu, Compagnons)</option>
              <option value="Dévotion">👑 Dévotion (Divinité, Culte, Temple)</option>
              <option value="Amour">❤️ Amour (Famille, Conjoint, Communauté)</option>
              <option value="Honneur">⚔️ Honneur (Serment, Dignité, Devoir)</option>
              <option value="Haine">🔥 Haine (Empire Lunaire, Chaos, Ennemis jurés)</option>
              <option value="Peur">💀 Peur (Monstres du Chaos, Dragons, Ténèbres)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
              Cible de la Passion *
            </label>
            <input
              type="text"
              required
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="ex: Sartar, Famille, Orlanth, Empire Lunaire..."
              className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500 mb-2"
            />
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1">
              {suggestions[passionType]?.map((sug) => (
                <button
                  type="button"
                  key={sug}
                  onClick={() => setTarget(sug)}
                  className="px-2 py-0.5 rounded bg-stone-950 hover:bg-stone-800 text-[10px] text-amber-400/90 border border-stone-800 transition cursor-pointer"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
              Valeur Initiale (%) *
            </label>
            <input
              type="number"
              min="10"
              max="120"
              required
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 font-mono focus:outline-none focus:border-amber-500"
            />
            <span className="text-[10px] text-stone-500 block mt-1">
              Généralement 60% pour une passion de base, ou 70%+ pour une loyauté jurée.
            </span>
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
              <Plus className="w-4 h-4" /> Inscrire la Passion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
