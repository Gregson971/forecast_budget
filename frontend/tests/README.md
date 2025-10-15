# Tests Frontend - Forecast Budget

Ce dossier contient tous les tests pour l'application frontend Forecast Budget.

## 📁 Structure des Tests

```
tests/
├── components/           # Tests des composants React
│   ├── ui/              # Tests des composants UI de base
│   ├── sessions/        # Tests des composants de sessions
│   ├── profile/         # Tests des composants de profil
│   └── ...
├── hooks/               # Tests des hooks personnalisés
├── services/            # Tests des services API
├── utils/               # Tests des utilitaires
└── README.md           # Ce fichier
```

## 🛠️ Technologies Utilisées

- **Jest** - Framework de test
- **React Testing Library (RTL)** - Tests de composants React
- **@testing-library/user-event** - Simulation d'interactions utilisateur
- **@testing-library/jest-dom** - Matchers personnalisés pour le DOM

## 🚀 Commandes de Test

### Exécuter tous les tests
```bash
npm test
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
npm test -- Button.test.tsx
```

### Exécuter les tests d'un dossier
```bash
npm test -- tests/components
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

Les objectifs de couverture sont définis dans `jest.config.ts` :

```typescript
coverageThreshold: {
  global: {
    branches: 50,
    functions: 50,
    lines: 50,
    statements: 50,
  },
}
```

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

## 🤝 Contribution

Lors de l'ajout de nouvelles fonctionnalités :

1. Écrire les tests en même temps que le code
2. Viser une couverture minimale de 70%
3. Tester les cas d'erreur et les cas limites
4. Ajouter des tests pour les bugs corrigés
