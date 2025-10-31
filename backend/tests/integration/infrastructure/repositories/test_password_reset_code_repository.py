"""Tests d'intégration pour le PasswordResetCodeRepository."""

import pytest
from datetime import datetime, timedelta, UTC
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.infrastructure.db.models.user_db import Base, UserDB
from app.infrastructure.db.models.password_reset_code_db import PasswordResetCodeDB
from app.infrastructure.repositories.password_reset_code_repository import PasswordResetCodeRepository
from app.domain.entities.password_reset_code import PasswordResetCode


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
    return PasswordResetCodeRepository(db_session)


def test_add_password_reset_code(repository, db_session):
    """Test d'ajout d'un code de réinitialisation."""
    code = PasswordResetCode(
        id="test-code-id",
        user_id="test-user-id",
        code="123456",
        expires_at=datetime.now(UTC) + timedelta(minutes=10),
        created_at=datetime.now(UTC),
        used=False
    )

    repository.add(code)

    # Vérifier que le code a été ajouté
    code_db = db_session.query(PasswordResetCodeDB).filter_by(id="test-code-id").first()
    assert code_db is not None
    assert code_db.code == "123456"
    assert code_db.user_id == "test-user-id"
    assert code_db.used is False


def test_get_by_code_valid(repository, db_session):
    """Test de récupération d'un code valide."""
    # Créer un code dans la base
    code_db = PasswordResetCodeDB(
        id="test-code-id",
        user_id="test-user-id",
        code="123456",
        expires_at=datetime.now(UTC) + timedelta(minutes=10),
        created_at=datetime.now(UTC),
        used=False
    )
    db_session.add(code_db)
    db_session.commit()

    # Récupérer le code
    code = repository.get_by_code("123456")

    assert code is not None
    assert code.code == "123456"
    assert code.user_id == "test-user-id"
    assert code.used is False


def test_get_by_code_not_found(repository):
    """Test de récupération d'un code inexistant."""
    code = repository.get_by_code("999999")
    assert code is None


def test_get_by_code_already_used(repository, db_session):
    """Test de récupération d'un code déjà utilisé (doit retourner None)."""
    # Créer un code utilisé
    code_db = PasswordResetCodeDB(
        id="test-code-id",
        user_id="test-user-id",
        code="123456",
        expires_at=datetime.now(UTC) + timedelta(minutes=10),
        created_at=datetime.now(UTC),
        used=True  # Déjà utilisé
    )
    db_session.add(code_db)
    db_session.commit()

    # Tentative de récupération
    code = repository.get_by_code("123456")
    assert code is None  # Ne doit pas retourner un code utilisé


def test_get_by_user_id(repository, db_session):
    """Test de récupération d'un code par user_id."""
    # Créer un code
    code_db = PasswordResetCodeDB(
        id="test-code-id",
        user_id="test-user-id",
        code="123456",
        expires_at=datetime.now(UTC) + timedelta(minutes=10),
        created_at=datetime.now(UTC),
        used=False
    )
    db_session.add(code_db)
    db_session.commit()

    # Récupérer le code
    code = repository.get_by_user_id("test-user-id")

    assert code is not None
    assert code.code == "123456"
    assert code.user_id == "test-user-id"


def test_get_by_user_id_not_found(repository):
    """Test de récupération d'un code pour un utilisateur sans code."""
    code = repository.get_by_user_id("non-existent-user")
    assert code is None


def test_mark_as_used(repository, db_session):
    """Test de marquage d'un code comme utilisé."""
    # Créer un code non utilisé
    code_db = PasswordResetCodeDB(
        id="test-code-id",
        user_id="test-user-id",
        code="123456",
        expires_at=datetime.now(UTC) + timedelta(minutes=10),
        created_at=datetime.now(UTC),
        used=False
    )
    db_session.add(code_db)
    db_session.commit()

    # Marquer comme utilisé
    repository.mark_as_used("test-code-id")

    # Vérifier
    code_db = db_session.query(PasswordResetCodeDB).filter_by(id="test-code-id").first()
    assert code_db.used is True


