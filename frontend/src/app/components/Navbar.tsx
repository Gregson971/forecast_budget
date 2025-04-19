'use client';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className='bg-primary text-white shadow-lg'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <div className='flex-shrink-0 flex items-center'>
              <Link href='/' className='text-xl font-bold'>
                Forecast Budget !!
              </Link>
            </div>
          </div>
          <div className='flex items-center'>
            {user ? (
              <div className='flex items-center space-x-4'>
                <span>Bonjour, {user.email}</span>
                <button onClick={logout} className='bg-accent text-primary font-bold px-4 py-2 rounded-md transition-colors'>
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className='flex items-center space-x-4'>
                <Link href='/auth/login' className='hover:text-accent px-3 py-2 rounded-md'>
                  Connexion
                </Link>
                <Link href='/auth/register' className='bg-accent text-primary font-bold px-4 py-2 rounded-md transition-colors'>
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
