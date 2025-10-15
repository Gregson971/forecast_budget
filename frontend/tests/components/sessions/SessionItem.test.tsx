import { render, screen, fireEvent } from '@testing-library/react';
import SessionItem from '@/components/sessions/SessionItem';

describe('SessionItem Component', () => {
  const mockSession = {
    id: '123',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    ip_address: '192.168.1.1',
    created_at: new Date('2025-01-01T10:00:00Z').toISOString(),
    revoked: false,
  };

  it('renders session information', () => {
    render(<SessionItem session={mockSession} isCurrent={false} onRevoke={jest.fn()} />);

    expect(screen.getByText(/Mozilla\/5.0/)).toBeInTheDocument();
    expect(screen.getByText(/192\.168\.1\.1/)).toBeInTheDocument();
  });

  it('shows "Appareil actuel" badge for current session', () => {
    render(<SessionItem session={mockSession} isCurrent={true} onRevoke={jest.fn()} />);

    expect(screen.getByText('Appareil actuel')).toBeInTheDocument();
  });

  it('shows "Révoquée" badge for revoked session', () => {
    const revokedSession = { ...mockSession, revoked: true };
    render(<SessionItem session={revokedSession} isCurrent={false} onRevoke={jest.fn()} />);

    expect(screen.getByText('Révoquée')).toBeInTheDocument();
  });

  it('does not show revoke button for current session', () => {
    render(<SessionItem session={mockSession} isCurrent={true} onRevoke={jest.fn()} />);

    expect(screen.queryByText('Se déconnecter')).not.toBeInTheDocument();
  });

  it('does not show revoke button for revoked session', () => {
    const revokedSession = { ...mockSession, revoked: true };
    render(<SessionItem session={revokedSession} isCurrent={false} onRevoke={jest.fn()} />);

    expect(screen.queryByText('Se déconnecter')).not.toBeInTheDocument();
  });

  it('shows revoke button for non-current, non-revoked session', () => {
    render(<SessionItem session={mockSession} isCurrent={false} onRevoke={jest.fn()} />);

    expect(screen.getByText('Se déconnecter')).toBeInTheDocument();
  });

  it('calls onRevoke when revoke button is clicked', () => {
    const onRevoke = jest.fn();
    render(<SessionItem session={mockSession} isCurrent={false} onRevoke={onRevoke} />);

    fireEvent.click(screen.getByText('Se déconnecter'));
    expect(onRevoke).toHaveBeenCalledTimes(1);
  });
});
