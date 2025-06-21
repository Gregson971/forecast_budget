'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function RegisterPage() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(email, password, first_name, last_name);
    } catch (error) {
      console.error("Erreur d'inscription:", error);
    } finally {
      setIsLoading(false);
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
            <div className='w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4'>
              <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' />
              </svg>
            </div>
            <h1 className='text-3xl font-bold text-white mb-2'>Créer un compte</h1>
            <p className='text-gray-400'>Rejoignez Forecast Budget dès aujourd'hui</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-2 gap-4'>
              <Input label='Prénom' type='text' placeholder='Votre prénom' value={first_name} onChange={(e) => setFirstName(e.target.value)} required />

              <Input label='Nom' type='text' placeholder='Votre nom' value={last_name} onChange={(e) => setLastName(e.target.value)} required />
            </div>

            <Input label='Email' type='email' placeholder='votre@email.com' value={email} onChange={(e) => setEmail(e.target.value)} required />

            <Input label='Mot de passe' type='password' placeholder='Votre mot de passe' value={password} onChange={(e) => setPassword(e.target.value)} required />

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? (
                <div className='flex items-center justify-center'>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
                  Création en cours...
                </div>
              ) : (
                'Créer mon compte'
              )}
            </Button>
          </form>

          <div className='mt-8 text-center'>
            <p className='text-gray-400'>
              Déjà un compte ?{' '}
              <Link href='/auth/login' className='text-indigo-400 hover:text-indigo-300 font-medium transition-colors'>
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
