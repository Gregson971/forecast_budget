'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ExpenseForm({ onAdd }: { onAdd: (expense: any) => void }) {
  const { createExpense } = useAuth();
  const [form, setForm] = useState({
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createExpense(form);
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

  return (
    <form onSubmit={handleSubmit} className='mb-6 p-4 bg-white rounded-xl shadow-sm space-y-4'>
      <div>
        <label className='block text-sm font-medium'>Nom</label>
        <input type='text' name='name' value={form.name} onChange={handleChange} required className='input' />
      </div>

      <div>
        <label className='block text-sm font-medium'>Montant (€)</label>
        <input type='number' name='amount' value={form.amount} onChange={handleChange} required className='input' />
      </div>

      <div>
        <label className='block text-sm font-medium'>Date</label>
        <input type='date' name='date' value={form.date} onChange={handleChange} required className='input' />
      </div>

      <div>
        <label className='block text-sm font-medium'>Catégorie (optionnelle)</label>
        <select name='category' value={form.category} onChange={handleChange} className='input'>
          <option value=''>Aucune</option>
          <option value='food'>Nourriture</option>
          <option value='transport'>Transport</option>
          <option value='entertainment'>Loisirs</option>
          <option value='shopping'>Shopping</option>
          <option value='health'>Santé</option>
          <option value='housing'>Logement</option>
          <option value='utilities'>Utilités</option>
          <option value='insurance'>Assurance</option>
          <option value='subscriptions'>Abonnements</option>
          <option value='other'>Autre</option>
        </select>
      </div>

      <div>
        <label className='block text-sm font-medium'>Description (optionnelle)</label>
        <input type='text' name='description' value={form.description} onChange={handleChange} className='input' />
      </div>

      <div>
        <label className='block text-sm font-medium'>Fréquence (optionnelle)</label>
        <select name='frequency' value={form.frequency} onChange={handleChange} className='input'>
          <option value=''>Aucune</option>
          <option value='monthly'>Mensuelle</option>
          <option value='yearly'>Annuelle</option>
        </select>
      </div>

      {error && <p className='text-red-600 text-sm'>{error}</p>}

      <button type='submit' className='btn-primary' disabled={loading}>
        {loading ? 'Ajout en cours...' : 'Ajouter'}
      </button>
    </form>
  );
}
