import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '@/components/ui/Input';

describe('Input Component', () => {
  it('renders with label', () => {
    render(<Input label="Email" type="email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('handles input changes', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Input label="Username" onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'testuser');

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('testuser');
  });

  it('displays error message', () => {
    render(<Input label="Password" type="password" error="Password is required" />);
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('can be marked as required', () => {
    render(<Input label="Required Field" required />);
    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('can be disabled', () => {
    render(<Input label="Disabled Field" disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('accepts placeholder text', () => {
    render(<Input label="Search" placeholder="Enter search term..." />);
    expect(screen.getByPlaceholderText('Enter search term...')).toBeInTheDocument();
  });

  it('supports different input types', () => {
    const { container, rerender } = render(<Input label="Email" type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input label="Password" type="password" />);
    // Password inputs don't have a role of textbox, use container.querySelector
    const passwordInput = container.querySelector('input[type="password"]');
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
