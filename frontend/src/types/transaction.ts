import type { Expense } from './expense';
import type { Income } from './income';

// Type unifié pour les transactions (dépenses et revenus)
export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
  is_recurring: boolean;
  frequency?: string;
  created_at: string;
  updated_at: string;
  type: TransactionType; // Ajout du type pour différencier
}

// Helper pour convertir une dépense en transaction
export const expenseToTransaction = (expense: Expense): Transaction => ({
  ...expense,
  type: 'expense' as TransactionType,
});

// Helper pour convertir un revenu en transaction
export const incomeToTransaction = (income: Income): Transaction => ({
  ...income,
  type: 'income' as TransactionType,
});

// Helper pour trier les transactions par date (plus récent en premier)
export const sortTransactionsByDate = (transactions: Transaction[]): Transaction[] => {
  return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Helper pour filtrer les transactions
export const filterTransactions = (
  transactions: Transaction[],
  filter: 'all' | 'expense' | 'income'
): Transaction[] => {
  if (filter === 'all') return transactions;
  return transactions.filter(t => t.type === filter);
};
