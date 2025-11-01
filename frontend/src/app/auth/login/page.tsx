'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(username, password);
      // La redirection et les toasts sont gérés dans le contexte AuthContext
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      setError(err.response?.data?.detail || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  // Éviter les erreurs d'hydratation causées par les extensions de navigateur
  if (!mounted) {
    return (
      <div className='min-h-screen flex items-center justify-center px-4'>
        <div className='w-full max-w-md'>
          <div className='glass-card p-8 rounded-lg elevation-3'>
            <div className='flex items-center justify-center'>
              <div className='w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin'></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='w-full max-w-md'>
        <div className='glass-card p-8 rounded-lg elevation-3 fade-in'>
          <div className='text-center mb-8'>
            <div className='w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4'>
              <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                />
              </svg>
            </div>
            <h1 className='text-3xl font-bold text-white mb-2'>Connexion</h1>
            <p className='text-muted-foreground'>Accédez à votre compte Forecast Budget</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <Input label='Email' type='email' placeholder='votre@email.com' value={username} onChange={(e) => setUsername(e.target.value)} required />

            <div>
              <Input label='Mot de passe' type='password' placeholder='Votre mot de passe' value={password} onChange={(e) => setPassword(e.target.value)} required />
              <div className='mt-2 text-right'>
                <Link href='/auth/reset-password' className='text-sm text-primary hover:text-accent transition-colors'>
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>

            {error && (
              <div className='p-3 bg-destructive/10 border border-destructive/30 rounded elevation-1'>
                <p className='text-sm text-destructive'>{error}</p>
              </div>
            )}

            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? (
                <div className='flex items-center justify-center'>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
                  Connexion en cours...
                </div>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          <div className='mt-8 text-center'>
            <p className='text-muted-foreground'>
              Pas encore de compte ?{' '}
              <Link href='/auth/register' className='text-primary hover:text-accent font-medium transition-colors'>
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
