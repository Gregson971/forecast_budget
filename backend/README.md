# Forecast Budget - Backend

## Description

Ceci est le backend pour l'application Forecast Budget. C'est une application FastAPI qui fournit une API RESTful pour l'application.

## Prérequis

- Python 3.11+
- Docker et Docker Compose
- PostgreSQL (si exécution locale)

## Configuration

1. Cloner le dépôt

```bash
git clone https://github.com/yourusername/forecast-budget.git
cd backend
```

2. Copier le fichier d'environnement

```bash
cp .env_example .env
```

3. Configurer les variables d'environnement dans le fichier `.env`

## Installation

### Option 1 : Avec Docker (Recommandé)

1. Construire et démarrer les conteneurs

```bash
docker-compose up -d --build
```

2. Vérifier que les conteneurs sont en cours d'exécution

```bash
docker-compose ps
```

### Option 2 : Installation locale

1. Créer un environnement virtuel

```bash
python -m venv venv
```

2. Activer l'environnement virtuel

```bash
source venv/bin/activate
```

3. Installer les dépendances

```bash
pip install -r requirements.txt
```

4. Lancer l'application

```bash
uvicorn app.main:app --reload
```

## Structure du Projet

```
.
├── app/                    # Code source de l'application
│   ├── domain/              # Domaines de l'application
│   ├── interfaces/          # Interfaces de l'application
│   │   └── api/             # API
│   ├── use_cases/           # Cas d'utilisation de l'application
│   ├── infrastructure/      # Configuration et utilitaires
│   │   ├── db/              # Base de données
│   │   ├── repositories/    # Repositories
│   │   └── security/        # JWT
│   └── main.py              # Point d'entrée de l'application
├── migrations/              # Scripts de migration de la base de données
├── tests/                   # Tests unitaires et d'intégration
├── Dockerfile               # Configuration pour la conteneurisation
├── docker-compose.yml   # Configuration des services
├── requirements.txt     # Dépendances Python
└── .env                 # Variables d'environnement
```

## Documentation de l'API

La documentation de l'API est disponible à :

- http://localhost:8000/docs
- http://localhost:8000/redoc

## Base de données

La base de données est une base PostgreSQL. Les détails de connexion sont dans le fichier `.env`.

### Migrations

Pour appliquer les migrations de la base de données :

```bash
alembic upgrade head
```

## Tests

Pour exécuter les tests :

```bash
pytest
```

## Développement

### Formatage du code

```bash
black .
```

### Vérification du code

```bash
flake8
```

## Licence

MIT
