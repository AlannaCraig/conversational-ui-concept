/**
 * MessageToolbar Component
 *
 * Action toolbar for assistant messages with copy, edit, repeat, thumbs up/down controls.
 */

'use client';

import { motion } from 'framer-motion';
import {
  CopyIcon,
  EditIcon,
  RepeatIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
} from '@/components/icons';

interface MessageToolbarProps {
  onCopy?: () => void;
  onEdit?: () => void;
  onRepeat?: () => void;
  onThumbsUp?: () => void;
  onThumbsDown?: () => void;
  className?: string;
}

export function MessageToolbar({
  onCopy,
  onEdit,
  onRepeat,
  onThumbsUp,
  onThumbsDown,
  className = '',
}: MessageToolbarProps) {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={`flex items-center gap-1 ${className}`}
    >
      <button
        onClick={onCopy}
        className="p-2 text-primary-main hover:bg-hover rounded transition-colors duration-200"
        aria-label="Copy message"
      >
        <CopyIcon size={16} />
      </button>

      <button
        onClick={onEdit}
        className="p-2 text-primary-main hover:bg-hover rounded transition-colors duration-200"
        aria-label="Edit message"
      >
        <EditIcon size={16} />
      </button>

      <button
        onClick={onRepeat}
        className="p-2 text-primary-main hover:bg-hover rounded transition-colors duration-200"
        aria-label="Repeat query"
      >
        <RepeatIcon size={16} />
      </button>

      <button
        onClick={onThumbsUp}
        className="p-2 text-primary-main hover:bg-hover rounded transition-colors duration-200"
        aria-label="Thumbs up"
      >
        <ThumbsUpIcon size={16} />
      </button>

      <button
        onClick={onThumbsDown}
        className="p-2 text-primary-main hover:bg-hover rounded transition-colors duration-200"
        aria-label="Thumbs down"
      >
        <ThumbsDownIcon size={16} />
      </button>
    </motion.div>
  );
}
