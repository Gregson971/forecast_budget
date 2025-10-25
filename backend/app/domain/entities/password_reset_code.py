"""Module contenant l'entité PasswordResetCode."""

from dataclasses import dataclass
from datetime import datetime


@dataclass
class PasswordResetCode:
    """Représente un code de réinitialisation de mot de passe."""

    id: str
    user_id: str
    code: str
    expires_at: datetime
    created_at: datetime
    used: bool = False
