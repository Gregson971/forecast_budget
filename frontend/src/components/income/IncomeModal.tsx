'use client';

import FinancialModal from '@/components/financial/FinancialModal';
import { Income, CreateIncomeRequest, UpdateIncomeRequest, Category, Frequency } from '@/types/financial';

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  income?: Income | null; // null = mode création, Income = mode édition
  onAdd?: (income: CreateIncomeRequest) => Promise<void>;
  onUpdate?: (incomeId: string, income: UpdateIncomeRequest) => Promise<void>;
  categories: Category[];
  frequencies: Frequency[];
  loading?: boolean;
}

export default function IncomeModal({ isOpen, onClose, income, onAdd, onUpdate, categories, frequencies, loading = false }: IncomeModalProps) {
  return (
    <FinancialModal
      isOpen={isOpen}
      onClose={onClose}
      item={income}
      onAdd={onAdd}
      onUpdate={onUpdate}
      categories={categories}
      frequencies={frequencies}
      loading={loading}
      type='income'
    />
  );
}
