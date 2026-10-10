import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Download,
  Upload,
  Save,
  RotateCcw,
  Copy,
  Check,
  FileText,
  AlertTriangle,
  Clock,
  Trash2,
  Plus,
  RefreshCw,
  FolderArchive,
  Layers,
  Sparkles,
  Users,
  Shield,
  CheckCircle2,
  FileJson
} from 'lucide-react';
import { Adventurer, RollResult } from '../types/runequest';
import { SiteBackupData, LocalSnapshot } from '../types/backup';
import { ThemeId } from '../types/theme';
import {
  createFullBackup,
  downloadFullSiteBackup,
  downloadCharacterBackup,
  downloadJsonFile,
  parseAndValidateBackup,
  getLocalSnapshots,
  saveLocalSnapshot,
  deleteLocalSnapshot,
} from '../utils/backupService';
import { useTheme } from '../context/ThemeContext';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  adventurers: Adventurer[];
  activeAdventurer: Adventurer;
  onRestoreAll: (data: SiteBackupData) => void;
  onMergeAdventurers: (newAdventurers: Adventurer[]) => void;
  onResetToDefaults: () => void;
  rollHistory?: RollResult[];
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose,
  adventurers,
  activeAdventurer,
  onRestoreAll,
  onMergeAdventurers,
  onResetToDefaults,
  rollHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'snapshots' | 'reset'>('export');
  const { currentThemeId, setTheme } = useTheme();

  // Export State
  const [selectedCharacterToExport, setSelectedCharacterToExport] = useState<string>(activeAdventurer?.id || adventurers[0]?.id || '');
  const [isCopied, setIsCopied] = useState(false);

  // Import State
  const [pastedJson, setPastedJson] = useState('');
  const [parsedImport, setParsedImport] = useState<{
    isValid: boolean;
    data?: SiteBackupData;
    errorMessage?: string;
    isSingleCharacter?: boolean;
  } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Snapshots State
  const [snapshots, setSnapshots] = useState<LocalSnapshot[]>([]);
  const [newSnapshotName, setNewSnapshotName] = useState('');
  const [snapshotSuccessMsg, setSnapshotSuccessMsg] = useState<string | null>(null);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSnapshots(getLocalSnapshots());
      setSelectedCharacterToExport(activeAdventurer?.id || adventurers[0]?.id || '');
      setParsedImport(null);
      setPastedJson('');
      setToastMessage(null);
      setSnapshotSuccessMsg(null);
    }
  }, [isOpen, activeAdventurer, adventurers]);

  if (!isOpen) return null;

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handle Full Export Download
  const handleDownloadFullBackup = () => {
    downloadFullSiteBackup(adventurers, activeAdventurer?.id, {
      rollHistory,
      themeId: currentThemeId,
    });
    showToast('success', 'Sauvegarde complète téléchargée au format JSON.');
  };

  // Handle Single Character Download
  const handleDownloadSingleCharacter = () => {
    const char = adventurers.find((a) => a.id === selectedCharacterToExport) || activeAdventurer;
    if (char) {
      downloadCharacterBackup(char);
      showToast('success', `Fiche de ${char.name} téléchargée.`);
    }
  };

  // Handle Copy Full JSON to Clipboard
  const handleCopyJsonToClipboard = () => {
    const backup = createFullBackup(adventurers, activeAdventurer?.id, {
      rollHistory,
      themeId: currentThemeId,
    });
    navigator.clipboard.writeText(JSON.stringify(backup, null, 2));
    setIsCopied(true);
    showToast('success', 'Code JSON copié dans le presse-papier !');
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Handle File Input Upload
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setPastedJson(content);
        const result = parseAndValidateBackup(content);
        setParsedImport(result);
      }
    };
    reader.onerror = () => {
      showToast('error', 'Erreur lors de la lecture du fichier.');
    };
    reader.readAsText(file);
  };

  // Handle Textarea JSON change
  const handleJsonTextChange = (text: string) => {
    setPastedJson(text);
    if (text.trim().length > 0) {
      const result = parseAndValidateBackup(text);
      setParsedImport(result);
    } else {
      setParsedImport(null);
    }
  };

  // Perform Full Restore
  const handleExecuteFullRestore = () => {
    if (!parsedImport?.data) return;
    const confirmMsg = `Êtes-vous sûr de vouloir remplacer toutes vos données actuelles par cette sauvegarde ? (${parsedImport.data.metadata.characterCount} aventurier(s) inclus)`;
    if (window.confirm(confirmMsg)) {
      onRestoreAll(parsedImport.data);
      if (parsedImport.data.payload.themeId) {
        setTheme(parsedImport.data.payload.themeId as ThemeId);
      }
      showToast('success', 'Restauration complète effectuée avec succès !');
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  // Perform Merge Import
  const handleExecuteMergeImport = () => {
    if (!parsedImport?.data) return;
    const importedAdvs = parsedImport.data.payload.adventurers;
    if (!importedAdvs || importedAdvs.length === 0) return;

    onMergeAdventurers(importedAdvs);
    showToast('success', `${importedAdvs.length} aventurier(s) ajouté(s) à votre registre sans effacer les existants.`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Create a Local Snapshot
  const handleCreateSnapshot = () => {
    const name = newSnapshotName.trim() || `Instantané Campagne (${adventurers.length} PJ)`;
    const newSnap = saveLocalSnapshot(name, adventurers, activeAdventurer?.id, {
      rollHistory,
      themeId: currentThemeId,
    });
    setSnapshots(getLocalSnapshots());
    setNewSnapshotName('');
    setSnapshotSuccessMsg(`Point de restauration « ${newSnap.name} » créé !`);
    setTimeout(() => setSnapshotSuccessMsg(null), 3000);
  };

  // Restore a Local Snapshot
  const handleRestoreSnapshot = (snap: LocalSnapshot) => {
    const confirmMsg = `Restaurer l'instantané « ${snap.name} » (${snap.dateFormatted}) ?\nToutes les données actuelles seront remplacées par celles de cet instantané.`;
    if (window.confirm(confirmMsg)) {
      onRestoreAll(snap.backupData);
      if (snap.themeId) {
        setTheme(snap.themeId as ThemeId);
      }
      showToast('success', `Instantané « ${snap.name} » restauré avec succès !`);
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  // Delete a Local Snapshot
  const handleDeleteSnapshot = (id: string, name: string) => {
    if (window.confirm(`Supprimer l'instantané « ${name} » ?`)) {
      const updated = deleteLocalSnapshot(id);
      setSnapshots(updated);
      showToast('success', 'Instantané supprimé.');
    }
  };

  // Reset to Factory Defaults
  const handleResetToFactory = () => {
    const confirmText = 'ATTENTION : Cette action va réinitialiser tout le site aux personnages de base (Vasana, Harmast, Yanioth...). Vos modifications actuelles non sauvegardées seront perdues.\n\nVoulez-vous continuer ?';
    if (window.confirm(confirmText)) {
      // Auto-save a safety snapshot first!
      saveLocalSnapshot('Auto-Sauvegarde Avant Réinitialisation', adventurers, activeAdventurer?.id, {
        rollHistory,
        themeId: currentThemeId,
      });
      onResetToDefaults();
      showToast('success', 'Données réinitialisées aux aventuriers officiels. (Un instantané de secours a été créé automatiquement).');
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-amber-600/50 rounded-2xl shadow-2xl shadow-black/90 flex flex-col max-h-[92vh] overflow-hidden text-stone-100 font-sans my-auto">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-amber-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-900/40 border border-amber-600/50 text-amber-300">
              <FolderArchive className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-amber-200">
                Sauvegardes & Restauration du Site
              </h2>
              <p className="text-xs text-stone-400">
                Exportez, importez et conservez vos campagnes, aventuriers et états de jeu en toute sécurité.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-stone-100 transition cursor-pointer"
            title="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toast feedback banner */}
        {toastMessage && (
          <div
            className={`px-4 py-2.5 text-xs font-semibold flex items-center justify-between border-b ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-600/50'
                : 'bg-rose-950/90 text-rose-300 border-rose-600/50'
            }`}
          >
            <div className="flex items-center gap-2">
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-rose-400" />
              )}
              <span>{toastMessage.text}</span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-800 bg-stone-950/70 px-4 sm:px-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('export')}
            className={`py-3 px-3 text-xs sm:text-sm font-serif font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'export'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Download className="h-4 w-4" />
            Exporter & Télécharger
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`py-3 px-3 text-xs sm:text-sm font-serif font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'import'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Upload className="h-4 w-4" />
            Importer & Restaurer
          </button>

          <button
            onClick={() => setActiveTab('snapshots')}
            className={`py-3 px-3 text-xs sm:text-sm font-serif font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'snapshots'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Clock className="h-4 w-4" />
            Points de Restauration ({snapshots.length})
          </button>

          <button
            onClick={() => setActiveTab('reset')}
            className={`py-3 px-3 text-xs sm:text-sm font-serif font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ml-auto ${
              activeTab === 'reset'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-stone-500 hover:text-red-300'
            }`}
          >
            <RotateCcw className="h-4 w-4" />
            Réinitialisation
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: EXPORT */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              {/* Card 1: Full Site Export */}
              <div className="p-5 rounded-xl bg-stone-950/80 border border-amber-600/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-base text-amber-200 flex items-center gap-2">
                      <FolderArchive className="h-5 w-5 text-amber-400" /> Sauvegarde Complète du Site
                    </h3>
                    <p className="text-xs text-stone-400">
                      Téléchargez l'intégralité de vos données dans un seul fichier universel <code className="text-amber-300">.json</code>.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-600/40 self-start sm:self-center">
                    {adventurers.length} Aventurier(s) inclus
                  </span>
                </div>

                {/* Content summary pill */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">Aventuriers</span>
                    <strong className="text-amber-300 font-mono text-sm">{adventurers.length}</strong>
                  </div>
                  <div className="p-2.5 rounded bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">Feuilles de Personnages</span>
                    <strong className="text-emerald-400 font-mono text-sm">Complètes</strong>
                  </div>
                  <div className="p-2.5 rounded bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">Combat & Calendrier</span>
                    <strong className="text-cyan-400 font-mono text-sm">Sauvegardés</strong>
                  </div>
                  <div className="p-2.5 rounded bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">Thème & Préférences</span>
                    <strong className="text-purple-400 font-mono text-sm">Actifs</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleDownloadFullBackup}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-serif font-bold text-xs sm:text-sm shadow-lg shadow-amber-900/30 flex items-center gap-2 cursor-pointer transition transform active:scale-95"
                  >
                    <Download className="h-4 w-4 text-stone-950" />
                    Télécharger la Sauvegarde Complète (.json)
                  </button>

                  <button
                    onClick={handleCopyJsonToClipboard}
                    className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 hover:border-amber-500/50 font-serif text-xs flex items-center gap-2 cursor-pointer transition"
                  >
                    {isCopied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-amber-400" />}
                    {isCopied ? 'Code JSON copié !' : 'Copier le JSON dans le presse-papier'}
                  </button>
                </div>
              </div>

              {/* Card 2: Single Character Export */}
              <div className="p-5 rounded-xl bg-stone-950/80 border border-stone-800 space-y-4">
                <div className="border-b border-stone-800 pb-3">
                  <h3 className="font-serif font-bold text-base text-amber-200 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-amber-400" /> Exporter un Aventurier Individuel
                  </h3>
                  <p className="text-xs text-stone-400">
                    Idéal pour échanger une fiche de personnage avec vos joueurs ou d'autres meneurs de jeu.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <select
                    value={selectedCharacterToExport}
                    onChange={(e) => setSelectedCharacterToExport(e.target.value)}
                    className="w-full sm:w-auto flex-1 bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none font-serif"
                  >
                    {adventurers.map((adv) => (
                      <option key={adv.id} value={adv.id}>
                        {adv.name} — {adv.occupation} ({adv.homeland})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleDownloadSingleCharacter}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-600/40 font-serif text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition"
                  >
                    <Download className="h-4 w-4 text-amber-400" />
                    Exporter cette fiche (.json)
                  </button>
                </div>
              </div>

              {/* Card 3: Standalone Offline Complete App Package (Zero Install) */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-amber-950/40 via-stone-950 to-stone-950 border-2 border-amber-500/60 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-800/40 pb-3">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-2">
                      <Sparkles className="h-3 w-3 text-amber-400" /> 100% Autonome & Sans Installation
                    </span>
                    <h3 className="font-serif font-bold text-base text-amber-100 flex items-center gap-2">
                      <FolderArchive className="h-5 w-5 text-amber-400" /> Télécharger Tout le Site Clé en Main (.zip)
                    </h3>
                    <p className="text-xs text-stone-300 mt-1">
                      Téléchargez un dossier ZIP complet contenant <strong>absolument tous les fichiers</strong> (HTML, styles, scripts, lanceurs Windows/Mac/Linux et mini-serveur intégré).
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/40 self-start sm:self-center">
                    Zéro Dépendance npm
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-300">
                  <div className="p-3 rounded-lg bg-stone-900/80 border border-stone-800 space-y-1">
                    <strong className="text-amber-300 block font-serif">⚡ 1. Sous Windows</strong>
                    <p className="text-[11px] text-stone-400">Dézippez et double-cliquez sur <code className="text-amber-200">LANCER-WINDOWS.bat</code>.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-stone-900/80 border border-stone-800 space-y-1">
                    <strong className="text-cyan-300 block font-serif">🍎 2. Sous Mac & Linux</strong>
                    <p className="text-[11px] text-stone-400">Exécutez <code className="text-cyan-200">./LANCER-MAC-LINUX.sh</code> ou ouvrez directement dans le navigateur.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-stone-900/80 border border-stone-800 space-y-1">
                    <strong className="text-emerald-300 block font-serif">🌐 3. Sans serveur</strong>
                    <p className="text-[11px] text-stone-400">Double-cliquez simplement sur <code className="text-emerald-200">index.html</code> avec n'importe quel navigateur !</p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href="./runequesting-local-autonome.zip"
                    download="runequesting-local-autonome.zip"
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-serif font-black text-xs sm:text-sm shadow-xl shadow-amber-900/40 flex items-center gap-2 cursor-pointer transition transform active:scale-95 no-underline"
                  >
                    <Download className="h-4 w-4 text-stone-950" />
                    Télécharger l'Archive Autonome (.zip - Tout Inclus)
                  </a>
                  <span className="text-[11px] text-stone-400 italic">
                    Prêt à l'emploi immédiatement après décompression
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IMPORT */}
          {activeTab === 'import' && (
            <div className="space-y-6">
              {/* File Drop & Pick Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 sm:p-8 rounded-xl border-2 border-dashed text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                  isDragOver
                    ? 'border-amber-400 bg-amber-950/30 shadow-inner'
                    : 'border-stone-700 hover:border-amber-500/60 bg-stone-950/60 hover:bg-stone-950'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                <div className="p-3 rounded-full bg-amber-900/30 border border-amber-600/40 text-amber-400">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-stone-200">
                    Glissez-déposez votre fichier de sauvegarde <span className="text-amber-300">.json</span>
                  </h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Ou cliquez pour parcourir les dossiers de votre appareil
                  </p>
                </div>
              </div>

              {/* Paste JSON Text Area */}
              <div className="space-y-2">
                <label className="text-xs font-serif font-bold text-stone-300 block">
                  Ou collez directement le texte JSON brut ci-dessous :
                </label>
                <textarea
                  rows={4}
                  value={pastedJson}
                  onChange={(e) => handleJsonTextChange(e.target.value)}
                  placeholder="Collez ici le contenu de votre fichier de sauvegarde JSON..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs font-mono text-stone-300 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Preview of Parsed Data */}
              {parsedImport && (
                <div
                  className={`p-5 rounded-xl border space-y-4 ${
                    parsedImport.isValid
                      ? 'bg-stone-950/90 border-emerald-500/50'
                      : 'bg-rose-950/40 border-rose-500/60'
                  }`}
                >
                  {parsedImport.isValid && parsedImport.data ? (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          <h4 className="font-serif font-bold text-sm text-emerald-300">
                            Fichier de Sauvegarde Valide et Reconnu
                          </h4>
                        </div>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                          Type : {parsedImport.isSingleCharacter ? 'Fiche Individuelle' : 'Sauvegarde Complète'}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="text-stone-300">
                          <strong className="text-stone-400">Date d'exportation :</strong>{' '}
                          {new Date(parsedImport.data.exportDate).toLocaleString('fr-FR')}
                        </div>
                        <div className="text-stone-300">
                          <strong className="text-stone-400">Aventurier(s) détecté(s) ({parsedImport.data.payload.adventurers.length}) :</strong>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {parsedImport.data.payload.adventurers.map((a, idx) => (
                              <span
                                key={a.id || idx}
                                className="px-2 py-1 rounded bg-stone-900 border border-stone-700 text-amber-300 font-serif"
                              >
                                {a.name || 'Sans nom'} ({a.occupation || 'Aventurier'})
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Restore Action Buttons */}
                      <div className="pt-3 border-t border-stone-800 flex flex-wrap items-center gap-3">
                        <button
                          onClick={handleExecuteFullRestore}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-stone-950 font-serif font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 cursor-pointer transition transform active:scale-95"
                        >
                          <RotateCcw className="h-4 w-4 text-stone-950" />
                          Remplacer Tout (Restauration Complète)
                        </button>

                        <button
                          onClick={handleExecuteMergeImport}
                          className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-600/40 font-serif text-xs font-bold flex items-center gap-2 cursor-pointer transition"
                        >
                          <Plus className="h-4 w-4 text-amber-400" />
                          Fusionner & Ajouter aux fiches actuelles
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-start gap-3 text-rose-300 text-xs">
                      <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-serif text-sm text-rose-200">Fichier de Sauvegarde Invalide</strong>
                        <p>{parsedImport.errorMessage || 'Impossible de lire les données du fichier JSON.'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SNAPSHOTS */}
          {activeTab === 'snapshots' && (
            <div className="space-y-6">
              {/* Create Snapshot Bar */}
              <div className="p-4 rounded-xl bg-stone-950/80 border border-amber-600/30 space-y-3">
                <h3 className="font-serif font-bold text-sm text-amber-200 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" /> Créer un Point de Restauration Instantané
                </h3>
                <p className="text-xs text-stone-400">
                  Enregistrez l'état exact de votre séance dans la mémoire locale de votre navigateur.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    value={newSnapshotName}
                    onChange={(e) => setNewSnapshotName(e.target.value)}
                    placeholder="Nom du point (ex: Fin de la Session 4 - Temple des Vents)..."
                    className="w-full flex-1 bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-stone-100 focus:border-amber-500 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateSnapshot();
                    }}
                  />
                  <button
                    onClick={handleCreateSnapshot}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-serif font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition whitespace-nowrap"
                  >
                    <Save className="h-4 w-4 text-stone-950" />
                    Enregistrer l'instantané
                  </button>
                </div>

                {snapshotSuccessMsg && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1.5 animate-fade-in">
                    <Check className="h-3.5 w-3.5" /> {snapshotSuccessMsg}
                  </p>
                )}
              </div>

              {/* Snapshots List */}
              <div className="space-y-3">
                <h4 className="text-xs font-serif font-bold text-stone-300 uppercase tracking-wider">
                  Points de Restauration Enregistrés ({snapshots.length})
                </h4>

                {snapshots.length === 0 ? (
                  <div className="p-8 rounded-xl bg-stone-950/40 border border-stone-800 text-center text-xs text-stone-500 space-y-1">
                    <Clock className="h-8 w-8 text-stone-600 mx-auto mb-2" />
                    <p className="font-serif">Aucun point de restauration local enregistré pour le moment.</p>
                    <p>Créez-en un ci-dessus avant un combat périlleux ou une grande décision de campagne !</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {snapshots.map((snap) => (
                      <div
                        key={snap.id}
                        className="p-4 rounded-xl bg-stone-950/90 border border-stone-800 hover:border-amber-600/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-serif font-bold text-sm text-amber-200">{snap.name}</h5>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-900 text-stone-400 border border-stone-800">
                              {snap.characterCount} PJ
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-400 flex items-center gap-2">
                            <span>🕒 {snap.dateFormatted}</span>
                            <span>•</span>
                            <span className="truncate max-w-xs">{snap.characterNames.join(', ')}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => handleRestoreSnapshot(snap)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/40 text-xs font-serif font-semibold flex items-center gap-1.5 cursor-pointer transition"
                            title="Restaurer cet instantané"
                          >
                            <RotateCcw className="h-3.5 w-3.5 text-emerald-400" />
                            Restaurer
                          </button>

                          <button
                            onClick={() => downloadJsonFile(snap.backupData, `snapshot-${snap.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`)}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-300 border border-stone-700 cursor-pointer transition"
                            title="Télécharger en fichier JSON"
                          >
                            <Download className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteSnapshot(snap.id, snap.name)}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 text-stone-400 hover:text-rose-300 border border-stone-700 hover:border-rose-600/50 cursor-pointer transition"
                            title="Supprimer cet instantané"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: RESET */}
          {activeTab === 'reset' && (
            <div className="p-6 rounded-xl bg-stone-950/80 border border-red-900/40 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-600/50 text-red-400 shrink-0">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-base text-red-200">
                    Réinitialisation d'Usine & Personnages d'Origine
                  </h3>
                  <p className="text-xs text-stone-400">
                    Cette action réinitialise la liste des aventuriers avec les héros pré-tirés officiels de RuneQuest (Vasana, Harmast, Yanioth, Sorala, Vishi Dunn, Nathem).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-900/30 text-xs text-red-300 space-y-1">
                <strong>Sécurité garantie :</strong> Avant d'effectuer la réinitialisation, un point de restauration de secours sera automatiquement créé dans vos instantanés locaux pour que vous puissiez annuler en cas d'erreur.
              </div>

              <div className="pt-2">
                <button
                  onClick={handleResetToFactory}
                  className="px-5 py-2.5 rounded-xl bg-red-900 hover:bg-red-800 text-red-100 font-serif font-bold text-xs sm:text-sm border border-red-600 shadow-lg flex items-center gap-2 cursor-pointer transition transform active:scale-95"
                >
                  <RotateCcw className="h-4 w-4 text-red-200" />
                  Réinitialiser aux Aventuriers d'Origine
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-500">
          <span className="font-serif">RuneQuesting FR • Gestionnaire de Sauvegardes</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 text-xs font-serif cursor-pointer transition"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
