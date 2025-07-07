'use client';

import { useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import ExpenseList from '@/components/expense/ExpenseList';
import ExpenseModal from '@/components/expense/ExpenseModal';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Expense } from '@/types/expense';
import Button from '@/components/ui/Button';

export default function ExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const {
    expenses,
    expensesLoading,
    expensesError,
    fetchExpenses,
    createExpense,
    deleteExpense,
    updateExpense,
    createExpenseLoading,
    createExpenseError,
    deleteExpenseLoading,
    deleteExpenseError,
    updateExpenseLoading,
    updateExpenseError,
    categories,
    frequencies,
    expenseDataLoading,
    expenseDataError,
  } = useExpenses();

  const handleAddExpense = async (expenseData: any) => {
    try {
      await createExpense(expenseData);
      // La liste sera automatiquement rafraîchie grâce au hook
    } catch (error) {
      console.error('Erreur lors de la création de la dépense:', error);
      throw error; // Re-lancer l'erreur pour que le modal puisse l'afficher
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteExpense(expenseId);
      // La liste sera automatiquement rafraîchie grâce au hook
    } catch (error) {
      console.error('Erreur lors de la suppression de la dépense:', error);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleUpdateExpense = async (expenseId: string, expenseData: any) => {
    try {
      await updateExpense(expenseId, expenseData);
      // La liste sera automatiquement rafraîchie grâce au hook
    } catch (error) {
      console.error('Erreur lors de la modification de la dépense:', error);
      throw error; // Re-lancer l'erreur pour que le modal puisse l'afficher
    }
  };

  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  if (expensesLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='glass-card p-8 rounded-2xl'>
          <div className='flex items-center space-x-4'>
            <div className='w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin'></div>
            <span className='text-white text-lg'>Chargement des dépenses...</span>
          </div>
        </div>
      </div>
    );
  }

  if (expensesError) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='glass-card p-8 rounded-2xl'>
          <div className='text-center'>
            <div className='w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4'>
              <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-white mb-2'>Erreur de chargement</h3>
            <p className='text-gray-400 mb-4'>{expensesError}</p>
            <button onClick={fetchExpenses} className='px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors'>
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
        <div className='container mx-auto px-4 py-8'>
          {/* Header avec bouton d'ajout */}
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h1 className='text-3xl font-bold text-white mb-2'>Mes dépenses</h1>
              <p className='text-gray-400'>Gérez et suivez vos dépenses en temps réel</p>
            </div>
            <Button onClick={handleOpenAddModal} className='flex items-center space-x-2'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
              </svg>
              <span>Nouvelle dépense</span>
            </Button>
          </div>

          {/* Liste des dépenses */}
          <div className='glass-card p-6 rounded-2xl'>
            <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} onEdit={handleEditExpense} />
          </div>
        </div>

        {/* Modal unifié pour ajout et édition */}
        <ExpenseModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          expense={editingExpense}
          onAdd={handleAddExpense}
          onUpdate={handleUpdateExpense}
          categories={categories}
          frequencies={frequencies}
          loading={false}
        />
      </div>
    </ProtectedRoute>
  );
}
