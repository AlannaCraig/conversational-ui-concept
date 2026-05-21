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
    <div className="space-y-3">
      {suggestions.map((suggestion, index) => (
        <PromptSuggestion
          key={suggestion.id}
          text={suggestion.text}
          onClick={onSelectSuggestion}
          delay={0.1 + index * 0.05}
        />
      ))}
    </div>
  );
}
