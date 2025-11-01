import { render, screen, fireEvent } from '@testing-library/react';
import TransactionItem from '@/components/transaction/TransactionItem';
import type { Transaction } from '@/types/transaction';

describe('TransactionItem', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const mockExpenseTransaction: Transaction = {
    id: '1',
    user_id: 'user1',
    name: 'Groceries',
    amount: 100,
    date: '2025-01-15',
    category: 'food',
    type: 'expense',
    is_recurring: false,
    created_at: '2025-01-15',
    updated_at: '2025-01-15',
  };

  const mockIncomeTransaction: Transaction = {
    id: '2',
    user_id: 'user1',
    name: 'Salary',
    amount: 5000,
    date: '2025-01-01',
    category: 'salary',
    type: 'income',
    is_recurring: true,
    frequency: 'monthly',
    created_at: '2025-01-01',
    updated_at: '2025-01-01',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render expense transaction', () => {
    render(<TransactionItem transaction={mockExpenseTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText(/100\.00/)).toBeInTheDocument();
  });

  it('should render income transaction', () => {
    render(<TransactionItem transaction={mockIncomeTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByText(/5000\.00/)).toBeInTheDocument();
  });

  it('should display frequency badge for recurring transactions', () => {
    render(<TransactionItem transaction={mockIncomeTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // Le composant affiche la fréquence (monthly) comme badge
    expect(screen.getByText('monthly')).toBeInTheDocument();
  });

  it('should not display frequency badge for non-recurring transactions', () => {
    render(<TransactionItem transaction={mockExpenseTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // Pas de fréquence pour les transactions non récurrentes
    expect(screen.queryByText('monthly')).not.toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    render(<TransactionItem transaction={mockExpenseTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const editButton = screen.getByTitle(/Modifier/i);
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockExpenseTransaction);
  });

  it('should open delete confirmation when delete button is clicked', () => {
    render(<TransactionItem transaction={mockExpenseTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByTitle(/Supprimer/i);
    fireEvent.click(deleteButton);

    const deleteElements = screen.getAllByText(/Supprimer/i);
    expect(deleteElements.length).toBeGreaterThan(0);
  });

  it('should call onDelete when delete is confirmed', () => {
    render(<TransactionItem transaction={mockExpenseTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByTitle(/Supprimer/i);
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByText('Supprimer');
    fireEvent.click(confirmButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('should close confirmation modal when cancel is clicked', () => {
    render(<TransactionItem transaction={mockExpenseTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByTitle(/Supprimer/i);
    fireEvent.click(deleteButton);

    // Modal should be open
    expect(screen.getByText('Annuler')).toBeInTheDocument();

    const cancelButton = screen.getByText('Annuler');
    fireEvent.click(cancelButton);

    // Modal should be closed - check that cancel button is gone
    expect(screen.queryByText('Annuler')).not.toBeInTheDocument();
  });

  it('should display transaction date', () => {
    render(<TransactionItem transaction={mockExpenseTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // The date should be formatted and displayed
    expect(screen.getByText(/15/)).toBeInTheDocument();
  });

  it('should show category icon for expense', () => {
    render(<TransactionItem transaction={mockExpenseTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // Icon should be rendered (food emoji)
    expect(screen.getByText('🍽️')).toBeInTheDocument();
  });

  it('should show category icon for income', () => {
    render(<TransactionItem transaction={mockIncomeTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // Icon should be rendered (salary emoji)
    expect(screen.getByText('💰')).toBeInTheDocument();
  });
});

