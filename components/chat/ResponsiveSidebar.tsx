'use client';

/**
 * ResponsiveSidebar Component
 *
 * Adaptive sidebar that shows as:
 * - Fixed sidebar on desktop
 * - Collapsible drawer on tablet/mobile
 */

import { useState } from 'react';
import { MenuIcon, CloseIcon } from '@/components/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks';
import { Sidebar } from './Sidebar';
import { IconButton } from '@/components/ui';

export function ResponsiveSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  // Desktop: always show fixed sidebar
  if (!isMobile) {
    return <Sidebar />;
  }

  // Mobile: show toggle button and drawer
  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="fixed top-4 left-4 z-50">
        <IconButton
          icon={MenuIcon}
          label="Open menu"
          size="md"
          variant="default"
          onClick={() => setIsOpen(true)}
        />
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-screen z-50"
            >
              <Sidebar />

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-[-48px] w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Close menu"
              >
                <CloseIcon size={20} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
