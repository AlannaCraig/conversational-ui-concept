import { MoreVertical } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function MoreVerticalIcon({ size = 24, className = '' }: Props) {
  return <MoreVertical variant="duotone" size={size} className={className} />;
}
