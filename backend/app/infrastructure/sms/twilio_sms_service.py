"""Service SMS Twilio pour la production."""

import random
import logging
from typing import Optional
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from app.domain.interfaces.sms_service_interface import SMSServiceInterface

logger = logging.getLogger(__name__)


class TwilioSMSService(SMSServiceInterface):
    """Service SMS utilisant l'API Twilio."""

    def __init__(self, account_sid: str, auth_token: str, from_number: str):
        """
        Initialise le service Twilio.

        Args:
            account_sid: L'identifiant du compte Twilio
            auth_token: Le token d'authentification Twilio
            from_number: Le numéro de téléphone émetteur (format international)
        """
        self.client = Client(account_sid, auth_token)
        self.from_number = from_number

    async def send_sms(self, phone_number: str, message: str) -> bool:
        """
        Envoie un SMS via l'API Twilio.

        Args:
            phone_number: Le numéro de téléphone au format international
            message: Le message à envoyer

        Returns:
            bool: True si l'envoi a réussi, False pour numéro invalide

        Raises:
            Exception: Pour les autres erreurs Twilio
        """
        try:
            result = self.client.messages.create(
                body=message,
                from_=self.from_number,
                to=phone_number
            )
            logger.info(f"SMS envoyé avec succès à {phone_number} (SID: {result.sid})")
            return True

        except TwilioRestException as e:
            # Si le numéro est invalide, retourner False
            if e.status == 400:
                logger.warning(f"Numéro de téléphone invalide: {phone_number}")
                return False
            # Pour les autres erreurs, lever l'exception
            logger.error(f"Erreur Twilio lors de l'envoi du SMS: {e}")
            raise

        except Exception as e:
            logger.error(f"Erreur inattendue lors de l'envoi du SMS: {e}")
            raise

    def generate_code(self) -> str:
        """
        Génère un code de vérification à 6 chiffres.

        Returns:
            str: Un code à 6 chiffres (avec zéros de padding si nécessaire)
        """
        code = random.randint(0, 999999)
        return f"{code:06d}"
