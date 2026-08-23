import React, { useState } from 'react';
import { BookOpen, Sparkles, Crown, Zap, Search, Filter, Plus, Check } from 'lucide-react';
import { SPELLS_DATABASE } from '../data/spells';
import { Adventurer, Spell } from '../types/runequest';
import { RuneBadge } from './RuneBadge';

interface GrimoireViewProps {
  activeAdventurer?: Adventurer;
  onAddSpellToActiveAdventurer?: (spell: Spell) => void;
}

export const GrimoireView: React.FC<GrimoireViewProps> = ({
  activeAdventurer,
  onAddSpellToActiveAdventurer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('Tous');
  const [selectedRune, setSelectedRune] = useState<string>('Toutes');
  const [justAddedSpellId, setJustAddedSpellId] = useState<string | null>(null);

  const spellTypes = ['Tous', 'Esprit', 'Runique', 'Sorcellerie'];
  const allRunes = ['Toutes', 'Air', 'Terre', 'Feu', 'Eau', 'Ténèbres', 'Lune', 'Mort', 'Fertilité', 'Harmonie', 'Vérité', 'Mouvement'];

  const filteredSpells = SPELLS_DATABASE.filter((spell) => {
    const matchesSearch =
      spell.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (spell.englishName && spell.englishName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      spell.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'Tous' || spell.type === selectedType;
    const matchesRune = selectedRune === 'Toutes' || spell.rune === selectedRune;

    return matchesSearch && matchesType && matchesRune;
  });

  const handleAddSpell = (spell: Spell) => {
    if (!onAddSpellToActiveAdventurer) return;
    onAddSpellToActiveAdventurer(spell);
    setJustAddedSpellId(spell.id);
    setTimeout(() => {
      setJustAddedSpellId(null);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 text-stone-100 font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border border-amber-800/40 shadow-xl space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-900/30 border border-amber-600/50 text-amber-400">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-amber-200">
                Grimoire des Sorts de Glorantha
              </h1>
              <p className="text-xs text-stone-400">
                Encyclopédie complète de la Magie des Esprits, Magie Runique et Sorcellerie ({SPELLS_DATABASE.length} sorts).
              </p>
            </div>
          </div>

          {activeAdventurer && (
            <div className="p-2 px-3 rounded-xl bg-stone-950 border border-amber-500/40 text-xs">
              <span className="text-stone-400 block text-[10px] uppercase font-serif">Aventurier cible :</span>
              <strong className="text-amber-300 font-serif">{activeAdventurer.name}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un sort, mot-clé ou effet..."
              className="w-full bg-stone-950 border border-stone-700 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {spellTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-semibold transition cursor-pointer ${
                  selectedType === type
                    ? 'bg-amber-600/30 text-amber-300 border border-amber-500'
                    : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {type === 'Esprit' ? '✨ Magie des Esprits' : type === 'Runique' ? '⚡ Magie Runique' : type === 'Sorcellerie' ? '📜 Sorcellerie' : 'Tous les types'}
              </button>
            ))}
          </div>
        </div>

        {/* Rune Filter Badges */}
        <div className="flex flex-wrap gap-1.5 items-center pt-2 border-t border-stone-800">
          <span className="text-xs font-serif text-stone-400 mr-2 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Filtrer par Rune :
          </span>
          {allRunes.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRune(r)}
              className={`px-2 py-1 rounded text-xs transition cursor-pointer ${
                selectedRune === r
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Spells Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSpells.map((spell) => {
          const isAlreadyKnown = activeAdventurer?.spells.some(
            (s) => s.id === spell.id || s.name.toLowerCase() === spell.name.toLowerCase()
          );
          const isJustAdded = justAddedSpellId === spell.id;

          return (
            <div
              key={spell.id}
              className="p-5 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-amber-600/50 space-y-3 flex flex-col justify-between transition shadow-md group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-base text-amber-200 group-hover:text-amber-300">
                      {spell.name}
                    </h3>
                    {spell.englishName && (
                      <span className="text-[10px] text-stone-500 font-mono">({spell.englishName})</span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      spell.type === 'Runique'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-600/50'
                        : spell.type === 'Esprit'
                        ? 'bg-cyan-950/60 text-cyan-300 border-cyan-600/50'
                        : 'bg-purple-950/60 text-purple-300 border-purple-600/50'
                    }`}
                  >
                    {spell.type}
                  </span>
                </div>

                {spell.rune && (
                  <div>
                    <RuneBadge rune={spell.rune} size="sm" />
                  </div>
                )}

                <p className="text-xs text-stone-300 leading-relaxed">{spell.description}</p>
              </div>

              <div className="space-y-2 pt-3 border-t border-stone-800">
                {/* Spell Metadata Footer */}
                <div className="grid grid-cols-3 gap-1 text-center text-[10px] font-mono">
                  <div className="p-1 rounded bg-stone-950 border border-stone-800">
                    <span className="text-stone-500 block">Coût</span>
                    <strong className="text-amber-300">{spell.cost}</strong>
                  </div>
                  <div className="p-1 rounded bg-stone-950 border border-stone-800">
                    <span className="text-stone-500 block">Portée</span>
                    <strong className="text-stone-300">{spell.range}</strong>
                  </div>
                  <div className="p-1 rounded bg-stone-950 border border-stone-800">
                    <span className="text-stone-500 block">Durée</span>
                    <strong className="text-stone-300">{spell.duration}</strong>
                  </div>
                </div>

                {/* Add to Active Character Button */}
                {activeAdventurer && onAddSpellToActiveAdventurer && (
                  <button
                    onClick={() => handleAddSpell(spell)}
                    disabled={isAlreadyKnown && !isJustAdded}
                    className={`w-full py-1.5 rounded-lg text-xs font-serif font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow ${
                      isJustAdded
                        ? 'bg-emerald-600 text-white'
                        : isAlreadyKnown
                        ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                        : 'bg-amber-600/80 hover:bg-amber-500 text-stone-950 border border-amber-400'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Inscrit sur la fiche !
                      </>
                    ) : isAlreadyKnown ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Déjà connu par {activeAdventurer.name}
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Inscrire sur la fiche de {activeAdventurer.name}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
