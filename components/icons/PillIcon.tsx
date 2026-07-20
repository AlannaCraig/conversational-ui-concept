import { Medication } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function PillIcon({ size = 24, className = '' }: Props) {
  return <Medication variant="duotone" size={size} className={className} />;
}
