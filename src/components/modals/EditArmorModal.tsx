import React, { useState } from 'react';
import { X, ShieldCheck, Check, RotateCcw } from 'lucide-react';
import { HitLocation, BodyPart } from '../../types/runequest';

interface EditArmorModalProps {
  isOpen: boolean;
  onClose: () => void;
  hitLocations: HitLocation[];
  onSaveArmor: (updatedLocations: HitLocation[]) => void;
}

export const EditArmorModal: React.FC<EditArmorModalProps> = ({
  isOpen,
  onClose,
  hitLocations,
  onSaveArmor,
}) => {
  const [locations, setLocations] = useState<HitLocation[]>(hitLocations);

  if (!isOpen) return null;

  const armorPresets = [
    { label: 'Aucune Armure (0 PA)', pa: 0, type: 'Vêtements ordinaires' },
    { label: 'Cuir Souple (1 PA)', pa: 1, type: 'Cuir souple' },
    { label: 'Cuir Lourd / Durci (2-3 PA)', pa: 3, type: 'Cuir durci' },
    { label: 'Mailles / Écailles (4 PA)', pa: 4, type: 'Cotte d\'écailles de bronze' },
    { label: 'Cuirasse de Bronze (6 PA)', pa: 6, type: 'Bronze d\'hoplite' },
  ];

  const handleApplyPresetAll = (pa: number, type: string) => {
    setLocations((prev) =>
      prev.map((loc) => ({
        ...loc,
        armorPoints: pa,
        armorType: type,
      }))
    );
  };

  const handleChangeLocation = (id: BodyPart, pa: number, type: string) => {
    setLocations((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, armorPoints: pa, armorType: type } : loc))
    );
  };

  const handleSave = () => {
    onSaveArmor(locations);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-stone-900 border-2 border-emerald-600/60 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/50 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-amber-200">
                Ajuster les Armures par Localisation Corporelle
              </h2>
              <p className="text-xs text-stone-400">
                Configurez les Points d'Armure (PA) et les protections pour chaque partie anatomique du corps.
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

        {/* Quick Presets for Entire Body */}
        <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-2 mb-4">
          <span className="text-xs font-serif font-bold text-emerald-300 uppercase tracking-wider block">
            Appliquer un ensemble d'armure complet :
          </span>
          <div className="flex flex-wrap gap-2">
            {armorPresets.map((p) => (
              <button
                type="button"
                key={p.label}
                onClick={() => handleApplyPresetAll(p.pa, p.type)}
                className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 text-xs transition cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Localized Body Parts Editor */}
        <div className="space-y-2.5 mb-6">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-[150px]">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-stone-900 text-stone-400 border border-stone-800">
                  {loc.rollRange}
                </span>
                <span className="font-serif font-bold text-xs text-stone-200">{loc.name}</span>
              </div>

              <div className="flex flex-1 items-center gap-2">
                <div className="w-24">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={loc.armorPoints}
                    onChange={(e) => handleChangeLocation(loc.id, Number(e.target.value), loc.armorType)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono font-bold text-center focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[9px] text-stone-500 block text-center mt-0.5">PA</span>
                </div>

                <input
                  type="text"
                  value={loc.armorType}
                  onChange={(e) => handleChangeLocation(loc.id, loc.armorPoints, e.target.value)}
                  placeholder="ex: Casque de bronze, Cuirasse, Grève..."
                  className="flex-1 bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-800 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-serif font-bold transition cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-serif font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Check className="w-4 h-4" /> Enregistrer les Protections
          </button>
        </div>
      </div>
    </div>
  );
};
