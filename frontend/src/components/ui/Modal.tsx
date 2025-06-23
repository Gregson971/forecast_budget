'use client';

import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Overlay */}
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={onClose} />

      {/* Modal */}
      <div className={`relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto glass-card rounded-2xl border border-white/10`}>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-white/10'>
          <h2 className='text-xl font-bold text-white'>{title}</h2>
          <button onClick={onClose} className='p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors' title='Fermer'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className='p-6'>{children}</div>
      </div>
    </div>
  );
}
