"""Tests pour les services SMS (Mock et Twilio)."""

import pytest
from unittest.mock import Mock, patch, AsyncMock
from app.domain.interfaces.sms_service_interface import SMSServiceInterface


class TestSMSServiceInterface:
    """Tests pour l'interface SMSServiceInterface."""

    def test_interface_has_send_sms_method(self):
        """Vérifie que l'interface définit la méthode send_sms."""
        assert hasattr(SMSServiceInterface, 'send_sms')

    def test_interface_has_generate_code_method(self):
        """Vérifie que l'interface définit la méthode generate_code."""
        assert hasattr(SMSServiceInterface, 'generate_code')


class TestMockSMSService:
    """Tests pour le service SMS Mock (développement)."""

    @pytest.mark.asyncio
    async def test_send_sms_logs_message(self, caplog):
        """Vérifie que le service Mock log le message au lieu de l'envoyer."""
        import logging
        from app.infrastructure.sms.mock_sms_service import MockSMSService

        # Configurer caplog pour capturer les logs INFO
        caplog.set_level(logging.INFO)

        service = MockSMSService()
        phone_number = "+33612345678"
        message = "Votre code de vérification est: 123456"

        result = await service.send_sms(phone_number, message)

        assert result is True
        assert "SMS envoyé (MOCK)" in caplog.text
        assert phone_number in caplog.text
        assert message in caplog.text

    @pytest.mark.asyncio
    async def test_send_sms_returns_true(self):
        """Vérifie que send_sms retourne toujours True en mode Mock."""
        from app.infrastructure.sms.mock_sms_service import MockSMSService

        service = MockSMSService()
        result = await service.send_sms("+33612345678", "Test message")

        assert result is True

    def test_generate_code_returns_six_digits(self):
        """Vérifie que generate_code retourne un code à 6 chiffres."""
        from app.infrastructure.sms.mock_sms_service import MockSMSService

        service = MockSMSService()
        code = service.generate_code()

        assert len(code) == 6
        assert code.isdigit()
        assert 0 <= int(code) <= 999999

    def test_generate_code_returns_different_codes(self):
        """Vérifie que generate_code retourne des codes différents."""
        from app.infrastructure.sms.mock_sms_service import MockSMSService

        service = MockSMSService()
        codes = [service.generate_code() for _ in range(10)]

        # Il devrait y avoir au moins quelques codes différents
        # (très improbable d'avoir 10 codes identiques)
        assert len(set(codes)) > 1

    def test_generate_code_pads_with_zeros(self):
        """Vérifie que les codes courts sont complétés avec des zéros."""
        from app.infrastructure.sms.mock_sms_service import MockSMSService

        service = MockSMSService()

        # On génère plusieurs codes pour tester
        with patch('random.randint', return_value=42):
            code = service.generate_code()
            assert code == "000042"


