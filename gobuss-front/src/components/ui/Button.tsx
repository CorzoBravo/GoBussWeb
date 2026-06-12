import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', loading = false, icon, children, disabled, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "bg-brand-600 text-white hover:bg-brand-700 hover:shadow-md hover:shadow-brand-500/20 focus-visible:ring-brand-500 border border-transparent",
      secondary: "bg-white text-surface-700 hover:bg-surface-50 border border-surface-200 hover:border-surface-300 focus-visible:ring-surface-500 shadow-sm",
      ghost: "bg-transparent text-surface-600 hover:bg-surface-100 hover:text-surface-900 focus-visible:ring-surface-500",
      danger: "bg-danger-50 text-danger-600 hover:bg-danger-100 hover:text-danger-700 border border-transparent focus-visible:ring-danger-500"
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2 gap-2",
      lg: "text-base px-6 py-3 gap-2.5"
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <button 
        ref={ref}
        className={classes} 
        disabled={disabled || loading} 
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!loading && icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
