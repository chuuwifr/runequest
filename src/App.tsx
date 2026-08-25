import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { CharacterBuilder } from './components/CharacterBuilder';
import { CharacterSheetView } from './components/CharacterSheetView';
import { GrimoireView } from './components/GrimoireView';
import { CultsView } from './components/CultsView';
import { CombatTrackerView } from './components/CombatTrackerView';
import { CalendarView } from './components/CalendarView';
import { NpcGeneratorView } from './components/NpcGeneratorView';
import { RulesRefView } from './components/RulesRefView';
import { DiceRollerModal } from './components/DiceRollerModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { BackupRestoreModal } from './components/BackupRestoreModal';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { PREMADE_ADVENTURERS } from './data/premadeCharacters';
import { Adventurer, RollResult } from './types/runequest';
import { SiteBackupData } from './types/backup';
import { ThemeId } from './types/theme';
import { Dices, Sparkles, X, Heart, Shield, Zap, Palette, FolderArchive } from 'lucide-react';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isDiceModalOpen, setIsDiceModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [rollHistory, setRollHistory] = useState<RollResult[]>([]);
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);
  const { setIsThemeModalOpen, currentTheme, setTheme } = useTheme();

  // Adventurers State
  const [adventurers, setAdventurers] = useState<Adventurer[]>(() => {
    const saved = localStorage.getItem('rqg_adventurers_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved adventurers', e);
      }
    }
    return PREMADE_ADVENTURERS;
  });

  const [activeAdventurer, setActiveAdventurer] = useState<Adventurer>(() => {
    return adventurers[0] || PREMADE_ADVENTURERS[0];
  });

  // Save to LocalStorage whenever adventurers list changes
  useEffect(() => {
    localStorage.setItem('rqg_adventurers_v1', JSON.stringify(adventurers));
  }, [adventurers]);

  const handleAddRollResult = (res: RollResult) => {
    setRollHistory((prev) => [res, ...prev]);
    setLastRoll(res);
  };

  const handleSaveNewAdventurer = (newAdv: Adventurer) => {
    setAdventurers((prev) => [newAdv, ...prev]);
    setActiveAdventurer(newAdv);
    setCurrentTab('characters');
  };

  const handleUpdateActiveAdventurer = (updated: Adventurer) => {
    setActiveAdventurer(updated);
    setAdventurers((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const handleDeleteAdventurer = (id: string) => {
    const filtered = adventurers.filter((a) => a.id !== id);
    if (filtered.length === 0) {
      setAdventurers(PREMADE_ADVENTURERS);
      setActiveAdventurer(PREMADE_ADVENTURERS[0]);
    } else {
      setAdventurers(filtered);
      if (activeAdventurer.id === id) {
        setActiveAdventurer(filtered[0]);
      }
    }
  };

  // Full Restore Handler
  const handleRestoreAll = (data: SiteBackupData) => {
    const restoredAdvs = data.payload.adventurers;
    if (restoredAdvs && restoredAdvs.length > 0) {
      setAdventurers(restoredAdvs);
      const targetActive = restoredAdvs.find((a) => a.id === data.payload.activeAdventurerId) || restoredAdvs[0];
      setActiveAdventurer(targetActive);
    }
    if (data.payload.combatState) {
      localStorage.setItem('rqg_combat_state_v1', JSON.stringify(data.payload.combatState));
    }
    if (data.payload.calendarState) {
      localStorage.setItem('rqg_calendar_state_v1', JSON.stringify(data.payload.calendarState));
    }
    if (data.payload.npcsState) {
      localStorage.setItem('rqg_npcs_state_v1', JSON.stringify(data.payload.npcsState));
    }
    if (data.payload.rollHistory) {
      setRollHistory(data.payload.rollHistory);
    }
    if (data.payload.themeId) {
      setTheme(data.payload.themeId as ThemeId);
    }
  };

  // Merge Adventurers Handler
  const handleMergeAdventurers = (newAdvs: Adventurer[]) => {
    setAdventurers((prev) => {
      const existingIds = new Set(prev.map((a) => a.id));
      const processed: Adventurer[] = newAdvs.map((adv) => {
        if (existingIds.has(adv.id)) {
          return {
            ...adv,
            id: `adv_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name: `${adv.name} (Importé)`,
          };
        }
        return adv;
      });
      return [...processed, ...prev];
    });
    if (newAdvs[0]) {
      setActiveAdventurer(newAdvs[0]);
    }
  };

  // Reset to Factory Defaults Handler
  const handleResetToDefaults = () => {
    setAdventurers(PREMADE_ADVENTURERS);
    setActiveAdventurer(PREMADE_ADVENTURERS[0]);
    localStorage.removeItem('rqg_combat_state_v1');
    localStorage.removeItem('rqg_calendar_state_v1');
    localStorage.removeItem('rqg_npcs_state_v1');
    setRollHistory([]);
    setLastRoll(null);
  };

  return (
    <div className="min-h-screen text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950 transition-colors duration-300">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenDiceRoller={() => setIsDiceModalOpen(true)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {currentTab === 'home' && (
          <HomeView
            onNavigate={(tab) => setCurrentTab(tab)}
            onLoadCharacter={(adv) => {
              setActiveAdventurer(adv);
              setCurrentTab('characters');
            }}
            onOpenDiceRoller={() => setIsDiceModalOpen(true)}
            onOpenThemeModal={() => setIsThemeModalOpen(true)}
            onOpenBackupModal={() => setIsBackupModalOpen(true)}
          />
        )}

        {currentTab === 'builder' && (
          <CharacterBuilder
            onSaveCharacter={handleSaveNewAdventurer}
            onCancel={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'characters' && (
          <CharacterSheetView
            adventurer={activeAdventurer}
            onUpdateAdventurer={handleUpdateActiveAdventurer}
            allAdventurers={adventurers}
            onSelectAdventurer={(adv) => setActiveAdventurer(adv)}
            onDeleteAdventurer={handleDeleteAdventurer}
            onAddRollResult={handleAddRollResult}
          />
        )}

        {currentTab === 'grimoire' && (
          <GrimoireView
            activeAdventurer={activeAdventurer}
            onAddSpellToActiveAdventurer={(spell) => {
              if (!activeAdventurer.spells.some((s) => s.id === spell.id || s.name === spell.name)) {
                handleUpdateActiveAdventurer({
                  ...activeAdventurer,
                  spells: [...activeAdventurer.spells, spell],
                });
              }
            }}
          />
        )}

        {currentTab === 'cults' && <CultsView />}

        {currentTab === 'combat' && <CombatTrackerView />}

        {currentTab === 'calendar' && <CalendarView />}

        {currentTab === 'npcs' && <NpcGeneratorView />}

        {currentTab === 'rules' && <RulesRefView />}
      </main>

      {/* Floating Dice Roller Modal */}
      <DiceRollerModal
        isOpen={isDiceModalOpen}
        onClose={() => setIsDiceModalOpen(false)}
        rollHistory={rollHistory}
        onAddRoll={handleAddRollResult}
      />

      {/* Theme Selector Modal */}
      <ThemeSelectorModal />

      {/* Backup and Restore Modal */}
      <BackupRestoreModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        adventurers={adventurers}
        activeAdventurer={activeAdventurer}
        onRestoreAll={handleRestoreAll}
        onMergeAdventurers={handleMergeAdventurers}
        onResetToDefaults={handleResetToDefaults}
        rollHistory={rollHistory}
      />

      {/* Quick Roll Result Toast Bar */}
      {lastRoll && (
        <div className="fixed bottom-4 right-4 z-40 max-w-sm w-full bg-stone-900/95 border border-amber-600/60 rounded-xl p-3.5 shadow-2xl backdrop-blur-md animate-fade-in flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-900/40 border border-amber-600/50 text-amber-300">
              <Dices className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-stone-200">{lastRoll.skillName || 'Jet D100'}</div>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="font-mono font-bold text-amber-300 text-sm">
                  {lastRoll.diceRoll}
                </span>
                {lastRoll.targetSkill > 0 && (
                  <span className="text-stone-400">/ {lastRoll.targetSkill}%</span>
                )}
                <span
                  className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    lastRoll.level === 'Critique'
                      ? 'bg-amber-950 text-amber-300 border-amber-500'
                      : lastRoll.level === 'Spéciale'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                      : lastRoll.level === 'Réussite'
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                      : lastRoll.level === 'Maladresse'
                      ? 'bg-red-950 text-red-400 border-red-600'
                      : 'bg-rose-950 text-rose-300 border-rose-500'
                  }`}
                >
                  {lastRoll.level}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setLastRoll(null)}
            className="p-1 rounded text-stone-500 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-amber-950/60 bg-stone-950/80 py-6 text-center text-xs text-stone-500 font-serif mt-auto">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span>RUNEQUESTING FR</span>
            <span>•</span>
            <span>RuneQuest: Roleplaying in Glorantha</span>
            <span>•</span>
            <span>Chaosium Inc.</span>
            <span>•</span>
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-sans"
            >
              <Palette className="w-3 h-3" />
              Thème : {currentTheme.name}
            </button>
            <span>•</span>
            <button
              onClick={() => setIsBackupModalOpen(true)}
              className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-sans"
            >
              <FolderArchive className="w-3 h-3" />
              Sauvegardes & Restauration
            </button>
          </div>
          <p className="text-[11px] text-stone-600">
            Boîte à outils d'aide de jeu pour RuneQuest dans Glorantha. Créé sous licence et dans le respect de l'univers mythique de Greg Stafford.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
