# Tests Frontend - Forecast Budget

Ce dossier contient tous les tests pour l'application frontend Forecast Budget, organisés en **tests unitaires** et **tests d'intégration**.

## 📊 Statistiques Globales

- **226 tests au total** (100% passants) ✅
- **63.6% de couverture globale**
  - Statements: 63.6% (seuil: 60%) ✅
  - Branches: 84.02% (seuil: 80%) ✅
  - Functions: 68.59% (seuil: 65%) ✅
  - Lines: 63.6% (seuil: 60%) ✅
- **31 suites de tests**
- Temps d'exécution total: ~5s
- **Module `types` exclu** de la couverture (types TypeScript uniquement)

## 📁 Structure des Tests

Les tests sont organisés en deux catégories principales :

```
tests/
├── unit/                           # Tests unitaires (22 tests, ~0.7s)
│   ├── services/                   # Tests des services API
│   │   ├── auth.test.ts            # Authentification (7 tests)
│   │   ├── expense.test.ts         # Service des dépenses (6 tests)
│   │   ├── forecast.test.ts        # Service des prévisions (3 tests)
│   │   ├── import.test.ts          # Service d'import CSV (4 tests)
│   │   └── income.test.ts          # Service des revenus (5 tests)
│   └── utils/                      # Tests des utilitaires
│       └── errorHandler.test.ts   # Gestionnaire d'erreurs (17 tests)
│
├── integration/                    # Tests d'intégration (204 tests, ~5s)
│   ├── components/                 # Tests des composants React
│   │   ├── ui/                     # Composants UI de base
│   │   │   ├── Button.test.tsx     # Button (6 tests)
│   │   │   ├── Input.test.tsx      # Input (7 tests)
│   │   │   ├── Modal.test.tsx      # Modal (7 tests)
│   │   │   └── ConfirmModal.test.tsx # ConfirmModal (7 tests)
│   │   ├── auth/                   # Authentification
│   │   │   └── ProtectedRoute.test.tsx # Protection de routes (6 tests)
│   │   ├── sessions/               # Gestion des sessions
│   │   │   ├── SessionItem.test.tsx    # Item de session (7 tests)
│   │   │   └── SessionList.test.tsx    # Liste des sessions (6 tests)
│   │   ├── navigation/             # Navigation
│   │   │   ├── MenuItem.test.tsx       # Item de menu (4 tests)
│   │   │   ├── NavMenu.test.tsx        # Menu desktop (3 tests)
│   │   │   ├── MobileMenu.test.tsx     # Menu mobile (6 tests)
│   │   │   ├── UserDropdown.test.tsx   # Dropdown utilisateur (5 tests)
│   │   │   └── Navbar.test.tsx         # Barre de navigation (5 tests)
│   │   ├── transaction/            # Transactions
│   │   │   ├── TransactionItem.test.tsx    # Item de transaction (8 tests)
│   │   │   ├── TransactionList.test.tsx    # Liste des transactions (6 tests)
│   │   │   └── TransactionModal.test.tsx   # Modal de transaction (5 tests)
│   │   └── financial/              # Composants financiers
│   │       └── FinancialModal.test.tsx     # Modal financière (5 tests)
│   ├── hooks/                      # Tests des custom hooks
│   │   ├── useSessions.test.ts     # Hook sessions (4 tests)
│   │   ├── useExpenses.test.ts     # Hook dépenses (4 tests)
│   │   ├── useIncomes.test.ts      # Hook revenus (4 tests)
│   │   ├── useForecast.test.ts     # Hook prévisions (3 tests)
│   │   ├── useTransactions.test.ts # Hook transactions (2 tests)
│   │   └── index.test.ts           # Hook composite (3 tests)
│   └── context/                    # Tests des contextes
│       └── AuthContext.test.tsx    # Contexte d'authentification (5 tests)
│
└── README.md                       # Ce fichier
```

### Distinction Unitaires vs Intégration

