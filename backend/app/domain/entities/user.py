"""Module contenant les classes liées aux utilisateurs."""

from dataclasses import dataclass
from datetime import datetime


@dataclass
class User:
    """Représente un utilisateur."""

    id: str
    first_name: str
    last_name: str
    email: str
    password: str
    created_at: datetime
    updated_at: datetime
