import React, { useState } from 'react';
import { X, Coins, Check } from 'lucide-react';
import { Adventurer } from '../../types/runequest';

interface EditCurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Adventurer['currency'];
  onSaveCurrency: (currency: Adventurer['currency']) => void;
}

export const EditCurrencyModal: React.FC<EditCurrencyModalProps> = ({
  isOpen,
  onClose,
  currency,
  onSaveCurrency,
}) => {
  const [wheels, setWheels] = useState<number>(currency.wheels);
  const [lunars, setLunars] = useState<number>(currency.lunars);
  const [clacks, setClacks] = useState<number>(currency.clacks);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCurrency({
      wheels: Math.max(0, Number(wheels) || 0),
      lunars: Math.max(0, Number(lunars) || 0),
      clacks: Math.max(0, Number(clacks) || 0),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md rounded-2xl bg-stone-900 border-2 border-amber-600/60 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/50 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-amber-200">
                Gérer la Bourse & Monnaies
              </h2>
              <p className="text-xs text-stone-400">
                1 Roue d'Or (Wheel) = 20 Lunars d'Argent = 200 Clacks de Cuivre.
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

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-serif font-bold text-amber-300 mb-1">
              👑 Roues d'Or (Wheels)
            </label>
            <input
              type="number"
              min="0"
              value={wheels}
              onChange={(e) => setWheels(Number(e.target.value))}
              className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-serif font-bold text-stone-300 mb-1">
              🪙 Pièces d'Argent (Lunars - L)
            </label>
            <input
              type="number"
              min="0"
              value={lunars}
              onChange={(e) => setLunars(Number(e.target.value))}
              className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-100 font-mono font-bold focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-serif font-bold text-orange-400 mb-1">
              🥉 Sous de Cuivre (Clacks - C)
            </label>
            <input
              type="number"
              min="0"
              value={clacks}
              onChange={(e) => setClacks(Number(e.target.value))}
              className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-orange-300 font-mono font-bold focus:outline-none focus:border-amber-500"
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
              <Check className="w-4 h-4" /> Mettre à jour la Bourse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
