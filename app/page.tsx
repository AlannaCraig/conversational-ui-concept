'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sidebar,
  ConversationHero,
  PromptInput,
  PromptSuggestions,
  ConversationThread,
  NewChatButton
} from '@/components/chat';
import { Message } from '@/types/conversation';
import { getMockResponse } from '@/lib/mockResponses';
import { getGameNode } from '@/lib/gameData';
import { saveCurrentChat } from '@/lib/chatHistory';
import { useAutoScroll } from '@/hooks';

const DEFAULT_SUGGESTIONS = [
  {
    id: '1',
    text: 'Show me a small data return'
  },
  {
    id: '2',
    text: 'Tell me a story'
  },
  {
    id: '3',
    text: "Let's play a game"
  }
];

type UIState = 'landing' | 'conversation';

export default function Home() {
  const [uiState, setUiState] = useState<UIState>('landing');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentGameNodeId, setCurrentGameNodeId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLargeData, setShowLargeData] = useState(false);

  // Auto-scroll to bottom when messages change
  const scrollRef = useAutoScroll({
    enabled: uiState === 'conversation',
    behavior: 'smooth',
    dependencies: [messages],
  });

  const handleSubmit = (msg: string) => {
    if (!msg.trim()) return;

    // Start transition animation
    setIsTransitioning(true);

    // Transition to conversation state after animation
    setTimeout(() => {
      setUiState('conversation');
      setIsTransitioning(false);
    }, 2200);

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
    const mockResponse = getMockResponse(msg, currentGameNodeId || undefined);

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
                gameOptions: mockResponse.gameOptions,
                gameNodeId: mockResponse.gameNodeId,
                largeData: mockResponse.largeData,
              }
            : m
        )
      );

      // Update game state if this is a game response
      if (mockResponse.gameNodeId) {
        setCurrentGameNodeId(mockResponse.gameNodeId);
      }

      // Update large data state if this is a large data response
      if (mockResponse.largeData) {
        setShowLargeData(true);
      }
    }, mockResponse.delay || 1500);
  };

  const handleSelectGameOption = (option: { id: string; text: string; nextNode: string }) => {
    // Add user's choice as a message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: option.text,
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

    // Get the next game node
    const nextNode = getGameNode(option.nextNode);

    if (nextNode) {
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === loadingMessage.id
              ? {
                  ...m,
                  content: nextNode.text,
                  isLoading: false,
                  gameOptions: nextNode.options,
                  gameNodeId: nextNode.id,
                }
              : m
          )
        );

        setCurrentGameNodeId(nextNode.id);
      }, 1000);
    }
  };

  const handleSelectSuggestion = (text: string) => {
    handleSubmit(text);
  };

  const handleHomeClick = () => {
    // Save current chat if there are messages
    if (messages.length > 0) {
      saveCurrentChat(messages, currentGameNodeId);
    }

    // Reset to landing state
    setUiState('landing');
    setMessages([]);
    setCurrentGameNodeId(null);
    setShowLargeData(false);
  };

  const handleNewChat = () => {
    // Save current chat if there are messages
    if (messages.length > 0) {
      saveCurrentChat(messages, currentGameNodeId);
    }

    // Clear messages and game state but stay in conversation view
    setMessages([]);
    setCurrentGameNodeId(null);
    setShowLargeData(false);

    // Transition back to landing for a clean start
    setUiState('landing');
  };

  return (
    <main className="h-screen bg-background-soft">
      <div className="flex h-full">
        {/* Fixed Sidebar */}
        <Sidebar onHomeClick={handleHomeClick} isOnHome={uiState === 'landing'} />

        {/* New Chat Button - Only visible in conversation view */}
        {uiState === 'conversation' && (
          <NewChatButton onClick={handleNewChat} />
        )}

        {/* Main Content Area */}
        <section className="flex-1 ml-16">
          <div className="h-full p-4">
            <div className="h-full flex gap-4">
              <AnimatePresence>
                {/* Large Data Panel - Appears on left when active */}
                {showLargeData && (
                  <motion.div
                    initial={{ opacity: 0, flexGrow: 0, flexBasis: 0 }}
                    animate={{ opacity: 1, flexGrow: 2, flexBasis: 0 }}
                    exit={{ opacity: 0, flexGrow: 0, flexBasis: 0 }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    className="h-full bg-background border border-border rounded-[12px] overflow-hidden"
                    style={{ minWidth: 0 }}
                  >
                    <div className="h-full overflow-y-auto p-6">
                      <h2 className="text-xl font-semibold text-text-primary mb-4">Your things</h2>
                      <p className="text-text-secondary">Your detailed data visualization will appear here. This is the large content area taking up 2/3 of the available space.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dialog Container - Full width or 1/3 width */}
              <motion.div
                initial={{ flexGrow: 1, flexBasis: 0 }}
                animate={{
                  flexGrow: showLargeData ? 1 : 1,
                  flexBasis: 0
                }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="h-full bg-background border border-border rounded-[12px] overflow-hidden"
                style={{ minWidth: 0 }}
              >
            {/* STATE 1: LANDING STATE */}
            {uiState === 'landing' && (
              <div className="h-full flex flex-col items-center justify-center p-6 relative">
                <div className="w-full max-w-[800px]">
                  {/* Hero Section with staggered internal animation */}
                  <motion.div
                    animate={{
                      opacity: isTransitioning ? 0 : 1,
                      y: isTransitioning ? -20 : 0
                    }}
                    transition={{
                      duration: 0.5,
                      delay: isTransitioning ? 0.35 : 0,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                  >
                    <ConversationHero skipAnimation={isTransitioning} />
                  </motion.div>

                  {/* Prompt Input - Entrance animation + transition animation */}
                  <motion.div
                    className="mt-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: 1,
                      y: isTransitioning ? 'calc(50vh - 120px)' : 0
                    }}
                    transition={
                      isTransitioning
                        ? {
                            duration: 1.2,
                            delay: 1.0,
                            ease: [0.4, 0, 0.2, 1]
                          }
                        : {
                            duration: 0.4,
                            delay: 0.5,
                            ease: [0.4, 0, 0.2, 1]
                          }
                    }
                  >
                    <PromptInput onSubmit={handleSubmit} />
                  </motion.div>

                  {/* Suggested Prompts - Entrance animation + transition fade */}
                  <motion.div
                    className="mt-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: isTransitioning ? 0 : 1,
                      y: isTransitioning ? 0 : 0
                    }}
                    transition={
                      isTransitioning
                        ? {
                            duration: 0.3,
                            delay: 0,
                            ease: [0.4, 0, 0.2, 1]
                          }
                        : {
                            duration: 0.4,
                            delay: 0.7,
                            ease: [0.4, 0, 0.2, 1]
                          }
                    }
                  >
                    <PromptSuggestions
                      suggestions={DEFAULT_SUGGESTIONS}
                      onSelectSuggestion={handleSelectSuggestion}
                    />
                  </motion.div>
                </div>
              </div>
            )}

            {/* STATE 2: ACTIVE CONVERSATION STATE */}
            {uiState === 'conversation' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="h-full flex flex-col"
              >
                {/* Spacer for New Chat button in large data view - clips 56px below button bottom */}
                {showLargeData && (
                  <div style={{ height: '96px', flexShrink: 0 }} />
                )}

                {/* Scrollable Conversation Thread */}
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto px-6 scroll-smooth conversation-scroll"
                  style={{ paddingTop: showLargeData ? '0px' : '24px' }}
                >
                  <div className="max-w-[800px] mx-auto">
                    <ConversationThread
                      messages={messages}
                      onSelectGameOption={handleSelectGameOption}
                      removeFirstMessageTopPadding={showLargeData}
                    />
                  </div>
                </div>

                {/* Fixed Input at Bottom */}
                <div className="pb-6 pt-6 px-6 bg-background">
                  <div className="max-w-[800px] mx-auto">
                    {/* Breaker line */}
                    <div className="border-t border-border mb-6"></div>

                    <div>
                      <PromptInput onSubmit={handleSubmit} autoFocus={true} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            </motion.div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
