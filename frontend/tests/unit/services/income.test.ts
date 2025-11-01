import { incomeService } from '@/services/income';
import api from '@/lib/api';

jest.mock('@/lib/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('income service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getIncomes', () => {
    it('should fetch all incomes', async () => {
      const mockIncomes = [
        { id: '1', name: 'Salary', amount: 5000, category: 'SALARY', date: '2025-01-01' },
        { id: '2', name: 'Freelance', amount: 1500, category: 'FREELANCE', date: '2025-01-15' },
      ];
      mockedApi.get.mockResolvedValue({ data: mockIncomes });

      const result = await incomeService.getIncomes();

      expect(mockedApi.get).toHaveBeenCalledWith('/incomes');
      expect(result).toEqual(mockIncomes);
    });
  });

  describe('getIncome', () => {
    it('should fetch a single income by id', async () => {
      const mockIncome = { 
        id: '1', 
        name: 'Salary', 
        amount: 5000, 
        category: 'SALARY', 
        date: '2025-01-01' 
      };
      mockedApi.get.mockResolvedValue({ data: mockIncome });

      const result = await incomeService.getIncome('1');

      expect(mockedApi.get).toHaveBeenCalledWith('/incomes/1');
      expect(result).toEqual(mockIncome);
    });
  });

  describe('createIncome', () => {
    it('should create a new income', async () => {
      const newIncome = {
        name: 'Bonus',
        amount: 2000,
        category: 'BONUS',
        date: '2025-03-01',
      };
      const mockResponse = { id: '3', ...newIncome };
      mockedApi.post.mockResolvedValue({ data: mockResponse });

      const result = await incomeService.createIncome(newIncome);

      expect(mockedApi.post).toHaveBeenCalledWith('/incomes', newIncome);
      expect(result).toEqual(mockResponse);
    });

    it('should create income with optional fields', async () => {
      const newIncome = {
        name: 'Rental Income',
        amount: 1200,
        category: 'RENTAL',
        date: '2025-04-01',
        description: 'Monthly rent from property',
        is_recurring: true,
        frequency: 'MONTHLY',
      };
      const mockResponse = { id: '4', ...newIncome };
      mockedApi.post.mockResolvedValue({ data: mockResponse });

      const result = await incomeService.createIncome(newIncome);

      expect(mockedApi.post).toHaveBeenCalledWith('/incomes', newIncome);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateIncome', () => {
    it('should update an existing income', async () => {
      const updateData = {
        name: 'Updated Salary',
        amount: 5500,
        category: 'SALARY',
        date: '2025-02-01',
      };
      const mockResponse = { id: '1', ...updateData };
      mockedApi.put.mockResolvedValue({ data: mockResponse });

      const result = await incomeService.updateIncome('1', updateData);

      expect(mockedApi.put).toHaveBeenCalledWith('/incomes/1', updateData);
      expect(result).toEqual(mockResponse);
    });

    it('should update income with partial data', async () => {
      const updateData = {
        amount: 5200,
      };
      const mockResponse = { 
        id: '1', 
        name: 'Salary', 
        amount: 5200, 
        category: 'SALARY', 
        date: '2025-01-01' 
      };
      mockedApi.put.mockResolvedValue({ data: mockResponse });

      const result = await incomeService.updateIncome('1', updateData);

      expect(mockedApi.put).toHaveBeenCalledWith('/incomes/1', updateData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteIncome', () => {
    it('should delete an income', async () => {
      mockedApi.delete.mockResolvedValue({ data: undefined });

      await incomeService.deleteIncome('1');

      expect(mockedApi.delete).toHaveBeenCalledWith('/incomes/1');
    });
  });

  describe('getCategories', () => {
    it('should fetch income categories', async () => {
      const mockCategories = [
        { value: 'SALARY', label: 'Salary' },
        { value: 'FREELANCE', label: 'Freelance' },
        { value: 'BONUS', label: 'Bonus' },
      ];
      mockedApi.get.mockResolvedValue({ data: mockCategories });

      const result = await incomeService.getCategories();

      expect(mockedApi.get).toHaveBeenCalledWith('/incomes/categories');
      expect(result).toEqual(mockCategories);
    });
  });

  describe('getFrequencies', () => {
    it('should fetch income frequencies', async () => {
      const mockFrequencies = [
        { value: 'DAILY', label: 'Daily' },
        { value: 'WEEKLY', label: 'Weekly' },
        { value: 'MONTHLY', label: 'Monthly' },
        { value: 'YEARLY', label: 'Yearly' },
      ];
      mockedApi.get.mockResolvedValue({ data: mockFrequencies });

      const result = await incomeService.getFrequencies();

      expect(mockedApi.get).toHaveBeenCalledWith('/incomes/frequencies');
      expect(result).toEqual(mockFrequencies);
    });
  });
});

