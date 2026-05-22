/**
 * SwapHorizontalIcon Component
 * Horizontal swap/exchange icon
 */

import { IconProps } from '@/lib/svg-icon-loader';

export function SwapHorizontalIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
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
        d="M7 16L3 12M3 12L7 8M3 12H21M17 8L21 12M21 12L17 16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
