"""Tests d'intégration pour les routes des prévisions."""

import pytest
from fastapi.testclient import TestClient
from datetime import datetime, date, UTC, timedelta
from decimal import Decimal

from app.main import app
from app.infrastructure.db.database import SessionLocal
from app.infrastructure.db.models.user_db import UserDB
from app.infrastructure.db.models.expense_db import ExpenseDB
from app.infrastructure.db.models.income_db import IncomeDB
from app.infrastructure.db.models.refresh_token_db import RefreshTokenDB
from app.infrastructure.db.models.session_db import SessionDB
from app.infrastructure.security.password_hasher import PasswordHasher
from app.domain.entities.expense import ExpenseCategory, ExpenseFrequency
from app.domain.entities.income import IncomeCategory, IncomeFrequency
from app.domain.entities.forecast import ForecastPeriod


@pytest.fixture(scope="function", autouse=True)
def clean_db():
    """Nettoie la base de données entre chaque test."""
    yield
    # Nettoyer toutes les tables après chaque test
    # IMPORTANT: Respecter l'ordre des clés étrangères
    db = SessionLocal()
    try:
        db.query(ExpenseDB).delete()
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
def test_expenses_and_incomes(test_user):
    """Crée des dépenses et revenus de test pour les 3 derniers mois."""
    db = SessionLocal()
    try:
        today = date.today()

        # Créer des dépenses récurrentes sur les 3 derniers mois
        for i in range(3):
            expense_date = today - timedelta(days=30*i)

            # Loyer (récurrent mensuel)
            expense = ExpenseDB(
                id=f"expense-rent-{i}",
                user_id="test-user-id",
                name="Loyer",
                amount=Decimal("1000.00"),
                date=expense_date,
                category=ExpenseCategory.HOUSING,
                description="Loyer mensuel",
                is_recurring=True,
                frequency=ExpenseFrequency.MONTHLY,
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC)
            )
            db.add(expense)

            # Courses (non récurrent)
            expense2 = ExpenseDB(
                id=f"expense-food-{i}",
                user_id="test-user-id",
                name="Courses",
                amount=Decimal("300.00"),
                date=expense_date,
                category=ExpenseCategory.FOOD,
                description="Supermarché",
                is_recurring=False,
                frequency=None,
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC)
            )
            db.add(expense2)

        # Créer des revenus récurrents sur les 3 derniers mois
        for i in range(3):
            income_date = today - timedelta(days=30*i)

            # Salaire (récurrent mensuel)
            income = IncomeDB(
                id=f"income-salary-{i}",
                user_id="test-user-id",
                name="Salaire",
                amount=Decimal("3000.00"),
                date=income_date,
                category=IncomeCategory.SALARY,
                description="Salaire mensuel",
                is_recurring=True,
                frequency=IncomeFrequency.MONTHLY,
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC)
            )
            db.add(income)

        db.commit()
    finally:
        db.close()


