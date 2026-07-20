import { Copy } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function CopyIcon({ size = 24, className = '' }: Props) {
  return <Copy variant="duotone" size={size} className={className} />;
}
