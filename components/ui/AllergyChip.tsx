'use client';

import { AllergyIcon, AllergyUnavailableIcon } from '@/components/icons';

export type AllergyStatus =
  | 'known'        // Patient has recorded allergies
  | 'none'         // No known allergies confirmed
  | 'not-recorded' // No allergy information has been recorded
  | 'unavailable'; // Allergy data cannot be retrieved

interface AllergyChipProps {
  status: AllergyStatus;
  className?: string;
}

const CHIP_CONFIG: Record<AllergyStatus, {
  label: string;
  icon: 'allergy' | 'unavailable';
  bg: string;
  border: string;
  text: string;
}> = {
  known: {
    label: 'Known allergies',
    icon: 'allergy',
    bg: 'bg-accent1-contrast',
    border: 'border border-accent1-dark',
    text: 'text-accent1-dark',
  },
  none: {
    label: 'No known allergies',
    icon: 'allergy',
    bg: 'bg-accent3-contrast',
    border: 'border border-accent3-light',
    text: 'text-accent3-dark',
  },
  'not-recorded': {
    label: 'No allergies recorded',
    icon: 'unavailable',
    bg: 'bg-accent3-contrast',
    border: 'border border-accent3-light',
    text: 'text-accent3-dark',
  },
  unavailable: {
    label: 'Allergies unavailable',
    icon: 'unavailable',
    bg: 'bg-accent1-contrast',
    border: 'border border-accent1-dark',
    text: 'text-accent1-dark',
  },
};

export function AllergyChip({ status, className = '' }: AllergyChipProps) {
  const config = CHIP_CONFIG[status];

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg flex-shrink-0 ${config.bg} ${config.border} ${className}`}
    >
      {config.icon === 'allergy' ? (
        <AllergyIcon size={20} className={config.text} />
      ) : (
        <AllergyUnavailableIcon size={20} className={config.text} />
      )}
      <span className={`text-sm whitespace-nowrap ${config.text}`}>
        {config.label}
      </span>
    </div>
  );
}
