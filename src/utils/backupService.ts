import { Adventurer, RollResult } from '../types/runequest';
import { SiteBackupData, LocalSnapshot, BackupMetadata, CombatStateBackup, CalendarStateBackup } from '../types/backup';

const SNAPSHOTS_STORAGE_KEY = 'rqg_snapshots_v1';
const ADVENTURERS_STORAGE_KEY = 'rqg_adventurers_v1';
const COMBAT_STORAGE_KEY = 'rqg_combat_state_v1';
const CALENDAR_STORAGE_KEY = 'rqg_calendar_state_v1';
const NPCS_STORAGE_KEY = 'rqg_npcs_state_v1';
const THEME_STORAGE_KEY = 'rqg_theme_preference';

/**
 * Creates a complete site backup data structure
 */
export function createFullBackup(
  adventurers: Adventurer[],
  activeAdventurerId?: string,
  extra?: {
    combatState?: CombatStateBackup;
    calendarState?: CalendarStateBackup;
    npcsState?: any[];
    rollHistory?: RollResult[];
    themeId?: string;
  }
): SiteBackupData {
  const now = new Date();
  const themeId = extra?.themeId || localStorage.getItem(THEME_STORAGE_KEY) || 'dark-mystic';
  
  // Read any extra cached states if not passed
  let combatState = extra?.combatState;
  if (!combatState) {
    try {
      const saved = localStorage.getItem(COMBAT_STORAGE_KEY);
      if (saved) combatState = JSON.parse(saved);
    } catch {
      // ignore
    }
  }

  let calendarState = extra?.calendarState;
  if (!calendarState) {
    try {
      const saved = localStorage.getItem(CALENDAR_STORAGE_KEY);
      if (saved) calendarState = JSON.parse(saved);
    } catch {
      // ignore
    }
  }

  let npcsState = extra?.npcsState;
  if (!npcsState) {
    try {
      const saved = localStorage.getItem(NPCS_STORAGE_KEY);
      if (saved) npcsState = JSON.parse(saved);
    } catch {
      // ignore
    }
  }

  const metadata: BackupMetadata = {
    appName: 'RuneQuesting FR',
    version: '1.0.0',
    exportDate: now.toISOString(),
    characterCount: adventurers.length,
    characterNames: adventurers.map((a) => a.name || 'Aventurier sans nom'),
    themeId,
  };

  return {
    app: 'RuneQuesting FR',
    version: 1,
    exportDate: now.toISOString(),
    type: 'full_site_backup',
    metadata,
    payload: {
      adventurers,
      activeAdventurerId: activeAdventurerId || adventurers[0]?.id,
      combatState,
      calendarState,
      npcsState,
      rollHistory: extra?.rollHistory || [],
      themeId,
    },
  };
}

/**
 * Creates a single character backup data structure
 */
export function createSingleCharacterBackup(adventurer: Adventurer): SiteBackupData {
  const now = new Date();
  const metadata: BackupMetadata = {
    appName: 'RuneQuesting FR',
    version: '1.0.0',
    exportDate: now.toISOString(),
    characterCount: 1,
    characterNames: [adventurer.name || 'Aventurier sans nom'],
    description: `Fiche de personnage individuelle : ${adventurer.name} (${adventurer.occupation || 'Aventurier'})`,
  };

  return {
    app: 'RuneQuesting FR',
    version: 1,
    exportDate: now.toISOString(),
    type: 'single_character_backup',
    metadata,
    payload: {
      adventurers: [adventurer],
      singleCharacter: adventurer,
      activeAdventurerId: adventurer.id,
    },
  };
}

/**
 * Triggers browser file download of JSON data
 */
export function downloadJsonFile(data: any, fileName: string) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Helper to download full site backup
 */
export function downloadFullSiteBackup(
  adventurers: Adventurer[],
  activeAdventurerId?: string,
  extra?: {
    combatState?: CombatStateBackup;
    calendarState?: CalendarStateBackup;
    npcsState?: any[];
    rollHistory?: RollResult[];
    themeId?: string;
  }
) {
  const backup = createFullBackup(adventurers, activeAdventurerId, extra);
  const dateSlug = new Date().toISOString().slice(0, 10);
  const fileName = `sauvegarde-complete-runequesting-${dateSlug}.json`;
  downloadJsonFile(backup, fileName);
}

