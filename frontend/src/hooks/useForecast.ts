import { useState, useEffect } from 'react';
import { forecastService, ForecastData, ForecastPeriod } from '@/services/forecast';
import { handleSilentError } from '@/lib/errorHandler';

export const useForecast = (period: ForecastPeriod) => {
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        setError(null);

        // Vérifier si l'utilisateur est authentifié
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          setError('Vous devez être connecté pour voir les prévisions');
          setLoading(false);
          return;
        }

        const forecastData = await forecastService.getForecast(period);
        setData(forecastData);
      } catch (err) {
        handleSilentError(err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [period]);

  return { data, loading, error };
}; 