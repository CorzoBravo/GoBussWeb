import React from 'react';
import { Bus, Loader2 } from 'lucide-react';

export interface LoadingProps {
  type?: 'bus' | 'spinner' | 'dots';
  text?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  type = 'spinner', 
  text = 'Cargando...',
  fullScreen = false
}) => {
  
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in p-8">
      {type === 'bus' && (
        <div className="relative">
          <Bus className="w-12 h-12 text-brand-500 animate-bounce" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-surface-200 rounded-full animate-pulse-subtle blur-[2px]"></div>
        </div>
      )}
      
      {type === 'spinner' && (
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      )}
      
      {type === 'dots' && (
        <div className="flex justify-center items-center space-x-2">
          <div className="w-3 h-3 bg-brand-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      )}
      
      {text && (
        <p className="text-surface-500 font-medium tracking-wide animate-pulse-subtle">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-surface-50/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