def test_get_forecast_one_month_empty(client, auth_headers):
    """Test de récupération des prévisions sur 1 mois sans données."""
    response = client.get(
        "/forecasts",
        params={"period": ForecastPeriod.ONE_MONTH.value},
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == "test-user-id"
    assert data["period"] == ForecastPeriod.ONE_MONTH.value
    assert "start_date" in data
    assert "end_date" in data
    assert isinstance(data["expenses_data"], list)
    assert isinstance(data["income_data"], list)
    assert isinstance(data["forecast_expenses"], list)
    assert isinstance(data["forecast_income"], list)
    assert data["total_expenses"] == 0.0
    assert data["total_income"] == 0.0
    assert data["net_balance"] == 0.0


def test_get_forecast_three_months_empty(client, auth_headers):
    """Test de récupération des prévisions sur 3 mois sans données."""
    response = client.get(
        "/forecasts",
        params={"period": ForecastPeriod.THREE_MONTHS.value},
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["period"] == ForecastPeriod.THREE_MONTHS.value


def test_get_forecast_six_months_empty(client, auth_headers):
    """Test de récupération des prévisions sur 6 mois sans données."""
    response = client.get(
        "/forecasts",
        params={"period": ForecastPeriod.SIX_MONTHS.value},
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["period"] == ForecastPeriod.SIX_MONTHS.value


def test_get_forecast_one_year_empty(client, auth_headers):
    """Test de récupération des prévisions sur 1 an sans données."""
    response = client.get(
        "/forecasts",
        params={"period": ForecastPeriod.ONE_YEAR.value},
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["period"] == ForecastPeriod.ONE_YEAR.value


def test_get_forecast_with_data(client, auth_headers, test_expenses_and_incomes):
    """Test de récupération des prévisions avec des données."""
    response = client.get(
        "/forecasts",
        params={"period": ForecastPeriod.THREE_MONTHS.value},
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == "test-user-id"
    assert data["period"] == ForecastPeriod.THREE_MONTHS.value

    # Vérifier que les données historiques sont présentes
    assert len(data["expenses_data"]) > 0
    assert len(data["income_data"]) > 0

    # Vérifier que les totaux sont cohérents
    # 3 mois * (1000 loyer + 300 courses) = 3900
    assert data["total_expenses"] > 0
    # 3 mois * 3000 salaire = 9000
    assert data["total_income"] > 0
    # Net balance devrait être positif
    assert data["net_balance"] > 0

    # Vérifier que les prévisions sont présentes
    assert len(data["forecast_expenses"]) > 0
    assert len(data["forecast_income"]) > 0
    assert data["forecast_total_expenses"] > 0
    assert data["forecast_total_income"] > 0


def test_get_forecast_without_auth(client):
    """Test de récupération des prévisions sans authentification."""
    response = client.get(
        "/forecasts",
        params={"period": ForecastPeriod.ONE_MONTH.value}
    )

    assert response.status_code == 401


def test_get_forecast_invalid_period(client, auth_headers):
    """Test de récupération des prévisions avec une période invalide."""
    response = client.get(
        "/forecasts",
        params={"period": "invalid"},
        headers=auth_headers
    )

    assert response.status_code == 400


def test_get_forecast_missing_period(client, auth_headers):
    """Test de récupération des prévisions sans période."""
    response = client.get(
        "/forecasts",
        headers=auth_headers
    )

    assert response.status_code == 422  # FastAPI validation error


def test_forecast_data_point_structure(client, auth_headers, test_expenses_and_incomes):
    """Test de la structure des points de données dans les prévisions."""
    response = client.get(
        "/forecasts",
        params={"period": ForecastPeriod.ONE_MONTH.value},
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()

    # Vérifier la structure d'un point de données si présent
    if len(data["expenses_data"]) > 0:
        point = data["expenses_data"][0]
        assert "date" in point
        assert "amount" in point
        assert "category" in point or point["category"] is None

    if len(data["income_data"]) > 0:
        point = data["income_data"][0]
        assert "date" in point
        assert "amount" in point
        assert "category" in point or point["category"] is None


def test_forecast_response_metadata(client, auth_headers):
    """Test de la présence des métadonnées dans la réponse."""
    response = client.get(
        "/forecasts",
        params={"period": ForecastPeriod.ONE_MONTH.value},
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()

    # Vérifier la présence de tous les champs requis
    required_fields = [
        "user_id", "period", "start_date", "end_date",
        "expenses_data", "income_data",
        "forecast_expenses", "forecast_income",
        "total_expenses", "total_income", "net_balance",
        "forecast_total_expenses", "forecast_total_income", "forecast_net_balance",
        "created_at", "updated_at"
    ]

    for field in required_fields:
        assert field in data, f"Champ '{field}' manquant dans la réponse"


def test_user_forecast_isolation(client, auth_headers, test_user):
    """Test d'isolation des prévisions entre utilisateurs."""
    # Créer un deuxième utilisateur avec des données
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
        db.commit()

        # Créer une dépense pour user2
        expense2 = ExpenseDB(
            id="expense-user2-id",
            user_id="test-user-2-id",
            name="User2 Expense",
            amount=Decimal("500.00"),
            date=date.today(),
            category=ExpenseCategory.FOOD,
            description="User 2",
            is_recurring=True,
            frequency=ExpenseFrequency.MONTHLY,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC)
        )
        db.add(expense2)

        # Créer un revenu pour user2
        income2 = IncomeDB(
            id="income-user2-id",
            user_id="test-user-2-id",
            name="User2 Income",
            amount=Decimal("5000.00"),
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

    # L'utilisateur 1 ne devrait voir aucune donnée de user2
    response = client.get(
        "/forecasts",
        params={"period": ForecastPeriod.ONE_MONTH.value},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()

    # Les prévisions de user1 ne doivent pas inclure les données de user2
    assert data["total_expenses"] == 0.0
    assert data["total_income"] == 0.0


def test_forecast_with_only_expenses(client, auth_headers, test_user):
    """Test de prévisions avec uniquement des dépenses."""
    db = SessionLocal()
    try:
        expense = ExpenseDB(
            id="expense-only",
            user_id="test-user-id",
            name="Test Expense",
            amount=Decimal("100.00"),
            date=date.today(),
            category=ExpenseCategory.FOOD,
            description="Test",
            is_recurring=False,
            frequency=None,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC)
        )
        db.add(expense)
        db.commit()
    finally:
        db.close()

    response = client.get(
        "/forecasts",
        params={"period": ForecastPeriod.ONE_MONTH.value},
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["total_expenses"] > 0
    assert data["total_income"] == 0.0
    assert data["net_balance"] < 0  # Négatif car seulement des dépenses


def test_forecast_with_only_income(client, auth_headers, test_user):
    """Test de prévisions avec uniquement des revenus."""
    db = SessionLocal()
    try:
        income = IncomeDB(
            id="income-only",
            user_id="test-user-id",
            name="Test Income",
            amount=Decimal("2000.00"),
            date=date.today(),
            category=IncomeCategory.SALARY,
            description="Test",
            is_recurring=False,
            frequency=None,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC)
        )
        db.add(income)
        db.commit()
    finally:
        db.close()

    response = client.get(
        "/forecasts",
        params={"period": ForecastPeriod.ONE_MONTH.value},
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["total_expenses"] == 0.0
    assert data["total_income"] > 0
    assert data["net_balance"] > 0  # Positif car seulement des revenus
