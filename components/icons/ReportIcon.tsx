import { ChartLine } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function ReportIcon({ size = 24, className = '' }: Props) {
  return <ChartLine variant="outline" size={size} className={className} />;
}
