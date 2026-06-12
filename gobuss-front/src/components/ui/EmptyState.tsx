import React from 'react';
import { Bus, FolderSearch, SearchX, Frown } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'search' | 'error';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  variant = 'default'
}) => {
  
  const renderIcon = () => {
    if (icon) return icon;
    
    switch (variant) {
      case 'search':
        return <SearchX className="w-16 h-16 text-surface-300" />;
      case 'error':
        return <Frown className="w-16 h-16 text-danger-300" />;
      default:
        return <Bus className="w-16 h-16 text-brand-300" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in bg-white rounded-3xl border border-surface-100 shadow-sm">
      <div className="mb-6 p-4 bg-surface-50 rounded-full">
        {renderIcon()}
      </div>
      <h3 className="text-xl font-bold text-surface-800 mb-2 font-display tracking-tight">
        {title}
      </h3>
      <p className="text-surface-500 max-w-md mb-8">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" icon={<FolderSearch className="w-4 h-4" />}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
