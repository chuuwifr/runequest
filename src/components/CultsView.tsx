import React, { useState } from 'react';
import { Crown, Sparkles, Shield, BookOpen, Search, Check, Flame } from 'lucide-react';
import { CULTS, CultDefinition } from '../data/cults';
import { RuneBadge } from './RuneBadge';

export const CultsView: React.FC = () => {
  const [selectedPantheon, setSelectedPantheon] = useState<string>('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCultDetail, setActiveCultDetail] = useState<CultDefinition | null>(null);

  const pantheons = ['Tous', 'Tempêtes', 'Terre', 'Solaire', 'Ténèbres', 'Lunaire', 'Neutre / Savoirs'];

  const filteredCults = CULTS.filter((cult) => {
    const matchesSearch =
      cult.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cult.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cult.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPantheon = selectedPantheon === 'Tous' || cult.pantheon === selectedPantheon;

    return matchesSearch && matchesPantheon;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 text-stone-100 font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border border-amber-800/40 shadow-xl space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-900/30 border border-amber-600/50 text-amber-400">
            <Crown className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-amber-200">
              Panthéon des Cultes de Glorantha
            </h1>
            <p className="text-xs text-stone-400">
              Guide des cultes divins, des affiliations runiques, des devoirs sacrés et des dons magiques accordés aux initiés.
            </p>
          </div>
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
              placeholder="Rechercher un culte ou une divinité..."
              className="w-full bg-stone-950 border border-stone-700 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {pantheons.map((panth) => (
              <button
                key={panth}
                onClick={() => setSelectedPantheon(panth)}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-semibold transition cursor-pointer ${
                  selectedPantheon === panth
                    ? 'bg-amber-600/30 text-amber-300 border border-amber-500'
                    : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {panth}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cults Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCults.map((cult) => (
          <div
            key={cult.id}
            className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-600/50 space-y-4 flex flex-col justify-between transition shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-serif font-bold text-lg text-amber-200">{cult.name}</h3>
                  <p className="text-xs text-stone-400 italic">{cult.concept}</p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-stone-950 text-amber-300 border border-stone-800">
                  {cult.pantheon}
                </span>
              </div>

              {/* Runes */}
              <div className="flex flex-wrap gap-1.5">
                {cult.runes.map((r) => (
                  <RuneBadge key={r} rune={r} size="sm" />
                ))}
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">{cult.description}</p>

              {/* Cult Details */}
              <div className="space-y-2 pt-2 border-t border-stone-800 text-xs">
                <div className="flex items-center justify-between text-stone-300">
                  <span className="text-stone-400">Jour Sacré :</span>
                  <strong className="text-amber-300">{cult.holyDay}</strong>
                </div>
                <div className="text-stone-400">
                  <span className="block mb-1 font-semibold text-stone-300">Compétences de Culte :</span>
                  <div className="flex flex-wrap gap-1">
                    {cult.cultSkills.map((sk) => (
                      <span key={sk} className="px-1.5 py-0.5 rounded bg-stone-950 border border-stone-800 text-[11px] text-stone-300">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-stone-400">
                  <span className="block mb-1 font-semibold text-stone-300">Sorts Runiques Clés :</span>
                  <div className="flex flex-wrap gap-1">
                    {cult.runeSpells.map((rsp) => (
                      <span key={rsp} className="px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-800 text-[11px] text-amber-300">
                        ⚡ {rsp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-stone-400 font-mono">Titre : {cult.initiatesTitle}</span>
              <button
                onClick={() => setActiveCultDetail(cult)}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 font-serif font-bold cursor-pointer"
              >
                Détails du Culte
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Cult Details */}
      {activeCultDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-xl bg-stone-900 border border-amber-600/50 rounded-2xl p-6 text-stone-100 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-stone-800 pb-3">
              <div>
                <h2 className="font-serif font-bold text-xl text-amber-200">{activeCultDetail.name}</h2>
                <p className="text-xs text-stone-400">{activeCultDetail.concept}</p>
              </div>
              <button
                onClick={() => setActiveCultDetail(null)}
                className="p-1 rounded bg-stone-800 text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {activeCultDetail.runes.map((r) => (
                <RuneBadge key={r} rune={r} size="md" />
              ))}
            </div>

            <div className="space-y-3 text-xs text-stone-300 leading-relaxed">
              <p>{activeCultDetail.description}</p>
              <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 space-y-1.5">
                <div><strong className="text-amber-300">Conditions d'Initiation :</strong> {activeCultDetail.requirements}</div>
                <div><strong className="text-amber-300">Jour de Fête Sacré :</strong> {activeCultDetail.holyDay}</div>
                {activeCultDetail.lordsTitle && <div><strong className="text-amber-300">Titre des Seigneurs des Runes :</strong> {activeCultDetail.lordsTitle}</div>}
                {activeCultDetail.priestsTitle && <div><strong className="text-amber-300">Titre des Prêtres des Runes :</strong> {activeCultDetail.priestsTitle}</div>}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveCultDetail(null)}
                className="px-5 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
