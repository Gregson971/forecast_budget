import { render, screen, fireEvent } from '@testing-library/react';
import MobileMenu from '@/components/navigation/MobileMenu';

describe('MobileMenu', () => {
  const mockOnClose = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not be visible when closed', () => {
    const { container } = render(<MobileMenu open={false} onClose={mockOnClose} />);

    const overlay = container.querySelector('.opacity-0');
    expect(overlay).toBeInTheDocument();
  });

  it('should be visible when open', () => {
    const { container } = render(<MobileMenu open={true} onClose={mockOnClose} />);

    const overlay = container.querySelector('.opacity-100');
    expect(overlay).toBeInTheDocument();
  });

  it('should display user info when user is provided', () => {
    const mockUser = { first_name: 'John', last_name: 'Doe' };

    render(<MobileMenu open={true} onClose={mockOnClose} user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('JD')).toBeInTheDocument(); // Initiales
  });

  it('should render navigation links', () => {
    render(<MobileMenu open={true} onClose={mockOnClose} />);

    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(screen.getByText('Prévisions')).toBeInTheDocument();
    expect(screen.getByText('À propos')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<MobileMenu open={true} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('Fermer le menu');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when overlay is clicked', () => {
    const { container } = render(<MobileMenu open={true} onClose={mockOnClose} />);

    const overlay = container.firstChild as HTMLElement;
    fireEvent.click(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not close when clicking inside menu', () => {
    render(<MobileMenu open={true} onClose={mockOnClose} />);

    const menuContent = screen.getByText('Transactions').closest('aside');
    if (menuContent) {
      fireEvent.click(menuContent);
    }

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should show user settings when user is authenticated', () => {
    const mockUser = { first_name: 'John', last_name: 'Doe' };

    render(<MobileMenu open={true} onClose={mockOnClose} user={mockUser} logout={mockLogout} />);

    expect(screen.getByText(/compte/i)).toBeInTheDocument();
    expect(screen.getByText(/Session/i)).toBeInTheDocument();
  });

  it('should show login link when user is not authenticated', () => {
    render(<MobileMenu open={true} onClose={mockOnClose} />);

    expect(screen.getByText('Connexion')).toBeInTheDocument();
  });

  it('should call logout when logout button is clicked', () => {
    const mockUser = { first_name: 'John', last_name: 'Doe' };

    render(<MobileMenu open={true} onClose={mockOnClose} user={mockUser} logout={mockLogout} />);

    const logoutButton = screen.getByText('Déconnexion');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

