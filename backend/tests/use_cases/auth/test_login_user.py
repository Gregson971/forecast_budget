"""Tests pour le cas d'utilisation de login d'un utilisateur."""

import uuid
from datetime import datetime
from passlib.hash import bcrypt
from app.use_cases.auth.login_user import LoginUser
from app.domain.user import UserRepository, User
from app.domain.token import RefreshTokenRepository, RefreshToken


class InMemoryUserRepository(UserRepository):
    """Implémentation en mémoire d'un repository d'utilisateurs."""

    def __init__(self):
        self.users = {}

    def add(self, user: User) -> User:
        self.users[user.email] = user
        return user

    def get_by_email(self, email: str) -> User:
        return self.users.get(email)

    def get_by_id(self, user_id: str) -> User:
        return self.users.get(user_id)


class InMemoryRefreshTokenRepository(RefreshTokenRepository):
    """Implémentation en mémoire d'un repository de refresh tokens."""

    def __init__(self):
        self.tokens = {}

    def add(self, token: RefreshToken) -> RefreshToken:
        self.tokens[token.token] = token
        return token

    def get_by_token(self, token: str) -> RefreshToken:
        return self.tokens.get(token)

    def get_by_user_id(self, user_id: str) -> list[RefreshToken]:
        return [token for token in self.tokens.values() if token.user_id == user_id]


def test_login_user_with_valid_credentials():
    """Test pour le cas d'utilisation de login d'un utilisateur avec des identifiants valides."""

    user_repo = InMemoryUserRepository()
    refresh_token_repo = InMemoryRefreshTokenRepository()

    user = User(
        id=str(uuid.uuid4()),
        first_name="John",
        last_name="Doe",
        email="john.doe@example.com",
        password=bcrypt.hash("password"),
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    user_repo.add(user)

    use_case = LoginUser(user_repo, refresh_token_repo)
    tokens = use_case.execute(email="john.doe@example.com", password="password")

    assert tokens is not None
    assert isinstance(tokens, dict)
    assert "access_token" in tokens
    assert "refresh_token" in tokens
    assert "token_type" in tokens
    assert tokens["token_type"] == "Bearer"
    assert isinstance(tokens["access_token"], str)
    assert isinstance(tokens["refresh_token"], str)

    # Vérifie que le refresh token a été sauvegardé
    stored_tokens = refresh_token_repo.get_by_user_id(user.id)
    assert len(stored_tokens) == 1
    assert stored_tokens[0].token == tokens["refresh_token"]
    assert stored_tokens[0].user_id == user.id
    assert not stored_tokens[0].revoked


def test_login_user_with_invalid_credentials():
    """Test pour le cas d'utilisation de login d'un utilisateur avec des identifiants invalides."""

    user_repo = InMemoryUserRepository()
    refresh_token_repo = InMemoryRefreshTokenRepository()
    use_case = LoginUser(user_repo, refresh_token_repo)

    try:
        use_case.execute(email="john.doe@example.com", password="wrong_password")
        assert False, "Should raise ValueError"
    except ValueError as e:
        assert str(e) == "Vos identifiants sont invalides"


def test_login_user_with_non_existent_email():
    """Test pour le cas d'utilisation de login d'un utilisateur avec un email non existant."""

    user_repo = InMemoryUserRepository()
    refresh_token_repo = InMemoryRefreshTokenRepository()
    use_case = LoginUser(user_repo, refresh_token_repo)

    try:
        use_case.execute(email="non_existent_email@example.com", password="password")
        assert False, "Should raise ValueError"
    except ValueError as e:
        assert str(e) == "Vos identifiants sont invalides"
