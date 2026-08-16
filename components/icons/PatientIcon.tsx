import { User } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function PatientIcon({ size = 24, className = '' }: Props) {
  return <User variant="outline" size={size} className={className} />;
}
