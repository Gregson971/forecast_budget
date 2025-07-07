'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
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
    <ProtectedRoute>
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
        <div className='container mx-auto px-4 py-8'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-white mb-4'>Prévisions</h1>
            <p className='text-gray-400'>Page en cours de développement</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
