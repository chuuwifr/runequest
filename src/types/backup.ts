import { Adventurer, RollResult } from './runequest';

export interface BackupMetadata {
  appName: string;
  version: string;
  exportDate: string;
  characterCount: number;
  characterNames: string[];
  description?: string;
  themeId?: string;
}

export interface CombatStateBackup {
  round: number;
  currentSr: number;
  combatants: any[];
}

export interface CalendarStateBackup {
  year: number;
  seasonId: string;
  weekIdx: number;
  dayIdx: number;
  lunarPhaseId: string;
  campaignNotes?: string;
}

export interface SiteBackupData {
  app: 'RuneQuesting FR';
  version: number;
  exportDate: string;
  type: 'full_site_backup' | 'single_character_backup';
  metadata: BackupMetadata;
  payload: {
    adventurers: Adventurer[];
    activeAdventurerId?: string;
    combatState?: CombatStateBackup;
    calendarState?: CalendarStateBackup;
    npcsState?: any[];
    rollHistory?: RollResult[];
    themeId?: string;
    singleCharacter?: Adventurer;
  };
}

export interface LocalSnapshot {
  id: string;
  name: string;
  timestamp: number;
  dateFormatted: string;
  characterCount: number;
  characterNames: string[];
  themeId?: string;
  backupData: SiteBackupData;
}
