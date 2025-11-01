import { useState, useCallback, useEffect } from 'react';
import { getSessionsService, revokeSessionService } from '@/services/auth';
import type { Session } from '@/types/auth';

interface SessionsState {
  loading: boolean;
  error: string | null;
  data: Session[] | null;
}

interface RevokeState {
  loading: boolean;
  error: string | null;
}

export const useSessions = () => {
  const [sessionsState, setSessionsState] = useState<SessionsState>({ 
    loading: false, 
    error: null, 
    data: null 
  });
  const [revokeState, setRevokeState] = useState<RevokeState>({ 
    loading: false, 
    error: null 
  });

  const fetchSessions = useCallback(async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      setSessionsState({ loading: false, error: 'Token d\'accès non trouvé', data: null });
      return;
    }

    setSessionsState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await getSessionsService(accessToken);
      setSessionsState({ loading: false, error: null, data });
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Erreur lors de la récupération des sessions';
      setSessionsState({ loading: false, error: errorMessage, data: null });
      throw error;
    }
  }, []);

  const revokeSession = useCallback(async (sessionId: string) => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      setRevokeState({ loading: false, error: 'Token d\'accès non trouvé' });
      return;
    }

    setRevokeState({ loading: true, error: null });
    try {
      await revokeSessionService(sessionId, accessToken);
      setRevokeState({ loading: false, error: null });
      
      // Rafraîchir la liste des sessions après révocation
      await fetchSessions();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Erreur lors de la révocation de la session';
      setRevokeState({ loading: false, error: errorMessage });
      throw error;
    }
  }, [fetchSessions]);

  // Charger automatiquement les sessions au montage du composant
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    // Actions
    fetchSessions,
    revokeSession,
    
    // États
    sessions: sessionsState.data || [],
    sessionsLoading: sessionsState.loading,
    sessionsError: sessionsState.error,
    
    revokeLoading: revokeState.loading,
    revokeError: revokeState.error,
  };
}; 