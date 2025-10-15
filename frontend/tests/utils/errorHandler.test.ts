import { handleError, handleCrudError, handleSilentError, ErrorType } from '@/lib/errorHandler';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}));

// Helper pour créer une AxiosError
const createAxiosError = (status?: number, data?: any): AxiosError => {
  const error = new AxiosError('Test error');
  if (status) {
    error.response = {
      status,
      data,
      statusText: 'Error',
      headers: {},
      config: {} as any,
    };
  }
  return error;
};

describe('Error Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set to production to avoid console logs
    process.env.NODE_ENV = 'production';
  });

  describe('handleError', () => {
    it('identifies network errors', () => {
      const networkError = createAxiosError(); // No response = network error

      const result = handleError(networkError);

      expect(result.type).toBe(ErrorType.NETWORK);
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('serveur'),
        expect.objectContaining({ duration: 5000 })
      );
    });

    it('identifies authentication errors', () => {
      const authError = createAxiosError(401);

      const result = handleError(authError);

      expect(result.type).toBe(ErrorType.AUTHENTICATION);
      // Auth errors don't show toast
      expect(toast.error).not.toHaveBeenCalled();
    });

    it('identifies validation errors', () => {
      const validationError = createAxiosError(422, {
        detail: 'Validation failed',
      });

      const result = handleError(validationError);

      expect(result.type).toBe(ErrorType.VALIDATION);
      expect(toast.error).toHaveBeenCalledWith(
        'Validation failed',
        expect.objectContaining({ duration: 5000 })
      );
    });

    it('identifies server errors', () => {
      const serverError = createAxiosError(500, {
        detail: 'Internal server error',
      });

      const result = handleError(serverError);

      expect(result.type).toBe(ErrorType.SERVER);
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('serveur'),
        expect.objectContaining({ duration: 5000 })
      );
    });

    it('uses custom message when provided', () => {
      const error = new Error('Test error');

      handleError(error, { customMessage: 'Custom error message' });

      expect(toast.error).toHaveBeenCalledWith(
        'Custom error message',
        expect.objectContaining({ duration: 5000 })
      );
    });

    it('does not show toast when showToast is false', () => {
      const error = new Error('Test error');

      handleError(error, { showToast: false });

      expect(toast.error).not.toHaveBeenCalled();
    });

    it('handles unknown error types', () => {
      const unknownError = 'just a string';

      const result = handleError(unknownError);

      expect(result.type).toBe(ErrorType.UNKNOWN);
      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe('handleCrudError', () => {
    it('formats create operation error', () => {
      const error = new Error('Creation failed');

      handleCrudError('create', 'expense', error);

      expect(toast.error).toHaveBeenCalledWith(
        'Erreur lors de la création de expense',
        expect.objectContaining({ duration: 5000 })
      );
    });

    it('formats read operation error', () => {
      const error = new Error('Read failed');

      handleCrudError('read', 'transaction', error);

      expect(toast.error).toHaveBeenCalledWith(
        'Erreur lors de la récupération de transaction',
        expect.objectContaining({ duration: 5000 })
      );
    });

    it('formats update operation error', () => {
      const error = new Error('Update failed');

      handleCrudError('update', 'income', error);

      expect(toast.error).toHaveBeenCalledWith(
        'Erreur lors de la modification de income',
        expect.objectContaining({ duration: 5000 })
      );
    });

    it('formats delete operation error', () => {
      const error = new Error('Delete failed');

      handleCrudError('delete', 'forecast', error);

      expect(toast.error).toHaveBeenCalledWith(
        'Erreur lors de la suppression de forecast',
        expect.objectContaining({ duration: 5000 })
      );
    });
  });

  describe('handleSilentError', () => {
    it('does not show toast notification', () => {
      const error = new Error('Silent error');

      handleSilentError(error);

      expect(toast.error).not.toHaveBeenCalled();
    });

    it('returns error info', () => {
      const error = new Error('Silent error');

      const result = handleSilentError(error);

      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('message');
    });
  });

  describe('Development mode logging', () => {
    it('logs errors in development mode', () => {
      process.env.NODE_ENV = 'development';
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const error = new Error('Development error');
      handleError(error);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('does not log errors in production mode', () => {
      process.env.NODE_ENV = 'production';
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const error = new Error('Production error');
      handleError(error);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
