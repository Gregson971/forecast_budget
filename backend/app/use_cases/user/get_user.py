"""Module contenant le cas d'utilisation pour récupérer un utilisateur."""

from app.domain.interfaces.user_repository_interface import UserRepository
from app.domain.entities.user import User


class GetUser:
    """Cas d'utilisation pour récupérer un utilisateur."""

    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def execute(self, user_id: str) -> User:
        """Exécute le cas d'utilisation pour récupérer un utilisateur."""

        self.validate_user_id(user_id)

        user = self.user_repo.get_by_id(user_id)

        if not user:
            raise ValueError("Utilisateur non trouvé")

        return user

    def validate_user_id(self, user_id: str) -> None:
        """Valide l'identifiant de l'utilisateur."""

        if not user_id:
            raise ValueError("L'identifiant de l'utilisateur est requis")