**Tests unitaires** (`tests/unit/`)
- Testent des fonctions ou modules isolés
- Aucune dépendance au DOM ou à React
- Services API, utilitaires, helpers
- Très rapides (< 1s)

**Tests d'intégration** (`tests/integration/`)
- Testent des composants React rendus
- Testent des hooks avec effets de bord
- Testent des interactions utilisateur
- Peuvent être plus lents (utilisation du DOM virtuel)

## 🛠️ Technologies Utilisées

- **Jest** - Framework de test
- **React Testing Library (RTL)** - Tests de composants React
- **@testing-library/user-event** - Simulation d'interactions utilisateur
- **@testing-library/jest-dom** - Matchers personnalisés pour le DOM

## 🚀 Commandes de Test

### Exécuter tous les tests (226 tests)
```bash
npm test
```

### Tests unitaires uniquement (22 tests, ~0.7s)
```bash
npm run test:unit
```

### Tests d'intégration uniquement (204 tests, ~5s)
```bash
npm run test:integration
```

### Mode watch (développement)
```bash
npm run test:watch
```

### Génération de couverture de code
```bash
npm run test:coverage
```

### Mode verbeux avec watch
```bash
npm run test:ui
```

### Exécuter un test spécifique
```bash
npm test -- tests/unit/services/auth.test.ts
npm test -- tests/integration/components/ui/Button.test.tsx
```

### Exécuter les tests d'un dossier
```bash
npm test -- tests/unit
npm test -- tests/integration/components
```

## 📝 Conventions de Tests

### Nommage des fichiers
- Les tests doivent être nommés `*.test.ts` ou `*.test.tsx`
- Exemple: `Button.test.tsx`, `useSessions.test.ts`

