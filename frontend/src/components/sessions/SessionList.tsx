'use client';
import { useSessions } from '@/hooks/useSessions';
import SessionItem from './SessionItem';
import { handleSilentError } from '@/lib/errorHandler';

export default function SessionList() {
  const { sessions, sessionsLoading, sessionsError, revokeSession, revokeError } = useSessions();

  // Récupérer le refresh_token actuel pour identifier la session courante
  const currentRefreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;

  const handleRevoke = async (id: string) => {
    try {
      await revokeSession(id);
      // La liste sera automatiquement rafraîchie grâce au hook
    } catch (error) {
      handleSilentError(error);
    }
  };

  if (sessionsLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='flex items-center space-x-4'>
          <div className='w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin'></div>
          <span className='text-gray-600'>Chargement des sessions...</span>
        </div>
      </div>
    );
  }

  if (sessionsError) {
    return (
      <div className='text-center py-8'>
        <div className='w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4'>
          <svg className='w-8 h-8 text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
        </div>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>Erreur de chargement</h3>
        <p className='text-gray-600 mb-4'>{sessionsError}</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className='text-center py-8'>
        <div className='w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4'>
          <svg className='w-8 h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
        </div>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>Aucune session</h3>
        <p className='text-gray-600'>Aucune session active trouvée</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {revokeError && (
        <div className='p-3 bg-red-500/20 border border-red-500/30 rounded-lg'>
          <p className='text-sm text-red-600'>{revokeError}</p>
        </div>
      )}

      {sessions.map((session) => (
        <SessionItem
          key={session.id}
          session={session}
          isCurrent={session.refresh_token === currentRefreshToken}
          onRevoke={() => handleRevoke(session.id)}
        />
      ))}
    </div>
  );
}
