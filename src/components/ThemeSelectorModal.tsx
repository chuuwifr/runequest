import React from 'react';
import { THEMES, ThemeId } from '../types/theme';
import { useTheme } from '../context/ThemeContext';
import { Palette, Check, X, Sparkles, BookOpen, Wind, Flame, TreePine, Moon } from 'lucide-react';

export const ThemeSelectorModal: React.FC = () => {
  const { currentThemeId, setTheme, isThemeModalOpen, setIsThemeModalOpen } = useTheme();

  if (!isThemeModalOpen) return null;

  const getThemeIcon = (id: ThemeId) => {
    switch (id) {
      case 'dark-mystic':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'parchment':
        return <BookOpen className="w-5 h-5 text-amber-800" />;
      case 'orlanthi-storm':
        return <Wind className="w-5 h-5 text-sky-400" />;
      case 'lunar-crimson':
        return <Flame className="w-5 h-5 text-rose-500" />;
      case 'ernalda-earth':
        return <TreePine className="w-5 h-5 text-emerald-400" />;
      case 'troll-darkness':
        return <Moon className="w-5 h-5 text-orange-500" />;
      default:
        return <Palette className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-stone-900 border-2 border-amber-600/60 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-amber-900/50 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-black text-amber-200 tracking-wide flex items-center gap-2">
                Sélecteur d'Ambiance & Thèmes Gloranthiens
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Personnalisez la palette visuelle, les textures, les bordures et la typographie de l'application.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
            title="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Theme Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {THEMES.map((theme) => {
            const isSelected = currentThemeId === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`relative rounded-xl p-5 cursor-pointer transition-all duration-200 border-2 text-left flex flex-col justify-between group ${
                  isSelected
                    ? 'border-amber-400 bg-amber-950/30 shadow-xl shadow-amber-900/20 scale-[1.01]'
                    : 'border-stone-700/80 bg-stone-950/60 hover:border-amber-500/60 hover:bg-stone-800/40'
                }`}
                style={{
                  boxShadow: isSelected ? `0 0 20px ${theme.previewColors.accent}33` : undefined,
                }}
              >
                {/* Top Badge & Rune */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{theme.runeSymbol}</span>
                    <div className="p-1.5 rounded-lg bg-stone-800/80 border border-stone-700">
                      {getThemeIcon(theme.id)}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-100 group-hover:text-amber-300 transition">
                        {theme.name}
                      </h3>
                      <p className="text-[11px] text-stone-400">{theme.subtitle}</p>
                    </div>
                  </div>

                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      Actif
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-400 border border-stone-700">
                      {theme.tag}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-stone-300 leading-relaxed mb-4">
                  {theme.description}
                </p>

                {/* Live Font & Colors Preview Bar */}
                <div className="mt-auto pt-3 border-t border-stone-800/80 flex items-center justify-between">
                  {/* Color Swatches */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-stone-400 mr-1 font-mono">Palette :</span>
                    <div
                      className="w-4 h-4 rounded-full border border-stone-600 shadow-inner"
                      style={{ backgroundColor: theme.previewColors.bg }}
                      title="Couleur d'arrière-plan"
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-stone-600 shadow-inner"
                      style={{ backgroundColor: theme.previewColors.card }}
                      title="Couleur de panneau/carte"
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-stone-600 shadow-inner"
                      style={{ backgroundColor: theme.previewColors.accent }}
                      title="Couleur d'accentuation"
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-stone-600 shadow-inner"
                      style={{ backgroundColor: theme.previewColors.border }}
                      title="Couleur de bordure"
                    />
                  </div>

                  {/* Typography Tag */}
                  <span 
                    className="text-[11px] font-semibold px-2 py-0.5 rounded bg-stone-900 border border-stone-700 text-stone-300 truncate max-w-[150px]"
                    style={{ fontFamily: theme.headingFont }}
                  >
                    Aa • Runes 1625
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
          <p className="text-xs text-stone-400">
            Votre préférence est sauvegardée automatiquement sur cet appareil.
          </p>
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold font-serif text-xs shadow-lg transition cursor-pointer"
          >
            Fermer & Continuer
          </button>
        </div>
      </div>
    </div>
  );
};
