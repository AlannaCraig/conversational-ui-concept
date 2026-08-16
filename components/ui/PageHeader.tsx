'use client';

import { type ReactNode } from 'react';

interface PageHeaderProps {
  title: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, actions, className = 'px-6 pt-6 pb-6' }: PageHeaderProps) {
  return (
    <div className={`flex-shrink-0 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        {typeof title === 'string' ? (
          <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
        ) : title}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="border-t border-border" />
    </div>
  );
}
