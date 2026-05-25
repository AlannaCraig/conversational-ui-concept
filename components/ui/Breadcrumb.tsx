/**
 * Breadcrumb Component
 *
 * Navigation breadcrumbs for large data view
 */

'use client';

import { ChevronDownIcon } from '@/components/icons';

interface BreadcrumbProps {
  items: string[];
  onNavigate: (index: number) => void;
  className?: string;
}

export function Breadcrumb({ items, onNavigate, className = '' }: BreadcrumbProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronDownIcon
              size={16}
              className="text-text-tertiary rotate-[-90deg]"
            />
          )}
          {index === items.length - 1 ? (
            // Current page - not clickable
            <span className="text-base font-semibold text-text-primary">
              {item}
            </span>
          ) : (
            // Previous pages - clickable
            <button
              onClick={() => onNavigate(index)}
              className="text-base font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              {item}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
