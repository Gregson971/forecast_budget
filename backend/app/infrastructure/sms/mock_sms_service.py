"""Service SMS Mock pour le développement."""

import random
import logging
from app.domain.interfaces.sms_service_interface import SMSServiceInterface

logger = logging.getLogger(__name__)


class MockSMSService(SMSServiceInterface):
    """Service SMS Mock qui log les messages au lieu de les envoyer."""

    async def send_sms(self, phone_number: str, message: str) -> bool:
        """
        Log le SMS au lieu de l'envoyer réellement.

        Args:
            phone_number: Le numéro de téléphone au format international
            message: Le message à envoyer

        Returns:
            bool: Toujours True en mode Mock
        """
        logger.info(f"SMS envoyé (MOCK) à {phone_number}: {message}")
        return True

    def generate_code(self) -> str:
        """
        Génère un code de vérification à 6 chiffres.

        Returns:
            str: Un code à 6 chiffres (avec zéros de padding si nécessaire)
        """
        code = random.randint(0, 999999)
        return f"{code:06d}"
