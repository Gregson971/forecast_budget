'use client';

import { useState } from 'react';
import FinancialModal from '@/components/financial/FinancialModal';
import type { Transaction } from '@/types/transaction';
import type { Category, Frequency } from '@/types/financial';
import type { CreateExpenseRequest, UpdateExpenseRequest } from '@/types/expense';
import type { CreateIncomeRequest, UpdateIncomeRequest } from '@/types/income';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
  onAdd?: (type: 'expense' | 'income', data: CreateExpenseRequest | CreateIncomeRequest) => Promise<void>;
  onUpdate?: (id: string, type: 'expense' | 'income', data: UpdateExpenseRequest | UpdateIncomeRequest) => Promise<void>;
  expenseCategories: Category[];
  expenseFrequencies: Frequency[];
  incomeCategories: Category[];
  incomeFrequencies: Frequency[];
  loading?: boolean;
  initialType?: 'expense' | 'income'; // Type par défaut pour la création
}

export default function TransactionModal({
  isOpen,
  onClose,
  transaction,
  onAdd,
  onUpdate,
  expenseCategories,
  expenseFrequencies,
  incomeCategories,
  incomeFrequencies,
  loading = false,
  initialType = 'expense',
}: TransactionModalProps) {
  const isEditMode = !!transaction;
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>(
    transaction?.type || initialType
  );

  // Mettre à jour le type si la transaction change
  if (transaction && transaction.type !== transactionType) {
    setTransactionType(transaction.type);
  }

  const handleAdd = async (data: CreateExpenseRequest | CreateIncomeRequest) => {
    if (onAdd) {
      await onAdd(transactionType, data);
    }
  };

  const handleUpdate = async (id: string, data: UpdateExpenseRequest | UpdateIncomeRequest) => {
    if (onUpdate) {
      await onUpdate(id, transactionType, data);
    }
  };

  const categories = transactionType === 'expense' ? expenseCategories : incomeCategories;
  const frequencies = transactionType === 'expense' ? expenseFrequencies : incomeFrequencies;

  return (
    <div>
      {/* Sélecteur de type (uniquement en mode création) */}
      {!isEditMode && isOpen && (
        <div className='fixed inset-0 z-50 flex items-start justify-center pt-20 px-4'>
          <div className='glass p-6 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full mb-4'>
            <h3 className='text-lg font-semibold text-white mb-4'>Type de transaction</h3>
            <div className='flex gap-3'>
              <button
                onClick={() => setTransactionType('expense')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                  transactionType === 'expense'
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                Dépense
              </button>
              <button
                onClick={() => setTransactionType('income')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                  transactionType === 'income'
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                Revenu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de formulaire */}
      <FinancialModal
        isOpen={isOpen}
        onClose={onClose}
        item={transaction}
        onAdd={!isEditMode ? handleAdd : undefined}
        onUpdate={isEditMode ? handleUpdate : undefined}
        categories={categories}
        frequencies={frequencies}
        loading={loading}
        type={transactionType}
      />
    </div>
  );
}
