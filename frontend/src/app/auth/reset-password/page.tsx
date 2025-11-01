'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { requestPasswordResetService, verifyResetCodeService } from '@/services/auth';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await requestPasswordResetService(email);

      if (response.success) {
        toast.success(response.message || 'Code envoyé par SMS');
        setStep('verify');
      } else {
        setError(response.message || 'Erreur lors de l\'envoi du code');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      const errorMessage = err.response?.data?.detail || 'Erreur lors de l\'envoi du code';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const response = await verifyResetCodeService(code, newPassword);

      if (response.success) {
        toast.success(response.message || 'Mot de passe réinitialisé avec succès');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setError(response.message || 'Erreur lors de la réinitialisation');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      const errorMessage = err.response?.data?.detail || 'Erreur lors de la réinitialisation';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Éviter les erreurs d'hydratation
  if (!mounted) {
    return (
      <div className='min-h-screen flex items-center justify-center px-4'>
        <div className='w-full max-w-md'>
          <div className='glass-card p-8 rounded-lg elevation-3'>
            <div className='flex items-center justify-center'>
              <div className='w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin'></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='w-full max-w-md'>
        <div className='glass-card p-8 rounded-lg elevation-3 fade-in'>
          <div className='text-center mb-8'>
            <div className='w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4'>
              <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z'
                />
              </svg>
            </div>
            <h1 className='text-3xl font-bold text-white mb-2'>
              {step === 'request' ? 'Réinitialiser le mot de passe' : 'Vérifier le code'}
            </h1>
            <p className='text-muted-foreground'>
              {step === 'request'
                ? 'Entrez votre email pour recevoir un code par SMS'
                : 'Entrez le code reçu par SMS et votre nouveau mot de passe'}
            </p>
          </div>

          {step === 'request' ? (
            <form onSubmit={handleRequestCode} className='space-y-6'>
              <Input
                label='Email'
                type='email'
                placeholder='votre@email.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {error && (
                <div className='p-3 bg-destructive/10 border border-destructive/30 rounded elevation-1'>
                  <p className='text-sm text-destructive'>{error}</p>
                </div>
              )}

              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? (
                  <div className='flex items-center justify-center'>
                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
                    Envoi en cours...
                  </div>
                ) : (
                  'Envoyer le code'
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className='space-y-6'>
              <Input
                label='Code de vérification'
                type='text'
                placeholder='123456'
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                maxLength={6}
              />

              <Input
                label='Nouveau mot de passe'
                type='password'
                placeholder='Au moins 8 caractères'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <Input
                label='Confirmer le mot de passe'
                type='password'
                placeholder='Confirmez votre mot de passe'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {error && (
                <div className='p-3 bg-destructive/10 border border-destructive/30 rounded elevation-1'>
                  <p className='text-sm text-destructive'>{error}</p>
                </div>
              )}

              <div className='flex gap-3'>
                <Button
                  type='button'
                  variant='secondary'
                  className='flex-1'
                  onClick={() => {
                    setStep('request');
                    setCode('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setError(null);
                  }}
                  disabled={loading}
                >
                  Retour
                </Button>
                <Button type='submit' className='flex-1' disabled={loading}>
                  {loading ? (
                    <div className='flex items-center justify-center'>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
                      Vérification...
                    </div>
                  ) : (
                    'Réinitialiser'
                  )}
                </Button>
              </div>
            </form>
          )}

          <div className='mt-8 text-center'>
            <p className='text-muted-foreground'>
              Vous vous souvenez de votre mot de passe ?{' '}
              <Link href='/auth/login' className='text-primary hover:text-accent font-medium transition-colors'>
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
