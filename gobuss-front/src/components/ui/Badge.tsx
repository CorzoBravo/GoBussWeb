import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'neutral', 
  size = 'md',
  className = '',
  ...props 
}) => {
  
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-full";
  
  const variants = {
    success: "bg-success-100 text-success-700 border border-success-200",
    warning: "bg-warning-100 text-warning-800 border border-warning-200",
    danger: "bg-danger-100 text-danger-700 border border-danger-200",
    info: "bg-brand-100 text-brand-700 border border-brand-200",
    neutral: "bg-surface-100 text-surface-600 border border-surface-200"
  };

  const sizes = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1"
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};
