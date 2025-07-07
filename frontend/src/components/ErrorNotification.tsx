'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

interface ErrorNotificationProps {
  error: string | null;
  onClear?: () => void;
}

export default function ErrorNotification({ error, onClear }: ErrorNotificationProps) {
  useEffect(() => {
    if (error) {
      // Déterminer le type d'erreur pour choisir le bon style de toast
      if (error.includes('Session expirée')) {
        toast.error('Session expirée', {
          description: 'Veuillez vous reconnecter pour continuer.',
          duration: 5000,
          action: {
            label: 'Se reconnecter',
            onClick: () => (window.location.href = '/auth/login'),
          },
        });
      } else if (error.includes('Erreur de connexion')) {
        toast.error('Erreur de connexion', {
          description: 'Vérifiez votre connexion internet et réessayez.',
          duration: 8000,
        });
      } else if (error.includes('Erreur serveur')) {
        toast.error('Erreur serveur', {
          description: 'Le serveur rencontre des difficultés. Veuillez réessayer plus tard.',
          duration: 8000,
        });
      } else {
        toast.error('Erreur', {
          description: error,
          duration: 5000,
        });
      }

      // Effacer l'erreur après affichage
      if (onClear) {
        onClear();
      }
    }
  }, [error, onClear]);

  return null; // Ce composant ne rend rien visuellement
}
