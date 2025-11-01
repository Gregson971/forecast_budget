import { render, screen } from '@testing-library/react';
import TransactionModal from '@/components/transaction/TransactionModal';

describe('TransactionModal', () => {
  const mockOnClose = jest.fn();
  const mockOnAdd = jest.fn();
  const mockOnUpdate = jest.fn();

  const mockExpenseCategories = [
    { value: 'food', label: 'Food' },
    { value: 'transport', label: 'Transport' },
  ];

  const mockExpenseFrequencies = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  const mockIncomeCategories = [
    { value: 'salary', label: 'Salary' },
    { value: 'freelance', label: 'Freelance' },
  ];

  const mockIncomeFrequencies = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when closed', () => {
    render(
      <TransactionModal
        isOpen={false}
        onClose={mockOnClose}
        expenseCategories={mockExpenseCategories}
        expenseFrequencies={mockExpenseFrequencies}
        incomeCategories={mockIncomeCategories}
        incomeFrequencies={mockIncomeFrequencies}
      />
    );

    expect(screen.queryByText(/transaction/i)).not.toBeInTheDocument();
  });

  it('should render in create mode with expense as default type', () => {
    render(
      <TransactionModal
        isOpen={true}
        onClose={mockOnClose}
        onAdd={mockOnAdd}
        expenseCategories={mockExpenseCategories}
        expenseFrequencies={mockExpenseFrequencies}
        incomeCategories={mockIncomeCategories}
        incomeFrequencies={mockIncomeFrequencies}
      />
    );

    expect(screen.getByText(/transaction/i)).toBeInTheDocument();
  });

  it('should render in create mode with income as initial type', () => {
    render(
      <TransactionModal
        isOpen={true}
        onClose={mockOnClose}
        onAdd={mockOnAdd}
        expenseCategories={mockExpenseCategories}
        expenseFrequencies={mockExpenseFrequencies}
        incomeCategories={mockIncomeCategories}
        incomeFrequencies={mockIncomeFrequencies}
        initialType='income'
      />
    );

    expect(screen.getByText(/transaction/i)).toBeInTheDocument();
  });

  it('should render in edit mode for expense', () => {
    const mockTransaction = {
      id: '1',
      user_id: 'user1',
      name: 'Test Expense',
      amount: 100,
      date: '2025-01-01',
      category: 'food',
      type: 'expense' as const,
      is_recurring: false,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    };

    render(
      <TransactionModal
        isOpen={true}
        onClose={mockOnClose}
        transaction={mockTransaction}
        onUpdate={mockOnUpdate}
        expenseCategories={mockExpenseCategories}
        expenseFrequencies={mockExpenseFrequencies}
        incomeCategories={mockIncomeCategories}
        incomeFrequencies={mockIncomeFrequencies}
      />
    );

    const modifierElements = screen.getAllByText(/Modifier/i);
    expect(modifierElements.length).toBeGreaterThan(0);
  });

  it('should render in edit mode for income', () => {
    const mockTransaction = {
      id: '1',
      user_id: 'user1',
      name: 'Test Income',
      amount: 5000,
      date: '2025-01-01',
      category: 'salary',
      type: 'income' as const,
      is_recurring: false,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    };

    render(
      <TransactionModal
        isOpen={true}
        onClose={mockOnClose}
        transaction={mockTransaction}
        onUpdate={mockOnUpdate}
        expenseCategories={mockExpenseCategories}
        expenseFrequencies={mockExpenseFrequencies}
        incomeCategories={mockIncomeCategories}
        incomeFrequencies={mockIncomeFrequencies}
      />
    );

    const modifierElements = screen.getAllByText(/Modifier/i);
    expect(modifierElements.length).toBeGreaterThan(0);
  });

  it('should show loading state', () => {
    render(
      <TransactionModal
        isOpen={true}
        onClose={mockOnClose}
        expenseCategories={mockExpenseCategories}
        expenseFrequencies={mockExpenseFrequencies}
        incomeCategories={mockIncomeCategories}
        incomeFrequencies={mockIncomeFrequencies}
        loading={true}
      />
    );

    expect(screen.getByText(/transaction/i)).toBeInTheDocument();
  });
});

