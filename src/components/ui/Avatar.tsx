import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: string;
}

export function Avatar({
  src,
  alt = '',
  size = 'md',
  className = '',
  fallback,
}: AvatarProps) {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const classes = `${sizeClasses[size]} rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden ${className}`;

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={classes}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  return (
    <div className={classes}>
      {fallback ? (
        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          {fallback}
        </span>
      ) : (
        <User className={`${iconSizeClasses[size]} text-gray-400`} />
      )}
    </div>
  );
}