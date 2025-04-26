import { cn } from '@/lib/utils';

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'outline' | 'destructive';
};

export default function Badge({ children, variant = 'default', ...props }: BadgeProps) {
  const variantClasses = {
    default: 'bg-primary text-primary-foreground',
    outline: 'border border-input bg-background text-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
  };

  return (
    <div {...props} className={cn(variantClasses[variant], props.className)}>
      {children}
    </div>
  );
}
