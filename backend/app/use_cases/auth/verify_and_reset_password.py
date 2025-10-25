"""Use case pour vérifier un code et réinitialiser le mot de passe."""

from datetime import datetime, UTC
from app.domain.interfaces.user_repository_interface import UserRepositoryInterface
from app.domain.interfaces.password_reset_code_repository_interface import (
    PasswordResetCodeRepositoryInterface,
)
from app.infrastructure.security.password_hasher import PasswordHasher


class VerifyAndResetPassword:
    """Use case pour vérifier un code de réinitialisation et changer le mot de passe."""

    def __init__(
        self,
        user_repository: UserRepositoryInterface,
        code_repository: PasswordResetCodeRepositoryInterface,
        password_hasher: PasswordHasher,
    ):
        """
        Initialise le use case.

        Args:
            user_repository: Repository des utilisateurs
            code_repository: Repository des codes de réinitialisation
            password_hasher: Service de hachage de mot de passe
        """
        self.user_repository = user_repository
        self.code_repository = code_repository
        self.password_hasher = password_hasher

    def execute(self, code: str, new_password: str) -> dict:
        """
        Vérifie le code et réinitialise le mot de passe.

        Args:
            code: Le code de vérification à 6 chiffres
            new_password: Le nouveau mot de passe

        Returns:
            dict: Résultat de la réinitialisation

        Raises:
            ValueError: Si le code est invalide, expiré, ou si le mot de passe est invalide
        """
        # Valider le mot de passe
        if not new_password or len(new_password) < 8:
            raise ValueError("Le mot de passe doit contenir au moins 8 caractères")

        # Récupérer le code de réinitialisation
        reset_code = self.code_repository.get_by_code(code)

        if not reset_code:
            raise ValueError("Code invalide ou expiré")

        # Vérifier que le code n'a pas expiré
        if reset_code.expires_at < datetime.now(UTC):
            raise ValueError("Code invalide ou expiré")

        # Vérifier que le code n'a pas déjà été utilisé
        if reset_code.used:
            raise ValueError("Code invalide ou expiré")

        # Récupérer l'utilisateur
        user = self.user_repository.get_by_id(reset_code.user_id)

        if not user:
            raise ValueError("Utilisateur introuvable")

        # Hacher le nouveau mot de passe
        hashed_password = self.password_hasher.hash(new_password)

        # Mettre à jour le mot de passe de l'utilisateur
        user.password = hashed_password
        user.updated_at = datetime.now(UTC)
        self.user_repository.update(user.id, user)

        # Marquer le code comme utilisé
        self.code_repository.mark_as_used(reset_code.id)

        return {"success": True, "message": "Mot de passe réinitialisé avec succès"}
