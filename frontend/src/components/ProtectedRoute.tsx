'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, user, router, isLoading]);

  // Afficher un loader pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='glass-card p-8 rounded-2xl'>
          <div className='flex items-center space-x-4'>
            <div className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin'></div>
            <span className='text-white text-lg'>Vérification de l'authentification...</span>
          </div>
        </div>
      </div>
    );
  }

  // Si pas authentifié et pas en cours de chargement, ne rien afficher (redirection en cours)
  if (!isAuthenticated && !user) {
    return null;
  }

  return <>{children}</>;
}
