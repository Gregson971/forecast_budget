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

  if (loading) return <div className='p-4'>Chargement...</div>;

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-2xl font-semibold mb-4'>Mes dépenses</h1>
      <ExpenseForm onAdd={refreshExpenses} />
      <ExpenseList expenses={expenses} />
    </div>
  );
}
