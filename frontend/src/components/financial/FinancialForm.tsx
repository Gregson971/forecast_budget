'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { BaseFinancialItem, BaseFinancialRequest, Category, Frequency } from '@/types/financial';
import { handleSilentError } from '@/lib/errorHandler';

interface FinancialFormProps {
  item?: BaseFinancialItem | null; // Pour l'édition
  onAdd?: (item: BaseFinancialRequest) => void;
  onUpdate?: (itemId: string, item: BaseFinancialRequest) => void;
  categories: Category[];
  frequencies: Frequency[];
  loadingData: boolean;
  dataError: string | null;
  loading?: boolean;
  type: 'expense' | 'income'; // Pour adapter l'interface selon le type
}

// Fonction utilitaire pour convertir une date au format YYYY-MM-DD
const formatDateForInput = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    handleSilentError(error);
    return new Date().toISOString().split('T')[0];
  }
};

// Fonction pour déterminer si une dépense est récurrente basée sur la fréquence
const isRecurringBasedOnFrequency = (frequency: string): boolean => {
  return Boolean(frequency && frequency !== '' && frequency !== 'one-time');
};

export default function FinancialForm({ item, onAdd, onUpdate, categories, frequencies, loadingData, dataError, loading = false, type = 'expense' }: FinancialFormProps) {
  const isEditMode = !!item;
  const isExpense = type === 'expense';

  const [form, setForm] = useState<BaseFinancialRequest>({
    name: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
    is_recurring: false,
    frequency: '',
  });

  const [error, setError] = useState('');

  // Pré-remplir le formulaire en mode édition
  useEffect(() => {
    if (item) {
      const isRecurring = isRecurringBasedOnFrequency(item.frequency || '');
      setForm({
        name: item.name,
        amount: item.amount,
        date: formatDateForInput(item.date),
        category: item.category,
        description: item.description || '',
        is_recurring: isRecurring,
        frequency: item.frequency || '',
      });
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Si c'est le champ fréquence, mettre à jour automatiquement is_recurring
    if (name === 'frequency') {
      const isRecurring = isRecurringBasedOnFrequency(value);
      setForm({
        ...form,
        [name]: value,
        is_recurring: isRecurring,
      });
    } else {
      setForm({
        ...form,
        [name]: type === 'number' ? parseFloat(value) || 0 : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      if (isEditMode && onUpdate && item) {
        await onUpdate(item.id, form);
      } else if (!isEditMode && onAdd) {
        await onAdd(form);
        // Réinitialiser le formulaire seulement en mode création
        setForm({
          name: '',
          amount: 0,
          date: new Date().toISOString().split('T')[0],
          category: '',
          description: '',
          is_recurring: false,
          frequency: '',
        });
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      setError(err.message || `Erreur lors de ${isEditMode ? 'la modification' : 'la création'} de ${isExpense ? 'la dépense' : 'le revenu'}`);
    }
  };

  const getTypeLabel = () => {
    return isExpense ? 'dépense' : 'revenu';
  };

  const getActionLabel = () => {
    if (isEditMode) {
      return `Modifier ${getTypeLabel()}`;
    }
    return `Ajouter ${getTypeLabel()}`;
  };

  const getDescriptionLabel = () => {
    return isEditMode ? `Modifiez les détails de votre ${getTypeLabel()}` : `Ajoutez un nouveau ${getTypeLabel()} à votre budget`;
  };

  if (loadingData) {
    return (
      <div className='space-y-6'>
        <div className='text-center mb-6'>
          <h2 className='text-2xl font-bold text-white mb-2'>{getActionLabel()}</h2>
          <p className='text-gray-400'>{getDescriptionLabel()}</p>
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
        <h2 className='text-2xl font-bold text-white mb-2'>{getActionLabel()}</h2>
        <p className='text-gray-400'>{getDescriptionLabel()}</p>
      </div>

      {dataError && (
        <div className='p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl'>
          <p className='text-yellow-400 text-sm'>{dataError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        <Input
          label={`Nom de ${getTypeLabel()}`}
          type='text'
          name='name'
          value={form.name}
          onChange={handleChange}
          placeholder={`Ex: ${isExpense ? 'Courses alimentaires' : 'Salaire mensuel'}`}
          required
        />

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
          placeholder={`Description détaillée de ${getTypeLabel()}`}
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
          {form.frequency && form.frequency !== '' && (
            <p className='text-sm text-gray-400 mt-1'>
              {isRecurringBasedOnFrequency(form.frequency) ? '✅ Cette dépense sera récurrente' : 'ℹ️ Cette dépense ne sera pas récurrente'}
            </p>
          )}
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
              {isEditMode ? 'Modification en cours...' : 'Ajout en cours...'}
            </div>
          ) : (
            <div className='flex items-center justify-center'>
              <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d={
                    isEditMode
                      ? 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                      : 'M12 6v6m0 0v6m0-6h6m-6 0H6'
                  }
                />
              </svg>
              {getActionLabel()}
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