### Structure d'un test

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentName from '@/components/ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    const handleClick = jest.fn();
    render(<ComponentName onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Bonnes pratiques

1. **Utiliser `screen` pour les queries**
   ```typescript
   // ✅ Bon
   screen.getByRole('button', { name: /submit/i })

   // ❌ Éviter
   const { getByRole } = render(<Component />)
   ```

2. **Préférer les queries par rôle et texte**
   ```typescript
   // ✅ Bon
   screen.getByRole('button')
   screen.getByText(/click me/i)

   // ❌ Éviter
   screen.getByTestId('submit-button')
   ```

3. **Utiliser `userEvent` pour les interactions**
   ```typescript
   import userEvent from '@testing-library/user-event';

   const user = userEvent.setup();
   await user.click(screen.getByRole('button'));
   await user.type(screen.getByRole('textbox'), 'Hello');
   ```

4. **Nettoyer après chaque test**
   ```typescript
   afterEach(() => {
     jest.clearAllMocks();
   });
   ```

5. **Mock les dépendances externes**
   ```typescript
   jest.mock('@/services/auth');
   jest.mock('next/navigation');
   ```

## 🧪 Types de Tests

### 1. Tests de Composants

Tests des composants React avec RTL.

**Exemple:** `tests/components/ui/Button.test.tsx`

```typescript
describe('Button Component', () => {
  it('renders with children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### 2. Tests de Hooks

Tests des hooks personnalisés avec `renderHook`.

**Exemple:** `tests/hooks/useSessions.test.ts`

```typescript
import { renderHook, waitFor } from '@testing-library/react';

describe('useSessions Hook', () => {
  it('fetches sessions on mount', async () => {
    const { result } = renderHook(() => useSessions());

    await waitFor(() => {
      expect(result.current.sessions).toHaveLength(2);
    });
  });
});
```

### 3. Tests de Services

Tests des appels API et services.

**Exemple:** `tests/services/auth.test.ts`

```typescript
jest.mock('@/lib/api');

describe('Auth Service', () => {
  it('calls login endpoint with correct data', async () => {
    const result = await loginService('email@test.com', 'password');
    expect(result).toHaveProperty('access_token');
  });
});
```

### 4. Tests d'Utilitaires

Tests des fonctions utilitaires.

**Exemple:** `tests/utils/errorHandler.test.ts`

```typescript
describe('Error Handler', () => {
  it('identifies network errors', () => {
    const result = handleError(networkError);
    expect(result.type).toBe(ErrorType.NETWORK);
  });
});
```

## 📊 Couverture de Code

### Couverture actuelle ✅

- **Statements** : 63.6% (seuil: 60%) ✅
- **Branches** : 84.02% (seuil: 80%) ✅
- **Functions** : 68.59% (seuil: 65%) ✅
- **Lines** : 63.6% (seuil: 60%) ✅

**Tous les seuils sont atteints !** 🎉

> **Note** : Le module `types/` est exclu de la couverture car il contient principalement des définitions TypeScript et des types d'interface.

Les objectifs de couverture sont définis dans `jest.config.ts` :

```typescript
coverageThreshold: {
  global: {
    statements: 60,
    branches: 80,
    functions: 65,
    lines: 60,
  },
}
```

**Objectif à terme :** 80% de couverture sur tous les critères

### Voir le rapport de couverture

```bash
npm run test:coverage
```

Le rapport HTML sera généré dans `coverage/lcov-report/index.html`.

## 🔧 Configuration

### jest.config.ts

Configuration principale de Jest pour Next.js 15.

### jest.setup.ts

Fichier de setup exécuté avant chaque test :
- Import de `@testing-library/jest-dom`
- Mocks de `next/navigation`
- Mocks de `window.matchMedia`
- Mocks de `localStorage`
- Mocks de `IntersectionObserver`

## 🐛 Debugging

### Afficher le DOM rendu

```typescript
import { render, screen } from '@testing-library/react';

render(<Component />);
screen.debug(); // Affiche le DOM complet
screen.debug(screen.getByRole('button')); // Affiche un élément spécifique
```

### Utiliser console.log dans les tests

```typescript
it('debug test', () => {
  const { container } = render(<Component />);
  console.log(container.innerHTML);
});
```

### Mode verbose

```bash
npm test -- --verbose
```

## 📚 Ressources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## ✅ Checklist pour Nouveaux Tests

- [ ] Le test a un nom descriptif (`it('should...')`)
- [ ] Le test est isolé et ne dépend pas d'autres tests
- [ ] Les mocks sont nettoyés après chaque test
- [ ] Les queries privilégient les rôles et le texte
- [ ] Les interactions utilisent `userEvent` au lieu de `fireEvent`
- [ ] Les assertions attendent les éléments asynchrones avec `waitFor`
- [ ] Le test couvre les cas limites et les erreurs

## 🎯 Progression de la Couverture

| Version | Tests | Couverture | Date |
|---------|-------|------------|------|
| v1.0 | 46 tests | ~30% | Octobre 2024 |
| **v1.1** | **226 tests** | **63.6%** | **Novembre 2024** |
| v2.0 (objectif) | - | 80% | À venir |

### Améliorations récentes (v1.1)

✅ **+180 nouveaux tests ajoutés**
- Services: +18 tests (expense, income, forecast, import)
- Hooks: +16 tests (useExpenses, useIncomes, useForecast, useTransactions, index)
- Composants UI: +14 tests (Modal, ConfirmModal)
- Navigation: +23 tests (MenuItem, NavMenu, MobileMenu, UserDropdown, Navbar)
- Transactions: +19 tests (TransactionItem, TransactionList, TransactionModal)
- Financial: +5 tests (FinancialModal)
- Sessions: +6 tests (SessionList)
- Auth: +6 tests (ProtectedRoute)
- Context: +5 tests (AuthContext)

### Exclusions

❌ **Module `types` exclu**
- Contient uniquement des définitions TypeScript
- Pas de logique métier à tester
- Helpers de type couverts indirectement par les tests des composants qui les utilisent

## 🤝 Contribution

Lors de l'ajout de nouvelles fonctionnalités :

1. Écrire les tests en même temps que le code
2. Viser une couverture minimale de 60% (objectif: 80%)
3. Tester les cas d'erreur et les cas limites
4. Ajouter des tests pour les bugs corrigés
5. Maintenir le taux de réussite à 100%
