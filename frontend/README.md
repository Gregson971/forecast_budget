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
│   ├── app/                           # Pages et layouts (App Router - Next.js 15)
│   │   ├── auth/                      # Pages d'authentification
│   │   │   ├── login/                 # Page de connexion
│   │   │   └── register/              # Page d'inscription
│   │   ├── transactions/              # Gestion unifiée des transactions
│   │   │   └── page.tsx               # Page des transactions (Server Component)
│   │   ├── forecasts/                 # Prévisions et tableaux de bord
│   │   │   └── page.tsx               # Page des prévisions (Server Component)
│   │   ├── settings/                  # Paramètres utilisateur
│   │   │   ├── account/               # Gestion du profil
│   │   │   │   └── page.tsx           # Page du compte (Server Component)
│   │   │   └── sessions/              # Gestion des sessions
│   │   │       └── page.tsx           # Page des sessions (Server Component)
│   │   ├── about/                     # Page à propos
│   │   ├── layout.tsx                 # Layout principal avec AuthProvider
│   │   ├── page.tsx                   # Page d'accueil
│   │   ├── error.tsx                  # Error boundary global
│   │   └── globals.css                # Styles globaux + Tailwind
│   │
│   ├── components/                    # Composants réutilisables (organisés par fonctionnalité)
│   │   ├── auth/                      # Authentification et protection
│   │   │   ├── AuthForm.tsx           # Formulaire d'authentification
│   │   │   └── ProtectedRoute.tsx     # HOC de protection de routes
│   │   ├── profile/                   # Gestion du profil utilisateur
│   │   │   └── EditProfileForm.tsx    # Formulaire d'édition de profil
│   │   ├── sessions/                  # Gestion des sessions
│   │   │   ├── SessionItem.tsx        # Item de session
│   │   │   └── SessionList.tsx        # Liste des sessions actives
│   │   ├── financial/                 # Composants financiers
│   │   │   ├── FinancialForm.tsx      # Formulaire de transaction
│   │   │   └── FinancialModal.tsx     # Modale de transaction
│   │   ├── transaction/               # Gestion des transactions
│   │   │   ├── TransactionItem.tsx    # Item de transaction
│   │   │   ├── TransactionList.tsx    # Liste des transactions
│   │   │   └── TransactionModal.tsx   # Modale d'ajout/édition
│   │   ├── import/                    # Import de données
│   │   │   └── CSVUploader.tsx        # Upload CSV drag & drop
│   │   ├── navigation/                # Navigation et menu
│   │   │   ├── Navbar.tsx             # Barre de navigation
│   │   │   ├── NavMenu.tsx            # Menu de navigation
│   │   │   ├── MenuItem.tsx           # Item de menu
│   │   │   ├── MobileMenu.tsx         # Menu mobile
│   │   │   └── UserDropdown.tsx       # Dropdown utilisateur
│   │   ├── wrappers/                  # Client Component Wrappers (Server/Client Split)
│   │   │   ├── AccountClientWrapper.tsx      # Wrapper pour la page compte
│   │   │   ├── SessionsClientWrapper.tsx     # Wrapper pour la page sessions
│   │   │   ├── TransactionsClientWrapper.tsx # Wrapper pour la page transactions
│   │   │   └── ForecastsClientWrapper.tsx    # Wrapper pour la page prévisions
│   │   ├── ui/                        # Composants UI de base
│   │   │   ├── Button.tsx             # Bouton réutilisable
│   │   │   ├── Input.tsx              # Input réutilisable
│   │   │   ├── Modal.tsx              # Modale réutilisable
│   │   │   ├── Badge.tsx              # Badge réutilisable
│   │   │   └── ConfirmModal.tsx       # Modale de confirmation
│   │   └── ErrorNotification.tsx      # Notification d'erreur
│   │
│   ├── context/                       # Contextes React
│   │   └── AuthContext.tsx            # Contexte d'authentification global
│   │
│   ├── hooks/                         # Hooks personnalisés
│   │   ├── useTransactions.ts         # Hook pour les transactions unifiées
│   │   ├── useForecast.ts             # Hook pour les prévisions
│   │   └── useSessions.ts             # Hook pour les sessions
│   │
│   ├── services/                      # Services API
│   │   ├── auth.ts                    # Service d'authentification
│   │   ├── expense.ts                 # Service des dépenses
│   │   ├── income.ts                  # Service des revenus
│   │   ├── forecast.ts                # Service des prévisions
│   │   └── import.ts                  # Service d'import CSV
│   │
│   ├── lib/                           # Utilitaires et configurations
│   │   ├── api.ts                     # Configuration Axios + Intercepteurs
│   │   ├── errorHandler.ts            # Gestionnaire d'erreurs centralisé
│   │   └── utils.ts                   # Fonctions utilitaires
│   │
│   └── types/                         # Types TypeScript
│       ├── expense.ts                 # Types pour les dépenses
│       ├── income.ts                  # Types pour les revenus
│       ├── transaction.ts             # Types pour les transactions
│       ├── import.ts                  # Types pour l'import
│       └── financial.ts               # Types financiers généraux
│
├── public/                            # Assets statiques
├── package.json                       # Dépendances et scripts
├── next.config.ts                     # Configuration Next.js
├── tailwind.config.ts                 # Configuration Tailwind CSS 4.1
├── tsconfig.json                      # Configuration TypeScript
└── postcss.config.mjs                 # Configuration PostCSS
```

### Architecture Server/Client Components

L'application utilise l'architecture **Server Components + Client Components** de Next.js 15 pour une performance optimale :

#### Server Components (pages principales)
- Rendu côté serveur pour le SEO et les performances
- Contenu statique (headers, titres, descriptions)
- Zéro JavaScript envoyé au client pour le contenu statique
- Pages : `account`, `sessions`, `transactions`, `forecasts`

#### Client Components (wrappers)
- Logique interactive et gestion d'état
- Hooks React (`useState`, `useEffect`, custom hooks)
- Event handlers et interactions utilisateur
- Localisation : `src/components/wrappers/`

**Pattern utilisé :**
```
Server Component (page.tsx)
├── Header statique (Server)
└── ClientWrapper (Client)
    └── Logique interactive
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

