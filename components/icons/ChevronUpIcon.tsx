/**
 * ChevronUpIcon Component
 * Chevron up icon for expand actions
 */

import { IconProps } from '@/lib/svg-icon-loader';

export function ChevronUpIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 15C6 15 10.4188 9 12 9C13.5811 9 18 15 18 15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
