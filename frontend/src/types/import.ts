/**
 * Types pour l'import de transactions
 */

export interface ImportResult {
  total_transactions: number
  expenses_created: number
  incomes_created: number
  errors: string[]
  skipped: number
  success: boolean
}
