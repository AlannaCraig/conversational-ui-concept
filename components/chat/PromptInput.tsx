'use client';

/**
 * PromptInput Component
 *
 * Premium conversational AI input with clean enterprise aesthetic.
 * Two-section structure: main input area + utility toolbar.
 * All styling driven by design tokens.
 */

import { useState, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { SendIcon, MicIcon, PlusIcon, GlobeIcon } from '@/components/icons';
import { motion } from 'framer-motion';
import { ModelSelector } from './ModelSelector';

interface PromptInputProps {
  onSubmit?: (message: string) => void;
  placeholder?: string;
}

export function PromptInput({
  onSubmit,
  placeholder = 'Ask me anything...'
}: PromptInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!message.trim()) return;

    if (onSubmit) {
      onSubmit(message);
    }

    // Clear input
    setMessage('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  return (
    <div className="w-full">
      {/* Chat Input Shell - Outer Container */}
      <div className="w-full overflow-hidden rounded-[12px] border border-border shadow-sm box-border transition-shadow duration-200 hover:shadow-md focus-within:shadow-md">

        {/* TOP SECTION - Main Input Area */}
        <div className="bg-background px-4 py-4 relative flex items-center">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="w-full pr-20 bg-transparent text-text-primary placeholder-text-tertiary resize-none focus:outline-none text-base leading-relaxed"
            style={{
              minHeight: '24px',
              maxHeight: '200px',
              paddingTop: '0',
              paddingBottom: '0',
            }}
          />

          {/* Action Icons - Right Side */}
          <div className="absolute right-4 flex items-center gap-2">
            <button
              onClick={handleSubmit}
              disabled={!message.trim()}
              className="w-9 h-9 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <SendIcon size={20} />
            </button>

            <button
              className="w-9 h-9 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors duration-200"
              aria-label="Voice input"
            >
              <MicIcon size={20} />
            </button>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-border" />

        {/* BOTTOM SECTION - Utility Toolbar */}
        <div className="bg-background-soft px-2 py-2 flex items-center justify-between">

          {/* Left: Utility Actions */}
          <div className="flex items-center gap-1">
            {/* Add Attachment Button */}
            <button
              className="h-9 px-2 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-hover rounded-md transition-colors duration-200"
              aria-label="Add attachment"
            >
              <PlusIcon size={18} />
            </button>

            {/* Globe/Model Icon */}
            <button
              className="h-9 px-2 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-hover rounded-md transition-colors duration-200"
              aria-label="Model settings"
            >
              <GlobeIcon size={18} />
            </button>
          </div>

          {/* Right: Model Selector */}
          <ModelSelector />
        </div>
      </div>

    </div>
  );
}
