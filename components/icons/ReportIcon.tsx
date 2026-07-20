import { ChartLine } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function ReportIcon({ size = 24, className = '' }: Props) {
  return <ChartLine variant="duotone" size={size} className={className} />;
}
