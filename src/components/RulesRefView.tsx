import React, { useState } from 'react';
import { HelpCircle, BookOpen, Search, Shield, Swords, Sparkles, AlertCircle, Calculator, Activity, ArrowRight } from 'lucide-react';
import { calculateSkillCategoryModifiers, calculateDerivedAttributes, formatModifier } from '../utils/rqCalculations';
import { CharacteristicValues } from '../types/runequest';

export const RulesRefView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [testChars, setTestChars] = useState<CharacteristicValues>({
    FOR: 15,
    CON: 14,
    TAI: 13,
    INT: 14,
    POU: 16,
    DEX: 15,
    CHA: 15,
  });

  const simDerived = calculateDerivedAttributes(testChars);
  const simCatMods = simDerived.categoryModifiers;

  const glossaryItems = [
    { fr: 'Rang d\'Action (SR)', en: 'Strike Rank (SR)', desc: 'Ordre de résolution des attaques et sorts dans le round (de 1 à 12). Dépend de la Dextérité, de la Taille et de la longueur de l\'arme.' },
    { fr: 'Modificateurs de Catégorie', en: 'Skill Category Modifiers', desc: 'Bonus ou malus en pourcentage appliqués aux compétences selon les 7 caractéristiques (Agilité, Communication, Connaissances, Magie, Manipulation, Perception, Furtivité).' },
    { fr: 'Bonus aux Dégâts (BD)', en: 'Damage Bonus (db)', desc: 'Dé de dégâts supplémentaires ajouté aux attaques de corps-à-corps et armes de jet basé sur FOR + TAI (ex: +1D4, +1D6, +2D6).' },
    { fr: 'Amplification Runique', en: 'Rune Augmentation', desc: 'Invoquer une Rune ou Passion pour ajouter +20% à un jet de compétence en cas de succès, ou subir -20% en cas d\'échec.' },
    { fr: 'Points de Rune (PR)', en: 'Rune Points (RP)', desc: 'Mesure de la communion avec sa divinité. Dépensés pour lancer des sorts de Magie Runique, récupérés lors des jours sacrés de culte.' },
    { fr: 'Magie des Esprits', en: 'Spirit Magic', desc: 'Sorts appris auprès d\'esprits ou de chamans, alimentés par les Points de Magie (PM).' },
    { fr: 'Réussite Critique (01-05%)', en: 'Critical Success', desc: 'Jet ≤ 1/20e de la compétence. Dégâts maximaux ignorant l\'armure physique du défenseur ou résultat parfait.' },
    { fr: 'Réussite Spéciale (01-20%)', en: 'Special Success', desc: 'Jet ≤ 1/5e de la compétence. Dégâts perforants (dés doublés), écrasants (dégâts max + dés) ou tranchants (dégâts max).' },
    { fr: 'Maladresse (96-100%)', en: 'Fumble', desc: 'Échec catastrophique : arme brisée, tombée, auto-blessure ou chute selon le tableau des maladresses.' },
    { fr: 'Combat Spirituel', en: 'Spirit Combat', desc: 'Affrontement sur le plan astral opposant le POU et CHA des combattants, infligeant des dégâts aux Points de Magie.' },
    { fr: 'Temps Sacré (Saison Sacrée)', en: 'Sacred Time', desc: 'Les 2 semaines saintes qui séparent les années. Tous les cultes accomplissent leurs grands rituels cosmiques.' },
    { fr: 'Blessure Majeure', en: 'Major Wound', desc: 'Blessure infligeant des dégâts égaux ou supérieurs aux PV max d\'une localisation corporelle, rendant le membre inutilisable ou tranché.' },
    { fr: 'Table des Oppositions', en: 'Resistance Table', desc: 'Formule BRP pour opposer deux caractéristiques : Chance = 50% + (Actif - Défenseur) × 5%.' },
  ];

  const filteredGlossary = glossaryItems.filter(
    (item) =>
      item.fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 text-stone-100 font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border border-amber-800/40 shadow-xl space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-900/30 border border-amber-600/50 text-amber-400">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-amber-200">
              Aide-Mémoire des Règles & Bonus de Caractéristiques
            </h1>
            <p className="text-xs text-stone-400">
              Synthèse complète des règles de RuneQuest: Roleplaying in Glorantha, formules de modificateurs et lexique officiel français / anglais.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION: INTERACTIVE CHARACTERISTIC BONUS CALCULATOR */}
      <div className="p-6 rounded-2xl bg-stone-900/90 border border-amber-600/40 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-amber-400" />
            <h2 className="font-serif font-bold text-base text-amber-200">
              Simulateur Interactif de Bonus & Modificateurs de Caractéristiques
            </h2>
          </div>
          <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">Règles Officielles RQG p.56-58</span>
        </div>

        <p className="text-xs text-stone-300">
          Modifiez les scores ci-dessous pour voir instantanément le recalcul en temps réel des modificateurs de compétences et des attributs dérivés de combat :
        </p>

        {/* Inputs */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {[
            { key: 'FOR' as const, label: 'FOR (Force)' },
            { key: 'CON' as const, label: 'CON (Constitution)' },
            { key: 'TAI' as const, label: 'TAI (Taille)' },
            { key: 'INT' as const, label: 'INT (Intelligence)' },
            { key: 'POU' as const, label: 'POU (Pouvoir)' },
            { key: 'DEX' as const, label: 'DEX (Dextérité)' },
            { key: 'CHA' as const, label: 'CHA (Charisme)' },
          ].map(({ key, label }) => (
            <div key={key} className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-center space-y-1">
              <span className="text-[10px] font-bold text-amber-400 block truncate">{label}</span>
              <input
                type="number"
                min="1"
                max="30"
                value={testChars[key]}
                onChange={(e) => setTestChars({ ...testChars, [key]: Number(e.target.value) || 10 })}
                className="w-full bg-stone-900 border border-stone-700 rounded py-1 text-center font-mono font-bold text-sm text-stone-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
          ))}
        </div>

        {/* Live Result Grid */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block">
            1. Modificateurs de Catégories de Compétences :
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 text-center text-xs">
            {[
              { cat: 'Agilité', mod: simCatMods.agilite, icon: '🏃' },
              { cat: 'Communication', mod: simCatMods.communication, icon: '💬' },
              { cat: 'Connaissances', mod: simCatMods.connaissances, icon: '📜' },
              { cat: 'Magie', mod: simCatMods.magie, icon: '✨' },
              { cat: 'Manipulation', mod: simCatMods.manipulation, icon: '🖐️' },
              { cat: 'Perception', mod: simCatMods.perception, icon: '👁️' },
              { cat: 'Furtivité', mod: simCatMods.furtivite, icon: '🥷' },
              { cat: 'Armes', mod: simCatMods.armes, icon: '⚔️' },
              { cat: 'Boucliers', mod: simCatMods.boucliers, icon: '🛡️' },
            ].map(({ cat, mod, icon }) => (
              <div key={cat} className="p-2 rounded-lg bg-stone-950 border border-stone-800">
                <span className="text-[10px] text-stone-400 block truncate">{icon} {cat}</span>
                <strong className={`font-mono text-xs ${
                  mod > 0 ? 'text-emerald-400' : mod < 0 ? 'text-red-400' : 'text-stone-300'
                }`}>
                  {formatModifier(mod)}
                </strong>
              </div>
            ))}
          </div>

          <span className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block pt-2">
            2. Attributs Dérivés de Combat :
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
            <div className="p-2 rounded bg-stone-950 border border-stone-800">
              <span className="text-[10px] text-stone-400 block">Points de Vie (PV)</span>
              <strong className="font-mono text-emerald-400 text-sm">{simDerived.hpMax}</strong>
            </div>
            <div className="p-2 rounded bg-stone-950 border border-stone-800">
              <span className="text-[10px] text-stone-400 block">Bonus Dégâts (BD)</span>
              <strong className="font-mono text-amber-400 text-sm">{simDerived.damageBonus}</strong>
            </div>
            <div className="p-2 rounded bg-stone-950 border border-stone-800">
              <span className="text-[10px] text-stone-400 block">SR DEX / TAI</span>
              <strong className="font-mono text-stone-200 text-sm">{simDerived.srDex} / {simDerived.srSize}</strong>
            </div>
            <div className="p-2 rounded bg-stone-950 border border-stone-800">
              <span className="text-[10px] text-stone-400 block">Taux Guérison</span>
              <strong className="font-mono text-stone-200 text-sm">{simDerived.healingRate} pts/sem.</strong>
            </div>
            <div className="p-2 rounded bg-stone-950 border border-stone-800">
              <span className="text-[10px] text-stone-400 block">Dégâts Spirituels</span>
              <strong className="font-mono text-purple-400 text-sm">{simDerived.spiritCombatDamage}</strong>
            </div>
            <div className="p-2 rounded bg-stone-950 border border-stone-800">
              <span className="text-[10px] text-stone-400 block">Encombrement Max</span>
              <strong className="font-mono text-stone-200 text-sm">{simDerived.maxEncumbrance} ENC</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Summaries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Strike Rank Table */}
        <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3 shadow-md">
          <h2 className="font-serif font-bold text-sm text-amber-300 flex items-center gap-1.5">
            <Swords className="h-4 w-4 text-amber-400" /> Calcul du Rang d'Action (SR)
          </h2>
          <p className="text-xs text-stone-400 leading-relaxed">
            Le SR d'une attaque de corps-à-corps est la somme de :
          </p>
          <div className="p-2.5 rounded bg-stone-950 border border-stone-800 font-mono text-xs text-amber-200 text-center">
            SR = SR DEX + SR TAI + SR Arme
          </div>
          <ul className="text-xs text-stone-300 space-y-1 pt-1">
            <li>• DEX ≤ 5 : SR 5 | DEX 6-9 : SR 4 | DEX 10-15 : SR 3 | DEX 16-19 : SR 2 | DEX 20+ : SR 1</li>
            <li>• TAI ≤ 6 : SR 3 | TAI 7-14 : SR 2 | TAI 15-21 : SR 1 | TAI 22+ : SR 0</li>
            <li>• Sorts d'Esprit : SR DEX + (PM investis - 1)</li>
          </ul>
        </div>

        {/* Card 2: Levels of Success Table */}
        <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3 shadow-md">
          <h2 className="font-serif font-bold text-sm text-amber-300 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-emerald-400" /> Niveaux de Réussite D100
          </h2>
          <div className="space-y-1.5 text-xs text-stone-300">
            <div className="p-2 rounded bg-amber-950/40 border border-amber-800">
              <strong className="text-amber-300">Critique (01 à N/20) :</strong> Dégâts max + ignore l'armure.
            </div>
            <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800">
              <strong className="text-emerald-300">Spéciale (01 à N/5) :</strong> Dégâts doublés ou spéciaux.
            </div>
            <div className="p-2 rounded bg-cyan-950/40 border border-cyan-800">
              <strong className="text-cyan-300">Réussite Ordinaire :</strong> Jet ≤ Compétence.
            </div>
            <div className="p-2 rounded bg-red-950/40 border border-red-800">
              <strong className="text-red-300">Maladresse (96-100%) :</strong> Catastrophe critique.
            </div>
          </div>
        </div>

        {/* Card 3: Hit Locations & Wounds */}
        <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3 shadow-md">
          <h2 className="font-serif font-bold text-sm text-amber-300 flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-cyan-400" /> Localisations Corporelles D20
          </h2>
          <div className="grid grid-cols-2 gap-1.5 text-xs font-mono text-stone-300">
            <div className="p-1.5 rounded bg-stone-950 border border-stone-800">19–20 : Tête</div>
            <div className="p-1.5 rounded bg-stone-950 border border-stone-800">16–18 : Bras G.</div>
            <div className="p-1.5 rounded bg-stone-950 border border-stone-800">13–15 : Bras D.</div>
            <div className="p-1.5 rounded bg-stone-950 border border-stone-800">12 : Poitrine</div>
            <div className="p-1.5 rounded bg-stone-950 border border-stone-800">09–11 : Abdomen</div>
            <div className="p-1.5 rounded bg-stone-950 border border-stone-800">05–08 : Jambe G.</div>
            <div className="p-1.5 rounded bg-stone-950 border border-stone-800 col-span-2">01–04 : Jambe D.</div>
          </div>
          <p className="text-[11px] text-stone-400 italic">
            Une blessure à 0 PV dans un membre l'invalide. À 0 PV à la tête, poitrine ou abdomen : inconscience et mort sans soin urgent.
          </p>
        </div>
      </div>

      {/* Formulas & Calculation Details */}
      <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-4">
        <h2 className="font-serif font-bold text-base text-amber-200 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-amber-400" /> Formules des Modificateurs de Catégories RQG
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
            <strong className="text-amber-300 block font-serif">🏃 Agilité :</strong>
            <span className="text-stone-300 font-mono">DEX (Primaire) + FOR (Sec.) + POU (Sec.) - TAI (Négatif)</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
            <strong className="text-amber-300 block font-serif">💬 Communication :</strong>
            <span className="text-stone-300 font-mono">CHA (Primaire) + INT (Sec.) + POU (Sec.)</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
            <strong className="text-amber-300 block font-serif">📜 Connaissances :</strong>
            <span className="text-stone-300 font-mono">INT (Primaire) + POU (Sec.)</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
            <strong className="text-amber-300 block font-serif">✨ Magie :</strong>
            <span className="text-stone-300 font-mono">POU (Primaire) + CHA (Primaire) + INT (Sec.)</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
            <strong className="text-amber-300 block font-serif">🖐️ Manipulation & ⚔️ Armes :</strong>
            <span className="text-stone-300 font-mono">DEX (Primaire) + FOR (Sec.) + INT (Sec.) + POU (Sec.)</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
            <strong className="text-amber-300 block font-serif">👁️ Perception :</strong>
            <span className="text-stone-300 font-mono">INT (Primaire) + CON (Sec.) + POU (Sec.)</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 col-span-1 md:col-span-2 space-y-1">
            <strong className="text-amber-300 block font-serif">🥷 Furtivité :</strong>
            <span className="text-stone-300 font-mono">DEX (Primaire) + INT (Sec.) - TAI (Négatif) - POU (Sec.)</span>
          </div>
        </div>
      </div>

      {/* French / English Glossary Table */}
      <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-800 pb-3">
          <div>
            <h2 className="font-serif font-bold text-lg text-amber-200">
              Lexique & Traduction des Termes RuneQuest (FR / EN)
            </h2>
            <p className="text-xs text-stone-400">
              Correspondance exacte des termes utilisés dans la version française officielle de Chaosium / Studio Deadcrows.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un terme..."
              className="w-full bg-stone-950 border border-stone-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredGlossary.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 hover:border-amber-600/40 transition space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-amber-300">{item.fr}</span>
                <span className="text-xs font-mono text-stone-400 italic font-semibold">({item.en})</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

