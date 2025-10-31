"""Tests d'intégration pour le SQLRefreshTokenRepository."""

import pytest
from datetime import datetime, UTC
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.infrastructure.db.models.user_db import Base, UserDB
from app.infrastructure.db.models.refresh_token_db import RefreshTokenDB
from app.infrastructure.repositories.refresh_token_repository import SQLRefreshTokenRepository
from app.domain.entities.token import RefreshToken


@pytest.fixture
def db_session():
    """Crée une session de base de données en mémoire pour les tests."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()

    # Créer un utilisateur de test
    user = UserDB(
        id="test-user-id",
        first_name="Test",
        last_name="User",
        email="test@example.com",
        password="hashed_password",
        phone_number="+33612345678",
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    session.add(user)
    session.commit()

    yield session
    session.close()


@pytest.fixture
def repository(db_session):
    """Crée une instance du repository."""
    return SQLRefreshTokenRepository(db_session)


def test_add_refresh_token(repository, db_session):
    """Test d'ajout d'un refresh token."""
    token = RefreshToken(
        token="test_token_123",
        user_id="test-user-id",
        created_at=datetime.now(UTC),
        revoked=False
    )

    repository.add(token)

    # Vérifier que le token a été ajouté
    token_db = db_session.query(RefreshTokenDB).filter_by(token="test_token_123").first()
    assert token_db is not None
    assert token_db.user_id == "test-user-id"
    assert token_db.revoked is False


def test_revoke_token(repository, db_session):
    """Test de révocation d'un token."""
    # Créer un token
    token_db = RefreshTokenDB(
        token="token_to_revoke",
        user_id="test-user-id",
        created_at=datetime.now(UTC),
        revoked=False
    )
    db_session.add(token_db)
    db_session.commit()

    # Révoquer le token
    repository.revoke("token_to_revoke")

    # Vérifier
    token_db = db_session.query(RefreshTokenDB).filter_by(token="token_to_revoke").first()
    assert token_db.revoked is True


def test_revoke_non_existent_token(repository):
    """Test de révocation d'un token inexistant (ne doit pas lever d'erreur)."""
    # Ne doit pas lever d'exception
    repository.revoke("non_existent_token")


def test_is_valid_for_valid_token(repository, db_session):
    """Test de validation d'un token valide."""
    # Créer un token valide
    token_db = RefreshTokenDB(
        token="valid_token",
        user_id="test-user-id",
        created_at=datetime.now(UTC),
        revoked=False
    )
    db_session.add(token_db)
    db_session.commit()

    # Vérifier
    assert repository.is_valid("valid_token") is True


def test_is_valid_for_revoked_token(repository, db_session):
    """Test de validation d'un token révoqué."""
    # Créer un token révoqué
    token_db = RefreshTokenDB(
        token="revoked_token",
        user_id="test-user-id",
        created_at=datetime.now(UTC),
        revoked=True
    )
    db_session.add(token_db)
    db_session.commit()

    # Vérifier
    assert repository.is_valid("revoked_token") is False


def test_is_valid_for_non_existent_token(repository):
    """Test de validation d'un token inexistant."""
    assert repository.is_valid("non_existent_token") is False


def test_get_by_token_success(repository, db_session):
    """Test de récupération d'un token par sa valeur."""
    # Créer un token
    token_db = RefreshTokenDB(
        token="test_token",
        user_id="test-user-id",
        created_at=datetime.now(UTC),
        revoked=False
    )
    db_session.add(token_db)
    db_session.commit()

    # Récupérer
    token = repository.get_by_token("test_token")

    assert token is not None
    assert token.token == "test_token"
    assert token.user_id == "test-user-id"
    assert token.revoked is False


def test_get_by_token_not_found(repository):
    """Test de récupération d'un token inexistant."""
    token = repository.get_by_token("non_existent_token")
    assert token is None


def test_add_token_then_revoke(repository, db_session):
    """Test d'ajout puis révocation d'un token."""
    # Ajouter
    token = RefreshToken(
        token="add_then_revoke",
        user_id="test-user-id",
        created_at=datetime.now(UTC),
        revoked=False
    )
    repository.add(token)

    # Vérifier qu'il est valide
    assert repository.is_valid("add_then_revoke") is True

    # Révoquer
    repository.revoke("add_then_revoke")

    # Vérifier qu'il n'est plus valide
    assert repository.is_valid("add_then_revoke") is False


def test_multiple_tokens_same_user(repository, db_session):
    """Test avec plusieurs tokens pour le même utilisateur."""
    # Créer 3 tokens
    for i in range(3):
        token_db = RefreshTokenDB(
            token=f"token_{i}",
            user_id="test-user-id",
            created_at=datetime.now(UTC),
            revoked=(i == 2)  # Le dernier est révoqué
        )
        db_session.add(token_db)
    db_session.commit()

    # Vérifier la validité
    assert repository.is_valid("token_0") is True
    assert repository.is_valid("token_1") is True
    assert repository.is_valid("token_2") is False
