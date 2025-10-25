"""Interface pour le service d'envoi de SMS."""

from abc import ABC, abstractmethod


class SMSServiceInterface(ABC):
    """Interface pour le service d'envoi de SMS."""

    @abstractmethod
    async def send_sms(self, phone_number: str, message: str) -> bool:
        """
        Envoie un SMS à un numéro de téléphone.

        Args:
            phone_number: Le numéro de téléphone au format international (+33...)
            message: Le message à envoyer

        Returns:
            bool: True si l'envoi a réussi, False sinon

        Raises:
            Exception: En cas d'erreur lors de l'envoi
        """
        pass

    @abstractmethod
    def generate_code(self) -> str:
        """
        Génère un code de vérification à 6 chiffres.

        Returns:
            str: Un code à 6 chiffres
        """
        pass
