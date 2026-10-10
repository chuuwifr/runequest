import os
import zipfile
import shutil

source_dir = 'dist'
zip_filename = 'public/runequesting-local-autonome.zip'
staging = 'dist_standalone'

os.makedirs('public', exist_ok=True)
if os.path.exists(staging):
    shutil.rmtree(staging)
os.makedirs(staging, exist_ok=True)

# Copy built assets
for item in os.listdir(source_dir):
    s = os.path.join(source_dir, item)
    d = os.path.join(staging, item)
    if os.path.isdir(s):
        shutil.copytree(s, d)
    else:
        shutil.copy2(s, d)

# 1. Windows launcher: LANCER-WINDOWS.bat
with open(os.path.join(staging, 'LANCER-WINDOWS.bat'), 'w', encoding='utf-8') as f:
    f.write("@echo off\r\n")
    f.write("chcp 65001 >nul\r\n")
    f.write("title RuneQuesting FR - Lanceur Local\r\n")
    f.write("echo ====================================================\r\n")
    f.write("echo  RuneQuesting FR - Demarrage de l application locale\r\n")
    f.write("echo ====================================================\r\n")
    f.write("echo.\r\n")
    f.write("echo Lancement du serveur local sur le port 8080...\r\n")
    f.write("echo Ouverture automatique dans votre navigateur...\r\n")
    f.write("start http://localhost:8080\r\n")
    f.write("python -m http.server 8080\r\n")
    f.write("if %ERRORLEVEL% NEQ 0 (\r\n")
    f.write("  echo Python non detecte, ouverture directe dans votre navigateur par defaut...\r\n")
    f.write("  start index.html\r\n")
    f.write(")\r\n")
    f.write("pause\r\n")

# 2. Mac & Linux launcher: LANCER-MAC-LINUX.sh
with open(os.path.join(staging, 'LANCER-MAC-LINUX.sh'), 'w', encoding='utf-8') as f:
    f.write("#!/bin/bash\n")
    f.write('cd "$(dirname "$0")"\n')
    f.write('echo "===================================================="\n')
    f.write('echo " RuneQuesting FR - Demarrage Local"\n')
    f.write('echo "===================================================="\n')
    f.write('echo "Ouverture dans le navigateur..."\n')
    f.write('which xdg-open > /dev/null && xdg-open http://localhost:8080 || which open > /dev/null && open http://localhost:8080 || echo "Ouvrez http://localhost:8080 dans votre navigateur"\n')
    f.write("python3 -m http.server 8080 || python -m SimpleHTTPServer 8080\n")

os.chmod(os.path.join(staging, 'LANCER-MAC-LINUX.sh'), 0o755)

# 3. Simple Node.js launcher if Node is present: serveur-node-zero-dependency.js
node_server_code = """// Serveur HTTP ultra-léger zéro dépendance (utilise uniquement les modules natifs 'http', 'fs' et 'path' de Node)
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  let filePath = path.join(__dirname, reqPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(__dirname, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Erreur serveur');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('==================================================');
  console.log('⚔️  RuneQuesting FR - Serveur Local Actif !');
  console.log('🌐 Rendez-vous sur : http://localhost:' + PORT);
  console.log('==================================================');
});
"""

with open(os.path.join(staging, 'serveur-node-zero-dependency.js'), 'w', encoding='utf-8') as f:
    f.write(node_server_code)

# 4. Instructions file: LISEZMOI.txt
readme_text = """============================================================
RUNEQUESTING FR - VERSION AUTONOME HORS-LIGNE & SANS INSTALLATION
============================================================

Cette archive contient l'application complete compilee et prete a l'emploi,
sans avoir besoin de faire 'npm install' ni de compiler aucun code source.

COMMENT DEMARRER :

METHODE 1 (La plus simple avec double-clic selon votre systeme) :
- SOUS WINDOWS : Double-cliquez sur "LANCER-WINDOWS.bat".
- SOUS MAC / LINUX : Double-cliquez ou executez "./LANCER-MAC-LINUX.sh".

METHODE 2 (Si vous avez Node.js installe, zero dependance requise) :
- Executez la commande : node serveur-node-zero-dependency.js
- Puis ouvrez http://localhost:8080 dans votre navigateur.

METHODE 3 (Sans aucun serveur) :
- Double-cliquez directement sur "index.html" dans votre navigateur favori
  (Chrome, Firefox, Safari, Edge, Brave...).

FONCTIONNALITES INCLUSES :
- Feuilles de personnage interactives completes (RQG)
- Createur d'aventuriers
- Suivi des combats, rangs de frappe (SR) et localisations de degats
- Calendrier gloranthien et phases de la Lune Rouge
- Grimoire des sorts et bestiaire
- Sauvegardes / restaurations JSON et instantanes de seance.
============================================================
"""

with open(os.path.join(staging, 'LISEZMOI.txt'), 'w', encoding='utf-8') as f:
    f.write(readme_text)

# Create zip archive
with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(staging):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, staging)
            zipf.write(full_path, rel_path)

print("SUCCESS: Zip package created at", zip_filename, "Size:", os.path.getsize(zip_filename), "bytes")
