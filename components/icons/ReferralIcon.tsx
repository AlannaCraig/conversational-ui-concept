import { Mail } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function ReferralIcon({ size = 24, className = '' }: Props) {
  return <Mail variant="duotone" size={size} className={className} />;
}
