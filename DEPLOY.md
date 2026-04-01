# Déployer sur Render (guide pas à pas)

Une seule URL : site React + API + fichiers uploadés. Pas de `VITE_API_URL` à configurer.

---

## 1. Préparer un `JWT_SECRET`

C’est la clé utilisée pour signer les sessions admin. **Ne la partagez jamais** et **ne la committez pas** dans Git.

Générez une chaîne longue et aléatoire (minimum ~32 caractères), par exemple :

**Avec Node.js** (si installé) :

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

**Avec PowerShell** :

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

Copiez le résultat dans un coin sûr ; vous le collerez dans Render à l’étape 3.

---

## 2. Pousser le code sur GitHub / GitLab

Render déploie depuis un dépôt distant. Si le projet n’est que sur votre PC :

1. Créez un dépôt vide sur GitHub (ou GitLab).
2. Dans le dossier du projet :
   ```bash
   git init
   git add .
   git commit -m "Initial"
   git remote add origin https://github.com/VOTRE_USER/VOTRE_REPO.git
   git branch -M main
   git push -u origin main
   ```

---

## 3. Créer le service sur Render

1. Allez sur [https://dashboard.render.com](https://dashboard.render.com) et connectez-vous (ou créez un compte).
2. Cliquez **New +** → **Blueprint**.
3. **Connect repository** : choisissez GitHub/GitLab et **autorisez** Render si demandé, puis sélectionnez le dépôt qui contient `render.yaml`.
4. Render détecte le fichier **`render.yaml`** et affiche un service nommé **raa**.
5. Avant de lancer le déploiement, ouvrez la section **environment variables** (variables d’environnement) du blueprint :
   - Vous devez renseigner **`JWT_SECRET`** : collez la longue chaîne générée à l’étape 1.
   - Les autres variables (`NODE_ENV`, `DATABASE_URL`) sont déjà définies dans `render.yaml`.
6. Cliquez **Apply** / **Deploy blueprint** (selon l’interface).

Le **premier build** peut prendre plusieurs minutes (`npm install`, build Vite, Prisma, etc.).

---

## 4. Après le premier déploiement réussi

1. Ouvrez le service **raa** : notez l’URL publique, du type `https://raa.onrender.com` (le nom peut varier).
2. Testez dans le navigateur : `https://VOTRE_URL.onrender.com/api/health` — vous devez voir du JSON du type `{"ok":true,"service":"RAA API"}`.
3. **Créer le compte admin et les données de démo** — une seule fois :
   - Dans le tableau de bord Render : service **raa** → onglet **Shell** (ou **Connect** → **Shell**).
   - Exécutez :
     ```bash
     cd backend && npx prisma db seed
     ```
4. Allez sur `https://VOTRE_URL.onrender.com/admin` et connectez-vous :
   - **E-mail** : `admin@raa.bj`
   - **Mot de passe** : `raa-admin-2026`  
   Changez ce mot de passe après la première connexion (via votre propre logique ou en régénérant le seed en production avec d’autres variables — pour la prod, modifiez surtout le mot de passe côté base ou recréez l’admin).

---

## 5. Si vous aviez oublié `JWT_SECRET` avant le déploiement

1. Service **raa** → **Environment**.
2. Ajoutez **`JWT_SECRET`** avec votre valeur secrète → **Save changes**.
3. Render redéploiera automatiquement (ou cliquez **Manual Deploy**).

---

## 6. Si le déploiement affiche « deploy failed »

1. Service **raa** → **Logs** : remontez au **premier** message d’erreur (build ou démarrage).
2. Vérifiez **Environment** → **`JWT_SECRET`** est défini (long texte, sans espaces en trop).
3. Souvent le **health check** échoue si le serveur n’écoute pas sur `0.0.0.0` : le dépôt est corrigé pour Render (`RENDER` → écoute `0.0.0.0`). Faites **git push** des derniers commits puis **Manual Deploy**.
4. Variable **`DATABASE_URL`** : avec le `render.yaml` actuel, elle doit être `file:../data/prod.db` (chemin correct depuis `prisma/`).
5. Erreur **`Cannot find type definition file for 'vite/client'`** au build : Render installe sans les `devDependencies` si `NODE_ENV=production`. Le script `scripts/render-build.mjs` utilise `npm install --include=dev` pour corriger ça ; poussez la dernière version du dépôt.

---

## 7. Limites de l’offre gratuite

- Le service peut **mettre du temps à répondre** après une période d’inactivité (démarrage à froid).
- Sur le plan gratuit, le **disque** (fichier SQLite + uploads) peut être réinitialisé dans certains cas ; pour une base client sérieuse, prévoyez plus tard une offre payante ou des sauvegardes.

---

## Développement local

Copiez `backend/.env.example` vers `backend/.env`, mettez-y aussi un **`JWT_SECRET`** (peut être différent de la prod), puis à la racine :

```bash
npm run install:all
npm run db:setup
npm run dev
```

---

## Netlify

Ce projet n’utilise **pas** Netlify pour l’API. Utilisez **Render** comme ci-dessus.
