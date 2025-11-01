import { renderHook, waitFor } from '@testing-library/react';
import { useForecast } from '@/hooks/useForecast';
import { forecastService } from '@/services/forecast';

jest.mock('@/services/forecast');

const mockedForecastService = forecastService as jest.Mocked<typeof forecastService>;

describe('useForecast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should fetch forecast data successfully', async () => {
    const mockForecastData = {
      user_id: 'user-123',
      period: '3m',
      start_date: '2025-01-01',
      end_date: '2025-03-31',
      expenses_data: [],
      income_data: [],
      forecast_expenses: [],
      forecast_income: [],
      total_expenses: 1000,
      total_income: 5000,
      net_balance: 4000,
      forecast_total_expenses: 1100,
      forecast_total_income: 5000,
      forecast_net_balance: 3900,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-15T00:00:00Z',
    };

    localStorage.setItem('access_token', 'test-token');
    mockedForecastService.getForecast.mockResolvedValue(mockForecastData);

    const { result } = renderHook(() => useForecast('3m'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockForecastData);
    expect(result.current.error).toBeNull();
  });

  it('should set error when not authenticated', async () => {
    // Don't set access token
    const { result } = renderHook(() => useForecast('1m'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toContain('Vous devez être connecté');
    expect(result.current.data).toBeNull();
  });

  it('should handle fetch error', async () => {
    localStorage.setItem('access_token', 'test-token');
    const error = new Error('Network error');
    mockedForecastService.getForecast.mockRejectedValue(error);

    const { result } = renderHook(() => useForecast('6m'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.data).toBeNull();
  });

  it('should refetch when period changes', async () => {
    const mockForecast1m = {
      user_id: 'user-123',
      period: '1m',
      start_date: '2025-01-01',
      end_date: '2025-01-31',
      expenses_data: [],
      income_data: [],
      forecast_expenses: [],
      forecast_income: [],
      total_expenses: 1000,
      total_income: 5000,
      net_balance: 4000,
      forecast_total_expenses: 1100,
      forecast_total_income: 5000,
      forecast_net_balance: 3900,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-15T00:00:00Z',
    };

    const mockForecast3m = {
      ...mockForecast1m,
      period: '3m',
      end_date: '2025-03-31',
    };

    localStorage.setItem('access_token', 'test-token');
    mockedForecastService.getForecast
      .mockResolvedValueOnce(mockForecast1m)
      .mockResolvedValueOnce(mockForecast3m);

    const { result, rerender } = renderHook(
      ({ period }) => useForecast(period),
      { initialProps: { period: '1m' as const } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data?.period).toBe('1m');

    rerender({ period: '3m' });

    await waitFor(() => {
      expect(result.current.data?.period).toBe('3m');
    });

    expect(mockedForecastService.getForecast).toHaveBeenCalledTimes(2);
  });

  it('should handle unknown error type', async () => {
    localStorage.setItem('access_token', 'test-token');
    mockedForecastService.getForecast.mockRejectedValue('String error');

    const { result } = renderHook(() => useForecast('1y'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Erreur inconnue');
  });
});

