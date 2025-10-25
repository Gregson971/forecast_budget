"""Use case pour demander la réinitialisation du mot de passe."""

import uuid
from datetime import datetime, timedelta, UTC
from typing import Optional
from app.domain.entities.password_reset_code import PasswordResetCode
from app.domain.interfaces.user_repository_interface import UserRepositoryInterface
from app.domain.interfaces.password_reset_code_repository_interface import (
    PasswordResetCodeRepositoryInterface,
)
from app.domain.interfaces.sms_service_interface import SMSServiceInterface


class RequestPasswordReset:
    """Use case pour demander un code de réinitialisation de mot de passe."""

    def __init__(
        self,
        user_repository: UserRepositoryInterface,
        code_repository: PasswordResetCodeRepositoryInterface,
        sms_service: SMSServiceInterface,
    ):
        """
        Initialise le use case.

        Args:
            user_repository: Repository des utilisateurs
            code_repository: Repository des codes de réinitialisation
            sms_service: Service d'envoi de SMS
        """
        self.user_repository = user_repository
        self.code_repository = code_repository
        self.sms_service = sms_service

    async def execute(
        self, email: Optional[str] = None, phone_number: Optional[str] = None
    ) -> dict:
        """
        Demande un code de réinitialisation de mot de passe.

        Args:
            email: L'email de l'utilisateur (optionnel)
            phone_number: Le numéro de téléphone de l'utilisateur (optionnel)

        Returns:
            dict: Résultat de la demande

        Raises:
            ValueError: Si aucun identifiant n'est fourni ou si l'utilisateur n'existe pas
            Exception: Si l'envoi du SMS échoue
        """
        # Valider qu'au moins un identifiant est fourni
        if not email and not phone_number:
            raise ValueError("Email ou numéro de téléphone requis")

        # Récupérer l'utilisateur
        user = None
        if email:
            user = self.user_repository.get_by_email(email)
        elif phone_number:
            user = self.user_repository.get_by_phone_number(phone_number)

        if not user:
            raise ValueError("Aucun utilisateur trouvé avec ces identifiants")

        # Vérifier que l'utilisateur a un numéro de téléphone
        if not user.phone_number:
            raise ValueError(
                "Cet utilisateur n'a pas de numéro de téléphone configuré"
            )

        # Invalider les anciens codes non utilisés
        old_code = self.code_repository.get_by_user_id(user.id)
        if old_code:
            self.code_repository.mark_as_used(old_code.id)

        # Générer un nouveau code
        code_value = self.sms_service.generate_code()

        # Créer l'entité du code de réinitialisation
        reset_code = PasswordResetCode(
            id=str(uuid.uuid4()),
            user_id=user.id,
            code=code_value,
            expires_at=datetime.now(UTC) + timedelta(minutes=10),
            created_at=datetime.now(UTC),
            used=False,
        )

        # Sauvegarder le code
        self.code_repository.add(reset_code)

        # Envoyer le SMS
        message = f"Votre code de vérification pour réinitialiser votre mot de passe est: {code_value}. Ce code expire dans 10 minutes."
        await self.sms_service.send_sms(user.phone_number, message)

        return {
            "success": True,
            "message": "Un code de vérification a été envoyé par SMS",
        }
