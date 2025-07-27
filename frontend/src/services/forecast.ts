import api from '@/lib/api';

export interface DataPoint {
  date: string;
  amount: number;
  category?: string;
}

export interface ForecastData {
  user_id: string;
  period: string;
  start_date: string;
  end_date: string;
  expenses_data: DataPoint[];
  income_data: DataPoint[];
  forecast_expenses: DataPoint[];
  forecast_income: DataPoint[];
  total_expenses: number;
  total_income: number;
  net_balance: number;
  forecast_total_expenses: number;
  forecast_total_income: number;
  forecast_net_balance: number;
  created_at: string;
  updated_at: string;
}

export type ForecastPeriod = '1m' | '3m' | '6m' | '1y';

export const forecastService = {
  async getForecast(period: ForecastPeriod): Promise<ForecastData> {
    try {
      const response = await api.get(`/forecasts?period=${period}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des prévisions:', error);
      
      // Gestion spécifique des erreurs d'authentification
      if (error.response?.status === 401) {
        console.error('🔐 Erreur d\'authentification - Token invalide ou expiré');
        // L'intercepteur axios devrait déjà gérer le refresh du token
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      
      // Gestion des autres erreurs
      if (error.response?.status === 500) {
        throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
      }
      
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      
      throw new Error('Erreur lors de la récupération des prévisions');
    }
  }
}; 