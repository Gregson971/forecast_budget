'use client';

import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function RegisterPage() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(email, password, first_name, last_name);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-primary text-white'>
      <form onSubmit={handleSubmit} className='bg-white/10 p-8 rounded-xl shadow-xl space-y-4 w-96'>
        <h1 className='text-2xl font-bold text-center'>S'inscrire</h1>
        <input type='text' placeholder='Prénom' className='w-full p-2 rounded bg-white text-black' value={last_name} onChange={(e) => setLastName(e.target.value)} />
        <input type='text' placeholder='Nom' className='w-full p-2 rounded bg-white text-black' value={first_name} onChange={(e) => setFirstName(e.target.value)} />
        <input className='w-full p-2 rounded bg-white text-black' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className='w-full p-2 rounded bg-white text-black' placeholder='Mot de passe' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className='w-full bg-accent text-primary font-bold py-2 rounded'>S'inscrire</button>
      </form>
    </div>
  );
}
