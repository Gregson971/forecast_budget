'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type UserDropdownProps = {
  user: { first_name: string; last_name: string; email: string };
  logout: () => void;
};

export default function UserDropdown({ user, logout }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className='relative' ref={dropdownRef}>
      {/* Bouton utilisateur */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300'
        aria-expanded={isOpen}
        aria-haspopup='true'
      >
        <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
          <span className='text-sm font-medium text-white'>
            {user.first_name?.charAt(0)}
            {user.last_name?.charAt(0)}
          </span>
        </div>
        <span className='text-gray-300 font-medium'>
          {user.first_name} {user.last_name}
        </span>
        {/* Icône chevron */}
        <svg
          className={`w-4 h-4 text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className='absolute right-0 mt-2 w-64 glass-card rounded-lg elevation-3 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200'>
          {/* En-tête utilisateur */}
          <div className='px-4 py-3 border-b border-white/10'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
                <span className='text-base font-medium text-white'>
                  {user.first_name?.charAt(0)}
                  {user.last_name?.charAt(0)}
                </span>
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-white truncate'>
                  {user.first_name} {user.last_name}
                </p>
                <p className='text-xs text-muted-foreground truncate'>{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className='py-2'>
            {/* Paramètres du compte */}
            <Link
              href='/settings/account'
              onClick={() => setIsOpen(false)}
              className='flex items-center space-x-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
              <span className='text-sm font-medium'>Paramètres du compte</span>
            </Link>

            {/* Sessions */}
            <Link
              href='/settings/sessions'
              onClick={() => setIsOpen(false)}
              className='flex items-center space-x-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
              <span className='text-sm font-medium'>Sessions actives</span>
            </Link>
          </div>

          {/* Déconnexion */}
          <div className='border-t border-white/10 pt-2'>
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className='flex items-center space-x-3 w-full px-4 py-2.5 hover:bg-white/10 transition-colors text-destructive hover:text-red-400'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                />
              </svg>
              <span className='text-sm font-medium'>Déconnexion</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
