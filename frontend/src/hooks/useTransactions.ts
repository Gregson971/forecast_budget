import { useMemo, useCallback } from 'react';
import { useExpenses } from './useExpenses';
import { useIncomes } from './useIncomes';
import {
  Transaction,
  expenseToTransaction,
  incomeToTransaction,
  sortTransactionsByDate
} from '@/types/transaction';
import type { CreateExpenseRequest, UpdateExpenseRequest } from '@/types/expense';
import type { CreateIncomeRequest, UpdateIncomeRequest } from '@/types/income';

export const useTransactions = () => {
  const {
    expenses,
    expensesLoading,
    expensesError,
    createExpense,
    updateExpense,
    deleteExpense,
    categories: expenseCategories,
    frequencies: expenseFrequencies,
  } = useExpenses();

  const {
    incomes,
    loading: incomesLoading,
    error: incomesError,
    createIncome,
    updateIncome,
    deleteIncome,
    categories: incomeCategories,
    frequencies: incomeFrequencies,
  } = useIncomes();

  // Combiner les dépenses et revenus en transactions
  const transactions: Transaction[] = useMemo(() => {
    const expenseTransactions = expenses.map(expenseToTransaction);
    const incomeTransactions = incomes.map(incomeToTransaction);
    return sortTransactionsByDate([...expenseTransactions, ...incomeTransactions]);
  }, [expenses, incomes]);

  // Créer une transaction (dépense ou revenu)
  const createTransaction = useCallback(async (
    type: 'expense' | 'income',
    data: CreateExpenseRequest | CreateIncomeRequest
  ) => {
    if (type === 'expense') {
      return await createExpense(data as CreateExpenseRequest);
    } else {
      return await createIncome(data as CreateIncomeRequest);
    }
  }, [createExpense, createIncome]);

  // Mettre à jour une transaction
  const updateTransaction = useCallback(async (
    id: string,
    type: 'expense' | 'income',
    data: UpdateExpenseRequest | UpdateIncomeRequest
  ) => {
    if (type === 'expense') {
      return await updateExpense(id, data as UpdateExpenseRequest);
    } else {
      return await updateIncome(id, data as UpdateIncomeRequest);
    }
  }, [updateExpense, updateIncome]);

  // Supprimer une transaction
  const deleteTransaction = useCallback(async (
    id: string,
    type: 'expense' | 'income'
  ) => {
    if (type === 'expense') {
      return await deleteExpense(id);
    } else {
      return await deleteIncome(id);
    }
  }, [deleteExpense, deleteIncome]);

  const loading = expensesLoading || incomesLoading;
  const error = expensesError || incomesError;

  return {
    transactions,
    loading,
    error,

    // Actions
    createTransaction,
    updateTransaction,
    deleteTransaction,

    // Catégories et fréquences par type
    expenseCategories,
    expenseFrequencies,
    incomeCategories,
    incomeFrequencies,

    // États séparés si nécessaire
    expenses,
    incomes,
    expensesLoading,
    incomesLoading,
    expensesError,
    incomesError,
  };
};
