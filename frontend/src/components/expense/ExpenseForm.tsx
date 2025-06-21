'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { CreateExpenseRequest, Category, Frequency } from '@/types/expense';

interface ExpenseFormProps {
  onAdd: (expense: CreateExpenseRequest) => void;
  categories: Category[];
  frequencies: Frequency[];
  loadingData: boolean;
  dataError: string | null;
}

export default function ExpenseForm({ onAdd, categories, frequencies, loadingData, dataError }: ExpenseFormProps) {
  const [form, setForm] = useState<CreateExpenseRequest>({
    name: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
    is_recurring: false,
    frequency: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      onAdd(form);
      setForm({
        name: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        category: '',
        description: '',
        is_recurring: false,
        frequency: '',
      });
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la création de la dépense');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className='space-y-6'>
        <div className='text-center mb-6'>
          <h2 className='text-2xl font-bold text-white mb-2'>Nouvelle dépense</h2>
          <p className='text-gray-400'>Ajoutez une nouvelle dépense à votre budget</p>
        </div>
        <div className='flex items-center justify-center py-8'>
          <div className='w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
          <span className='ml-3 text-gray-400'>Chargement des données...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-bold text-white mb-2'>Nouvelle dépense</h2>
        <p className='text-gray-400'>Ajoutez une nouvelle dépense à votre budget</p>
      </div>

      {dataError && (
        <div className='p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl'>
          <p className='text-yellow-400 text-sm'>{dataError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        <Input label='Nom de la dépense' type='text' name='name' value={form.name} onChange={handleChange} placeholder='Ex: Courses alimentaires' required />

        <Input label='Montant (€)' type='number' name='amount' value={form.amount} onChange={handleChange} placeholder='0.00' required />

        <Input label='Date' type='date' name='date' value={form.date} onChange={handleChange} required />

        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-300 block'>Catégorie</label>
          <select
            name='category'
            value={form.category}
            onChange={handleChange}
            className='w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-gray-500 transition-all duration-300 backdrop-blur-sm'
            required
          >
            <option value=''>Sélectionner une catégorie</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label='Description (optionnelle)'
          type='text'
          name='description'
          value={form.description || ''}
          onChange={handleChange}
          placeholder='Description détaillée de la dépense'
        />

        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-300 block'>Fréquence (optionnelle)</label>
          <select
            name='frequency'
            value={form.frequency || ''}
            onChange={handleChange}
            className='w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-gray-500 transition-all duration-300 backdrop-blur-sm'
          >
            <option value=''>Aucune fréquence</option>
            {frequencies.map((frequency) => (
              <option key={frequency.value} value={frequency.value}>
                {frequency.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className='p-4 bg-red-500/10 border border-red-500/20 rounded-xl'>
            <p className='text-red-400 text-sm'>{error}</p>
          </div>
        )}

        <Button type='submit' className='w-full' disabled={loading}>
          {loading ? (
            <div className='flex items-center justify-center'>
              <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
              Ajout en cours...
            </div>
          ) : (
            <div className='flex items-center justify-center'>
              <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
              </svg>
              Ajouter la dépense
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
