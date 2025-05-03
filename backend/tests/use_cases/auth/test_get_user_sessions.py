"""Tests pour le cas d'utilisation GetUserSessions."""

from datetime import datetime
import pytest
from app.domain.entities.session import Session
from app.use_cases.auth.get_user_sessions import GetUserSessions


class MockSessionRepository:
    """Repository mock pour les tests."""

    def __init__(self):
        self.sessions = []

    def get_all_by_user_id(self, user_id: str) -> list[Session]:
        """Récupère toutes les sessions d'un utilisateur."""
        return [session for session in self.sessions if session.user_id == user_id]


@pytest.fixture
def session_repository():
    """Fixture pour le repository de sessions."""
    return MockSessionRepository()


@pytest.fixture
def get_user_sessions(session_repository):
    """Fixture pour le cas d'utilisation GetUserSessions."""
    return GetUserSessions(session_repository)


def test_get_user_sessions_returns_user_sessions(get_user_sessions, session_repository):
    """Test pour le cas d'utilisation GetUserSessions."""
    # Arrange
    user_id = "user123"
    session1 = Session(
        id="session1",
        user_id=user_id,
        refresh_token="refresh_token1",
        user_agent="Mozilla/5.0",
        ip_address="127.0.0.1",
        created_at=datetime.now(),
    )
    session2 = Session(
        id="session2",
        user_id=user_id,
        refresh_token="refresh_token2",
        user_agent="Mozilla/5.0",
        ip_address="127.0.0.1",
        created_at=datetime.now(),
    )
    session_repository.sessions = [session1, session2]

    # Act
    result = get_user_sessions.execute(user_id)

    # Assert
    assert len(result) == 2
    assert result[0].id == "session1"
    assert result[1].id == "session2"


def test_get_user_sessions_returns_empty_list_when_no_sessions(
    get_user_sessions, session_repository
):
    """Test pour le cas d'utilisation GetUserSessions lorsque l'utilisateur n'a pas de sessions."""
    # Arrange
    user_id = "user123"
    session_repository.sessions = []

    # Act
    result = get_user_sessions.execute(user_id)

    # Assert
    assert len(result) == 0
