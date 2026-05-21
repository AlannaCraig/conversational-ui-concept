/**
 * UserMessage Component
 *
 * Displays user messages in the conversation thread.
 * Small card container with rounded corners and dynamic timestamp.
 */

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface UserMessageProps {
  content: string;
  timestamp?: Date;
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 10) return 'Just now';
  if (seconds < 60) return `${seconds} seconds ago`;
  if (seconds < 120) return '1 minute ago';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 7200) return '1 hour ago';
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function UserMessage({ content, timestamp }: UserMessageProps) {
  const [timeAgo, setTimeAgo] = useState(() =>
    timestamp ? getTimeAgo(timestamp) : ''
  );

  useEffect(() => {
    if (!timestamp) return;

    // Update timestamp every 10 seconds
    const interval = setInterval(() => {
      setTimeAgo(getTimeAgo(timestamp));
    }, 10000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-end"
    >
      <div className="max-w-[80%]">
        <div className="bg-primary-contrast border border-border rounded p-4 text-text-primary text-sm">
          {content}
        </div>
        {timestamp && (
          <div className="text-xs text-text-tertiary text-right mt-1">
            {timeAgo}
          </div>
        )}
      </div>
    </motion.div>
  );
}
