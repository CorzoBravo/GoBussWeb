import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', hoverable = false, padding = 'md', children, ...props }, ref) => {
    
    const baseStyles = "bg-white rounded-2xl border border-surface-100 shadow-sm transition-all duration-300";
    
    const hoverStyles = hoverable 
      ? "hover:shadow-md hover:border-surface-200 hover:-translate-y-1" 
      : "";

    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8"
    };

    const classes = `${baseStyles} ${hoverStyles} ${paddings[padding]} ${className}`;

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
