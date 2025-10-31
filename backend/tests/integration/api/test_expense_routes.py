"""Tests d'intégration pour les routes des dépenses."""

import pytest
from fastapi.testclient import TestClient
from datetime import datetime, date, UTC
from decimal import Decimal

from app.main import app
from app.infrastructure.db.database import SessionLocal
from app.infrastructure.db.models.user_db import UserDB
from app.infrastructure.db.models.expense_db import ExpenseDB
from app.infrastructure.db.models.refresh_token_db import RefreshTokenDB
from app.infrastructure.db.models.session_db import SessionDB
from app.infrastructure.security.password_hasher import PasswordHasher
from app.domain.entities.expense import ExpenseCategory, ExpenseFrequency


@pytest.fixture(scope="function", autouse=True)
def clean_db():
    """Nettoie la base de données entre chaque test."""
    yield
    # Nettoyer toutes les tables après chaque test
    # IMPORTANT: Respecter l'ordre des clés étrangères
    db = SessionLocal()
    try:
        db.query(ExpenseDB).delete()
        db.query(RefreshTokenDB).delete()
        db.query(SessionDB).delete()
        db.query(UserDB).delete()
        db.commit()
    finally:
        db.close()


@pytest.fixture
def client():
    """Crée un client de test FastAPI."""
    return TestClient(app)


@pytest.fixture
def test_user():
    """Crée un utilisateur de test."""
    db = SessionLocal()
    try:
        password_hasher = PasswordHasher()
        user = UserDB(
            id="test-user-id",
            first_name="Test",
            last_name="User",
            email="test@example.com",
            password=password_hasher.hash("password123"),
            phone_number="+33612345678",
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC)
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    finally:
        db.close()


@pytest.fixture
def auth_headers(client, test_user):
    """Récupère les headers d'authentification."""
    response = client.post(
        "/auth/login",
        data={
            "username": "test@example.com",
            "password": "password123"
        }
    )
    access_token = response.json()["access_token"]
    return {"Authorization": f"Bearer {access_token}"}


@pytest.fixture
def test_expense(test_user):
    """Crée une dépense de test."""
    db = SessionLocal()
    try:
        expense = ExpenseDB(
            id="test-expense-id",
            user_id="test-user-id",
            name="Test Expense",
            amount=Decimal("50.00"),
            date=date.today(),
            category=ExpenseCategory.FOOD,
            description="Test description",
            is_recurring=False,
            frequency=None,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC)
        )
        db.add(expense)
        db.commit()
        db.refresh(expense)
        return expense
    finally:
        db.close()


def test_get_expense_categories(client):
    """Test de récupération des catégories de dépenses."""
    response = client.get("/expenses/categories")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "value" in data[0]
    assert "label" in data[0]


def test_get_expense_frequencies(client):
    """Test de récupération des fréquences de dépenses."""
    response = client.get("/expenses/frequencies")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "value" in data[0]
    assert "label" in data[0]


