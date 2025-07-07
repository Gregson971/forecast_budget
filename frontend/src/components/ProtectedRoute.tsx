'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !user) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, user, router]);

  // Afficher un loader pendant la vérification de l'authentification
  if (!isAuthenticated && !user) {
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

  return <>{children}</>;
}
