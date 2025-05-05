import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800'>
      <main className='container mx-auto px-4 py-16'>
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-bold mb-4 text-gray-900 dark:text-white'>Forecast Budget</h1>
          <p className='text-xl text-gray-600 dark:text-gray-300'>Gérez vos finances avec précision et simplicité</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
            <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>Prévisions</h2>
            <p className='text-gray-600 dark:text-gray-300 mb-4'>Analysez et prévoyez vos dépenses futures avec nos outils avancés</p>
            <Link href='/forecasts' className='inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors'>
              Voir les prévisions
            </Link>
          </div>

          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
            <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>Budget</h2>
            <p className='text-gray-600 dark:text-gray-300 mb-4'>Suivez vos dépenses et revenus en temps réel</p>
            <Link href='/budget' className='inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors'>
              Gérer le budget
            </Link>
          </div>

          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
            <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>Rapports</h2>
            <p className='text-gray-600 dark:text-gray-300 mb-4'>Consultez des analyses détaillées de vos finances</p>
            <Link href='/reports' className='inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors'>
              Voir les rapports
            </Link>
          </div>
        </div>

        <div className='text-center'>
          <h2 className='text-2xl font-semibold mb-8 text-gray-900 dark:text-white'>Commencez dès maintenant</h2>
          <Link
            href='/dashboard'
            className='inline-block bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors'
          >
            Accéder au tableau de bord
          </Link>
        </div>
      </main>
    </div>
  );
}
