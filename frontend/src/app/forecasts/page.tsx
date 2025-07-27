'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { fr } from 'date-fns/locale';

import { useForecast } from '@/hooks/useForecast';
import { ForecastPeriod } from '@/services/forecast';
import Button from '@/components/ui/Button';
import ErrorNotification from '@/components/ErrorNotification';

// Enregistrer les composants Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

const periodOptions: { value: ForecastPeriod; label: string }[] = [
  { value: '1m', label: '1 mois' },
  { value: '3m', label: '3 mois' },
  { value: '6m', label: '6 mois' },
  { value: '1y', label: '1 an' },
];

export default function ForecastsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<ForecastPeriod>('3m');
  const { data, loading, error } = useForecast(selectedPeriod);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className='container mx-auto px-4 py-8'>
          <div className='flex items-center justify-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className='container mx-auto px-4 py-8'>
          <ErrorNotification error={error} />
        </div>
      </ProtectedRoute>
    );
  }

  if (!data) {
    return (
      <ProtectedRoute>
        <div className='container mx-auto px-4 py-8'>
          <div className='text-center text-gray-500'>Aucune donnée disponible</div>
        </div>
      </ProtectedRoute>
    );
  }

  // Préparer les données pour Chart.js
  const chartData = {
    labels: [...data.expenses_data.map((d) => new Date(d.date)), ...data.forecast_expenses.map((d) => new Date(d.date))],
    datasets: [
      {
        label: 'Dépenses historiques',
        data: data.expenses_data.map((d) => ({ x: new Date(d.date), y: d.amount })),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Dépenses prévisionnelles',
        data: data.forecast_expenses.map((d) => ({ x: new Date(d.date), y: d.amount })),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Revenus historiques',
        data: data.income_data.map((d) => ({ x: new Date(d.date), y: d.amount })),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Revenus prévisionnels',
        data: data.forecast_income.map((d) => ({ x: new Date(d.date), y: d.amount })),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Prévisions financières - ${periodOptions.find((p) => p.value === selectedPeriod)?.label}`,
        font: {
          size: 16,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          title: (context: any) => {
            const date = new Date(context[0].parsed.x);
            return date.toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
          },
          label: (context: any) => {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            })}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'month' as const,
          displayFormats: {
            month: 'MMM yyyy',
          },
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Montant (€)',
        },
        ticks: {
          callback: (value: any) => {
            return value.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            });
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <ProtectedRoute>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>Prévisions financières</h1>
          <p className='text-gray-600 mb-6'>Visualisez vos dépenses, revenus et prévisions sur différentes périodes.</p>

          {/* Sélecteur de période */}
          <div className='flex flex-wrap gap-2 mb-6'>
            {periodOptions.map((option) => (
              <Button key={option.value} onClick={() => setSelectedPeriod(option.value)} variant={selectedPeriod === option.value ? 'default' : 'outline'} size='sm'>
                {option.label}
              </Button>
            ))}
          </div>

          {/* Résumé des totaux */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
            <div className='bg-white p-4 rounded-lg shadow'>
              <h3 className='text-sm font-medium text-gray-500'>Dépenses totales</h3>
              <p className='text-2xl font-bold text-red-600'>
                {data.total_expenses.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </p>
            </div>
            <div className='bg-white p-4 rounded-lg shadow'>
              <h3 className='text-sm font-medium text-gray-500'>Revenus totaux</h3>
              <p className='text-2xl font-bold text-green-600'>
                {data.total_income.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </p>
            </div>
            <div className='bg-white p-4 rounded-lg shadow'>
              <h3 className='text-sm font-medium text-gray-500'>Solde net</h3>
              <p className={`text-2xl font-bold ${data.net_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.net_balance.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </p>
            </div>
            <div className='bg-white p-4 rounded-lg shadow'>
              <h3 className='text-sm font-medium text-gray-500'>Solde prévisionnel</h3>
              <p className={`text-2xl font-bold ${data.forecast_net_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.forecast_net_balance.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Graphique */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <div className='h-96'>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Légende */}
        <div className='mt-6 text-sm text-gray-600'>
          <p className='mb-2'>
            <strong>Ligne continue :</strong> Données historiques
          </p>
          <p>
            <strong>Ligne pointillée :</strong> Données prévisionnelles basées sur vos habitudes de dépenses et revenus récurrents
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
