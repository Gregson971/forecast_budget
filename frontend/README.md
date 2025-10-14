# Forecast Budget - Frontend

## 📋 Description

Ceci est le frontend pour l'application **Forecast Budget**, une interface moderne et intuitive pour la gestion de budget avec prévisions financières. Développé avec Next.js 15, React 19 et Tailwind CSS, cette application offre une expérience utilisateur exceptionnelle pour gérer vos finances personnelles.

## ✨ Fonctionnalités

- 🎨 **Interface Material UI** sobre et lisible avec système d'élévation
- 📱 **Responsive design** optimisé pour tous les appareils
- 🔐 **Authentification sécurisée** avec JWT
- 💰 **Gestion unifiée des transactions** (dépenses et revenus) en une seule page
- 📅 **Filtres avancés** par type, mois et année
- 📄 **Pagination intelligente** (20 transactions par page)
- 📊 **Tableaux de bord** avec graphiques interactifs Chart.js
- 📥 **Import CSV** avec drag & drop depuis exports bancaires
- 🔄 **Synchronisation temps réel** avec l'API backend
- 🌙 **Mode sombre Material UI** par défaut
- ⚡ **Performance optimisée** avec Next.js 15 et Turbopack
- 🛡️ **Gestion d'erreurs centralisée** avec error handler et notifications toast (Sonner)
- 🚨 **Error boundary Next.js** pour capturer les erreurs de rendu React
- 📝 **Logs en développement** uniquement pour une meilleure expérience de débogage

## 🛠️ Technologies utilisées

- **Framework** : Next.js 15 avec App Router
- **UI Library** : React 19
- **Styling** : Tailwind CSS 4.1
- **Charts** : Chart.js + React Chart.js 2
- **HTTP Client** : Axios
- **Authentication** : JWT avec jwt-decode
- **Notifications** : Sonner
- **Date handling** : date-fns
- **TypeScript** : Support complet

## 🚀 Installation et Démarrage

### Prérequis

- **Node.js** 18.17+
- **npm** ou **yarn** ou **pnpm**
- **Backend API** en cours d'exécution (voir [README backend](../backend/README.md))

### Installation

#### 1. Cloner le dépôt

```bash
git clone https://github.com/Gregson971/forecast_budget.git
cd forecast_budget/frontend
```

#### 2. Installer les dépendances

```bash
# Avec npm
npm install

# Avec yarn
yarn install

# Avec pnpm
pnpm install
```

#### 3. Configuration de l'environnement

```bash
# Copier le fichier d'environnement
cp .env.example .env.local

# Éditer les variables d'environnement
nano .env.local
```

#### Variables d'environnement

```env
# URL de l'API backend
NEXT_PUBLIC_API_URL=http://localhost:8000

# URL de l'application (optionnel)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### 4. Démarrer l'application

```bash
# Mode développement avec Turbopack
npm run dev

# Ou avec yarn
yarn dev

