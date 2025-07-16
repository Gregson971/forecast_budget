"""Module contenant le cas d'utilisation pour récupérer toutes les sessions d'un utilisateur."""

from app.domain.interfaces.session_repository_interface import SessionRepositoryInterface
from app.domain.entities.session import Session


class GetUserSessions:
    """Cas d'utilisation pour récupérer toutes les sessions d'un utilisateur."""

    def __init__(self, session_repo: SessionRepositoryInterface):
        self.session_repo = session_repo

    def execute(self, user_id: str) -> list[Session]:
        """Exécute le cas d'utilisation."""

        return self.session_repo.get_all_by_user_id(user_id)
