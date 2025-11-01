import { useState, useEffect, useCallback } from 'react';
import { incomeService } from '@/services/income';
import type { Income, CreateIncomeRequest, UpdateIncomeRequest, Category, Frequency } from '@/types/income';
import { handleSilentError } from '@/lib/errorHandler';

export const useIncomes = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [frequencies, setFrequencies] = useState<Frequency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les revenus
  const loadIncomes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await incomeService.getIncomes();
      setIncomes(data);
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      let errorMessage = 'Erreur lors du chargement des revenus';
      
      if (!error.response) {
        errorMessage = 'Erreur de connexion au serveur. Vérifiez votre connexion internet.';
      } else if (error.response.status === 401) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      } else if (error.response.status && error.response.status >= 500) {
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les catégories
  const loadCategories = useCallback(async () => {
    try {
      const data = await incomeService.getCategories();
      setCategories(data);
    } catch (err: unknown) {
      handleSilentError(err);
      // Ne pas afficher d'erreur pour les catégories car ce n'est pas critique
    }
  }, []);

  // Charger les fréquences
  const loadFrequencies = useCallback(async () => {
    try {
      const data = await incomeService.getFrequencies();
      setFrequencies(data);
    } catch (err: unknown) {
      handleSilentError(err);
      // Ne pas afficher d'erreur pour les fréquences car ce n'est pas critique
    }
  }, []);

  // Créer un revenu
  const createIncome = useCallback(async (data: CreateIncomeRequest) => {
    try {
      setError(null);
      const newIncome = await incomeService.createIncome(data);
      setIncomes(prev => [newIncome, ...prev]);
      return newIncome;
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: { detail?: string } } };
      let errorMessage = 'Erreur lors de la création du revenu';
      
      if (!error.response) {
        errorMessage = 'Erreur de connexion au serveur. Vérifiez votre connexion internet.';
      } else if (error.response.status === 401) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      } else if (error.response.status === 422) {
        errorMessage = error.response.data?.detail || 'Données invalides';
      } else if (error.response.status && error.response.status >= 500) {
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
      }
      
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Mettre à jour un revenu
  const updateIncome = useCallback(async (id: string, data: UpdateIncomeRequest) => {
    try {
      setError(null);
      const updatedIncome = await incomeService.updateIncome(id, data);
      setIncomes(prev => prev.map(income => 
        income.id === id ? updatedIncome : income
      ));
      return updatedIncome;
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: { detail?: string } } };
      let errorMessage = 'Erreur lors de la mise à jour du revenu';
      
      if (!error.response) {
        errorMessage = 'Erreur de connexion au serveur. Vérifiez votre connexion internet.';
      } else if (error.response.status === 401) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      } else if (error.response.status === 422) {
        errorMessage = error.response.data?.detail || 'Données invalides';
      } else if (error.response.status && error.response.status >= 500) {
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
      }
      
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Supprimer un revenu
  const deleteIncome = useCallback(async (id: string) => {
    try {
      setError(null);
      await incomeService.deleteIncome(id);
      setIncomes(prev => prev.filter(income => income.id !== id));
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      let errorMessage = 'Erreur lors de la suppression du revenu';
      
      if (!error.response) {
        errorMessage = 'Erreur de connexion au serveur. Vérifiez votre connexion internet.';
      } else if (error.response.status === 401) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      } else if (error.response.status && error.response.status >= 500) {
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
      }
      
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Charger les données au montage du composant
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        loadIncomes(),
        loadCategories(),
        loadFrequencies()
      ]);
    };
    loadData();
  }, [loadIncomes, loadCategories, loadFrequencies]);

  return {
    incomes,
    categories,
    frequencies,
    loading,
    error,
    createIncome,
    updateIncome,
    deleteIncome,
    loadIncomes,
    loadCategories,
    loadFrequencies,
  };
}; 