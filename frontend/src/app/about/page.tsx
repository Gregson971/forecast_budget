import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className='page-container'>
      <main className='container mx-auto max-w-7xl'>
        {/* En-tête */}
        <div className='text-center mb-16 fade-in'>
          <h1 className='text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent'>À propos de Forecast Budget</h1>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed'>Une application moderne pour gérer vos finances personnelles avec précision et simplicité</p>
        </div>

        {/* Section Mission */}
        <div className='glass-card p-8 rounded-lg mb-12 fade-in elevation-2'>
          <div className='flex items-center mb-6'>
            <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4'>
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
              </svg>
            </div>
            <h2 className='text-3xl font-semibold text-white'>Notre Mission</h2>
          </div>
          <p className='text-gray-300 leading-relaxed text-lg'>
            Forecast Budget a été conçu pour démocratiser la gestion financière personnelle. Notre objectif est de fournir un outil simple, intuitif et puissant qui permet à chacun
            de prendre le contrôle de ses finances, de comprendre ses habitudes de dépenses et de planifier son avenir financier avec confiance.
          </p>
        </div>

        {/* Section Fonctionnalités */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
          <div className='glass p-6 rounded-lg fade-in elevation-1'>
            <div className='w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4'>
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-white mb-3'>Gestion des Dépenses</h3>
            <p className='text-gray-400 leading-relaxed'>
              Enregistrez et catégorisez vos dépenses quotidiennes. Suivez vos habitudes de consommation et identifiez les opportunités d'économies.
            </p>
          </div>

          <div className='glass p-6 rounded-lg fade-in elevation-1'>
            <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4'>
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-white mb-3'>Suivi des Revenus</h3>
            <p className='text-gray-400 leading-relaxed'>Gérez toutes vos sources de revenus en un seul endroit. Visualisez vos flux de trésorerie et optimisez votre budget.</p>
          </div>

          <div className='glass p-6 rounded-lg fade-in elevation-1'>
            <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4'>
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-white mb-3'>Prévisions Intelligentes</h3>
            <p className='text-gray-400 leading-relaxed'>
              Analysez vos tendances financières et obtenez des prévisions basées sur vos données historiques pour une planification optimale.
            </p>
          </div>

          <div className='glass p-6 rounded-lg fade-in elevation-1'>
            <div className='w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4'>
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-white mb-3'>Sécurité Avancée</h3>
            <p className='text-gray-400 leading-relaxed'>Vos données financières sont protégées par des technologies de sécurité de pointe et une authentification robuste.</p>
          </div>
        </div>

        {/* Section Contact */}
        <div className='glass-card p-8 rounded-lg mb-12 fade-in elevation-2'>
          <h2 className='text-3xl font-semibold text-white mb-6'>Contact</h2>
          <p className='text-gray-300 leading-relaxed mb-6'>Vous avez des questions, des suggestions ou besoin d'aide ? N'hésitez pas à nous contacter.</p>
          <div className='flex flex-col sm:flex-row gap-4'>
            <Link
              href='/'
              className='inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium'
            >
              Retour à l'accueil
              <svg className='w-4 h-4 ml-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
              </svg>
            </Link>
            <Link
              href='/transactions'
              className='inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-medium'
            >
              Commencer à utiliser
              <svg className='w-4 h-4 ml-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className='text-center fade-in'>
          <p className='text-gray-500 text-sm'>© 2024 Forecast Budget. Tous droits réservés.</p>
        </div>
      </main>
    </div>
  );
}
