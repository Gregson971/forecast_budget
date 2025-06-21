import api from '@/lib/api';

export const getExpensesService = async () => {
  const res = await api.get('/expenses');
  return res.data;
};

export const createExpenseService = async (expense: any) => {
  const res = await api.post('/expenses', expense);
  return res.data;
};

export const getExpenseCategoriesService = async () => {
  const res = await api.get('/expenses/categories');
  return res.data;
};

export const getExpenseFrequenciesService = async () => {
  const res = await api.get('/expenses/frequencies');
  return res.data;
};
