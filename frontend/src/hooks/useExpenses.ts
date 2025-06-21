import { useState, useCallback, useEffect } from 'react';
import { getExpensesService, createExpenseService, getExpenseCategoriesService, getExpenseFrequenciesService } from '@/services/expense';
import { Expense, Category, Frequency } from '@/types/expense';

// Données de fallback au cas où l'API ne répond pas
const fallbackCategories: Category[] = [
  { value: 'food', label: 'Food' },
  { value: 'transport', label: 'Transport' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
  { value: 'housing', label: 'Housing' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'subscriptions', label: 'Subscriptions' },
  { value: 'other', label: 'Other' },
];

const fallbackFrequencies: Frequency[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'one-time', label: 'Une fois' },
];

interface ExpenseState {
  loading: boolean;
  error: string | null;
  data: Expense[] | null;
}

interface CreateExpenseState {
  loading: boolean;
  error: string | null;
  data: Expense | null;
}

interface ExpenseDataState {
  categories: Category[];
  frequencies: Frequency[];
  loading: boolean;
  error: string | null;
}

export const useExpenses = () => {
  const [expensesState, setExpensesState] = useState<ExpenseState>({ 
    loading: false, 
    error: null, 
    data: null 
  });
  const [createExpenseState, setCreateExpenseState] = useState<CreateExpenseState>({ 
    loading: false, 
    error: null, 
    data: null 
  });
  const [expenseDataState, setExpenseDataState] = useState<ExpenseDataState>({
    categories: fallbackCategories,
    frequencies: fallbackFrequencies,
    loading: true,
    error: null,
  });

  const fetchExpenses = useCallback(async () => {
    setExpensesState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await getExpensesService();
      setExpensesState({ loading: false, error: null, data });
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Erreur lors de la récupération des dépenses';
      setExpensesState({ loading: false, error: errorMessage, data: null });
      throw error;
    }
  }, []);

  const createExpense = useCallback(async (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => {
    setCreateExpenseState({ loading: true, error: null, data: null });
    try {
      const data = await createExpenseService(expense);
      setCreateExpenseState({ loading: false, error: null, data });
      
      // Rafraîchir la liste des dépenses après création
      await fetchExpenses();
      
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Erreur lors de la création de la dépense';
      setCreateExpenseState({ loading: false, error: errorMessage, data: null });
      throw error;
    }
  }, [fetchExpenses]);

  const fetchExpenseData = useCallback(async () => {
    try {
      setExpenseDataState(prev => ({ ...prev, error: null }));
      const [categories, frequencies] = await Promise.all([
        getExpenseCategoriesService(),
        getExpenseFrequenciesService()
      ]);

      setExpenseDataState({
        categories,
        frequencies,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setExpenseDataState({
        categories: fallbackCategories,
        frequencies: fallbackFrequencies,
        loading: false,
        error: 'Impossible de charger les données depuis le serveur',
      });
    }
  }, []);

  // Charger automatiquement les dépenses et les données au montage du composant
  useEffect(() => {
    fetchExpenses();
    fetchExpenseData();
  }, [fetchExpenses, fetchExpenseData]);

  return {
    // Actions
    fetchExpenses,
    createExpense,
    fetchExpenseData,
    
    // États des dépenses
    expenses: expensesState.data || [],
    expensesLoading: expensesState.loading,
    expensesError: expensesState.error,
    
    createExpenseLoading: createExpenseState.loading,
    createExpenseError: createExpenseState.error,
    createExpenseData: createExpenseState.data,
    
    // États des données (catégories et fréquences)
    categories: expenseDataState.categories,
    frequencies: expenseDataState.frequencies,
    expenseDataLoading: expenseDataState.loading,
    expenseDataError: expenseDataState.error,
  };
}; 