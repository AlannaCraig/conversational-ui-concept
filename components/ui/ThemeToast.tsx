/**
 * ThemeToast Component
 *
 * Simple toast notification for theme changes
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface ThemeToastProps {
  themeName: string;
  isVisible: boolean;
  onClose: () => void;
}

export function ThemeToast({ themeName, isVisible, onClose }: ThemeToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999]"
        >
          <div className="bg-background border border-border rounded-lg px-4 py-3 shadow-lg">
            <p className="text-sm text-text-primary">
              Theme: <span className="font-medium">{themeName}</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
