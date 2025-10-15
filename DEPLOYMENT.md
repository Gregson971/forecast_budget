# Guide de Déploiement - Forecast Budget

Ce guide explique comment déployer l'application Forecast Budget en production.

## 📦 Architecture de déploiement

- **Frontend** : Vercel (https://forecast-budget.vercel.app)
- **Backend** : Railway (https://forecastbudget-production.up.railway.app)
- **Base de données** : PostgreSQL sur Railway

## 🚀 Déploiement Backend (Railway)

### 1. Configuration des variables d'environnement

Dans le dashboard Railway, configurez les variables d'environnement suivantes :

#### Variables requises

```env
# Base de données PostgreSQL (automatiquement fournie par Railway si vous ajoutez un service PostgreSQL)
DATABASE_URL=${DATABASE_URL}

# Sécurité - IMPORTANT: Générez une clé secrète forte et unique
SECRET_KEY=votre_cle_secrete_production_tres_longue_et_aleatoire

# CORS - Autoriser l'origine de votre frontend Vercel
ORIGINS_ALLOWED=["https://forecast-budget.vercel.app"]

# Environnement
ENVIRONMENT=production
DEBUG=false
```

#### ⚠️ Configuration CORS - TRÈS IMPORTANT

La variable `ORIGINS_ALLOWED` doit être au **format JSON array** avec des guillemets doubles :

✅ **CORRECT** :
```json
["https://forecast-budget.vercel.app"]
```

✅ **Multiple domaines** :
```json
["https://forecast-budget.vercel.app","https://www.votredomaine.com"]
```

❌ **INCORRECT** :
```
https://forecast-budget.vercel.app
```

❌ **INCORRECT** (guillemets simples) :
```json
['https://forecast-budget.vercel.app']
```

### 2. Étapes de déploiement sur Railway

#### Option A : Depuis le dashboard Railway

1. **Créer un nouveau projet** sur Railway
2. **Ajouter un service PostgreSQL** :
   - Cliquez sur "+ New"
   - Sélectionnez "Database" → "PostgreSQL"
   - Railway génèrera automatiquement `DATABASE_URL`
3. **Déployer le backend** :
   - Cliquez sur "+ New"
   - Sélectionnez "GitHub Repo"
   - Choisissez votre repository `forecast_budget`
   - Définir le **Root Directory** : `backend`
4. **Configurer les variables d'environnement** :
   - Allez dans l'onglet "Variables"
   - Ajoutez toutes les variables listées ci-dessus
   - **IMPORTANT** : Copiez exactement le format JSON pour `ORIGINS_ALLOWED`
5. **Redéployer** :
   - Cliquez sur "Deploy" ou attendez le déploiement automatique

#### Option B : Avec Railway CLI

```bash
# Installer Railway CLI
npm i -g @railway/cli

# Login
railway login

# Créer un nouveau projet
railway init

# Ajouter PostgreSQL
railway add --database postgresql

# Définir les variables d'environnement
railway variables set SECRET_KEY="votre_cle_secrete"
railway variables set ORIGINS_ALLOWED='["https://forecast-budget.vercel.app"]'
railway variables set ENVIRONMENT="production"
railway variables set DEBUG="false"

# Déployer
cd backend
railway up
```

### 3. Vérifier le déploiement

```bash
# Tester l'API
curl https://forecastbudget-production.up.railway.app/

# Vérifier la documentation
# Ouvrir dans le navigateur:
https://forecastbudget-production.up.railway.app/docs
```

### 4. Migrations de base de données

Les migrations Alembic s'exécutent automatiquement au démarrage grâce à `startup.py`. Si vous devez les exécuter manuellement :

```bash
# Depuis Railway CLI
railway run alembic upgrade head

# Ou via le shell Railway (dans le dashboard)
alembic upgrade head
```

## 🌐 Déploiement Frontend (Vercel)

### 1. Configuration des variables d'environnement

Dans le dashboard Vercel, configurez :

```env
# URL de l'API backend sur Railway
NEXT_PUBLIC_API_URL=https://forecastbudget-production.up.railway.app
```

### 2. Déploiement

#### Option A : Depuis le dashboard Vercel

1. **Importer le projet** depuis GitHub
2. **Configurer le projet** :
   - Framework Preset : Next.js
   - Root Directory : `frontend`
   - Build Command : `npm run build`
   - Output Directory : `.next`
3. **Ajouter les variables d'environnement**
4. **Deploy**

#### Option B : Avec Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Login
vercel login

# Déployer depuis le dossier frontend
cd frontend
vercel

# Définir les variables d'environnement
vercel env add NEXT_PUBLIC_API_URL production

# Déployer en production
vercel --prod
```

## 🔧 Résolution des problèmes courants

### Erreur CORS : "No 'Access-Control-Allow-Origin' header"

**Symptôme** :
```
Access to fetch at 'https://forecastbudget-production.up.railway.app/auth/register'
from origin 'https://forecast-budget.vercel.app' has been blocked by CORS policy
```

**Solution** :

1. Vérifiez que `ORIGINS_ALLOWED` sur Railway contient exactement l'URL de votre frontend Vercel
2. Vérifiez le format JSON (guillemets doubles, pas de guillemets simples)
3. Pas d'espace dans le JSON
4. L'URL doit correspondre exactement (avec ou sans `www.`)

```bash
# Dans Railway Dashboard → Variables
ORIGINS_ALLOWED=["https://forecast-budget.vercel.app"]

# Si vous avez plusieurs domaines
ORIGINS_ALLOWED=["https://forecast-budget.vercel.app","https://forecast-budget-git-main.vercel.app"]
```

5. **Redéployez** l'application après modification des variables

### Erreur "relation does not exist"

**Solution** :
```bash
# Dans Railway shell (via dashboard)
alembic upgrade head
```

### Erreur de connexion à la base de données

**Vérifications** :
1. Le service PostgreSQL est bien démarré sur Railway
2. La variable `DATABASE_URL` est correctement définie
3. Les logs Railway montrent la connexion à PostgreSQL

```bash
# Voir les logs
railway logs
```

### Frontend ne peut pas se connecter au backend

**Vérifications** :
1. `NEXT_PUBLIC_API_URL` sur Vercel pointe vers l'URL Railway correcte
2. L'URL Railway est accessible publiquement
3. CORS est correctement configuré sur Railway

### Avertissement "collation version mismatch"

**Symptôme** :
```
WARNING: database "railway" has a collation version mismatch
DETAIL: The database was created using collation version 2.36, but the operating system provides version 2.41.
```

**Nature du problème** :
- Ce n'est **pas une erreur critique** - l'application fonctionne normalement
- Cet avertissement apparaît quand PostgreSQL détecte un changement de version de collation
- Peut potentiellement affecter le tri et la comparaison de texte

**Solution** :

#### Option 1 : Depuis Railway Dashboard (Recommandé)

1. Allez dans votre service PostgreSQL sur Railway
2. Cliquez sur "Data" ou "Connect" pour accéder au shell PostgreSQL
3. Exécutez la commande :
```sql
ALTER DATABASE railway REFRESH COLLATION VERSION;
```

#### Option 2 : Avec Railway CLI

```bash
# Connectez-vous à PostgreSQL
railway connect postgres

# Une fois connecté, exécutez :
ALTER DATABASE railway REFRESH COLLATION VERSION;

# Sortez avec \q
```

#### Option 3 : Avec le script fourni

```bash
# Depuis le dossier backend
railway run psql $DATABASE_URL -f fix_collation.sql
```

**Vérification** :
Après avoir exécuté la commande, redéployez votre application. Les avertissements ne devraient plus apparaître dans les logs.

## 📊 Monitoring et Logs

### Railway Logs

```bash
# Via CLI
railway logs

# Via Dashboard
# Onglet "Deployments" → Cliquez sur un déploiement → "View Logs"
```

### Vercel Logs

```bash
# Via CLI
vercel logs

# Via Dashboard
# Projet → Deployments → Cliquez sur un déploiement → "Logs"
```

## 🔐 Sécurité en production

### Checklist de sécurité

- [ ] `SECRET_KEY` est unique et sécurisé (minimum 32 caractères aléatoires)
- [ ] `DEBUG=false` en production
- [ ] `ORIGINS_ALLOWED` contient uniquement les domaines autorisés
- [ ] Variables d'environnement sensibles ne sont pas committées dans Git
- [ ] Certificats SSL activés (automatique sur Railway et Vercel)
- [ ] Base de données PostgreSQL utilise un mot de passe fort

### Générer une SECRET_KEY sécurisée

```bash
# Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# OpenSSL
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🔄 Mise à jour de l'application

### Backend (Railway)

```bash
# Pousser les changements sur GitHub
git add .
git commit -m "Update backend"
git push origin main

# Railway redéploie automatiquement
```

### Frontend (Vercel)

```bash
# Pousser les changements sur GitHub
git add .
git commit -m "Update frontend"
git push origin main

# Vercel redéploie automatiquement
```

## 📝 Configuration complète recommandée

### Railway (Backend)

```env
DATABASE_URL=${DATABASE_URL}
SECRET_KEY=votre_cle_secrete_production_32_caracteres_minimum
ORIGINS_ALLOWED=["https://forecast-budget.vercel.app"]
ENVIRONMENT=production
DEBUG=false
POSTGRES_DB=railway
POSTGRES_USER=postgres
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
```

### Vercel (Frontend)

```env
NEXT_PUBLIC_API_URL=https://forecastbudget-production.up.railway.app
```

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs Railway et Vercel
2. Vérifiez que toutes les variables d'environnement sont correctement définies
3. Testez les endpoints API directement dans le navigateur
4. Vérifiez la console du navigateur pour les erreurs JavaScript/TypeScript
5. Consultez la documentation Railway et Vercel

---

**Note** : Ce guide suppose que vous utilisez Railway pour le backend et Vercel pour le frontend. Adaptez les instructions selon votre plateforme de déploiement.
