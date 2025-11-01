import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '@/components/navigation/Navbar';
import { useAuth } from '@/context/AuthContext';

jest.mock('@/context/AuthContext');
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('Navbar', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state when authenticating', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: jest.fn(),
      register: jest.fn(),
      logout: mockLogout,
      getUser: jest.fn(),
      updateUser: jest.fn(),
    });

    render(<Navbar />);

    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('should render logo and brand', () => {
    mockedUseAuth.mockReturnValue({
      user: { email: 'test@test.com', first_name: 'John', last_name: 'Doe' },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: mockLogout,
      getUser: jest.fn(),
      updateUser: jest.fn(),
    });

    render(<Navbar />);

    expect(screen.getByText('Forecast Budget')).toBeInTheDocument();
  });

  it('should show login link when not authenticated', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: mockLogout,
      getUser: jest.fn(),
      updateUser: jest.fn(),
    });

    render(<Navbar />);

    const connexionLinks = screen.getAllByText('Connexion');
    expect(connexionLinks.length).toBeGreaterThan(0);
  });

  it('should show user dropdown when authenticated', () => {
    mockedUseAuth.mockReturnValue({
      user: { email: 'test@test.com', first_name: 'John', last_name: 'Doe' },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: mockLogout,
      getUser: jest.fn(),
      updateUser: jest.fn(),
    });

    render(<Navbar />);

    const userElements = screen.getAllByText('John Doe');
    expect(userElements.length).toBeGreaterThan(0);
  });

  it('should open mobile menu when burger button is clicked', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: mockLogout,
      getUser: jest.fn(),
      updateUser: jest.fn(),
    });

    render(<Navbar />);

    const burgerButton = screen.getByLabelText('Ouvrir le menu');
    fireEvent.click(burgerButton);

    // Le mobile menu devrait être visible
    expect(screen.getByLabelText('Fermer le menu')).toBeInTheDocument();
  });

  it('should render navigation menu items', () => {
    mockedUseAuth.mockReturnValue({
      user: { email: 'test@test.com', first_name: 'John', last_name: 'Doe' },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: mockLogout,
      getUser: jest.fn(),
      updateUser: jest.fn(),
    });

    render(<Navbar />);

    const transactionsLinks = screen.getAllByText('Transactions');
    expect(transactionsLinks.length).toBeGreaterThan(0);
    const forecastLinks = screen.getAllByText('Prévisions');
    expect(forecastLinks.length).toBeGreaterThan(0);
  });
});