class TestTwilioSMSService:
    """Tests pour le service SMS Twilio (production)."""

    @pytest.mark.asyncio
    async def test_send_sms_calls_twilio_api(self):
        """Vérifie que send_sms appelle l'API Twilio."""
        from app.infrastructure.sms.twilio_sms_service import TwilioSMSService

        # Mock du client Twilio
        mock_client = Mock()
        mock_message = Mock()
        mock_message.sid = "SM123456789"
        mock_client.messages.create = Mock(return_value=mock_message)

        with patch('app.infrastructure.sms.twilio_sms_service.Client', return_value=mock_client):
            service = TwilioSMSService(
                account_sid="test_account_sid",
                auth_token="test_auth_token",
                from_number="+33123456789"
            )

            result = await service.send_sms("+33612345678", "Test message")

            assert result is True
            mock_client.messages.create.assert_called_once_with(
                body="Test message",
                from_="+33123456789",
                to="+33612345678"
            )

    @pytest.mark.asyncio
    async def test_send_sms_handles_twilio_error(self):
        """Vérifie que send_sms gère les erreurs Twilio."""
        from app.infrastructure.sms.twilio_sms_service import TwilioSMSService

        # Mock du client Twilio qui lève une exception
        mock_client = Mock()
        mock_client.messages.create = Mock(side_effect=Exception("Twilio error"))

        with patch('app.infrastructure.sms.twilio_sms_service.Client', return_value=mock_client):
            service = TwilioSMSService(
                account_sid="test_account_sid",
                auth_token="test_auth_token",
                from_number="+33123456789"
            )

            with pytest.raises(Exception) as exc_info:
                await service.send_sms("+33612345678", "Test message")

            assert "Twilio error" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_send_sms_returns_false_on_invalid_number(self):
        """Vérifie que send_sms retourne False pour un numéro invalide."""
        from app.infrastructure.sms.twilio_sms_service import TwilioSMSService
        from twilio.base.exceptions import TwilioRestException

        # Mock du client Twilio qui lève une exception pour numéro invalide
        mock_client = Mock()
        mock_client.messages.create = Mock(
            side_effect=TwilioRestException(
                status=400,
                uri="test_uri",
                msg="Invalid phone number"
            )
        )

        with patch('app.infrastructure.sms.twilio_sms_service.Client', return_value=mock_client):
            service = TwilioSMSService(
                account_sid="test_account_sid",
                auth_token="test_auth_token",
                from_number="+33123456789"
            )

            result = await service.send_sms("invalid", "Test message")

            assert result is False

    def test_generate_code_returns_six_digits(self):
        """Vérifie que generate_code retourne un code à 6 chiffres."""
        from app.infrastructure.sms.twilio_sms_service import TwilioSMSService

        with patch('app.infrastructure.sms.twilio_sms_service.Client'):
            service = TwilioSMSService(
                account_sid="test_account_sid",
                auth_token="test_auth_token",
                from_number="+33123456789"
            )

            code = service.generate_code()

            assert len(code) == 6
            assert code.isdigit()
            assert 0 <= int(code) <= 999999

    def test_generate_code_returns_different_codes(self):
        """Vérifie que generate_code retourne des codes différents."""
        from app.infrastructure.sms.twilio_sms_service import TwilioSMSService

        with patch('app.infrastructure.sms.twilio_sms_service.Client'):
            service = TwilioSMSService(
                account_sid="test_account_sid",
                auth_token="test_auth_token",
                from_number="+33123456789"
            )

            codes = [service.generate_code() for _ in range(10)]

            # Il devrait y avoir au moins quelques codes différents
            assert len(set(codes)) > 1


class TestSMSServiceFactory:
    """Tests pour la factory de création de service SMS."""

    def test_factory_creates_mock_service_in_dev(self):
        """Vérifie que la factory crée un MockSMSService en développement."""
        from app.infrastructure.sms.sms_service_factory import create_sms_service
        from app.infrastructure.sms.mock_sms_service import MockSMSService

        with patch.dict('os.environ', {'ENVIRONMENT': 'development'}):
            service = create_sms_service()
            assert isinstance(service, MockSMSService)

    def test_factory_creates_twilio_service_in_prod(self):
        """Vérifie que la factory crée un TwilioSMSService en production."""
        from app.infrastructure.sms.sms_service_factory import create_sms_service
        from app.infrastructure.sms.twilio_sms_service import TwilioSMSService

        with patch.dict('os.environ', {
            'ENVIRONMENT': 'production',
            'TWILIO_ACCOUNT_SID': 'test_sid',
            'TWILIO_AUTH_TOKEN': 'test_token',
            'TWILIO_FROM_NUMBER': '+33123456789'
        }):
            with patch('app.infrastructure.sms.twilio_sms_service.Client'):
                service = create_sms_service()
                assert isinstance(service, TwilioSMSService)

    def test_factory_raises_error_without_twilio_config(self):
        """Vérifie que la factory lève une erreur sans config Twilio en prod."""
        from app.infrastructure.sms.sms_service_factory import create_sms_service

        with patch.dict('os.environ', {'ENVIRONMENT': 'production'}, clear=True):
            with pytest.raises(ValueError) as exc_info:
                create_sms_service()

            assert "Twilio" in str(exc_info.value)
