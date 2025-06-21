import { useState, useCallback } from 'react';
import { loginService, registerService, refreshTokenService, getSessionsService, revokeSessionService, getUserService } from '@/services/auth';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

interface AuthState {
  loading: boolean;
  error: string | null;
  data: any;
}

export const useAuthService = () => {
  const [loginState, setLoginState] = useState<AuthState>({ loading: false, error: null, data: null });
  const [registerState, setRegisterState] = useState<AuthState>({ loading: false, error: null, data: null });
  const [refreshState, setRefreshState] = useState<AuthState>({ loading: false, error: null, data: null });
  const [sessionsState, setSessionsState] = useState<AuthState>({ loading: false, error: null, data: null });
  const [revokeState, setRevokeState] = useState<AuthState>({ loading: false, error: null, data: null });
  const [userState, setUserState] = useState<AuthState>({ loading: false, error: null, data: null });

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoginState({ loading: true, error: null, data: null });
    try {
      const data = await loginService(credentials.email, credentials.password);
      setLoginState({ loading: false, error: null, data });
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Erreur lors de la connexion';
      setLoginState({ loading: false, error: errorMessage, data: null });
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: RegisterData) => {
    setRegisterState({ loading: true, error: null, data: null });
    try {
      const data = await registerService(userData.email, userData.password, userData.first_name, userData.last_name);
      setRegisterState({ loading: false, error: null, data });
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Erreur lors de l\'inscription';
      setRegisterState({ loading: false, error: errorMessage, data: null });
      throw error;
    }
  }, []);

  const refreshToken = useCallback(async (refresh_token: string) => {
    setRefreshState({ loading: true, error: null, data: null });
    try {
      const data = await refreshTokenService(refresh_token);
      setRefreshState({ loading: false, error: null, data });
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Erreur lors du rafraîchissement du token';
      setRefreshState({ loading: false, error: errorMessage, data: null });
      throw error;
    }
  }, []);

  const getSessions = useCallback(async (access_token: string) => {
    setSessionsState({ loading: true, error: null, data: null });
    try {
      const data = await getSessionsService(access_token);
      setSessionsState({ loading: false, error: null, data });
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Erreur lors de la récupération des sessions';
      setSessionsState({ loading: false, error: errorMessage, data: null });
      throw error;
    }
  }, []);

  const revokeSession = useCallback(async (sessionId: string, access_token: string) => {
    setRevokeState({ loading: true, error: null, data: null });
    try {
      const data = await revokeSessionService(sessionId, access_token);
      setRevokeState({ loading: false, error: null, data });
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Erreur lors de la révocation de la session';
      setRevokeState({ loading: false, error: errorMessage, data: null });
      throw error;
    }
  }, []);

  const getUser = useCallback(async (access_token: string) => {
    setUserState({ loading: true, error: null, data: null });
    try {
      const data = await getUserService(access_token);
      setUserState({ loading: false, error: null, data });
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Erreur lors de la récupération des données utilisateur';
      setUserState({ loading: false, error: errorMessage, data: null });
      throw error;
    }
  }, []);

  return {
    // Actions
    login,
    register,
    refreshToken,
    getSessions,
    revokeSession,
    getUser,
    
    // États
    loginState,
    registerState,
    refreshState,
    sessionsState,
    revokeState,
    userState,
  };
}; 