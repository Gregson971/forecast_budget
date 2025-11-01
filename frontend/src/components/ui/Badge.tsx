type BadgeProps = {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export default function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const variantClasses = {
    default: 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-200',
    success: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
    warning: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white',
    error: 'bg-gradient-to-r from-red-600 to-pink-600 text-white',
    info: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
    outline: 'border border-gray-400 text-gray-400 bg-transparent',
    destructive: 'bg-gradient-to-r from-red-600 to-pink-600 text-white',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs rounded-lg',
    md: 'px-3 py-1.5 text-sm rounded-xl',
    lg: 'px-4 py-2 text-base rounded-xl',
  };

  return (
    <span className={`inline-flex items-center font-medium transition-all duration-300 shadow-sm ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`}>
      {children}
    </span>
  );
}
