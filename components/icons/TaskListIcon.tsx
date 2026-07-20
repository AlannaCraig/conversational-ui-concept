import { Task } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function TaskListIcon({ size = 24, className = '' }: Props) {
  return <Task variant="duotone" size={size} className={className} />;
}
