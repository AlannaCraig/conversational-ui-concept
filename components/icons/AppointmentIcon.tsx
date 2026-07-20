import { Appointment } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function AppointmentIcon({ size = 24, className = '' }: Props) {
  return <Appointment variant="duotone" size={size} className={className} />;
}
