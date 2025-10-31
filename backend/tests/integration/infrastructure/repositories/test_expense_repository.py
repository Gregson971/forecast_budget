"""Tests d'intégration pour le SQLExpenseRepository."""

import pytest
from datetime import datetime, date, UTC
from decimal import Decimal
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.infrastructure.db.models.user_db import Base, UserDB
from app.infrastructure.db.models.expense_db import ExpenseDB
from app.infrastructure.repositories.expense_repository import SQLExpenseRepository
from app.domain.entities.expense import Expense, ExpenseCategory, ExpenseFrequency


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
    return SQLExpenseRepository(db_session)


def test_create_expense(repository, db_session):
    """Test de création d'une dépense."""
    expense = Expense(
        id="test-expense-id",
        user_id="test-user-id",
        name="Courses",
        amount=Decimal("50.00"),
        date=date.today(),
        category=ExpenseCategory.FOOD,
        description="Supermarché du mois",
        is_recurring=False,
        frequency=None,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )

    created_expense = repository.create(expense)

    # Vérifier que la dépense a été créée
    assert created_expense.id == "test-expense-id"
    assert created_expense.name == "Courses"
    assert created_expense.amount == Decimal("50.00")
    assert created_expense.category == ExpenseCategory.FOOD

    # Vérifier dans la base
    expense_db = db_session.query(ExpenseDB).filter_by(id="test-expense-id").first()
    assert expense_db is not None
    assert expense_db.user_id == "test-user-id"


def test_create_recurring_expense(repository, db_session):
    """Test de création d'une dépense récurrente."""
    expense = Expense(
        id="recurring-expense-id",
        user_id="test-user-id",
        name="Abonnement Netflix",
        amount=Decimal("15.99"),
        date=date.today(),
        category=ExpenseCategory.ENTERTAINMENT,
        description="Abonnement mensuel",
        is_recurring=True,
        frequency=ExpenseFrequency.MONTHLY,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )

    created_expense = repository.create(expense)

    assert created_expense.is_recurring is True
    assert created_expense.frequency == ExpenseFrequency.MONTHLY


def test_get_all_expenses(repository, db_session):
    """Test de récupération de toutes les dépenses d'un utilisateur."""
    # Créer plusieurs dépenses
    expenses = [
        ExpenseDB(
            id=f"expense-{i}",
            user_id="test-user-id",
            name=f"Dépense {i}",
            amount=Decimal(f"{10 * i}.00"),
            date=date.today(),
            category=ExpenseCategory.FOOD,
            description=f"Description {i}",
            is_recurring=False,
            frequency=None,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC)
        )
        for i in range(3)
    ]
    for expense in expenses:
        db_session.add(expense)
    db_session.commit()

    # Récupérer toutes les dépenses
    all_expenses = repository.get_all("test-user-id")

    assert len(all_expenses) == 3
    assert all(isinstance(expense, Expense) for expense in all_expenses)
    assert all(expense.user_id == "test-user-id" for expense in all_expenses)


def test_get_all_expenses_empty(repository):
    """Test de récupération quand l'utilisateur n'a pas de dépenses."""
    expenses = repository.get_all("user-without-expenses")
    assert expenses == []


