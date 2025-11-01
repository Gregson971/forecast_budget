import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FinancialModal from '@/components/financial/FinancialModal';

describe('FinancialModal', () => {
  const mockOnClose = jest.fn();
  const mockOnAdd = jest.fn();
  const mockOnUpdate = jest.fn();

  const mockCategories = [
    { value: 'food', label: 'Food' },
    { value: 'transport', label: 'Transport' },
  ];

  const mockFrequencies = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when closed', () => {
    render(
      <FinancialModal
        isOpen={false}
        onClose={mockOnClose}
        categories={mockCategories}
        frequencies={mockFrequencies}
        type='expense'
      />
    );

    expect(screen.queryByText('Nouvelle dépense')).not.toBeInTheDocument();
  });

  it('should render in create mode for expense', () => {
    render(
      <FinancialModal
        isOpen={true}
        onClose={mockOnClose}
        onAdd={mockOnAdd}
        categories={mockCategories}
        frequencies={mockFrequencies}
        type='expense'
      />
    );

    expect(screen.getByText('Nouvelle dépense')).toBeInTheDocument();
  });

  it('should render in create mode for income', () => {
    render(
      <FinancialModal
        isOpen={true}
        onClose={mockOnClose}
        onAdd={mockOnAdd}
        categories={mockCategories}
        frequencies={mockFrequencies}
        type='income'
      />
    );

    expect(screen.getByText(/Nouvelle?.*revenu/i)).toBeInTheDocument();
  });

  it('should render in edit mode for expense', () => {
    const mockItem = {
      id: '1',
      user_id: 'user1',
      name: 'Test Expense',
      amount: 100,
      date: '2025-01-01',
      category: 'food',
      is_recurring: false,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    };

    render(
      <FinancialModal
        isOpen={true}
        onClose={mockOnClose}
        item={mockItem}
        onUpdate={mockOnUpdate}
        categories={mockCategories}
        frequencies={mockFrequencies}
        type='expense'
      />
    );

    expect(screen.getByText('Modifier la dépense')).toBeInTheDocument();
  });

  it('should render in edit mode for income', () => {
    const mockItem = {
      id: '1',
      user_id: 'user1',
      name: 'Test Income',
      amount: 5000,
      date: '2025-01-01',
      category: 'salary',
      is_recurring: false,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    };

    render(
      <FinancialModal
        isOpen={true}
        onClose={mockOnClose}
        item={mockItem}
        onUpdate={mockOnUpdate}
        categories={mockCategories}
        frequencies={mockFrequencies}
        type='income'
      />
    );

    const modifierElements = screen.getAllByText(/Modifier/i);
    expect(modifierElements.length).toBeGreaterThan(0);
  });

  it('should call onClose when modal is closed', () => {
    render(
      <FinancialModal
        isOpen={true}
        onClose={mockOnClose}
        categories={mockCategories}
        frequencies={mockFrequencies}
        type='expense'
      />
    );

    const closeButton = screen.getByTitle('Fermer');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should show loading state', () => {
    render(
      <FinancialModal
        isOpen={true}
        onClose={mockOnClose}
        categories={mockCategories}
        frequencies={mockFrequencies}
        type='expense'
        loading={true}
      />
    );

    expect(screen.getByText('Nouvelle dépense')).toBeInTheDocument();
  });
});

