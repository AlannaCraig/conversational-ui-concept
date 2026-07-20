import { Refresh } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function RepeatIcon({ size = 24, className = '' }: Props) {
  return <Refresh variant="duotone" size={size} className={className} />;
}
