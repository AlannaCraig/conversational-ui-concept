/**
 * LogoMark Icon Component
 *
 * A simple abstract logo mark inspired by the reference design.
 * Replace this with your actual SVG logo.
 */

import { IconProps } from '@/lib/svg-icon-loader';

export function LogoMark({ className = '', size = 48, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Abstract wave/sound pattern inspired by reference */}
      <g>
        <rect
          x="12"
          y="18"
          width="4"
          height="12"
          rx="2"
          fill={color || 'currentColor'}
        />
        <rect
          x="19"
          y="12"
          width="4"
          height="24"
          rx="2"
          fill={color || 'currentColor'}
        />
        <rect
          x="26"
          y="8"
          width="4"
          height="32"
          rx="2"
          fill={color || 'currentColor'}
        />
        <rect
          x="33"
          y="15"
          width="4"
          height="18"
          rx="2"
          fill={color || 'currentColor'}
        />
      </g>
    </svg>
  );
}
