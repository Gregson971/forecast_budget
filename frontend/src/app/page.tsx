import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Arrière-plan avec effet de particules */}
      <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900'></div>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]'></div>

      <main className='relative z-10 container mx-auto px-4 py-16'>
        <div className='text-center mb-20 fade-in'>
          <h1 className='text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent'>Forecast Budget</h1>
          <p className='text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed'>Gérez vos finances avec précision et simplicité</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-20'>
          {/* Section Dépenses */}
          <div className='glass-card p-8 rounded-2xl fade-in hover:scale-105 transition-all duration-300 group'>
            <div className='w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
              <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
                />
              </svg>
            </div>
            <h2 className='text-3xl font-semibold mb-4 text-white'>Dépenses</h2>
            <p className='text-gray-400 mb-6 leading-relaxed'>Ajoutez et gérez vos dépenses quotidiennes avec une interface intuitive</p>
            <Link
              href='/expenses'
              className='inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 font-medium group-hover:shadow-lg group-hover:shadow-red-500/25'
            >
              Gérer les dépenses
              <svg className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </Link>
          </div>

          {/* Section Revenues */}
          <div className='glass-card p-8 rounded-2xl fade-in hover:scale-105 transition-all duration-300 group'>
            <div className='w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
              <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                />
              </svg>
            </div>
            <h2 className='text-3xl font-semibold mb-4 text-white'>Revenues</h2>
            <p className='text-gray-400 mb-6 leading-relaxed'>Enregistrez vos revenus et sources de revenus pour un suivi complet</p>
            <Link
              href='/incomes'
              className='inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-medium group-hover:shadow-lg group-hover:shadow-emerald-500/25'
            >
              Gérer les revenues
              <svg className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </Link>
          </div>

          {/* Section Budget */}
          <div className='glass-card p-8 rounded-2xl fade-in hover:scale-105 transition-all duration-300 group'>
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
            <h2 className='text-3xl font-semibold mb-4 text-white'>Budget</h2>
            <p className='text-gray-400 mb-6 leading-relaxed'>Visualisez vos dépenses et revenues dans un tableau de bord complet</p>
            <Link
              href='/forecasts'
              className='inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium group-hover:shadow-lg group-hover:shadow-blue-500/25'
            >
              Voir le budget
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
