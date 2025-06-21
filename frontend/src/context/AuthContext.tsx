'use client';
import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import { loginService, registerService, refreshTokenService, getSessionsService, revokeSessionService, getUserService } from '@/services/auth';
import { getExpensesService, createExpenseService } from '@/services/expense';

type User = { email: string; first_name: string; last_name: string };
type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, first_name: string, last_name: string) => Promise<void>;
  logout: () => void;
  getSessions: () => Promise<any[]>;
  revokeSession: (sessionId: string) => Promise<void>;
  getUser: () => Promise<User | null>;
  getExpenses: () => Promise<any[]>;
  createExpense: (expense: any) => Promise<void>;
};
type JWTPayload = {
  exp: number; // timestamp en secondes
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const { access_token, refresh_token } = await loginService(email, password);
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      // Récupérer les informations complètes de l'utilisateur après la connexion
      const userData = await getUserService(access_token);
      setUser(userData);

      router.push('/');
      toast.success('Connexion réussie', {
        description: "Vous allez être redirigé vers la page d'accueil.",
        duration: 5000,
      });
    } catch (error) {
      toast.error('Erreur lors de la connexion');
      throw error;
    }
  };

  const register = async (email: string, password: string, first_name: string, last_name: string) => {
    try {
      await registerService(email, password, first_name, last_name);
      const { access_token, refresh_token } = await loginService(email, password);
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      // Récupérer les informations complètes de l'utilisateur après l'inscription
      const userData = await getUserService(access_token);
      setUser(userData);

      router.push('/');
      toast.success('Inscription réussie', {
        description: "Vous allez être redirigé vers la page d'accueil.",
        duration: 5000,
      });
    } catch (error) {
      toast.error("Erreur lors de l'inscription");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    router.push('/auth/login');
    toast.success('Déconnexion réussie', {
      description: 'Vous allez être redirigé vers la page de connexion.',
      duration: 5000,
    });
  };

  const forceLogout = logout;

  const getTokenExpiration = (token: string): number | null => {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      return decoded.exp * 1000; // en ms
    } catch {
      return null;
    }
  };

  const refreshAccessToken = async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) return forceLogout();

    try {
      const { access_token } = await refreshTokenService(refresh_token);
      localStorage.setItem('access_token', access_token);
      console.log('🔁 Token refreshed');
    } catch (error) {
      console.error('🔒 Refresh token failed');
      toast.error('Session expirée', {
        description: 'Vous allez être redirigé vers la page de connexion.',
        duration: 5000,
      });
      forceLogout();
    }
  };

  const getUser = async (): Promise<User | null> => {
    const access_token = localStorage.getItem('access_token');
    if (!access_token) return null;

    try {
      const user = await getUserService(access_token);
      setUser(user);
      return user;
    } catch (error) {
      toast.error('Erreur lors de la récupération des données utilisateur');
      return null;
    }
  };

  const getSessions = async () => {
    try {
      const access_token = localStorage.getItem('access_token');
      if (!access_token) return [];

      const sessions = await getSessionsService(access_token);
      return sessions;
    } catch (error) {
      toast.error('Erreur lors de la récupération des sessions');
      return [];
    }
  };

  const revokeSession = async (sessionId: string) => {
    try {
      const access_token = localStorage.getItem('access_token');
      if (!access_token) return;

      await revokeSessionService(sessionId, access_token);
      toast.success('Session révoquée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la révocation de la session');
    }
  };

  const getExpenses = async () => {
    try {
      const expenses = await getExpensesService();
      return expenses;
    } catch (error) {
      toast.error('Erreur lors de la récupération des dépenses');
      return [];
    }
  };

  const createExpense = async (expense: any) => {
    try {
      await createExpenseService(expense);
      toast.success('Dépense créée avec succès');
    } catch (error: any) {
      toast.error('Erreur lors de la création de la dépense', error.response?.data?.detail);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const expiresAt = getTokenExpiration(token);
      if (!expiresAt) return;

      const now = Date.now();
      const timeLeft = expiresAt - now;

      if (timeLeft < 60_000) {
        refreshAccessToken();
      }
    }, 30_000); // toutes les 30s

    return () => clearInterval(interval);
  }, []);

  // Récupérer les informations de l'utilisateur au chargement si un token existe
  useEffect(() => {
    const initializeAuth = async () => {
      const access_token = localStorage.getItem('access_token');
      if (access_token && !user) {
        try {
          const userData = await getUserService(access_token);
          setUser(userData);
        } catch (error) {
          console.error('Erreur lors de la récupération des informations utilisateur:', error);
          // Si le token est invalide, on déconnecte l'utilisateur
          forceLogout();
        }
      }
    };

    initializeAuth();
  }, [user]);

  return <AuthContext.Provider value={{ user, login, register, logout, getSessions, revokeSession, getUser, getExpenses, createExpense }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
