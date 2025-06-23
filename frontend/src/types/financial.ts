export interface Category {
  value: string;
  label: string;
}

export interface Frequency {
  value: string;
  label: string;
}

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

// Types spécifiques pour les revenus (pour usage futur)
export interface Income extends BaseFinancialItem {}

export interface CreateIncomeRequest extends BaseFinancialRequest {}

export interface UpdateIncomeRequest extends BaseFinancialRequest {} 