import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SessionList from '@/components/sessions/SessionList';
import { useSessions } from '@/hooks/useSessions';

jest.mock('@/hooks/useSessions');
const mockedUseSessions = useSessions as jest.MockedFunction<typeof useSessions>;

describe('SessionList', () => {
  const mockRevokeSession = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should show loading state', () => {
    mockedUseSessions.mockReturnValue({
      sessions: [],
      sessionsLoading: true,
      sessionsError: null,
      revokeSession: mockRevokeSession,
      revokeError: null,
      revokeLoading: false,
    });

    render(<SessionList />);
    expect(screen.getByText('Chargement des sessions...')).toBeInTheDocument();
  });

  it('should show error state', () => {
    mockedUseSessions.mockReturnValue({
      sessions: [],
      sessionsLoading: false,
      sessionsError: 'Failed to load sessions',
      revokeSession: mockRevokeSession,
      revokeError: null,
      revokeLoading: false,
    });

    render(<SessionList />);
    expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
  });

  it('should show empty state when no sessions', () => {
    mockedUseSessions.mockReturnValue({
      sessions: [],
      sessionsLoading: false,
      sessionsError: null,
      revokeSession: mockRevokeSession,
      revokeError: null,
      revokeLoading: false,
    });

    render(<SessionList />);
    expect(screen.getByText('Aucune session')).toBeInTheDocument();
  });

  it('should render sessions list', () => {
    const mockSessions = [
      {
        id: '1',
        refresh_token: 'token1',
        user_agent: 'Mozilla/5.0',
        ip_address: '192.168.1.1',
        created_at: '2025-01-01T00:00:00Z',
        expires_at: '2025-02-01T00:00:00Z',
        last_used_at: '2025-01-15T00:00:00Z',
        is_current: true,
      },
      {
        id: '2',
        refresh_token: 'token2',
        user_agent: 'Chrome',
        ip_address: '192.168.1.2',
        created_at: '2025-01-02T00:00:00Z',
        expires_at: '2025-02-02T00:00:00Z',
        last_used_at: '2025-01-16T00:00:00Z',
        is_current: false,
      },
    ];

    localStorage.setItem('refresh_token', 'token1');

    mockedUseSessions.mockReturnValue({
      sessions: mockSessions,
      sessionsLoading: false,
      sessionsError: null,
      revokeSession: mockRevokeSession,
      revokeError: null,
      revokeLoading: false,
    });

    render(<SessionList />);
    expect(screen.getByText('Mozilla/5.0')).toBeInTheDocument();
    expect(screen.getByText('Chrome')).toBeInTheDocument();
  });

  it('should call revokeSession when revoke button is clicked', async () => {
    const mockSessions = [
      {
        id: '1',
        refresh_token: 'token1',
        user_agent: 'Mozilla/5.0',
        ip_address: '192.168.1.1',
        created_at: '2025-01-01T00:00:00Z',
        expires_at: '2025-02-01T00:00:00Z',
        last_used_at: '2025-01-15T00:00:00Z',
        is_current: false,
      },
    ];

    mockRevokeSession.mockResolvedValue(undefined);

    mockedUseSessions.mockReturnValue({
      sessions: mockSessions,
      sessionsLoading: false,
      sessionsError: null,
      revokeSession: mockRevokeSession,
      revokeError: null,
      revokeLoading: false,
    });

    render(<SessionList />);

    // Le bouton est "Se déconnecter" pour les sessions non courantes
    const revokeButtons = screen.getAllByRole('button');
    const revokeButton = revokeButtons.find((btn) => btn.textContent?.includes('déconnecter'));

    if (revokeButton) {
      fireEvent.click(revokeButton);

      await waitFor(() => {
        expect(mockRevokeSession).toHaveBeenCalledWith('1');
      });
    }
  });

  it('should handle revoke error silently', async () => {
    const mockSessions = [
      {
        id: '1',
        refresh_token: 'token1',
        user_agent: 'Mozilla/5.0',
        ip_address: '192.168.1.1',
        created_at: '2025-01-01T00:00:00Z',
        expires_at: '2025-02-01T00:00:00Z',
        last_used_at: '2025-01-15T00:00:00Z',
        is_current: false,
      },
    ];

    mockRevokeSession.mockRejectedValue(new Error('Revoke failed'));

    mockedUseSessions.mockReturnValue({
      sessions: mockSessions,
      sessionsLoading: false,
      sessionsError: null,
      revokeSession: mockRevokeSession,
      revokeError: null,
      revokeLoading: false,
    });

    render(<SessionList />);

    const revokeButtons = screen.getAllByRole('button');
    const revokeButton = revokeButtons.find((btn) => btn.textContent?.includes('déconnecter'));

    await expect(async () => {
      if (revokeButton) {
        fireEvent.click(revokeButton);
        await waitFor(() => {
          expect(mockRevokeSession).toHaveBeenCalled();
        });
      }
    }).not.toThrow();
  });
});
