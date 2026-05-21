/**
 * Surface Component
 *
 * Basic container with background and optional border.
 * Used for panels, dialogs, and grouped content.
 */

import { ReactNode, HTMLAttributes } from 'react';

interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Surface({
  bordered = true,
  padding = 'md',
  children,
  className = '',
  ...props
}: SurfaceProps) {
  const baseStyles = 'bg-background rounded-lg';
  const borderStyles = bordered ? 'border border-border' : '';
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={`${baseStyles} ${borderStyles} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
