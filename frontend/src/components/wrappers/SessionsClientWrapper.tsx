'use client';

import { useSessions } from '@/hooks/useSessions';
import SessionList from '@/components/sessions/SessionList';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function SessionsClientWrapper() {
  const { sessionsLoading, sessionsError, fetchSessions } = useSessions();

  if (sessionsLoading) {
    return (
      <div className='flex items-center justify-center py-16'>
        <div className='glass-card p-8 rounded-lg elevation-2'>
          <div className='flex items-center space-x-4'>
            <div className='w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin'></div>
            <span className='text-white text-lg'>Chargement des sessions...</span>
          </div>
        </div>
      </div>
    );
  }

  if (sessionsError) {
    return (
      <div className='flex items-center justify-center py-16'>
        <div className='glass-card p-8 rounded-lg elevation-2'>
          <div className='text-center'>
            <div className='w-16 h-16 bg-gradient-to-r from-destructive to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4'>
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
            <p className='text-muted-foreground mb-4'>{sessionsError}</p>
            <button
              onClick={fetchSessions}
              className='ripple px-4 py-2 bg-success hover:bg-green-700 text-white rounded transition-all elevation-1'
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className='glass-card p-6 rounded-lg elevation-2'>
        <SessionList />
      </div>
    </ProtectedRoute>
  );
}
