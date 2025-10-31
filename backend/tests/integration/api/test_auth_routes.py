"""Tests d'intégration pour les routes d'authentification."""

import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timedelta, UTC

from app.main import app
from app.infrastructure.db.database import SessionLocal
from app.infrastructure.db.models.user_db import UserDB
from app.infrastructure.db.models.password_reset_code_db import PasswordResetCodeDB
from app.infrastructure.db.models.refresh_token_db import RefreshTokenDB
from app.infrastructure.db.models.session_db import SessionDB
from app.infrastructure.security.password_hasher import PasswordHasher


@pytest.fixture(scope="function", autouse=True)
def clean_db():
    """Nettoie la base de données entre chaque test."""
    yield
    # Nettoyer toutes les tables après chaque test
    # IMPORTANT: Respecter l'ordre des clés étrangères (supprimer les enfants avant les parents)
    db = SessionLocal()
    try:
        db.query(PasswordResetCodeDB).delete()
        db.query(RefreshTokenDB).delete()
        db.query(SessionDB).delete()  # Doit être supprimé avant UserDB
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


def test_register_user_success(client):
    """Test d'inscription d'un utilisateur avec succès."""
    response = client.post(
        "/auth/register",
        json={
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "password": "securepassword123"
        }
    )

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "john.doe@example.com"
    assert data["first_name"] == "John"
    assert data["last_name"] == "Doe"
    assert "id" in data
    assert "message" in data


def test_register_user_duplicate_email(client, test_user):
    """Test d'inscription avec un email déjà existant."""
    response = client.post(
        "/auth/register",
        json={
            "first_name": "Another",
            "last_name": "User",
            "email": "test@example.com",  # Email déjà utilisé
            "password": "password123"
        }
    )

    assert response.status_code == 400


def test_login_user_success(client, test_user):
    """Test de connexion avec des identifiants valides."""
    response = client.post(
        "/auth/login",
        data={
            "username": "test@example.com",
            "password": "password123"
        }
    )

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "Bearer"


def test_login_user_invalid_credentials(client, test_user):
    """Test de connexion avec des identifiants invalides."""
    response = client.post(
        "/auth/login",
        data={
            "username": "test@example.com",
            "password": "wrongpassword"
        }
    )

    assert response.status_code == 401


def test_login_user_non_existent(client):
    """Test de connexion avec un utilisateur inexistant."""
    response = client.post(
        "/auth/login",
        data={
            "username": "nonexistent@example.com",
            "password": "password123"
        }
    )

    assert response.status_code == 401


def test_get_me_with_valid_token(client, test_user):
    """Test de récupération du profil utilisateur avec un token valide."""
    # D'abord se connecter
    login_response = client.post(
        "/auth/login",
        data={
            "username": "test@example.com",
            "password": "password123"
        }
    )
    access_token = login_response.json()["access_token"]

    # Récupérer le profil
    response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["first_name"] == "Test"
    assert data["last_name"] == "User"


def test_get_me_without_token(client):
    """Test de récupération du profil sans token."""
    response = client.get("/auth/me")
    assert response.status_code == 401


def test_refresh_token_success(client, test_user):
    """Test de rafraîchissement du token avec succès."""
    # Se connecter
    login_response = client.post(
        "/auth/login",
        data={
            "username": "test@example.com",
            "password": "password123"
        }
    )
    refresh_token = login_response.json()["refresh_token"]

    # Rafraîchir le token
    response = client.post(
        "/auth/refresh",
        json={"refresh_token": refresh_token}
    )

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "Bearer"


def test_refresh_token_invalid(client):
    """Test de rafraîchissement avec un token invalide."""
    response = client.post(
        "/auth/refresh",
        json={"refresh_token": "invalid_token"}
    )

    assert response.status_code == 401


def test_logout_user(client, test_user):
    """Test de déconnexion."""
    # Se connecter
    login_response = client.post(
        "/auth/login",
        data={
            "username": "test@example.com",
            "password": "password123"
        }
    )
    refresh_token = login_response.json()["refresh_token"]

    # Se déconnecter
    response = client.post(
        "/auth/logout",
        json={"refresh_token": refresh_token}
    )

    assert response.status_code == 200
    data = response.json()
    assert "message" in data


def test_list_user_sessions(client, test_user):
    """Test de récupération des sessions utilisateur."""
    # Se connecter
    login_response = client.post(
        "/auth/login",
        data={
            "username": "test@example.com",
            "password": "password123"
        }
    )
    access_token = login_response.json()["access_token"]

    # Lister les sessions
    response = client.get(
        "/auth/me/sessions",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1  # Au moins la session actuelle


def test_request_password_reset_with_email(client, test_user):
    """Test de demande de réinitialisation de mot de passe par email."""
    response = client.post(
        "/auth/request-password-reset",
        json={"email": "test@example.com"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "code" in data["message"].lower() or "sms" in data["message"].lower()


def test_request_password_reset_with_phone(client, test_user):
    """Test de demande de réinitialisation de mot de passe par téléphone."""
    response = client.post(
        "/auth/request-password-reset",
        json={"phone_number": "+33612345678"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_request_password_reset_no_identifier(client):
    """Test de demande sans email ni téléphone."""
    response = client.post(
        "/auth/request-password-reset",
        json={}
    )

    assert response.status_code == 400


def test_request_password_reset_user_not_found(client):
    """Test de demande pour un utilisateur inexistant."""
    response = client.post(
        "/auth/request-password-reset",
        json={"email": "nonexistent@example.com"}
    )

    assert response.status_code == 400


def test_verify_reset_code_success(client, test_user):
    """Test de vérification du code et réinitialisation du mot de passe."""
    # D'abord créer un code de réinitialisation
    db = SessionLocal()
    try:
        reset_code = PasswordResetCodeDB(
            id="test-code-id",
            user_id="test-user-id",
            code="123456",
            expires_at=datetime.now(UTC) + timedelta(hours=1),  # Expire dans 1 heure
            created_at=datetime.now(UTC),
            used=False
        )
        db.add(reset_code)
        db.commit()
    finally:
        db.close()

    # Vérifier le code et réinitialiser
    response = client.post(
        "/auth/verify-reset-code",
        json={
            "code": "123456",
            "new_password": "newpassword123"
        }
    )

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_verify_reset_code_invalid(client):
    """Test de vérification avec un code invalide."""
    response = client.post(
        "/auth/verify-reset-code",
        json={
            "code": "999999",
            "new_password": "newpassword123"
        }
    )

    assert response.status_code == 400


def test_verify_reset_code_short_password(client, test_user):
    """Test avec un mot de passe trop court."""
    # Créer un code
    db = SessionLocal()
    try:
        reset_code = PasswordResetCodeDB(
            id="test-code-id-2",
            user_id="test-user-id",
            code="654321",
            expires_at=datetime.now(UTC) + timedelta(hours=1),
            created_at=datetime.now(UTC),
            used=False
        )
        db.add(reset_code)
        db.commit()
    finally:
        db.close()

    response = client.post(
        "/auth/verify-reset-code",
        json={
            "code": "654321",
            "new_password": "short"  # Moins de 8 caractères
        }
    )

    assert response.status_code == 400
