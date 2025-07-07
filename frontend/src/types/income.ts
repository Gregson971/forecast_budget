import type { BaseFinancialItem, BaseFinancialRequest, IncomeCategory, IncomeFrequency } from './financial';

// Ré-export des types depuis le fichier générique
export type { 
  Category, 
  Frequency 
} from './financial';

// Types spécifiques pour les revenus
export interface Income extends BaseFinancialItem {
  category: IncomeCategory;
  frequency?: IncomeFrequency;
}

export interface CreateIncomeRequest extends BaseFinancialRequest {
  category: IncomeCategory;
  frequency?: IncomeFrequency;
}

export interface UpdateIncomeRequest extends BaseFinancialRequest {
  category: IncomeCategory;
  frequency?: IncomeFrequency;
} 