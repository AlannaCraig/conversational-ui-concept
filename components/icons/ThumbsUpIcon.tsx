import { ThumbsUp } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function ThumbsUpIcon({ size = 24, className = '' }: Props) {
  return <ThumbsUp variant="outline" size={size} className={className} />;
}
