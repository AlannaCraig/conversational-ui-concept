/**
 * Card Component
 *
 * Versatile card container with optional hover effects and borders.
 * Used for prompt suggestions and other content grouping.
 */

import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  hover?: boolean;
  children: ReactNode;
}

export function Card({ hover = false, children, className = '', ...props }: CardProps) {
  const baseStyles = 'bg-background border border-border rounded-lg transition-all duration-200';
  const hoverStyles = hover ? 'hover:border-border hover:shadow-md cursor-pointer' : '';

  return (
    <motion.div
      className={`${baseStyles} ${hoverStyles} ${className}`}
      whileHover={hover ? { y: -2 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
}
