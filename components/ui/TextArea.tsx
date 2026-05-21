/**
 * TextArea Component
 *
 * Multi-line text input with auto-resize capability.
 * Styled to match the conversational UI aesthetic.
 */

import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-3
            bg-background border border-border rounded-lg
            text-text-primary placeholder-text-tertiary
            focus:outline-none focus:ring-2 focus:ring-accent-main focus:border-transparent
            transition-all duration-200
            resize-none
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
