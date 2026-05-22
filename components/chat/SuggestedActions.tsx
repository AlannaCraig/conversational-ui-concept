/**
 * SuggestedActions Component
 *
 * Displays suggested follow-up actions after data returns
 * Styled to match GameOptions component (same as text game suggestions)
 */

'use client';

import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@/components/icons';
import { useState, useRef } from 'react';

interface SuggestedAction {
  id: string;
  text: string;
}

interface SuggestedActionsProps {
  actions: SuggestedAction[];
  onSelectAction: (action: SuggestedAction) => void;
  className?: string;
}

export function SuggestedActions({
  actions,
  onSelectAction,
  className = '',
}: SuggestedActionsProps) {
  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-text-primary mb-3">Suggested actions:</h3>
      <div className="space-y-2">
        {actions.map((action, index) => (
          <SuggestedActionButton
            key={action.id}
            action={action}
            index={index}
            onSelect={onSelectAction}
          />
        ))}
      </div>
    </div>
  );
}

interface SuggestedActionButtonProps {
  action: SuggestedAction;
  index: number;
  onSelect: (action: SuggestedAction) => void;
}

function SuggestedActionButton({ action, index, onSelect }: SuggestedActionButtonProps) {
  const [clickRipple, setClickRipple] = useState<{ x: number; y: number; key: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setClickRipple({ x, y, key: Date.now() });

    setTimeout(() => {
      setClickRipple(null);
      onSelect(action);
    }, 300);
  };

  return (
    <motion.button
      ref={buttonRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1],
      }}
      onClick={handleClick}
      className="relative w-full px-4 py-3.5 flex items-center justify-between gap-3 group cursor-pointer border border-border rounded-lg bg-background hover:bg-hover transition-colors duration-200 overflow-hidden"
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
            background: `radial-gradient(circle at ${clickRipple.x}px ${clickRipple.y}px, var(--hover-strong) 0%, transparent 70%)`,
          }}
        />
      )}

      <span className="text-sm text-text-primary font-normal flex-1 text-left relative z-10">
        {action.text}
      </span>
      <ArrowRightIcon
        size={16}
        className="text-text-tertiary group-hover:text-text-secondary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 relative z-10"
      />
    </motion.button>
  );
}