/**
 * Helper to download single character backup
 */
export function downloadCharacterBackup(adventurer: Adventurer) {
  const backup = createSingleCharacterBackup(adventurer);
  const cleanName = (adventurer.name || 'aventurier')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]/g, '_');
  const fileName = `rqg-${cleanName}.json`;
  downloadJsonFile(backup, fileName);
}

/**
 * Parses and validates raw JSON string into a structured SiteBackupData or returns error
 */
export function parseAndValidateBackup(jsonString: string): {
  isValid: boolean;
  data?: SiteBackupData;
  errorMessage?: string;
  isSingleCharacter?: boolean;
} {
  try {
    const parsed = JSON.parse(jsonString);

    if (!parsed || typeof parsed !== 'object') {
      return { isValid: false, errorMessage: 'Le fichier ne contient pas un objet JSON valide.' };
    }

    // Case 1: Standard SiteBackupData
    if (parsed.app === 'RuneQuesting FR' && parsed.payload) {
      const advs = parsed.payload.adventurers;
      if (Array.isArray(advs)) {
        return {
          isValid: true,
          data: parsed as SiteBackupData,
          isSingleCharacter: parsed.type === 'single_character_backup' || advs.length === 1,
        };
      }
    }

    // Case 2: Array of Adventurers (legacy or raw export)
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].characteristics) {
      const now = new Date();
      const syntheticBackup: SiteBackupData = {
        app: 'RuneQuesting FR',
        version: 1,
        exportDate: now.toISOString(),
        type: 'full_site_backup',
        metadata: {
          appName: 'RuneQuesting FR',
          version: '1.0.0',
          exportDate: now.toISOString(),
          characterCount: parsed.length,
          characterNames: parsed.map((a: any) => a.name || 'Aventurier'),
        },
        payload: {
          adventurers: parsed,
          activeAdventurerId: parsed[0].id,
        },
      };
      return { isValid: true, data: syntheticBackup, isSingleCharacter: false };
    }

    // Case 3: Raw single Adventurer object
    if (parsed.id && parsed.characteristics && (parsed.runes || parsed.skills)) {
      const syntheticBackup = createSingleCharacterBackup(parsed as Adventurer);
      return { isValid: true, data: syntheticBackup, isSingleCharacter: true };
    }

    return {
      isValid: false,
      errorMessage: 'Le format du fichier JSON n\'est pas reconnu comme une sauvegarde RuneQuesting valide.',
    };
  } catch (err: any) {
    return {
      isValid: false,
      errorMessage: `Erreur de syntaxe JSON : ${err?.message || 'fichier corrompu'}`,
    };
  }
}

/**
 * Local Snapshots Management
 */
export function getLocalSnapshots(): LocalSnapshot[] {
  try {
    const raw = localStorage.getItem(SNAPSHOTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.sort((a, b) => b.timestamp - a.timestamp);
    }
    return [];
  } catch (e) {
    console.error('Error loading snapshots from localStorage', e);
    return [];
  }
}

export function saveLocalSnapshot(
  name: string,
  adventurers: Adventurer[],
  activeAdventurerId?: string,
  extra?: {
    combatState?: CombatStateBackup;
    calendarState?: CalendarStateBackup;
    npcsState?: any[];
    rollHistory?: RollResult[];
    themeId?: string;
  }
): LocalSnapshot {
  const backupData = createFullBackup(adventurers, activeAdventurerId, extra);
  const now = new Date();
  
  const newSnapshot: LocalSnapshot = {
    id: `snap_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    name: name.trim() || `Instantané du ${now.toLocaleDateString('fr-FR')} ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
    timestamp: Date.now(),
    dateFormatted: `${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
    characterCount: adventurers.length,
    characterNames: adventurers.map((a) => a.name || 'Aventurier'),
    themeId: backupData.payload.themeId,
    backupData,
  };

  const existing = getLocalSnapshots();
  const updated = [newSnapshot, ...existing].slice(0, 20); // Keep max 20 snapshots
  localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(updated));

  return newSnapshot;
}

export function deleteLocalSnapshot(snapshotId: string): LocalSnapshot[] {
  const existing = getLocalSnapshots();
  const updated = existing.filter((s) => s.id !== snapshotId);
  localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function clearAllSnapshots() {
  localStorage.removeItem(SNAPSHOTS_STORAGE_KEY);
}
