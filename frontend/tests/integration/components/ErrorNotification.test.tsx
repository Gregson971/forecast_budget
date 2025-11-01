import { render } from '@testing-library/react';
import ErrorNotification from '@/components/ErrorNotification';
import { toast } from 'sonner';

jest.mock('sonner');
const mockedToast = toast as jest.Mocked<typeof toast>;

describe('ErrorNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedToast.error = jest.fn();
  });

  it('should not show toast when error is null', () => {
    render(<ErrorNotification error={null} />);
    expect(mockedToast.error).not.toHaveBeenCalled();
  });

  it('should show session expired toast', () => {
    render(<ErrorNotification error="Session expirée" />);
    
    expect(mockedToast.error).toHaveBeenCalledWith(
      'Session expirée',
      expect.objectContaining({
        description: 'Veuillez vous reconnecter pour continuer.',
        duration: 5000,
      })
    );
  });

  it('should show connection error toast', () => {
    render(<ErrorNotification error="Erreur de connexion au serveur" />);
    
    expect(mockedToast.error).toHaveBeenCalledWith(
      'Erreur de connexion',
      expect.objectContaining({
        description: 'Vérifiez votre connexion internet et réessayez.',
        duration: 8000,
      })
    );
  });

  it('should show server error toast', () => {
    render(<ErrorNotification error="Erreur serveur interne" />);
    
    expect(mockedToast.error).toHaveBeenCalledWith(
      'Erreur serveur',
      expect.objectContaining({
        description: 'Le serveur rencontre des difficultés. Veuillez réessayer plus tard.',
        duration: 8000,
      })
    );
  });

  it('should show generic error toast', () => {
    const errorMessage = 'Something went wrong';
    render(<ErrorNotification error={errorMessage} />);
    
    expect(mockedToast.error).toHaveBeenCalledWith(
      'Erreur',
      expect.objectContaining({
        description: errorMessage,
        duration: 5000,
      })
    );
  });

  it('should call onClear callback when error is shown', () => {
    const onClear = jest.fn();
    render(<ErrorNotification error="Test error" onClear={onClear} />);
    
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('should not call onClear when error is null', () => {
    const onClear = jest.fn();
    render(<ErrorNotification error={null} onClear={onClear} />);
    
    expect(onClear).not.toHaveBeenCalled();
  });

  it('should not crash when onClear is not provided', () => {
    expect(() => {
      render(<ErrorNotification error="Test error" />);
    }).not.toThrow();
  });
});

