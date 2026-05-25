/**
 * SmallDataReturn Component
 *
 * Reusable component for small data returns with adaptive cards.
 * Wraps AdaptiveCardRenderer with workflow-specific features:
 * - Optional intro text before cards
 * - Optional follow-up text after cards
 * - Optional suggested actions
 * - Reopen handler for transitioning to large data view
 */

'use client';

import { AdaptiveCardRenderer } from '@/components/chat/AdaptiveCardRenderer';
import { SuggestedActions } from '@/components/chat/SuggestedActions';
import type { CardLayoutType } from '@/lib/adaptiveCardSelector';

interface SmallDataReturnProps {
  /** Adaptive card layouts to render */
  cards: Array<CardLayoutType | { id: string; type: string; data?: any }>;
  /** Optional intro text displayed above cards */
  introText?: string;
  /** Optional follow-up text displayed below cards */
  followUpText?: string;
  /** Optional suggested actions displayed at the bottom */
  suggestedActions?: { id: string; text: string }[];
  /** Handler for suggested action selection */
  onSelectAction?: (action: { id: string; text: string }) => void;
  /** Handler for reopening as large data view */
  onReopen?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export function SmallDataReturn({
  cards,
  introText,
  followUpText,
  suggestedActions,
  onSelectAction,
  onReopen,
  className = '',
}: SmallDataReturnProps) {
  return (
    <div className={`${className}`}>
      {/* Intro Text */}
      {introText && (
        <div className="mb-4">
          <div className="text-text-primary text-sm leading-6 whitespace-pre-wrap">
            {introText}
          </div>
        </div>
      )}

      {/* Adaptive Cards */}
      {cards.length > 0 && (
        <div className="mb-5">
          <AdaptiveCardRenderer layouts={cards} onReopen={onReopen} />
        </div>
      )}

      {/* Follow-up Text */}
      {followUpText && (
        <div className="mb-5">
          <div className="text-text-primary text-sm leading-6 whitespace-pre-wrap">
            {followUpText}
          </div>
        </div>
      )}

      {/* Suggested Actions */}
      {suggestedActions && suggestedActions.length > 0 && onSelectAction && (
        <div className="mb-3">
          <SuggestedActions
            actions={suggestedActions}
            onSelectAction={onSelectAction}
          />
        </div>
      )}
    </div>
  );
}
