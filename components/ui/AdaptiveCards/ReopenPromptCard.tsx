/**
 * ReopenPromptCard Component
 *
 * Clickable prompt to reopen closed large data view
 */

'use client';

import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@/components/icons';
import { useState, useRef } from 'react';

interface ReopenPromptCardProps {
  onReopen?: () => void;
}

export function ReopenPromptCard({ onReopen }: ReopenPromptCardProps) {
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
      if (onReopen) {
        onReopen();
      }
    }, 300);
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className="relative px-4 py-3.5 flex items-center justify-between gap-3 group cursor-pointer border border-border rounded-lg bg-background hover:bg-hover transition-colors duration-200 overflow-hidden"
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

      <span className="text-sm text-text-primary font-normal flex-1 relative z-10">
        Click here to reopen
      </span>
      <ArrowRightIcon
        size={16}
        className="text-text-tertiary group-hover:text-text-secondary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 relative z-10"
      />
    </div>
  );
}
