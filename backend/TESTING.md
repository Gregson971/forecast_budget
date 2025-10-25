# Guide des Tests Backend

Ce document explique comment exécuter les tests pour le backend de Forecast Budget.

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Configuration](#configuration)
- [Exécution des tests](#exécution-des-tests)
- [Couverture de code](#couverture-de-code)
- [CI/CD](#cicd)
- [Bonnes pratiques](#bonnes-pratiques)

## 🔧 Prérequis

### Pour les tests locaux
- Python 3.11+
- PostgreSQL (ou Docker)
- Environnement virtuel Python activé

### Pour les tests Docker
- Docker
- Docker Compose

## ⚙️ Configuration

### Variables d'environnement pour les tests

Les tests utilisent une base de données PostgreSQL séparée. Créez un fichier `.env.test` (optionnel):

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/forecast_budget_test
SECRET_KEY=test_secret_key
ENVIRONMENT=development
```

## 🚀 Exécution des tests

### Méthode 1: Avec Docker (Recommandé)

La méthode la plus simple et isolée:

```bash
# Exécuter tous les tests
./run-tests.sh --docker

# Avec rapport de couverture
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit
```

Avantages:
- Environnement complètement isolé
- Pas besoin d'installer PostgreSQL localement
- Configuration automatique de la base de données
- Nettoyage automatique après les tests

### Méthode 2: Localement avec le script

Utilisez le script `run-tests.sh` pour plus de flexibilité:

```bash
# Exécuter tous les tests
./run-tests.sh

# Avec rapport de couverture
./run-tests.sh --coverage

# Exécuter des tests spécifiques
./run-tests.sh --specific tests/use_cases/auth/

# Mode watch (nécessite pytest-watch)
./run-tests.sh --watch
```

### Méthode 3: Directement avec pytest

Pour un contrôle total:

```bash
# Activer l'environnement virtuel
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Exécuter tous les tests
pytest tests/ -v

# Tests avec couverture
pytest tests/ --cov=app --cov-report=term-missing --cov-report=html

# Tests spécifiques
pytest tests/use_cases/auth/test_login_user.py -v

# Tests avec markers
pytest -m "not slow" -v

# Mode verbose avec détails
pytest tests/ -vv --tb=short
```

## 📊 Couverture de code

### Générer un rapport de couverture

```bash
# Rapport en terminal
pytest tests/ --cov=app --cov-report=term-missing

# Rapport HTML (plus détaillé)
pytest tests/ --cov=app --cov-report=html
```

Le rapport HTML sera généré dans `htmlcov/index.html`. Ouvrez-le dans un navigateur:

```bash
open htmlcov/index.html  # macOS
xdg-open htmlcov/index.html  # Linux
start htmlcov/index.html  # Windows
```

### Interpréter les résultats

- **Vert**: Code testé
- **Rouge**: Code non testé
- **Jaune**: Code partiellement testé (branches conditionnelles)

Objectif: **> 80% de couverture** pour le code métier (use cases, domain).

## 🔄 CI/CD

### GitHub Actions

Les tests s'exécutent automatiquement via GitHub Actions lors:
- Des push sur `main` et `develop`
- Des pull requests vers `main` et `develop`
- De modifications dans le dossier `backend/`

Voir le fichier `.github/workflows/backend-tests.yml` pour la configuration.

### Badges de statut

Ajoutez ces badges à votre README principal:

```markdown
![Tests](https://github.com/votre-org/forecast_budget/workflows/Backend%20Tests/badge.svg)
[![codecov](https://codecov.io/gh/votre-org/forecast_budget/branch/main/graph/badge.svg)](https://codecov.io/gh/votre-org/forecast_budget)
```

## ✅ Bonnes pratiques

### Structure des tests

```
tests/
├── domain/              # Tests des services de domaine
├── infrastructure/      # Tests des implémentations (repos, SMS, etc.)
├── use_cases/          # Tests des cas d'utilisation
│   ├── auth/
│   ├── expenses/
│   ├── income/
│   └── user/
└── conftest.py         # Fixtures partagées (si nécessaire)
```

### Conventions de nommage

- **Fichiers**: `test_<module>.py`
- **Classes**: `Test<ClassName>`
- **Fonctions**: `test_<action>_<expected_result>`

Exemple:
```python
def test_login_user_with_valid_credentials():
    """Test pour le cas d'utilisation de login avec identifiants valides."""
    # Arrange
    # Act
    # Assert
```

### Pattern AAA (Arrange-Act-Assert)

```python
def test_create_expense_success():
    # Arrange - Préparer les données et mocks
    user_id = "test-user-id"
    expense_data = {"amount": 50.0, "description": "Test"}

    # Act - Exécuter l'action
    result = create_expense_use_case.execute(user_id, expense_data)

    # Assert - Vérifier le résultat
    assert result.amount == 50.0
```

### Tests asynchrones

Pour les use cases asynchrones:

```python
import pytest

@pytest.mark.asyncio
async def test_async_function():
    result = await async_use_case.execute()
    assert result is not None
```

### Mocking

Utilisez `unittest.mock` pour les dépendances:

```python
from unittest.mock import Mock, AsyncMock

def test_with_mock():
    # Mock synchrone
    repo = Mock()
    repo.get_by_id.return_value = User(...)

    # Mock asynchrone
    sms_service = Mock()
    sms_service.send_sms = AsyncMock(return_value=True)
```

## 🐛 Debugging

### Exécuter un test spécifique en mode debug

```bash
# Avec pytest
pytest tests/use_cases/auth/test_login_user.py::test_login_user_with_valid_credentials -vv -s

# Avec pdb (Python debugger)
pytest tests/use_cases/auth/test_login_user.py --pdb
```

### Voir les logs pendant les tests

```bash
# Afficher les print statements
pytest tests/ -s

# Avec niveau de log spécifique
pytest tests/ --log-cli-level=DEBUG
```

## 📝 Commandes utiles

```bash
# Lister tous les tests sans les exécuter
pytest --collect-only

# Exécuter les tests qui ont échoué lors de la dernière exécution
pytest --lf

# Exécuter les tests jusqu'à la première erreur
pytest -x

# Exécuter en parallèle (nécessite pytest-xdist)
pytest -n auto

# Générer un rapport JUnit XML (pour CI)
pytest --junitxml=test-results.xml
```

## 🔍 Résolution de problèmes

### "ModuleNotFoundError"

```bash
# Vérifier que vous êtes dans le bon répertoire
pwd  # Doit être dans /backend

# Réinstaller les dépendances
pip install -r requirements.txt
```

### "Database connection error"

```bash
# Vérifier que PostgreSQL est démarré
docker compose ps

# Redémarrer PostgreSQL
docker compose restart postgres-test
```

### "Permission denied: ./run-tests.sh"

```bash
chmod +x run-tests.sh
```

## 📚 Ressources

- [Pytest Documentation](https://docs.pytest.org/)
- [Pytest-cov Documentation](https://pytest-cov.readthedocs.io/)
- [Python unittest.mock](https://docs.python.org/3/library/unittest.mock.html)
- [Testing Best Practices](https://docs.python-guide.org/writing/tests/)

## 🎯 Objectifs de couverture

| Module | Objectif | Actuel |
|--------|----------|--------|
| Use Cases | 95%+ | 85%+ |
| Domain Services | 90%+ | 85%+ |
| Repositories | 80%+ | 70%+ |
| API Routes | 70%+ | 0% (TODO) |
| **Total** | **80%+** | **49%** |

---

Pour toute question ou problème, consultez la documentation ou ouvrez une issue.
