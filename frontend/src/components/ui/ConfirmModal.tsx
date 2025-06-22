'use client';

import { useEffect } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmer', cancelText = 'Annuler', variant = 'danger' }: ConfirmModalProps) {
  // Fermer la modal avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Empêcher le scroll du body
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Fermer la modal en cliquant sur l'arrière-plan
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: '⚠️',
      confirmButton: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
      iconBg: 'bg-red-500/10',
    },
    warning: {
      icon: '⚠️',
      confirmButton: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
      iconBg: 'bg-yellow-500/10',
    },
    info: {
      icon: 'ℹ️',
      confirmButton: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
      iconBg: 'bg-blue-500/10',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Overlay */}
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={handleBackdropClick} />

      {/* Modal */}
      <div className='relative w-full max-w-md glass-card p-6 rounded-2xl border border-white/10 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200'>
        {/* Icon */}
        <div className={`mx-auto w-16 h-16 ${styles.iconBg} rounded-full flex items-center justify-center text-2xl mb-4`}>{styles.icon}</div>

        {/* Title */}
        <h3 className='text-xl font-semibold text-white text-center mb-2'>{title}</h3>

        {/* Message */}
        <p className='text-gray-300 text-center mb-6 leading-relaxed'>{message}</p>

        {/* Buttons */}
        <div className='flex gap-3'>
          <button
            onClick={onClose}
            className='flex-1 px-4 py-2.5 text-gray-300 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 hover:border-gray-500/50 rounded-lg transition-all duration-200 font-medium'
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2.5 text-white ${styles.confirmButton} rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
