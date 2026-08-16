import { ChevronDown } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function ChevronDownIcon({ size = 24, className = '' }: Props) {
  return <ChevronDown variant="outline" size={size} className={className} />;
}
