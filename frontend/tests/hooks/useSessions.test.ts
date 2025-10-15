import { renderHook, waitFor, act } from '@testing-library/react';
import { useSessions } from '@/hooks/useSessions';
import * as authService from '@/services/auth';

// Mock the auth service
jest.mock('@/services/auth');

// Mock errorHandler to avoid console errors in tests
jest.mock('@/lib/errorHandler', () => ({
  handleSilentError: jest.fn(),
}));

describe('useSessions Hook', () => {
  const mockSessions = [
    {
      id: '1',
      user_agent: 'Mozilla/5.0',
      ip_address: '192.168.1.1',
      created_at: new Date().toISOString(),
      is_current: true,
      revoked: false,
    },
    {
      id: '2',
      user_agent: 'Chrome/96.0',
      ip_address: '192.168.1.2',
      created_at: new Date().toISOString(),
      is_current: false,
      revoked: false,
    },
  ];

  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => 'mock-token');

    // Mock successful API response
    (authService.getSessionsService as jest.Mock).mockResolvedValue(mockSessions);
    (authService.revokeSessionService as jest.Mock).mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches sessions on mount', async () => {
    const { result } = renderHook(() => useSessions());

    // Initially loading
    expect(result.current.sessionsLoading).toBe(true);

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.sessionsLoading).toBe(false);
    });

    // Check that sessions were fetched
    expect(result.current.sessions).toEqual(mockSessions);
    expect(authService.getSessionsService).toHaveBeenCalledWith('mock-token');
  });

  it('handles fetch error', async () => {
    const { result } = renderHook(() => useSessions());

    // Wait for initial successful fetch to complete
    await waitFor(() => {
      expect(result.current.sessionsLoading).toBe(false);
    });

    // Now mock an error for the next fetch
    (authService.getSessionsService as jest.Mock).mockRejectedValueOnce({
      response: {
        data: {
          detail: 'Failed to fetch sessions'
        }
      }
    });

    // Manually trigger fetch with error
    await act(async () => {
      try {
        await result.current.fetchSessions();
      } catch (error) {
        // Error is expected and handled by the hook
      }
    });

    // Check error state
    expect(result.current.sessionsError).toBe('Failed to fetch sessions');
  });

  it('revokes a session successfully', async () => {
    const { result } = renderHook(() => useSessions());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.sessionsLoading).toBe(false);
    });

    // Revoke session wrapped in act
    await act(async () => {
      await result.current.revokeSession('2');
    });

    // Wait for the operation to complete
    await waitFor(() => {
      expect(authService.revokeSessionService).toHaveBeenCalledWith('2', 'mock-token');
    });
  });

  it('handles revoke error', async () => {
    (authService.revokeSessionService as jest.Mock).mockRejectedValue(new Error('Failed to revoke'));

    const { result } = renderHook(() => useSessions());

    await waitFor(() => {
      expect(result.current.sessionsLoading).toBe(false);
    });

    // Revoke should throw an error
    await act(async () => {
      await expect(result.current.revokeSession('2')).rejects.toThrow();
    });
  });
});
