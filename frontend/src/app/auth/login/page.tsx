'use client';

import { useState } from 'react';
import { useAuthService } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
  const { login, loginState } = useAuthService();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { access_token, refresh_token } = await login({ email: username, password });
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      toast.success('Connexion réussie', {
        description: "Vous allez être redirigé vers la page d'accueil.",
        duration: 5000,
      });

      router.push('/');
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  return (
    <div className='min-h-screen relative overflow-hidden flex items-center justify-center'>
      {/* Arrière-plan avec effet de particules */}
      <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900'></div>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]'></div>

      <div className='relative z-10 w-full max-w-md'>
        <div className='glass-card p-8 rounded-2xl shadow-2xl fade-in'>
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
            <p className='text-gray-400'>Accédez à votre compte Forecast Budget</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <Input label='Email' type='email' placeholder='votre@email.com' value={username} onChange={(e) => setUsername(e.target.value)} required />

            <Input label='Mot de passe' type='password' placeholder='Votre mot de passe' value={password} onChange={(e) => setPassword(e.target.value)} required />

            {loginState.error && (
              <div className='p-3 bg-red-500/20 border border-red-500/30 rounded-lg'>
                <p className='text-sm text-red-400'>{loginState.error}</p>
              </div>
            )}

            <Button type='submit' className='w-full' disabled={loginState.loading}>
              {loginState.loading ? (
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
            <p className='text-gray-400'>
              Pas encore de compte ?{' '}
              <Link href='/auth/register' className='text-indigo-400 hover:text-indigo-300 font-medium transition-colors'>
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
