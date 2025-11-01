import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from '@/components/ui/ConfirmModal';

describe('ConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when isOpen is true', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(<ConfirmModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', () => {
    render(<ConfirmModal {...defaultProps} />);
    const cancelButton = screen.getByText('Annuler');
    fireEvent.click(cancelButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    expect(defaultProps.onConfirm).not.toHaveBeenCalled();
  });

  it('should call both onConfirm and onClose when confirm button is clicked', () => {
    render(<ConfirmModal {...defaultProps} />);
    const confirmButton = screen.getByText('Confirmer');
    fireEvent.click(confirmButton);
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should render custom button text', () => {
    render(<ConfirmModal {...defaultProps} confirmText='Delete' cancelText='Keep' />);
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Keep')).toBeInTheDocument();
  });

  it('should apply danger variant styles by default', () => {
    render(<ConfirmModal {...defaultProps} />);
    const confirmButton = screen.getByText('Confirmer');
    expect(confirmButton.className).toContain('bg-red-500');
  });

  it('should apply warning variant styles', () => {
    render(<ConfirmModal {...defaultProps} variant='warning' />);
    const confirmButton = screen.getByText('Confirmer');
    expect(confirmButton.className).toContain('bg-yellow-500');
  });

  it('should apply info variant styles', () => {
    render(<ConfirmModal {...defaultProps} variant='info' />);
    const confirmButton = screen.getByText('Confirmer');
    expect(confirmButton.className).toContain('bg-blue-500');
  });

  it('should call onClose when Escape key is pressed', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', () => {
    const { container } = render(<ConfirmModal {...defaultProps} />);
    const backdrop = container.querySelector('.fixed > .absolute');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    }
  });

  it('should not call onClose when modal content is clicked', () => {
    render(<ConfirmModal {...defaultProps} />);
    const modalContent = screen.getByText('Confirm Action');
    fireEvent.click(modalContent);
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('should set body overflow to hidden when open', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body overflow when closed', () => {
    const { rerender } = render(<ConfirmModal {...defaultProps} />);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<ConfirmModal {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe('unset');
  });
});
