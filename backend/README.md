# Forecast Budget - Backend

## 📋 Description

Ceci est le backend pour l'application **Forecast Budget**, une solution complète de gestion de budget avec prévisions financières. C'est une application FastAPI qui fournit une API RESTful moderne et sécurisée pour la gestion des dépenses, revenus et prévisions budgétaires.

## ✨ Fonctionnalités

- 🔐 **Authentification JWT** avec refresh tokens
- 👤 **Gestion des utilisateurs** et sessions
- 💰 **Gestion des dépenses** avec catégories et fréquences
- 💵 **Gestion des revenus**
- 📊 **Prévisions budgétaires** intelligentes
- 🗄️ **Base de données PostgreSQL** avec migrations Alembic
- 🐳 **Déploiement Docker** prêt à l'emploi
- 📚 **Documentation API** automatique (Swagger/ReDoc)
- 🧪 **Tests unitaires** et d'intégration complets

## 🛠️ Prérequis

- **Python** 3.11+
- **Docker** et **Docker Compose**
- **PostgreSQL** (si exécution locale)
- **Git**

## ⚙️ Configuration

### 1. Cloner le dépôt

```bash
git clone https://github.com/Gregson971/forecast_budget.git
cd forecast_budget/backend
```

### 2. Configuration de l'environnement

```bash
# Copier le fichier d'environnement
cp .env_example .env

# Éditer le fichier .env avec vos valeurs
nano .env
```

#### Variables d'environnement requises

```env
# Base de données
DATABASE_URL=postgresql://user:password@localhost:5432/forecast_budget
POSTGRES_DB=forecast_budget
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_secure_password

# Sécurité
SECRET_KEY=your_super_secret_key_here

# CORS
ORIGINS_ALLOWED=["http://localhost:3000", "http://127.0.0.1:3000"]
```

## 🚀 Installation et Démarrage

### Option 1 : Avec Docker (Recommandé)

#### Démarrage rapide

```bash
# Construire et démarrer tous les services
docker-compose up -d --build

# Vérifier le statut des conteneurs
docker-compose ps

# Voir les logs
docker-compose logs -f api
```

#### Commandes Docker utiles

```bash
# Arrêter les services
docker-compose down

# Redémarrer un service spécifique
docker-compose restart api

# Reconstruire après modification du code
docker-compose up -d --build api

# Accéder au shell du conteneur
docker-compose exec api bash
```

### Option 2 : Installation locale

#### 1. Créer un environnement virtuel

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
```

#### 2. Installer les dépendances

```bash
pip install -r requirements.txt
```

#### 3. Configurer la base de données

```bash
# Démarrer PostgreSQL localement ou via Docker
docker run -d --name postgres \
  -e POSTGRES_DB=forecast_budget \
  -e POSTGRES_USER=your_username \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  postgres:latest

# Appliquer les migrations
alembic upgrade head
```

#### 4. Lancer l'application

```bash
# Mode développement avec rechargement automatique
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Mode production
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 📁 Structure du Projet

```
backend/
├── app/                          # Code source principal
│   ├── domain/                   # Domaines métier (Clean Architecture)
│   │   ├── entities/             # Entités du domaine
│   │   ├── interfaces/           # Interfaces des repositories
│   │   └── services/             # Services métier
│   ├── external_interfaces/      # Interfaces externes
│   │   └── api/                  # Routes API REST
│   ├── infrastructure/           # Infrastructure technique
│   │   ├── db/                   # Configuration base de données
│   │   │   └── models/           # Modèles SQLAlchemy
│   │   ├── repositories/         # Implémentation des repositories
│   │   └── security/             # Sécurité et JWT
│   ├── use_cases/                # Cas d'utilisation
│   │   ├── auth/                 # Authentification
│   │   ├── expenses/             # Gestion des dépenses
│   │   ├── income/               # Gestion des revenus
│   │   ├── forecast/             # Prévisions
│   │   └── user/                 # Gestion utilisateurs
│   ├── main.py                   # Point d'entrée FastAPI
│   └── startup.py                # Configuration au démarrage
├── migrations/                   # Migrations Alembic
├── tests/                        # Tests unitaires et d'intégration
├── Dockerfile                    # Configuration Docker
├── docker-compose.yml            # Orchestration des services
├── requirements.txt              # Dépendances Python
├── alembic.ini                   # Configuration Alembic
└── .env                          # Variables d'environnement
```

