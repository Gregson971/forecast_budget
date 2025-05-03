"""Module contenant les classes liées aux sessions."""

from dataclasses import dataclass
from datetime import datetime


@dataclass
class Session:
    """Représente une session."""

    id: str
    user_id: str
    refresh_token: str
    user_agent: str
    ip_address: str
    created_at: datetime
    revoked: bool = False
