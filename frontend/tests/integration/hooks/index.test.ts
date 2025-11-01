import { renderHook } from '@testing-library/react';
import { useAppHooks } from '@/hooks';
import { useAuth } from '@/context/AuthContext';
import { useSessions } from '@/hooks/useSessions';
import { useExpenses } from '@/hooks/useExpenses';
import { useIncomes } from '@/hooks/useIncomes';

jest.mock('@/context/AuthContext');
jest.mock('@/hooks/useSessions');
jest.mock('@/hooks/useExpenses');
jest.mock('@/hooks/useIncomes');

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockedUseSessions = useSessions as jest.MockedFunction<typeof useSessions>;
const mockedUseExpenses = useExpenses as jest.MockedFunction<typeof useExpenses>;
const mockedUseIncomes = useIncomes as jest.MockedFunction<typeof useIncomes>;

describe('hooks index', () => {
  describe('useAppHooks', () => {
    it('should combine all app hooks', () => {
      const mockAuth = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        getUser: jest.fn(),
        updateUser: jest.fn(),
      };

      const mockSessions = {
        sessions: [],
        sessionsLoading: false,
        sessionsError: null,
        revokeSession: jest.fn(),
        revokeError: null,
        revokeLoading: false,
      };

      const mockExpenses = {
        expenses: [],
        expensesLoading: false,
        expensesError: null,
        createExpense: jest.fn(),
        updateExpense: jest.fn(),
        deleteExpense: jest.fn(),
        fetchExpenses: jest.fn(),
        fetchExpenseData: jest.fn(),
        categories: [],
        frequencies: [],
        categoriesLoading: false,
        deleteExpenseLoading: false,
        deleteExpenseError: null,
        createExpenseLoading: false,
        createExpenseError: null,
        updateExpenseLoading: false,
        updateExpenseError: null,
      };

      const mockIncomes = {
        incomes: [],
        loading: false,
        error: null,
        createIncome: jest.fn(),
        updateIncome: jest.fn(),
        deleteIncome: jest.fn(),
        refetch: jest.fn(),
        categories: [],
        frequencies: [],
      };

      mockedUseAuth.mockReturnValue(mockAuth);
      mockedUseSessions.mockReturnValue(mockSessions);
      mockedUseExpenses.mockReturnValue(mockExpenses);
      mockedUseIncomes.mockReturnValue(mockIncomes);

      const { result } = renderHook(() => useAppHooks());

      expect(result.current.auth).toEqual(mockAuth);
      expect(result.current.sessions).toEqual(mockSessions);
      expect(result.current.expenses).toEqual(mockExpenses);
      expect(result.current.incomes).toEqual(mockIncomes);
    });
  });
});

