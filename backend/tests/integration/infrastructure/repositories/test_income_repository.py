"""Tests d'intégration pour le SQLIncomeRepository."""

import pytest
from datetime import datetime, date, UTC
from decimal import Decimal
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.infrastructure.db.models.user_db import Base, UserDB
from app.infrastructure.db.models.income_db import IncomeDB
from app.infrastructure.repositories.income_repository import SQLIncomeRepository
from app.domain.entities.income import Income, IncomeCategory, IncomeFrequency


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
    return SQLIncomeRepository(db_session)


def test_create_income(repository, db_session):
    """Test de création d'un revenu."""
    income = Income(
        id="test-income-id",
        user_id="test-user-id",
        name="Salaire",
        amount=Decimal("3000.00"),
        date=date.today(),
        category=IncomeCategory.SALARY,
        description="Salaire mensuel",
        is_recurring=True,
        frequency=IncomeFrequency.MONTHLY,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )

    created_income = repository.create(income)

    assert created_income.id == "test-income-id"
    assert created_income.name == "Salaire"
    assert created_income.amount == Decimal("3000.00")
    assert created_income.category == IncomeCategory.SALARY
    assert created_income.is_recurring is True
    assert created_income.frequency == IncomeFrequency.MONTHLY


def test_get_by_id_success(repository, db_session):
    """Test de récupération d'un revenu par ID."""
    income_db = IncomeDB(
        id="test-income-id",
        user_id="test-user-id",
        name="Freelance",
        amount=Decimal("1500.00"),
        date=date.today(),
        category=IncomeCategory.FREELANCE,
        description="Mission client",
        is_recurring=False,
        frequency=None,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db_session.add(income_db)
    db_session.commit()

    income = repository.get_by_id("test-income-id", "test-user-id")

    assert income is not None
    assert income.id == "test-income-id"
    assert income.name == "Freelance"
    assert income.amount == Decimal("1500.00")


def test_get_by_id_not_found(repository):
    """Test de récupération d'un revenu inexistant."""
    income = repository.get_by_id("non-existent-id", "test-user-id")
    assert income is None


def test_get_by_id_wrong_user(repository, db_session):
    """Test de récupération d'un revenu d'un autre utilisateur."""
    income_db = IncomeDB(
        id="test-income-id",
        user_id="test-user-id",
        name="Mon revenu",
        amount=Decimal("500.00"),
        date=date.today(),
        category=IncomeCategory.OTHER,
        description="Privé",
        is_recurring=False,
        frequency=None,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db_session.add(income_db)
    db_session.commit()

    income = repository.get_by_id("test-income-id", "other-user-id")
    assert income is None


def test_get_all_by_user_id(repository, db_session):
    """Test de récupération de tous les revenus par user_id."""
    incomes = [
        IncomeDB(
            id=f"income-{i}",
            user_id="test-user-id",
            name=f"Revenu {i}",
            amount=Decimal(f"{1000 * i}.00"),
            date=date.today(),
            category=IncomeCategory.SALARY,
            description=f"Description {i}",
            is_recurring=False,
            frequency=None,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC)
        )
        for i in range(3)
    ]
    for income in incomes:
        db_session.add(income)
    db_session.commit()

    user_incomes = repository.get_all_by_user_id("test-user-id")

    assert len(user_incomes) == 3
    assert all(income.user_id == "test-user-id" for income in user_incomes)


def test_get_all_by_user_id_empty(repository):
    """Test de récupération quand l'utilisateur n'a pas de revenus."""
    incomes = repository.get_all_by_user_id("user-without-incomes")
    assert incomes == []


def test_get_all_by_user_id_with_pagination(repository, db_session):
    """Test de récupération avec pagination."""
    # Créer 5 revenus
    for i in range(5):
        income = IncomeDB(
            id=f"income-{i}",
            user_id="test-user-id",
            name=f"Revenu {i}",
            amount=Decimal("100.00"),
            date=date.today(),
            category=IncomeCategory.SALARY,
            description=None,
            is_recurring=False,
            frequency=None,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC)
        )
        db_session.add(income)
    db_session.commit()

    # Récupérer les 3 premiers
    incomes = repository.get_all_by_user_id("test-user-id", skip=0, limit=3)
    assert len(incomes) == 3

    # Récupérer les 2 suivants
    incomes = repository.get_all_by_user_id("test-user-id", skip=3, limit=3)
    assert len(incomes) == 2


