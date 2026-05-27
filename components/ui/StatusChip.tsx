/**
 * StatusChip Component
 *
 * Small chip/badge for displaying status (used in notifications)
 */

'use client';

interface StatusChipProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function StatusChip({ label, variant = 'default', className = '' }: StatusChipProps) {
  const variantStyles = {
    default: 'border-border text-text-secondary',
    success: 'border-[#22c55e]/30 text-[#22c55e] bg-[#22c55e]/5',
    warning: 'border-[#f59e0b]/30 text-[#f59e0b] bg-[#f59e0b]/5',
    error: 'border-[#ef4444]/30 text-[#ef4444] bg-[#ef4444]/5',
    info: 'border-[#3b82f6]/30 text-[#3b82f6] bg-[#3b82f6]/5',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 border rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {label}
    </span>
  );
}
