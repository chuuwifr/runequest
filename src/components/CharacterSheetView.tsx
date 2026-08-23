import React, { useState } from 'react';
import { 
  Shield, 
  Heart, 
  Zap, 
  Flame, 
  Dices, 
  Plus, 
  Minus, 
  Swords, 
  Scroll, 
  BookOpen, 
  Sparkles, 
  Save, 
  Download, 
  Trash2,
  CheckSquare,
  Square,
  Crown,
  User,
  ShieldCheck,
  Package,
  Coins,
  Edit3,
  Check,
  X,
  Filter,
  Info,
  Layers,
  Activity
} from 'lucide-react';
import { Adventurer, BodyPart, CharacteristicValues, HitLocation, Passion, RollResult, RuneAffinity, Skill, Spell, Weapon } from '../types/runequest';
import { RuneBadge } from './RuneBadge';
import { evaluateD100, parseAndRollDiceFormula, rollDice, rollHitLocation } from '../utils/dice';
import { formatModifier, calculateSkillCategoryModifiers } from '../utils/rqCalculations';
import { AddSkillModal } from './modals/AddSkillModal';
import { AddSpellModal } from './modals/AddSpellModal';
import { AddWeaponModal } from './modals/AddWeaponModal';
import { AddEquipmentModal } from './modals/AddEquipmentModal';
import { AddPassionModal } from './modals/AddPassionModal';
import { AddRuneModal } from './modals/AddRuneModal';
import { EditArmorModal } from './modals/EditArmorModal';
import { EditCurrencyModal } from './modals/EditCurrencyModal';
import { CategoryModifiersModal } from './modals/CategoryModifiersModal';
import { CharacteristicTestModal } from './modals/CharacteristicTestModal';

interface CharacterSheetViewProps {
  adventurer: Adventurer;
  onUpdateAdventurer: (updated: Adventurer) => void;
  allAdventurers: Adventurer[];
  onSelectAdventurer: (adv: Adventurer) => void;
  onDeleteAdventurer: (id: string) => void;
  onAddRollResult: (res: RollResult) => void;
}

