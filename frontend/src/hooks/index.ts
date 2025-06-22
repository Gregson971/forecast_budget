export { useAuth } from '@/context/AuthContext';
export { useAuthService } from './useAuth';
export { useSessions } from './useSessions';
export { useExpenses } from './useExpenses';

// Hook utilitaire pour combiner l'authentification avec les autres hooks
import { useAuth } from '@/context/AuthContext';
import { useSessions } from './useSessions';
import { useExpenses } from './useExpenses';

export const useAppHooks = () => {
  const auth = useAuth();
  const sessions = useSessions();
  const expenses = useExpenses();

  return {
    auth,
    sessions,
    expenses,
  };
};