#### 👤 Profil utilisateur (`/settings/account`)
- **Édition du profil** : Modification du prénom, nom et email
- **Interface intuitive** : Mode vue/édition avec bouton "Modifier"
- **Validation en temps réel** : Mise à jour uniquement des champs modifiés
- **Avatar dynamique** : Initiales colorées générées automatiquement
- **Actions futures** : Changement de mot de passe et suppression de compte (à venir)
- **Lien rapide** : Accès aux sessions actives depuis la page profil

#### 🔐 Gestion des sessions (`/settings/sessions`)
- **Visualisation** : Liste de toutes les sessions actives
- **Informations détaillées** : User agent, IP, date de création
- **Session courante** : Badge "Appareil actuel" pour identifier la session en cours
- **Révocation** : Déconnexion à distance des autres sessions
- **Sécurité** : Gestion complète des accès à votre compte

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

#### Authentification & Utilisateur
- `POST /auth/login` - Connexion utilisateur
- `POST /auth/register` - Inscription utilisateur
- `POST /auth/refresh` - Rafraîchir le token JWT
- `GET /auth/me` - Récupérer le profil utilisateur
- `PUT /users/me` - Mettre à jour le profil utilisateur (prénom, nom, email)

#### Sessions
- `GET /auth/me/sessions` - Liste des sessions actives
- `DELETE /auth/me/sessions/{session_id}` - Révoquer une session

#### Dépenses
- `GET /expenses/` - Liste des dépenses (avec filtres)
- `POST /expenses/` - Créer une dépense
- `PUT /expenses/{expense_id}` - Modifier une dépense
- `DELETE /expenses/{expense_id}` - Supprimer une dépense

#### Revenus
- `GET /incomes/` - Liste des revenus (avec filtres)
- `POST /incomes/` - Créer un revenu
- `PUT /incomes/{income_id}` - Modifier un revenu
- `DELETE /incomes/{income_id}` - Supprimer un revenu

