import { renderHook, act, waitFor } from '@testing-library/react';
import { useExpenses } from '@/hooks/useExpenses';
import {
  getExpensesService,
  createExpenseService,
  getExpenseCategoriesService,
  getExpenseFrequenciesService,
  deleteExpenseService,
  updateExpenseService,
} from '@/services/expense';

jest.mock('@/services/expense');

const mockedGetExpenses = getExpensesService as jest.MockedFunction<typeof getExpensesService>;
const mockedCreateExpense = createExpenseService as jest.MockedFunction<typeof createExpenseService>;
const mockedGetCategories = getExpenseCategoriesService as jest.MockedFunction<typeof getExpenseCategoriesService>;
const mockedGetFrequencies = getExpenseFrequenciesService as jest.MockedFunction<typeof getExpenseFrequenciesService>;
const mockedDeleteExpense = deleteExpenseService as jest.MockedFunction<typeof deleteExpenseService>;
const mockedUpdateExpense = updateExpenseService as jest.MockedFunction<typeof updateExpenseService>;

describe('useExpenses', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', async () => {
    mockedGetExpenses.mockResolvedValue([]);
    mockedGetCategories.mockResolvedValue([]);
    mockedGetFrequencies.mockResolvedValue([]);

    const { result } = renderHook(() => useExpenses());

    await waitFor(() => {
      expect(result.current.expenses).toEqual([]);
      expect(result.current.expensesError).toBeNull();
    });
  });

  it('should fetch expenses successfully', async () => {
    const mockExpenses = [
      { id: '1', name: 'Rent', amount: 1000, date: '2025-01-01', category: 'housing' },
      { id: '2', name: 'Groceries', amount: 200, date: '2025-01-02', category: 'food' },
    ];

    mockedGetExpenses.mockResolvedValue(mockExpenses);
    mockedGetCategories.mockResolvedValue([]);
    mockedGetFrequencies.mockResolvedValue([]);

    const { result } = renderHook(() => useExpenses());

    await act(async () => {
      await result.current.fetchExpenses();
    });

    await waitFor(() => {
      expect(result.current.expenses).toEqual(mockExpenses);
      expect(result.current.expensesLoading).toBe(false);
    });
  });

  it('should create expense successfully', async () => {
    const newExpense = {
      name: 'New Expense',
      amount: 150,
      date: '2025-01-05',
      category: 'food',
    };
    const createdExpense = { id: '3', ...newExpense };

    mockedCreateExpense.mockResolvedValue(createdExpense);
    mockedGetExpenses.mockResolvedValue([]);
    mockedGetCategories.mockResolvedValue([]);
    mockedGetFrequencies.mockResolvedValue([]);

    const { result } = renderHook(() => useExpenses());

    await act(async () => {
      const result_data = await result.current.createExpense(newExpense);
      expect(result_data).toEqual(createdExpense);
    });
  });

  it('should delete expense successfully', async () => {
    mockedDeleteExpense.mockResolvedValue({ success: true });
    mockedGetExpenses.mockResolvedValue([]);
    mockedGetCategories.mockResolvedValue([]);
    mockedGetFrequencies.mockResolvedValue([]);

    const { result } = renderHook(() => useExpenses());

    await act(async () => {
      await result.current.deleteExpense('1');
    });

    expect(mockedDeleteExpense).toHaveBeenCalledWith('1');
  });

  it('should fetch categories successfully', async () => {
    const mockCategories = [
      { value: 'food', label: 'Food' },
      { value: 'transport', label: 'Transport' },
    ];

    mockedGetCategories.mockResolvedValue(mockCategories);
    mockedGetExpenses.mockResolvedValue([]);
    mockedGetFrequencies.mockResolvedValue([]);

    const { result } = renderHook(() => useExpenses());

    await act(async () => {
      await result.current.fetchExpenseData();
    });

    await waitFor(() => {
      expect(result.current.categories).toEqual(mockCategories);
    });
  });

  it('should fetch frequencies successfully', async () => {
    const mockFrequencies = [
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly' },
    ];

    mockedGetFrequencies.mockResolvedValue(mockFrequencies);
    mockedGetExpenses.mockResolvedValue([]);
    mockedGetCategories.mockResolvedValue([]);

    const { result } = renderHook(() => useExpenses());

    await act(async () => {
      await result.current.fetchExpenseData();
    });

    await waitFor(() => {
      expect(result.current.frequencies).toEqual(mockFrequencies);
    });
  });

  it('should handle fetch expenses error', async () => {
    const mockError = { response: { data: { detail: 'Network error' } } };
    
    // First call pour l'initialisation
    mockedGetExpenses.mockResolvedValueOnce([]);
    mockedGetCategories.mockResolvedValue([]);
    mockedGetFrequencies.mockResolvedValue([]);

    const { result } = renderHook(() => useExpenses());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.expensesLoading).toBe(false);
    });

    // Now test the error case
    mockedGetExpenses.mockRejectedValueOnce(mockError);

    await act(async () => {
      try {
        await result.current.fetchExpenses();
      } catch (e) {
        // Expected error
      }
    });

    await waitFor(() => {
      expect(result.current.expensesError).toBeTruthy();
      expect(result.current.expensesLoading).toBe(false);
    });
  });

  it('should update expense successfully', async () => {
    const updateData = {
      name: 'Updated Expense',
      amount: 250,
      date: '2025-01-10',
      category: 'food',
    };
    const updatedExpense = { id: '1', ...updateData };

    mockedGetExpenses.mockResolvedValue([]);
    mockedGetCategories.mockResolvedValue([]);
    mockedGetFrequencies.mockResolvedValue([]);
    mockedUpdateExpense.mockResolvedValue(updatedExpense);

    const { result } = renderHook(() => useExpenses());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.expensesLoading).toBe(false);
    });

    await act(async () => {
      const result_data = await result.current.updateExpense('1', updateData);
      expect(result_data).toEqual(updatedExpense);
    });
  });
});