def test_get_by_id_success(repository, db_session):
    """Test de récupération d'une dépense par ID."""
    # Créer une dépense
    expense_db = ExpenseDB(
        id="test-expense-id",
        user_id="test-user-id",
        name="Restaurant",
        amount=Decimal("45.50"),
        date=date.today(),
        category=ExpenseCategory.FOOD,
        description="Déjeuner d'affaires",
        is_recurring=False,
        frequency=None,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db_session.add(expense_db)
    db_session.commit()

    # Récupérer la dépense
    expense = repository.get_by_id("test-expense-id", "test-user-id")

    assert expense is not None
    assert expense.id == "test-expense-id"
    assert expense.name == "Restaurant"
    assert expense.amount == Decimal("45.50")


def test_get_by_id_not_found(repository):
    """Test de récupération d'une dépense inexistante."""
    with pytest.raises(ValueError, match="Dépense non trouvée"):
        repository.get_by_id("non-existent-id", "test-user-id")


def test_get_by_id_wrong_user(repository, db_session):
    """Test de récupération d'une dépense d'un autre utilisateur."""
    # Créer une dépense pour l'utilisateur de test
    expense_db = ExpenseDB(
        id="test-expense-id",
        user_id="test-user-id",
        name="Dépense privée",
        amount=Decimal("100.00"),
        date=date.today(),
        category=ExpenseCategory.OTHER,
        description="Ma dépense",
        is_recurring=False,
        frequency=None,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db_session.add(expense_db)
    db_session.commit()

    # Tentative de récupération par un autre utilisateur
    with pytest.raises(ValueError, match="Dépense non trouvée"):
        repository.get_by_id("test-expense-id", "other-user-id")


def test_get_by_user_id(repository, db_session):
    """Test de récupération de toutes les dépenses par user_id."""
    # Créer plusieurs dépenses
    expenses = [
        ExpenseDB(
            id=f"expense-{i}",
            user_id="test-user-id",
            name=f"Dépense {i}",
            amount=Decimal(f"{20 * i}.00"),
            date=date.today(),
            category=ExpenseCategory.TRANSPORT,
            description=f"Transport {i}",
            is_recurring=False,
            frequency=None,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC)
        )
        for i in range(2)
    ]
    for expense in expenses:
        db_session.add(expense)
    db_session.commit()

    # Récupérer par user_id
    user_expenses = repository.get_by_user_id("test-user-id")

    assert len(user_expenses) == 2
    assert all(expense.user_id == "test-user-id" for expense in user_expenses)


def test_get_by_user_id_empty(repository):
    """Test de récupération quand l'utilisateur n'a pas de dépenses."""
    expenses = repository.get_by_user_id("user-without-expenses")
    assert expenses == []


def test_update_expense(repository, db_session):
    """Test de mise à jour d'une dépense."""
    # Créer une dépense
    expense_db = ExpenseDB(
        id="test-expense-id",
        user_id="test-user-id",
        name="Ancien nom",
        amount=Decimal("30.00"),
        date=date.today(),
        category=ExpenseCategory.FOOD,
        description="Ancienne description",
        is_recurring=False,
        frequency=None,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db_session.add(expense_db)
    db_session.commit()

    # Mettre à jour
    updated_expense = Expense(
        id="test-expense-id",
        user_id="test-user-id",
        name="Nouveau nom",
        amount=Decimal("35.00"),
        date=date.today(),
        category=ExpenseCategory.FOOD,
        description="Nouvelle description",
        is_recurring=True,
        frequency=ExpenseFrequency.WEEKLY,
        created_at=expense_db.created_at,
        updated_at=datetime.now(UTC)
    )

    result = repository.update(updated_expense, "test-user-id")

    # Vérifier dans la base
    expense_db = db_session.query(ExpenseDB).filter_by(id="test-expense-id").first()
    assert expense_db.name == "Nouveau nom"
    assert expense_db.amount == Decimal("35.00")
    assert expense_db.category == ExpenseCategory.FOOD
    assert expense_db.is_recurring is True
    assert expense_db.frequency == ExpenseFrequency.WEEKLY


def test_update_expense_not_found(repository):
    """Test de mise à jour d'une dépense inexistante."""
    expense = Expense(
        id="non-existent-id",
        user_id="test-user-id",
        name="Test",
        amount=Decimal("10.00"),
        date=date.today(),
        category=ExpenseCategory.OTHER,
        description="Test",
        is_recurring=False,
        frequency=None,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )

    with pytest.raises(ValueError, match="Dépense non trouvée"):
        repository.update(expense, "test-user-id")


def test_update_expense_wrong_user(repository, db_session):
    """Test de mise à jour d'une dépense d'un autre utilisateur."""
    # Créer une dépense
    expense_db = ExpenseDB(
        id="test-expense-id",
        user_id="test-user-id",
        name="Ma dépense",
        amount=Decimal("50.00"),
        date=date.today(),
        category=ExpenseCategory.FOOD,
        description="Ma description",
        is_recurring=False,
        frequency=None,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db_session.add(expense_db)
    db_session.commit()

    # Tentative de mise à jour par un autre utilisateur
    updated_expense = Expense(
        id="test-expense-id",
        user_id="other-user-id",
        name="Nom modifié",
        amount=Decimal("100.00"),
        date=date.today(),
        category=ExpenseCategory.OTHER,
        description="Description modifiée",
        is_recurring=False,
        frequency=None,
        created_at=expense_db.created_at,
        updated_at=datetime.now(UTC)
    )

    with pytest.raises(ValueError, match="Dépense non trouvée"):
        repository.update(updated_expense, "other-user-id")


def test_delete_expense(repository, db_session):
    """Test de suppression d'une dépense."""
    # Créer une dépense
    expense_db = ExpenseDB(
        id="test-expense-id",
        user_id="test-user-id",
        name="À supprimer",
        amount=Decimal("25.00"),
        date=date.today(),
        category=ExpenseCategory.OTHER,
        description="Sera supprimée",
        is_recurring=False,
        frequency=None,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db_session.add(expense_db)
    db_session.commit()

    # Supprimer
    repository.delete("test-expense-id", "test-user-id")

    # Vérifier
    expense_db = db_session.query(ExpenseDB).filter_by(id="test-expense-id").first()
    assert expense_db is None


def test_delete_expense_not_found(repository):
    """Test de suppression d'une dépense inexistante (ne doit pas lever d'erreur)."""
    # Ne doit pas lever d'exception
    repository.delete("non-existent-id", "test-user-id")


def test_delete_expense_wrong_user(repository, db_session):
    """Test de suppression d'une dépense d'un autre utilisateur."""
    # Créer une dépense
    expense_db = ExpenseDB(
        id="test-expense-id",
        user_id="test-user-id",
        name="Dépense protégée",
        amount=Decimal("75.00"),
        date=date.today(),
        category=ExpenseCategory.FOOD,
        description="Ne peut pas être supprimée par un autre utilisateur",
        is_recurring=False,
        frequency=None,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db_session.add(expense_db)
    db_session.commit()

    # Tentative de suppression par un autre utilisateur
    repository.delete("test-expense-id", "other-user-id")

    # Vérifier que la dépense existe toujours
    expense_db = db_session.query(ExpenseDB).filter_by(id="test-expense-id").first()
    assert expense_db is not None


def test_create_expense_with_minimal_data(repository, db_session):
    """Test de création d'une dépense avec données minimales."""
    expense = Expense(
        id="minimal-expense-id",
        user_id="test-user-id",
        name="Minimal",
        amount=Decimal("10.00"),
        date=date.today(),
        category=ExpenseCategory.OTHER,
        description=None,  # Optionnel
        is_recurring=False,
        frequency=None,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )

    created_expense = repository.create(expense)

    assert created_expense.id == "minimal-expense-id"
    assert created_expense.description is None


def test_multiple_users_expenses_isolation(repository, db_session):
    """Test d'isolation des dépenses entre utilisateurs."""
    # Créer un deuxième utilisateur
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

    # Créer des dépenses pour chaque utilisateur
    expense1 = ExpenseDB(
        id="expense-user1",
        user_id="test-user-id",
        name="Dépense User 1",
        amount=Decimal("100.00"),
        date=date.today(),
        category=ExpenseCategory.FOOD,
        description="User 1",
        is_recurring=False,
        frequency=None,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    expense2 = ExpenseDB(
        id="expense-user2",
        user_id="user-2-id",
        name="Dépense User 2",
        amount=Decimal("200.00"),
        date=date.today(),
        category=ExpenseCategory.TRANSPORT,
        description="User 2",
        is_recurring=False,
        frequency=None,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db_session.add(expense1)
    db_session.add(expense2)
    db_session.commit()

    # Vérifier l'isolation
    user1_expenses = repository.get_all("test-user-id")
    user2_expenses = repository.get_all("user-2-id")

    assert len(user1_expenses) == 1
    assert len(user2_expenses) == 1
    assert user1_expenses[0].name == "Dépense User 1"
    assert user2_expenses[0].name == "Dépense User 2"
