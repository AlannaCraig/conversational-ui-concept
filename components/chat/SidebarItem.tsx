'use client';

/**
 * SidebarItem Component
 *
 * Individual navigation item for sidebar.
 * Supports active state, hover effects, and tooltips.
 */

import { motion } from 'framer-motion';
import { IconProps } from '@/lib/svg-icon-loader';
import { Tooltip } from '@/components/ui';

interface SidebarItemProps {
  icon: React.FC<IconProps>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ icon: Icon, label, active = false, onClick }: SidebarItemProps) {
  return (
    <Tooltip text={label} position="right" gap={8}>
      <motion.button
        onClick={onClick}
        className={`
          w-10 h-10 rounded-lg flex items-center justify-center
          transition-colors duration-200 cursor-pointer
          ${active
            ? 'bg-background-soft text-text-primary border border-border'
            : 'text-text-secondary hover:bg-hover hover:text-text-primary'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={label}
      >
        <Icon size={20} />
      </motion.button>
    </Tooltip>
  );
}
