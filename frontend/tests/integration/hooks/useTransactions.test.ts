import { renderHook, waitFor } from '@testing-library/react';
import { useTransactions } from '@/hooks/useTransactions';
import { useExpenses } from '@/hooks/useExpenses';
import { useIncomes } from '@/hooks/useIncomes';

jest.mock('@/hooks/useExpenses');
jest.mock('@/hooks/useIncomes');

const mockedUseExpenses = useExpenses as jest.MockedFunction<typeof useExpenses>;
const mockedUseIncomes = useIncomes as jest.MockedFunction<typeof useIncomes>;

describe('useTransactions', () => {
  const mockCreateExpense = jest.fn();
  const mockUpdateExpense = jest.fn();
  const mockDeleteExpense = jest.fn();
  const mockCreateIncome = jest.fn();
  const mockUpdateIncome = jest.fn();
  const mockDeleteIncome = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseExpenses.mockReturnValue({
      expenses: [],
      expensesLoading: false,
      expensesError: null,
      createExpense: mockCreateExpense,
      updateExpense: mockUpdateExpense,
      deleteExpense: mockDeleteExpense,
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
    });

    mockedUseIncomes.mockReturnValue({
      incomes: [],
      loading: false,
      error: null,
      createIncome: mockCreateIncome,
      updateIncome: mockUpdateIncome,
      deleteIncome: mockDeleteIncome,
      refetch: jest.fn(),
      categories: [],
      frequencies: [],
    });
  });

  it('should combine expenses and incomes into transactions', () => {
    const mockExpenses = [
      {
        id: '1',
        name: 'Groceries',
        amount: 100,
        date: '2025-01-15',
        category: 'FOOD',
        user_id: 'user1',
        created_at: '2025-01-15',
        updated_at: '2025-01-15',
      },
    ];

    const mockIncomes = [
      {
        id: '2',
        name: 'Salary',
        amount: 5000,
        date: '2025-01-01',
        category: 'SALARY',
        user_id: 'user1',
        created_at: '2025-01-01',
        updated_at: '2025-01-01',
      },
    ];

    mockedUseExpenses.mockReturnValue({
      expenses: mockExpenses,
      expensesLoading: false,
      expensesError: null,
      createExpense: mockCreateExpense,
      updateExpense: mockUpdateExpense,
      deleteExpense: mockDeleteExpense,
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
    });

    mockedUseIncomes.mockReturnValue({
      incomes: mockIncomes,
      loading: false,
      error: null,
      createIncome: mockCreateIncome,
      updateIncome: mockUpdateIncome,
      deleteIncome: mockDeleteIncome,
      refetch: jest.fn(),
      categories: [],
      frequencies: [],
    });

    const { result } = renderHook(() => useTransactions());

    expect(result.current.transactions).toHaveLength(2);
    expect(result.current.transactions[0].type).toBeDefined();
  });

  it('should return loading state from both hooks', () => {
    mockedUseExpenses.mockReturnValue({
      expenses: [],
      expensesLoading: true,
      expensesError: null,
      createExpense: mockCreateExpense,
      updateExpense: mockUpdateExpense,
      deleteExpense: mockDeleteExpense,
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
    });

    const { result } = renderHook(() => useTransactions());

    expect(result.current.loading).toBe(true);
  });

  it('should return error state from either hook', () => {
    mockedUseExpenses.mockReturnValue({
      expenses: [],
      expensesLoading: false,
      expensesError: 'Expense error',
      createExpense: mockCreateExpense,
      updateExpense: mockUpdateExpense,
      deleteExpense: mockDeleteExpense,
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
    });

    const { result } = renderHook(() => useTransactions());

    expect(result.current.error).toBe('Expense error');
  });

  it('should provide combined categories and frequencies', () => {
    const expenseCategories = [{ value: 'FOOD', label: 'Food' }];
    const incomeCategories = [{ value: 'SALARY', label: 'Salary' }];
    const expenseFrequencies = [{ value: 'MONTHLY', label: 'Monthly' }];
    const incomeFrequencies = [{ value: 'WEEKLY', label: 'Weekly' }];

    mockedUseExpenses.mockReturnValue({
      expenses: [],
      expensesLoading: false,
      expensesError: null,
      createExpense: mockCreateExpense,
      updateExpense: mockUpdateExpense,
      deleteExpense: mockDeleteExpense,
      fetchExpenses: jest.fn(),
      fetchExpenseData: jest.fn(),
      categories: expenseCategories,
      frequencies: expenseFrequencies,
      categoriesLoading: false,
      deleteExpenseLoading: false,
      deleteExpenseError: null,
      createExpenseLoading: false,
      createExpenseError: null,
      updateExpenseLoading: false,
      updateExpenseError: null,
    });

    mockedUseIncomes.mockReturnValue({
      incomes: [],
      loading: false,
      error: null,
      createIncome: mockCreateIncome,
      updateIncome: mockUpdateIncome,
      deleteIncome: mockDeleteIncome,
      refetch: jest.fn(),
      categories: incomeCategories,
      frequencies: incomeFrequencies,
    });

    const { result } = renderHook(() => useTransactions());

    expect(result.current.expenseCategories).toEqual(expenseCategories);
    expect(result.current.incomeCategories).toEqual(incomeCategories);
    expect(result.current.expenseFrequencies).toEqual(expenseFrequencies);
    expect(result.current.incomeFrequencies).toEqual(incomeFrequencies);
  });
});

