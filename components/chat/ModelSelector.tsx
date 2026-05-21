'use client';

/**
 * ModelSelector Component
 *
 * Dropdown selector for choosing AI model.
 * Clean, minimal design matching the conversational UI aesthetic.
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, TickIcon } from '@/components/icons';
import { motion, AnimatePresence } from 'framer-motion';

const models = [
  { id: 'model-1', name: 'Model 1' },
  { id: 'model-2', name: 'Model 2' },
  { id: 'model-3', name: 'Model 3' },
];

export function ModelSelector() {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSelect = (model: typeof models[0]) => {
    setSelectedModel(model);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      setButtonRect(buttonRef.current.getBoundingClientRect());
    }
    setIsOpen(!isOpen);
  };

  // Update button position on scroll/resize
  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      if (buttonRef.current) {
        setButtonRect(buttonRef.current.getBoundingClientRect());
      }
    };

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  return (
    <>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-hover rounded-md transition-colors duration-200"
        aria-label="Select model"
      >
        <span className="text-xs font-medium">{selectedModel.name}</span>
        <ChevronDownIcon
          size={14}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu - Fixed Positioning */}
      <AnimatePresence>
        {isOpen && buttonRect && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="fixed min-w-[200px] bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50"
              style={{
                top: `${buttonRect.bottom + 4}px`,
                right: `${window.innerWidth - buttonRect.right}px`,
              }}
            >
              {/* Header */}
              <div className="px-4 py-2.5 border-b border-border">
                <span className="text-sm font-medium text-text-primary">Model</span>
              </div>

              {/* Model Options */}
              <div className="py-1">
                {models.map((model) => {
                  const isSelected = model.id === selectedModel.id;

                  return (
                    <button
                      key={model.id}
                      onClick={() => handleSelect(model)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-text-primary hover:bg-hover transition-colors duration-150"
                    >
                      <span className="font-normal">{model.name}</span>
                      {isSelected && (
                        <TickIcon size={16} className="text-text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