# Ou avec pnpm
pnpm dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
frontend/
├── src/
│   ├── app/                     # Pages et layouts (App Router)
│   │   ├── auth/                # Pages d'authentification
│   │   │   ├── login/           # Page de connexion
│   │   │   └── register/        # Page d'inscription
│   │   ├── expenses/            # Gestion des dépenses
│   │   ├── incomes/             # Gestion des revenus
│   │   ├── forecasts/           # Prévisions et tableaux de bord
│   │   ├── import/              # Import de transactions CSV
│   │   ├── settings/            # Paramètres utilisateur
│   │   │   └── sessions/        # Gestion des sessions
│   │   ├── about/               # Page à propos
│   │   ├── layout.tsx           # Layout principal
│   │   ├── page.tsx             # Page d'accueil
│   │   ├── error.tsx            # Error boundary global
│   │   └── globals.css          # Styles globaux
│   ├── components/              # Composants réutilisables
│   │   ├── ui/                  # Composants UI de base
│   │   ├── navigation/          # Navigation et menu
│   │   ├── expense/             # Composants pour les dépenses
│   │   ├── income/              # Composants pour les revenus
│   │   ├── financial/           # Composants financiers
│   │   ├── import/              # Composants pour l'import CSV
│   │   │   └── CSVUploader.tsx  # Composant d'upload CSV
│   │   ├── AuthForm.tsx         # Formulaire d'authentification
│   │   ├── ProtectedRoute.tsx   # Protection des routes
│   │   └── ErrorNotification.tsx # Notifications d'erreur
│   ├── context/                 # Contextes React
│   │   └── AuthContext.tsx      # Contexte d'authentification
│   ├── hooks/                   # Hooks personnalisés
│   │   ├── useExpenses.ts       # Hook pour les dépenses
│   │   ├── useIncomes.ts        # Hook pour les revenus
│   │   ├── useForecast.ts       # Hook pour les prévisions
│   │   └── useSessions.ts       # Hook pour les sessions
│   ├── services/                # Services API
│   │   ├── auth.ts              # Service d'authentification
│   │   ├── expense.ts           # Service des dépenses
│   │   ├── income.ts            # Service des revenus
│   │   ├── forecast.ts          # Service des prévisions
│   │   └── import.ts            # Service d'import CSV
│   ├── lib/                     # Utilitaires et configurations
│   │   ├── api.ts               # Configuration Axios
│   │   ├── errorHandler.ts      # Gestionnaire d'erreurs centralisé
│   │   └── utils.ts             # Fonctions utilitaires
│   └── types/                   # Types TypeScript
│       ├── expense.ts           # Types pour les dépenses
│       ├── income.ts            # Types pour les revenus
│       ├── import.ts            # Types pour l'import
│       └── financial.ts         # Types financiers généraux
├── public/                      # Assets statiques
├── package.json                 # Dépendances et scripts
├── next.config.ts               # Configuration Next.js
├── tailwind.config.ts           # Configuration Tailwind
├── tsconfig.json                # Configuration TypeScript
└── postcss.config.mjs           # Configuration PostCSS
```

## 🎨 Design System

### Thème et couleurs

L'application utilise un design system moderne avec :

- **Mode sombre** par défaut avec glassmorphism
- **Palette de couleurs** cohérente et accessible
- **Animations fluides** avec CSS transitions
- **Typographie** optimisée pour la lisibilité

### Composants UI

- **Boutons** avec états hover et focus
- **Modales** avec backdrop blur
- **Formulaires** avec validation
- **Tableaux** responsifs
- **Graphiques** interactifs

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev          # Démarrer le serveur de développement
npm run build        # Construire pour la production
npm run start        # Démarrer le serveur de production
npm run lint         # Vérifier le code avec ESLint

# Tests (à implémenter)
npm run test         # Exécuter les tests
npm run test:watch   # Tests en mode watch
npm run test:coverage # Tests avec couverture
```

## 📱 Pages et Fonctionnalités

### 🏠 Page d'accueil

- Présentation de l'application
- Navigation vers les principales fonctionnalités
- Design moderne avec animations

### 🔐 Authentification

- **Connexion** : Formulaire de connexion sécurisé
- **Inscription** : Création de compte utilisateur
- **Gestion des sessions** : Visualisation et révocation

### 💰 Gestion des transactions (Page unifiée)

- **Liste unifiée** de toutes les transactions (dépenses et revenus)
- **Filtres intelligents** :
  - Par type (toutes, dépenses, revenus)
  - Par mois (1-12)
  - Par année
- **Pagination** : 20 transactions par page
- **Actions rapides** : Modifier ou supprimer directement depuis la liste
- **Ajout simplifié** : Modales dédiées pour dépenses et revenus
- **Design épuré** : Tableau Material UI avec système d'élévation

### 📊 Prévisions et tableaux de bord

- **Graphiques interactifs** des dépenses/revenus
- **Prévisions budgétaires** basées sur l'historique
- **Tableaux de bord** personnalisés
- **Export des données** (à implémenter)

### 📥 Import CSV

- **Upload drag & drop** de fichiers CSV
- **Détection automatique** des doublons
- **Catégorisation intelligente** des transactions
- **Statistiques d'import** en temps réel (succès, erreurs, ignorés)
- **Support multi-formats** d'exports bancaires

### ⚙️ Paramètres

- **Profil utilisateur** : Modification des informations
- **Gestion des sessions** : Sessions actives et révocation
- **Préférences** : Configuration de l'application

## 🛡️ Gestion des erreurs

L'application utilise un système de gestion d'erreurs centralisé pour une meilleure expérience utilisateur.

### Error Handler (`src/lib/errorHandler.ts`)

Le gestionnaire d'erreurs centralisé offre trois types de handlers :

```typescript
// Handler standard - Affiche une notification toast
handleError(error, {
  showToast: true,  // Afficher une notification (défaut: true)
  context: 'Login'  // Contexte de l'erreur
})

// Handler CRUD - Pour les opérations Create, Read, Update, Delete
handleCrudError('create', 'expense', error)
handleCrudError('delete', 'income', error)

// Handler silencieux - Logs uniquement (pas de toast)
handleSilentError(error)
```

