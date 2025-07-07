// Types pour les catégories et fréquences
export interface Category {
  value: string;
  label: string;
}

export interface Frequency {
  value: string;
  label: string;
}

// Types pour les catégories de revenus
export type IncomeCategory = 
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'rental'
  | 'business'
  | 'bonus'
  | 'commission'
  | 'royalties'
  | 'pension'
  | 'other';

// Types pour les fréquences de revenus
export type IncomeFrequency = 
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'one-time';

export interface BaseFinancialItem {
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
}

export interface BaseFinancialRequest {
  name: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
  is_recurring?: boolean;
  frequency?: string;
}

// Types spécifiques pour les dépenses
export interface Expense extends BaseFinancialItem {}

export interface CreateExpenseRequest extends BaseFinancialRequest {}

export interface UpdateExpenseRequest extends BaseFinancialRequest {}

// Types spécifiques pour les revenus
export interface Income extends BaseFinancialItem {}

export interface CreateIncomeRequest extends BaseFinancialRequest {}

export interface UpdateIncomeRequest extends BaseFinancialRequest {} 