/**
 * IconButton Component
 *
 * Circular or rounded button designed specifically for icons.
 * Commonly used in input controls and toolbars.
 */

import { motion, HTMLMotionProps } from 'framer-motion';
import { IconProps } from '@/lib/svg-icon-loader';

interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  icon: React.FC<IconProps>;
  variant?: 'default' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  label: string; // for accessibility
}

export function IconButton({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  label,
  className = '',
  disabled = false,
  ...props
}: IconButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-main disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    default: 'bg-background-soft border border-border text-text-primary hover:bg-background-inactive',
    ghost: 'text-text-secondary hover:bg-hover hover:text-text-primary',
  };

  const sizes = {
    sm: { button: 'w-8 h-8', icon: 16 },
    md: { button: 'w-10 h-10', icon: 20 },
    lg: { button: 'w-12 h-12', icon: 24 },
  };

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${sizes[size].button} ${className}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      disabled={disabled}
      aria-label={label}
      {...props}
    >
      <Icon size={sizes[size].icon} />
    </motion.button>
  );
}
