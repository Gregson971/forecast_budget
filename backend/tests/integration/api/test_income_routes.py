"""Tests d'intégration pour les routes des revenus."""

import pytest
from fastapi.testclient import TestClient
from datetime import datetime, date, UTC
from decimal import Decimal

from app.main import app
from app.infrastructure.db.database import SessionLocal
from app.infrastructure.db.models.user_db import UserDB
from app.infrastructure.db.models.income_db import IncomeDB
from app.infrastructure.db.models.refresh_token_db import RefreshTokenDB
from app.infrastructure.db.models.session_db import SessionDB
from app.infrastructure.security.password_hasher import PasswordHasher
from app.domain.entities.income import IncomeCategory, IncomeFrequency


@pytest.fixture(scope="function", autouse=True)
def clean_db():
    """Nettoie la base de données entre chaque test."""
    yield
    # Nettoyer toutes les tables après chaque test
    # IMPORTANT: Respecter l'ordre des clés étrangères
    db = SessionLocal()
    try:
        db.query(IncomeDB).delete()
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
def test_income(test_user):
    """Crée un revenu de test."""
    db = SessionLocal()
    try:
        income = IncomeDB(
            id="test-income-id",
            user_id="test-user-id",
            name="Test Salary",
            amount=Decimal("3000.00"),
            date=date.today(),
            category=IncomeCategory.SALARY,
            description="Test description",
            is_recurring=True,
            frequency=IncomeFrequency.MONTHLY,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC)
        )
        db.add(income)
        db.commit()
        db.refresh(income)
        return income
    finally:
        db.close()


def test_get_income_categories(client):
    """Test de récupération des catégories de revenus."""
    response = client.get("/incomes/categories")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "value" in data[0]
    assert "label" in data[0]


def test_get_income_frequencies(client):
    """Test de récupération des fréquences de revenus."""
    response = client.get("/incomes/frequencies")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "value" in data[0]
    assert "label" in data[0]


def test_create_income_success(client, auth_headers):
    """Test de création d'un revenu avec succès."""
    response = client.post(
        "/incomes",
        json={
            "name": "Freelance",
            "amount": 1500.00,
            "date": date.today().isoformat(),
            "category": IncomeCategory.FREELANCE.value,
            "description": "Projet client",
            "is_recurring": False,
            "frequency": None
        },
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Freelance"
    assert float(data["amount"]) == 1500.00
    assert data["category"] == IncomeCategory.FREELANCE.value
    assert "id" in data


def test_create_income_recurring(client, auth_headers):
    """Test de création d'un revenu récurrent."""
    response = client.post(
        "/incomes",
        json={
            "name": "Salaire",
            "amount": 3000.00,
            "date": date.today().isoformat(),
            "category": IncomeCategory.SALARY.value,
            "description": "Salaire mensuel",
            "is_recurring": True,
            "frequency": IncomeFrequency.MONTHLY.value
        },
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["is_recurring"] is True
    assert data["frequency"] == IncomeFrequency.MONTHLY.value


def test_create_income_without_auth(client):
    """Test de création sans authentification."""
    response = client.post(
        "/incomes",
        json={
            "name": "Test",
            "amount": 100.0,
            "date": date.today().isoformat(),
            "category": IncomeCategory.OTHER.value
        }
    )

    assert response.status_code == 401


def test_list_incomes_empty(client, auth_headers):
    """Test de listage sans revenus."""
    response = client.get("/incomes", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0


def test_list_incomes_with_data(client, auth_headers, test_income):
    """Test de listage avec des revenus."""
    response = client.get("/incomes", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["id"] == "test-income-id"
    assert data[0]["name"] == "Test Salary"


def test_list_incomes_without_auth(client):
    """Test de listage sans authentification."""
    response = client.get("/incomes")

    assert response.status_code == 401


def test_get_income_success(client, auth_headers, test_income):
    """Test de récupération d'un revenu."""
    response = client.get(
        f"/incomes/{test_income.id}",
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "test-income-id"
    assert data["name"] == "Test Salary"
    assert float(data["amount"]) == 3000.0


def test_get_income_not_found(client, auth_headers):
    """Test de récupération d'un revenu inexistant."""
    response = client.get(
        "/incomes/non-existent-id",
        headers=auth_headers
    )

    assert response.status_code == 400


def test_get_income_without_auth(client, test_income):
    """Test de récupération sans authentification."""
    response = client.get(f"/incomes/{test_income.id}")

    assert response.status_code == 401


def test_update_income_success(client, auth_headers, test_income):
    """Test de mise à jour d'un revenu."""
    response = client.put(
        f"/incomes/{test_income.id}",
        json={
            "name": "Updated Salary",
            "amount": 3500.0,
            "date": date.today().isoformat(),
            "category": IncomeCategory.SALARY.value,
            "description": "Updated description",
            "is_recurring": True,
            "frequency": IncomeFrequency.MONTHLY.value
        },
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Salary"
    assert float(data["amount"]) == 3500.0


def test_update_income_not_found(client, auth_headers):
    """Test de mise à jour d'un revenu inexistant."""
    response = client.put(
        "/incomes/non-existent-id",
        json={
            "name": "Test",
            "amount": 100.0,
            "date": date.today().isoformat(),
            "category": IncomeCategory.OTHER.value,
            "description": None,
            "is_recurring": False,
            "frequency": None
        },
        headers=auth_headers
    )

    assert response.status_code == 400


def test_update_income_without_auth(client, test_income):
    """Test de mise à jour sans authentification."""
    response = client.put(
        f"/incomes/{test_income.id}",
        json={
            "name": "Updated",
            "amount": 3000.0,
            "date": date.today().isoformat(),
            "category": IncomeCategory.SALARY.value,
            "description": None,
            "is_recurring": True,
            "frequency": IncomeFrequency.MONTHLY.value
        }
    )

    assert response.status_code == 401


def test_delete_income_success(client, auth_headers, test_income):
    """Test de suppression d'un revenu."""
    response = client.delete(
        f"/incomes/{test_income.id}",
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert "message" in data

    # Vérifier que le revenu a bien été supprimé
    response = client.get(
        f"/incomes/{test_income.id}",
        headers=auth_headers
    )
    assert response.status_code == 400


def test_delete_income_not_found(client, auth_headers):
    """Test de suppression d'un revenu inexistant."""
    response = client.delete(
        "/incomes/non-existent-id",
        headers=auth_headers
    )

    # La suppression d'un revenu inexistant devrait retourner une erreur 400
    assert response.status_code == 400


def test_delete_income_without_auth(client, test_income):
    """Test de suppression sans authentification."""
    response = client.delete(f"/incomes/{test_income.id}")

    assert response.status_code == 401


def test_user_income_isolation(client, auth_headers, test_user):
    """Test d'isolation des revenus entre utilisateurs."""
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
        db.commit()  # Commit user2 first before creating income

        # Créer un revenu pour user2
        income2 = IncomeDB(
            id="income-user2-id",
            user_id="test-user-2-id",
            name="User2 Income",
            amount=Decimal("2000.00"),
            date=date.today(),
            category=IncomeCategory.SALARY,
            description="User 2",
            is_recurring=True,
            frequency=IncomeFrequency.MONTHLY,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC)
        )
        db.add(income2)
        db.commit()
    finally:
        db.close()

    # L'utilisateur 1 ne devrait voir que ses propres revenus
    response = client.get("/incomes", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 0  # Aucun revenu pour user1

    # L'utilisateur 1 ne devrait pas pouvoir accéder au revenu de user2
    response = client.get("/incomes/income-user2-id", headers=auth_headers)
    assert response.status_code == 400
