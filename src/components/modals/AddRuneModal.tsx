import React, { useState } from 'react';
import { X, Plus, Sparkles, Check } from 'lucide-react';
import { RuneAffinity, RuneType } from '../../types/runequest';
import { RuneBadge } from '../RuneBadge';

interface AddRuneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRune: (rune: RuneAffinity) => void;
  existingRunes: RuneType[];
}

export const AddRuneModal: React.FC<AddRuneModalProps> = ({
  isOpen,
  onClose,
  onAddRune,
  existingRunes,
}) => {
  const [selectedRune, setSelectedRune] = useState<RuneType>('Air');
  const [category, setCategory] = useState<RuneAffinity['category']>('Élément');
  const [value, setValue] = useState<number>(60);

  if (!isOpen) return null;

  const elementalRunes: RuneType[] = ['Air', 'Terre', 'Feu', 'Eau', 'Ténèbres', 'Lune'];
  const powerRunes: RuneType[] = [
    'Fertilité', 'Mort',
    'Harmonie', 'Désaccord',
    'Vérité', 'Illusion',
    'Stase', 'Mouvement',
    'Homme', 'Bête',
    'Esprit', 'Magie', 'Maîtrise'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRune({
      rune: selectedRune,
      category: category,
      value: Number(value) || 50,
    });
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
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-amber-200">
                Ajouter ou Renforcer une Rune
              </h2>
              <p className="text-xs text-stone-400">
                Augmentez votre affinité cosmique élémentaire ou de puissance.
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
              Catégorie de Rune
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setCategory('Élément');
                  setSelectedRune('Air');
                }}
                className={`py-2 rounded-lg text-xs font-serif font-bold transition cursor-pointer border ${
                  category === 'Élément'
                    ? 'bg-amber-600 text-stone-950 border-amber-400'
                    : 'bg-stone-950 text-stone-400 border-stone-800'
                }`}
              >
                Runes Élémentaires
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategory('Puissance');
                  setSelectedRune('Fertilité');
                }}
                className={`py-2 rounded-lg text-xs font-serif font-bold transition cursor-pointer border ${
                  category === 'Puissance'
                    ? 'bg-amber-600 text-stone-950 border-amber-400'
                    : 'bg-stone-950 text-stone-400 border-stone-800'
                }`}
              >
                Runes de Puissance
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-serif font-bold text-amber-300 mb-2">
              Sélectionnez la Rune :
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(category === 'Élément' ? elementalRunes : powerRunes).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setSelectedRune(r)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                    selectedRune === r
                      ? 'border-amber-400 bg-amber-950/60 shadow-md scale-102'
                      : 'border-stone-800 bg-stone-950/70 hover:border-stone-700'
                  }`}
                >
                  <RuneBadge rune={r} size="md" showLabel={false} />
                  <span className="text-xs font-serif font-bold text-stone-200">{r}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
              Affinité / Score Runique (%) *
            </label>
            <input
              type="number"
              min="10"
              max="150"
              required
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 font-mono focus:outline-none focus:border-amber-500"
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
              <Plus className="w-4 h-4" /> Valider la Rune
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
