"""Factory pour créer le service SMS approprié selon l'environnement."""

import os
from app.domain.interfaces.sms_service_interface import SMSServiceInterface
from app.infrastructure.sms.mock_sms_service import MockSMSService
from app.infrastructure.sms.twilio_sms_service import TwilioSMSService


def create_sms_service() -> SMSServiceInterface:
    """
    Crée le service SMS approprié selon l'environnement.

    En développement: retourne MockSMSService (logs)
    En production: retourne TwilioSMSService (Twilio API)

    Returns:
        SMSServiceInterface: Le service SMS à utiliser

    Raises:
        ValueError: Si les variables d'environnement Twilio sont manquantes en production
    """
    environment = os.getenv("ENVIRONMENT", "development")

    if environment == "production":
        # En production, utiliser Twilio
        account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        from_number = os.getenv("TWILIO_FROM_NUMBER")

        if not all([account_sid, auth_token, from_number]):
            raise ValueError(
                "Les variables d'environnement Twilio sont requises en production: "
                "TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER"
            )

        return TwilioSMSService(
            account_sid=account_sid,
            auth_token=auth_token,
            from_number=from_number
        )

    # En développement, utiliser Mock
    return MockSMSService()
