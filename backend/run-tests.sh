#!/bin/bash

# Script pour exécuter les tests backend
# Usage: ./run-tests.sh [options]
#
# Options:
#   --docker    Exécute les tests dans Docker
#   --coverage  Génère un rapport de couverture détaillé
#   --watch     Exécute les tests en mode watch (nécessite pytest-watch)
#   --specific  Exécute un fichier de test spécifique (ex: --specific tests/use_cases/auth/)

set -e

# Couleurs pour l'output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher un message
log() {
    echo -e "${GREEN}[TEST]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Parse les arguments
DOCKER=false
COVERAGE=false
WATCH=false
SPECIFIC=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --docker)
            DOCKER=true
            shift
            ;;
        --coverage)
            COVERAGE=true
            shift
            ;;
        --watch)
            WATCH=true
            shift
            ;;
        --specific)
            SPECIFIC="$2"
            shift 2
            ;;
        *)
            error "Option inconnue: $1"
            echo "Usage: ./run-tests.sh [--docker] [--coverage] [--watch] [--specific path]"
            exit 1
            ;;
    esac
done

# Si mode Docker
if [ "$DOCKER" = true ]; then
    log "Exécution des tests dans Docker..."
    docker compose -f docker-compose.test.yml down -v
    docker compose -f docker-compose.test.yml up --build --abort-on-container-exit
    exit_code=$?
    docker compose -f docker-compose.test.yml down -v
    exit $exit_code
fi

# Sinon, exécution locale
log "Vérification de l'environnement..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "requirements.txt" ]; then
    error "Ce script doit être exécuté depuis le répertoire backend/"
    exit 1
fi

# Vérifier que l'environnement virtuel est activé
if [ -z "$VIRTUAL_ENV" ]; then
    warn "Aucun environnement virtuel détecté. Activation recommandée."
    read -p "Continuer quand même? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Construire la commande pytest
CMD="pytest"

if [ -n "$SPECIFIC" ]; then
    CMD="$CMD $SPECIFIC"
else
    CMD="$CMD tests/"
fi

CMD="$CMD -v"

if [ "$COVERAGE" = true ]; then
    log "Génération du rapport de couverture..."
    CMD="$CMD --cov=app --cov-report=term-missing --cov-report=html"
fi

if [ "$WATCH" = true ]; then
    log "Mode watch activé (Ctrl+C pour arrêter)..."
    CMD="ptw -- $CMD"
fi

# Exécuter les tests
log "Commande: $CMD"
echo ""

eval $CMD

exit_code=$?

# Afficher un résumé
echo ""
if [ $exit_code -eq 0 ]; then
    log "✅ Tous les tests ont réussi!"
    if [ "$COVERAGE" = true ]; then
        log "Rapport de couverture généré dans htmlcov/index.html"
    fi
else
    error "❌ Certains tests ont échoué"
fi

exit $exit_code