def test_create_expense_success(client, auth_headers):
    """Test de création d'une dépense avec succès."""
    response = client.post(
        "/expenses",
        json={
            "name": "Courses",
            "amount": 75.50,
            "date": date.today().isoformat(),
            "category": ExpenseCategory.FOOD.value,
            "description": "Supermarché",
            "is_recurring": False,
            "frequency": None
        },
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Courses"
    assert float(data["amount"]) == 75.50
    assert data["category"] == ExpenseCategory.FOOD.value
    assert "id" in data


def test_create_expense_recurring(client, auth_headers):
    """Test de création d'une dépense récurrente."""
    response = client.post(
        "/expenses",
        json={
            "name": "Netflix",
            "amount": 15.99,
            "date": date.today().isoformat(),
            "category": ExpenseCategory.ENTERTAINMENT.value,
            "description": "Abonnement mensuel",
            "is_recurring": True,
            "frequency": ExpenseFrequency.MONTHLY.value
        },
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["is_recurring"] is True
    assert data["frequency"] == ExpenseFrequency.MONTHLY.value


def test_create_expense_without_auth(client):
    """Test de création sans authentification."""
    response = client.post(
        "/expenses",
        json={
            "name": "Test",
            "amount": 10.0,
            "date": date.today().isoformat(),
            "category": ExpenseCategory.OTHER.value
        }
    )

    assert response.status_code == 401


def test_list_expenses_empty(client, auth_headers):
    """Test de listage sans dépenses."""
    response = client.get("/expenses", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0


def test_list_expenses_with_data(client, auth_headers, test_expense):
    """Test de listage avec des dépenses."""
    response = client.get("/expenses", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["id"] == "test-expense-id"
    assert data[0]["name"] == "Test Expense"


def test_list_expenses_without_auth(client):
    """Test de listage sans authentification."""
    response = client.get("/expenses")

    assert response.status_code == 401


def test_get_expense_success(client, auth_headers, test_expense):
    """Test de récupération d'une dépense."""
    response = client.get(
        f"/expenses/{test_expense.id}",
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "test-expense-id"
    assert data["name"] == "Test Expense"
    assert float(data["amount"]) == 50.0


def test_get_expense_not_found(client, auth_headers):
    """Test de récupération d'une dépense inexistante."""
    response = client.get(
        "/expenses/non-existent-id",
        headers=auth_headers
    )

    assert response.status_code == 400


def test_get_expense_without_auth(client, test_expense):
    """Test de récupération sans authentification."""
    response = client.get(f"/expenses/{test_expense.id}")

    assert response.status_code == 401


def test_update_expense_success(client, auth_headers, test_expense):
    """Test de mise à jour d'une dépense."""
    response = client.put(
        f"/expenses/{test_expense.id}",
        json={
            "id": test_expense.id,
            "user_id": "test-user-id",
            "name": "Updated Expense",
            "amount": 100.0,
            "date": date.today().isoformat(),
            "category": ExpenseCategory.TRANSPORT.value,
            "description": "Updated description",
            "is_recurring": False,
            "frequency": None,
            "created_at": test_expense.created_at.isoformat(),
            "updated_at": datetime.now(UTC).isoformat()
        },
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Expense"
    assert float(data["amount"]) == 100.0
    assert data["category"] == ExpenseCategory.TRANSPORT.value


def test_update_expense_not_found(client, auth_headers):
    """Test de mise à jour d'une dépense inexistante."""
    response = client.put(
        "/expenses/non-existent-id",
        json={
            "id": "non-existent-id",
            "user_id": "test-user-id",
            "name": "Test",
            "amount": 10.0,
            "date": date.today().isoformat(),
            "category": ExpenseCategory.OTHER.value,
            "description": None,
            "is_recurring": False,
            "frequency": None,
            "created_at": datetime.now(UTC).isoformat(),
            "updated_at": datetime.now(UTC).isoformat()
        },
        headers=auth_headers
    )

    assert response.status_code == 400


def test_update_expense_without_auth(client, test_expense):
    """Test de mise à jour sans authentification."""
    response = client.put(
        f"/expenses/{test_expense.id}",
        json={
            "id": test_expense.id,
            "user_id": "test-user-id",
            "name": "Updated",
            "amount": 50.0,
            "date": date.today().isoformat(),
            "category": ExpenseCategory.FOOD.value,
            "description": None,
            "is_recurring": False,
            "frequency": None,
            "created_at": datetime.now(UTC).isoformat(),
            "updated_at": datetime.now(UTC).isoformat()
        }
    )

    assert response.status_code == 401


def test_delete_expense_success(client, auth_headers, test_expense):
    """Test de suppression d'une dépense."""
    response = client.delete(
        f"/expenses/{test_expense.id}",
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert "message" in data

    # Vérifier que la dépense a bien été supprimée
    response = client.get(
        f"/expenses/{test_expense.id}",
        headers=auth_headers
    )
    assert response.status_code == 400


def test_delete_expense_not_found(client, auth_headers):
    """Test de suppression d'une dépense inexistante."""
    response = client.delete(
        "/expenses/non-existent-id",
        headers=auth_headers
    )

    # La suppression d'une dépense inexistante ne devrait pas lever d'erreur
    # mais retourner un message de succès ou une erreur 400
    assert response.status_code in [200, 400]


def test_delete_expense_without_auth(client, test_expense):
    """Test de suppression sans authentification."""
    response = client.delete(f"/expenses/{test_expense.id}")

    assert response.status_code == 401


def test_user_expense_isolation(client, auth_headers, test_user):
    """Test d'isolation des dépenses entre utilisateurs."""
    # Créer un deuxième utilisateur
    db = SessionLocal()
    try:
        password_hasher = PasswordHasher()
        user2 = UserDB(
            id="test-user-2-id",
            first_name="User",
            last_name="Two",
            email="user2@example.com",
            password=password_hasher.hash("password123"),
            phone_number="+33687654321",
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC)
        )
        db.add(user2)
        db.commit()  # Commit user2 first before creating expense

        # Créer une dépense pour user2
        expense2 = ExpenseDB(
            id="expense-user2-id",
            user_id="test-user-2-id",
            name="User2 Expense",
            amount=Decimal("200.00"),
            date=date.today(),
            category=ExpenseCategory.FOOD,
            description="User 2",
            is_recurring=False,
            frequency=None,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC)
        )
        db.add(expense2)
        db.commit()
    finally:
        db.close()

    # L'utilisateur 1 ne devrait voir que ses propres dépenses
    response = client.get("/expenses", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 0  # Aucune dépense pour user1

    # L'utilisateur 1 ne devrait pas pouvoir accéder à la dépense de user2
    response = client.get("/expenses/expense-user2-id", headers=auth_headers)
    assert response.status_code == 400
