'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { handleSilentError } from '@/lib/errorHandler';

export default function EditProfileForm() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
  });

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Envoyer uniquement les champs modifiés
      const changes: { first_name?: string; last_name?: string; email?: string } = {};

      if (formData.first_name !== user?.first_name) {
        changes.first_name = formData.first_name;
      }
      if (formData.last_name !== user?.last_name) {
        changes.last_name = formData.last_name;
      }
      if (formData.email !== user?.email) {
        changes.email = formData.email;
      }

      if (Object.keys(changes).length === 0) {
        setIsEditing(false);
        return;
      }

      await updateUser(changes);
      setIsEditing(false);
    } catch (error) {
      handleSilentError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='glass-card p-6 rounded-lg elevation-2 mb-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-semibold text-white flex items-center'>
          <svg className='w-6 h-6 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
            />
          </svg>
          Informations personnelles
        </h2>

        {!isEditing && (
          <button
            onClick={handleEdit}
            className='flex items-center space-x-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-all'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
              />
            </svg>
            <span>Modifier</span>
          </button>
        )}
      </div>

      {!isEditing ? (
        // Mode affichage
        <div className='space-y-4'>
          {/* Avatar */}
          <div className='flex items-center space-x-4 pb-6 border-b border-white/10'>
            <div className='w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
              <span className='text-3xl font-medium text-white'>
                {user?.first_name?.charAt(0)}
                {user?.last_name?.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className='text-xl font-semibold text-white'>
                {user?.first_name} {user?.last_name}
              </h3>
              <p className='text-muted-foreground'>{user?.email}</p>
            </div>
          </div>

          {/* Détails */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-4'>
            {/* Prénom */}
            <div>
              <label className='block text-sm font-medium text-muted-foreground mb-2'>Prénom</label>
              <div className='glass p-3 rounded-lg elevation-1'>
                <p className='text-white'>{user?.first_name}</p>
              </div>
            </div>

            {/* Nom */}
            <div>
              <label className='block text-sm font-medium text-muted-foreground mb-2'>Nom</label>
              <div className='glass p-3 rounded-lg elevation-1'>
                <p className='text-white'>{user?.last_name}</p>
              </div>
            </div>

            {/* Email */}
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-muted-foreground mb-2'>Email</label>
              <div className='glass p-3 rounded-lg elevation-1'>
                <p className='text-white'>{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Mode édition
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Input
              label='Prénom'
              type='text'
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              placeholder='Votre prénom'
              required
            />

            <Input
              label='Nom'
              type='text'
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              placeholder='Votre nom'
              required
            />
          </div>

          <Input
            label='Email'
            type='email'
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder='votre@email.com'
            required
          />

          <div className='flex gap-3 justify-end'>
            <Button type='button' variant='outline' onClick={handleCancel} disabled={isLoading}>
              Annuler
            </Button>

            <Button type='submit' disabled={isLoading}>
              {isLoading ? (
                <div className='flex items-center'>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
                  Enregistrement...
                </div>
              ) : (
                <div className='flex items-center'>
                  <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                  Enregistrer
                </div>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
