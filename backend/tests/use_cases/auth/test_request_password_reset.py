"""Tests pour le use case de demande de réinitialisation de mot de passe."""

import pytest
from datetime import datetime, timedelta, UTC
from unittest.mock import Mock, AsyncMock
from app.use_cases.auth.request_password_reset import RequestPasswordReset
from app.domain.entities.user import User
from app.domain.entities.password_reset_code import PasswordResetCode


class TestRequestPasswordReset:
    """Tests pour RequestPasswordReset."""

    @pytest.mark.asyncio
    async def test_request_reset_with_email_sends_sms(self):
        """Vérifie qu'un code est envoyé par SMS quand on utilise l'email."""
        # Arrange
        user = User(
            id="user123",
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            password="hashed_password",
            phone_number="+33612345678",
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )

        user_repo = Mock()
        user_repo.get_by_email.return_value = user

        code_repo = Mock()
        saved_code = None

        def save_code(code):
            nonlocal saved_code
            saved_code = code
            return code

        code_repo.add.side_effect = save_code

        sms_service = Mock()
        sms_service.generate_code.return_value = "123456"
        sms_service.send_sms = AsyncMock(return_value=True)

        use_case = RequestPasswordReset(user_repo, code_repo, sms_service)

        # Act
        result = await use_case.execute(email="john@example.com")

        # Assert
        assert result["success"] is True
        assert result["message"] == "Un code de vérification a été envoyé par SMS"
        user_repo.get_by_email.assert_called_once_with("john@example.com")
        code_repo.add.assert_called_once()
        sms_service.send_sms.assert_called_once()

        # Vérifier les arguments de send_sms
        call_args = sms_service.send_sms.call_args
        assert call_args[0][0] == "+33612345678"  # phone_number
        assert "123456" in call_args[0][1]  # message contient le code

        # Vérifier que le code a été sauvegardé correctement
        assert saved_code is not None
        assert saved_code.user_id == "user123"
        assert saved_code.code == "123456"
        assert saved_code.used is False
        # Vérifier que l'expiration est dans environ 10 minutes
        time_diff = saved_code.expires_at - datetime.now(UTC)
        assert 9 <= time_diff.total_seconds() / 60 <= 11

    @pytest.mark.asyncio
    async def test_request_reset_with_phone_sends_sms(self):
        """Vérifie qu'un code est envoyé par SMS quand on utilise le numéro de téléphone."""
        # Arrange
        user = User(
            id="user123",
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            password="hashed_password",
            phone_number="+33612345678",
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )

        user_repo = Mock()

        def get_by_phone(phone):
            if phone == "+33612345678":
                return user
            return None

        user_repo.get_by_phone_number.side_effect = get_by_phone

        code_repo = Mock()
        code_repo.add.return_value = Mock()

        sms_service = Mock()
        sms_service.generate_code.return_value = "654321"
        sms_service.send_sms = AsyncMock(return_value=True)

        use_case = RequestPasswordReset(user_repo, code_repo, sms_service)

        # Act
        result = await use_case.execute(phone_number="+33612345678")

        # Assert
        assert result["success"] is True
        user_repo.get_by_phone_number.assert_called_once_with("+33612345678")
        sms_service.send_sms.assert_called_once()

    @pytest.mark.asyncio
    async def test_request_reset_user_not_found_by_email(self):
        """Vérifie qu'une erreur est levée si l'utilisateur n'existe pas (email)."""
        # Arrange
        user_repo = Mock()
        user_repo.get_by_email.return_value = None

        code_repo = Mock()
        sms_service = Mock()

        use_case = RequestPasswordReset(user_repo, code_repo, sms_service)

        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            await use_case.execute(email="notfound@example.com")

        assert "Aucun utilisateur trouvé" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_request_reset_user_has_no_phone(self):
        """Vérifie qu'une erreur est levée si l'utilisateur n'a pas de numéro de téléphone."""
        # Arrange
        user = User(
            id="user123",
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            password="hashed_password",
            phone_number=None,  # Pas de téléphone
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )

        user_repo = Mock()
        user_repo.get_by_email.return_value = user

        code_repo = Mock()
        sms_service = Mock()

        use_case = RequestPasswordReset(user_repo, code_repo, sms_service)

        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            await use_case.execute(email="john@example.com")

        assert "numéro de téléphone" in str(exc_info.value).lower()

    @pytest.mark.asyncio
    async def test_request_reset_no_email_nor_phone(self):
        """Vérifie qu'une erreur est levée si ni email ni téléphone ne sont fournis."""
        # Arrange
        user_repo = Mock()
        code_repo = Mock()
        sms_service = Mock()

        use_case = RequestPasswordReset(user_repo, code_repo, sms_service)

        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            await use_case.execute()

        assert "Email ou numéro de téléphone requis" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_request_reset_sms_send_fails(self):
        """Vérifie qu'une erreur est levée si l'envoi du SMS échoue."""
        # Arrange
        user = User(
            id="user123",
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            password="hashed_password",
            phone_number="+33612345678",
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )

        user_repo = Mock()
        user_repo.get_by_email.return_value = user

        code_repo = Mock()
        code_repo.add.return_value = Mock()

        sms_service = Mock()
        sms_service.generate_code.return_value = "123456"
        sms_service.send_sms = AsyncMock(side_effect=Exception("SMS service unavailable"))

        use_case = RequestPasswordReset(user_repo, code_repo, sms_service)

        # Act & Assert
        with pytest.raises(Exception) as exc_info:
            await use_case.execute(email="john@example.com")

        assert "SMS service unavailable" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_request_reset_deletes_old_codes(self):
        """Vérifie que les anciens codes sont invalidés avant de créer un nouveau."""
        # Arrange
        user = User(
            id="user123",
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            password="hashed_password",
            phone_number="+33612345678",
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )

        old_code = PasswordResetCode(
            id="old_code",
            user_id="user123",
            code="111111",
            expires_at=datetime.now(UTC) + timedelta(minutes=5),
            created_at=datetime.now(UTC) - timedelta(minutes=5),
            used=False,
        )

        user_repo = Mock()
        user_repo.get_by_email.return_value = user

        code_repo = Mock()
        code_repo.get_by_user_id.return_value = old_code
        code_repo.add.return_value = Mock()

        sms_service = Mock()
        sms_service.generate_code.return_value = "123456"
        sms_service.send_sms = AsyncMock(return_value=True)

        use_case = RequestPasswordReset(user_repo, code_repo, sms_service)

        # Act
        await use_case.execute(email="john@example.com")

        # Assert
        # Vérifier que l'ancien code a été marqué comme utilisé
        code_repo.mark_as_used.assert_called_once_with("old_code")
