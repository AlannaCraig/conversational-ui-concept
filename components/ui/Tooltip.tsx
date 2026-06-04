/**
 * Tooltip Component
 *
 * Tooltip with arrow pointing to the hovered element.
 * Supports top, bottom, left, right arrow positions.
 * Background: primary-dark (#050505)
 * Text: primary-contrast (#FAF8F2)
 */

import { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  gap?: number; // gap in pixels between element and tooltip
  disabled?: boolean;
}

export function Tooltip({ children, text, position = 'right', gap = 8, disabled = false }: TooltipProps) {
  // Position classes for the tooltip container
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2',
    bottom: 'top-full left-1/2 -translate-x-1/2',
    left: 'right-full top-1/2 -translate-y-1/2',
    right: 'left-full top-1/2 -translate-y-1/2',
  };

  // Arrow position and styling
  const arrowClasses = {
    top: 'left-1/2 -translate-x-1/2 top-full',
    bottom: 'left-1/2 -translate-x-1/2 bottom-full',
    left: 'top-1/2 -translate-y-1/2 left-full',
    right: 'top-1/2 -translate-y-1/2 right-full',
  };

  // Arrow border styles using CSS triangles
  const arrowBorderStyles = {
    top: 'border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px]',
    bottom: 'border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px]',
    left: 'border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px]',
    right: 'border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px]',
  };

  return (
    <div className="group relative inline-flex">
      {children}

      {/* Tooltip Container */}
      <div
        className={`
          absolute ${positionClasses[position]}
          opacity-0 ${disabled ? '' : 'group-hover:opacity-100'}
          pointer-events-none
          transition-opacity duration-200
          z-50
        `}
        style={{
          [position === 'right' ? 'marginLeft' :
           position === 'left' ? 'marginRight' :
           position === 'top' ? 'marginBottom' : 'marginTop']: `${gap}px`
        }}
      >
        {/* Tooltip Box */}
        <div
          className="bg-primary-dark text-primary-contrast text-xs font-medium px-3 py-2 rounded-md whitespace-nowrap shadow-lg relative"
          style={{ backgroundColor: 'var(--primary-dark)', color: 'var(--primary-contrast)' }}
        >
          {text}

          {/* Arrow */}
          <div
            className={`absolute w-0 h-0 ${arrowClasses[position]} ${arrowBorderStyles[position]}`}
            style={{
              borderColor: position === 'top' ? 'var(--primary-dark) transparent transparent transparent' :
                          position === 'bottom' ? 'transparent transparent var(--primary-dark) transparent' :
                          position === 'left' ? 'transparent transparent transparent var(--primary-dark)' :
                          'transparent var(--primary-dark) transparent transparent'
            }}
          />
        </div>
      </div>
    </div>
  );
}
