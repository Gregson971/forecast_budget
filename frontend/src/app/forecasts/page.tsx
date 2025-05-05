'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Données de démonstration
const mockData = [
  { mois: 'Jan', revenus: 4000, depenses: 2400, solde: 1600 },
  { mois: 'Fév', revenus: 3000, depenses: 1398, solde: 1602 },
  { mois: 'Mar', revenus: 2000, depenses: 9800, solde: -7800 },
  { mois: 'Avr', revenus: 2780, depenses: 3908, solde: -1128 },
  { mois: 'Mai', revenus: 1890, depenses: 4800, solde: -2910 },
  { mois: 'Juin', revenus: 2390, depenses: 3800, solde: -1410 },
];

export default function ForecastsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6mois');

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 p-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>Prévisions Budgétaires</h1>
          <div className='flex gap-4 mb-6'>
            <button
              onClick={() => setSelectedPeriod('3mois')}
              className={`px-4 py-2 rounded ${selectedPeriod === '3mois' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            >
              3 mois
            </button>
            <button
              onClick={() => setSelectedPeriod('6mois')}
              className={`px-4 py-2 rounded ${selectedPeriod === '6mois' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            >
              6 mois
            </button>
            <button
              onClick={() => setSelectedPeriod('12mois')}
              className={`px-4 py-2 rounded ${selectedPeriod === '12mois' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            >
              12 mois
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>Revenus Totaux</h3>
            <p className='text-2xl font-bold text-green-600'>{mockData.reduce((acc, curr) => acc + curr.revenus, 0).toLocaleString()} €</p>
          </div>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>Dépenses Totales</h3>
            <p className='text-2xl font-bold text-red-600'>{mockData.reduce((acc, curr) => acc + curr.depenses, 0).toLocaleString()} €</p>
          </div>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>Solde Net</h3>
            <p className='text-2xl font-bold text-blue-600'>{mockData.reduce((acc, curr) => acc + curr.solde, 0).toLocaleString()} €</p>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>Évolution des Revenus et Dépenses</h2>
          <div className='h-[400px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='mois' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type='monotone' dataKey='revenus' stroke='#22c55e' name='Revenus' />
                <Line type='monotone' dataKey='depenses' stroke='#ef4444' name='Dépenses' />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>Détail des Prévisions</h2>
          <div className='overflow-x-auto'>
            <table className='min-w-full'>
              <thead>
                <tr className='border-b dark:border-gray-700'>
                  <th className='text-left py-3 px-4 text-gray-600 dark:text-gray-300'>Mois</th>
                  <th className='text-left py-3 px-4 text-gray-600 dark:text-gray-300'>Revenus</th>
                  <th className='text-left py-3 px-4 text-gray-600 dark:text-gray-300'>Dépenses</th>
                  <th className='text-left py-3 px-4 text-gray-600 dark:text-gray-300'>Solde</th>
                </tr>
              </thead>
              <tbody>
                {mockData.map((row, index) => (
                  <tr key={index} className='border-b dark:border-gray-700'>
                    <td className='py-3 px-4 text-gray-900 dark:text-white'>{row.mois}</td>
                    <td className='py-3 px-4 text-green-600'>{row.revenus.toLocaleString()} €</td>
                    <td className='py-3 px-4 text-red-600'>{row.depenses.toLocaleString()} €</td>
                    <td className={`py-3 px-4 ${row.solde >= 0 ? 'text-green-600' : 'text-red-600'}`}>{row.solde.toLocaleString()} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
