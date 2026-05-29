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
  adaptiveCards?: Array<CardLayoutType | { id: string; type: string; data?: any }>;
  // Game data for text-based adventure
  gameOptions?: { id: string; text: string; nextNode: string }[];
  gameNodeId?: string;
  // Suggested actions for follow-up
  suggestedActions?: { id: string; text: string }[];
  // Large data return flag
  largeData?: boolean;
  // Patient ID to display when largeDataType is 'patient-summary'
  patientId?: string;
  // Follow-up text that appears after cards/actions
  followUpText?: string;
  // Form data
  showInDialogForm?: boolean;
  showPopOutForm?: boolean;
  formData?: {
    title: string;
    subtitle?: string;
    formId?: string;
  };
}

export interface ConversationState {
  messages: Message[];
  isActive: boolean;
  mode: ConversationMode;
}

export interface MockResponse {
  content: string;
  delay?: number;
  adaptiveCards?: Array<CardLayoutType | { id: string; type: string; data?: any }>;
  gameOptions?: { id: string; text: string; nextNode: string }[];
  gameNodeId?: string;
  suggestedActions?: { id: string; text: string }[];
  largeData?: boolean;
  largeDataType?: string;
  patientId?: string;
  followUpText?: string;
  showInDialogForm?: boolean;
  showPopOutForm?: boolean;
  formData?: {
    title: string;
    subtitle?: string;
    formId?: string;
  };
}
