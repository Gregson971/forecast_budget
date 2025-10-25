"""Service de hachage de mot de passe."""

from passlib.hash import bcrypt


class PasswordHasher:
    """Service pour hacher et vérifier les mots de passe."""

    @staticmethod
    def hash(password: str) -> str:
        """
        Hache un mot de passe.

        Args:
            password: Le mot de passe en clair

        Returns:
            str: Le mot de passe haché
        """
        return bcrypt.hash(password)

    @staticmethod
    def verify(password: str, hashed: str) -> bool:
        """
        Vérifie un mot de passe contre son hash.

        Args:
            password: Le mot de passe en clair
            hashed: Le mot de passe haché

        Returns:
            bool: True si le mot de passe correspond
        """
        return bcrypt.verify(password, hashed)
