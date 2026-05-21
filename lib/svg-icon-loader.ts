/**
 * SVG Icon Loader Utility
 *
 * This utility demonstrates how to dynamically load SVG files from the /public/svg directory
 * and convert them into reusable React components.
 *
 * USAGE:
 * 1. Place SVG files in /public/svg (e.g., /public/svg/logo.svg)
 * 2. Create a component in /components/icons (see example below)
 * 3. Import and use anywhere in your app
 *
 * EXAMPLE:
 *
 * // components/icons/Logo.tsx
 * export function Logo({ className }: { className?: string }) {
 *   return (
 *     <svg className={className} viewBox="0 0 24 24" fill="none">
 *       <path d="..." fill="currentColor" />
 *     </svg>
 *   );
 * }
 *
 * BEST PRACTICES:
 * - Keep SVGs optimized (use SVGO or similar)
 * - Use currentColor for fills/strokes to inherit text color
 * - Define viewBox to maintain aspect ratio
 * - Export as named components for better tree-shaking
 */

export interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Base icon component props
 * All custom icon components should accept at minimum these props
 */
export type IconComponent = React.FC<IconProps>;
