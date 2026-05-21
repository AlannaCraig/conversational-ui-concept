'use client';

/**
 * PromptSuggestion Component
 *
 * Clickable suggestion card for quick prompt selection.
 * Features conventional hover and cursor-based click pulse animation.
 */

import { ArrowRightIcon } from '@/components/icons';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

interface PromptSuggestionProps {
  text: string;
  onClick?: (text: string) => void;
  delay?: number;
}

export function PromptSuggestion({ text, onClick, delay = 0 }: PromptSuggestionProps) {
  const [clickRipple, setClickRipple] = useState<{ x: number; y: number; key: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setClickRipple({ x, y, key: Date.now() });

    setTimeout(() => {
      setClickRipple(null);
      if (onClick) {
        onClick(text);
      }
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      ref={cardRef}
      onClick={handleClick}
      className="relative px-4 py-3.5 flex items-center justify-between gap-3 group cursor-pointer border border-border rounded-lg bg-background hover:bg-[rgba(72,65,53,0.08)] transition-colors duration-200 overflow-hidden"
    >
      {/* Click pulse overlay */}
      {clickRipple && (
        <motion.span
          key={`click-${clickRipple.key}`}
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            background: `radial-gradient(circle at ${clickRipple.x}px ${clickRipple.y}px, rgba(72,65,53,0.12) 0%, transparent 70%)`,
          }}
        />
      )}

      <span className="text-sm text-text-primary font-normal flex-1 relative z-10">
        {text}
      </span>
      <ArrowRightIcon
        size={16}
        className="text-text-tertiary group-hover:text-text-secondary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 relative z-10"
      />
    </motion.div>
  );
}
