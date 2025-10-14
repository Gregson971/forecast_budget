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
    const response = await api.get(`/forecasts?period=${period}`);
    return response.data;
  }
}; 