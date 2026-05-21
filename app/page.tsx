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
import {
  TableCard,
  DashboardCard,
  DocumentCard,
  GridCard,
  CalendarCard,
  KanbanCard,
  AnalyticsCard
} from '@/components/ui/LargeAdaptiveCards';
import { ActionTiles } from '@/components/ui';
import { CloseXIcon } from '@/components/icons';
import { Message } from '@/types/conversation';
import { getMockResponse } from '@/lib/mockResponses';
import { getGameNode } from '@/lib/gameData';
import { saveCurrentChat } from '@/lib/chatHistory';
import { useAutoScroll } from '@/hooks';

const LARGE_CARD_LAYOUTS = [
  { type: 'table', component: TableCard },
  { type: 'dashboard', component: DashboardCard },
  { type: 'document', component: DocumentCard },
  { type: 'grid', component: GridCard },
  { type: 'calendar', component: CalendarCard },
  { type: 'kanban', component: KanbanCard },
  { type: 'analytics', component: AnalyticsCard },
];

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
  const [largeCardLayout, setLargeCardLayout] = useState<typeof LARGE_CARD_LAYOUTS[0] | null>(null);
  const [closedLargeDataContext, setClosedLargeDataContext] = useState<{ layout: typeof LARGE_CARD_LAYOUTS[0]; messageContent: string } | null>(null);

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
        // Pick a random layout
        const randomLayout = LARGE_CARD_LAYOUTS[Math.floor(Math.random() * LARGE_CARD_LAYOUTS.length)];
        setLargeCardLayout(randomLayout);
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

  const handleTileClick = (tile: { id: string; type: 'task' | 'appointment' | 'report'; count: number; label: string }) => {
    // Start transition animation
    setIsTransitioning(true);

    // Transition to conversation state after animation
    setTimeout(() => {
      setUiState('conversation');
      setIsTransitioning(false);
    }, 2200);

    // Create user message based on tile
    const tileMessages: Record<string, string> = {
      task: `Show me my ${tile.count} tasks due today`,
      appointment: `Show me my ${tile.count} appointments today`,
      report: `Show me my ${tile.count} reports scheduled for today`,
    };

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: tileMessages[tile.type],
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

    // Generate response based on tile type
    const responseMessages: Record<string, string> = {
      task: `Here are your ${tile.count} outstanding tasks due today:`,
      appointment: `Here are your ${tile.count} appointments scheduled for today:`,
      report: `Here are your ${tile.count} reports scheduled for today:`,
    };

    const adaptiveCardTypes: Record<string, string> = {
      task: 'task-list',
      appointment: 'appointment-list',
      report: 'report-list',
    };

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMessage.id
            ? {
                ...m,
                content: responseMessages[tile.type],
                isLoading: false,
                adaptiveCards: [
                  {
                    id: `card-${Date.now()}`,
                    type: adaptiveCardTypes[tile.type],
                    data: { count: tile.count },
                  },
                ],
              }
            : m
        )
      );
    }, 1500);
  };

  const handleCloseLargeData = () => {
    // Store the context for reopening
    if (largeCardLayout) {
      setClosedLargeDataContext({
        layout: largeCardLayout,
        messageContent: 'Large data view has been closed.',
      });
    }

    // Close the large data view
    setShowLargeData(false);

    // Add system message to conversation
    const systemMessage: Message = {
      id: `system-${Date.now()}`,
      role: 'assistant',
      content: 'Large data view has been closed.',
      timestamp: new Date(),
      responseMode: 'inline',
      adaptiveCards: [
        {
          id: `reopen-${Date.now()}`,
          type: 'reopen-prompt',
          data: {},
        },
      ],
    };

    setMessages((prev) => [...prev, systemMessage]);
  };

  const handleReopenLargeData = () => {
    if (closedLargeDataContext) {
      setLargeCardLayout(closedLargeDataContext.layout);
      setShowLargeData(true);
      setClosedLargeDataContext(null);
    }
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
    setLargeCardLayout(null);
    setClosedLargeDataContext(null);
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
    setLargeCardLayout(null);
    setClosedLargeDataContext(null);

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
          <div className="h-full p-6">
            <div className="h-full flex gap-6">
              <AnimatePresence>
                {/* Large Data Panel - Appears on left when active */}
                {showLargeData && largeCardLayout && (
                  <motion.div
                    initial={{ opacity: 0, flexGrow: 0, flexBasis: 0 }}
                    animate={{ opacity: 1, flexGrow: 2, flexBasis: 0 }}
                    exit={{ opacity: 0, flexGrow: 0, flexBasis: 0 }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    className="h-full"
                    style={{ minWidth: 0 }}
                  >
                    {/* Adaptive Card Container - Full height with flex layout */}
                    <div className="h-full bg-background border border-border rounded-[12px] overflow-hidden flex flex-col">
                      {/* Sticky Header */}
                      <div className="flex-shrink-0 px-6 pt-6 pb-4 bg-background">
                        <div className="flex items-center justify-between">
                          <div className="h-6 w-32 bg-primary-light rounded" />

                          {/* Action buttons */}
                          <div className="flex items-center gap-2">
                            {/* Placeholder buttons */}
                            <button className="w-8 h-8 border border-border rounded flex items-center justify-center hover:bg-hover transition-colors cursor-pointer">
                              <div className="w-4 h-4 bg-border rounded" />
                            </button>
                            <button className="w-8 h-8 border border-border rounded flex items-center justify-center hover:bg-hover transition-colors cursor-pointer">
                              <div className="w-4 h-4 bg-border rounded" />
                            </button>

                            {/* Close button */}
                            <button
                              onClick={handleCloseLargeData}
                              className="w-8 h-8 border border-border rounded flex items-center justify-center hover:bg-hover transition-colors cursor-pointer text-text-secondary hover:text-text-primary"
                              aria-label="Close large data view"
                            >
                              <CloseXIcon size={20} />
                            </button>
                          </div>
                        </div>
                        {/* Breaker line */}
                        <div className="border-t border-border mt-6"></div>
                      </div>

                      {/* Scrollable Content - starts 24px below breaker */}
                      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-6 conversation-scroll">
                        {/* Render the selected large card layout */}
                        {largeCardLayout.type === 'table' && <TableCard />}
                        {largeCardLayout.type === 'dashboard' && <DashboardCard />}
                        {largeCardLayout.type === 'document' && <DocumentCard />}
                        {largeCardLayout.type === 'grid' && <GridCard />}
                        {largeCardLayout.type === 'calendar' && <CalendarCard />}
                        {largeCardLayout.type === 'kanban' && <KanbanCard />}
                        {largeCardLayout.type === 'analytics' && <AnalyticsCard />}
                      </div>
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

                  {/* Two-column layout: Action Tiles + Suggested Prompts */}
                  <motion.div
                    className="mt-6 grid gap-6"
                    style={{ gridTemplateColumns: '1fr 2fr' }}
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
                    {/* Left column: Action Tiles (1/3 width) */}
                    <div>
                      <h3 className="text-sm font-medium text-text-primary mb-3">Today's activities:</h3>
                      <ActionTiles onTileClick={handleTileClick} />
                    </div>

                    {/* Right column: Suggested Prompts (2/3 width) */}
                    <div>
                      <h3 className="text-sm font-medium text-text-primary mb-3">Suggested prompts:</h3>
                      <PromptSuggestions
                        suggestions={DEFAULT_SUGGESTIONS}
                        onSelectSuggestion={handleSelectSuggestion}
                      />
                    </div>
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
                      onReopenLargeData={handleReopenLargeData}
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
