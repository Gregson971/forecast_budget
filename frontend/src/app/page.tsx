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
          <p className='text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed'>Gérez vos finances avec précision et simplicité grâce à notre plateforme premium</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20'>
          <div className='glass-card p-8 rounded-2xl fade-in hover:scale-105 transition-all duration-300 group'>
            <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                />
              </svg>
            </div>
            <h2 className='text-2xl font-semibold mb-4 text-white'>Prévisions</h2>
            <p className='text-gray-400 mb-6 leading-relaxed'>Analysez et prévoyez vos dépenses futures avec nos outils avancés d'intelligence artificielle</p>
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

          <div className='glass-card p-8 rounded-2xl fade-in hover:scale-105 transition-all duration-300 group'>
            <div className='w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                />
              </svg>
            </div>
            <h2 className='text-2xl font-semibold mb-4 text-white'>Budget</h2>
            <p className='text-gray-400 mb-6 leading-relaxed'>Suivez vos dépenses et revenus en temps réel avec des analyses détaillées</p>
            <Link
              href='/budget'
              className='inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-medium group-hover:shadow-lg group-hover:shadow-emerald-500/25'
            >
              Gérer le budget
              <svg className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </Link>
          </div>

          <div className='glass-card p-8 rounded-2xl fade-in hover:scale-105 transition-all duration-300 group'>
            <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>
            <h2 className='text-2xl font-semibold mb-4 text-white'>Rapports</h2>
            <p className='text-gray-400 mb-6 leading-relaxed'>Consultez des analyses détaillées et des graphiques interactifs de vos finances</p>
            <Link
              href='/reports'
              className='inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium group-hover:shadow-lg group-hover:shadow-purple-500/25'
            >
              Voir les rapports
              <svg className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </Link>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20'>
          <div className='glass-card p-8 rounded-2xl fade-in hover:scale-105 transition-all duration-300 group'>
            <div className='w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
                />
              </svg>
            </div>
            <h2 className='text-2xl font-semibold mb-4 text-white'>Dépenses</h2>
            <p className='text-gray-400 mb-6 leading-relaxed'>Suivez et catégorisez vos dépenses avec une interface intuitive et moderne</p>
            <Link
              href='/expenses'
              className='inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 font-medium group-hover:shadow-lg group-hover:shadow-red-500/25'
            >
              Voir les dépenses
              <svg className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </Link>
          </div>
        </div>

        <div className='text-center fade-in'>
          <h2 className='text-3xl font-semibold mb-8 text-white'>Commencez dès maintenant</h2>
          <Link
            href='/dashboard'
            className='inline-flex items-center px-10 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl text-lg font-medium hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-indigo-500/25 hover:scale-105'
          >
            Accéder au tableau de bord
            <svg className='w-5 h-5 ml-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}
