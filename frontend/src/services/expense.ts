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

export const getExpenseService = async (expense_id: string) => {
  const res = await api.get(`/expenses/${expense_id}`);
  return res.data;
};

export const updateExpenseService = async (expense_id: string, expenseData: any) => {
  try {
    // Récupérer d'abord la dépense existante
    const existingExpense = await getExpenseService(expense_id);
    
    // Convertir la date string en objet Date si nécessaire
    let processedDate = expenseData.date;
    if (typeof expenseData.date === 'string') {
      // S'assurer que la date est au format ISO
      const dateObj = new Date(expenseData.date);
      processedDate = dateObj.toISOString();
    }
    
    // Nettoyer les données pour éviter les valeurs undefined
    const cleanedExpenseData = {
      name: expenseData.name,
      amount: expenseData.amount,
      date: processedDate,
      category: expenseData.category,
      description: expenseData.description || null,
      is_recurring: expenseData.is_recurring || false,
      frequency: expenseData.frequency || null,
    };
    
    // Fusionner les données existantes avec les nouvelles données
    const updatedExpense = {
      ...existingExpense,
      ...cleanedExpenseData,
      id: expense_id, // S'assurer que l'ID reste le même
      user_id: existingExpense.user_id, // Garder l'user_id original
      created_at: existingExpense.created_at, // Garder la date de création
      updated_at: new Date().toISOString(), // Mettre à jour la date de modification
    };
    
    console.log('Données envoyées au backend:', updatedExpense);
    
    const res = await api.put(`/expenses/${expense_id}`, updatedExpense);
    return res.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la dépense:', error);
    throw error;
  }
};

export const deleteExpenseService = async (expense_id: string) => {
  const res = await api.delete(`/expenses/${expense_id}`);
  return res.data;
};
