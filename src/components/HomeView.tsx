import React from 'react';
import { 
  Shield, 
  Scroll, 
  BookOpen, 
  Swords, 
  Calendar, 
  Crown, 
  Users, 
  Dices, 
  Sparkles, 
  ArrowRight, 
  Flame, 
  CheckCircle,
  Compass,
  Play,
  Layers,
  Palette,
  Check,
  FolderArchive,
  Save,
  RotateCcw
} from 'lucide-react';
import { RuneBadge } from './RuneBadge';
import { PREMADE_ADVENTURERS } from '../data/premadeCharacters';
import { Adventurer } from '../types/runequest';
import { THEMES } from '../types/theme';
import { useTheme } from '../context/ThemeContext';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  onLoadCharacter: (adventurer: Adventurer) => void;
  onOpenDiceRoller: () => void;
  onOpenThemeModal?: () => void;
  onOpenBackupModal?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onLoadCharacter,
  onOpenDiceRoller,
  onOpenThemeModal,
  onOpenBackupModal,
}) => {
  const { currentThemeId, setTheme, setIsThemeModalOpen } = useTheme();

  const allRunes = [
    'Air', 'Terre', 'Feu', 'Eau', 'Ténèbres', 'Lune',
    'Mort', 'Fertilité', 'Harmonie', 'Désaccord', 'Vérité',
    'Illusion', 'Stase', 'Mouvement', 'Homme', 'Bête', 'Esprit', 'Maîtrise'
  ];

  return (
    <div className="space-y-12 pb-16 text-stone-100 font-sans">
      {/* HERO BANNER SECTION */}
      <section className="relative overflow-hidden rounded-2xl border border-amber-800/50 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 p-6 sm:p-12 shadow-2xl shadow-black/80">
        {/* Background decorative glowing circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Animated Rune Ribbon */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-2">
            {allRunes.map((rune) => (
              <RuneBadge key={rune} rune={rune} size="sm" showLabel={false} />
            ))}
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-serif tracking-widest uppercase">
            <span>⚔️ L'ÂGE DU BRONZE MYTHIQUE DE GLORANTHA ⚔️</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 drop-shadow-md">
            RUNEQUESTING <span className="text-amber-400 font-sans text-2xl sm:text-4xl">FR</span>
          </h1>

          <p className="text-base sm:text-xl text-stone-300 font-serif max-w-2xl mx-auto leading-relaxed">
            La suite d'outils numériques tout-en-un en français pour jouer et mener à <strong className="text-amber-200">RuneQuest : Aventures dans Glorantha</strong>.
          </p>

          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl mx-auto">
            Création d'aventuriers guidée pas-à-pas, fiches interactives avec lancers de dés 1-clic, gestionnaire de combat par rangs d'action (Strike Rank), grimoire complet des sorts et panthéon des cultes.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onNavigate('builder')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-serif font-bold text-sm sm:text-base shadow-xl shadow-amber-900/50 flex items-center gap-2 cursor-pointer transition transform hover:-translate-y-0.5"
            >
              <Shield className="h-5 w-5 text-stone-950" />
              Créer un Aventurier
            </button>
            <button
              onClick={() => onNavigate('characters')}
              className="px-5 py-3 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-300 border border-amber-600/40 font-serif font-semibold text-sm sm:text-base flex items-center gap-2 cursor-pointer transition"
            >
              <Scroll className="h-5 w-5 text-amber-400" />
              Fiches Pré-tirées & Feuilles
            </button>
            <button
              onClick={onOpenDiceRoller}
              className="px-4 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 font-serif text-sm flex items-center gap-2 cursor-pointer transition"
            >
              <Dices className="h-5 w-5 text-amber-400" />
              Lanceur de Dés
            </button>
            <button
              onClick={() => (onOpenThemeModal ? onOpenThemeModal() : setIsThemeModalOpen(true))}
              className="px-4 py-3 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-500/50 font-serif text-sm flex items-center gap-2 cursor-pointer transition"
            >
              <Palette className="h-5 w-5 text-amber-400" />
              Thèmes Visuels
            </button>
            {onOpenBackupModal && (
              <button
                onClick={onOpenBackupModal}
                className="px-4 py-3 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-300 border border-amber-600/50 font-serif text-sm flex items-center gap-2 cursor-pointer transition"
              >
                <FolderArchive className="h-5 w-5 text-amber-400" />
                Sauvegardes & Restauration
              </button>
            )}
          </div>
        </div>
      </section>

      {/* THEME SELECTOR SHOWCASE SECTION */}
      <section className="rounded-2xl border border-amber-800/40 bg-stone-900/60 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-200">
                Thèmes & Ambiances Mythologiques
              </h2>
              <p className="text-xs text-stone-400">
                Changez l'atmosphère visuelle, les nuances de couleurs et la typographie de votre interface en un clic.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsThemeModalOpen(true)}
            className="text-xs font-serif font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
          >
            Personnaliser les thèmes <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {THEMES.map((th) => {
            const isSelected = currentThemeId === th.id;
            return (
              <button
                key={th.id}
                onClick={() => setTheme(th.id)}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between gap-3 cursor-pointer group ${
                  isSelected
                    ? 'border-amber-400 bg-amber-950/40 shadow-lg shadow-amber-900/30 scale-[1.02]'
                    : 'border-stone-800 bg-stone-950/70 hover:border-amber-500/50 hover:bg-stone-850'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl">{th.runeSymbol}</span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-serif font-bold text-stone-200 group-hover:text-amber-300 transition line-clamp-1">
                    {th.name}
                  </h4>
                  <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">{th.tag}</p>
                </div>
                <div className="flex gap-1 pt-1 border-t border-stone-800/80">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: th.previewColors.bg }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: th.previewColors.card }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: th.previewColors.accent }} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-200">
            Fonctionnalités Principales de la Boîte à Outils
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto">
            Tous les modules indispensables pour les Meneurs de Jeu et Joueurs de RuneQuest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div 
            onClick={() => onNavigate('builder')}
            className="group p-6 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-amber-600/60 transition cursor-pointer space-y-3 relative overflow-hidden shadow-lg hover:shadow-amber-950/40"
          >
            <div className="w-12 h-12 rounded-lg bg-amber-900/30 border border-amber-600/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-amber-200 group-hover:text-amber-300">
              Créateur d'Aventurier Guidé
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Assistant complet en 8 étapes : choix de la patrie (Sartar, Esrolia, Prax...), histoire familiale (1582–1625), tirage de caractéristiques, runes d'affinités, passions et profession.
            </p>
            <div className="flex items-center text-xs font-serif font-semibold text-amber-400 pt-2 gap-1 group-hover:translate-x-1 transition">
              Lancer la création <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => onNavigate('characters')}
            className="group p-6 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-amber-600/60 transition cursor-pointer space-y-3 relative overflow-hidden shadow-lg hover:shadow-amber-950/40"
          >
            <div className="w-12 h-12 rounded-lg bg-amber-900/30 border border-amber-600/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
              <Scroll className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-amber-200 group-hover:text-amber-300">
              Feuille de Personnage Interactive
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Fiche jouable en direct : lancez vos compétences d'un simple clic avec calcul automatique des réussites critiques, spéciales, échecs et maladresses. Gestion des PV par membre et des PM.
            </p>
            <div className="flex items-center text-xs font-serif font-semibold text-amber-400 pt-2 gap-1 group-hover:translate-x-1 transition">
              Consulter les fiches <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => onNavigate('grimoire')}
            className="group p-6 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-amber-600/60 transition cursor-pointer space-y-3 relative overflow-hidden shadow-lg hover:shadow-amber-950/40"
          >
            <div className="w-12 h-12 rounded-lg bg-amber-900/30 border border-amber-600/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-amber-200 group-hover:text-amber-300">
              Grimoire de Magie Gloranthienne
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Encyclopédie complète des sorts : Magie Spirituelle, Magie Runique accordée par les dieux, et Sorcellerie. Filtrez instantanément par culte, rune ou coût en PM/Points de Rune.
            </p>
            <div className="flex items-center text-xs font-serif font-semibold text-amber-400 pt-2 gap-1 group-hover:translate-x-1 transition">
              Explorer le grimoire <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 4 */}
          <div 
            onClick={() => onNavigate('combat')}
            className="group p-6 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-amber-600/60 transition cursor-pointer space-y-3 relative overflow-hidden shadow-lg hover:shadow-amber-950/40"
          >
            <div className="w-12 h-12 rounded-lg bg-amber-900/30 border border-amber-600/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
              <Swords className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-amber-200 group-hover:text-amber-300">
              Combat & Rangs d'Action (SR)
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Gérez les rounds de combat au tour par tour (Strike Ranks 1 à 12). Calculateur anatomique de localisation des dégâts (D20), application des points d'armure et blessures invalidantes.
            </p>
            <div className="flex items-center text-xs font-serif font-semibold text-amber-400 pt-2 gap-1 group-hover:translate-x-1 transition">
              Ouvrir l'arène <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 5 */}
          <div 
            onClick={() => onNavigate('cults')}
            className="group p-6 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-amber-600/60 transition cursor-pointer space-y-3 relative overflow-hidden shadow-lg hover:shadow-amber-950/40"
          >
            <div className="w-12 h-12 rounded-lg bg-amber-900/30 border border-amber-600/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
              <Crown className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-amber-200 group-hover:text-amber-300">
              Panthéon des Cultes & Runes
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Consultez les détails sacrés des divinités de Glorantha : Orlanth, Ernalda, Humakt, Issaries, Chalana Arroy, Lhankor Mhy, Taureau Tempête, Sept Mères et bien d'autres.
            </p>
            <div className="flex items-center text-xs font-serif font-semibold text-amber-400 pt-2 gap-1 group-hover:translate-x-1 transition">
              Découvrir les cultes <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 6 */}
          <div 
            onClick={() => onNavigate('calendar')}
            className="group p-6 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-amber-600/60 transition cursor-pointer space-y-3 relative overflow-hidden shadow-lg hover:shadow-amber-950/40"
          >
            <div className="w-12 h-12 rounded-lg bg-amber-900/30 border border-amber-600/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-amber-200 group-hover:text-amber-300">
              Calendrier & Météo Gloranthienne
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Suivez les 5 Saisons et la Saison Sacrée, les jours des dieux, les phases de la Lune Rouge et générez instantanément des conditions climatiques et présages pour vos séances.
            </p>
            <div className="flex items-center text-xs font-serif font-semibold text-amber-400 pt-2 gap-1 group-hover:translate-x-1 transition">
              Consulter l'éphéméride <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 7: Backup & Restore */}
          <div 
            onClick={() => onOpenBackupModal && onOpenBackupModal()}
            className="group p-6 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-amber-600/60 transition cursor-pointer space-y-3 relative overflow-hidden shadow-lg hover:shadow-amber-950/40"
          >
            <div className="w-12 h-12 rounded-lg bg-amber-900/30 border border-amber-600/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
              <FolderArchive className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-amber-200 group-hover:text-amber-300">
              Sauvegardes & Restauration
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Exportez vos PJ et campagnes au format JSON universel, restaurez vos parties ou créez des points d'instantanés locaux avant vos séances décisives.
            </p>
            <div className="flex items-center text-xs font-serif font-semibold text-amber-400 pt-2 gap-1 group-hover:translate-x-1 transition">
              Gérer les sauvegardes <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* PRE-GENERATED HEROES SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-800 pb-3">
          <div>
            <h2 className="text-2xl font-serif font-bold text-amber-200 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" /> Aventuriers Pré-tirés Prêts à Jouer
            </h2>
            <p className="text-xs text-stone-400">
              Sélectionnez un héros légendaire de la Passe du Dragon pour tester immédiatement la fiche interactive.
            </p>
          </div>
          <button
            onClick={() => onNavigate('characters')}
            className="text-xs font-serif font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 self-start cursor-pointer"
          >
            Voir tous les héros <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PREMADE_ADVENTURERS.map((hero) => (
            <div
              key={hero.id}
              className="p-5 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-amber-600/50 space-y-4 flex flex-col justify-between transition shadow-md"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-base text-amber-200">{hero.name}</h3>
                    <p className="text-xs text-stone-400">{hero.occupation}</p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-stone-800 text-amber-300 border border-stone-700">
                    {hero.homeland.split('(')[0]}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {hero.runes.slice(0, 3).map((r) => (
                    <RuneBadge key={r.rune} rune={r.rune} value={r.value} size="sm" />
                  ))}
                </div>

                <p className="text-xs text-stone-400 line-clamp-2 italic">
                  "{hero.notes}"
                </p>

                {/* Mini Stat Summary */}
                <div className="grid grid-cols-4 gap-1 p-2 rounded bg-stone-950 border border-stone-800 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-stone-500 block">PV</span>
                    <strong className="text-emerald-400 font-mono">{hero.derived.hpMax}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">PM</span>
                    <strong className="text-cyan-400 font-mono">{hero.derived.magicPointsMax}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">FOR/DEX</span>
                    <strong className="text-stone-300 font-mono">{hero.characteristics.FOR}/{hero.characteristics.DEX}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Dégâts</span>
                    <strong className="text-amber-400 font-mono">{hero.derived.damageBonus}</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onLoadCharacter(hero);
                  onNavigate('characters');
                }}
                className="w-full py-2 px-3 rounded-lg bg-stone-800 hover:bg-amber-700 hover:text-stone-950 text-amber-300 border border-stone-700 hover:border-amber-500 text-xs font-serif font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="h-3.5 w-3.5" /> Charger & Jouer
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* GLORANTHA LORE & QUOTE SECTION */}
      <section className="p-8 rounded-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border border-amber-900/40 text-center space-y-4">
        <blockquote className="font-serif italic text-base sm:text-lg text-amber-200/90 max-w-3xl mx-auto">
          « Dans Glorantha, le monde est vivant, magique et mythique. Tout le monde pratique la magie, et les dieux marchent aux côtés des mortels à travers les Runes éternelles. »
        </blockquote>
        <div className="text-xs font-sans text-stone-400 uppercase tracking-widest">
          — Hommage à Greg Stafford & l'univers de Chaosium
        </div>
      </section>
    </div>
  );
};
