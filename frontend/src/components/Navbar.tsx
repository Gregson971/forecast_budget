'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

type User = { email: string; first_name: string; last_name: string };

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className='glass sticky top-0 z-50 backdrop-blur-xl border-b border-white/10'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex justify-between h-16'>
          <div className='flex items-center'>
            <Link href='/' className='flex items-center space-x-2 group'>
              <div className='w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform'>
                <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                  />
                </svg>
              </div>
              <span className='text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>Forecast Budget</span>
            </Link>
          </div>

          <div className='flex items-center space-x-6'>
            {user ? (
              <div className='flex items-center space-x-4'>
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
                    <span className='text-sm font-medium text-white'>
                      {user.first_name?.charAt(0)}
                      {user.last_name?.charAt(0)}
                    </span>
                  </div>
                  <span className='text-gray-300 font-medium'>
                    {user.first_name} {user.last_name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className='px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25'
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className='flex items-center space-x-4'>
                <Link href='/auth/login' className='text-gray-300 hover:text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 font-medium'>
                  Connexion
                </Link>
                <Link
                  href='/auth/register'
                  className='px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25'
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
