'use client';

import FinancialModal from '@/components/financial/FinancialModal';
import { Expense, CreateExpenseRequest, UpdateExpenseRequest, Category, Frequency } from '@/types/expense';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense | null; // null = mode création, Expense = mode édition
  onAdd?: (expense: CreateExpenseRequest) => Promise<void>;
  onUpdate?: (expenseId: string, expense: UpdateExpenseRequest) => Promise<void>;
  categories: Category[];
  frequencies: Frequency[];
  loading?: boolean;
}

export default function ExpenseModal({ isOpen, onClose, expense, onAdd, onUpdate, categories, frequencies, loading = false }: ExpenseModalProps) {
  return (
    <FinancialModal
      isOpen={isOpen}
      onClose={onClose}
      item={expense}
      onAdd={onAdd}
      onUpdate={onUpdate}
      categories={categories}
      frequencies={frequencies}
      loading={loading}
      type='expense'
    />
  );
}
