# RuneQuesting FR - Guide d'Utilisation GitHub, Déploiement en Ligne & Exécution Locale

Cette application est une suite complète d'aide de jeu pour **RuneQuest: Roleplaying in Glorantha (RQG)** avec créateur d'aventuriers, feuilles de personnage interactives, arène de combat (SR, rangs d'impact, localisations de dégâts), calendrier gloranthien, grimoire de magie, bestiaire et système complet de sauvegarde / restauration JSON.

---

## 🌐 1. Utilisation & Hébergement Gratuit sur GitHub (GitHub Pages)

**RuneQuesting FR fonctionne à 100% côté client**, ce qui en fait le projet parfait à héberger gratuitement sur **GitHub Pages** :
- **Zéro frais d'hébergement** (100% gratuit à vie via GitHub).
- **Zéro serveur ou base de données à administrer** : les données de chaque joueur (fiches de PJ, points de magie, blessures, inventaire) sont stockées en toute sécurité directement dans leur navigateur (`localStorage`).
- **Accessible partout** : chaque joueur ou Maître de Jeu peut ouvrir l'URL sur son smartphone, sa tablette ou son PC portable autour de la table de jeu.

### 🚀 Activer GitHub Pages en 4 étapes :

1. **Créer un nouveau dépôt sur GitHub** :
   - Rendez-vous sur [github.com/new](https://github.com/new).
   - Donnez-lui un nom (par exemple `runequesting-fr` ou `runequesting`) et laissez-le en mode **Public**.

2. **Pousser votre code sur le dépôt** :
   Dans votre terminal (à la racine du projet) :
   ```bash
   git init
   git add .
   git commit -m "feat: Déploiement initial RuneQuesting FR"
   git branch -M main
   git remote add origin https://github.com/<VOTRE-PSEUDO>/<NOM-DU-DEPOT>.git
   git push -u origin main
   ```

3. **Activer GitHub Pages dans les réglages du dépôt** :
   - Sur votre page GitHub, cliquez sur **Settings** (en haut à droite).
   - Dans le menu de gauche, cliquez sur **Pages**.
   - Sous **Build and deployment** > **Source**, choisissez **GitHub Actions**.

4. **Votre site est en ligne !**
   - Le workflow automatique `.github/workflows/deploy.yml` (déjà inclus dans le dépôt) va automatiquement compiler le code et déployer l'application.
   - Votre application sera accessible à l'adresse :
     👉 `https://<VOTRE-PSEUDO>.github.io/<NOM-DU-DEPOT>/`
   - Vous pouvez envoyer ce lien à tous vos joueurs avant la séance de jeu !

---

### 🛠️ Dépannage & Erreurs Fréquentes de Déploiement :

Si le déploiement sur GitHub Actions a échoué (croix rouge ❌ dans l'onglet Actions), vérifiez ces 3 réglages essentiels :

#### 1. Erreur « Get Pages site failed with status code 404 »
- **Cause** : GitHub Pages n'est pas encore activé dans votre dépôt.
- **Solution** :
  1. Allez sur votre dépôt GitHub > **Settings** (en haut).
  2. Cliquez sur **Pages** (dans le menu de gauche).
  3. Sous **Build and deployment** > **Source**, sélectionnez **GitHub Actions**.
  *(Alternative : vous pouvez aussi sélectionner **Deploy from a branch** et choisir la branche `gh-pages` qui est générée automatiquement par le workflow !)*

#### 2. Erreur « Resource not accessible by integration » (Erreur 403)
- **Cause** : Par défaut, certains dépôts ont les permissions GitHub Actions réglées en lecture seule.
- **Solution** :
  1. Allez dans **Settings** > **Actions** > **General**.
  2. Descendez tout en bas jusqu'à la section **Workflow permissions**.
  3. Cochez **Read and write permissions**.
  4. Cochez également *Allow GitHub Actions to create and approve pull requests*.
  5. Cliquez sur **Save**.

#### 3. Dépôt Public vs Privé (Comptes GitHub Gratuits)
- Sur un compte GitHub standard gratuit, GitHub Pages est réservé aux dépôts **Publics**.
- Si votre dépôt est en mode *Private*, passez-le en *Public* dans **Settings** > **General** > **Danger Zone** > **Change repository visibility**.

#### 4. Comment relancer le déploiement après correction :
- Allez dans l'onglet **Actions** de votre dépôt GitHub.
- Dans la colonne de gauche, cliquez sur **Déploiement GitHub Pages**.
- Cliquez sur le bouton **Run workflow** (en haut à droite) puis confirmez **Run workflow**. Le déploiement passera au vert ✅ !

---

## 👥 2. Cloner le Projet depuis GitHub & Jouer en Local

Si vous ou vos joueurs souhaitez récupérer le code depuis GitHub pour jouer hors-ligne ou modifier l'application :

### Prérequis
- [Node.js](https://nodejs.org/) version 18 ou supérieure
- [Git](https://git-scm.com/)

### Commandes :
```bash
# 1. Cloner le dépôt
git clone https://github.com/<VOTRE-PSEUDO>/<NOM-DU-DEPOT>.git

# 2. Entrer dans le dossier
cd <NOM-DU-DEPOT>

# 3. Installer les dépendances
npm install

# 4. Lancer le serveur local de jeu
npm run dev
```

Puis ouvrez votre navigateur sur : **http://localhost:3000**

---

## 📦 3. Téléchargement Autonome & Releases GitHub (Zéro Installation)

Pour les joueurs qui ne souhaitent pas installer Node.js ou Git :

1. Vous pouvez attacher le fichier `runequesting-local-autonome.zip` à une **Release GitHub** :
   - Sur GitHub, allez dans l'onglet **Releases** > **Create a new release**.
   - Déposez le fichier `.zip` dans la zone de pièces jointes.
2. Vos joueurs peuvent alors télécharger le dossier autonome en 1 clic :
   - **Sous Windows** : Dézipper et double-cliquer sur `LANCER-WINDOWS.bat`.
   - **Sous Mac & Linux** : Dézipper et exécuter `./LANCER-MAC-LINUX.sh`.
   - **Sans serveur** : Double-cliquer directement sur `index.html` dans n'importe quel navigateur (Chrome, Firefox, Safari, Edge, Brave...).
   - **Node.js ultra-léger** : Exécuter `node serveur-node-zero-dependency.js` (aucun `npm install` requis).

---

## 💾 4. Partager des Campagnes & Fiches de PJ via GitHub

- L'application dispose d'un outil d'**Export / Import JSON** complet (accessible via le bouton **Sauvegardes**).
- Vous pouvez exporter :
  - Un aventurier individuel au format `.json` (pour l'échanger entre joueur et MJ).
  - L'ensemble de la campagne (tous les PJ, l'arène de combat en cours, l'état du calendrier et les PNJ créés).
- Vous pouvez créer un dossier `campagnes/` dans votre dépôt GitHub pour archiver l'historique de vos aventures au format JSON !

---

## ⚙️ Scripts npm Disponibles

| Commande | Description |
| :--- | :--- |
| `npm run dev` | Démarre le serveur local de développement (`http://localhost:3000`) |
| `npm run build` | Compile l'application React avec Vite pour GitHub Pages et compile le serveur optionnel |
| `npm start` | Démarre le serveur Express de production |
| `npm run package:standalone` | Génère l'archive autonome zip hors-ligne dans `public/` |
| `npm run lint` | Vérifie la cohérence du code TypeScript (`tsc --noEmit`) |

---

## 📜 Licence & Droits

RuneQuest est une marque déposée de Chaosium Inc. Glorantha est un univers créé par Greg Stafford. Cette application d'aide de jeu est conçue pour faciliter les parties entre rôlistes.