def test_delete_expired_codes(repository, db_session):
    """Test de suppression des codes expirés."""
    # Créer un code expiré
    expired_code = PasswordResetCodeDB(
        id="expired-code-id",
        user_id="test-user-id",
        code="111111",
        expires_at=datetime.now(UTC) - timedelta(minutes=10),  # Expiré
        created_at=datetime.now(UTC) - timedelta(minutes=20),
        used=False
    )
    db_session.add(expired_code)

    # Créer un code valide
    valid_code = PasswordResetCodeDB(
        id="valid-code-id",
        user_id="test-user-id",
        code="222222",
        expires_at=datetime.now(UTC) + timedelta(minutes=10),  # Valide
        created_at=datetime.now(UTC),
        used=False
    )
    db_session.add(valid_code)
    db_session.commit()

    # Supprimer les codes expirés
    repository.delete_expired_codes()

    # Vérifier que seul le code expiré a été supprimé
    expired = db_session.query(PasswordResetCodeDB).filter_by(id="expired-code-id").first()
    valid = db_session.query(PasswordResetCodeDB).filter_by(id="valid-code-id").first()

    assert expired is None  # Le code expiré doit être supprimé
    assert valid is not None  # Le code valide doit encore exister


def test_delete_expired_codes_no_expired(repository, db_session):
    """Test de suppression quand il n'y a pas de codes expirés."""
    # Créer seulement un code valide
    valid_code = PasswordResetCodeDB(
        id="valid-code-id",
        user_id="test-user-id",
        code="222222",
        expires_at=datetime.now(UTC) + timedelta(minutes=10),
        created_at=datetime.now(UTC),
        used=False
    )
    db_session.add(valid_code)
    db_session.commit()

    # Supprimer les codes expirés (aucun)
    repository.delete_expired_codes()

    # Vérifier que le code valide existe toujours
    valid = db_session.query(PasswordResetCodeDB).filter_by(id="valid-code-id").first()
    assert valid is not None


def test_get_by_code_multiple_codes_same_user(repository, db_session):
    """Test de récupération avec plusieurs codes pour le même utilisateur."""
    # Créer un ancien code utilisé
    old_code = PasswordResetCodeDB(
        id="old-code-id",
        user_id="test-user-id",
        code="111111",
        expires_at=datetime.now(UTC) - timedelta(minutes=5),
        created_at=datetime.now(UTC) - timedelta(minutes=15),
        used=True
    )
    db_session.add(old_code)

    # Créer un nouveau code valide
    new_code = PasswordResetCodeDB(
        id="new-code-id",
        user_id="test-user-id",
        code="222222",
        expires_at=datetime.now(UTC) + timedelta(minutes=10),
        created_at=datetime.now(UTC),
        used=False
    )
    db_session.add(new_code)
    db_session.commit()

    # Récupérer le nouveau code
    code = repository.get_by_code("222222")
    assert code is not None
    assert code.code == "222222"

    # Vérifier que l'ancien code n'est pas retourné
    old = repository.get_by_code("111111")
    assert old is None  # Code utilisé


def test_get_by_user_id_returns_most_recent(repository, db_session):
    """Test que get_by_user_id retourne le code le plus récent non utilisé."""
    # Créer un ancien code non utilisé
    old_code = PasswordResetCodeDB(
        id="old-code-id",
        user_id="test-user-id",
        code="111111",
        expires_at=datetime.now(UTC) + timedelta(minutes=5),
        created_at=datetime.now(UTC) - timedelta(minutes=15),
        used=False
    )
    db_session.add(old_code)

    # Créer un nouveau code non utilisé
    new_code = PasswordResetCodeDB(
        id="new-code-id",
        user_id="test-user-id",
        code="222222",
        expires_at=datetime.now(UTC) + timedelta(minutes=10),
        created_at=datetime.now(UTC),
        used=False
    )
    db_session.add(new_code)
    db_session.commit()

    # Récupérer par user_id (doit retourner le plus récent)
    code = repository.get_by_user_id("test-user-id")
    assert code is not None
    assert code.code == "222222"  # Le plus récent
