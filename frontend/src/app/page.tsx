import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='page-container'>
      <main className='container mx-auto max-w-7xl'>
        <div className='text-center mb-20 fade-in'>
          <h1 className='text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent'>Forecast Budget</h1>
          <p className='text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed'>Gérez vos finances avec précision et simplicité</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-20'>
          {/* Section Transactions */}
          <div className='glass-card p-8 rounded-lg fade-in hover:scale-105 transition-all group'>
            <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
              <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
                />
              </svg>
            </div>
            <h2 className='text-3xl font-semibold mb-4 text-white'>Transactions</h2>
            <p className='text-gray-400 mb-6 leading-relaxed'>Gérez toutes vos transactions (dépenses et revenus) en un seul endroit avec import CSV</p>
            <Link
              href='/transactions'
              className='inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium group-hover:shadow-lg group-hover:shadow-blue-500/25'
            >
              Gérer mes transactions
              <svg className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </Link>
          </div>

          {/* Section Prévisions */}
          <div className='glass-card p-8 rounded-lg fade-in hover:scale-105 transition-all group'>
            <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
              <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                />
              </svg>
            </div>
            <h2 className='text-3xl font-semibold mb-4 text-white'>Prévisions</h2>
            <p className='text-gray-400 mb-6 leading-relaxed'>Visualisez vos dépenses et revenues dans un tableau de bord complet</p>
            <Link
              href='/forecasts'
              className='inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium group-hover:shadow-lg group-hover:shadow-blue-500/25'
            >
              Voir les prévisions
              <svg className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </Link>
          </div>
        </div>

        <div className='text-center fade-in'>
          <h2 className='text-3xl font-semibold mb-8 text-white'>Commencez dès maintenant</h2>
          <p className='text-gray-400 mb-8 max-w-2xl mx-auto'>Choisissez une section pour commencer à gérer vos finances</p>
        </div>
      </main>
    </div>
  );
}
