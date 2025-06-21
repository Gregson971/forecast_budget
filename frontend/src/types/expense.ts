export interface Category {
  value: string;
  label: string;
}

export interface Frequency {
  value: string;
  label: string;
}

export interface Expense {
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

export interface CreateExpenseRequest {
  name: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
  is_recurring?: boolean;
  frequency?: string;
} 