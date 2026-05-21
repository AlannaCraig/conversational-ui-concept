'use client';

/**
 * ConversationHero Component
 *
 * Hero section displaying logo, greeting, and introductory copy.
 * Centered layout with generous whitespace.
 * Staggered entrance animation with icon pulse.
 */

import { motion } from 'framer-motion';
import { DialogueIcon } from '@/components/icons';

interface ConversationHeroProps {
  userName?: string;
  greeting?: string;
  subtext?: string;
  skipAnimation?: boolean;
}

export function ConversationHero({
  userName = 'Liam',
  greeting = `Hey ${userName || 'there'}!`,
  subtext = 'Welcome back! Want to try one of these prompts or go your own way?',
  skipAnimation = false
}: ConversationHeroProps) {
  return (
    <motion.div
      className="flex flex-col items-center text-center mb-8"
      initial={skipAnimation ? false : { opacity: 0, y: 10 }}
      animate={skipAnimation ? false : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {/* Dialogue Icon with ripple animation */}
      <div className="mb-6">
        <DialogueIcon width={94} height={96} animate={!skipAnimation} />
      </div>

      {/* Greeting */}
      <h1 className="text-3xl font-semibold text-text-primary mb-3">
        {greeting}
      </h1>

      {/* Subtext */}
      <p className="text-base text-text-secondary w-full">
        {subtext}
      </p>
    </motion.div>
  );
}
