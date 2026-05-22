/**
 * ConversationThread Component
 *
 * Renders the message thread with user and assistant messages.
 * Handles scrolling and message layout.
 */

import { Message } from '@/types/conversation';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';

interface ConversationThreadProps {
  messages: Message[];
  onSelectGameOption?: (option: { id: string; text: string; nextNode: string }) => void;
  onSelectSuggestedAction?: (action: { id: string; text: string }) => void;
  onReopenLargeData?: () => void;
  removeFirstMessageTopPadding?: boolean;
}

export function ConversationThread({ messages, onSelectGameOption, onSelectSuggestedAction, onReopenLargeData, removeFirstMessageTopPadding = false }: ConversationThreadProps) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-6">
      {messages.map((message, index) => {
        const nextMessage = messages[index + 1];
        const prevMessage = messages[index - 1];
        const showBreaker = message.role === 'assistant' && nextMessage;

        // Tighter spacing between user and assistant messages
        const isUserBeforeAssistant = message.role === 'user' && nextMessage?.role === 'assistant';
        const isAssistantAfterUser = message.role === 'assistant' && prevMessage?.role === 'user';
        const isFirstMessage = index === 0;

        // Remove top padding from first message if requested (for large data view)
        let userPadding = isUserBeforeAssistant ? 'pt-6 pb-3' : 'py-6';
        if (isFirstMessage && removeFirstMessageTopPadding && message.role === 'user') {
          userPadding = isUserBeforeAssistant ? 'pt-0 pb-3' : 'py-0 pb-6';
        }

        const assistantPadding = isAssistantAfterUser ? 'pt-3 pb-6' : 'py-6';

        return (
          <div key={message.id}>
            {message.role === 'user' ? (
              <div className={userPadding}>
                <UserMessage
                  content={message.content}
                  timestamp={message.timestamp}
                />
              </div>
            ) : (
              <div className={assistantPadding}>
                <AssistantMessage
                  content={message.content}
                  isLoading={message.isLoading}
                  adaptiveCards={message.adaptiveCards}
                  gameOptions={message.gameOptions}
                  onSelectGameOption={onSelectGameOption}
                  suggestedActions={message.suggestedActions}
                  onSelectSuggestedAction={onSelectSuggestedAction}
                  onReopenLargeData={onReopenLargeData}
                />
              </div>
            )}

            {/* Breaker line only after assistant messages (not after the last message) */}
            {showBreaker && (
              <div className="border-t border-border"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
