import {
  loginService,
  registerService,
  refreshTokenService,
  getUserService,
  updateUserService,
  getSessionsService,
  revokeSessionService,
} from '@/services/auth';
import api from '@/lib/api';

// Mock the entire api module
jest.mock('@/lib/api');

const mockedApi = api as jest.Mocked<typeof api>;

describe('Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginService', () => {
    it('sends login request with correct data', async () => {
      const mockResponse = {
        data: {
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      };

      mockedApi.post.mockResolvedValue(mockResponse);

      const result = await loginService('test@example.com', 'password123');

      expect(result).toEqual(mockResponse.data);
      expect(mockedApi.post).toHaveBeenCalledWith(
        '/auth/login',
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      );
    });
  });

  describe('registerService', () => {
    it('sends registration request with correct data', async () => {
      const mockResponse = {
        data: {
          id: '123',
          email: 'test@example.com',
        },
      };

      mockedApi.post.mockResolvedValue(mockResponse);

      const result = await registerService('test@example.com', 'password123', 'John', 'Doe');

      expect(result).toEqual(mockResponse.data);
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/register', {
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
      });
    });
  });

  describe('getUserService', () => {
    it('fetches user with authorization header', async () => {
      const mockResponse = {
        data: {
          id: '123',
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
        },
      };

      mockedApi.get.mockResolvedValue(mockResponse);

      const result = await getUserService('access-token');

      expect(result).toEqual(mockResponse.data);
      expect(mockedApi.get).toHaveBeenCalledWith('/auth/me', {
        headers: {
          Authorization: 'Bearer access-token',
        },
      });
    });
  });

  describe('updateUserService', () => {
    it('updates user with correct data and authorization', async () => {
      const updateData = {
        first_name: 'Jane',
        email: 'jane@example.com',
      };

      const mockResponse = {
        data: {
          id: '123',
          ...updateData,
        },
      };

      mockedApi.put.mockResolvedValue(mockResponse);

      const result = await updateUserService(updateData, 'access-token');

      expect(result).toEqual(mockResponse.data);
      expect(mockedApi.put).toHaveBeenCalledWith('/users/me', updateData, {
        headers: {
          Authorization: 'Bearer access-token',
        },
      });
    });
  });

  describe('getSessionsService', () => {
    it('fetches sessions with authorization header', async () => {
      const mockSessions = [
        { id: '1', user_agent: 'Mozilla', ip_address: '192.168.1.1' },
        { id: '2', user_agent: 'Chrome', ip_address: '192.168.1.2' },
      ];

      const mockResponse = {
        data: mockSessions,
      };

      mockedApi.get.mockResolvedValue(mockResponse);

      const result = await getSessionsService('access-token');

      expect(result).toEqual(mockSessions);
      expect(mockedApi.get).toHaveBeenCalledWith('/auth/me/sessions', {
        headers: {
          Authorization: 'Bearer access-token',
        },
      });
    });
  });

  describe('revokeSessionService', () => {
    it('revokes session with correct ID and authorization', async () => {
      const mockResponse = {
        data: { success: true },
      };

      mockedApi.delete.mockResolvedValue(mockResponse);

      const result = await revokeSessionService('session-123', 'access-token');

      expect(result).toEqual(mockResponse.data);
      expect(mockedApi.delete).toHaveBeenCalledWith('/auth/me/sessions/session-123', {
        headers: {
          Authorization: 'Bearer access-token',
        },
      });
    });
  });

  describe('refreshTokenService', () => {
    it('refreshes token with correct refresh token', async () => {
      const mockResponse = {
        data: {
          access_token: 'new-access-token',
        },
      };

      mockedApi.post.mockResolvedValue(mockResponse);

      const result = await refreshTokenService('refresh-token');

      expect(result).toEqual(mockResponse.data);
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/refresh', {
        refresh_token: 'refresh-token',
      });
    });
  });
});
