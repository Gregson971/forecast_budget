import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className='space-y-2'>
      {label && <label className='text-sm font-medium text-gray-300 block'>{label}</label>}
      <input
        className={`
          w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl
          text-white placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          hover:border-gray-500 transition-all duration-300
          backdrop-blur-sm
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className || ''}
        `}
        {...props}
      />
      {error && <p className='text-sm text-red-400'>{error}</p>}
    </div>
  );
}
