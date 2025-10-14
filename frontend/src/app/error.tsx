'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log l'erreur en développement
    if (process.env.NODE_ENV === 'development') {
      console.error('Error boundary caught:', error);
    }
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='w-full max-w-2xl'>
        <div className='glass-card p-8 md:p-12 rounded-2xl elevation-3 fade-in'>
          {/* Icône d'erreur */}
          <div className='text-center mb-8'>
            <div className='w-24 h-24 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/20'>
              <svg
                className='w-12 h-12 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </div>

            <h1 className='text-3xl md:text-4xl font-bold text-white mb-3'>
              Une erreur est survenue
            </h1>
            <p className='text-gray-400 text-lg mb-6'>
              Désolé, quelque chose s'est mal passé. Nous avons enregistré l'erreur.
            </p>
          </div>

          {/* Détails de l'erreur (dev uniquement) */}
          {isDevelopment && (
            <div className='mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl'>
              <div className='flex items-start space-x-3'>
                <svg
                  className='w-5 h-5 text-red-400 mt-0.5 flex-shrink-0'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <div className='flex-1 min-w-0'>
                  <h3 className='text-sm font-semibold text-red-400 mb-2'>
                    Détails de l'erreur (mode développement)
                  </h3>
                  <p className='text-xs text-gray-300 font-mono break-words mb-2'>
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className='text-xs text-gray-400'>
                      <span className='font-semibold'>Digest:</span> {error.digest}
                    </p>
                  )}
                  {error.stack && (
                    <details className='mt-3'>
                      <summary className='text-xs text-gray-400 cursor-pointer hover:text-gray-300'>
                        Voir la stack trace
                      </summary>
                      <pre className='mt-2 text-xs text-gray-400 overflow-x-auto p-2 bg-black/30 rounded'>
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className='space-y-3'>
            <Button
              onClick={reset}
              className='w-full'
              size='lg'
            >
              <svg
                className='w-5 h-5 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                />
              </svg>
              Réessayer
            </Button>

            <Link href='/' className='block'>
              <Button variant='outline' className='w-full' size='lg'>
                <svg
                  className='w-5 h-5 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                  />
                </svg>
                Retour à l'accueil
              </Button>
            </Link>
          </div>

          {/* Conseils */}
          <div className='mt-8 pt-6 border-t border-border'>
            <h3 className='text-sm font-semibold text-white mb-3'>
              Que faire ?
            </h3>
            <ul className='space-y-2 text-sm text-gray-400'>
              <li className='flex items-start'>
                <svg
                  className='w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                Cliquez sur "Réessayer" pour recharger la page
              </li>
              <li className='flex items-start'>
                <svg
                  className='w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                Vérifiez votre connexion internet
              </li>
              <li className='flex items-start'>
                <svg
                  className='w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                Si le problème persiste, contactez le support
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className='mt-6 text-center'>
            <div className='flex justify-center space-x-4 text-sm'>
              <Link
                href='/about'
                className='text-primary hover:text-accent transition-colors'
              >
                À propos
              </Link>
              <span className='text-gray-600'>•</span>
              <Link
                href='/'
                className='text-primary hover:text-accent transition-colors'
              >
                Accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
