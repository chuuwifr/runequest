import React, { useState } from 'react';
import { 
  X, 
  GitBranch, 
  Globe, 
  Copy, 
  Check, 
  Terminal, 
  ExternalLink, 
  Download, 
  Users, 
  Rocket, 
  ShieldCheck, 
  Sparkles,
  FileCode,
  FolderArchive,
  ChevronRight
} from 'lucide-react';

interface GitHubGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBackupModal?: () => void;
}

export const GitHubGuideModal: React.FC<GitHubGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenBackupModal,
}) => {
  const [activeTab, setActiveTab] = useState<'pages' | 'push' | 'clone' | 'releases'>('pages');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const gitPushScript = `# 1. Initialiser le dépôt Git local
git init

# 2. Ajouter tous les fichiers du projet
git add .

# 3. Créer le commit initial
git commit -m "feat: Initialisation de RuneQuesting FR"

# 4. Définir la branche principale
git branch -M main

# 5. Lier à votre dépôt GitHub (remplacez par votre lien GitHub)
git remote add origin https://github.com/VOTRE_PSEUDO/runequesting-fr.git

# 6. Envoyer le code sur GitHub
git push -u origin main`;

  const gitCloneScript = `# 1. Cloner le dépôt sur votre ordinateur
git clone https://github.com/VOTRE_PSEUDO/runequesting-fr.git

# 2. Entrer dans le dossier
cd runequesting-fr

# 3. Installer les dépendances
npm install

# 4. Lancer le serveur local de jeu
npm run dev

# 5. Ouvrir http://localhost:3000 dans votre navigateur !`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-stone-900 border border-amber-600/50 rounded-2xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-stone-950 via-amber-950/40 to-stone-950 border-b border-amber-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-bold text-amber-100">
                  Guide GitHub & Déploiement en Ligne
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  GitHub Pages Inclus
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Hébergez gratuitement votre application sur le web ou gérez votre code source avec Git
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition cursor-pointer"
            title="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-800 bg-stone-950/60 px-6 gap-2 overflow-x-auto text-xs font-serif font-semibold">
          <button
            onClick={() => setActiveTab('pages')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'pages'
                ? 'border-amber-400 text-amber-300 bg-amber-950/20'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Globe className="h-4 w-4" />
            1. Héberger Gratuitement (GitHub Pages)
          </button>
          <button
            onClick={() => setActiveTab('push')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'push'
                ? 'border-amber-400 text-amber-300 bg-amber-950/20'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Rocket className="h-4 w-4" />
            2. Publier sur GitHub (Git Push)
          </button>
          <button
            onClick={() => setActiveTab('clone')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'clone'
                ? 'border-amber-400 text-amber-300 bg-amber-950/20'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Terminal className="h-4 w-4" />
            3. Cloner & Jouer en Local
          </button>
          <button
            onClick={() => setActiveTab('releases')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'releases'
                ? 'border-amber-400 text-amber-300 bg-amber-950/20'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Users className="h-4 w-4" />
            4. Partager PJ & Campagnes
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-200">
          {/* TAB 1: GITHUB PAGES */}
          {activeTab === 'pages' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-stone-900 to-emerald-950/40 border border-emerald-500/40 flex items-start gap-3">
                <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-emerald-200 text-sm">
                    100% Compatible avec GitHub Pages (Zéro Serveur Requis)
                  </div>
                  <p className="text-stone-300 leading-relaxed">
                    RuneQuesting fonctionne intégralement côté client avec stockage sécurisé dans le navigateur (<code className="text-amber-300">localStorage</code>). Cela signifie que vous pouvez héberger l'application sur **GitHub Pages** gratuitement à vie, sans serveur payant et avec des performances ultra-rapides pour tous vos joueurs !
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-serif font-bold text-amber-200 text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" /> Étapes pour Activer GitHub Pages en 2 Minutes :
                </h3>

                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-stone-950 border border-stone-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-600/30 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                      1
                    </span>
                    <div className="text-xs space-y-1">
                      <p className="font-semibold text-stone-100">
                        Créez un dépôt sur GitHub et poussez le code
                      </p>
                      <p className="text-stone-400">
                        Sur <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-amber-400 underline inline-flex items-center gap-1">github.com/new <ExternalLink className="h-3 w-3" /></a>, créez un nouveau dépôt public (ex: <code className="text-amber-300">runequesting</code>).
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-stone-950 border border-stone-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-600/30 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                      2
                    </span>
                    <div className="text-xs space-y-1">
                      <p className="font-semibold text-stone-100">
                        Le workflow GitHub Actions est déjà configuré dans le projet !
                      </p>
                      <p className="text-stone-400">
                        Le fichier <code className="text-amber-300">.github/workflows/deploy.yml</code> est déjà inclus dans votre projet. Il compile automatiquement le site à chaque push sur la branche <code className="text-stone-300">main</code>.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-stone-950 border border-stone-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-600/30 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                      3
                    </span>
                    <div className="text-xs space-y-1">
                      <p className="font-semibold text-stone-100">
                        Activer GitHub Pages dans les paramètres du dépôt
                      </p>
                      <p className="text-stone-400 leading-relaxed">
                        Sur votre dépôt GitHub : allez dans <strong>Settings</strong> &gt; <strong>Pages</strong> (menu de gauche).<br />
                        Sous <em>Build and deployment / Source</em>, sélectionnez : <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-600/40">GitHub Actions</span>.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-stone-950 border border-stone-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                      4
                    </span>
                    <div className="text-xs space-y-1">
                      <p className="font-semibold text-emerald-200">
                        Votre URL de jeu est prête !
                      </p>
                      <p className="text-stone-400">
                        Votre site sera disponible sur l'adresse :<br />
                        <span className="font-mono text-amber-300 bg-stone-900 px-2 py-1 rounded border border-stone-700 mt-1 inline-block">
                          https://&lt;VOTRE_PSEUDO&gt;.github.io/&lt;NOM_DU_DEPOT&gt;/
                        </span>
                      </p>
                      <p className="text-stone-400 pt-1">
                        Vos joueurs peuvent désormais ouvrir cette adresse sur leur téléphone, tablette ou ordinateur portable autour de la table de jeu !
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PUSH TO GITHUB */}
          {activeTab === 'push' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-amber-200 text-base">
                  Commandes Git pour publier le projet sur GitHub
                </h3>
                <p className="text-xs text-stone-400">
                  Ouvrez un terminal dans le dossier du projet et exécutez les commandes suivantes pour initialiser et envoyer le code sur votre compte GitHub :
                </p>
              </div>

              <div className="relative rounded-xl bg-stone-950 border border-stone-800 p-4 font-mono text-xs text-amber-300 leading-relaxed overflow-x-auto">
                <button
                  onClick={() => copyToClipboard(gitPushScript, 'push')}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 font-sans font-medium text-xs flex items-center gap-1.5 border border-stone-700 cursor-pointer transition"
                >
                  {copiedKey === 'push' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-300 font-bold">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copier tout le script</span>
                    </>
                  )}
                </button>
                <pre className="pr-32">{gitPushScript}</pre>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-600/30 text-xs space-y-2">
                <div className="font-semibold text-amber-200 flex items-center gap-1.5">
                  <FileCode className="h-4 w-4 text-amber-400" /> Configuration Vite automatique
                </div>
                <p className="text-stone-300 leading-relaxed">
                  Le fichier <code className="text-amber-300">vite.config.ts</code> est configuré avec <code className="text-amber-300">base: './'</code>. Cela garantit que tous les scripts et styles CSS sont chargés avec des chemins relatifs et fonctionnent quel que soit le sous-dossier de votre dépôt GitHub.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: CLONE & LOCAL */}
          {activeTab === 'clone' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-amber-200 text-base">
                  Cloner le dépôt et jouer en local
                </h3>
                <p className="text-xs text-stone-400">
                  Si un joueur ou co-maître de jeu souhaite cloner le projet depuis GitHub pour le modifier ou l'exécuter sur sa propre machine :
                </p>
              </div>

              <div className="relative rounded-xl bg-stone-950 border border-stone-800 p-4 font-mono text-xs text-amber-300 leading-relaxed overflow-x-auto">
                <button
                  onClick={() => copyToClipboard(gitCloneScript, 'clone')}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 font-sans font-medium text-xs flex items-center gap-1.5 border border-stone-700 cursor-pointer transition"
                >
                  {copiedKey === 'clone' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-300 font-bold">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
                <pre className="pr-28">{gitCloneScript}</pre>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-xs space-y-1.5">
                  <span className="font-bold text-amber-200 flex items-center gap-1">
                    <Rocket className="h-4 w-4 text-amber-400" /> Mode Développement
                  </span>
                  <p className="text-stone-400">
                    <code className="text-amber-300">npm run dev</code> lance le serveur avec rechargement instantané à chaque modification.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-xs space-y-1.5">
                  <span className="font-bold text-amber-200 flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" /> Mode Production
                  </span>
                  <p className="text-stone-400">
                    <code className="text-amber-300">npm run build && npm start</code> compile l'application et démarre le serveur Express optimisé.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RELEASES & EXCHANGES */}
          {activeTab === 'releases' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-amber-200 text-base">
                  Distribuer et synchroniser votre campagne via GitHub
                </h3>
                <p className="text-xs text-stone-400">
                  Vous pouvez utiliser GitHub pour partager vos campagnes, PNJ et fiches de jeu avec toute votre tablée.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Release zip */}
                <div className="p-5 rounded-xl bg-stone-950 border border-amber-600/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-amber-400" />
                    <h4 className="font-serif font-bold text-sm text-amber-100">
                      GitHub Releases (Archive Hors-Ligne)
                    </h4>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Vous pouvez attacher le fichier <code className="text-amber-300">runequesting-local-autonome.zip</code> à une <strong>Release GitHub</strong>. Vos joueurs n'auront alors qu'à télécharger ce zip en 1 clic pour jouer hors-ligne sans installer Node ni Git !
                  </p>
                  <a
                    href="/runequesting-local-autonome.zip"
                    download="runequesting-local-autonome.zip"
                    className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-amber-300 hover:text-amber-200 bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-600/40"
                  >
                    <Download className="h-3.5 w-3.5" /> Télécharger l'archive autonome (.zip)
                  </a>
                </div>

                {/* JSON Campaign Exports */}
                <div className="p-5 rounded-xl bg-stone-950 border border-amber-600/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <FolderArchive className="h-5 w-5 text-amber-400" />
                    <h4 className="font-serif font-bold text-sm text-amber-100">
                      Partage de Sauvegardes JSON
                    </h4>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Le Maître de Jeu ou les joueurs peuvent exporter leurs personnages ou la campagne entière au format <code className="text-amber-300">.json</code>, les committer dans un sous-dossier <code className="text-stone-300">/campagnes</code> de votre repo GitHub, et les restaurer à volonté.
                  </p>
                  {onOpenBackupModal && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenBackupModal();
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-amber-300 hover:text-amber-200 bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-600/40 cursor-pointer"
                    >
                      <FolderArchive className="h-3.5 w-3.5" /> Ouvrir l'outil d'Export / Import JSON
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-950 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-stone-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            Déploiement GitHub Actions &amp; Pages prêt à l'emploi
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-serif font-medium cursor-pointer transition"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
