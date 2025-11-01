import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { loginService, registerService, getUserService, updateUserService, refreshTokenService } from '@/services/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Mock des dépendances
jest.mock('@/services/auth');
jest.mock('sonner');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({ exp: Math.floor(Date.now() / 1000) + 3600 })), // Token expire dans 1h
}));

const mockedLoginService = loginService as jest.MockedFunction<typeof loginService>;
const mockedRegisterService = registerService as jest.MockedFunction<typeof registerService>;
const mockedGetUserService = getUserService as jest.MockedFunction<typeof getUserService>;
const mockedUpdateUserService = updateUserService as jest.MockedFunction<typeof updateUserService>;
const mockedRefreshTokenService = refreshTokenService as jest.MockedFunction<typeof refreshTokenService>;
const mockedToast = toast as jest.Mocked<typeof toast>;
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('AuthContext', () => {
  let mockRouter: { push: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockRouter = { push: jest.fn() };
    mockedUseRouter.mockReturnValue(mockRouter as any);

    // Mock par défaut pour toast
    mockedToast.success = jest.fn();
    mockedToast.error = jest.fn();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;

  describe('login', () => {
    it('should login successfully and set user', async () => {
      const mockUser = {
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
      };

      mockedLoginService.mockResolvedValue({
        access_token: 'test_access_token',
        refresh_token: 'test_refresh_token',
      });
      mockedGetUserService.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      expect(localStorage.getItem('access_token')).toBe('test_access_token');
      expect(localStorage.getItem('refresh_token')).toBe('test_refresh_token');
      expect(mockRouter.push).toHaveBeenCalledWith('/');
      expect(mockedToast.success).toHaveBeenCalled();
    });

    it('should handle login error with 401 status', async () => {
      const error = {
        response: {
          status: 401,
          data: { detail: 'Invalid credentials' },
        },
      };
      mockedLoginService.mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(async () => {
        await act(async () => {
          await result.current.login('test@example.com', 'wrong_password');
        });
      }).rejects.toEqual(error);

      expect(result.current.user).toBeNull();
      expect(localStorage.getItem('access_token')).toBeNull();
    });

    it('should handle login error with 422 status', async () => {
      const error = {
        response: {
          status: 422,
          data: { detail: 'Validation error' },
        },
      };
      mockedLoginService.mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(async () => {
        await act(async () => {
          await result.current.login('invalid', 'password');
        });
      }).rejects.toEqual(error);
    });

    it('should handle login error with no response', async () => {
      const error = { message: 'Network error' };
      mockedLoginService.mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(async () => {
        await act(async () => {
          await result.current.login('test@example.com', 'password');
        });
      }).rejects.toEqual(error);
    });
  });

  describe('register', () => {
    it('should register successfully and login user', async () => {
      const mockUser = {
        email: 'newuser@example.com',
        first_name: 'Jane',
        last_name: 'Smith',
      };

      mockedRegisterService.mockResolvedValue(undefined as any);
      mockedLoginService.mockResolvedValue({
        access_token: 'test_access_token',
        refresh_token: 'test_refresh_token',
      });
      mockedGetUserService.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.register('newuser@example.com', 'password123', 'Jane', 'Smith');
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      expect(mockedRegisterService).toHaveBeenCalledWith('newuser@example.com', 'password123', 'Jane', 'Smith');
      expect(localStorage.getItem('access_token')).toBe('test_access_token');
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });

    it('should handle register error with 400 status', async () => {
      const error = {
        response: {
          status: 400,
          data: { detail: 'Email already exists' },
        },
      };
      mockedRegisterService.mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(async () => {
        await act(async () => {
          await result.current.register('existing@example.com', 'password', 'John', 'Doe');
        });
      }).rejects.toEqual(error);
    });

    it('should handle register error with 404 status', async () => {
      const error = {
        response: {
          status: 404,
          data: { detail: 'Service not found' },
        },
      };
      mockedRegisterService.mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(async () => {
        await act(async () => {
          await result.current.register('test@example.com', 'password', 'John', 'Doe');
        });
      }).rejects.toEqual(error);
    });
  });

  describe('logout', () => {
    it('should logout and clear user data', async () => {
      localStorage.setItem('access_token', 'test_token');
      localStorage.setItem('refresh_token', 'test_refresh');

      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
      expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
      expect(mockedToast.success).toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('should get user data successfully', async () => {
      const mockUser = {
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
      };

      localStorage.setItem('access_token', 'test_token');
      mockedGetUserService.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      let userData;
      await act(async () => {
        userData = await result.current.getUser();
      });

      expect(userData).toEqual(mockUser);
      expect(result.current.user).toEqual(mockUser);
    });

    it('should return null when no access token', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      let userData;
      await act(async () => {
        userData = await result.current.getUser();
      });

      expect(userData).toBeNull();
    });

    it('should handle get user error', async () => {
      localStorage.setItem('access_token', 'invalid_token');
      mockedGetUserService.mockRejectedValue(new Error('Invalid token'));

      const { result } = renderHook(() => useAuth(), { wrapper });

      let userData;
      await act(async () => {
        userData = await result.current.getUser();
      });

      expect(userData).toBeNull();
      expect(mockedToast.error).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const updatedUser = {
        email: 'updated@example.com',
        first_name: 'John',
        last_name: 'Updated',
      };

      localStorage.setItem('access_token', 'test_token');
      mockedUpdateUserService.mockResolvedValue(updatedUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.updateUser({ last_name: 'Updated' });
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(updatedUser);
      });

      expect(mockedToast.success).toHaveBeenCalled();
    });

    it('should show error when not authenticated', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.updateUser({ last_name: 'Updated' });
      });

      expect(mockedToast.error).toHaveBeenCalledWith('Vous devez être connecté pour modifier votre profil');
      expect(mockedUpdateUserService).not.toHaveBeenCalled();
    });

    it('should handle update error', async () => {
      const error = {
        response: {
          status: 400,
          data: { detail: 'Invalid data' },
        },
      };

      localStorage.setItem('access_token', 'test_token');
      mockedUpdateUserService.mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(async () => {
        await act(async () => {
          await result.current.updateUser({ email: 'invalid' });
        });
      }).rejects.toEqual(error);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is logged in', async () => {
      const mockUser = {
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
      };

      mockedLoginService.mockResolvedValue({
        access_token: 'test_token',
        refresh_token: 'test_refresh',
      });
      mockedGetUserService.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('test@example.com', 'password');
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });
    });

    it('should return false when user is not logged in', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('isLoading', () => {
    it('should be false after initialization', async () => {
      mockedGetUserService.mockResolvedValue(null as any);

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Wait for loading to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });
});
