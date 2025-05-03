"""Tests pour le cas d'utilisation de rafraîchissement de token."""

from datetime import datetime, UTC
from uuid import uuid4

import pytest
from fastapi import HTTPException

from app.domain.entities.session import Session
from app.domain.entities.user import User
from app.use_cases.auth.refresh_token import RefreshToken


class MockSessionRepository:
    """Mock du repository de session."""

    def __init__(self, session: Session | None = None):
        self.session = session

    def get_by_refresh_token(self, refresh_token: str) -> Session | None:
        """Retourne la session mockée."""
        if self.session and self.session.refresh_token == refresh_token:
            return self.session
        return None


class MockUserRepository:
    """Mock du repository d'utilisateur."""

    def __init__(self, user_exists: bool = True):
        self.user_exists = user_exists

    def get_by_id(self, user_id: str) -> User | None:
        """Retourne un utilisateur mocké ou None."""
        if self.user_exists:
            return User(
                id=user_id,
                email="test@example.com",
                first_name="Test",
                last_name="User",
                password="hashed_password",
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC),
            )
        return None


def test_refresh_access_token_success():
    """Test le rafraîchissement réussi d'un token."""
    # Arrange
    refresh_token = "valid_refresh_token"
    user_id = str(uuid4())
    session = Session(
        id=uuid4(),
        user_id=user_id,
        refresh_token=refresh_token,
        user_agent="test_agent",
        ip_address="127.0.0.1",
        created_at=datetime.now(UTC),
    )
    session_repo = MockSessionRepository(session)
    user_repo = MockUserRepository()
    refresh_token_uc = RefreshToken(session_repo, user_repo)

    # Act
    result = refresh_token_uc.refresh_access_token(refresh_token)

    # Assert
    assert result is not None
    assert isinstance(result, str)


def test_refresh_access_token_invalid_session():
    """Test le rafraîchissement avec une session invalide."""
    # Arrange
    refresh_token = "invalid_refresh_token"
    session_repo = MockSessionRepository(None)
    user_repo = MockUserRepository()
    refresh_token_uc = RefreshToken(session_repo, user_repo)

    # Act & Assert
    with pytest.raises(HTTPException) as exc_info:
        refresh_token_uc.refresh_access_token(refresh_token)
    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Session expirée ou invalide"


def test_refresh_access_token_revoked_session():
    """Test le rafraîchissement avec une session révoquée."""
    # Arrange
    refresh_token = "revoked_refresh_token"
    user_id = str(uuid4())
    session = Session(
        id=uuid4(),
        user_id=user_id,
        refresh_token=refresh_token,
        user_agent="test_agent",
        ip_address="127.0.0.1",
        created_at=datetime.now(UTC),
        revoked=True,
    )
    session_repo = MockSessionRepository(session)
    user_repo = MockUserRepository()
    refresh_token_uc = RefreshToken(session_repo, user_repo)

    # Act & Assert
    with pytest.raises(HTTPException) as exc_info:
        refresh_token_uc.refresh_access_token(refresh_token)
    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Session expirée ou invalide"


def test_refresh_access_token_user_not_found():
    """Test le rafraîchissement avec un utilisateur introuvable."""
    # Arrange
    refresh_token = "valid_refresh_token"
    user_id = str(uuid4())
    session = Session(
        id=uuid4(),
        user_id=user_id,
        refresh_token=refresh_token,
        user_agent="test_agent",
        ip_address="127.0.0.1",
        created_at=datetime.now(UTC),
    )
    session_repo = MockSessionRepository(session)
    user_repo = MockUserRepository(user_exists=False)
    refresh_token_uc = RefreshToken(session_repo, user_repo)

    # Act & Assert
    with pytest.raises(HTTPException) as exc_info:
        refresh_token_uc.refresh_access_token(refresh_token)
    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Utilisateur introuvable"
