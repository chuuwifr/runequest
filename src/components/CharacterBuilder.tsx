import React, { useState } from 'react';
import { 
  Shield, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Dices, 
  Flame, 
  Crown, 
  BookOpen, 
  Scroll, 
  User, 
  Compass, 
  Swords,
  Heart,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HOMELANDS } from '../data/homelands';
import { OCCUPATIONS } from '../data/occupations';
import { CULTS } from '../data/cults';
import { SPELLS_DATABASE } from '../data/spells';
import { FAMILY_HISTORY_TIMELINE } from '../data/familyHistory';
import { RuneBadge } from './RuneBadge';
import { Adventurer, CharacteristicValues, ElementalRune, Passion, RuneAffinity, Skill, Spell, Weapon } from '../types/runequest';
import { calculateDerivedAttributes, generateHitLocations, calculateSkillCategoryModifiers, formatModifier } from '../utils/rqCalculations';
import { rollDice } from '../utils/dice';

interface CharacterBuilderProps {
  onSaveCharacter: (adventurer: Adventurer) => void;
  onCancel: () => void;
}

export const CharacterBuilder: React.FC<CharacterBuilderProps> = ({
  onSaveCharacter,
  onCancel,
}) => {
  const [step, setStep] = useState<number>(1);

  // STEP 1: IDENTITY & HOMELAND
  const [name, setName] = useState('Yarand de Boldhome');
  const [gender, setGender] = useState<'Homme' | 'Femme' | 'Autre'>('Homme');
  const [age, setAge] = useState(21);
  const [selectedHomelandId, setSelectedHomelandId] = useState('sartar');
  const [tribe, setTribe] = useState('Colymar');
  const [clan, setClan] = useState('Ernaldori');

  // STEP 2: FAMILY HISTORY
  const [familyChoices, setFamilyChoices] = useState<{ [year: number]: number }>({
    1582: 0,
    1602: 0,
    1621: 0,
    1625: 0,
  });

  // STEP 3: CHARACTERISTICS
  const [chars, setChars] = useState<CharacteristicValues>({
    FOR: 13,
    CON: 14,
    TAI: 12,
    INT: 15,
    POU: 14,
    DEX: 13,
    CHA: 12,
  });

  // STEP 4: RUNES & PASSIONS
  const [elementPrimary, setElementPrimary] = useState<ElementalRune>('Air');
  const [elementSecondary, setElementSecondary] = useState<ElementalRune>('Terre');
  const [elementTertiary, setElementTertiary] = useState<ElementalRune>('Feu');
  const [powerPairs, setPowerPairs] = useState<{ [key: string]: number }>({
    'Homme': 75, // Beast will be 25
    'Mort': 60,  // Fertility will be 40
    'Harmonie': 60, // Discord will be 40
    'Vérité': 70, // Illusion will be 30
    'Mouvement': 75, // Stasis will be 25
  });

  // STEP 5: OCCUPATION
  const [selectedOccupationId, setSelectedOccupationId] = useState('warrior_heavy');

  // STEP 6: CULT
  const [selectedCultId, setSelectedCultId] = useState('orlanth');

  // STEP 7: SPELLS
  const [selectedSpiritSpells, setSelectedSpiritSpells] = useState<string[]>(['sm_soin', 'sm_lame_de_feu', 'sm_protection']);
  const [selectedRuneSpells, setSelectedRuneSpells] = useState<string[]>(['rm_foudre', 'rm_vol']);

  // Derived current homeland & occupation & cult
  const homeland = HOMELANDS.find((h) => h.id === selectedHomelandId) || HOMELANDS[0];
  const occupation = OCCUPATIONS.find((o) => o.id === selectedOccupationId) || OCCUPATIONS[0];
  const cult = CULTS.find((c) => c.id === selectedCultId) || CULTS[0];

  const derived = calculateDerivedAttributes(chars);

  const handleRollAllChars = () => {
    // RQG Standard rolls:
    // STR: 3D6, CON: 3D6, SIZ: 2D6+6, INT: 2D6+6, POW: 3D6, DEX: 3D6, CHA: 3D6
    const roll3D6 = () => rollDice(6) + rollDice(6) + rollDice(6);
    const roll2D6Plus6 = () => rollDice(6) + rollDice(6) + 6;

    setChars({
      FOR: roll3D6(),
      CON: roll3D6(),
      TAI: roll2D6Plus6(),
      INT: roll2D6Plus6(),
      POU: roll3D6(),
      DEX: roll3D6(),
      CHA: roll3D6(),
    });
  };

  const handleFinish = () => {
    const catMods = derived.categoryModifiers;

    // Helper for category modifier
    const getCatMod = (cat: string) => {
      switch (cat) {
        case 'Agilité': return catMods.agilite;
        case 'Communication': return catMods.communication;
        case 'Connaissances': return catMods.connaissances;
        case 'Magie': return catMods.magie;
        case 'Manipulation': return catMods.manipulation;
        case 'Perception': return catMods.perception;
        case 'Furtivité': return catMods.furtivite;
        case 'Armes': return catMods.armes;
        case 'Boucliers': return catMods.boucliers;
        default: return 0;
      }
    };

    // Generate full skills list
    const rawSkills = [
      { id: 'sk_sword', name: 'Épée large 1M', category: 'Armes' as const, baseVal: 15, cultBonus: 20, occupationalBonus: 25, personalBonus: 10 },
      { id: 'sk_shield', name: 'Bouclier large', category: 'Boucliers' as const, baseVal: 15, cultBonus: 15, occupationalBonus: 20, personalBonus: 15 },
      { id: 'sk_bow', name: 'Arc composite', category: 'Armes' as const, baseVal: 10, cultBonus: 0, occupationalBonus: 20, personalBonus: 20 },
      { id: 'sk_ride', name: 'Équitation', category: 'Agilité' as const, baseVal: 10, cultBonus: 0, occupationalBonus: 25, personalBonus: 15 },
      { id: 'sk_jump', name: 'Saut', category: 'Agilité' as const, baseVal: 15, cultBonus: 10, occupationalBonus: 15, personalBonus: 10 },
      { id: 'sk_firstaid', name: 'Premiers Soins', category: 'Perception' as const, baseVal: 10, cultBonus: 10, occupationalBonus: 15, personalBonus: 15 },
      { id: 'sk_tactics', name: 'Bataille & Tactique', category: 'Connaissances' as const, baseVal: 10, cultBonus: 10, occupationalBonus: 25, personalBonus: 10 },
      { id: 'sk_customs', name: `Coutumes (${homeland.name})`, category: 'Connaissances' as const, baseVal: 25, cultBonus: 0, occupationalBonus: 15, personalBonus: 20 },
      { id: 'sk_speak', name: `Langue natale (${homeland.name})`, category: 'Communication' as const, baseVal: 50, cultBonus: 0, occupationalBonus: 0, personalBonus: 20 },
      { id: 'sk_bargain', name: 'Marchandage', category: 'Communication' as const, baseVal: 20, cultBonus: 0, occupationalBonus: 15, personalBonus: 10 },
    ];

    const defaultSkills: Skill[] = rawSkills.map((sk) => {
      const cMod = getCatMod(sk.category);
      const total = sk.baseVal + cMod + sk.cultBonus + sk.occupationalBonus + sk.personalBonus;
      return {
        ...sk,
        categoryMod: cMod,
        totalVal: total,
        experienceCheck: false,
      };
    });

    // Passions
    const passions: Passion[] = [
      { id: 'p_home', type: 'Loyauté', target: `${homeland.name} (${tribe})`, value: 70 },
      { id: 'p_clan', type: 'Amour', target: `Famille / Clan ${clan}`, value: 65 },
      { id: 'p_cult', type: 'Dévotion', target: cult.name, value: 70 },
      { id: 'p_hon', type: 'Honneur', target: 'Honneur personnel', value: 60 },
      { id: 'p_hate', type: 'Haine', target: 'Empire Lunaire', value: 60 },
    ];

    // Runes
    const runesList: RuneAffinity[] = [
      { rune: elementPrimary, value: 75, category: 'Élément' },
      { rune: elementSecondary, value: 50, category: 'Élément' },
      { rune: elementTertiary, value: 25, category: 'Élément' },
      { rune: 'Homme', value: powerPairs['Homme'], category: 'Puissance' },
      { rune: 'Bête', value: 100 - powerPairs['Homme'], category: 'Puissance' },
      { rune: 'Mort', value: powerPairs['Mort'], category: 'Puissance' },
      { rune: 'Fertilité', value: 100 - powerPairs['Mort'], category: 'Puissance' },
      { rune: 'Harmonie', value: powerPairs['Harmonie'], category: 'Puissance' },
      { rune: 'Désaccord', value: 100 - powerPairs['Harmonie'], category: 'Puissance' },
      { rune: 'Vérité', value: powerPairs['Vérité'], category: 'Puissance' },
      { rune: 'Illusion', value: 100 - powerPairs['Vérité'], category: 'Puissance' },
      { rune: 'Mouvement', value: powerPairs['Mouvement'], category: 'Puissance' },
      { rune: 'Stase', value: 100 - powerPairs['Mouvement'], category: 'Puissance' },
    ];

    // Weapons
    const weaponsList: Weapon[] = [
      { id: 'w_1', name: 'Épée large en bronze', category: 'Corps à corps', sr: 2, damage: '1D8+1', hasDamageBonus: true, hpMax: 12, hpCurrent: 12, skillName: 'Épée large 1M' },
      { id: 'w_2', name: 'Bouclier large en bronze', category: 'Bouclier', sr: 3, damage: '1D6', hasDamageBonus: true, hpMax: 16, hpCurrent: 16, skillName: 'Bouclier large' },
      { id: 'w_3', name: 'Arc composite', category: 'Distance', sr: 2, damage: '1D8+1', hasDamageBonus: false, hpMax: 8, hpCurrent: 8, skillName: 'Arc composite', range: '100m' },
    ];

    // Spells
    const spellsList: Spell[] = SPELLS_DATABASE.filter(
      (s) => selectedSpiritSpells.includes(s.id) || selectedRuneSpells.includes(s.id)
    );

    // Hit Locations with default armor from occupation
    const defaultArmorVal = selectedOccupationId === 'warrior_heavy' ? 6 : selectedOccupationId === 'noble_chieftain' ? 6 : 3;
    const defaultArmorType = selectedOccupationId === 'warrior_heavy' ? 'Cuirasse et grèves de bronze' : 'Armure de cuir renforcé';
    const hitLocs = generateHitLocations(derived.hpMax, defaultArmorVal, defaultArmorType);

    const familySummary = Object.entries(familyChoices).map(([yr, outcomeIdx]) => {
      const ev = FAMILY_HISTORY_TIMELINE.find((f) => f.year === Number(yr));
      const out = ev ? ev.outcomes[Number(outcomeIdx)] : null;
      return `${yr} : ${ev?.title} — ${out?.description || ''}`;
    });

    const newAdventurer: Adventurer = {
      id: 'adv_' + Date.now(),
      name,
      gender,
      age,
      homeland: `${homeland.name} (${tribe})`,
      tribe,
      clan,
      occupation: occupation.name,
      livingStandard: occupation.livingStandard,
      cults: [
        {
          cultId: cult.id,
          cultName: cult.name,
          rank: 'Initié',
          runePointsMax: 3,
          runePointsCurrent: 3,
          holyDay: cult.holyDay,
        }
      ],
      characteristics: chars,
      derived,
      currentHp: derived.hpMax,
      currentMagicPoints: derived.magicPointsMax,
      runes: runesList,
      passions,
      skills: defaultSkills,
      weapons: weaponsList,
      hitLocations: hitLocs,
      spells: spellsList,
      equipment: [...occupation.equipment, 'Rations de voyage', 'Outre d\'eau', 'Bourse de cuir'],
      currency: { clacks: 40, lunars: occupation.incomeL, wheels: 1 },
      notes: `Aventurier de la patrie ${homeland.name}, dévoué au culte de ${cult.name}.`,
      familyHistory: familySummary,
    };

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    onSaveCharacter(newAdventurer);
  };

  const stepsList = [
    { num: 1, label: 'Patrie & Identité' },
    { num: 2, label: 'Histoire Familiale' },
    { num: 3, label: 'Caractéristiques' },
    { num: 4, label: 'Runes & Passions' },
    { num: 5, label: 'Profession' },
    { num: 6, label: 'Culte & Runes' },
    { num: 7, label: 'Grimoire & Sorts' },
    { num: 8, label: 'Validation & Fiche' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 text-stone-100 font-sans">
      {/* Header Wizard Navigation */}
      <div className="p-6 rounded-2xl bg-stone-900 border border-amber-800/40 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-900/30 border border-amber-600/50 text-amber-400">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-amber-200">
                Créateur d'Aventurier RQG
              </h1>
              <p className="text-xs text-stone-400">
                Étape {step} sur 8 : <span className="text-amber-300 font-semibold">{stepsList[step - 1].label}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-xs text-stone-400 hover:text-stone-200 px-3 py-1.5 rounded bg-stone-800 border border-stone-700"
          >
            Annuler
          </button>
        </div>

        {/* Progress Bar & Steps Tabs */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-2">
          {stepsList.map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`p-2 rounded-lg text-center transition flex flex-col items-center justify-center gap-0.5 cursor-pointer border ${
                step === s.num
                  ? 'bg-amber-600/30 text-amber-200 border-amber-500 shadow-sm'
                  : step > s.num
                  ? 'bg-stone-950 text-emerald-400 border-stone-800'
                  : 'bg-stone-950/50 text-stone-500 border-stone-900'
              }`}
            >
              <span className="text-[10px] font-mono font-bold">
                {step > s.num ? '✓' : `0${s.num}`}
              </span>
              <span className="text-[10px] truncate max-w-full font-serif hidden sm:inline">
                {s.label.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: IDENTITY & HOMELAND */}
      {step === 1 && (
        <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-serif font-bold text-amber-200 flex items-center gap-2">
              <User className="h-5 w-5 text-amber-400" /> Identité & Choix de la Patrie
            </h2>
            <p className="text-xs text-stone-400">
              Dans Glorantha, votre patrie d'origine détermine votre culture, vos langues natales, vos runes primaires et vos passions initiales.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs text-stone-400 block mb-1">Nom de l'Aventurier</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-amber-200 font-serif font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-stone-400 block mb-1">Genre</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:border-amber-500 focus:outline-none"
              >
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-stone-400 block mb-1">Âge (ans)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm font-mono text-stone-200"
              />
            </div>
            <div>
              <label className="text-xs text-stone-400 block mb-1">Tribu</label>
              <input
                type="text"
                value={tribe}
                onChange={(e) => setTribe(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200"
              />
            </div>
            <div>
              <label className="text-xs text-stone-400 block mb-1">Clan / Famille</label>
              <input
                type="text"
                value={clan}
                onChange={(e) => setClan(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200"
              />
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-stone-800">
            <label className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block">
              Sélectionnez une Patrie Gloranthienne
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {HOMELANDS.map((h) => (
                <div
                  key={h.id}
                  onClick={() => setSelectedHomelandId(h.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
                    selectedHomelandId === h.id
                      ? 'bg-amber-950/40 border-amber-500 shadow-md'
                      : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-amber-200 text-sm">{h.name}</h3>
                    <span className="text-[10px] text-stone-400 font-mono">{h.culture}</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">{h.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {h.primaryRunes.map((r) => (
                      <RuneBadge key={r} rune={r} size="sm" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: FAMILY HISTORY */}
      {step === 2 && (
        <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-serif font-bold text-amber-200 flex items-center gap-2">
              <Scroll className="h-5 w-5 text-amber-400" /> Histoire Familiale & Événements (1582 à 1625)
            </h2>
            <p className="text-xs text-stone-400">
              Choisissez ce qu'ont accompli vos grands-parents et parents durant les grandes guerres contre l'Empire Lunaire.
            </p>
          </div>

          <div className="space-y-6">
            {FAMILY_HISTORY_TIMELINE.map((event) => (
              <div key={event.year} className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-amber-400">Année {event.year}</span>
                    <span className="text-sm font-serif font-bold text-stone-200">— {event.title}</span>
                  </div>
                  <span className="text-xs text-stone-400">{event.location}</span>
                </div>
                <p className="text-xs text-stone-300 italic">{event.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                  {event.outcomes.map((out, oIdx) => {
                    const isSelected = familyChoices[event.year] === oIdx;
                    return (
                      <div
                        key={oIdx}
                        onClick={() => setFamilyChoices({ ...familyChoices, [event.year]: oIdx })}
                        className={`p-3 rounded-lg border text-xs space-y-1.5 transition cursor-pointer ${
                          isSelected
                            ? 'bg-amber-950/50 border-amber-500 text-amber-100 shadow'
                            : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>{out.label}</span>
                          {isSelected && <Check className="h-3.5 w-3.5 text-amber-400" />}
                        </div>
                        <p className="text-[11px] text-stone-400">{out.description}</p>
                        {out.passionGained && (
                          <div className="text-[10px] text-emerald-400 font-semibold pt-1">
                            +{out.passionGained.value}% {out.passionGained.type} ({out.passionGained.target})
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: CHARACTERISTICS */}
      {step === 3 && (
        <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-lg font-serif font-bold text-amber-200 flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-400" /> Caractéristiques Primaires & Attributs
              </h2>
              <p className="text-xs text-stone-400">
                Ajustez manuellement ou tirez vos 7 caractéristiques de base selon les règles RQG (3D6 ou 2D6+6).
              </p>
            </div>
            <button
              onClick={handleRollAllChars}
              className="px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-stone-950 font-serif font-bold text-xs shadow flex items-center gap-2 self-start"
            >
              <Dices className="h-4 w-4" /> Lancer tous les dés
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { key: 'FOR', label: 'Force (FOR)', hint: '3D6' },
              { key: 'CON', label: 'Constitution (CON)', hint: '3D6' },
              { key: 'TAI', label: 'Taille (TAI)', hint: '2D6+6' },
              { key: 'INT', label: 'Intelligence (INT)', hint: '2D6+6' },
              { key: 'POU', label: 'Pouvoir (POU)', hint: '3D6' },
              { key: 'DEX', label: 'Dextérité (DEX)', hint: '3D6' },
              { key: 'CHA', label: 'Charisme (CHA)', hint: '3D6' },
            ].map(({ key, label, hint }) => (
              <div key={key} className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-center space-y-1">
                <span className="text-[11px] font-bold text-stone-300 block">{label.split(' ')[0]}</span>
                <span className="text-[10px] text-stone-500 font-mono">{hint}</span>
                <input
                  type="number"
                  min="3"
                  max="21"
                  value={chars[key as keyof CharacteristicValues]}
                  onChange={(e) =>
                    setChars({
                      ...chars,
                      [key]: Number(e.target.value),
                    })
                  }
                  className="w-full bg-stone-800 border border-stone-700 rounded py-1.5 text-center font-mono text-lg font-bold text-amber-300 focus:border-amber-500 focus:outline-none"
                />
              </div>
            ))}
          </div>

          {/* Derived Attributes Summary Panel */}
          <div className="p-4 rounded-xl bg-stone-950/80 border border-amber-600/30 space-y-4">
            <div>
              <span className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block mb-2">
                Attributs Dérivés & Limites
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
                <div className="p-2.5 rounded bg-stone-900 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block">Points de Vie (PV)</span>
                  <strong className="text-base font-mono text-emerald-400">{derived.hpMax}</strong>
                </div>
                <div className="p-2.5 rounded bg-stone-900 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block">Points de Magie (PM)</span>
                  <strong className="text-base font-mono text-cyan-400">{derived.magicPointsMax}</strong>
                </div>
                <div className="p-2.5 rounded bg-stone-900 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block">Bonus aux Dégâts</span>
                  <strong className="text-base font-mono text-amber-400">{derived.damageBonus}</strong>
                </div>
                <div className="p-2.5 rounded bg-stone-900 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block">SR DEX / TAI</span>
                  <strong className="text-base font-mono text-stone-200">{derived.srDex} / {derived.srSize}</strong>
                </div>
                <div className="p-2.5 rounded bg-stone-900 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block">Taux de Guérison</span>
                  <strong className="text-base font-mono text-stone-200">{derived.healingRate} pts/sem.</strong>
                </div>
                <div className="p-2.5 rounded bg-stone-900 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block">Dégâts Spirituels</span>
                  <strong className="text-base font-mono text-purple-400">{derived.spiritCombatDamage}</strong>
                </div>
              </div>
            </div>

            {/* Live Category Modifiers */}
            <div>
              <span className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block mb-2">
                Modificateurs de Catégories de Compétences (Calculés en direct)
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 text-center text-xs">
                {[
                  { cat: 'Agilité', mod: derived.categoryModifiers.agilite, icon: '🏃' },
                  { cat: 'Communication', mod: derived.categoryModifiers.communication, icon: '💬' },
                  { cat: 'Connaissances', mod: derived.categoryModifiers.connaissances, icon: '📜' },
                  { cat: 'Magie', mod: derived.categoryModifiers.magie, icon: '✨' },
                  { cat: 'Manipulation', mod: derived.categoryModifiers.manipulation, icon: '🖐️' },
                  { cat: 'Perception', mod: derived.categoryModifiers.perception, icon: '👁️' },
                  { cat: 'Furtivité', mod: derived.categoryModifiers.furtivite, icon: '🥷' },
                  { cat: 'Armes', mod: derived.categoryModifiers.armes, icon: '⚔️' },
                  { cat: 'Boucliers', mod: derived.categoryModifiers.boucliers, icon: '🛡️' },
                ].map(({ cat, mod, icon }) => (
                  <div key={cat} className="p-1.5 rounded-lg bg-stone-900 border border-stone-800">
                    <span className="text-[9px] text-stone-400 block truncate">{icon} {cat}</span>
                    <strong className={`font-mono text-xs ${
                      mod > 0 ? 'text-emerald-400' : mod < 0 ? 'text-red-400' : 'text-stone-300'
                    }`}>
                      {formatModifier(mod)}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: RUNES & PASSIONS */}
      {step === 4 && (
        <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-serif font-bold text-amber-200 flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-400" /> Runes Élémentaires & Runes de Puissance
            </h2>
            <p className="text-xs text-stone-400">
              Dans RuneQuest, les Runes définissent la magie de votre âme et vos résonances avec les dieux.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider">
              1. Runes Élémentaires (Affectez 75%, 50%, 25%)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-stone-400 block mb-1">Rune Primaire (75%)</label>
                <select
                  value={elementPrimary}
                  onChange={(e) => setElementPrimary(e.target.value as ElementalRune)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200"
                >
                  {['Air', 'Terre', 'Feu', 'Eau', 'Ténèbres', 'Lune'].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <div className="mt-2"><RuneBadge rune={elementPrimary} value={75} /></div>
              </div>
              <div>
                <label className="text-xs text-stone-400 block mb-1">Rune Secondaire (50%)</label>
                <select
                  value={elementSecondary}
                  onChange={(e) => setElementSecondary(e.target.value as ElementalRune)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200"
                >
                  {['Air', 'Terre', 'Feu', 'Eau', 'Ténèbres', 'Lune'].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <div className="mt-2"><RuneBadge rune={elementSecondary} value={50} /></div>
              </div>
              <div>
                <label className="text-xs text-stone-400 block mb-1">Rune Tertiaire (25%)</label>
                <select
                  value={elementTertiary}
                  onChange={(e) => setElementTertiary(e.target.value as ElementalRune)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200"
                >
                  {['Air', 'Terre', 'Feu', 'Eau', 'Ténèbres', 'Lune'].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <div className="mt-2"><RuneBadge rune={elementTertiary} value={25} /></div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-stone-800">
            <h3 className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider">
              2. Paires de Runes de Puissance (Total = 100%)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { left: 'Homme', right: 'Bête' },
                { left: 'Mort', right: 'Fertilité' },
                { left: 'Harmonie', right: 'Désaccord' },
                { left: 'Vérité', right: 'Illusion' },
                { left: 'Mouvement', right: 'Stase' },
              ].map(({ left, right }) => {
                const val = powerPairs[left] || 50;
                return (
                  <div key={left} className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-serif font-bold">
                      <span className="text-amber-300">{left} ({val}%)</span>
                      <span className="text-stone-400">{right} ({100 - val}%)</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={val}
                      onChange={(e) => setPowerPairs({ ...powerPairs, [left]: Number(e.target.value) })}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: OCCUPATION */}
      {step === 5 && (
        <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-serif font-bold text-amber-200 flex items-center gap-2">
              <Swords className="h-5 w-5 text-amber-400" /> Profession & Rôle dans la Société
            </h2>
            <p className="text-xs text-stone-400">
              Votre métier confère un paquet de compétences martiales ou pacifiques, un niveau de vie et un équipement initial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OCCUPATIONS.map((occ) => (
              <div
                key={occ.id}
                onClick={() => setSelectedOccupationId(occ.id)}
                className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
                  selectedOccupationId === occ.id
                    ? 'bg-amber-950/40 border-amber-500 shadow-md'
                    : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-amber-200 text-sm">{occ.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-stone-800 text-amber-300 font-mono border border-stone-700">
                    {occ.livingStandard} ({occ.incomeL} L)
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">{occ.description}</p>
                <div className="flex flex-wrap gap-1 text-[11px] text-stone-400 pt-1">
                  {occ.skills.slice(0, 3).map((sk) => (
                    <span key={sk.name} className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300">
                      +{sk.bonus}% {sk.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 6: CULT */}
      {step === 6 && (
        <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-serif font-bold text-amber-200 flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-400" /> Affiliation Divine & Culte
            </h2>
            <p className="text-xs text-stone-400">
              Tout le monde dans Glorantha appartient à un culte. Votre déesse ou dieu vous accorde des Points de Rune (3 PR de départ) et des sorts sacrés.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CULTS.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCultId(c.id)}
                className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
                  selectedCultId === c.id
                    ? 'bg-amber-950/40 border-amber-500 shadow-md'
                    : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-amber-200 text-sm">{c.name}</h3>
                  <span className="text-[10px] text-stone-400 font-mono">{c.pantheon}</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">{c.concept}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {c.runes.map((r) => (
                    <RuneBadge key={r} rune={r} size="sm" />
                  ))}
                </div>
                <p className="text-[11px] text-stone-400 pt-1">
                  <strong className="text-stone-300">Jour sacré :</strong> {c.holyDay}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 7: SPELLS */}
      {step === 7 && (
        <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-serif font-bold text-amber-200 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-400" /> Sélection de Sorts Initiaux
            </h2>
            <p className="text-xs text-stone-400">
              Choisissez jusqu'à 3-4 sorts de Magie Spirituelle et vos sorts Runiques accordés par votre culte.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider">
              Magie des Esprits (Spirit Magic)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SPELLS_DATABASE.filter((s) => s.type === 'Esprit').map((sp) => {
                const isSelected = selectedSpiritSpells.includes(sp.id);
                return (
                  <div
                    key={sp.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedSpiritSpells(selectedSpiritSpells.filter((id) => id !== sp.id));
                      } else {
                        setSelectedSpiritSpells([...selectedSpiritSpells, sp.id]);
                      }
                    }}
                    className={`p-3 rounded-xl border text-xs space-y-1 transition cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-cyan-100 shadow'
                        : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-amber-200">{sp.name}</span>
                      <span className="text-[10px] font-mono text-cyan-400">{sp.cost}</span>
                    </div>
                    <p className="text-[11px] text-stone-400">{sp.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-stone-800">
            <h3 className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider">
              Magie Runique Divine (Rune Spells)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SPELLS_DATABASE.filter((s) => s.type === 'Runique').map((sp) => {
                const isSelected = selectedRuneSpells.includes(sp.id);
                return (
                  <div
                    key={sp.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedRuneSpells(selectedRuneSpells.filter((id) => id !== sp.id));
                      } else {
                        setSelectedRuneSpells([...selectedRuneSpells, sp.id]);
                      }
                    }}
                    className={`p-3 rounded-xl border text-xs space-y-1 transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500 text-amber-100 shadow'
                        : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-amber-200">{sp.name}</span>
                      <span className="text-[10px] font-mono text-amber-400">{sp.cost}</span>
                    </div>
                    <p className="text-[11px] text-stone-400">{sp.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 8: RECAP & FINISH */}
      {step === 8 && (
        <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-serif font-bold text-amber-200 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" /> Récapitulatif Final de l'Aventurier
            </h2>
            <p className="text-xs text-stone-400">
              Vérifiez toutes vos informations avant d'enregistrer et de générer votre feuille de personnage interactive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
              <h3 className="font-serif font-bold text-sm text-amber-300">Identité & Origine</h3>
              <p className="text-xs text-stone-300"><strong>Nom :</strong> {name}</p>
              <p className="text-xs text-stone-300"><strong>Patrie :</strong> {homeland.name} ({tribe})</p>
              <p className="text-xs text-stone-300"><strong>Profession :</strong> {occupation.name}</p>
              <p className="text-xs text-stone-300"><strong>Culte :</strong> {cult.name}</p>
              <p className="text-xs text-stone-300"><strong>Niveau de vie :</strong> {occupation.livingStandard}</p>
            </div>

            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
              <h3 className="font-serif font-bold text-sm text-amber-300">Stats & Dégâts</h3>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-stone-900 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block">PV Max</span>
                  <strong className="text-emerald-400 font-mono text-sm">{derived.hpMax}</strong>
                </div>
                <div className="p-2 rounded bg-stone-900 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block">PM Max</span>
                  <strong className="text-cyan-400 font-mono text-sm">{derived.magicPointsMax}</strong>
                </div>
                <div className="p-2 rounded bg-stone-900 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block">Bonus Dégâts</span>
                  <strong className="text-amber-400 font-mono text-sm">{derived.damageBonus}</strong>
                </div>
              </div>
              <p className="text-[11px] text-stone-400 pt-1">
                FOR {chars.FOR} • CON {chars.CON} • TAI {chars.TAI} • INT {chars.INT} • POU {chars.POU} • DEX {chars.DEX} • CHA {chars.CHA}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
            <h3 className="font-serif font-bold text-sm text-amber-300">Sorts Maîtrisés</h3>
            <div className="flex flex-wrap gap-1.5">
              {selectedSpiritSpells.map((id) => {
                const sp = SPELLS_DATABASE.find((s) => s.id === id);
                return sp ? (
                  <span key={id} className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-700 text-xs">
                    ✨ {sp.name}
                  </span>
                ) : null;
              })}
              {selectedRuneSpells.map((id) => {
                const sp = SPELLS_DATABASE.find((s) => s.id === id);
                return sp ? (
                  <span key={id} className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-700 text-xs">
                    ⚡ {sp.name}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          disabled={step === 1}
          onClick={() => setStep(step - 1)}
          className={`px-5 py-2.5 rounded-xl font-serif text-xs font-bold flex items-center gap-2 transition ${
            step === 1
              ? 'opacity-40 cursor-not-allowed text-stone-500 bg-stone-900 border border-stone-800'
              : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 cursor-pointer'
          }`}
        >
          <ArrowLeft className="h-4 w-4" /> Précédent
        </button>

        {step < 8 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-serif font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center gap-2 cursor-pointer transition"
          >
            Suivant <ArrowRight className="h-4 w-4 text-stone-950" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-serif font-bold text-sm shadow-xl shadow-emerald-950/50 flex items-center gap-2 cursor-pointer transition transform hover:scale-105"
          >
            <Check className="h-5 w-5" /> Enregistrer & Créer la Fiche
          </button>
        )}
      </div>
    </div>
  );
};
