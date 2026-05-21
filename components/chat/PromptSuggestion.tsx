'use client';

/**
 * PromptSuggestion Component
 *
 * Clickable suggestion card for quick prompt selection.
 * Features subtle hover effects and right arrow indicator.
 */

import { ArrowRightIcon } from '@/components/icons';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui';

interface PromptSuggestionProps {
  text: string;
  onClick?: (text: string) => void;
  delay?: number;
}

export function PromptSuggestion({ text, onClick, delay = 0 }: PromptSuggestionProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(text);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card
        hover
        onClick={handleClick}
        className="px-4 py-3.5 flex items-center justify-between gap-3 group"
      >
        <span className="text-sm text-text-primary font-normal flex-1">
          {text}
        </span>
        <ArrowRightIcon
          size={16}
          className="text-text-tertiary group-hover:text-text-secondary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0"
        />
      </Card>
    </motion.div>
  );
}
