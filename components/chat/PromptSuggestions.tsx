'use client';

/**
 * PromptSuggestions Component
 *
 * Container for displaying a list of suggested prompts.
 * Includes heading and stacked suggestion cards with staggered animations.
 */

import { motion } from 'framer-motion';
import { PromptSuggestion } from './PromptSuggestion';

interface Suggestion {
  id: string;
  text: string;
}

interface PromptSuggestionsProps {
  suggestions: Suggestion[];
  onSelectSuggestion?: (text: string) => void;
}

export function PromptSuggestions({
  suggestions,
  onSelectSuggestion
}: PromptSuggestionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="w-full space-y-3"
    >
      {/* Section Heading */}
      <p className="text-sm font-medium text-text-secondary">
        Suggested prompts:
      </p>

      {/* Suggestion Cards */}
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <PromptSuggestion
            key={suggestion.id}
            text={suggestion.text}
            onClick={onSelectSuggestion}
            delay={0.1 + index * 0.05}
          />
        ))}
      </div>
    </motion.div>
  );
}