def test_update_income(repository, db_session):
    """Test de mise à jour d'un revenu."""
    income_db = IncomeDB(
        id="test-income-id",
        user_id="test-user-id",
        name="Ancien nom",
        amount=Decimal("1000.00"),
        date=date.today(),
        category=IncomeCategory.SALARY,
        description="Ancienne description",
        is_recurring=False,
        frequency=None,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db_session.add(income_db)
    db_session.commit()

    updated_income = Income(
        id="test-income-id",
        user_id="test-user-id",
        name="Nouveau nom",
        amount=Decimal("1200.00"),
        date=date.today(),
        category=IncomeCategory.BONUS,
        description="Nouvelle description",
        is_recurring=True,
        frequency=IncomeFrequency.YEARLY,
        created_at=income_db.created_at,
        updated_at=datetime.now(UTC)
    )

    result = repository.update(updated_income)

    assert result is not None
    assert result.name == "Nouveau nom"
    assert result.amount == Decimal("1200.00")
    assert result.category == IncomeCategory.BONUS
    assert result.is_recurring is True
    assert result.frequency == IncomeFrequency.YEARLY


def test_update_income_not_found(repository):
    """Test de mise à jour d'un revenu inexistant."""
    income = Income(
        id="non-existent-id",
        user_id="test-user-id",
        name="Test",
        amount=Decimal("100.00"),
        date=date.today(),
        category=IncomeCategory.OTHER,
        description="Test",
        is_recurring=False,
        frequency=None,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )

    result = repository.update(income)
    assert result is None


def test_delete_income(repository, db_session):
    """Test de suppression d'un revenu."""
    income_db = IncomeDB(
        id="test-income-id",
        user_id="test-user-id",
        name="À supprimer",
        amount=Decimal("500.00"),
        date=date.today(),
        category=IncomeCategory.OTHER,
        description="Sera supprimé",
        is_recurring=False,
        frequency=None,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db_session.add(income_db)
    db_session.commit()

    result = repository.delete("test-income-id", "test-user-id")

    assert result is True
    income_db = db_session.query(IncomeDB).filter_by(id="test-income-id").first()
    assert income_db is None


def test_delete_income_not_found(repository):
    """Test de suppression d'un revenu inexistant."""
    result = repository.delete("non-existent-id", "test-user-id")
    assert result is False


def test_delete_income_wrong_user(repository, db_session):
    """Test de suppression d'un revenu d'un autre utilisateur."""
    income_db = IncomeDB(
        id="test-income-id",
        user_id="test-user-id",
        name="Protégé",
        amount=Decimal("1000.00"),
        date=date.today(),
        category=IncomeCategory.SALARY,
        description="Ne peut pas être supprimé",
        is_recurring=False,
        frequency=None,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db_session.add(income_db)
    db_session.commit()

    result = repository.delete("test-income-id", "other-user-id")

    assert result is False
    income_db = db_session.query(IncomeDB).filter_by(id="test-income-id").first()
    assert income_db is not None


def test_create_income_with_minimal_data(repository, db_session):
    """Test de création d'un revenu avec données minimales."""
    income = Income(
        id="minimal-income-id",
        user_id="test-user-id",
        name="Minimal",
        amount=Decimal("100.00"),
        date=date.today(),
        category=IncomeCategory.OTHER,
        description=None,
        is_recurring=False,
        frequency=None,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )

    created_income = repository.create(income)

    assert created_income.id == "minimal-income-id"
    assert created_income.description is None


def test_multiple_users_incomes_isolation(repository, db_session):
    """Test d'isolation des revenus entre utilisateurs."""
    user2 = UserDB(
        id="user-2-id",
        first_name="User",
        last_name="Two",
        email="user2@example.com",
        password="password",
        phone_number="+33687654321",
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db_session.add(user2)
    db_session.commit()

    income1 = IncomeDB(
        id="income-user1",
        user_id="test-user-id",
        name="Revenu User 1",
        amount=Decimal("2000.00"),
        date=date.today(),
        category=IncomeCategory.SALARY,
        description="User 1",
        is_recurring=False,
        frequency=None,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    income2 = IncomeDB(
        id="income-user2",
        user_id="user-2-id",
        name="Revenu User 2",
        amount=Decimal("3000.00"),
        date=date.today(),
        category=IncomeCategory.FREELANCE,
        description="User 2",
        is_recurring=False,
        frequency=None,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db_session.add(income1)
    db_session.add(income2)
    db_session.commit()

    user1_incomes = repository.get_all_by_user_id("test-user-id")
    user2_incomes = repository.get_all_by_user_id("user-2-id")

    assert len(user1_incomes) == 1
    assert len(user2_incomes) == 1
    assert user1_incomes[0].name == "Revenu User 1"
    assert user2_incomes[0].name == "Revenu User 2"
