import { ArrowRight } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function ArrowRightIcon({ size = 24, className = '' }: Props) {
  return <ArrowRight variant="outline" size={size} className={className} />;
}
