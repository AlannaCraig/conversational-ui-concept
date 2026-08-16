import { Task } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function TaskIcon({ size = 24, className = '' }: Props) {
  return <Task variant="outline" size={size} className={className} />;
}
