/**
 * Chat History Storage
 *
 * Saves conversations for future recall functionality
 */

import { Message } from '@/types/conversation';

export interface SavedChat {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
  gameNodeId?: string | null;
}

const STORAGE_KEY = 'conversational-ui-chat-history';

/**
 * Save current conversation to history
 */
export function saveCurrentChat(
  messages: Message[],
  gameNodeId: string | null
): SavedChat {
  // Generate a title from the first user message or use default
  const firstUserMessage = messages.find((m) => m.role === 'user');
  const title = firstUserMessage
    ? firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '')
    : 'New Conversation';

  const savedChat: SavedChat = {
    id: `chat-${Date.now()}`,
    title,
    messages: [...messages],
    timestamp: new Date(),
    gameNodeId,
  };

  // Get existing history
  const history = getChatHistory();

  // Add new chat at the beginning
  history.unshift(savedChat);

  // Keep only last 50 chats
  const trimmedHistory = history.slice(0, 50);

  // Save to localStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }

  return savedChat;
}

/**
 * Get all saved chats from history
 */
export function getChatHistory(): SavedChat[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    // Convert timestamp strings back to Date objects
    return parsed.map((chat: any) => ({
      ...chat,
      timestamp: new Date(chat.timestamp),
      messages: chat.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch (error) {
    console.error('Failed to load chat history:', error);
    return [];
  }
}

/**
 * Get a specific chat by ID
 */
export function getChatById(id: string): SavedChat | null {
  const history = getChatHistory();
  return history.find((chat) => chat.id === id) || null;
}

/**
 * Delete a chat from history
 */
export function deleteChat(id: string): void {
  const history = getChatHistory();
  const filtered = history.filter((chat) => chat.id !== id);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  }
}

/**
 * Clear all chat history
 */
export function clearChatHistory(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  }
}
