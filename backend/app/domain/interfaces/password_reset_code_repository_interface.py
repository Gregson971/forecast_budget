"""Interface pour le repository des codes de réinitialisation de mot de passe."""

from abc import ABC, abstractmethod
from typing import Optional
from app.domain.entities.password_reset_code import PasswordResetCode


class PasswordResetCodeRepositoryInterface(ABC):
    """Interface pour le repository des codes de réinitialisation de mot de passe."""

    @abstractmethod
    def add(self, code: PasswordResetCode) -> PasswordResetCode:
        """
        Ajoute un nouveau code de réinitialisation.

        Args:
            code: Le code de réinitialisation à ajouter

        Returns:
            PasswordResetCode: Le code ajouté
        """
        pass

    @abstractmethod
    def get_by_code(self, code: str) -> Optional[PasswordResetCode]:
        """
        Récupère un code de réinitialisation par son code.

        Args:
            code: Le code à rechercher

        Returns:
            Optional[PasswordResetCode]: Le code trouvé ou None
        """
        pass

    @abstractmethod
    def get_by_user_id(self, user_id: str) -> Optional[PasswordResetCode]:
        """
        Récupère le code de réinitialisation le plus récent pour un utilisateur.

        Args:
            user_id: L'ID de l'utilisateur

        Returns:
            Optional[PasswordResetCode]: Le code le plus récent ou None
        """
        pass

    @abstractmethod
    def mark_as_used(self, code_id: str) -> None:
        """
        Marque un code comme utilisé.

        Args:
            code_id: L'ID du code à marquer comme utilisé
        """
        pass

    @abstractmethod
    def delete_expired_codes(self) -> None:
        """Supprime tous les codes expirés."""
        pass
