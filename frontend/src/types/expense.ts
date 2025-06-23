import type { BaseFinancialItem, BaseFinancialRequest } from './financial';

// Ré-export des types depuis le fichier générique
export type { 
  Category, 
  Frequency 
} from './financial';

// Types spécifiques pour les dépenses
export interface Expense extends BaseFinancialItem {}

export interface CreateExpenseRequest extends BaseFinancialRequest {}

export interface UpdateExpenseRequest extends BaseFinancialRequest {} 