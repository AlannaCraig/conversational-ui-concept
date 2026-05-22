/**
 * Mock Chat History
 *
 * Provides sample chat history conversations with mixed content types
 */

import { Message } from '@/types/conversation';
import { getMultipleRandomLayouts } from './adaptiveCardSelector';

export interface MockChatHistory {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  messages: Message[];
}

/**
 * Generate a mock conversation with mixed content
 */
function generateMockConversation(
  id: string,
  title: string,
  preview: string
): MockChatHistory {
  const baseTime = Date.now() - Math.random() * 7200000; // Random time in last 2 hours

  const messages: Message[] = [];
  const messageCount = Math.floor(Math.random() * 3) + 2; // 2-4 exchanges

  for (let i = 0; i < messageCount; i++) {
    const timeOffset = i * 60000; // 1 minute apart

    // User message
    const userPrompts = [
      'Show me today\'s schedule',
      'What tasks are pending?',
      'Give me a summary of recent activity',
      'Show me the latest reports',
      'What meetings do I have?',
      'Display my current workload',
    ];

    messages.push({
      id: `${id}-user-${i}`,
      role: 'user',
      content: i === 0 ? preview : userPrompts[Math.floor(Math.random() * userPrompts.length)],
      timestamp: new Date(baseTime + timeOffset),
      responseMode: 'inline',
    });

    // Assistant response - mix of text and data
    const shouldHaveCards = Math.random() > 0.4; // 60% chance of cards

    if (shouldHaveCards) {
      // Response with adaptive cards
      const responses = [
        'Here are your results:',
        'I\'ve gathered the information you requested:',
        'Here\'s what I found:',
        'Your requested data is ready:',
        'I\'ve compiled this for you:',
      ];

      const cardCount = Math.floor(Math.random() * 3) + 2; // 2-4 cards
      const cardType = ['list', 'schedule', 'stats'][Math.floor(Math.random() * 3)];

      messages.push({
        id: `${id}-assistant-${i}`,
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(baseTime + timeOffset + 2000),
        responseMode: 'inline',
        adaptiveCards: getMultipleRandomLayouts(cardType, cardCount),
      });
    } else {
      // Text-only response
      const textResponses = [
        'Based on the current data, everything appears to be on track. Your team has completed 3 out of 5 milestones this week, with the remaining items scheduled for completion by Friday.',
        'I\'ve analyzed the recent patterns and noticed a 15% increase in productivity this month. The main contributors are improved workflow automation and better resource allocation.',
        'The system shows no critical issues at this time. All services are running normally, and your scheduled tasks are progressing as expected.',
        'Your upcoming week looks manageable with a balanced workload. I recommend prioritizing the client presentation on Wednesday and the budget review on Thursday.',
        'Looking at the metrics, there\'s a positive trend across all key performance indicators. Customer satisfaction is up 12%, and response times have improved by 20%.',
      ];

      messages.push({
        id: `${id}-assistant-${i}`,
        role: 'assistant',
        content: textResponses[Math.floor(Math.random() * textResponses.length)],
        timestamp: new Date(baseTime + timeOffset + 2000),
        responseMode: 'inline',
      });
    }
  }

  return {
    id,
    title,
    preview,
    timestamp: 'HH:MM',
    messages,
  };
}

/**
 * Get all mock chat history
 */
export function getMockChatHistory(): MockChatHistory[] {
  return [
    generateMockConversation(
      'chat-1',
      'Weekly planning session',
      'Show me this week\'s priorities'
    ),
    generateMockConversation(
      'chat-2',
      'Project status review',
      'What\'s the status of the Q2 initiatives?'
    ),
    generateMockConversation(
      'chat-3',
      'Team performance analysis',
      'Analyze team productivity metrics'
    ),
    generateMockConversation(
      'chat-4',
      'Budget overview',
      'Show me the current budget allocation'
    ),
    generateMockConversation(
      'chat-5',
      'Client meeting prep',
      'Help me prepare for the client presentation'
    ),
    generateMockConversation(
      'chat-6',
      'Resource planning',
      'What resources do we need for next quarter?'
    ),
  ];
}
