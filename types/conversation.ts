/**
 * Conversation Type Definitions
 *
 * Architected for future extensibility to support both inline and workspace response modes.
 */

import type { CardLayoutType } from '@/lib/adaptiveCardSelector';

export type ConversationMode = 'inline' | 'workspace';

export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  responseMode?: ConversationMode;
  timestamp: Date;
  isLoading?: boolean;
  // Adaptive card data for small data returns
  adaptiveCards?: CardLayoutType[];
  // Game data for text-based adventure
  gameOptions?: { id: string; text: string; nextNode: string }[];
  gameNodeId?: string;
}

export interface ConversationState {
  messages: Message[];
  isActive: boolean;
  mode: ConversationMode;
}

export interface MockResponse {
  content: string;
  delay?: number;
  adaptiveCards?: CardLayoutType[];
  gameOptions?: { id: string; text: string; nextNode: string }[];
  gameNodeId?: string;
}
