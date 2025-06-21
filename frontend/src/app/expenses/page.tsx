'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ExpenseList from '@/components/expense/ExpenseList';
import ExpenseForm from '@/components/expense/ExpenseForm';

export default function ExpensesPage() {
  const { getExpenses } = useAuth();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshExpenses = () => {
    const access_token = localStorage.getItem('access_token');
    if (!access_token) return;

    const fetchExpenses = async () => {
      const expenses = await getExpenses();
      setExpenses(expenses);
      setLoading(false);
    };
    fetchExpenses();
  };

  useEffect(() => {
    refreshExpenses();
  }, []);

  if (loading) {
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
              <ExpenseForm onAdd={refreshExpenses} />
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