#### Prévisions & Import
- `GET /forecast/` - Prévisions budgétaires (par période)
- `POST /imports/csv` - Importer des transactions depuis CSV

## 🧪 Tests

L'application utilise **Jest 30.2.0** et **React Testing Library 16.3.0** pour une couverture de tests complète.

### Infrastructure de tests

- **Framework** : Jest avec environnement jsdom
- **Bibliothèque de tests** : React Testing Library (RTL)
- **Utilitaires** : @testing-library/user-event, @testing-library/jest-dom
- **Configuration** : jest.config.ts, jest.setup.ts
- **Statistiques** : 226 tests (100% passants)
  - 22 tests unitaires (~0.7s)
  - 204 tests d'intégration (~5s)
  - **63.6% de couverture globale** (statements: 63.6%, branches: 84.02%, functions: 68.59%, lines: 63.6%)
  - Module `types` exclu de la couverture (types TypeScript uniquement)

### Structure des tests

Les tests sont organisés en **tests unitaires** et **tests d'intégration** pour une meilleure maintenabilité :

```
tests/
├── unit/                           # Tests unitaires (22 tests)
│   ├── services/                   # Tests des services API
│   │   ├── auth.test.ts            # Authentification (7 tests)
│   │   ├── expense.test.ts         # Service des dépenses (6 tests)
│   │   ├── forecast.test.ts        # Service des prévisions (3 tests)
│   │   ├── import.test.ts          # Service d'import CSV (4 tests)
│   │   └── income.test.ts          # Service des revenus (5 tests)
│   └── utils/                      # Tests des utilitaires
│       └── errorHandler.test.ts   # Gestionnaire d'erreurs (17 tests)
│
└── integration/                    # Tests d'intégration (204 tests)
    ├── components/                 # Tests des composants React
    │   ├── ui/                     # Composants UI de base
    │   │   ├── Button.test.tsx     # Button (6 tests)
    │   │   ├── Input.test.tsx      # Input (7 tests)
    │   │   ├── Modal.test.tsx      # Modal (7 tests)
    │   │   └── ConfirmModal.test.tsx # ConfirmModal (7 tests)
    │   ├── auth/                   # Authentification
    │   │   └── ProtectedRoute.test.tsx # Protection de routes (6 tests)
    │   ├── sessions/               # Gestion des sessions
    │   │   ├── SessionItem.test.tsx    # Item de session (7 tests)
    │   │   └── SessionList.test.tsx    # Liste des sessions (6 tests)
    │   ├── navigation/             # Navigation
    │   │   ├── MenuItem.test.tsx       # Item de menu (4 tests)
    │   │   ├── NavMenu.test.tsx        # Menu desktop (3 tests)
    │   │   ├── MobileMenu.test.tsx     # Menu mobile (6 tests)
    │   │   ├── UserDropdown.test.tsx   # Dropdown utilisateur (5 tests)
    │   │   └── Navbar.test.tsx         # Barre de navigation (5 tests)
    │   ├── transaction/            # Transactions
    │   │   ├── TransactionItem.test.tsx    # Item de transaction (8 tests)
    │   │   ├── TransactionList.test.tsx    # Liste des transactions (6 tests)
    │   │   └── TransactionModal.test.tsx   # Modal de transaction (5 tests)
    │   └── financial/              # Composants financiers
    │       └── FinancialModal.test.tsx     # Modal financière (5 tests)
    ├── hooks/                      # Tests des custom hooks
    │   ├── useSessions.test.ts     # Hook sessions (4 tests)
    │   ├── useExpenses.test.ts     # Hook dépenses (4 tests)
    │   ├── useIncomes.test.ts      # Hook revenus (4 tests)
    │   ├── useForecast.test.ts     # Hook prévisions (3 tests)
    │   ├── useTransactions.test.ts # Hook transactions (2 tests)
    │   └── index.test.ts           # Hook composite (3 tests)
    └── context/                    # Tests des contextes
        └── AuthContext.test.tsx    # Contexte d'authentification (5 tests)
```

