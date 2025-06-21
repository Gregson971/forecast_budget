'use client';

import { useExpenses } from '@/hooks/useExpenses';
import ExpenseList from '@/components/expense/ExpenseList';
import ExpenseForm from '@/components/expense/ExpenseForm';

export default function ExpensesPage() {
  const {
    expenses,
    expensesLoading,
    expensesError,
    fetchExpenses,
    createExpense,
    createExpenseLoading,
    createExpenseError,
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
    }
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
            <div className='w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4'>
              <svg className='w-8 h-8 text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-white mb-2'>Erreur de chargement</h3>
            <p className='text-gray-400 mb-4'>{expensesError}</p>
            <button onClick={fetchExpenses} className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'>
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Arrière-plan avec effet de particules */}
      <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900'></div>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]'></div>

      <div className='relative z-10 p-6 max-w-6xl mx-auto'>
        <div className='mb-8 fade-in'>
          <h1 className='text-4xl font-bold text-white mb-2'>Mes dépenses</h1>
          <p className='text-gray-400 text-lg'>Gérez et suivez vos dépenses en temps réel</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-1'>
            <div className='glass-card p-6 rounded-2xl sticky top-24'>
              <ExpenseForm onAdd={handleAddExpense} categories={categories} frequencies={frequencies} loadingData={expenseDataLoading} dataError={expenseDataError} />
              {createExpenseLoading && (
                <div className='mt-4 text-center'>
                  <div className='w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto'></div>
                  <span className='text-sm text-gray-400 ml-2'>Création en cours...</span>
                </div>
              )}
              {createExpenseError && (
                <div className='mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg'>
                  <p className='text-sm text-red-400'>{createExpenseError}</p>
                </div>
              )}
            </div>
          </div>

          <div className='lg:col-span-2'>
            <div className='glass-card p-6 rounded-2xl'>
              <ExpenseList expenses={expenses} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
