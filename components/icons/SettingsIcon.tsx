import { Settings } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function SettingsIcon({ size = 24, className = '' }: Props) {
  return <Settings variant="outline" size={size} className={className} />;
}