export const CharacterSheetView: React.FC<CharacterSheetViewProps> = ({
  adventurer,
  onUpdateAdventurer,
  allAdventurers,
  onSelectAdventurer,
  onDeleteAdventurer,
  onAddRollResult,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'combat' | 'skills' | 'magic' | 'equipment' | 'notes'>('combat');
  const [skillSearch, setSkillSearch] = useState('');
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>('Tous');

  // Modals state
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isAddSpellOpen, setIsAddSpellOpen] = useState(false);
  const [isAddWeaponOpen, setIsAddWeaponOpen] = useState(false);
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false);
  const [isAddPassionOpen, setIsAddPassionOpen] = useState(false);
  const [isAddRuneOpen, setIsAddRuneOpen] = useState(false);
  const [isEditArmorOpen, setIsEditArmorOpen] = useState(false);
  const [isEditCurrencyOpen, setIsEditCurrencyOpen] = useState(false);

  // Characteristic Modals
  const [isCategoryModsOpen, setIsCategoryModsOpen] = useState(false);
  const [isCharTestOpen, setIsCharTestOpen] = useState(false);
  const [selectedCharTest, setSelectedCharTest] = useState<keyof CharacteristicValues>('FOR');

  // Quick Inline Edit for Skills
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingSkillVal, setEditingSkillVal] = useState<number>(50);

  // Calculated Category Modifiers
  const categoryMods = adventurer.derived.categoryModifiers || calculateSkillCategoryModifiers(adventurer.characteristics);

  // Quick HP adjust
  const handleHpChange = (delta: number) => {
    const newHp = Math.max(0, Math.min(adventurer.derived.hpMax, adventurer.currentHp + delta));
    onUpdateAdventurer({ ...adventurer, currentHp: newHp });
  };

  // Quick MP adjust
  const handleMpChange = (delta: number) => {
    const newMp = Math.max(0, Math.min(adventurer.derived.magicPointsMax, adventurer.currentMagicPoints + delta));
    onUpdateAdventurer({ ...adventurer, currentMagicPoints: newMp });
  };

  // Quick Location HP adjust
  const handleLocationHpChange = (partId: BodyPart, delta: number) => {
    const updatedLocs = adventurer.hitLocations.map((loc) => {
      if (loc.id === partId) {
        const nextHp = Math.max(-loc.hpMax, Math.min(loc.hpMax, loc.hpCurrent + delta));
        return { ...loc, hpCurrent: nextHp };
      }
      return loc;
    });
    onUpdateAdventurer({ ...adventurer, hitLocations: updatedLocs });
  };

  // Roll skill
  const handleRollSkill = (skill: Skill) => {
    const roll = rollDice(100);
    const result = evaluateD100(roll, skill.totalVal, skill.name, adventurer.name);
    onAddRollResult(result);
  };

  // Roll Rune or Passion
  const handleRollRuneOrPassion = (name: string, value: number, type: 'Rune' | 'Passion') => {
    const roll = rollDice(100);
    const result = evaluateD100(roll, value, `${type} : ${name}`, adventurer.name);
    onAddRollResult(result);
  };

  // Roll Weapon Attack & Damage
  const handleRollWeaponAttack = (weapon: Weapon) => {
    const skill = adventurer.skills.find((s) => s.name === weapon.skillName) || { totalVal: 50 };
    const roll = rollDice(100);
    const result = evaluateD100(roll, skill.totalVal, `Attaque [${weapon.name}]`, adventurer.name);
    onAddRollResult(result);

    if (result.level === 'Critique' || result.level === 'Spéciale' || result.level === 'Réussite') {
      const fullFormula = weapon.hasDamageBonus && adventurer.derived.damageBonus !== '0'
        ? `${weapon.damage}${adventurer.derived.damageBonus}`
        : weapon.damage;
      const dmg = parseAndRollDiceFormula(fullFormula);
      const hitLoc = rollHitLocation();

      setTimeout(() => {
        onAddRollResult({
          diceRoll: dmg.total,
          targetSkill: 0,
          level: 'Réussite',
          critThreshold: 0,
          specialThreshold: 0,
          fumbleThreshold: 0,
          skillName: `Dégâts [${weapon.name}] → ${hitLoc.locationName} (D20=${hitLoc.roll})`,
          characterName: adventurer.name,
          timestamp: new Date().toLocaleTimeString(),
          detailMessage: `Inflige ${dmg.total} points de dégâts (${dmg.rolls.join('+')}) à la localisation ${hitLoc.locationName}.`,
        });
      }, 200);
    }
  };

  // Cast Spell
  const handleCastSpell = (spell: { name: string; cost: string }) => {
    const pmMatch = spell.cost.match(/(\d+)\s*PM/i);
    if (pmMatch) {
      const cost = parseInt(pmMatch[1], 10);
      if (adventurer.currentMagicPoints >= cost) {
        handleMpChange(-cost);
      }
    }
    const roll = rollDice(100);
    const result = evaluateD100(roll, adventurer.characteristics.POU * 5, `Lancement [${spell.name}]`, adventurer.name);
    onAddRollResult(result);
  };

  // Toggle Experience Check
  const handleToggleExp = (skillId: string) => {
    const updatedSkills = adventurer.skills.map((s) => {
      if (s.id === skillId) {
        return { ...s, experienceCheck: !s.experienceCheck };
      }
      return s;
    });
    onUpdateAdventurer({ ...adventurer, skills: updatedSkills });
  };

  // Helper to get category mod value for a skill category
  const getCategoryModifierValue = (cat: string): number => {
    switch (cat) {
      case 'Agilité': return categoryMods.agilite;
      case 'Communication': return categoryMods.communication;
      case 'Connaissances': return categoryMods.connaissances;
      case 'Magie': return categoryMods.magie;
      case 'Manipulation': return categoryMods.manipulation;
      case 'Perception': return categoryMods.perception;
      case 'Furtivité': return categoryMods.furtivite;
      case 'Armes': return categoryMods.armes;
      case 'Boucliers': return categoryMods.boucliers;
      default: return 0;
    }
  };

  // ADD / REMOVE HANDLERS
  const handleAddSkill = (newSkill: Skill) => {
    onUpdateAdventurer({
      ...adventurer,
      skills: [...adventurer.skills, newSkill],
    });
  };

  const handleDeleteSkill = (skillId: string) => {
    onUpdateAdventurer({
      ...adventurer,
      skills: adventurer.skills.filter((s) => s.id !== skillId),
    });
  };

  const handleSaveSkillEdit = (skillId: string) => {
    const updated = adventurer.skills.map((s) => {
      if (s.id === skillId) {
        return { ...s, totalVal: Number(editingSkillVal) || s.totalVal };
      }
      return s;
    });
    onUpdateAdventurer({ ...adventurer, skills: updated });
    setEditingSkillId(null);
  };

  const handleAddSpell = (newSpell: Spell) => {
    onUpdateAdventurer({
      ...adventurer,
      spells: [...adventurer.spells, newSpell],
    });
  };

  const handleDeleteSpell = (spellId: string) => {
    onUpdateAdventurer({
      ...adventurer,
      spells: adventurer.spells.filter((s) => s.id !== spellId),
    });
  };

  const handleAddWeapon = (newWeapon: Weapon) => {
    onUpdateAdventurer({
      ...adventurer,
      weapons: [...adventurer.weapons, newWeapon],
    });
  };

  const handleDeleteWeapon = (weaponId: string) => {
    onUpdateAdventurer({
      ...adventurer,
      weapons: adventurer.weapons.filter((w) => w.id !== weaponId),
    });
  };

  const handleAddEquipment = (itemDescription: string) => {
    onUpdateAdventurer({
      ...adventurer,
      equipment: [...adventurer.equipment, itemDescription],
    });
  };

  const handleDeleteEquipment = (index: number) => {
    const updated = [...adventurer.equipment];
    updated.splice(index, 1);
    onUpdateAdventurer({
      ...adventurer,
      equipment: updated,
    });
  };

  const handleAddPassion = (newPassion: Passion) => {
    onUpdateAdventurer({
      ...adventurer,
      passions: [...adventurer.passions, newPassion],
    });
  };

  const handleDeletePassion = (passionId: string) => {
    onUpdateAdventurer({
      ...adventurer,
      passions: adventurer.passions.filter((p) => p.id !== passionId),
    });
  };

  const handleAddRune = (newRune: RuneAffinity) => {
    const exists = adventurer.runes.some((r) => r.rune === newRune.rune);
    let updatedRunes: RuneAffinity[];
    if (exists) {
      updatedRunes = adventurer.runes.map((r) =>
        r.rune === newRune.rune ? { ...r, value: newRune.value } : r
      );
    } else {
      updatedRunes = [...adventurer.runes, newRune];
    }
    onUpdateAdventurer({ ...adventurer, runes: updatedRunes });
  };

  const handleSaveArmor = (updatedLocations: HitLocation[]) => {
    onUpdateAdventurer({
      ...adventurer,
      hitLocations: updatedLocations,
    });
  };

  const handleSaveCurrency = (currency: Adventurer['currency']) => {
    onUpdateAdventurer({
      ...adventurer,
      currency,
    });
  };

  const skillCategories = ['Tous', 'Agilité', 'Communication', 'Connaissances', 'Magie', 'Manipulation', 'Perception', 'Furtivité', 'Armes', 'Boucliers'];
  const filteredSkills = adventurer.skills.filter((sk) => {
    const matchesSearch = sk.name.toLowerCase().includes(skillSearch.toLowerCase());
    const matchesCat = selectedSkillCategory === 'Tous' || sk.category === selectedSkillCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 text-stone-100 font-sans">
      {/* ROSTER / CHARACTER SELECTOR BAR */}
      <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs font-serif font-bold text-stone-400 uppercase tracking-wider pl-1">
            Aventurier Actif :
          </span>
          {allAdventurers.map((adv) => (
            <button
              key={adv.id}
              onClick={() => onSelectAdventurer(adv)}
              className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition whitespace-nowrap cursor-pointer ${
                adv.id === adventurer.id
                  ? 'bg-amber-600/30 text-amber-200 border border-amber-500 shadow-sm'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {adv.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCategoryModsOpen(true)}
            className="px-2.5 py-1.5 rounded bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-600/40 text-xs flex items-center gap-1.5 cursor-pointer shadow-sm font-serif"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Bonus Caractéristiques
          </button>
          <button
            onClick={() => {
              const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(adventurer, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute('href', dataStr);
              downloadAnchor.setAttribute('download', `${adventurer.name.replace(/\s+/g, '_')}_RQG.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="p-1.5 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 text-xs flex items-center gap-1 cursor-pointer"
            title="Exporter en JSON"
          >
            <Download className="h-3.5 w-3.5" /> Exporter
          </button>
        </div>
      </div>

      {/* HERO BANNER & STATS STATUS */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border border-amber-800/50 shadow-2xl space-y-6">
        {/* Top Info Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-amber-200 tracking-wide">
                {adventurer.name}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/40">
                {adventurer.age} ans
              </span>
            </div>
            <p className="text-xs text-stone-300">
              <strong className="text-amber-300">{adventurer.occupation}</strong> de{' '}
              <span className="text-stone-200">{adventurer.homeland}</span> • Culte de{' '}
              <strong className="text-amber-400">{adventurer.cults[0]?.cultName || 'Initié'}</strong> ({adventurer.cults[0]?.rank || 'Initié'})
            </p>
          </div>

          {/* Quick HP / MP / Rune Points Meters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* HP Meter */}
            <div className="p-2.5 rounded-xl bg-stone-950/80 border border-emerald-900/50 flex items-center gap-3">
              <Heart className="h-5 w-5 text-emerald-400" />
              <div>
                <div className="text-[10px] text-stone-400 font-semibold uppercase">Points de Vie</div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => handleHpChange(-1)} className="p-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="font-mono font-bold text-sm text-emerald-300">
                    {adventurer.currentHp} / {adventurer.derived.hpMax}
                  </span>
                  <button onClick={() => handleHpChange(1)} className="p-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* MP Meter */}
            <div className="p-2.5 rounded-xl bg-stone-950/80 border border-cyan-900/50 flex items-center gap-3">
              <Zap className="h-5 w-5 text-cyan-400" />
              <div>
                <div className="text-[10px] text-stone-400 font-semibold uppercase">Points de Magie</div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => handleMpChange(-1)} className="p-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="font-mono font-bold text-sm text-cyan-300">
                    {adventurer.currentMagicPoints} / {adventurer.derived.magicPointsMax}
                  </span>
                  <button onClick={() => handleMpChange(1)} className="p-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Rune Points Meter */}
            <div className="p-2.5 rounded-xl bg-stone-950/80 border border-amber-900/50 flex items-center gap-3">
              <Crown className="h-5 w-5 text-amber-400" />
              <div>
                <div className="text-[10px] text-stone-400 font-semibold uppercase">Points de Rune</div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-sm text-amber-300">
                    {adventurer.cults[0]?.runePointsCurrent ?? 3} / {adventurer.cults[0]?.runePointsMax ?? 3}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHARACTERISTICS GRID & DERIVED BAR */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-amber-400" /> Caractéristiques Principales (Cliquer pour lancer un test)
            </span>
            <button
              onClick={() => setIsCategoryModsOpen(true)}
              className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 underline decoration-amber-500/40 cursor-pointer"
            >
              <Info className="h-3 w-3" /> Voir le détail des bonus
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {[
              { key: 'FOR' as const, label: 'FOR', name: 'Force', val: adventurer.characteristics.FOR },
              { key: 'CON' as const, label: 'CON', name: 'Constitution', val: adventurer.characteristics.CON },
              { key: 'TAI' as const, label: 'TAI', name: 'Taille', val: adventurer.characteristics.TAI },
              { key: 'INT' as const, label: 'INT', name: 'Intelligence', val: adventurer.characteristics.INT },
              { key: 'POU' as const, label: 'POU', name: 'Pouvoir', val: adventurer.characteristics.POU },
              { key: 'DEX' as const, label: 'DEX', name: 'Dextérité', val: adventurer.characteristics.DEX },
              { key: 'CHA' as const, label: 'CHA', name: 'Charisme', val: adventurer.characteristics.CHA },
            ].map(({ key, label, name, val }) => (
              <div
                key={key}
                onClick={() => {
                  setSelectedCharTest(key);
                  setIsCharTestOpen(true);
                }}
                className="p-2.5 rounded-xl bg-stone-950/90 border border-stone-800 hover:border-amber-500/60 hover:bg-stone-900 transition text-center cursor-pointer group shadow-sm relative overflow-hidden"
                title={`Cliquer pour tester ${name} (x1, x2, x3, x4, x5 ou Opposition)`}
              >
                <span className="text-[10px] font-serif font-bold text-stone-400 block group-hover:text-amber-300">
                  {label}
                </span>
                <span className="font-mono text-lg font-bold text-amber-300 group-hover:scale-105 transition-transform inline-block">
                  {val}
                </span>
                <span className="text-[9px] text-stone-500 block font-mono">({val * 5}%)</span>
              </div>
            ))}
          </div>

          {/* Derived Combat Stats & Limits */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
            <div className="p-2 rounded bg-stone-950 border border-stone-800/80">
              <span className="text-[10px] text-stone-500 block">Bonus Dégâts (BD)</span>
              <strong className="text-amber-400 font-mono text-sm">{adventurer.derived.damageBonus}</strong>
            </div>
            <div className="p-2 rounded bg-stone-950 border border-stone-800/80">
              <span className="text-[10px] text-stone-500 block">SR DEX / TAI</span>
              <strong className="text-stone-200 font-mono text-sm">{adventurer.derived.srDex} / {adventurer.derived.srSize}</strong>
            </div>
            <div className="p-2 rounded bg-stone-950 border border-stone-800/80">
              <span className="text-[10px] text-stone-500 block">Taux Guérison</span>
              <strong className="text-stone-200 font-mono text-sm">{adventurer.derived.healingRate} pts/sem.</strong>
            </div>
            <div className="p-2 rounded bg-stone-950 border border-stone-800/80">
              <span className="text-[10px] text-stone-500 block">Dégâts Spirituels</span>
              <strong className="text-purple-400 font-mono text-sm">{adventurer.derived.spiritCombatDamage}</strong>
            </div>
            <div className="p-2 rounded bg-stone-950 border border-stone-800/80">
              <span className="text-[10px] text-stone-500 block">Encombrement Max</span>
              <strong className="text-stone-300 font-mono text-sm">{adventurer.derived.maxEncumbrance || adventurer.characteristics.FOR} ENC</strong>
            </div>
            <div className="p-2 rounded bg-stone-950 border border-stone-800/80">
              <span className="text-[10px] text-stone-500 block">Mouvement</span>
              <strong className="text-stone-300 font-mono text-sm">{adventurer.derived.movementRate || 8} m/round</strong>
            </div>
          </div>
        </div>

        {/* INTERACTIVE SKILL CATEGORY MODIFIERS BAR */}
        <div className="p-3 rounded-xl bg-stone-950/70 border border-amber-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-serif font-bold text-amber-300 flex items-center gap-1.5 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Modificateurs de Catégorie RQG
            </span>
            <button
              onClick={() => setIsCategoryModsOpen(true)}
              className="text-[10px] text-stone-400 hover:text-amber-300 underline cursor-pointer"
            >
              Voir formules
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 text-center text-xs">
            {[
              { cat: 'Agilité', mod: categoryMods.agilite, icon: '🏃' },
              { cat: 'Communication', mod: categoryMods.communication, icon: '💬' },
              { cat: 'Connaissances', mod: categoryMods.connaissances, icon: '📜' },
              { cat: 'Magie', mod: categoryMods.magie, icon: '✨' },
              { cat: 'Manipulation', mod: categoryMods.manipulation, icon: '🖐️' },
              { cat: 'Perception', mod: categoryMods.perception, icon: '👁️' },
              { cat: 'Furtivité', mod: categoryMods.furtivite, icon: '🥷' },
              { cat: 'Armes', mod: categoryMods.armes, icon: '⚔️' },
              { cat: 'Boucliers', mod: categoryMods.boucliers, icon: '🛡️' },
            ].map(({ cat, mod, icon }) => (
              <div
                key={cat}
                onClick={() => setIsCategoryModsOpen(true)}
                className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-500/50 cursor-pointer transition"
                title={`Modificateur de ${cat} : ${formatModifier(mod)}`}
              >
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

      {/* SUB-TABS NAVIGATION */}
      <div className="flex border-b border-stone-800 space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'combat', label: 'Combat & Localisations', icon: Swords },
          { id: 'skills', label: 'Compétences & Runes', icon: Scroll },
          { id: 'magic', label: 'Grimoire & Sorts', icon: BookOpen },
          { id: 'equipment', label: 'Équipement & Trésors', icon: Shield },
          { id: 'notes', label: 'Histoire & Passions', icon: User },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeSubTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id as any)}
              className={`px-4 py-2.5 rounded-lg font-serif text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 shadow'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-stone-500'}`} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: COMBAT & HIT LOCATIONS */}
      {activeSubTab === 'combat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hit Locations Column (7 Body Parts) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-bold text-base text-amber-200 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" /> Localisations Corporelles (D20)
              </h2>
              <button
                onClick={() => setIsEditArmorOpen(true)}
                className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-emerald-400 border border-emerald-700/50 text-xs font-serif flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" /> Modifier Armures (PA)
              </button>
            </div>

            <div className="space-y-2">
              {adventurer.hitLocations.map((loc) => {
                const isInjured = loc.hpCurrent < loc.hpMax;
                const isCritical = loc.hpCurrent <= 0;
                return (
                  <div
                    key={loc.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition ${
                      isCritical
                        ? 'bg-red-950/40 border-red-600/60'
                        : isInjured
                        ? 'bg-amber-950/30 border-amber-600/40'
                        : 'bg-stone-950/70 border-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-stone-900 text-stone-400 border border-stone-800">
                        {loc.rollRange}
                      </span>
                      <div>
                        <div className="text-xs font-serif font-bold text-stone-200">{loc.name}</div>
                        <div className="text-[10px] text-stone-400">Armure : <strong className="text-amber-300">{loc.armorPoints} PA</strong> ({loc.armorType})</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLocationHpChange(loc.id, -1)}
                        className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
                        title="Subir 1 point de blessure"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className={`font-mono font-bold text-sm px-2 ${isCritical ? 'text-red-400' : isInjured ? 'text-amber-300' : 'text-emerald-400'}`}>
                        {loc.hpCurrent} / {loc.hpMax}
                      </span>
                      <button
                        onClick={() => handleLocationHpChange(loc.id, 1)}
                        className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
                        title="Soigner 1 PV"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Equipped Weapons & Attacks Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-bold text-base text-amber-200 flex items-center gap-2">
                <Swords className="h-5 w-5 text-amber-400" /> Armes & Attaques Équipées
              </h2>
              <button
                onClick={() => setIsAddWeaponOpen(true)}
                className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-serif font-bold text-xs flex items-center gap-1 cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" /> Ajouter une Arme
              </button>
            </div>

            <div className="space-y-3">
              {adventurer.weapons.map((w) => {
                const totalSr = adventurer.derived.srDex + adventurer.derived.srSize + w.sr;
                const skill = adventurer.skills.find((s) => s.name === w.skillName) || { totalVal: 50 };
                const damageFormula = w.hasDamageBonus && adventurer.derived.damageBonus !== '0'
                  ? `${w.damage} ${adventurer.derived.damageBonus}`
                  : w.damage;

                return (
                  <div
                    key={w.id}
                    className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 hover:border-amber-600/40 space-y-3 transition shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-sm text-amber-200">{w.name}</h3>
                        <p className="text-[11px] text-stone-400">Compétence : <strong className="text-stone-300">{w.skillName}</strong> ({skill.totalVal}%)</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-stone-900 text-amber-400 border border-stone-800">
                          SR Total : {totalSr}
                        </span>
                        <button
                          onClick={() => handleDeleteWeapon(w.id)}
                          className="p-1 text-stone-500 hover:text-red-400 transition cursor-pointer"
                          title="Déséquiper / Supprimer cette arme"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs p-2 rounded bg-stone-900 border border-stone-800">
                      <div>
                        <span className="text-[10px] text-stone-500 block">Dégâts</span>
                        <strong className="text-amber-300 font-mono">{damageFormula}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 block">Solidité Arme</span>
                        <strong className="text-stone-300 font-mono">{w.hpCurrent} / {w.hpMax} PV</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 block">Type</span>
                        <strong className="text-stone-400">{w.category}</strong>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRollWeaponAttack(w)}
                        className="flex-1 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-stone-950 font-serif font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow transition"
                      >
                        <Swords className="h-3.5 w-3.5" /> Attaquer ({skill.totalVal}%)
                      </button>
                      <button
                        onClick={() => {
                          const roll = rollDice(100);
                          const result = evaluateD100(roll, skill.totalVal, `Parade [${w.name}]`, adventurer.name);
                          onAddRollResult(result);
                        }}
                        className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-serif font-semibold text-xs cursor-pointer"
                      >
                        Parer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SKILLS & RUNES */}
      {activeSubTab === 'skills' && (
        <div className="space-y-6">
          {/* Runes Interactive Roll Bar */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block">
                Runes & Affinités Cosmiques (Cliquez pour lancer un jet)
              </span>
              <button
                onClick={() => setIsAddRuneOpen(true)}
                className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-600/40 text-xs font-serif flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Ajouter / Renforcer Rune
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {adventurer.runes.map((r) => (
                <RuneBadge
                  key={r.rune}
                  rune={r.rune}
                  value={r.value}
                  onClick={() => handleRollRuneOrPassion(r.rune, r.value, 'Rune')}
                />
              ))}
            </div>
          </div>

          {/* Passions */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider block">
                Passions & Inspirations Héroïques
              </span>
              <button
                onClick={() => setIsAddPassionOpen(true)}
                className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-600/40 text-xs font-serif flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Inscrire une Passion
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {adventurer.passions.map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition flex items-center justify-between text-xs group"
                >
                  <div 
                    onClick={() => handleRollRuneOrPassion(`${p.type} (${p.target})`, p.value, 'Passion')}
                    className="cursor-pointer flex-1"
                  >
                    <span className="font-bold text-amber-300 group-hover:text-amber-200">{p.type} :</span>
                    <span className="text-stone-300 ml-1">{p.target}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span 
                      onClick={() => handleRollRuneOrPassion(`${p.type} (${p.target})`, p.value, 'Passion')}
                      className="font-mono font-bold text-amber-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800 cursor-pointer"
                    >
                      {p.value}%
                    </span>
                    <button
                      onClick={() => handleDeletePassion(p.id)}
                      className="p-1 text-stone-500 hover:text-red-400 transition cursor-pointer"
                      title="Supprimer la passion"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Filter & Search & Add Button */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  placeholder="Rechercher une compétence..."
                  className="w-full sm:w-64 bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => setIsAddSkillOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-serif font-bold text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-md"
                >
                  <Plus className="w-4 h-4" /> Ajouter une Compétence
                </button>
              </div>

              <div className="flex gap-1 overflow-x-auto w-full sm:w-auto pb-1">
                {skillCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedSkillCategory(cat)}
                    className={`px-2.5 py-1 rounded text-[11px] font-serif transition cursor-pointer ${
                      selectedSkillCategory === cat
                        ? 'bg-amber-600/30 text-amber-300 border border-amber-500'
                        : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredSkills.map((sk) => {
                const catMod = getCategoryModifierValue(sk.category);
                return (
                  <div
                    key={sk.id}
                    className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-800 hover:border-amber-500/50 transition flex items-center justify-between text-xs group"
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleExp(sk.id)}
                        className="text-stone-500 hover:text-amber-400 cursor-pointer"
                        title="Coche d'expérience"
                      >
                        {sk.experienceCheck ? (
                          <CheckSquare className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                      <div>
                        <div className="font-bold text-stone-200 flex items-center gap-1">
                          {sk.name}
                          {sk.specialty && <span className="text-[10px] text-amber-400/80 font-normal">({sk.specialty})</span>}
                        </div>
                        <div className="text-[10px] text-stone-500 flex items-center gap-1.5">
                          <span>{sk.category}</span>
                          {catMod !== 0 && (
                            <span className={`font-mono text-[9px] px-1 rounded ${
                              catMod > 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                            }`}>
                              Bonus Carac: {formatModifier(catMod)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {editingSkillId === sk.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="1"
                            max="150"
                            value={editingSkillVal}
                            onChange={(e) => setEditingSkillVal(Number(e.target.value))}
                            className="w-12 bg-stone-900 border border-amber-500 rounded px-1 py-0.5 text-xs text-amber-300 font-mono text-center"
                          />
                          <button
                            onClick={() => handleSaveSkillEdit(sk.id)}
                            className="p-1 rounded bg-amber-600 text-stone-950 hover:bg-amber-500 cursor-pointer"
                            title="Valider"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setEditingSkillId(null)}
                            className="p-1 rounded bg-stone-800 text-stone-400 hover:text-white cursor-pointer"
                            title="Annuler"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingSkillId(sk.id);
                              setEditingSkillVal(sk.totalVal);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-stone-500 hover:text-amber-400 transition cursor-pointer"
                            title="Modifier le score %"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleRollSkill(sk)}
                            className="px-3 py-1 rounded bg-stone-900 hover:bg-amber-700 hover:text-stone-950 text-amber-300 border border-stone-700 hover:border-amber-500 font-mono font-bold text-xs transition cursor-pointer"
                            title="Cliquer pour faire le jet D100"
                          >
                            {sk.totalVal}%
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(sk.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-stone-500 hover:text-red-400 transition cursor-pointer"
                            title="Supprimer la compétence"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MAGIC & SPELLS */}
      {activeSubTab === 'magic' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-base text-amber-200 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" /> Grimoire Magique de l'Aventurier ({adventurer.spells.length} sorts)
            </h2>
            <button
              onClick={() => setIsAddSpellOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-serif font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" /> Inscrire un Sort
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Spirit Magic */}
            <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <h3 className="font-serif font-bold text-sm text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-cyan-400" /> Magie des Esprits (Spirit Magic)
                </h3>
                <span className="text-xs text-stone-400">PM Actuels : <strong className="text-cyan-300">{adventurer.currentMagicPoints}</strong></span>
              </div>

              <div className="space-y-2">
                {adventurer.spells.filter((s) => s.type === 'Esprit').map((sp) => (
                  <div key={sp.id} className="p-3 rounded-lg bg-stone-900 border border-stone-800 space-y-1.5 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-amber-200 text-xs">{sp.name}</span>
                        {sp.englishName && <span className="text-[10px] text-stone-500 font-mono">({sp.englishName})</span>}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-stone-950 border border-stone-800">
                          {sp.cost}
                        </span>
                        <button
                          onClick={() => handleDeleteSpell(sp.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-stone-500 hover:text-red-400 transition cursor-pointer"
                          title="Effacer ce sort"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-relaxed">{sp.description}</p>
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleCastSpell(sp)}
                        className="px-3 py-1 rounded bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 text-xs font-bold border border-cyan-600 flex items-center gap-1 cursor-pointer"
                      >
                        <Zap className="h-3 w-3" /> Lancer le Sort
                      </button>
                    </div>
                  </div>
                ))}
                {adventurer.spells.filter((s) => s.type === 'Esprit').length === 0 && (
                  <p className="text-xs text-stone-500 italic text-center py-4">
                    Aucun sort de Magie des Esprits appris pour l'instant.
                  </p>
                )}
              </div>
            </div>

            {/* Rune Magic & Sorcery */}
            <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <h3 className="font-serif font-bold text-sm text-amber-300 flex items-center gap-1.5">
                  <Crown className="h-4 w-4 text-amber-400" /> Magie Runique & Sorcellerie
                </h3>
                <span className="text-xs text-stone-400">Points de Rune : <strong className="text-amber-300">{adventurer.cults[0]?.runePointsCurrent ?? 3}</strong></span>
              </div>

              <div className="space-y-2">
                {adventurer.spells.filter((s) => s.type === 'Runique' || s.type === 'Sorcellerie').map((sp) => (
                  <div key={sp.id} className="p-3 rounded-lg bg-stone-900 border border-stone-800 space-y-1.5 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-amber-200 text-xs">{sp.name}</span>
                        {sp.rune && <RuneBadge rune={sp.rune} size="sm" />}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-amber-400 px-1.5 py-0.5 rounded bg-stone-950 border border-stone-800">
                          {sp.cost}
                        </span>
                        <button
                          onClick={() => handleDeleteSpell(sp.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-stone-500 hover:text-red-400 transition cursor-pointer"
                          title="Effacer ce sort"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-relaxed">{sp.description}</p>
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleCastSpell(sp)}
                        className="px-3 py-1 rounded bg-amber-800 hover:bg-amber-700 text-stone-950 text-xs font-bold border border-amber-500 flex items-center gap-1 cursor-pointer"
                      >
                        <Crown className="h-3 w-3" /> Invoquer la Rune
                      </button>
                    </div>
                  </div>
                ))}
                {adventurer.spells.filter((s) => s.type === 'Runique' || s.type === 'Sorcellerie').length === 0 && (
                  <p className="text-xs text-stone-500 italic text-center py-4">
                    Aucun sort de Magie Runique ou Sorcellerie inscrit pour l'instant.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: EQUIPMENT & TREASURES */}
      {activeSubTab === 'equipment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Currency */}
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-xs text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400" /> Bourse & Monnaies
                </h3>
                <button
                  onClick={() => setIsEditCurrencyOpen(true)}
                  className="p-1 rounded bg-stone-900 hover:bg-stone-800 text-amber-400 border border-stone-700 text-xs cursor-pointer"
                  title="Modifier la bourse"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-stone-900 border border-stone-800">
                  <span className="text-amber-300">Wheels (Roues d'Or)</span>
                  <strong className="font-mono text-amber-200">{adventurer.currency.wheels}</strong>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-stone-900 border border-stone-800">
                  <span className="text-stone-300">Lunars (Pièces d'Argent)</span>
                  <strong className="font-mono text-stone-100">{adventurer.currency.lunars}</strong>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-stone-900 border border-stone-800">
                  <span className="text-orange-400">Clacks (Cuivres)</span>
                  <strong className="font-mono text-orange-300">{adventurer.currency.clacks}</strong>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="md:col-span-2 p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-xs text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-amber-400" /> Équipement & Possessions ({adventurer.equipment.length})
                </h3>
                <button
                  onClick={() => setIsAddEquipmentOpen(true)}
                  className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-serif font-bold text-xs flex items-center gap-1 cursor-pointer shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" /> Ajouter un Objet
                </button>
              </div>

              <ul className="space-y-1.5 text-xs text-stone-300 max-h-96 overflow-y-auto pr-1">
                {adventurer.equipment.map((eq, idx) => (
                  <li key={idx} className="p-2 rounded bg-stone-900 border border-stone-800 flex items-center justify-between group">
                    <span>• {eq}</span>
                    <button
                      onClick={() => handleDeleteEquipment(idx)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-stone-500 hover:text-red-400 transition cursor-pointer"
                      title="Supprimer cet objet"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: NOTES & LORE */}
      {activeSubTab === 'notes' && (
        <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
          <h3 className="font-serif font-bold text-sm text-amber-300 flex items-center gap-2">
            <User className="h-4 w-4 text-amber-400" /> Histoire & Contexte de l'Aventurier
          </h3>
          <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300 leading-relaxed">
            {adventurer.notes || 'Aucune note particulière inscrite.'}
          </div>

          {adventurer.familyHistory && adventurer.familyHistory.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="font-serif font-bold text-xs text-amber-200">Chronologie Familiale & Événements Majeurs :</h4>
              <div className="space-y-1.5">
                {adventurer.familyHistory.map((fh, idx) => (
                  <div key={idx} className="p-2 rounded bg-stone-900/80 border border-stone-800 text-xs text-stone-300">
                    📜 {fh}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODALS */}
      <AddSkillModal
        isOpen={isAddSkillOpen}
        onClose={() => setIsAddSkillOpen(false)}
        onAddSkill={handleAddSkill}
        existingSkillNames={adventurer.skills.map((s) => s.name)}
      />
      <AddSpellModal
        isOpen={isAddSpellOpen}
        onClose={() => setIsAddSpellOpen(false)}
        onAddSpell={handleAddSpell}
        existingSpellIds={adventurer.spells.map((s) => s.id)}
      />
      <AddWeaponModal
        isOpen={isAddWeaponOpen}
        onClose={() => setIsAddWeaponOpen(false)}
        onAddWeapon={handleAddWeapon}
        existingSkillNames={adventurer.skills.map((s) => s.name)}
      />
      <AddEquipmentModal
        isOpen={isAddEquipmentOpen}
        onClose={() => setIsAddEquipmentOpen(false)}
        onAddEquipment={handleAddEquipment}
        existingEquipment={adventurer.equipment}
      />
      <AddPassionModal
        isOpen={isAddPassionOpen}
        onClose={() => setIsAddPassionOpen(false)}
        onAddPassion={handleAddPassion}
      />
      <AddRuneModal
        isOpen={isAddRuneOpen}
        onClose={() => setIsAddRuneOpen(false)}
        onAddRune={handleAddRune}
        existingRunes={adventurer.runes.map((r) => r.rune)}
      />
      <EditArmorModal
        isOpen={isEditArmorOpen}
        onClose={() => setIsEditArmorOpen(false)}
        hitLocations={adventurer.hitLocations}
        onSaveArmor={handleSaveArmor}
      />
      <EditCurrencyModal
        isOpen={isEditCurrencyOpen}
        onClose={() => setIsEditCurrencyOpen(false)}
        currency={adventurer.currency}
        onSaveCurrency={handleSaveCurrency}
      />
      <CategoryModifiersModal
        isOpen={isCategoryModsOpen}
        onClose={() => setIsCategoryModsOpen(false)}
        characteristics={adventurer.characteristics}
      />
      <CharacteristicTestModal
        isOpen={isCharTestOpen}
        onClose={() => setIsCharTestOpen(false)}
        characteristics={adventurer.characteristics}
        characterName={adventurer.name}
        initialStat={selectedCharTest}
        onAddRollResult={onAddRollResult}
      />
    </div>
  );
};

