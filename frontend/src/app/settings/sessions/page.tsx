'use client';

import { useSessions } from '@/hooks/useSessions';
import SessionList from '@/components/SessionList';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function SessionsPage() {
  const { sessions, sessionsLoading, sessionsError, revokeSession, fetchSessions } = useSessions();

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSession(sessionId);
      // La liste sera automatiquement rafraîchie grâce au hook
    } catch (error) {
      console.error('Erreur lors de la révocation de la session:', error);
    }
  };

  if (sessionsLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='glass-card p-8 rounded-2xl'>
          <div className='flex items-center space-x-4'>
            <div className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin'></div>
            <span className='text-white text-lg'>Chargement des sessions...</span>
          </div>
        </div>
      </div>
    );
  }

  if (sessionsError) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='glass-card p-8 rounded-2xl'>
          <div className='text-center'>
            <div className='w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4'>
              <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-white mb-2'>Erreur de chargement</h3>
            <p className='text-gray-400 mb-4'>{sessionsError}</p>
            <button onClick={fetchSessions} className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors'>
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
        <div className='container mx-auto px-4 py-8'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-white mb-2'>Sessions actives</h1>
            <p className='text-gray-400'>Gérez vos sessions de connexion</p>
          </div>

          {/* Liste des sessions */}
          <div className='glass-card p-6 rounded-2xl'>
            <SessionList />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
