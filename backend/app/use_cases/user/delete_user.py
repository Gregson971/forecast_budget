"""Module contenant le cas d'utilisation pour supprimer un utilisateur."""

from app.domain.interfaces.user_repository_interface import UserRepositoryInterface


class DeleteUser:
    """Cas d'utilisation pour supprimer un utilisateur."""

    def __init__(self, user_repo: UserRepositoryInterface):
        self.user_repo = user_repo

    def execute(self, user_id: str) -> None:
        """Exécute le cas d'utilisation pour supprimer un utilisateur."""

        self.validate_user_id(user_id)

        self.user_repo.delete(user_id)
        return None

    def validate_user_id(self, user_id: str) -> None:
        """Valide l'identifiant de l'utilisateur."""

        if not user_id:
            raise ValueError("L'identifiant de l'utilisateur est requis")

        if not self.user_repo.get_by_id(user_id):
            raise ValueError("L'utilisateur n'existe pas")
