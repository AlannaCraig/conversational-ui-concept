/**
 * InDialogForm Component
 *
 * Forms displayed inline in the conversation dialog.
 * Appears as an adaptive card within the conversation thread.
 *
 * USAGE RULES:
 * - REQUIRED when user is in conversational dialog view
 * - OPTIONAL when user is viewing large data return (can also use PopOutForm)
 *
 * COLORS:
 * - Border, icons, breaker: accent1-main
 * - Background: accent1-contrast
 * - Text: text-primary
 */

'use client';

import { ReactNode } from 'react';

interface InDialogFormProps {
  /** Form title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Form fields/content */
  children: ReactNode;
  /** Optional form ID for tracking */
  formId?: string;
  /** Submit button text */
  submitText?: string;
  /** Cancel button text (optional) */
  cancelText?: string;
  /** Handler for form submission */
  onSubmit?: (formData: FormData) => void;
  /** Handler for cancel action */
  onCancel?: () => void;
  /** Optional header action buttons */
  headerActions?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function InDialogForm({
  title,
  subtitle,
  children,
  formId,
  submitText = 'Submit',
  cancelText,
  onSubmit,
  onCancel,
  headerActions,
  className = '',
}: InDialogFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      const formData = new FormData(e.currentTarget);
      onSubmit(formData);
    }
  };

  return (
    <div className={`border border-accent1-main bg-accent1-contrast rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
          {subtitle && (
            <p className="text-xs text-text-secondary mt-1">{subtitle}</p>
          )}
        </div>
        {headerActions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {headerActions}
          </div>
        )}
      </div>

      {/* Breaker Line */}
      <div className="border-t border-accent1-main" />

      {/* Form */}
      <form id={formId} onSubmit={handleSubmit}>
        {/* Form Fields */}
        <div className="p-4">
          <div className="space-y-4">
            {children}
          </div>
        </div>

        {/* Breaker Line */}
        <div className="border-t border-accent1-main" />

        {/* Footer with Submit Button */}
        <div className="p-4 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-accent1-main text-accent1-contrast text-sm font-medium rounded hover:bg-accent1-dark transition-colors"
          >
            {submitText}
          </button>
        </div>
      </form>
    </div>
  );
}
