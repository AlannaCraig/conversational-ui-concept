/**
 * NewChatButton Component
 *
 * Floating button in top-right corner that starts a new chat.
 * Only visible in conversation view. Saves current chat to history.
 */

'use client';

import { motion } from 'framer-motion';
import { NewChatIcon } from '@/components/icons';

interface NewChatButtonProps {
  onClick: () => void;
}

export function NewChatButton({ onClick }: NewChatButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-10 right-10 z-50"
    >
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2 bg-transparent border border-border text-primary-main rounded-lg hover:bg-[rgba(72,65,53,0.08)] transition-colors duration-200"
        aria-label="Start new chat"
      >
        <NewChatIcon size={20} />
        <span className="text-sm font-medium">New chat</span>
      </button>
    </motion.div>
  );
}
