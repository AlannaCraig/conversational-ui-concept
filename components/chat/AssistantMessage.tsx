/**
 * AssistantMessage Component
 *
 * Displays assistant messages with IQ chat icon.
 * Supports loading state with "Working on it..." indicator.
 * Renders adaptive cards for small data returns.
 */

import { motion } from 'framer-motion';
import { IQChatIcon } from '@/components/icons';
import { AdaptiveCardRenderer } from './AdaptiveCardRenderer';
import { MessageToolbar } from './MessageToolbar';
import type { CardLayoutType } from '@/lib/adaptiveCardSelector';

interface AssistantMessageProps {
  content?: string;
  isLoading?: boolean;
  adaptiveCards?: CardLayoutType[];
  timestamp?: Date;
  onCopy?: () => void;
  onEdit?: () => void;
  onRepeat?: () => void;
  onThumbsUp?: () => void;
  onThumbsDown?: () => void;
}

export function AssistantMessage({
  content,
  isLoading,
  adaptiveCards,
  timestamp,
  onCopy,
  onEdit,
  onRepeat,
  onThumbsUp,
  onThumbsDown,
}: AssistantMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isLoading ? (
        /* Loading State - Centered with Icon */
        <div className="flex items-center gap-2">
          <IQChatIcon size={24} />
          <div className="text-text-secondary text-sm">
            Working on it...
          </div>
        </div>
      ) : (
        /* Normal Message - Icon + Content, then Full-width Cards, then Toolbar */
        <div>
          {/* Text content with icon */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0">
              <IQChatIcon size={24} />
            </div>
            <div className="flex-1">
              <div className="text-text-primary text-sm leading-6">
                {content}
              </div>
            </div>
          </div>

          {/* Adaptive Cards - Full width, 16px below text */}
          {adaptiveCards && adaptiveCards.length > 0 && (
            <div className="mb-3">
              <AdaptiveCardRenderer layouts={adaptiveCards} />
            </div>
          )}

          {/* Message Toolbar - Full width with actions */}
          <MessageToolbar
            onCopy={onCopy}
            onEdit={onEdit}
            onRepeat={onRepeat}
            onThumbsUp={onThumbsUp}
            onThumbsDown={onThumbsDown}
          />
        </div>
      )}
    </motion.div>
  );
}
