"""Tests pour le use case de vérification et réinitialisation du mot de passe."""

import pytest
from datetime import datetime, timedelta, UTC
from unittest.mock import Mock
from app.use_cases.auth.verify_and_reset_password import VerifyAndResetPassword
from app.domain.entities.user import User
from app.domain.entities.password_reset_code import PasswordResetCode


class TestVerifyAndResetPassword:
    """Tests pour VerifyAndResetPassword."""

    def test_verify_and_reset_password_success(self):
        """Vérifie que le mot de passe est réinitialisé avec un code valide."""
        # Arrange
        user = User(
            id="user123",
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            password="old_hashed_password",
            phone_number="+33612345678",
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )

        reset_code = PasswordResetCode(
            id="code123",
            user_id="user123",
            code="123456",
            expires_at=datetime.now(UTC) + timedelta(minutes=5),
            created_at=datetime.now(UTC),
            used=False,
        )

        user_repo = Mock()
        user_repo.get_by_id.return_value = user
        updated_user = None

        def update_user(user_id, user_data):
            nonlocal updated_user
            updated_user = user_data
            return user_data

        user_repo.update.side_effect = update_user

        code_repo = Mock()
        code_repo.get_by_code.return_value = reset_code

        password_hasher = Mock()
        password_hasher.hash.return_value = "new_hashed_password"

        use_case = VerifyAndResetPassword(user_repo, code_repo, password_hasher)

        # Act
        result = use_case.execute(code="123456", new_password="NewPassword123!")

        # Assert
        assert result["success"] is True
        assert result["message"] == "Mot de passe réinitialisé avec succès"
        code_repo.get_by_code.assert_called_once_with("123456")
        code_repo.mark_as_used.assert_called_once_with("code123")
        password_hasher.hash.assert_called_once_with("NewPassword123!")
        user_repo.update.assert_called_once()

        # Vérifier que le mot de passe a été mis à jour
        assert updated_user.password == "new_hashed_password"

    def test_verify_code_not_found(self):
        """Vérifie qu'une erreur est levée si le code n'existe pas."""
        # Arrange
        user_repo = Mock()
        code_repo = Mock()
        code_repo.get_by_code.return_value = None
        password_hasher = Mock()

        use_case = VerifyAndResetPassword(user_repo, code_repo, password_hasher)

        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            use_case.execute(code="invalid", new_password="NewPassword123!")

        assert "Code invalide ou expiré" in str(exc_info.value)

    def test_verify_code_expired(self):
        """Vérifie qu'une erreur est levée si le code a expiré."""
        # Arrange
        reset_code = PasswordResetCode(
            id="code123",
            user_id="user123",
            code="123456",
            expires_at=datetime.now(UTC) - timedelta(minutes=5),  # Expiré
            created_at=datetime.now(UTC) - timedelta(minutes=15),
            used=False,
        )

        user_repo = Mock()
        code_repo = Mock()
        code_repo.get_by_code.return_value = reset_code
        password_hasher = Mock()

        use_case = VerifyAndResetPassword(user_repo, code_repo, password_hasher)

        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            use_case.execute(code="123456", new_password="NewPassword123!")

        assert "Code invalide ou expiré" in str(exc_info.value)

    def test_verify_code_already_used(self):
        """Vérifie qu'une erreur est levée si le code a déjà été utilisé."""
        # Arrange
        reset_code = PasswordResetCode(
            id="code123",
            user_id="user123",
            code="123456",
            expires_at=datetime.now(UTC) + timedelta(minutes=5),
            created_at=datetime.now(UTC),
            used=True,  # Déjà utilisé
        )

        user_repo = Mock()
        code_repo = Mock()
        code_repo.get_by_code.return_value = reset_code
        password_hasher = Mock()

        use_case = VerifyAndResetPassword(user_repo, code_repo, password_hasher)

        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            use_case.execute(code="123456", new_password="NewPassword123!")

        assert "Code invalide ou expiré" in str(exc_info.value)

    def test_verify_password_too_short(self):
        """Vérifie qu'une erreur est levée si le mot de passe est trop court."""
        # Arrange
        reset_code = PasswordResetCode(
            id="code123",
            user_id="user123",
            code="123456",
            expires_at=datetime.now(UTC) + timedelta(minutes=5),
            created_at=datetime.now(UTC),
            used=False,
        )

        user_repo = Mock()
        code_repo = Mock()
        code_repo.get_by_code.return_value = reset_code
        password_hasher = Mock()

        use_case = VerifyAndResetPassword(user_repo, code_repo, password_hasher)

        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            use_case.execute(code="123456", new_password="short")

        assert "au moins 8 caractères" in str(exc_info.value)

    def test_verify_user_not_found(self):
        """Vérifie qu'une erreur est levée si l'utilisateur n'existe pas."""
        # Arrange
        reset_code = PasswordResetCode(
            id="code123",
            user_id="user123",
            code="123456",
            expires_at=datetime.now(UTC) + timedelta(minutes=5),
            created_at=datetime.now(UTC),
            used=False,
        )

        user_repo = Mock()
        user_repo.get_by_id.return_value = None  # Utilisateur introuvable

        code_repo = Mock()
        code_repo.get_by_code.return_value = reset_code

        password_hasher = Mock()

        use_case = VerifyAndResetPassword(user_repo, code_repo, password_hasher)

        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            use_case.execute(code="123456", new_password="NewPassword123!")

        assert "Utilisateur introuvable" in str(exc_info.value)

    def test_verify_empty_password(self):
        """Vérifie qu'une erreur est levée si le mot de passe est vide."""
        # Arrange
        reset_code = PasswordResetCode(
            id="code123",
            user_id="user123",
            code="123456",
            expires_at=datetime.now(UTC) + timedelta(minutes=5),
            created_at=datetime.now(UTC),
            used=False,
        )

        user_repo = Mock()
        code_repo = Mock()
        code_repo.get_by_code.return_value = reset_code
        password_hasher = Mock()

        use_case = VerifyAndResetPassword(user_repo, code_repo, password_hasher)

        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            use_case.execute(code="123456", new_password="")

        assert "mot de passe" in str(exc_info.value).lower()
