# Configuration Railway pour le déploiement automatique

Ce guide explique comment configurer Railway pour déployer automatiquement le backend à chaque push sur `main` après validation des tests.

## 🎯 Architecture du workflow

Le workflow GitHub Actions se charge **uniquement des tests**. Si les tests passent, **Railway déploie automatiquement** via son intégration GitHub native.

```
Push sur main → Tests GitHub Actions → ✅ Tests OK → Railway déploie automatiquement
                                     → ❌ Tests KO → Déploiement bloqué
```

## 📋 Étapes de configuration

### 1. Connecter Railway à GitHub

1. **Accédez à votre projet Railway**
   - Allez sur [railway.app](https://railway.app)
   - Ouvrez votre projet backend

2. **Connectez le repository GitHub**
   - Cliquez sur **Settings** (⚙️)
   - Section **Source**
   - Cliquez sur **Connect GitHub Repository**
   - Sélectionnez le repository : `Gregson971/forecast_budget`
   - Configurez :
     - **Branch** : `main`
     - **Root Directory** : `backend/`

3. **Activez les déploiements automatiques**
   - Dans Settings → **Triggers**
   - Activez **Deploy on Push**
   - Configurez pour déployer uniquement si les checks GitHub passent

### 2. Configurer les variables d'environnement

Dans Railway, configurez ces variables :

```env
# Base de données (Railway fournit automatiquement DATABASE_URL)
# Pas besoin de la configurer manuellement

# Sécurité
SECRET_KEY=your_production_secret_key_here

# CORS
ORIGINS_ALLOWED=["https://votre-frontend.vercel.app"]

# Environnement
ENVIRONMENT=production
DEBUG=false

# Twilio (pour les SMS de réinitialisation de mot de passe)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=+1234567890
```

### 3. Configurer le déploiement

Dans Railway Settings :

**Build Configuration** :
- **Builder** : Nixpacks (détection automatique)
- **Build Command** : (laissez vide, détection auto)
- **Start Command** : `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Deployment** :
- **Health Check Path** : `/health`
- **Restart Policy** : On Failure (10 retries max)

### 4. Configurer les migrations

**Option 1 : Deploy Hook (Recommandé)**

Dans Railway, ajoutez un Deploy Hook pour exécuter les migrations :

1. Settings → **Deploy**
2. Ajoutez un **Deploy Hook** :
   ```bash
   alembic upgrade head
   ```

**Option 2 : Manuellement après chaque déploiement**

Via Railway CLI :
```bash
railway run alembic upgrade head
```

## 🔄 Workflow de déploiement

### Pour un déploiement

1. **Développez votre fonctionnalité** dans une branche
2. **Créez une Pull Request** vers `main`
3. **Les tests s'exécutent automatiquement** sur la PR
4. **Mergez** la PR si les tests passent
5. **Railway déploie automatiquement** le backend

### Monitoring

- **GitHub Actions** : Voir les résultats des tests
- **Railway Dashboard** : Voir le statut du déploiement et les logs
- **Railway CLI** : `railway logs` pour voir les logs en temps réel

## 🚫 Qu'est-ce qui a changé ?

### Avant (complexe) ❌
- Workflow GitHub Actions avec Railway CLI
- Configuration de tokens et project IDs
- Gestion manuelle du lien avec Railway
- Erreurs de configuration fréquentes

### Maintenant (simple) ✅
- GitHub Actions : **Tests uniquement**
- Railway : **Déploiement automatique** via intégration native
- Pas de configuration complexe
- Plus fiable et maintenable

## 🛡️ Protection de la production

Railway déploiera **uniquement si** :
- ✅ Le push est sur la branche `main`
- ✅ Les tests GitHub Actions passent
- ✅ Aucun conflit de merge

Si les tests échouent, le déploiement est automatiquement bloqué ! 🔒

## 📊 Avantages de cette approche

1. **Simplicité** : Pas de CLI à configurer dans GitHub Actions
2. **Fiabilité** : Railway gère le déploiement nativement
3. **Visibilité** : Logs et statuts dans Railway Dashboard
4. **Sécurité** : Pas de tokens à exposer dans le workflow
5. **Maintenance** : Moins de configuration à maintenir

## 🆘 Dépannage

### Le déploiement ne se déclenche pas

1. Vérifiez que l'intégration GitHub est active
2. Vérifiez que "Deploy on Push" est activé
3. Vérifiez que le Root Directory est `backend/`
4. Vérifiez que les tests GitHub Actions passent

### Les migrations ne s'exécutent pas

1. Vérifiez le Deploy Hook dans Railway
2. Ou exécutez manuellement : `railway run alembic upgrade head`

### Erreurs au démarrage

1. Vérifiez les variables d'environnement
2. Vérifiez les logs Railway : `railway logs`
3. Vérifiez la Start Command

## 📚 Ressources

- [Documentation Railway](https://docs.railway.app)
- [Railway GitHub Integration](https://docs.railway.app/deploy/github)
- [Railway CLI](https://docs.railway.app/develop/cli)

