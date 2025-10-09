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

- **Suivi des dépenses** avec catégories et filtres
- **Gestion des revenus** avec sources multiples
- **Historique détaillé** avec recherche et tri
- **Import CSV** depuis exports bancaires (Boursorama, etc.)
- **Export des données** (à venir)

### 📊 Analyses et prévisions

- **Tableaux de bord** interactifs
- **Graphiques** des dépenses et revenus
- **Prévisions budgétaires** basées sur l'IA
- **Tendances** et analyses comportementales

### 🔐 Sécurité et utilisateur

- **Authentification sécurisée** avec JWT
- **Gestion des sessions** multiples
- **Profil utilisateur** personnalisable
- **Protection des données** privées

### 🎨 Interface utilisateur

- **Design moderne** avec glassmorphism
- **Mode sombre** par défaut
- **Responsive design** pour tous les appareils
- **Animations fluides** et transitions

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
│   ├── tests/                  # Tests unitaires
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
pytest
pytest --cov=app
```

### Tests Frontend

```bash
cd frontend
npm run test
npm run test:coverage
```

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

### 🔐 Authentification

- **JWT Tokens** avec refresh automatique
- **Gestion des sessions** multiples
- **Protection des routes** sensibles
- **Validation des données** côté client et serveur

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
- **Pytest** - Tests

### DevOps

- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration
- **GitHub** - Versioning
- **Vercel** - Déploiement frontend
- **Railway** - Déploiement backend

## 📈 Roadmap

### 🚀 Version 1.1 (En cours)

- [x] Import des transactions depuis fichiers CSV
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
