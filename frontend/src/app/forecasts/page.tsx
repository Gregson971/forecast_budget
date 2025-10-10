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
        <div className='page-container'>
          <div className='max-w-7xl mx-auto'>
            <div className='glass p-12 rounded-lg elevation-2 text-center'>
              <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent'></div>
              <p className='text-muted-foreground mt-4'>Chargement des prévisions...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className='page-container'>
          <div className='max-w-7xl mx-auto'>
            <ErrorNotification error={error} />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!data) {
    return (
      <ProtectedRoute>
        <div className='page-container'>
          <div className='max-w-7xl mx-auto'>
            <div className='glass p-8 rounded-lg elevation-1 text-center'>
              <p className='text-muted-foreground'>Aucune donnée disponible</p>
            </div>
          </div>
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
        labels: {
          color: '#e0e0e0',
        },
      },
      title: {
        display: true,
        text: `Prévisions financières - ${periodOptions.find((p) => p.value === selectedPeriod)?.label}`,
        color: '#ffffff',
        font: {
          size: 18,
          weight: 500,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(30, 30, 30, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#e0e0e0',
        borderColor: '#383838',
        borderWidth: 1,
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
          color: '#9e9e9e',
        },
        ticks: {
          color: '#9e9e9e',
        },
        grid: {
          color: '#383838',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Montant (€)',
          color: '#9e9e9e',
        },
        ticks: {
          color: '#9e9e9e',
          callback: (value: any) => {
            return value.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            });
          },
        },
        grid: {
          color: '#383838',
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
      <div className='page-container'>
        <div className='max-w-7xl mx-auto'>
          <div className='mb-8'>
            <h1 className='text-4xl font-bold text-white mb-4'>Prévisions financières</h1>
            <p className='text-muted-foreground mb-6'>Visualisez vos dépenses, revenus et prévisions sur différentes périodes.</p>

            {/* Sélecteur de période */}
            <div className='flex flex-wrap gap-2 mb-6'>
              {periodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedPeriod(option.value)}
                  className={`ripple px-4 py-2 rounded font-medium transition-all ${
                    selectedPeriod === option.value
                      ? 'bg-primary text-primary-foreground elevation-2'
                      : 'bg-secondary text-white hover:bg-muted elevation-1'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Résumé des totaux */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
              <div className='glass p-6 rounded-lg elevation-1'>
                <h3 className='text-sm font-medium text-muted-foreground mb-2'>Dépenses totales</h3>
                <p className='text-2xl font-bold text-red-400'>
                  {data.total_expenses.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
              </div>
              <div className='glass p-6 rounded-lg elevation-1'>
                <h3 className='text-sm font-medium text-muted-foreground mb-2'>Revenus totaux</h3>
                <p className='text-2xl font-bold text-green-400'>
                  {data.total_income.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
              </div>
              <div className='glass p-6 rounded-lg elevation-1'>
                <h3 className='text-sm font-medium text-muted-foreground mb-2'>Solde net</h3>
                <p className={`text-2xl font-bold ${data.net_balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {data.net_balance.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
              </div>
              <div className='glass p-6 rounded-lg elevation-1'>
                <h3 className='text-sm font-medium text-muted-foreground mb-2'>Solde prévisionnel</h3>
                <p className={`text-2xl font-bold ${data.forecast_net_balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {data.forecast_net_balance.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Graphique */}
          <div className='glass p-6 rounded-lg elevation-2 mb-6'>
            <div className='h-96'>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Légende */}
          <div className='glass p-6 rounded-lg elevation-1'>
            <p className='text-sm text-muted-foreground mb-2'>
              <strong className='text-white'>Ligne continue :</strong> Données historiques
            </p>
            <p className='text-sm text-muted-foreground'>
              <strong className='text-white'>Ligne pointillée :</strong> Données prévisionnelles basées sur vos habitudes de dépenses et revenus récurrents
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
