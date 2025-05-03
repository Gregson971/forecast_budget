"""Module contenant le cas d'utilisation de création d'un utilisateur."""

import re
import uuid
from datetime import datetime, UTC
from passlib.hash import bcrypt
from app.domain.entities.user import User
from app.domain.interfaces.user_repository_interface import UserRepository


class RegisterUser:
    """Cas d'utilisation de création d'un utilisateur."""

    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def execute(self, data: dict):
        """Exécute le cas d'utilisation de création d'un utilisateur."""

        self.validate_data(data)
        self.validate_email(data["email"])
        # Vérifier si l'utilisateur existe déjà
        if self.user_repo.get_by_email(data["email"]):
            raise ValueError("L'utilisateur existe déjà")

        # Créer un nouvel utilisateur
        hashed_password = bcrypt.hash(data["password"])
        user = User(
            id=str(uuid.uuid4()),
            first_name=data["first_name"],
            last_name=data["last_name"],
            email=data["email"],
            password=hashed_password,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )

        # Ajouter l'utilisateur à la base de données
        self.user_repo.add(user)

        return user

    def validate_data(self, data: dict) -> None:
        """Valide les données d'entrée pour la création d'un utilisateur."""

        required_fields = ["first_name", "last_name", "email", "password"]
        for field in required_fields:
            if field not in data or not data[field]:
                raise ValueError(f"Le champ {field} est requis")

    def validate_email(self, email: str) -> None:
        """Valide l'email d'entrée."""

        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise ValueError("L'email est invalide")
