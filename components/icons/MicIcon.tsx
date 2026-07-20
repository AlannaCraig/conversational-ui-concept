import { Microphone } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function MicIcon({ size = 24, className = '' }: Props) {
  return <Microphone variant="duotone" size={size} className={className} />;
}
