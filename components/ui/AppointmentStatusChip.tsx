'use client';

import type { AppointmentStatus } from '@/lib/appointmentsScheduleData';

export type StatusCfg = { bg: string; text: string; border: string };

export const APPOINTMENT_STATUS_CFG: Record<AppointmentStatus, StatusCfg> = {
  Available:      { bg: 'var(--success-light)',       text: 'var(--success-dark)',   border: 'var(--success-main)'           },
  Booked:         { bg: 'rgba(59,130,246,0.08)',      text: '#2563eb',               border: 'rgba(59,130,246,0.3)'          },
  Arrived:        { bg: 'var(--accent3-light)',       text: 'var(--accent3-dark)',   border: 'var(--accent3-main)'           },
  'In Progress':  { bg: 'rgba(245,158,11,0.1)',       text: '#b45309',               border: 'rgba(245,158,11,0.35)'         },
  Completed:      { bg: 'var(--background-inactive)', text: 'var(--text-secondary)', border: 'var(--border)'                 },
  DNA:            { bg: 'rgba(239,68,68,0.08)',       text: '#b91c1c',               border: 'rgba(239,68,68,0.3)'           },
  Cancelled:      { bg: 'rgba(239,68,68,0.08)',       text: '#b91c1c',               border: 'rgba(239,68,68,0.3)'           },
  Blocked:        { bg: 'var(--background-inactive)', text: 'var(--text-secondary)', border: 'var(--border)'                 },
  Reserved:       { bg: 'var(--primary-light)',       text: 'var(--text-secondary)', border: 'var(--border)'                 },
  'Running Late': { bg: 'rgba(245,158,11,0.1)',       text: '#b45309',               border: 'rgba(245,158,11,0.35)'         },
};

export function appointmentStatusAccent(status: AppointmentStatus | undefined): string {
  if (!status) return 'var(--border)';
  return APPOINTMENT_STATUS_CFG[status]?.border ?? 'var(--border)';
}

export function AppointmentStatusChip({ status }: { status: AppointmentStatus }) {
  const cfg = APPOINTMENT_STATUS_CFG[status] ?? APPOINTMENT_STATUS_CFG.Booked;
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
