/**
 * PopOutForm Component
 *
 * Non-modal floating dialog for forms that need more space or context.
 * Can be minimized to a "docked" state at the bottom-right.
 * Positioned inline with bottom-right corner when opened.
 *
 * USAGE RULES:
 * - ONLY available when user is viewing large data return
 * - NOT available in conversational dialog view (use InDialogForm instead)
 * - Choose this when form needs to reference the large data return simultaneously
 *
 * COLORS:
 * - Border, icons, breaker: accent1-main
 * - Background: accent1-contrast
 * - Text: text-primary
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@/components/icons';

interface PopOutFormProps {
  /** Form ID (e.g., "UID-1234") */
  formId: string;
  /** Form title */
  title: string;
  /** Timestamp or subtitle */
  subtitle?: string;
  /** Form content/fields */
  children: ReactNode;
  /** Whether dialog is open */
  isOpen: boolean;
  /** Handler to close dialog */
  onClose: () => void;
  /** Handler for form submission */
  onSubmit?: (formData: FormData) => void;
  /** Submit button text */
  submitText?: string;
  /** Initial position (bottom-right corner coordinates) */
  initialPosition?: { x: number; y: number };
  /** Reference to the large data container for positioning */
  containerRef?: React.RefObject<HTMLDivElement>;
}

export function PopOutForm({
  formId,
  title,
  subtitle,
  children,
  isOpen,
  onClose,
  onSubmit,
  submitText = 'Submit',
  initialPosition = { x: 0, y: 0 },
  containerRef,
}: PopOutFormProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ bottom: 24, right: 32 });

  // Calculate position based on container ref
  useEffect(() => {
    if (containerRef?.current && isOpen) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        bottom: window.innerHeight - rect.bottom + 24,
        right: window.innerWidth - rect.right + 24,
      });
    }
  }, [containerRef, isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      const formData = new FormData(e.currentTarget);
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {!isMinimized ? (
        // Full Dialog (Open State)
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: initialPosition.x, y: initialPosition.y }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed w-[720px] bg-accent1-contrast border border-accent1-main rounded-lg shadow-xl z-50 overflow-hidden"
          style={{
            maxHeight: 'calc(100vh - 200px)',
            bottom: `${position.bottom}px`,
            right: `${position.right}px`,
          }}
        >
          {/* Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
              {subtitle && (
                <p className="text-xs text-text-secondary mt-1">{subtitle}</p>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Minimize Button */}
              <button
                onClick={() => setIsMinimized(true)}
                className="w-8 h-8 flex items-center justify-center hover:bg-hover transition-colors rounded cursor-pointer"
                aria-label="Minimize"
              >
                <ChevronDownIcon size={20} className="text-accent1-main" />
              </button>

              {/* More Options Button */}
              <button
                className="w-8 h-8 flex items-center justify-center hover:bg-hover transition-colors rounded cursor-pointer"
                aria-label="More options"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-accent1-main">
                  <circle cx="10" cy="5" r="1.5" fill="currentColor"/>
                  <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
                  <circle cx="10" cy="15" r="1.5" fill="currentColor"/>
                </svg>
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center hover:bg-hover transition-colors rounded cursor-pointer"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-accent1-main">
                  <path d="M5 5L15 15M5 15L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex flex-col" style={{ maxHeight: 'calc(100vh - 320px)' }}>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {children}
              </div>
            </div>

            {/* Footer with Actions */}
            <div className="p-4 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-accent1-main text-accent1-contrast text-sm font-medium rounded hover:bg-accent1-dark transition-colors cursor-pointer"
              >
                {submitText}
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        // Docked State (Minimized)
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bg-accent1-dark text-accent1-contrast rounded-lg shadow-xl z-50 cursor-pointer"
          style={{
            bottom: `${position.bottom}px`,
            right: `${position.right}px`,
          }}
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            {/* Icon */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
              <rect x="3" y="5" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <line x1="3" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="1.5"/>
            </svg>

            {/* Text */}
            <span className="text-sm font-medium">Form in progress</span>

            {/* Expand Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
              }}
              className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
              aria-label="Expand"
            >
              <ChevronUpIcon size={16} className="text-accent1-contrast" />
            </button>

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-accent1-contrast">
                <path d="M4 4L12 12M4 12L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
