"""Module pour le service de token."""

import os
from typing import Optional
from datetime import datetime, timedelta, UTC
from jose import jwt

SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class TokenService:
    """Service pour la gestion des tokens."""

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
        """Crée un token d'accès."""

        to_encode = data.copy()
        expire = datetime.now(UTC) + (
            expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
