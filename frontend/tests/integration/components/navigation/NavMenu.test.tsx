import { render, screen } from '@testing-library/react';
import NavMenu from '@/components/navigation/NavMenu';

describe('NavMenu', () => {
  it('should render all menu items', () => {
    render(<NavMenu />);
    
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(screen.getByText('Prévisions')).toBeInTheDocument();
    expect(screen.getByText('À propos')).toBeInTheDocument();
  });

  it('should have correct links', () => {
    render(<NavMenu />);
    
    const transactionsLink = screen.getByText('Transactions');
    const forecastsLink = screen.getByText('Prévisions'  );
    const aboutLink = screen.getByText('À propos');
    
    expect(transactionsLink).toHaveAttribute('href', '/transactions');
    expect(forecastsLink).toHaveAttribute('href', '/forecasts');
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('should render in hidden container on mobile', () => {
    const { container } = render(<NavMenu />);
    
    const navMenu = container.firstChild as HTMLElement;
    expect(navMenu.className).toContain('hidden');
    expect(navMenu.className).toContain('md:flex');
  });
});