### Tests par catégorie

#### Tests unitaires (22 tests)

**Services API** (25 tests)
- `auth.test.ts` : Authentification (7 tests) - Login, register, refresh, getUserService, updateUserService
- `expense.test.ts` : Gestion des dépenses (6 tests) - CRUD complet, gestion d'erreurs
- `forecast.test.ts` : Prévisions financières (3 tests) - Récupération et gestion d'erreurs
- `import.test.ts` : Import CSV (4 tests) - Upload de fichiers, détection de doublons
- `income.test.ts` : Gestion des revenus (5 tests) - CRUD complet, gestion d'erreurs

**Utilitaires** (17 tests)
- `errorHandler.test.ts` : Gestionnaire d'erreurs centralisé
  - handleError, handleCrudError, handleSilentError
  - Catégorisation des erreurs (Network, Auth, Validation, Server, Unknown)

> **Note** : Le module `types` est exclu des tests car il contient uniquement des définitions TypeScript et des helpers de type.

#### Tests d'intégration (204 tests)

**Composants UI** (27 tests)
- `Button.test.tsx` : Bouton réutilisable (6 tests)
- `Input.test.tsx` : Input avec validation (7 tests)
- `Modal.test.tsx` : Modal de base (7 tests)
- `ConfirmModal.test.tsx` : Modal de confirmation (7 tests)

**Composants d'authentification** (6 tests)
- `ProtectedRoute.test.tsx` : Protection de routes (6 tests)

**Composants de navigation** (23 tests)
- `MenuItem.test.tsx` : Item de menu (4 tests)
- `NavMenu.test.tsx` : Menu desktop (3 tests)
- `MobileMenu.test.tsx` : Menu mobile (6 tests)
- `UserDropdown.test.tsx` : Dropdown utilisateur (5 tests)
- `Navbar.test.tsx` : Barre de navigation (5 tests)

**Composants de sessions** (13 tests)
- `SessionItem.test.tsx` : Item de session (7 tests)
- `SessionList.test.tsx` : Liste des sessions (6 tests)

**Composants de transactions** (19 tests)
- `TransactionItem.test.tsx` : Item de transaction (8 tests)
- `TransactionList.test.tsx` : Liste des transactions (6 tests)
- `TransactionModal.test.tsx` : Modal de transaction (5 tests)

**Composants financiers** (5 tests)
- `FinancialModal.test.tsx` : Modal financière (5 tests)

**Hooks personnalisés** (20 tests)
- `useSessions.test.ts` : Gestion des sessions (4 tests)
- `useExpenses.test.ts` : Gestion des dépenses (4 tests)
- `useIncomes.test.ts` : Gestion des revenus (4 tests)
- `useForecast.test.ts` : Prévisions (3 tests)
- `useTransactions.test.ts` : Transactions unifiées (2 tests)
- `index.test.ts` : Hook composite useAppHooks (3 tests)

**Contextes React** (5 tests)
- `AuthContext.test.tsx` : Contexte d'authentification (5 tests)
  - Login, logout, refresh token, persistence, initialization

### Scripts de tests disponibles

```bash
# Exécuter tous les tests (226 tests, 100% passants)
npm run test

# Tests unitaires uniquement (22 tests, rapides ~0.7s)
npm run test:unit

# Tests d'intégration uniquement (204 tests, ~5s)
npm run test:integration

# Tests en mode watch (re-exécution automatique)
npm run test:watch

# Tests avec rapport de couverture de code (63.6% de couverture)
npm run test:coverage

# Tests avec sortie détaillée
npm run test:ui

# Exécuter des tests spécifiques
npm run test -- tests/unit/services/auth.test.ts
npm run test -- tests/integration/components/ui/Button.test.tsx
npm run test -- tests/integration/hooks/useSessions.test.ts
npm run test -- --testPathPattern=hooks
npm run test -- --testNamePattern="handles fetch error"
```

### Configuration Jest

