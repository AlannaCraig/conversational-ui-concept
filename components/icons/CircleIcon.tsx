/**
 * CircleIcon Component
 * For unread indicator
 */

import { IconProps } from '@/lib/svg-icon-loader';

export function CircleIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        fill={color}
      />
    </svg>
  );
}
