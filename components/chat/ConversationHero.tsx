'use client';

/**
 * ConversationHero Component
 *
 * Hero section displaying logo, greeting, and introductory copy.
 * Centered layout with generous whitespace.
 */

import { motion } from 'framer-motion';
import { DialogueIcon } from '@/components/icons';

interface ConversationHeroProps {
  userName?: string;
  greeting?: string;
  subtext?: string;
}

export function ConversationHero({
  userName = 'Liam',
  greeting = `Hey ${userName || 'there'}!`,
  subtext = 'Welcome back! Want to try one of these prompts or go your own way?'
}: ConversationHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center mb-8"
    >
      {/* Dialogue Icon */}
      <div className="mb-6">
        <DialogueIcon width={94} height={96} />
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
