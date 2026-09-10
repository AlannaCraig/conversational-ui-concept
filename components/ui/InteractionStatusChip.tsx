'use client';

import type { InteractionStatus } from '@/lib/appointmentsScheduleData';

type InteractionStatusCfg = { bg: string; text: string; border: string };

export const INTERACTION_STATUS_CFG: Record<InteractionStatus, InteractionStatusCfg> = {
  'To do':      { bg: 'var(--background-soft)',    text: 'var(--text-secondary)', border: 'var(--border)'          },
  'In progress':{ bg: 'rgba(245,158,11,0.1)',      text: '#b45309',               border: 'rgba(245,158,11,0.35)'  },
  'Completed':  { bg: 'var(--success-light)',      text: 'var(--success-dark)',   border: 'var(--success-main)'    },
};

export function InteractionStatusChip({ status }: { status: InteractionStatus }) {
  const cfg = INTERACTION_STATUS_CFG[status] ?? INTERACTION_STATUS_CFG['To do'];
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center',
        padding: '2px 8px', borderRadius: 20,
        fontSize: 11, fontWeight: 600,
        background: cfg.bg, color: cfg.text,
        border: `1px solid ${cfg.border}`,
        whiteSpace: 'nowrap', flexShrink: 0,
      }}
    >
      {status}
    </span>
  );
}
