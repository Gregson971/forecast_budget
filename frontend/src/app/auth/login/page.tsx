'use client';

import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-primary text-white'>
      <form onSubmit={handleSubmit} className='bg-white/10 p-8 rounded-xl shadow-xl space-y-4 w-96'>
        <h1 className='text-2xl font-bold text-center'>Se connecter</h1>
        <input className='w-full p-2 rounded bg-white text-black' placeholder='Email' value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className='w-full p-2 rounded bg-white text-black' placeholder='Mot de passe' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className='w-full bg-accent text-primary font-bold py-2 rounded'>Connexion</button>
      </form>
    </div>
  );
}
