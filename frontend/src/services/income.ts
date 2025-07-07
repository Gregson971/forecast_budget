import api from '@/lib/api';
import type { Income, CreateIncomeRequest, UpdateIncomeRequest, Category, Frequency } from '@/types/income';

export const incomeService = {
  // Récupérer tous les revenus
  async getIncomes(): Promise<Income[]> {
    const response = await api.get(`/incomes`);
    return response.data;
  },

  // Récupérer un revenu par ID
  async getIncome(id: string): Promise<Income> {
    const response = await api.get(`/incomes/${id}`);
    return response.data;
  },

  // Créer un nouveau revenu
  async createIncome(data: CreateIncomeRequest): Promise<Income> {
    const response = await api.post('/incomes', data);
    return response.data;
  },

  // Mettre à jour un revenu
  async updateIncome(id: string, data: UpdateIncomeRequest): Promise<Income> {
    const response = await api.put(`/incomes/${id}`, data);
    return response.data;
  },

  // Supprimer un revenu
  async deleteIncome(id: string): Promise<void> {
    await api.delete(`/incomes/${id}`);
  },

  // Récupérer les catégories de revenus
  async getCategories(): Promise<Category[]> {
    const response = await api.get('/incomes/categories');
    return response.data;
  },

  // Récupérer les fréquences de revenus
  async getFrequencies(): Promise<Frequency[]> {
    const response = await api.get('/incomes/frequencies');
    return response.data;
  },
}; 