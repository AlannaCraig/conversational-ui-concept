/**
 * SwapLayoutButton Component
 *
 * Button to swap the large data and dialog positions
 * Only visible when large data view is active
 */

'use client';

import { motion } from 'framer-motion';
import { SwapHorizontalIcon } from '@/components/icons';

interface SwapLayoutButtonProps {
  onClick: () => void;
}

export function SwapLayoutButton({ onClick }: SwapLayoutButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="fixed left-[88px] top-6 z-50 w-10 h-10 flex items-center justify-center bg-background border border-border rounded-lg hover:bg-hover transition-colors shadow-sm"
      aria-label="Swap layout"
    >
      <SwapHorizontalIcon size={20} className="text-text-secondary" />
    </motion.button>
  );
}
