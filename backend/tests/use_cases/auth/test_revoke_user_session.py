"""Tests pour le cas d'utilisation RevokeUserSession."""

from datetime import datetime
from unittest.mock import Mock
from fastapi import HTTPException
from app.use_cases.auth.revoke_user_session import RevokeUserSession
from app.domain.session import Session
import pytest


@pytest.fixture
def session_repository():
    """Fixture pour le repository de session."""
    return Mock()


def test_revoke_user_session_success(session_repository):
    """Test la révocation réussie d'une session."""
    # Arrange
    session_id = "test-session-id"
    user_id = "test-user-id"
    session = Session(
        id=session_id,
        user_id=user_id,
        revoked=False,
        refresh_token="test-refresh-token",
        user_agent="test-user-agent",
        ip_address="test-ip-address",
        created_at=datetime.now(),
    )

    session_repository.get_by_id.return_value = session
    session_repository.revoke_by_id.return_value = None

    use_case = RevokeUserSession(session_repository)

    # Act
    use_case.execute(session_id, user_id)

    # Assert
    session_repository.get_by_id.assert_called_once_with(session_id)
    session_repository.revoke_by_id.assert_called_once_with(session_id, user_id)


def test_revoke_user_session_not_found(session_repository):
    """Test l'échec quand la session n'existe pas."""
    # Arrange
    session_id = "test-session-id"
    user_id = "test-user-id"

    session_repository.get_by_id.return_value = None

    use_case = RevokeUserSession(session_repository)

    # Act & Assert
    with pytest.raises(HTTPException) as exc_info:
        use_case.execute(session_id, user_id)

    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Session non trouvée"
    session_repository.get_by_id.assert_called_once_with(session_id)
    session_repository.revoke_by_id.assert_not_called()


def test_revoke_user_session_wrong_user(session_repository):
    """Test l'échec quand la session appartient à un autre utilisateur."""
    # Arrange
    session_id = "test-session-id"
    user_id = "test-user-id"
    wrong_user_id = "wrong-user-id"
    session = Session(
        id=session_id,
        user_id=wrong_user_id,
        revoked=False,
        refresh_token="test-refresh-token",
        user_agent="test-user-agent",
        ip_address="test-ip-address",
        created_at=datetime.now(),
    )

    session_repository.get_by_id.return_value = session

    use_case = RevokeUserSession(session_repository)

    # Act & Assert
    with pytest.raises(HTTPException) as exc_info:
        use_case.execute(session_id, user_id)

    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Session non trouvée"
    session_repository.get_by_id.assert_called_once_with(session_id)
    session_repository.revoke_by_id.assert_not_called()


def test_revoke_user_session_already_revoked(session_repository):
    """Test l'échec quand la session est déjà révoquée."""
    # Arrange
    session_id = "test-session-id"
    user_id = "test-user-id"
    session = Session(
        id=session_id,
        user_id=user_id,
        revoked=True,
        refresh_token="test-refresh-token",
        user_agent="test-user-agent",
        ip_address="test-ip-address",
        created_at=datetime.now(),
    )

    session_repository.get_by_id.return_value = session

    use_case = RevokeUserSession(session_repository)

    # Act & Assert
    with pytest.raises(HTTPException) as exc_info:
        use_case.execute(session_id, user_id)

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "Session déjà revoquée"
    session_repository.get_by_id.assert_called_once_with(session_id)
    session_repository.revoke_by_id.assert_not_called()
