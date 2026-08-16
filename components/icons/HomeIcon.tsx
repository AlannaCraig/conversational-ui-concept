import { Home } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function HomeIcon({ size = 24, className = '' }: Props) {
  return <Home variant="outline" size={size} className={className} />;
}
