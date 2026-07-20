import { ChatHistory } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function ChatHistoryIcon({ size = 24, className = '' }: Props) {
  return <ChatHistory variant="duotone" size={size} className={className} />;
}
