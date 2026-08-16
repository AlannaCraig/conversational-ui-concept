import { ThumbsDown } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function ThumbsDownIcon({ size = 24, className = '' }: Props) {
  return <ThumbsDown variant="outline" size={size} className={className} />;
}
