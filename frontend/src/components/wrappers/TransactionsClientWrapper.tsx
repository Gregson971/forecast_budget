'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import TransactionList from '@/components/transaction/TransactionList';
import TransactionModal from '@/components/transaction/TransactionModal';
import CSVUploader from '@/components/import/CSVUploader';
import { useTransactions } from '@/hooks/useTransactions';
import { Transaction } from '@/types/transaction';
import type { CreateExpenseRequest, UpdateExpenseRequest } from '@/types/expense';
import type { CreateIncomeRequest, UpdateIncomeRequest } from '@/types/income';
import { handleCrudError } from '@/lib/errorHandler';

export default function TransactionsClientWrapper() {
  const {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    expenseCategories,
    expenseFrequencies,
    incomeCategories,
    incomeFrequencies,
  } = useTransactions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showCSVUploader, setShowCSVUploader] = useState(false);
  const [modalType, setModalType] = useState<'expense' | 'income'>('expense');

  const handleAddTransaction = (type: 'expense' | 'income') => {
    setModalType(type);
    setSelectedTransaction(null);
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = async (id: string, type: 'expense' | 'income') => {
    try {
      await deleteTransaction(id, type);
    } catch (error) {
      handleCrudError('delete', type === 'expense' ? 'la dépense' : 'le revenu', error);
    }
  };

  const handleCreateTransaction = async (
    type: 'expense' | 'income',
    data: CreateExpenseRequest | CreateIncomeRequest
  ) => {
    try {
      await createTransaction(type, data);
      setIsModalOpen(false);
    } catch (error) {
      handleCrudError('create', type === 'expense' ? 'la dépense' : 'le revenu', error);
      throw error;
    }
  };

  const handleUpdateTransaction = async (
    id: string,
    type: 'expense' | 'income',
    data: UpdateExpenseRequest | UpdateIncomeRequest
  ) => {
    try {
      await updateTransaction(id, type, data);
      setIsModalOpen(false);
    } catch (error) {
      handleCrudError('update', type === 'expense' ? 'la dépense' : 'le revenu', error);
      throw error;
    }
  };

  return (
    <ProtectedRoute>
      {/* Boutons d'action */}
      <div className='mb-8'>
        <div className='flex flex-wrap gap-3'>
          <button
            onClick={() => setShowCSVUploader(!showCSVUploader)}
            className='ripple group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded font-medium transition-all elevation-2 hover:elevation-3'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
              />
            </svg>
            <span>{showCSVUploader ? 'Masquer' : 'Importer CSV'}</span>
          </button>

          <button
            onClick={() => handleAddTransaction('expense')}
            className='ripple group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded font-medium transition-all elevation-2 hover:elevation-3'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
            <span>Nouvelle dépense</span>
          </button>

          <button
            onClick={() => handleAddTransaction('income')}
            className='ripple group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded font-medium transition-all elevation-2 hover:elevation-3'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
            <span>Nouveau revenu</span>
          </button>
        </div>
      </div>

      {/* Import CSV */}
      {showCSVUploader && (
        <div className='mb-8 animate-fade-in'>
          <CSVUploader />
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className='mb-6 glass p-4 rounded elevation-1 border border-destructive/30 bg-destructive/10'>
          <div className='flex items-center space-x-3'>
            <svg className='w-6 h-6 text-destructive flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <p className='text-destructive'>{error}</p>
          </div>
        </div>
      )}

      {/* Chargement */}
      {loading && transactions.length === 0 ? (
        <div className='glass p-12 rounded-lg elevation-2 text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent'></div>
          <p className='text-muted-foreground mt-4'>Chargement des transactions...</p>
        </div>
      ) : (
        /* Liste des transactions */
        <div className='space-y-4'>
          <TransactionList
            transactions={transactions}
            onDelete={handleDeleteTransaction}
            onEdit={handleEditTransaction}
          />
        </div>
      )}

      {/* Modal de transaction */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTransaction}
        onAdd={handleCreateTransaction}
        onUpdate={handleUpdateTransaction}
        expenseCategories={expenseCategories}
        expenseFrequencies={expenseFrequencies}
        incomeCategories={incomeCategories}
        incomeFrequencies={incomeFrequencies}
        initialType={modalType}
      />
    </ProtectedRoute>
  );
}
