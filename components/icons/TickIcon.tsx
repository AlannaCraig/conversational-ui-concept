import { Approve } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function TickIcon({ size = 24, className = '' }: Props) {
  return <Approve variant="duotone" size={size} className={className} />;
}
