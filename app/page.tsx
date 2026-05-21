'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sidebar,
  ConversationHero,
  PromptInput,
  PromptSuggestions,
  ConversationThread
} from '@/components/chat';
import { Message } from '@/types/conversation';
import { getMockResponse } from '@/lib/mockResponses';
import { useAutoScroll } from '@/hooks';

const DEFAULT_SUGGESTIONS = [
  {
    id: '1',
    text: 'Show my upcoming appointments'
  },
  {
    id: '2',
    text: 'Tell me a story'
  },
  {
    id: '3',
    text: 'List all my medications'
  }
];

type UIState = 'landing' | 'conversation';

export default function Home() {
  const [uiState, setUiState] = useState<UIState>('landing');
  const [messages, setMessages] = useState<Message[]>([]);

  // Auto-scroll to bottom when messages change
  const scrollRef = useAutoScroll({
    enabled: uiState === 'conversation',
    behavior: 'smooth',
    dependencies: [messages],
  });

  const handleSubmit = (msg: string) => {
    if (!msg.trim()) return;

    // Transition to conversation state (handles both text-only and small data requests)
    setUiState('conversation');

    // Create user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: msg,
      timestamp: new Date(),
      responseMode: 'inline',
    };

    setMessages((prev) => [...prev, userMessage]);

    // Create loading assistant message
    const loadingMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      responseMode: 'inline',
      isLoading: true,
    };

    setMessages((prev) => [...prev, loadingMessage]);

    // Get mock response
    const mockResponse = getMockResponse(msg);

    // Simulate assistant response
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMessage.id
            ? {
                ...m,
                content: mockResponse.content,
                isLoading: false,
                adaptiveCards: mockResponse.adaptiveCards,
              }
            : m
        )
      );
    }, mockResponse.delay || 1500);
  };

  const handleSelectSuggestion = (text: string) => {
    handleSubmit(text);
  };

  const handleHomeClick = () => {
    // Reset to landing state
    setUiState('landing');
    setMessages([]);
  };

  return (
    <main className="h-screen bg-background-soft">
      <div className="flex h-full">
        {/* Fixed Sidebar */}
        <Sidebar onHomeClick={handleHomeClick} isOnHome={uiState === 'landing'} />

        {/* Main Content Area */}
        <section className="flex-1 ml-16 p-4">
          {/* Content Frame */}
          <div className="h-full bg-background border border-border rounded-[12px] overflow-hidden">
            <AnimatePresence mode="wait">
              {/* STATE 1: LANDING STATE */}
              {uiState === 'landing' && (
              <motion.div
                key="landing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="h-full flex flex-col items-center justify-center p-6"
              >
                <div className="w-full max-w-[800px]">
                  {/* Hero Section */}
                  <div>
                    <ConversationHero />
                  </div>

                  {/* Prompt Input */}
                  <div className="mt-8">
                    <PromptInput onSubmit={handleSubmit} />
                  </div>

                  {/* Suggested Prompts */}
                  <div className="mt-6">
                    <PromptSuggestions
                      suggestions={DEFAULT_SUGGESTIONS}
                      onSelectSuggestion={handleSelectSuggestion}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STATE 2: ACTIVE CONVERSATION STATE */}
            {uiState === 'conversation' && (
              <motion.div
                key="conversation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="h-full flex flex-col"
              >
                {/* Scrollable Conversation Thread */}
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto px-6 pt-6 scroll-smooth conversation-scroll"
                >
                  <div className="max-w-[800px] mx-auto">
                    <ConversationThread messages={messages} />
                  </div>
                </div>

                {/* Fixed Input at Bottom */}
                <div className="pb-10 pt-6 px-6 bg-background">
                  <div className="max-w-[800px] mx-auto">
                    {/* Breaker line */}
                    <div className="border-t border-border mb-6"></div>

                    <div>
                      <PromptInput onSubmit={handleSubmit} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </main>
  );
}
