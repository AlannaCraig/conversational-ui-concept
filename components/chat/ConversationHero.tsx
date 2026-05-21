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
import { useState, useEffect } from 'react';

const SUBTEXT_VARIATIONS = [
  'Welcome back! Want to try one of these prompts or go your own way?',
  'Welcome back. Start with a prompt below, or jump straight in.',
  'Welcome back! Pick a prompt to get going, or chart your own course.',
  'Welcome back. Need inspiration, or already know where you\'re headed?',
  'Welcome back! Try a starter prompt, or ask anything.',
  'Welcome back. Explore a suggestion below, or make your own move.',
  'Welcome back! Choose a prompt or start from scratch.',
  'Welcome back. Want a quick start, or a blank canvas?',
  'Welcome back! Here are a few ways to begin — or just type away.',
  'Welcome back. Pick a direction below, or blaze your own trail.',
  'Welcome back! Use one of these ideas, or follow your curiosity.',
  'Welcome back. Try a suggested prompt, or dive right into your own.',
  'Welcome back! Start with inspiration below, or create your own path.',
  'Welcome back. What would you like to explore today?',
  'Welcome back! Need a nudge, or ready to freestyle?',
];

interface ConversationHeroProps {
  userName?: string;
  greeting?: string;
  subtext?: string;
  skipAnimation?: boolean;
}

export function ConversationHero({
  userName = 'Liam',
  greeting = `Hey ${userName || 'there'}!`,
  subtext,
  skipAnimation = false
}: ConversationHeroProps) {
  const [randomSubtext, setRandomSubtext] = useState(subtext || SUBTEXT_VARIATIONS[0]);

  useEffect(() => {
    if (!subtext) {
      setRandomSubtext(SUBTEXT_VARIATIONS[Math.floor(Math.random() * SUBTEXT_VARIATIONS.length)]);
    }
  }, [subtext]);

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
        {randomSubtext}
      </p>
    </motion.div>
  );
}
