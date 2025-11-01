import { render, screen, fireEvent } from '@testing-library/react';
import MenuItem from '@/components/navigation/MenuItem';

describe('MenuItem', () => {
  it('should render children correctly', () => {
    render(<MenuItem href="/test">Test Link</MenuItem>);
    expect(screen.getByText('Test Link')).toBeInTheDocument();
  });

  it('should have correct href attribute', () => {
    render(<MenuItem href="/dashboard">Dashboard</MenuItem>);
    const link = screen.getByText('Dashboard');
    expect(link).toHaveAttribute('href', '/dashboard');
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<MenuItem href="/test" onClick={handleClick}>Click Me</MenuItem>);
    
    const link = screen.getByText('Click Me');
    fireEvent.click(link);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should work without onClick callback', () => {
    expect(() => {
      render(<MenuItem href="/test">No Click Handler</MenuItem>);
    }).not.toThrow();
  });

  it('should render with icon as children', () => {
    render(
      <MenuItem href="/settings">
        <span>⚙️</span>
        <span>Settings</span>
      </MenuItem>
    );
    
    expect(screen.getByText('⚙️')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});

