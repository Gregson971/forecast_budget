# Forecast Budget 💰

[![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.12-green?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

> **Une application moderne de gestion de budget avec prévisions financières intelligentes**

## 📋 Description

**Forecast Budget** est une solution complète de gestion de budget personnelle qui combine une interface utilisateur moderne avec des prévisions financières intelligentes. L'application permet de suivre vos dépenses et revenus, d'analyser vos habitudes de consommation et de prévoir vos finances futures.

### 🎯 Objectifs du projet

- **Gestion simplifiée** des finances personnelles
- **Prévisions intelligentes** basées sur l'historique
- **Interface moderne** et intuitive
- **Sécurité renforcée** avec authentification JWT
- **Performance optimisée** avec les dernières technologies

## ✨ Fonctionnalités principales

### 💰 Gestion financière

- **Gestion unifiée des transactions** - Page unique pour dépenses et revenus avec filtres (type, mois, année) et pagination (20 transactions/page)
- **Suivi des dépenses** avec catégories et filtres
- **Gestion des revenus** avec sources multiples
- **Historique détaillé** avec recherche et tri
- **Import CSV** depuis exports bancaires (Boursorama, etc.) avec détection automatique des doublons
- **Export des données** (à venir)

### 📊 Analyses et prévisions

- **Tableaux de bord** interactifs
- **Graphiques** des dépenses et revenus
- **Prévisions budgétaires** basées sur l'IA
- **Tendances** et analyses comportementales

### 🔐 Sécurité et utilisateur

- **Authentification sécurisée** avec JWT et refresh tokens
- **Gestion des sessions** multiples (révocation à distance)
- **Réinitialisation de mot de passe** par SMS en 2 étapes
  - Demande de code par email (envoi SMS sur le numéro associé)
  - Vérification du code et définition du nouveau mot de passe
  - Code à 6 chiffres valide 10 minutes
  - Service SMS Mock en développement, Twilio en production
- **Gestion du numéro de téléphone** dans le profil utilisateur
- **Profil utilisateur** personnalisable (nom, prénom, email, téléphone)
- **Protection des données** privées et isolation des utilisateurs

### 🎨 Interface utilisateur

- **Design moderne** avec glassmorphism
- **Mode sombre** par défaut
- **Responsive design** pour tous les appareils
- **Animations fluides** et transitions
- **Gestion d'erreurs centralisée** avec notifications toast (Sonner)
- **Error boundary Next.js** pour une meilleure expérience utilisateur
- **Gestion silencieuse** des erreurs avec logs en développement uniquement

## 🏗️ Architecture

Le projet suit une architecture moderne avec séparation claire des responsabilités :

```
forecast_budget/
├── frontend/          # Application Next.js (React 19)
├── backend/           # API FastAPI (Python)
└── README.md          # Documentation principale
```

### 🎨 Frontend (Next.js 15)

- **Framework** : Next.js 15 avec App Router
- **UI** : React 19 + TypeScript
- **Styling** : Tailwind CSS 4.1
- **Charts** : Chart.js + React Chart.js 2
- **State Management** : React Context + Hooks

### ⚙️ Backend (FastAPI)

- **Framework** : FastAPI avec Python 3.11+
- **Base de données** : PostgreSQL avec SQLAlchemy 2.0
- **Authentification** : JWT avec refresh tokens
- **Architecture** : Clean Architecture (DDD)
- **Migrations** : Alembic

## 🚀 Démarrage rapide

### Prérequis

- **Node.js** 18.17+ (pour le frontend)
- **Python** 3.11+ (pour le backend)
- **PostgreSQL** 15+ (ou Docker)
- **Git**

### Installation complète

#### 1. Cloner le projet

```bash
git clone https://github.com/Gregson971/forecast_budget.git
cd forecast_budget
```

#### 2. Démarrer le backend

```bash
# Aller dans le dossier backend
cd backend

# Copier le fichier d'environnement
cp .env_example .env

# Éditer les variables d'environnement
nano .env

# Démarrer avec Docker (recommandé)
docker-compose up -d --build

# Ou installation locale
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

#### 3. Démarrer le frontend

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env.local

# Démarrer l'application
npm run dev
```

#### 4. Accéder à l'application

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8000
- **Documentation API** : http://localhost:8000/docs

## 📁 Structure du projet

```
forecast_budget/
├── frontend/                    # Application Next.js
│   ├── src/
│   │   ├── app/                # Pages et layouts
│   │   ├── components/         # Composants React
│   │   ├── hooks/              # Hooks personnalisés
│   │   ├── services/           # Services API
│   │   ├── context/            # Contextes React
│   │   ├── lib/                # Utilitaires
│   │   └── types/              # Types TypeScript
│   ├── public/                 # Assets statiques
│   ├── package.json            # Dépendances frontend
│   └── README.md               # Documentation frontend
├── backend/                    # API FastAPI
│   ├── app/
│   │   ├── domain/             # Domaines métier
│   │   ├── use_cases/          # Cas d'utilisation
│   │   ├── infrastructure/     # Infrastructure
│   │   ├── external_interfaces/ # Interfaces API
│   │   └── main.py             # Point d'entrée
│   ├── migrations/             # Migrations base de données
│   ├── tests/                  # Tests (257 tests, 89% couverture)
│   │   ├── unit/               # Tests unitaires (106 tests)
│   │   └── integration/        # Tests d'intégration (151 tests)
│   ├── requirements.txt        # Dépendances backend
│   └── README.md               # Documentation backend
├── LICENSE                     # Licence du projet
└── README.md                   # Documentation principale
```

## 🔧 Configuration

### Variables d'environnement Backend

```env
# Base de données (pour développement local, se connecte au PostgreSQL Docker)
DATABASE_URL=postgresql://postgres:password@localhost:5432/forecast_budget
POSTGRES_DB=forecast_budget
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password

# Sécurité
SECRET_KEY=your_super_secret_key_here

# CORS
ORIGINS_ALLOWED=["http://localhost:3000"]

# Environnement
ENVIRONMENT=development
DEBUG=true

# SMS / Twilio (optionnel en développement, obligatoire en production)
# En développement, les SMS sont simulés et affichés dans les logs
# TWILIO_ACCOUNT_SID=your_twilio_account_sid
# TWILIO_AUTH_TOKEN=your_twilio_auth_token
# TWILIO_FROM_NUMBER=+1234567890

# Note: Pour Docker, DATABASE_URL sera automatiquement configuré pour utiliser "postgres" au lieu de "localhost"
```

### Variables d'environnement Frontend

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8000

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🧪 Tests

### Tests Backend

```bash
cd backend

# Tous les tests (257 tests, 89% de couverture)
pytest --cov=app

# Tests unitaires uniquement (rapides, ~1.3s)
pytest tests/unit/

# Tests d'intégration uniquement (avec DB, ~15s)
pytest tests/integration/

# Avec Docker
docker compose exec api pytest --cov=app
```

**Statistiques** : 257 tests au total
- 106 tests unitaires (~1.3s)
- 151 tests d'intégration (~15s)
- 89% de couverture de code

### Tests Frontend

```bash
cd frontend

# Tous les tests (237 tests)
npm run test

# Tests unitaires uniquement (22 tests, rapides ~0.7s)
npm run test:unit

# Tests d'intégration uniquement (215 tests, ~5s)
npm run test:integration

# Avec coverage
npm run test:coverage
```

**Statistiques** : 226 tests au total (100% passants)
- 22 tests unitaires (~0.7s)
- 204 tests d'intégration (~5s)
- **63.6% de couverture globale** (statements)
  - Branches: 84.02%
  - Functions: 68.59%
  - Lines: 63.6%
- 31 suites de tests couvrant composants, hooks et services
- Module `types` exclu de la couverture (types TypeScript uniquement)

## 🔄 CI/CD et Automatisation

Le projet dispose d'un système **CI/CD complet** avec GitHub Actions pour garantir la qualité du code et automatiser les déploiements.

### 📊 Workflows disponibles

#### 1. **Tests automatiques** (Pull Requests et Push)

**Backend Tests** (`backend-tests.yml`)
- Se déclenche sur les modifications dans `backend/`
- Exécute 257 tests avec 89% de couverture
- Service PostgreSQL en CI
- Upload coverage vers Codecov

**Frontend Tests** (`frontend-tests.yml`)
- Se déclenche sur les modifications dans `frontend/`
- Exécute 226 tests (unitaires + intégration) avec 63.6% de couverture
- Linting ESLint
- Build Next.js
- Upload coverage vers Codecov

**CI Complet** (`ci.yml`)
- Teste backend ET frontend en parallèle
- 483 tests au total (257 backend + 226 frontend)
- Bloque les Pull Requests si échec
- Résumé détaillé des résultats

#### 2. **Déploiements automatiques** (Push sur main)

**Frontend Deploy** (`frontend-deploy.yml`)
- ✅ Exécute **tous les tests frontend** d'abord
- ❌ **Bloque le déploiement** si les tests échouent
- ✅ Déploie sur **Vercel** si tests OK
- Notifications de succès/échec

**Backend Deploy** (`backend-deploy.yml`)
- ✅ Exécute **tous les tests backend** d'abord
- ❌ **Bloque le déploiement** si les tests échouent
- ✅ Déploie sur **Railway** si tests OK
- Applique les migrations Alembic automatiquement

### 🔒 Protection de la production

**Aucun code bugué n'atteint la production !**

```
Push sur main → Tests automatiques → Déploiement bloqué si échec ❌
                                   → Déploiement autorisé si succès ✅
```

### 📈 Statistiques des tests en CI

- **Backend** : 257 tests (89% coverage) en ~3 minutes
- **Frontend** : 226 tests (63.6% coverage) en ~2 minutes
- **Total** : 483 tests exécutés automatiquement
- **Durée totale CI** : ~5 minutes

### 🔧 Configuration requise pour le déploiement

Pour activer les déploiements automatiques, configurer les secrets GitHub :

**Vercel (Frontend)**
- `VERCEL_TOKEN` - Token d'authentification Vercel
- `VERCEL_ORG_ID` - ID de l'organisation Vercel
- `VERCEL_PROJECT_ID` - ID du projet Vercel
- `NEXT_PUBLIC_API_URL_PROD` - URL de l'API en production

**Railway (Backend)**
- `RAILWAY_TOKEN` - Token d'authentification Railway

📚 **Documentation complète** : [.github/workflows/README.md](.github/workflows/README.md)

## 🚀 Déploiement

### Déploiement avec Docker

```bash
# Backend
cd backend
docker-compose up -d --build

# Frontend
cd frontend
docker build -t forecast-budget-frontend .
docker run -p 3000:3000 forecast-budget-frontend
```

### Déploiement sur Vercel (Frontend)

```bash
cd frontend
npm run build
vercel --prod
```

### Déploiement sur Railway (Backend)

```bash
cd backend
railway up
```

## 📊 Fonctionnalités techniques

### 🔐 Authentification et sécurité

#### JWT Tokens
- **Access tokens** avec expiration courte
- **Refresh tokens** pour renouvellement automatique
- **Protection des routes** sensibles côté client et serveur
- **Validation des données** avec Pydantic (backend) et TypeScript (frontend)

#### Réinitialisation de mot de passe
La fonctionnalité complète de réinitialisation de mot de passe est disponible :

**Flow utilisateur** :
1. **Accès** : Cliquer sur "Mot de passe oublié ?" depuis la page de connexion ou "Changer le mot de passe" dans les paramètres du compte
2. **Étape 1 - Demande de code** :
   - Entrer l'adresse email du compte
   - Un code à 6 chiffres est généré et envoyé par SMS au numéro de téléphone associé
   - Le code expire après 10 minutes
3. **Étape 2 - Réinitialisation** :
   - Entrer le code reçu par SMS
   - Définir le nouveau mot de passe (minimum 8 caractères)
   - Confirmation du mot de passe
4. **Redirection** : Retour automatique à la page de connexion

**Configuration requise** :
- L'utilisateur doit avoir un numéro de téléphone associé à son compte
- Le numéro peut être ajouté/modifié dans Settings → Account → Informations personnelles
- Format recommandé : international (+33612345678)

**Environnement** :
- **Développement** : Service SMS Mock (codes affichés dans les logs backend)
- **Production** : Service Twilio pour envoi SMS réel

#### Gestion des sessions
- **Multi-sessions** : Un utilisateur peut être connecté sur plusieurs appareils
- **Révocation** : Possibilité de révoquer des sessions spécifiques à distance
- **Suivi** : Affichage de l'IP, user-agent et date de création pour chaque session

### 📈 Prévisions financières

- **Analyse des tendances** historiques
- **Prévisions saisonnières** basées sur les patterns
- **Alertes budgétaires** personnalisables
- **Recommandations** d'optimisation

### 🎨 Interface utilisateur

- **Design system** cohérent
- **Animations fluides** avec CSS transitions
- **Responsive design** mobile-first
- **Accessibilité** optimisée

### ⚡ Performance

- **Lazy loading** des composants
- **Optimisation des images** avec Next.js
- **Cache intelligent** des données
- **Compression** des réponses API

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

### 1. Fork le projet

```bash
git clone https://github.com/Gregson971/forecast_budget.git
```

### 2. Créer une branche

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
```

### 3. Développer

- Suivre les conventions de code
- Ajouter des tests
- Documenter les changements

### 4. Tester

```bash
# Backend
cd backend && pytest

# Frontend
cd frontend && npm run test
```

### 5. Créer une Pull Request

- Description détaillée des changements
- Tests passants
- Documentation mise à jour

## 📚 Documentation

- **[Documentation Backend](./backend/README.md)** - Guide complet du backend
- **[Documentation Frontend](./frontend/README.md)** - Guide complet du frontend
- **[API Documentation](http://localhost:8000/docs)** - Documentation interactive de l'API

## 🛠️ Technologies utilisées

### Frontend

- **Next.js 15** - Framework React avec App Router
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS 4.1** - Framework CSS utilitaire
- **Chart.js** - Graphiques interactifs
- **Axios** - Client HTTP
- **JWT Decode** - Gestion des tokens

### Backend

- **FastAPI** - Framework web Python
- **SQLAlchemy 2.0** - ORM
- **PostgreSQL** - Base de données
- **Alembic** - Migrations
- **Pydantic** - Validation des données
- **JWT** - Authentification
- **Pytest** - Tests (257 tests avec 89% de couverture)
- **Twilio** - Service SMS pour réinitialisation de mot de passe
- **GitHub Actions** - CI/CD automatisé

### DevOps

- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration
- **GitHub** - Versioning
- **Vercel** - Déploiement frontend
- **Railway** - Déploiement backend

## 📈 Roadmap

### 🚀 Version 1.1 (En cours)

- [x] Import des transactions depuis fichiers CSV
- [x] Réinitialisation de mot de passe par SMS
- [ ] Export des données (CSV, PDF)
- [ ] Notifications push
- [ ] Mode hors ligne
- [ ] Synchronisation multi-appareils

### 🔮 Version 1.2 (Planifié)

- [ ] Intégration bancaire
- [ ] Rapports avancés
- [ ] Objectifs financiers
- [ ] Partage de budgets

### 🌟 Version 2.0 (Futur)

- [ ] IA pour recommandations
- [ ] Application mobile native
- [ ] API publique
- [ ] Marketplace d'extensions

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

Pour toute question ou problème :

- **Issues GitHub** : [Ouvrir une issue](https://github.com/Gregson971/forecast_budget/issues)
- **Documentation** : Consulter les README des sous-projets

---

<div align="center">

**Forecast Budget** - Gérez vos finances avec intelligence ✨

[![GitHub stars](https://img.shields.io/github/stars/Gregson971/forecast_budget?style=social)](https://github.com/Gregson971/forecast_budget)
[![GitHub forks](https://img.shields.io/github/forks/Gregson971/forecast_budget?style=social)](https://github.com/Gregson971/forecast_budget)

</div>
