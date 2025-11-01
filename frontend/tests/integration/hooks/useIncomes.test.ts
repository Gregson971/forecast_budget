import { renderHook, act, waitFor } from '@testing-library/react';
import { useIncomes } from '@/hooks/useIncomes';
import { incomeService } from '@/services/income';

jest.mock('@/services/income');

const mockedIncomeService = incomeService as jest.Mocked<typeof incomeService>;

describe('useIncomes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    mockedIncomeService.getIncomes.mockResolvedValue([]);
    mockedIncomeService.getCategories.mockResolvedValue([]);
    mockedIncomeService.getFrequencies.mockResolvedValue([]);

    const { result } = renderHook(() => useIncomes());

    expect(result.current.incomes).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it('should load incomes successfully', async () => {
    const mockIncomes = [
      { 
        id: '1', 
        name: 'Salary', 
        amount: 5000, 
        date: '2025-01-01', 
        category: 'SALARY',
        user_id: 'user1',
        created_at: '2025-01-01',
        updated_at: '2025-01-01'
      },
      { 
        id: '2', 
        name: 'Freelance', 
        amount: 1500, 
        date: '2025-01-15', 
        category: 'FREELANCE',
        user_id: 'user1',
        created_at: '2025-01-15',
        updated_at: '2025-01-15'
      },
    ];

    mockedIncomeService.getIncomes.mockResolvedValue(mockIncomes);
    mockedIncomeService.getCategories.mockResolvedValue([]);
    mockedIncomeService.getFrequencies.mockResolvedValue([]);

    const { result } = renderHook(() => useIncomes());

    await waitFor(() => {
      expect(result.current.incomes).toEqual(mockIncomes);
      expect(result.current.loading).toBe(false);
    });
  });

  it('should create income successfully', async () => {
    const newIncome = {
      name: 'Bonus',
      amount: 2000,
      date: '2025-03-01',
      category: 'BONUS',
    };
    const createdIncome = { 
      id: '3', 
      ...newIncome,
      user_id: 'user1',
      created_at: '2025-03-01',
      updated_at: '2025-03-01'
    };

    mockedIncomeService.getIncomes.mockResolvedValue([]);
    mockedIncomeService.createIncome.mockResolvedValue(createdIncome);
    mockedIncomeService.getCategories.mockResolvedValue([]);
    mockedIncomeService.getFrequencies.mockResolvedValue([]);

    const { result } = renderHook(() => useIncomes());

    await act(async () => {
      const result_data = await result.current.createIncome(newIncome);
      expect(result_data).toEqual(createdIncome);
    });
  });

  it('should update income successfully', async () => {
    const updateData = {
      name: 'Updated Salary',
      amount: 5500,
      date: '2025-02-01',
      category: 'SALARY',
    };
    const updatedIncome = { 
      id: '1', 
      ...updateData,
      user_id: 'user1',
      created_at: '2025-01-01',
      updated_at: '2025-02-01'
    };

    mockedIncomeService.getIncomes.mockResolvedValue([]);
    mockedIncomeService.updateIncome.mockResolvedValue(updatedIncome);
    mockedIncomeService.getCategories.mockResolvedValue([]);
    mockedIncomeService.getFrequencies.mockResolvedValue([]);

    const { result } = renderHook(() => useIncomes());

    await act(async () => {
      const result_data = await result.current.updateIncome('1', updateData);
      expect(result_data).toEqual(updatedIncome);
    });
  });

  it('should delete income successfully', async () => {
    mockedIncomeService.getIncomes.mockResolvedValue([]);
    mockedIncomeService.deleteIncome.mockResolvedValue();
    mockedIncomeService.getCategories.mockResolvedValue([]);
    mockedIncomeService.getFrequencies.mockResolvedValue([]);

    const { result } = renderHook(() => useIncomes());

    await act(async () => {
      await result.current.deleteIncome('1');
    });

    expect(mockedIncomeService.deleteIncome).toHaveBeenCalledWith('1');
  });

  it('should load categories successfully', async () => {
    const mockCategories = [
      { value: 'SALARY', label: 'Salary' },
      { value: 'FREELANCE', label: 'Freelance' },
    ];

    mockedIncomeService.getIncomes.mockResolvedValue([]);
    mockedIncomeService.getCategories.mockResolvedValue(mockCategories);
    mockedIncomeService.getFrequencies.mockResolvedValue([]);

    const { result } = renderHook(() => useIncomes());

    await waitFor(() => {
      expect(result.current.categories).toEqual(mockCategories);
    });
  });

  it('should load frequencies successfully', async () => {
    const mockFrequencies = [
      { value: 'MONTHLY', label: 'Monthly' },
      { value: 'YEARLY', label: 'Yearly' },
    ];

    mockedIncomeService.getIncomes.mockResolvedValue([]);
    mockedIncomeService.getCategories.mockResolvedValue([]);
    mockedIncomeService.getFrequencies.mockResolvedValue(mockFrequencies);

    const { result } = renderHook(() => useIncomes());

    await waitFor(() => {
      expect(result.current.frequencies).toEqual(mockFrequencies);
    });
  });

  it('should handle load incomes error', async () => {
    mockedIncomeService.getIncomes.mockRejectedValue(new Error('Network error'));
    mockedIncomeService.getCategories.mockResolvedValue([]);
    mockedIncomeService.getFrequencies.mockResolvedValue([]);

    const { result } = renderHook(() => useIncomes());

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle 401 error correctly', async () => {
    const error = {
      response: {
        status: 401,
      },
    };
    mockedIncomeService.getIncomes.mockRejectedValue(error);
    mockedIncomeService.getCategories.mockResolvedValue([]);
    mockedIncomeService.getFrequencies.mockResolvedValue([]);

    const { result } = renderHook(() => useIncomes());

    await waitFor(() => {
      expect(result.current.error).toContain('Session expirée');
    });
  });

  it('should handle 500 error correctly', async () => {
    const error = {
      response: {
        status: 500,
      },
    };
    mockedIncomeService.getIncomes.mockRejectedValue(error);
    mockedIncomeService.getCategories.mockResolvedValue([]);
    mockedIncomeService.getFrequencies.mockResolvedValue([]);

    const { result } = renderHook(() => useIncomes());

    await waitFor(() => {
      expect(result.current.error).toContain('Erreur serveur');
    });
  });
});

