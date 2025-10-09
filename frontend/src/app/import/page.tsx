'use client'

import { useRouter } from 'next/navigation'
import CSVUploader from '@/components/import/CSVUploader'

export default function ImportPage() {
  const router = useRouter()

  const handleSuccess = () => {
    // Optionnel: rediriger vers une autre page après l'import
    // router.push('/expenses')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </button>

          <h1 className="text-4xl font-bold text-white mb-2">
            Importer des transactions
          </h1>
          <p className="text-gray-400">
            Importez vos dépenses et revenus depuis un fichier CSV d'export bancaire
          </p>
        </div>

        {/* Uploader */}
        <CSVUploader onSuccess={handleSuccess} />

        {/* Liens rapides */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={() => router.push('/expenses')}
            className="flex items-center px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-xl transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Voir mes dépenses
          </button>

          <button
            onClick={() => router.push('/incomes')}
            className="flex items-center px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-xl transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Voir mes revenus
          </button>
        </div>
      </div>
    </div>
  )
}
