import type { BaseFinancialItem, BaseFinancialRequest } from './financial';

// Ré-export des types depuis le fichier générique
export type { 
  Category, 
  Frequency 
} from './financial';

// Types spécifiques pour les dépenses
export type Expense = BaseFinancialItem;

export type CreateExpenseRequest = BaseFinancialRequest;

export type UpdateExpenseRequest = BaseFinancialRequest; 