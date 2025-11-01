import React from 'react';
import { render, screen } from '@testing-library/react';
import TransactionList from '@/components/transaction/TransactionList';
import type { Transaction } from '@/types/transaction';

// Mock TransactionItem to simplify the tests
jest.mock('@/components/transaction/TransactionItem', () => {
  return function MockTransactionItem({ transaction }: any) {
    return <div data-testid="transaction-item">{transaction.name}</div>;
  };
});

describe('TransactionList', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const mockTransactions: Transaction[] = [
    {
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
    },
    {
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
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state when no transactions', () => {
    render(<TransactionList transactions={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText(/Aucune transaction/i)).toBeInTheDocument();
  });

  it('should render list of transactions', () => {
    render(<TransactionList transactions={mockTransactions} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
  });

  it('should display summary totals', () => {
    render(<TransactionList transactions={mockTransactions} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // The component displays total income, expenses and balance
    expect(screen.getByText(/5000/)).toBeInTheDocument();
  });
});

