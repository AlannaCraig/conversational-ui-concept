/**
 * ChatHistoryPopover Component
 *
 * Displays chat history in a popover aligned with the navigation rail button
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChatHistoryIcon, SearchIcon, ChatsIcon, ChevronDownIcon, MoreVerticalIcon, PlusIcon } from '@/components/icons';
import { useState } from 'react';
import { getMockChatHistory } from '@/lib/mockChatHistory';

interface ChatHistoryItem {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
}

interface ChatGroup {
  id: string;
  title: string;
  isExpanded: boolean;
  chats: ChatHistoryItem[];
}

interface ChatHistoryPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement>;
  onSelectChat?: (chatId: string) => void;
  onNewChat?: () => void;
}

export function ChatHistoryPopover({ isOpen, onClose, buttonRef, onSelectChat, onNewChat }: ChatHistoryPopoverProps) {
  const mockChats = getMockChatHistory();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const MOCK_CHAT_GROUPS: ChatGroup[] = [
    {
      id: 'group-1',
      title: 'Today',
      isExpanded: true,
      chats: mockChats.slice(0, 3).map(chat => ({
        id: chat.id,
        title: chat.title,
        preview: chat.preview,
        timestamp: chat.timestamp,
      })),
    },
    {
      id: 'group-2',
      title: 'Yesterday',
      isExpanded: false,
      chats: mockChats.slice(3, 5).map(chat => ({
        id: chat.id,
        title: chat.title,
        preview: chat.preview,
        timestamp: chat.timestamp,
      })),
    },
    {
      id: 'group-3',
      title: 'Last 7 days',
      isExpanded: false,
      chats: mockChats.slice(5).map(chat => ({
        id: chat.id,
        title: chat.title,
        preview: chat.preview,
        timestamp: chat.timestamp,
      })),
    },
  ];
  const [searchQuery, setSearchQuery] = useState('');
  const [groups, setGroups] = useState(MOCK_CHAT_GROUPS);

  const toggleGroup = (groupId: string) => {
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId ? { ...group, isExpanded: !group.isExpanded } : group
      )
    );
  };

  const toggleMenu = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(prev => prev === groupId ? null : groupId);
  };

  const handleExportChats = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Export all chats for group:', groupId);
    // TODO: Implement export functionality
    setOpenMenuId(null);
  };

  const handleDeleteChats = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Delete all chats for group:', groupId);
    // TODO: Implement delete functionality
    setOpenMenuId(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Popover */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-[68px] top-[88px] z-50 w-[392px] bg-background border border-border rounded-[12px] shadow-lg"
            style={{
              maxHeight: 'calc(100vh - 104px)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 pt-5 pb-4">
              <h2 className="text-base font-semibold text-text-primary">Chat history</h2>
              {onNewChat && (
                <button
                  onClick={onNewChat}
                  className="h-8 px-3 flex items-center gap-1.5 bg-primary-main text-primary-contrast rounded-lg hover:opacity-90 transition-opacity cursor-pointer text-xs font-medium"
                >
                  <PlusIcon size={14} />
                  New chat
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="flex-shrink-0 px-5">
              <div className="border-t border-border" />
            </div>

            {/* Controls */}
            <div className="flex-shrink-0 flex items-center justify-between gap-3 px-5 pt-5 pb-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search chat history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-4 py-1.5 text-xs text-text-primary placeholder:text-text-secondary bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                />
              </div>

              {/* Sort by chip */}
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-full hover:bg-hover cursor-pointer transition-colors flex-shrink-0">
                <span className="text-xs text-text-secondary">Sort by</span>
                <ChevronDownIcon size={14} className="text-text-secondary" />
              </button>
            </div>

            {/* Scrollable Chat List */}
            <div className="flex-1 overflow-y-auto conversation-scroll px-5 pt-2 pb-4">
              <div className="space-y-4">
                {groups.map((group, groupIndex) => (
                  <div key={group.id}>
                    {/* Caption-style date heading */}
                    <div className="mb-2">
                      <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                        {group.title}
                      </span>
                    </div>

                    {/* Expandable Group Container */}
                    <div className="bg-background border border-border rounded-lg overflow-hidden">
                      {/* Group Header */}
                      <div className="flex items-center gap-2 w-full px-4 py-3 relative">
                        <button
                          onClick={() => toggleGroup(group.id)}
                          className="flex items-center gap-2 flex-1 hover:opacity-70 transition-opacity"
                        >
                          <ChevronDownIcon
                            size={20}
                            className={`text-text-secondary transition-transform ${
                              group.isExpanded ? 'rotate-0' : '-rotate-90'
                            }`}
                          />
                          <span className="text-sm font-medium text-text-primary">Entity title</span>
                        </button>
                        <div className="relative">
                          <button
                            onClick={(e) => toggleMenu(group.id, e)}
                            className="p-1 hover:bg-hover cursor-pointer rounded transition-colors flex-shrink-0"
                          >
                            <MoreVerticalIcon size={20} className="text-text-secondary" />
                          </button>

                          {/* Dropdown Menu */}
                          {openMenuId === group.id && (
                            <>
                              {/* Backdrop */}
                              <div
                                className="fixed inset-0 z-[60]"
                                onClick={() => setOpenMenuId(null)}
                              />

                              {/* Menu */}
                              <div className="absolute right-0 top-full mt-1 w-48 bg-background border border-border rounded-lg shadow-lg z-[70] py-1">
                                <button
                                  onClick={(e) => handleExportChats(group.id, e)}
                                  className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-hover cursor-pointer transition-colors"
                                >
                                  Export all chats
                                </button>
                                <button
                                  onClick={(e) => handleDeleteChats(group.id, e)}
                                  className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-hover cursor-pointer transition-colors"
                                >
                                  Delete all chats
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Expanded Chat Items */}
                      {group.isExpanded && group.chats.length > 0 && (
                        <>
                          {/* Breaker line */}
                          <div className="px-4">
                            <div className="border-t border-border" />
                          </div>

                          {/* Chat list */}
                          <div className="py-2">
                            {group.chats.map((chat) => (
                              <button
                                key={chat.id}
                                onClick={() => {
                                  if (onSelectChat) {
                                    onSelectChat(chat.id);
                                    onClose();
                                  }
                                }}
                                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-hover cursor-pointer transition-colors text-left"
                              >
                                <ChatsIcon size={20} className="text-text-secondary flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline justify-between gap-2 mb-1">
                                    <span className="text-sm font-medium text-text-primary">{chat.title}</span>
                                    <span className="text-xs text-text-secondary flex-shrink-0">{chat.timestamp}</span>
                                  </div>
                                  <p className="text-xs text-text-secondary truncate">{chat.preview}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
