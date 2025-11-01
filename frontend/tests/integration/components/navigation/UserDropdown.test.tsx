import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserDropdown from '@/components/navigation/UserDropdown';

describe('UserDropdown', () => {
  const mockUser = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
  };
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display user name and initials', () => {
    render(<UserDropdown user={mockUser} logout={mockLogout} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('should open dropdown when button is clicked', () => {
    render(<UserDropdown user={mockUser} logout={mockLogout} />);

    const button = screen.getByRole('button', { expanded: false });
    fireEvent.click(button);

    expect(screen.getByText(/compte/i)).toBeInTheDocument();
    expect(screen.getByText(/Session/i)).toBeInTheDocument();
  });

  it('should close dropdown when clicked again', () => {
    render(<UserDropdown user={mockUser} logout={mockLogout} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText(/compte/i)).toBeInTheDocument();

    fireEvent.click(button);
    // After clicking again, the dropdown should be closed
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('should display user email in dropdown', () => {
    render(<UserDropdown user={mockUser} logout={mockLogout} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should have links to account and sessions pages', () => {
    render(<UserDropdown user={mockUser} logout={mockLogout} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const accountLink = screen.getByText(/compte/i);
    const sessionsLink = screen.getByText(/Session/i);

    expect(accountLink.closest('a')).toHaveAttribute('href', '/settings/account');
    expect(sessionsLink.closest('a')).toHaveAttribute('href', '/settings/sessions');
  });

  it('should call logout when logout button is clicked', () => {
    render(<UserDropdown user={mockUser} logout={mockLogout} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const logoutButton = screen.getByText('Déconnexion');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('should close dropdown when clicking outside', async () => {
    render(
      <div>
        <UserDropdown user={mockUser} logout={mockLogout} />
        <div data-testid='outside'>Outside</div>
      </div>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText(/compte/i)).toBeInTheDocument();

    const outside = screen.getByTestId('outside');
    fireEvent.mouseDown(outside);

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('should not close dropdown when clicking inside', () => {
    render(<UserDropdown user={mockUser} logout={mockLogout} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const dropdown = screen.getByText(/compte/i).closest('div');
    if (dropdown) {
      fireEvent.mouseDown(dropdown);
    }

    expect(screen.getByText(/compte/i)).toBeInTheDocument();
  });
});
