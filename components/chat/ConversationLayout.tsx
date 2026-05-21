'use client';

/**
 * ConversationLayout Component
 *
 * Main layout wrapper for conversational interface.
 * Provides centered container with proper spacing and responsive behavior.
 */

import { ReactNode } from 'react';

interface ConversationLayoutProps {
  children: ReactNode;
}

export function ConversationLayout({ children }: ConversationLayoutProps) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl">
        {children}
      </div>
    </main>
  );
}