## 📚 Documentation de l'API

Une fois l'application démarrée, la documentation interactive est disponible :

- **Swagger UI** : http://localhost:8000/docs
- **ReDoc** : http://localhost:8000/redoc
- **OpenAPI JSON** : http://localhost:8000/openapi.json

### Endpoints principaux

- `POST /auth/register` - Inscription utilisateur
- `POST /auth/login` - Connexion
- `POST /auth/refresh` - Rafraîchir le token
- `GET /users/me` - Profil utilisateur
- `GET /expenses/` - Liste des dépenses
- `POST /expenses/` - Créer une dépense
- `GET /income/` - Liste des revenus
- `POST /income/` - Créer un revenu
- `GET /forecast/` - Prévisions budgétaires

## 🗄️ Base de données

### Configuration PostgreSQL

L'application utilise PostgreSQL avec les configurations suivantes :

- **Port** : 5432
- **Base de données** : `forecast_budget` (configurable)
- **ORM** : SQLAlchemy 2.0
- **Migrations** : Alembic

### Gestion des migrations

```bash
# Créer une nouvelle migration
alembic revision --autogenerate -m "Description de la migration"

# Appliquer toutes les migrations
alembic upgrade head

# Revenir à une version précédente
alembic downgrade -1

# Voir l'historique des migrations
alembic history
```

## 🧪 Tests

### Exécution des tests

```bash
# Tous les tests
pytest

# Tests avec couverture
pytest --cov=app

# Tests spécifiques
pytest tests/use_cases/auth/
pytest tests/domain/services/

# Tests en mode verbose
pytest -v

# Tests avec rapport HTML
pytest --cov=app --cov-report=html
```

### Structure des tests

```
tests/
├── domain/                       # Tests des domaines
├── use_cases/                    # Tests des cas d'utilisation
│   ├── auth/                     # Tests d'authentification
│   ├── expenses/                 # Tests des dépenses
│   ├── income/                   # Tests des revenus
│   ├── forecast/                 # Tests des prévisions
│   └── user/                     # Tests utilisateurs
└── conftest.py                   # Configuration pytest
```

## 🛠️ Développement

### Outils de qualité du code

```bash
# Formatage automatique
black .

# Vérification du style (PEP 8)
flake8

# Vérification des types (optionnel)
mypy app/

# Tri des imports
isort .
```

### Workflow de développement

1. **Créer une branche** pour votre fonctionnalité
2. **Développer** avec les tests
3. **Formater** le code avec `black`
4. **Vérifier** avec `flake8`
5. **Tester** avec `pytest`
6. **Créer une PR** avec description détaillée

### Variables d'environnement de développement

```env
# Mode debug
DEBUG=true

# Logs détaillés
LOG_LEVEL=DEBUG

# Base de données de test
TEST_DATABASE_URL=postgresql://test_user:test_pass@localhost:5432/test_db
```

## 🚀 Déploiement

### Production avec Docker

```bash
# Build de production
docker build -t forecast-budget-api .

# Démarrage avec variables d'environnement
docker run -d \
  -p 8000:8000 \
  -e DATABASE_URL=your_production_db_url \
  -e SECRET_KEY=your_production_secret \
  forecast-budget-api
```

### Variables d'environnement de production

```env
# Sécurité renforcée
SECRET_KEY=your_very_long_and_secure_secret_key
DEBUG=false

# Base de données de production
DATABASE_URL=postgresql://prod_user:prod_pass@prod_host:5432/prod_db

# CORS restrictif
ORIGINS_ALLOWED=["https://yourdomain.com"]
```

## 🔧 Dépannage

### Problèmes courants

#### Erreur de connexion à la base de données

```bash
# Vérifier que PostgreSQL est démarré
docker-compose ps postgres

# Vérifier les logs
docker-compose logs postgres
```

#### Erreur de migration

```bash
# Réinitialiser les migrations
alembic downgrade base
alembic upgrade head
```

#### Problème de permissions

```bash
# Vérifier les permissions du dossier
chmod -R 755 .

# Réinitialiser les conteneurs
docker-compose down -v
docker-compose up -d --build
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

## 📞 Support

Pour toute question ou problème :

- Ouvrir une issue sur GitHub
- Consulter la documentation de l'API
- Vérifier les logs de l'application
