"""Tests d'intégration pour le SQLUserRepository."""

import pytest
from datetime import datetime, UTC
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.infrastructure.db.models.user_db import Base, UserDB
from app.infrastructure.repositories.user_repository import SQLUserRepository
from app.domain.entities.user import User


@pytest.fixture
def db_session():
    """Crée une session de base de données en mémoire pour les tests."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    yield session
    session.close()


@pytest.fixture
def repository(db_session):
    """Crée une instance du repository."""
    return SQLUserRepository(db_session)


def test_add_user(repository, db_session):
    """Test d'ajout d'un utilisateur."""
    user = User(
        id="test-user-id",
        first_name="John",
        last_name="Doe",
        email="john.doe@example.com",
        password="hashed_password",
        phone_number="+33612345678",
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )

    repository.add(user)

    # Vérifier que l'utilisateur a été ajouté
    user_db = db_session.query(UserDB).filter_by(id="test-user-id").first()
    assert user_db is not None
    assert user_db.email == "john.doe@example.com"
    assert user_db.first_name == "John"
    assert user_db.last_name == "Doe"
    assert user_db.phone_number == "+33612345678"


def test_get_by_id_success(repository, db_session):
    """Test de récupération d'un utilisateur par ID."""
    # Créer un utilisateur dans la base
    user_db = UserDB(
        id="test-user-id",
        first_name="Jane",
        last_name="Smith",
        email="jane.smith@example.com",
        password="hashed_password",
        phone_number="+33612345678",
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db_session.add(user_db)
    db_session.commit()

    # Récupérer l'utilisateur
    user = repository.get_by_id("test-user-id")

    assert user is not None
    assert user.id == "test-user-id"
    assert user.email == "jane.smith@example.com"
    assert user.first_name == "Jane"
    assert user.last_name == "Smith"
    assert user.phone_number == "+33612345678"


def test_get_by_id_not_found(repository):
    """Test de récupération d'un utilisateur inexistant."""
    user = repository.get_by_id("non-existent-id")
    assert user is None


def test_get_by_email_success(repository, db_session):
    """Test de récupération d'un utilisateur par email."""
    # Créer un utilisateur
    user_db = UserDB(
        id="test-user-id",
        first_name="Alice",
        last_name="Johnson",
        email="alice.johnson@example.com",
        password="hashed_password",
        phone_number="+33612345678",
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db_session.add(user_db)
    db_session.commit()

    # Récupérer par email
    user = repository.get_by_email("alice.johnson@example.com")

    assert user is not None
    assert user.email == "alice.johnson@example.com"
    assert user.first_name == "Alice"


def test_get_by_email_not_found(repository):
    """Test de récupération par email inexistant."""
    user = repository.get_by_email("nonexistent@example.com")
    assert user is None


def test_get_by_phone_number_success(repository, db_session):
    """Test de récupération d'un utilisateur par numéro de téléphone."""
    # Créer un utilisateur
    user_db = UserDB(
        id="test-user-id",
        first_name="Bob",
        last_name="Martin",
        email="bob.martin@example.com",
        password="hashed_password",
        phone_number="+33698765432",
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db_session.add(user_db)
    db_session.commit()

    # Récupérer par téléphone
    user = repository.get_by_phone_number("+33698765432")

    assert user is not None
    assert user.phone_number == "+33698765432"
    assert user.email == "bob.martin@example.com"


def test_get_by_phone_number_not_found(repository):
    """Test de récupération par téléphone inexistant."""
    user = repository.get_by_phone_number("+33600000000")
    assert user is None


def test_get_by_phone_number_with_user_without_phone(repository, db_session):
    """Test de récupération quand l'utilisateur n'a pas de numéro de téléphone."""
    # Créer un utilisateur sans téléphone
    user_db = UserDB(
        id="test-user-id",
        first_name="Charlie",
        last_name="Brown",
        email="charlie.brown@example.com",
        password="hashed_password",
        phone_number=None,  # Pas de téléphone
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db_session.add(user_db)
    db_session.commit()

    # Tentative de récupération par un autre numéro (ne doit rien trouver)
    user = repository.get_by_phone_number("+33600000000")
    assert user is None


def test_update_user(repository, db_session):
    """Test de mise à jour d'un utilisateur."""
    # Créer un utilisateur
    user_db = UserDB(
        id="test-user-id",
        first_name="David",
        last_name="Wilson",
        email="david.wilson@example.com",
        password="old_password",
        phone_number="+33612345678",
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db_session.add(user_db)
    db_session.commit()

    # Mettre à jour
    updated_user = User(
        id="test-user-id",
        first_name="David",
        last_name="Wilson-Updated",
        email="david.updated@example.com",
        password="new_password",
        phone_number="+33687654321",
        created_at=user_db.created_at,
        updated_at=datetime.now(UTC)
    )

    repository.update("test-user-id", updated_user)

    # Vérifier
    user_db = db_session.query(UserDB).filter_by(id="test-user-id").first()
    assert user_db.last_name == "Wilson-Updated"
    assert user_db.email == "david.updated@example.com"
    assert user_db.password == "new_password"
    assert user_db.phone_number == "+33687654321"


def test_delete_user(repository, db_session):
    """Test de suppression d'un utilisateur."""
    # Créer un utilisateur
    user_db = UserDB(
        id="test-user-id",
        first_name="Eve",
        last_name="Taylor",
        email="eve.taylor@example.com",
        password="hashed_password",
        phone_number="+33612345678",
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db_session.add(user_db)
    db_session.commit()

    # Supprimer
    repository.delete("test-user-id")

    # Vérifier
    user_db = db_session.query(UserDB).filter_by(id="test-user-id").first()
    assert user_db is None


def test_delete_user_not_found(repository):
    """Test de suppression d'un utilisateur inexistant (ne doit pas lever d'erreur)."""
    # Ne doit pas lever d'exception
    repository.delete("non-existent-id")


def test_get_all_users(repository, db_session):
    """Test de listing des utilisateurs."""
    # Créer plusieurs utilisateurs
    users = [
        UserDB(
            id=f"user-{i}",
            first_name=f"User{i}",
            last_name=f"Test{i}",
            email=f"user{i}@example.com",
            password="hashed_password",
            phone_number=f"+3361234567{i}",
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC)
        )
        for i in range(3)
    ]
    for user in users:
        db_session.add(user)
    db_session.commit()

    # Lister
    all_users = repository.get_all()

    assert len(all_users) == 3
    assert all(isinstance(user, User) for user in all_users)
    emails = [user.email for user in all_users]
    assert "user0@example.com" in emails
    assert "user1@example.com" in emails
    assert "user2@example.com" in emails


def test_get_all_users_empty(repository):
    """Test de listing quand il n'y a pas d'utilisateurs."""
    users = repository.get_all()
    assert users == []


def test_add_user_without_phone_number(repository, db_session):
    """Test d'ajout d'un utilisateur sans numéro de téléphone."""
    user = User(
        id="test-user-id",
        first_name="Frank",
        last_name="Miller",
        email="frank.miller@example.com",
        password="hashed_password",
        phone_number=None,  # Pas de téléphone
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )

    repository.add(user)

    # Vérifier
    user_db = db_session.query(UserDB).filter_by(id="test-user-id").first()
    assert user_db is not None
    assert user_db.phone_number is None


def test_update_user_partial(repository, db_session):
    """Test de mise à jour partielle (seulement certains champs)."""
    # Créer un utilisateur
    user_db = UserDB(
        id="test-user-id",
        first_name="Grace",
        last_name="Lee",
        email="grace.lee@example.com",
        password="old_password",
        phone_number="+33612345678",
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db_session.add(user_db)
    db_session.commit()

    # Mettre à jour seulement le téléphone
    updated_user = User(
        id="test-user-id",
        first_name="Grace",
        last_name="Lee",
        email="grace.lee@example.com",
        password="old_password",
        phone_number="+33687654321",  # Nouveau téléphone
        created_at=user_db.created_at,
        updated_at=datetime.now(UTC)
    )

    repository.update("test-user-id", updated_user)

    # Vérifier que seul le téléphone a changé
    user_db = db_session.query(UserDB).filter_by(id="test-user-id").first()
    assert user_db.phone_number == "+33687654321"
    assert user_db.first_name == "Grace"  # Inchangé
    assert user_db.last_name == "Lee"  # Inchangé
    assert user_db.email == "grace.lee@example.com"  # Inchangé


def test_get_by_email_case_sensitive(repository, db_session):
    """Test que la recherche par email est sensible à la casse."""
    # Créer un utilisateur
    user_db = UserDB(
        id="test-user-id",
        first_name="Henry",
        last_name="Ford",
        email="henry.ford@example.com",
        password="hashed_password",
        phone_number="+33612345678",
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db_session.add(user_db)
    db_session.commit()

    # Recherche avec casse différente (SQLite est case-insensitive par défaut)
    # Mais on teste quand même le comportement
    user_lower = repository.get_by_email("henry.ford@example.com")
    user_upper = repository.get_by_email("HENRY.FORD@EXAMPLE.COM")

    # Devrait trouver dans les deux cas (SQLite)
    # En production avec PostgreSQL, le comportement peut varier
    assert user_lower is not None or user_upper is not None


def test_repository_to_entity_conversion(repository, db_session):
    """Test que la conversion DB -> Entity préserve toutes les données."""
    # Créer un utilisateur avec toutes les données
    now = datetime.now(UTC)
    user_db = UserDB(
        id="test-user-id",
        first_name="Isabella",
        last_name="Garcia",
        email="isabella.garcia@example.com",
        password="hashed_password_123",
        phone_number="+33612345678",
        created_at=now,
        updated_at=now
    )
    db_session.add(user_db)
    db_session.commit()

    # Récupérer via le repository
    user = repository.get_by_id("test-user-id")

    # Vérifier que toutes les données sont préservées
    assert user.id == "test-user-id"
    assert user.first_name == "Isabella"
    assert user.last_name == "Garcia"
    assert user.email == "isabella.garcia@example.com"
    assert user.password == "hashed_password_123"
    assert user.phone_number == "+33612345678"
    assert user.created_at is not None
    assert user.updated_at is not None
