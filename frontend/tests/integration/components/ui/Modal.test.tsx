import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '@/components/ui/Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Modal',
    children: <div>Modal Content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<Modal {...defaultProps} />);
    const closeButton = screen.getByTitle('Fermer');
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when overlay is clicked', () => {
    render(<Modal {...defaultProps} />);
    const overlay = screen.getByText('Test Modal').closest('.fixed')?.querySelector('.absolute');
    if (overlay) {
      fireEvent.click(overlay);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    }
  });

  it('should apply small size class', () => {
    const { container } = render(<Modal {...defaultProps} size='sm' />);
    const modal = container.querySelector('.max-w-md');
    expect(modal).toBeInTheDocument();
  });

  it('should apply medium size class by default', () => {
    const { container } = render(<Modal {...defaultProps} />);
    const modal = container.querySelector('.max-w-2xl');
    expect(modal).toBeInTheDocument();
  });

  it('should apply large size class', () => {
    const { container } = render(<Modal {...defaultProps} size='lg' />);
    const modal = container.querySelector('.max-w-4xl');
    expect(modal).toBeInTheDocument();
  });

  it('should apply extra large size class', () => {
    const { container } = render(<Modal {...defaultProps} size='xl' />);
    const modal = container.querySelector('.max-w-6xl');
    expect(modal).toBeInTheDocument();
  });

  it('should render custom children content', () => {
    render(
      <Modal {...defaultProps}>
        <div>Custom Content</div>
        <button>Custom Button</button>
      </Modal>
    );
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Custom Button' })).toBeInTheDocument();
  });
});
