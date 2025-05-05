import api from '@/lib/api';

export const getExpensesService = async () => {
  const res = await api.get('/expenses');
  return res.data;
};