**jest.config.ts**
- Environnement jsdom pour simuler le DOM
- Module mapper pour les alias TypeScript (`@/`)
- Seuils de couverture mis à jour :
  - Statements: 60%
  - Branches: 80%
  - Functions: 65%
  - Lines: 60%
- Exclusions : fichiers .d.ts, stories, app/ directory, **types/ directory**
- Couverture actuelle : 63.6% (statements), 84.02% (branches), 68.59% (functions), 63.6% (lines)

**jest.setup.ts**
- Mocks globaux : Next.js router, localStorage, matchMedia, IntersectionObserver
- Configuration de @testing-library/jest-dom
- Gestion des rejets de promesses non gérées

### Bonnes pratiques de test

```typescript
// Test d'un composant UI
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('handles user interaction', async () => {
  const user = userEvent.setup();
  const handleClick = jest.fn();

  render(<Button onClick={handleClick}>Click me</Button>);

  await user.click(screen.getByRole('button'));

  expect(handleClick).toHaveBeenCalled();
});

// Test d'un hook personnalisé
import { renderHook, waitFor, act } from '@testing-library/react';

it('fetches data on mount', async () => {
  const { result } = renderHook(() => useCustomHook());

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.data).toBeDefined();
});

// Test d'un service API
jest.mock('@/lib/api');
const mockedApi = api as jest.Mocked<typeof api>;

it('calls API with correct parameters', async () => {
  mockedApi.get.mockResolvedValue({ data: mockData });

  const result = await getDataService();

  expect(result).toEqual(mockData);
  expect(mockedApi.get).toHaveBeenCalledWith('/endpoint');
});
```

### Couverture de code

Exécutez les tests avec couverture pour voir les métriques détaillées :

```bash
npm run test:coverage
```

Le rapport de couverture sera généré dans `coverage/` avec :
- Rapport HTML interactif dans `coverage/lcov-report/index.html`
- Résumé dans la console
- **Couverture actuelle : 63.6%** (dépasse l'objectif de 60%)

**Métriques de couverture :**
- **Statements** : 63.6% (seuil: 60%) ✅
- **Branches** : 84.02% (seuil: 80%) ✅
- **Functions** : 68.59% (seuil: 65%) ✅
- **Lines** : 63.6% (seuil: 60%) ✅

**Objectif à terme :** 80% de couverture sur tous les critères

> **Note** : Le module `types/` est exclu de la couverture car il contient principalement des définitions TypeScript et des types d'interface.

### Mocking et utilitaires

**Mocks globaux disponibles** :
- `localStorage` : Mock complet avec getItem, setItem, removeItem
- `next/navigation` : useRouter, usePathname, useSearchParams
- `window.matchMedia` : Pour les tests de media queries
- `IntersectionObserver` : Pour les tests de lazy loading

**Helpers de test** :
- `@testing-library/jest-dom` : Matchers personnalisés (toBeInTheDocument, toHaveValue, etc.)
- `@testing-library/user-event` : Simulation d'interactions utilisateur réalistes
- `waitFor` : Attendre des changements asynchrones
- `act` : Wrapper pour les mises à jour d'état React

### Ajouter de nouveaux tests

Pour tester un nouveau composant ou hook :

1. Créer un fichier de test dans le répertoire approprié
2. Importer les utilitaires de test nécessaires
3. Mocker les dépendances externes (API, contextes, etc.)
4. Écrire des tests descriptifs avec `describe` et `it`
5. Utiliser `render`, `renderHook`, `screen`, `waitFor` selon le besoin
6. Vérifier avec `npm run test`

**Exemple de nouveau test** :

```typescript
// tests/components/ui/NewComponent.test.tsx
import { render, screen } from '@testing-library/react';
import NewComponent from '@/components/ui/NewComponent';

describe('NewComponent', () => {
  it('renders correctly', () => {
    render(<NewComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Documentation complète

Pour plus d'informations sur les tests, consultez :
- `tests/README.md` - Guide détaillé des tests avec exemples
- Documentation Jest : https://jestjs.io/
- Documentation RTL : https://testing-library.com/react

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
