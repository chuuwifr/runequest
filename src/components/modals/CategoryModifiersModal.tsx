import React, { useState } from 'react';
import { X, Sparkles, HelpCircle, Shield, ChevronRight, Check } from 'lucide-react';
import { CharacteristicValues } from '../../types/runequest';
import { 
  calculateSkillCategoryModifiers, 
  getCharacteristicBonusBreakdowns, 
  getCategoryFormulaDetails, 
  formatModifier 
} from '../../utils/rqCalculations';

interface CategoryModifiersModalProps {
  isOpen: boolean;
  onClose: () => void;
  characteristics: CharacteristicValues;
}

export const CategoryModifiersModal: React.FC<CategoryModifiersModalProps> = ({
  isOpen,
  onClose,
  characteristics,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Agilité');

  if (!isOpen) return null;

  const categoryModifiers = calculateSkillCategoryModifiers(characteristics);
  const breakdowns = getCharacteristicBonusBreakdowns(characteristics);
  const formulaDetails = getCategoryFormulaDetails(selectedCategory, characteristics);

  const categories = [
    { name: 'Agilité', mod: categoryModifiers.agilite, icon: '🏃' },
    { name: 'Communication', mod: categoryModifiers.communication, icon: '💬' },
    { name: 'Connaissances', mod: categoryModifiers.connaissances, icon: '📜' },
    { name: 'Magie', mod: categoryModifiers.magie, icon: '✨' },
    { name: 'Manipulation', mod: categoryModifiers.manipulation, icon: '🖐️' },
    { name: 'Perception', mod: categoryModifiers.perception, icon: '👁️' },
    { name: 'Furtivité', mod: categoryModifiers.furtivite, icon: '🥷' },
    { name: 'Armes', mod: categoryModifiers.armes, icon: '⚔️' },
    { name: 'Boucliers', mod: categoryModifiers.boucliers, icon: '🛡️' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-3xl rounded-2xl bg-stone-900 border-2 border-amber-600/60 shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
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
                Modificateurs de Catégories & Bonus de Caractéristiques
              </h2>
              <p className="text-xs text-stone-400">
                Calculs officiels des bonus/malus appliqués à chaque compétence selon vos 7 caractéristiques.
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

        <div className="space-y-6">
          {/* Summary Grid of Categories */}
          <div>
            <h3 className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider mb-2">
              Modificateurs Actuels par Catégorie
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                    selectedCategory === cat.name
                      ? 'border-amber-400 bg-amber-950/60 shadow-md ring-1 ring-amber-400'
                      : 'border-stone-800 bg-stone-950/70 hover:border-stone-700'
                  }`}
                >
                  <div className="text-base mb-0.5">{cat.icon}</div>
                  <div className="text-[11px] font-serif font-bold text-stone-300 truncate">{cat.name}</div>
                  <div className={`text-xs font-mono font-bold ${
                    cat.mod > 0 ? 'text-emerald-400' : cat.mod < 0 ? 'text-red-400' : 'text-stone-400'
                  }`}>
                    {formatModifier(cat.mod)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Category Formula Breakdown */}
          <div className="p-4 rounded-xl bg-stone-950 border border-amber-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-amber-200">
                Détail du calcul pour : <span className="text-amber-400">{selectedCategory}</span>
              </span>
              <span className={`px-2.5 py-1 rounded font-mono font-bold text-sm ${
                formulaDetails.total > 0 ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/50' : formulaDetails.total < 0 ? 'bg-red-950/60 text-red-300 border border-red-700/50' : 'bg-stone-900 text-stone-300 border border-stone-800'
              }`}>
                Total : {formatModifier(formulaDetails.total)}
              </span>
            </div>

            <div className="text-xs text-stone-400 font-mono bg-stone-900 p-2 rounded border border-stone-800">
              Formule RQG : {formulaDetails.formula}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {formulaDetails.parts.map((p, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-stone-900/90 border border-stone-800 text-center">
                  <span className="text-[10px] text-stone-400 block truncate">{p.name}</span>
                  <strong className={`font-mono text-sm ${
                    p.val > 0 ? 'text-emerald-400' : p.val < 0 ? 'text-red-400' : 'text-stone-400'
                  }`}>
                    {formatModifier(p.val)}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          {/* All Characteristics Contributions Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider">
              Valeurs & Paliers des 7 Caractéristiques
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-stone-800 rounded-lg overflow-hidden">
                <thead className="bg-stone-950 text-stone-400 font-serif border-b border-stone-800">
                  <tr>
                    <th className="p-2">Caractéristique</th>
                    <th className="p-2 text-center">Score</th>
                    <th className="p-2 text-center">Mod. Primaire</th>
                    <th className="p-2 text-center">Mod. Secondaire</th>
                    <th className="p-2 text-center">Mod. Négatif</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 bg-stone-950/40">
                  {breakdowns.map((b) => (
                    <tr key={b.stat} className="hover:bg-stone-900/60">
                      <td className="p-2 font-semibold text-stone-200">{b.statName}</td>
                      <td className="p-2 text-center font-mono font-bold text-amber-300">{b.value}</td>
                      <td className="p-2 text-center font-mono text-stone-300">{formatModifier(b.primary)}</td>
                      <td className="p-2 text-center font-mono text-stone-400">{formatModifier(b.secondary)}</td>
                      <td className="p-2 text-center font-mono text-stone-500">{formatModifier(b.negative)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rules explanation box */}
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-stone-300 space-y-1">
            <p className="font-serif font-bold text-amber-300 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-400" /> Règle officielle de RuneQuest: Roleplaying in Glorantha
            </p>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Le Modificateur Primaire s'applique aux caractéristiques dominantes de la catégorie (+5% dès 13, +10% dès 17).
              Le Modificateur Secondaire récompense les attributs secondaires (+5% dès 17, +10% dès 21).
              La Taille (TAI) apporte une pénalité sur l'Agilité et la Furtivité si elle est élevée.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-stone-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-serif font-bold transition cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
