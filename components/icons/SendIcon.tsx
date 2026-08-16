import { Send } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function SendIcon({ size = 24, className = '' }: Props) {
  return <Send variant="outline" size={size} className={className} />;
}
