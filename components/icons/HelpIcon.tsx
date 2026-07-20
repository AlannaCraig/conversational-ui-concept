import { Help } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function HelpIcon({ size = 24, className = '' }: Props) {
  return <Help variant="duotone" size={size} className={className} />;
}
