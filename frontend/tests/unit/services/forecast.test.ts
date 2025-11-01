import { forecastService } from '@/services/forecast';
import api from '@/lib/api';

jest.mock('@/lib/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('forecast service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getForecast', () => {
    const mockForecastData = {
      user_id: 'user-123',
      period: '3m',
      start_date: '2025-01-01',
      end_date: '2025-03-31',
      expenses_data: [
        { date: '2025-01-01', amount: 1000, category: 'FOOD' },
        { date: '2025-02-01', amount: 1200, category: 'TRANSPORT' },
      ],
      income_data: [
        { date: '2025-01-01', amount: 5000, category: 'SALARY' },
        { date: '2025-02-01', amount: 5000, category: 'SALARY' },
      ],
      forecast_expenses: [
        { date: '2025-03-01', amount: 1100 },
      ],
      forecast_income: [
        { date: '2025-03-01', amount: 5000 },
      ],
      total_expenses: 2200,
      total_income: 10000,
      net_balance: 7800,
      forecast_total_expenses: 1100,
      forecast_total_income: 5000,
      forecast_net_balance: 3900,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-15T00:00:00Z',
    };

    it('should fetch forecast for 1 month period', async () => {
      mockedApi.get.mockResolvedValue({ data: mockForecastData });

      const result = await forecastService.getForecast('1m');

      expect(mockedApi.get).toHaveBeenCalledWith('/forecasts?period=1m');
      expect(result).toEqual(mockForecastData);
    });

    it('should fetch forecast for 3 months period', async () => {
      mockedApi.get.mockResolvedValue({ data: mockForecastData });

      const result = await forecastService.getForecast('3m');

      expect(mockedApi.get).toHaveBeenCalledWith('/forecasts?period=3m');
      expect(result).toEqual(mockForecastData);
    });

    it('should fetch forecast for 6 months period', async () => {
      mockedApi.get.mockResolvedValue({ data: mockForecastData });

      const result = await forecastService.getForecast('6m');

      expect(mockedApi.get).toHaveBeenCalledWith('/forecasts?period=6m');
      expect(result).toEqual(mockForecastData);
    });

    it('should fetch forecast for 1 year period', async () => {
      mockedApi.get.mockResolvedValue({ data: mockForecastData });

      const result = await forecastService.getForecast('1y');

      expect(mockedApi.get).toHaveBeenCalledWith('/forecasts?period=1y');
      expect(result).toEqual(mockForecastData);
    });

    it('should handle empty forecast data', async () => {
      const emptyForecast = {
        ...mockForecastData,
        expenses_data: [],
        income_data: [],
        forecast_expenses: [],
        forecast_income: [],
        total_expenses: 0,
        total_income: 0,
        net_balance: 0,
      };
      mockedApi.get.mockResolvedValue({ data: emptyForecast });

      const result = await forecastService.getForecast('1m');

      expect(result.expenses_data).toEqual([]);
      expect(result.income_data).toEqual([]);
      expect(result.total_expenses).toBe(0);
    });
  });
});

