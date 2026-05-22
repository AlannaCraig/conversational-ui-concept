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
import { GameOptions } from './GameOptions';
import { SuggestedActions } from './SuggestedActions';
import type { CardLayoutType } from '@/lib/adaptiveCardSelector';

interface AssistantMessageProps {
  content?: string;
  isLoading?: boolean;
  adaptiveCards?: Array<CardLayoutType | { id: string; type: string; data?: any }>;
  gameOptions?: { id: string; text: string; nextNode: string }[];
  onSelectGameOption?: (option: { id: string; text: string; nextNode: string }) => void;
  suggestedActions?: { id: string; text: string }[];
  onSelectSuggestedAction?: (action: { id: string; text: string }) => void;
  onReopenLargeData?: () => void;
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
  gameOptions,
  onSelectGameOption,
  suggestedActions,
  onSelectSuggestedAction,
  onReopenLargeData,
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
        /* Normal Message - Text content edge-to-edge without icon */
        <div>
          {/* Text content - flush to edge */}
          {content && (
            <div className="mb-4">
              <div className="text-text-primary text-sm leading-6">
                {content}
              </div>
            </div>
          )}

          {/* Adaptive Cards - Full width, 16px below text */}
          {adaptiveCards && adaptiveCards.length > 0 && (
            <div className="mb-5">
              <AdaptiveCardRenderer layouts={adaptiveCards} onReopen={onReopenLargeData} />
            </div>
          )}

          {/* Game Options - Interactive choices for text adventure */}
          {gameOptions && gameOptions.length > 0 && onSelectGameOption && (
            <div className="mb-3">
              <GameOptions
                options={gameOptions}
                onSelectOption={onSelectGameOption}
              />
            </div>
          )}

          {/* Suggested Actions - Follow-up actions after data returns */}
          {suggestedActions && suggestedActions.length > 0 && onSelectSuggestedAction && (
            <div className="mb-3">
              <SuggestedActions
                actions={suggestedActions}
                onSelectAction={onSelectSuggestedAction}
              />
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
