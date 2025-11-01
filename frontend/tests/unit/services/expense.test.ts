import {
  getExpensesService,
  createExpenseService,
  getExpenseCategoriesService,
  getExpenseFrequenciesService,
  getExpenseService,
  updateExpenseService,
  deleteExpenseService,
} from '@/services/expense';
import api from '@/lib/api';

jest.mock('@/lib/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('expense service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getExpensesService', () => {
    it('should fetch all expenses', async () => {
      const mockExpenses = [
        { id: '1', name: 'Rent', amount: 1000 },
        { id: '2', name: 'Groceries', amount: 200 },
      ];
      mockedApi.get.mockResolvedValue({ data: mockExpenses });

      const result = await getExpensesService();

      expect(mockedApi.get).toHaveBeenCalledWith('/expenses');
      expect(result).toEqual(mockExpenses);
    });
  });

  describe('createExpenseService', () => {
    it('should create a new expense', async () => {
      const newExpense = {
        name: 'New Expense',
        amount: 150,
        date: '2025-01-01',
        category: 'FOOD',
      };
      const mockResponse = { id: '3', ...newExpense };
      mockedApi.post.mockResolvedValue({ data: mockResponse });

      const result = await createExpenseService(newExpense);

      expect(mockedApi.post).toHaveBeenCalledWith('/expenses', newExpense);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getExpenseCategoriesService', () => {
    it('should fetch expense categories', async () => {
      const mockCategories = ['FOOD', 'TRANSPORT', 'HOUSING'];
      mockedApi.get.mockResolvedValue({ data: mockCategories });

      const result = await getExpenseCategoriesService();

      expect(mockedApi.get).toHaveBeenCalledWith('/expenses/categories');
      expect(result).toEqual(mockCategories);
    });
  });

  describe('getExpenseFrequenciesService', () => {
    it('should fetch expense frequencies', async () => {
      const mockFrequencies = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
      mockedApi.get.mockResolvedValue({ data: mockFrequencies });

      const result = await getExpenseFrequenciesService();

      expect(mockedApi.get).toHaveBeenCalledWith('/expenses/frequencies');
      expect(result).toEqual(mockFrequencies);
    });
  });

  describe('getExpenseService', () => {
    it('should fetch a single expense by id', async () => {
      const mockExpense = { id: '1', name: 'Rent', amount: 1000 };
      mockedApi.get.mockResolvedValue({ data: mockExpense });

      const result = await getExpenseService('1');

      expect(mockedApi.get).toHaveBeenCalledWith('/expenses/1');
      expect(result).toEqual(mockExpense);
    });
  });

  describe('updateExpenseService', () => {
    it('should update an existing expense', async () => {
      const existingExpense = {
        id: '1',
        name: 'Rent',
        amount: 1000,
        user_id: 'user1',
        created_at: '2024-01-01T00:00:00Z',
        date: '2025-01-01',
        category: 'HOUSING',
      };
      const updateData = {
        name: 'Updated Rent',
        amount: 1100,
        date: '2025-02-01',
        category: 'HOUSING',
      };

      mockedApi.get.mockResolvedValue({ data: existingExpense });
      mockedApi.put.mockResolvedValue({ data: { ...existingExpense, ...updateData } });

      const result = await updateExpenseService('1', updateData);

      expect(mockedApi.get).toHaveBeenCalledWith('/expenses/1');
      expect(mockedApi.put).toHaveBeenCalledWith('/expenses/1', expect.objectContaining({
        id: '1',
        name: 'Updated Rent',
        amount: 1100,
        user_id: 'user1',
        created_at: '2024-01-01T00:00:00Z',
      }));
      expect(result).toBeDefined();
    });

    it('should handle string dates correctly', async () => {
      const existingExpense = {
        id: '1',
        name: 'Rent',
        amount: 1000,
        user_id: 'user1',
        created_at: '2024-01-01T00:00:00Z',
        date: '2025-01-01',
        category: 'HOUSING',
      };
      const updateData = {
        name: 'Updated Rent',
        amount: 1100,
        date: '2025-02-01T10:00:00Z',
        category: 'HOUSING',
      };

      mockedApi.get.mockResolvedValue({ data: existingExpense });
      mockedApi.put.mockResolvedValue({ data: { ...existingExpense, ...updateData } });

      await updateExpenseService('1', updateData);

      expect(mockedApi.put).toHaveBeenCalledWith('/expenses/1', expect.objectContaining({
        date: expect.any(String),
      }));
    });

    it('should handle optional fields correctly', async () => {
      const existingExpense = {
        id: '1',
        name: 'Rent',
        amount: 1000,
        user_id: 'user1',
        created_at: '2024-01-01T00:00:00Z',
        date: '2025-01-01',
        category: 'HOUSING',
      };
      const updateData = {
        name: 'Updated Rent',
        amount: 1100,
        date: '2025-02-01',
        category: 'HOUSING',
        description: 'Monthly rent payment',
        is_recurring: true,
        frequency: 'MONTHLY',
      };

      mockedApi.get.mockResolvedValue({ data: existingExpense });
      mockedApi.put.mockResolvedValue({ data: { ...existingExpense, ...updateData } });

      await updateExpenseService('1', updateData);

      expect(mockedApi.put).toHaveBeenCalledWith('/expenses/1', expect.objectContaining({
        description: 'Monthly rent payment',
        is_recurring: true,
        frequency: 'MONTHLY',
      }));
    });
  });

  describe('deleteExpenseService', () => {
    it('should delete an expense', async () => {
      const mockResponse = { success: true };
      mockedApi.delete.mockResolvedValue({ data: mockResponse });

      const result = await deleteExpenseService('1');

      expect(mockedApi.delete).toHaveBeenCalledWith('/expenses/1');
      expect(result).toEqual(mockResponse);
    });
  });
});

