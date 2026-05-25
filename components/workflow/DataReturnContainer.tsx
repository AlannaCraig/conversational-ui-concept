/**
 * DataReturnContainer Component
 *
 * Unified wrapper for both small and large data returns in workflows.
 * Provides consistent spacing, animation, and optional header/footer sections.
 * Supports workflow context like step numbers, titles, and metadata.
 */

'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface DataReturnContainerProps {
  /** Main content - SmallDataReturn or LargeDataReturn */
  children: ReactNode;
  /** Optional workflow step number (e.g., "Step 1 of 3") */
  stepLabel?: string;
  /** Optional title for this data return */
  title?: string;
  /** Optional description or context */
  description?: string;
  /** Optional footer content (actions, pagination, etc.) */
  footer?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Disable animation (useful for nested containers) */
  disableAnimation?: boolean;
}

export function DataReturnContainer({
  children,
  stepLabel,
  title,
  description,
  footer,
  className = '',
  disableAnimation = false,
}: DataReturnContainerProps) {
  const content = (
    <div className={`${className}`}>
      {/* Header Section - Step label, title, description */}
      {(stepLabel || title || description) && (
        <div className="mb-4 space-y-2">
          {stepLabel && (
            <div className="text-xs text-text-tertiary font-medium uppercase tracking-wide">
              {stepLabel}
            </div>
          )}
          {title && (
            <div className="text-base text-text-primary font-medium">
              {title}
            </div>
          )}
          {description && (
            <div className="text-sm text-text-secondary leading-relaxed">
              {description}
            </div>
          )}
        </div>
      )}

      {/* Main Content - Data cards */}
      <div>{children}</div>

      {/* Footer Section - Actions, pagination, metadata */}
      {footer && (
        <div className="mt-4">
          {footer}
        </div>
      )}
    </div>
  );

  if (disableAnimation) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {content}
    </motion.div>
  );
}
