import React, { useState } from 'react';
import { 
  Dices, 
  Shield, 
  BookOpen, 
  Scroll, 
  Calendar, 
  Users, 
  Swords, 
  Compass, 
  Menu, 
  X, 
  Flame, 
  Crown,
  HelpCircle,
  Palette,
  FolderArchive,
  Save
} from 'lucide-react';
import { RuneBadge } from './RuneBadge';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenDiceRoller: () => void;
  onOpenBackupModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenDiceRoller,
  onOpenBackupModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentTheme, setIsThemeModalOpen } = useTheme();

  const navItems = [
    { id: 'home', label: 'Accueil', icon: Compass },
    { id: 'builder', label: 'Créateur de PJ', icon: Shield },
    { id: 'characters', label: 'Fiches de PJ', icon: Scroll },
    { id: 'grimoire', label: 'Grimoire de Magie', icon: BookOpen },
    { id: 'cults', label: 'Cultes & Runes', icon: Crown },
    { id: 'combat', label: 'Combat & SR', icon: Swords },
    { id: 'calendar', label: 'Calendrier & Météo', icon: Calendar },
    { id: 'npcs', label: 'Bestiaire & PNJ', icon: Users },
    { id: 'rules', label: 'Règles & Aide', icon: HelpCircle },
  ];

  const handleTabClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-800/40 bg-stone-950/95 backdrop-blur-md text-stone-100 shadow-xl shadow-black/60">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 px-4 py-1 text-center text-xs font-serif text-amber-300/80 border-b border-amber-900/30 flex items-center justify-center gap-3">
        <span className="hidden sm:inline">⚡ RUNEQUEST : AVENTURES DANS GLORANTHA ⚡</span>
        <span className="inline-flex items-center gap-1.5 font-sans font-medium text-amber-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Version Française Intégrale
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-amber-700 to-amber-950 border border-amber-500/60 shadow-lg shadow-amber-900/30 group-hover:scale-105 transition">
              <span className="text-xl">🌪️</span>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-[10px] text-stone-950 font-black">
                RQ
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 drop-shadow">
                  RUNEQUESTING
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/40">
                  FR
                </span>
              </div>
              <p className="text-[10px] font-sans text-stone-400 tracking-tight">
                Boîte à Outils Gloranthienne
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-serif font-semibold tracking-wide transition flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-amber-600/25 text-amber-300 border border-amber-500/50 shadow-inner'
                      : 'text-stone-300 hover:text-amber-200 hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons: Backup & Restore, Theme Selector, Quick Dice Roller & Mobile Menu Button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Backup & Restore Button */}
            {onOpenBackupModal && (
              <button
                onClick={onOpenBackupModal}
                className="px-2.5 sm:px-3 py-2 rounded-lg bg-stone-900/90 hover:bg-stone-800 border border-amber-600/40 text-amber-300 font-serif text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition hover:border-amber-400"
                title="Sauvegardes & Restauration du site (Export/Import JSON, Instantanés)"
              >
                <FolderArchive className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline font-sans text-[11px] font-medium text-amber-200/90">
                  Sauvegardes
                </span>
              </button>
            )}

            {/* Theme Selector Button */}
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="px-2.5 sm:px-3 py-2 rounded-lg bg-stone-900/90 hover:bg-stone-800 border border-amber-500/40 text-stone-200 font-serif text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition hover:border-amber-400"
              title="Changer le style visuel et le thème (Parchemin, Sombre, etc.)"
            >
              <Palette className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-sm">{currentTheme.runeSymbol}</span>
              <span className="hidden md:inline font-sans text-[11px] text-amber-200/90">
                {currentTheme.name}
              </span>
            </button>

            {/* Quick Dice Roller Button */}
            <button
              onClick={onOpenDiceRoller}
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold font-serif text-xs shadow-md shadow-amber-950/40 border border-amber-400/50 flex items-center gap-2 cursor-pointer transition transform active:scale-95"
              title="Ouvrir le lanceur de dés rapide"
            >
              <Dices className="h-4 w-4 text-stone-950" />
              <span className="hidden sm:inline font-sans font-bold">Lancer de Dés</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-800 bg-stone-950/98 px-4 pt-3 pb-5 space-y-2">
          {/* Mobile Backup & Restore trigger */}
          {onOpenBackupModal && (
            <button
              onClick={() => {
                onOpenBackupModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-stone-900 border border-amber-600/40 text-amber-300 text-xs font-serif mb-1"
            >
              <span className="flex items-center gap-2">
                <FolderArchive className="h-4 w-4 text-amber-400" />
                Sauvegardes & Restauration
              </span>
              <span className="text-[10px] text-stone-400 font-mono">JSON & Snapshots</span>
            </button>
          )}

          {/* Mobile Theme quick switch trigger */}
          <button
            onClick={() => {
              setIsThemeModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-stone-900 border border-amber-500/40 text-amber-300 text-xs font-serif mb-2"
          >
            <span className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-amber-400" />
              Thème : {currentTheme.name}
            </span>
            <span className="text-base">{currentTheme.runeSymbol}</span>
          </button>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-serif text-left ${
                  isActive
                    ? 'bg-amber-600/30 text-amber-300 font-bold border border-amber-500/40'
                    : 'text-stone-300 hover:bg-stone-900 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
