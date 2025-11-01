'use client';
import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import { loginService, registerService, refreshTokenService, getUserService, updateUserService } from '@/services/auth';
import { handleError, handleSilentError } from '@/lib/errorHandler';

type User = { email: string; first_name: string; last_name: string; phone_number?: string };
type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, first_name: string, last_name: string) => Promise<void>;
  logout: () => void;
  getUser: () => Promise<User | null>;
  updateUser: (data: { first_name?: string; last_name?: string; email?: string; phone_number?: string }) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
};

type JWTPayload = {
  exp: number; // timestamp en secondes
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
    } catch (error: any) {
      let errorMessage = 'Erreur lors de la connexion';

      if (error.response?.status === 422) {
        errorMessage = error.response?.data?.detail || 'Identifiants invalides';
      } else if (error.response?.status === 401) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (error.response?.status === 404) {
        errorMessage = 'Service non disponible';
      } else if (!error.response) {
        errorMessage = 'Impossible de se connecter au serveur';
      }

      handleError(error, { customMessage: errorMessage });
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
    } catch (error: any) {
      let errorMessage = "Erreur lors de l'inscription";

      // Extraire le message d'erreur détaillé du backend
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.detail || "Données d'inscription invalides";
      } else if (error.response?.status === 404) {
        errorMessage = 'Service non disponible';
      } else if (!error.response) {
        errorMessage = 'Impossible de se connecter au serveur';
      }

      handleError(error, { customMessage: errorMessage });
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
    } catch (error) {
      handleSilentError(error);
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

  const updateUser = async (data: { first_name?: string; last_name?: string; email?: string; phone_number?: string }) => {
    const access_token = localStorage.getItem('access_token');
    if (!access_token) {
      toast.error('Vous devez être connecté pour modifier votre profil');
      return;
    }

    try {
      const updatedUser = await updateUserService(data, access_token);
      setUser(updatedUser);
      toast.success('Profil mis à jour avec succès', {
        description: 'Vos informations ont été modifiées.',
        duration: 3000,
      });
    } catch (error: any) {
      let errorMessage = 'Erreur lors de la mise à jour du profil';

      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.detail || 'Données invalides';
      }

      handleError(error, { customMessage: errorMessage });
      throw error;
    }
  };

  // Gestion automatique du rafraîchissement des tokens
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

  // Initialisation de l'authentification au chargement
  useEffect(() => {
    const initializeAuth = async () => {
      const access_token = localStorage.getItem('access_token');
      if (access_token && !user) {
        try {
          const userData = await getUserService(access_token);
          setUser(userData);
        } catch (error) {
          handleSilentError(error);
          // Si le token est invalide, on déconnecte l'utilisateur
          forceLogout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        getUser,
        updateUser,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
