"""Module contenant les classes liées aux tokens."""

from dataclasses import dataclass
from datetime import datetime


@dataclass
class RefreshToken:
    """Représente un token."""

    token: str
    user_id: str
    created_at: datetime
    revoked: bool
