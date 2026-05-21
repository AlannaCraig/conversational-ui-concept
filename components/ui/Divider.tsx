/**
 * Divider Component
 *
 * Horizontal or vertical divider for content separation.
 * Uses token-based border colors.
 */

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Divider({ orientation = 'horizontal', className = '' }: DividerProps) {
  const baseStyles = 'bg-border';
  const orientationStyles = orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full';

  return <div className={`${baseStyles} ${orientationStyles} ${className}`} role="separator" />;
}
