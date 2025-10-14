"""Module contenant le cas d'utilisation pour mettre à jour un utilisateur."""

import re
from typing import Dict, Any, Optional
from datetime import datetime, UTC

from app.domain.interfaces.user_repository_interface import UserRepositoryInterface
from app.domain.entities.user import User


class UpdateUser:
    """Cas d'utilisation pour mettre à jour un utilisateur."""

    def __init__(self, user_repo: UserRepositoryInterface):
        self.user_repo = user_repo

    def execute(self, user_id: str, update_data: Dict[str, Any]) -> User:
        """
        Exécute le cas d'utilisation pour mettre à jour un utilisateur.

        Args:
            user_id: ID de l'utilisateur à mettre à jour
            update_data: Données à mettre à jour (first_name, last_name, email)

        Returns:
            User: L'utilisateur mis à jour

        Raises:
            ValueError: Si les données sont invalides ou l'utilisateur n'existe pas
        """
        # Valider l'ID utilisateur
        self.validate_user_id(user_id)

        # Récupérer l'utilisateur existant
        existing_user = self.user_repo.get_by_id(user_id)
        if not existing_user:
            raise ValueError("L'utilisateur n'existe pas")

        # Valider et préparer les données de mise à jour
        validated_data = self.validate_and_prepare_data(update_data, existing_user)

        # Mettre à jour l'utilisateur
        updated_user = self._update_user_entity(existing_user, validated_data)

        # Sauvegarder les modifications
        return self.user_repo.update(user_id, updated_user)

    def validate_user_id(self, user_id: str) -> None:
        """Valide l'identifiant de l'utilisateur."""
        if not user_id:
            raise ValueError("L'identifiant de l'utilisateur est requis")

    def validate_and_prepare_data(
        self,
        update_data: Dict[str, Any],
        existing_user: User
    ) -> Dict[str, Any]:
        """
        Valide et prépare les données de mise à jour.

        Args:
            update_data: Données fournies pour la mise à jour
            existing_user: Utilisateur existant

        Returns:
            Dict contenant les données validées
        """
        validated_data = {}

        # Valider first_name
        if "first_name" in update_data:
            first_name = update_data["first_name"].strip()
            if not first_name:
                raise ValueError("Le prénom ne peut pas être vide")
            if len(first_name) > 100:
                raise ValueError("Le prénom est trop long")
            validated_data["first_name"] = first_name

        # Valider last_name
        if "last_name" in update_data:
            last_name = update_data["last_name"].strip()
            if not last_name:
                raise ValueError("Le nom ne peut pas être vide")
            if len(last_name) > 100:
                raise ValueError("Le nom est trop long")
            validated_data["last_name"] = last_name

        # Valider email
        if "email" in update_data:
            email = update_data["email"].strip().lower()
            if not email:
                raise ValueError("L'email ne peut pas être vide")
            if not self.is_valid_email(email):
                raise ValueError("L'email est invalide")

            # Vérifier si l'email est déjà utilisé par un autre utilisateur
            if email != existing_user.email:
                existing_user_with_email = self.user_repo.get_by_email(email)
                if existing_user_with_email and existing_user_with_email.id != existing_user.id:
                    raise ValueError("Cet email est déjà utilisé")

            validated_data["email"] = email

        return validated_data

    def is_valid_email(self, email: str) -> bool:
        """Vérifie si un email est valide."""
        email_regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        return re.match(email_regex, email) is not None

    def _update_user_entity(self, existing_user: User, update_data: Dict[str, Any]) -> User:
        """
        Crée une nouvelle entité User avec les données mises à jour.

        Args:
            existing_user: Utilisateur existant
            update_data: Données validées pour la mise à jour

        Returns:
            User: Nouvelle entité User avec les données mises à jour
        """
        return User(
            id=existing_user.id,
            first_name=update_data.get("first_name", existing_user.first_name),
            last_name=update_data.get("last_name", existing_user.last_name),
            email=update_data.get("email", existing_user.email),
            password=existing_user.password,  # Le mot de passe reste inchangé
            created_at=existing_user.created_at,
            updated_at=datetime.now(UTC),
        )
