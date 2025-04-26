'use client';
import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import axios from '@/lib/axios';

type User = { email: string };
type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, first_name: string, last_name: string) => Promise<void>;
  logout: () => void;
  getSessions: () => Promise<any[]>;
  revokeSession: (sessionId: string) => Promise<void>;
};
type JWTPayload = {
  exp: number; // timestamp en secondes
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const res = await axios.post('/auth/login', formData);
    const { access_token, refresh_token } = res.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    setUser({ email });
    router.push('/');
    toast.success('Connexion réussie', {
      description: "Vous allez être redirigé vers la page d'accueil.",
      duration: 5000,
    });
  };

  const register = async (email: string, password: string, first_name: string, last_name: string) => {
    await axios.post('/auth/register', { email, password, first_name, last_name });
    await login(email, password);
    toast.success('Inscription réussie', {
      description: "Vous allez être redirigé vers la page d'accueil.",
      duration: 5000,
    });
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
      const res = await axios.post('/auth/refresh', { refresh_token });
      const { access_token } = res.data;
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

  const getSessions = async () => {
    const res = await axios.get('/auth/me/sessions', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (res.status !== 200) {
      toast.error('Erreur lors de la récupération des sessions');
      return [];
    }

    const sessions = res.data;

    return sessions;
  };

  const revokeSession = async (sessionId: string) => {
    const res = await axios.delete(`/auth/me/sessions/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (res.status !== 200) {
      toast.error('Erreur lors de la révocation de la session');
      return;
    }

    toast.success('Session révoquée avec succès');
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

  return <AuthContext.Provider value={{ user, login, register, logout, getSessions, revokeSession }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
