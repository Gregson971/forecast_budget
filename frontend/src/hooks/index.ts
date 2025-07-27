export { useAuth } from '@/context/AuthContext';
export { useSessions } from './useSessions';
export { useExpenses } from './useExpenses';
export { useIncomes } from './useIncomes';
export { useForecast } from './useForecast';

// Hook utilitaire pour combiner l'authentification avec les autres hooks
import { useAuth } from '@/context/AuthContext';
import { useSessions } from './useSessions';
import { useExpenses } from './useExpenses';
import { useIncomes } from './useIncomes';

export const useAppHooks = () => {
  const auth = useAuth();
  const sessions = useSessions();
  const expenses = useExpenses();
  const incomes = useIncomes();

  return {
    auth,
    sessions,
    expenses,
    incomes,
  };
};