'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import SessionItem from './SessionItem';

export default function SessionList() {
  const [sessions, setSessions] = useState<any[]>([]);
  const { getSessions, revokeSession } = useAuth();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('access_token'));
  }, []);

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    getSessions()
      .then(setSessions)
      .catch(() => toast.error('Impossible de récupérer les sessions'));
  }, [token]);

  const handleRevoke = async (id: string) => {
    try {
      await revokeSession(id);
      setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, revoked: true } : s)));
    } catch {
      toast.error('Erreur lors de la révocation');
    }
  };

  const currentRefresh = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;

  return (
    <div className='space-y-4'>
      {sessions.map((session) => (
        <SessionItem key={session.id} session={session} isCurrent={session.refresh_token === currentRefresh} onRevoke={() => handleRevoke(session.id)} />
      ))}
    </div>
  );
}
