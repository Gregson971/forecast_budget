'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import EditProfileForm from '@/components/profile/EditProfileForm';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Link from 'next/link';
import { deleteUserService } from '@/services/auth';
import { handleError } from '@/lib/errorHandler';
import { toast } from 'sonner';

export default function AccountClientWrapper() {
  const router = useRouter();
  const { isLoading, logout } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
        return;
      }

      await deleteUserService(accessToken);

      toast.success('Votre compte a été supprimé avec succès');

      // Déconnecter l'utilisateur et rediriger vers la page d'accueil
      logout();
      router.push('/');
    } catch (error) {
      handleError(error, {
        customMessage: 'Impossible de supprimer votre compte. Veuillez réessayer.',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-16'>
        <div className='glass-card p-8 rounded-lg elevation-2'>
          <div className='flex items-center space-x-4'>
            <div className='w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin'></div>
            <span className='text-white text-lg'>Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      {/* Formulaire d'édition du profil */}
      <EditProfileForm />

      {/* Actions futures */}
      <div className='glass-card p-6 rounded-lg elevation-2 mb-6'>
        <h2 className='text-2xl font-semibold text-white mb-6 flex items-center'>
          <svg className='w-6 h-6 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
            />
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
          </svg>
          Actions
        </h2>

        <div className='space-y-3'>
          {/* Changer le mot de passe */}
          <Link
            href='/auth/reset-password'
            className='w-full flex items-center justify-between p-4 glass rounded-lg elevation-1 hover:elevation-2 transition-all hover:bg-white/5'
          >
            <div className='flex items-center space-x-3'>
              <svg className='w-5 h-5 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                />
              </svg>
              <div className='text-left'>
                <p className='font-medium text-white'>Changer le mot de passe</p>
                <p className='text-sm text-muted-foreground'>Réinitialiser votre mot de passe par SMS</p>
              </div>
            </div>
            <svg className='w-5 h-5 text-muted-foreground' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </Link>

          {/* Supprimer le compte */}
          <button
            onClick={() => setShowDeleteModal(true)}
            disabled={isDeleting}
            className='w-full flex items-center justify-between p-4 glass rounded-lg elevation-1 hover:elevation-2 transition-all hover:bg-red-500/5 border-2 border-transparent hover:border-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <div className='flex items-center space-x-3'>
              <svg className='w-5 h-5 text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                />
              </svg>
              <div className='text-left'>
                <p className='font-medium text-red-400'>Supprimer le compte</p>
                <p className='text-sm text-muted-foreground'>
                  {isDeleting ? 'Suppression en cours...' : 'Suppression définitive de toutes vos données'}
                </p>
              </div>
            </div>
            {isDeleting ? (
              <div className='w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin'></div>
            ) : (
              <svg className='w-5 h-5 text-muted-foreground' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Lien vers Sessions */}
      <div className='glass-card p-6 rounded-lg elevation-2'>
        <h2 className='text-2xl font-semibold text-white mb-4 flex items-center'>
          <svg className='w-6 h-6 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
          Sécurité
        </h2>
        <Link
          href='/settings/sessions'
          className='flex items-center justify-between p-4 glass rounded-lg elevation-1 hover:elevation-2 transition-all hover:bg-white/5'
        >
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center'>
              <svg className='w-5 h-5 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>
            <div className='text-left'>
              <p className='font-medium text-white'>Sessions actives</p>
              <p className='text-sm text-muted-foreground'>Gérez vos sessions de connexion</p>
            </div>
          </div>
          <svg className='w-5 h-5 text-muted-foreground' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </Link>
      </div>

      {/* Modale de confirmation de suppression */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title='Supprimer votre compte ?'
        message='Cette action est irréversible. Toutes vos données seront définitivement supprimées (dépenses, revenus, prévisions, sessions). Êtes-vous absolument sûr de vouloir continuer ?'
        confirmText='Oui, supprimer mon compte'
        cancelText='Annuler'
        variant='danger'
      />
    </ProtectedRoute>
  );
}
