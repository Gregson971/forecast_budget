type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

export default function Button({ children, variant = 'default', size = 'md', className, ...props }: ButtonProps) {
  const variantClasses = {
    default: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/25',
    secondary: 'bg-gray-700 text-white hover:bg-gray-600 shadow-lg hover:shadow-gray-500/25',
    destructive: 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 shadow-lg hover:shadow-red-500/25',
    outline: 'border border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 hover:text-white',
    ghost: 'text-gray-300 hover:text-white hover:bg-white/10',
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm rounded-lg',
    md: 'h-10 px-4 rounded-xl',
    lg: 'h-12 px-6 text-lg rounded-xl',
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none ${
        variantClasses[variant]
      } ${sizeClasses[size]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