**Fonctionnalités** :
- Catégorisation automatique des erreurs (Network, Authentication, Validation, Server, Unknown)
- Logs en développement uniquement (`NODE_ENV === 'development'`)
- Messages d'erreur traduits en français
- Notifications toast avec Sonner

### Error Boundary (`src/app/error.tsx`)

Page d'erreur globale Next.js qui capture toutes les erreurs de rendu React :

- **Mode développement** : Affiche les détails de l'erreur avec stack trace
- **Mode production** : Interface utilisateur propre et user-friendly
- Boutons "Réessayer" et "Retour à l'accueil"
- Design cohérent avec le reste de l'application

## 🔌 Intégration API

### Configuration Axios

```typescript
// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Endpoints utilisés

- `POST /auth/login` - Connexion utilisateur
- `POST /auth/register` - Inscription utilisateur
- `POST /auth/refresh` - Rafraîchir le token JWT
- `GET /auth/me` - Profil utilisateur
- `GET /auth/me/sessions` - Liste des sessions
- `DELETE /auth/me/sessions/{session_id}` - Révoquer une session
- `GET /expenses/` - Liste des dépenses
- `POST /expenses/` - Créer une dépense
- `PUT /expenses/{expense_id}` - Modifier une dépense
- `DELETE /expenses/{expense_id}` - Supprimer une dépense
- `GET /incomes/` - Liste des revenus
- `POST /incomes/` - Créer un revenu
- `PUT /incomes/{income_id}` - Modifier un revenu
- `DELETE /incomes/{income_id}` - Supprimer un revenu
- `GET /forecast/` - Prévisions budgétaires
- `POST /imports/csv` - Importer des transactions depuis CSV

## 🧪 Tests

### Structure des tests

```
tests/
├── components/           # Tests des composants
├── pages/               # Tests des pages
├── hooks/               # Tests des hooks
├── services/            # Tests des services
└── utils/               # Tests des utilitaires
```

### Exécution des tests

```bash
# Tous les tests
npm run test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:coverage

# Tests spécifiques
npm run test -- --testPathPattern=components
```

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Déployer en production
vercel --prod
```

### Autres plateformes

#### Netlify

```bash
# Build
npm run build

# Déployer le dossier .next
```

#### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🛠️ Développement

### Outils recommandés

- **VS Code** avec extensions :
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Importer

### Workflow de développement

1. **Créer une branche** pour votre fonctionnalité
2. **Développer** avec les tests
3. **Formater** le code avec Prettier
4. **Vérifier** avec ESLint
5. **Tester** les fonctionnalités
6. **Créer une PR** avec description détaillée

### Variables d'environnement de développement

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Debug
NEXT_PUBLIC_DEBUG=true

# Analytics (optionnel)
NEXT_PUBLIC_GA_ID=your_ga_id
```

## 🔧 Dépannage

### Problèmes courants

#### Erreur de connexion à l'API

```bash
# Vérifier que le backend est démarré
curl http://localhost:8000/

# Vérifier les variables d'environnement
echo $NEXT_PUBLIC_API_URL
```

#### Erreur de build

```bash
# Nettoyer le cache
rm -rf .next
npm run build
```

#### Problème de dépendances

```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

#### Erreurs non gérées affichées dans la console

Les erreurs sont maintenant gérées de manière centralisée :
- Les logs apparaissent uniquement en mode développement
- Les notifications toast s'affichent pour informer l'utilisateur
- Les erreurs critiques sont capturées par l'error boundary

Pour déboguer :
```bash
# Vérifier les logs de développement
npm run dev
# Ouvrir la console du navigateur (F12)
```

#### Erreur 500 sur `/incomes`

Si vous obtenez une erreur 500 sur l'endpoint `/incomes`, vérifiez que :
```bash
# La table incomes existe dans la base de données backend
cd ../backend
docker compose exec postgres psql -U postgres -d forecast_budget -c "\dt"

# Si la table n'existe pas, appliquez les migrations
docker compose exec api alembic upgrade head
```

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](../LICENSE) pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

### Guidelines de contribution

- Suivre les conventions de nommage
- Ajouter des tests pour les nouvelles fonctionnalités
- Maintenir la cohérence du design
- Documenter les nouvelles APIs

## 📞 Support

Pour toute question ou problème :

- Ouvrir une issue sur GitHub
- Consulter la documentation Next.js
- Vérifier les logs de développement
- Contacter l'équipe de développement

## 🔗 Liens utiles

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Documentation Chart.js](https://www.chartjs.org/docs/)
- [Documentation React](https://react.dev/)
