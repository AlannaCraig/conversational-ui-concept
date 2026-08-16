'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import {
  SCHEDULE_COLUMNS, SCHEDULE_SLOTS, type ScheduleSlot, type ScheduleColumn, type AppointmentStatus, type RoleCategory,
  URGENT_CARE_SLOTS, URGENT_CARE_PATIENT, URGENT_CARE_LOCATION_META, URGENT_CARE_CLINICIAN_TYPES,
  type UrgentCareSlot, type UrgentCareLocationMeta,
} from '@/lib/appointmentsScheduleData';
import { PatientHeader } from '@/components/ui/LargeAdaptiveCards';
import { PageHeader } from '@/components/ui/PageHeader';

// ─── Layout constants ─────────────────────────────────────────────────────────

const SLOT_HEIGHT = 48;   // px per 5 minutes
const DAY_START   = 9;    // 09:00
const DAY_END     = 17;   // 17:00
const TOTAL_MINS  = (DAY_END - DAY_START) * 60;
const TOTAL_HEIGHT = (TOTAL_MINS / 5) * SLOT_HEIGHT;
const TIME_COL_W  = 68;
const COL_W       = 178;

// ─── Utilities ────────────────────────────────────────────────────────────────

function timeToY(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return ((h - DAY_START) * 60 + m) / 5 * SLOT_HEIGHT;
}

function minsToH(mins: number): number {
  return mins / 5 * SLOT_HEIGHT;
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ─── Status chip config ───────────────────────────────────────────────────────

type StatusCfg = { bg: string; text: string; border: string };

const STATUS_CFG: Record<AppointmentStatus, StatusCfg> = {
  Available:      { bg: 'var(--success-light)',       text: 'var(--success-dark)',      border: 'var(--success-main)'  },
  Booked:         { bg: 'rgba(59,130,246,0.08)',      text: '#2563eb',                  border: 'rgba(59,130,246,0.3)' },
  Arrived:        { bg: 'var(--accent3-light)',       text: 'var(--accent3-dark)',      border: 'var(--accent3-main)'  },
  'In Progress':  { bg: 'rgba(245,158,11,0.1)',       text: '#b45309',                  border: 'rgba(245,158,11,0.35)'},
  Completed:      { bg: 'var(--background-inactive)', text: 'var(--text-secondary)',    border: 'var(--border)'        },
  DNA:            { bg: 'rgba(239,68,68,0.08)',       text: '#b91c1c',                  border: 'rgba(239,68,68,0.3)'  },
  Cancelled:      { bg: 'rgba(239,68,68,0.08)',       text: '#b91c1c',                  border: 'rgba(239,68,68,0.3)'  },
  Blocked:        { bg: 'var(--background-inactive)', text: 'var(--text-secondary)',    border: 'var(--border)'        },
  Reserved:       { bg: 'var(--primary-light)',       text: 'var(--text-secondary)',    border: 'var(--border)'        },
  'Running Late': { bg: 'rgba(245,158,11,0.1)',       text: '#b45309',                  border: 'rgba(245,158,11,0.35)'},
};

// ─── Filter categories ────────────────────────────────────────────────────────

const FILTER_CATS: { id: RoleCategory | 'all'; label: string }[] = [
  { id: 'all',     label: 'All'                   },
  { id: 'doctor',  label: 'Doctors'               },
  { id: 'nurse',   label: 'Nurses'                },
  { id: 'hca',     label: 'Healthcare Assistants' },
  { id: 'clinic',  label: 'Clinics'               },
  { id: 'service', label: 'Services'              },
];

// ─── View mode ────────────────────────────────────────────────────────────────

type ViewMode = 'day' | 'urgent-care';

const VIEW_OPTIONS: { id: ViewMode; label: string }[] = [
  { id: 'day',         label: 'Day View'    },
  { id: 'urgent-care', label: 'Urgent Care' },
];

const AVAILABILITY_COLOR: Record<UrgentCareLocationMeta['availability'], string> = {
  good:    'var(--success-main)',
  limited: 'rgba(245,158,11,1)',
  scarce:  'rgba(239,68,68,1)',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusChip({ status }: { status: AppointmentStatus }) {
  const cfg = STATUS_CFG[status];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border"
      style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}
    >
      {status}
    </span>
  );
}

function AppointmentCard({ slot }: { slot: ScheduleSlot }) {
  const h = minsToH(slot.durationMins);
  const compact = h < 80;
  const veryCompact = h < 56;

  return (
    <div
      className="absolute left-1 right-1 rounded-lg border overflow-hidden"
      style={{
        top: timeToY(slot.startTime) + 2,
        height: h - 4,
        background: 'var(--background)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex flex-col h-full px-2.5 py-2 gap-0.5">
        {/* Time + menu row */}
        <div className="flex items-center justify-between flex-shrink-0">
          <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
            {slot.startTime}
          </span>
          {!veryCompact && (
            <button
              className="w-4 h-4 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="More options"
              tabIndex={-1}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
              </svg>
            </button>
          )}
        </div>

        {/* Patient name */}
        {!veryCompact && slot.patientName && (
          <p
            className="text-[12px] font-semibold leading-tight truncate flex-shrink-0"
            style={{ color: 'var(--text-primary)' }}
          >
            {slot.patientName}
          </p>
        )}

        {/* Type */}
        {!compact && slot.appointmentType && (
          <p
            className="text-[11px] leading-tight truncate flex-shrink-0"
            style={{ color: 'var(--text-secondary)' }}
          >
            {slot.appointmentType}
            <span style={{ color: 'var(--text-secondary)' }}> · {slot.durationMins} mins</span>
          </p>
        )}

        {/* Status chip — pushed to bottom */}
        {slot.status && slot.status !== 'Available' && !veryCompact && (
          <div className="mt-auto flex-shrink-0">
            <StatusChip status={slot.status} />
          </div>
        )}

        {/* Very compact fallback: just status */}
        {veryCompact && slot.status && slot.status !== 'Available' && (
          <div className="flex-1 flex items-center">
            <StatusChip status={slot.status} />
          </div>
        )}
      </div>
    </div>
  );
}

function AvailableCard({ slot }: { slot: ScheduleSlot }) {
  const h = minsToH(slot.durationMins);
  return (
    <div
      className="absolute left-1 right-1 rounded-lg overflow-hidden flex items-center px-2.5"
      style={{
        top: timeToY(slot.startTime) + 2,
        height: h - 4,
        border: '1.5px dashed var(--border)',
        background: 'transparent',
      }}
    >
      <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
        <span className="font-medium">{slot.startTime}</span>
        <span className="ml-1.5">Available</span>
      </span>
    </div>
  );
}

function BlockedCard({ slot }: { slot: ScheduleSlot }) {
  const h = minsToH(slot.durationMins);
  const compact = h < 48;
  return (
    <div
      className="absolute left-1 right-1 rounded-lg overflow-hidden flex flex-col justify-center px-2.5"
      style={{
        top: timeToY(slot.startTime) + 2,
        height: h - 4,
        background: 'var(--background-inactive)',
        border: '1px solid var(--border-light)',
      }}
    >
      {!compact && (
        <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
          {slot.startTime}
        </span>
      )}
      <span
        className="text-[12px] font-medium truncate"
        style={{ color: 'var(--text-secondary)' }}
      >
        {slot.blockedLabel}
      </span>
    </div>
  );
}

function TimeGutter() {
  const labels: { time: string; y: number; isHour: boolean }[] = [];
  for (let m = 0; m <= TOTAL_MINS; m += 5) {
    const h = Math.floor(m / 60) + DAY_START;
    const min = m % 60;
    const time = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
    labels.push({ time, y: (m / 5) * SLOT_HEIGHT, isHour: min === 0 });
  }

  return (
    <>
      {labels.map(({ time, y, isHour }) => (
        isHour ? (
          <div
            key={time}
            className="absolute right-3 flex items-start"
            style={{ top: y }}
          >
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {time}
            </span>
          </div>
        ) : (
          <div
            key={time}
            className="absolute right-3 flex items-start"
            style={{ top: y }}
          >
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {time}
            </span>
          </div>
        )
      ))}
    </>
  );
}

function GridLines() {
  const lines: { y: number; isHour: boolean }[] = [];
  for (let m = 5; m <= TOTAL_MINS; m += 5) {
    lines.push({ y: (m / 5) * SLOT_HEIGHT, isHour: m % 60 === 0 });
  }

  return (
    <>
      {lines.map(({ y, isHour }) => (
        <div
          key={y}
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: y,
            height: 1,
            background: isHour ? 'var(--border)' : 'var(--border-light)',
            opacity: isHour ? 0.7 : 0.45,
          }}
        />
      ))}
    </>
  );
}

function CurrentTimeLine({ y }: { y: number }) {
  return (
    <div
      className="absolute left-0 right-0 pointer-events-none z-20 flex items-center"
      style={{ top: y - 1 }}
    >
      {/* "Now" label */}
      <div
        className="absolute -left-1 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold"
        style={{
          background: 'var(--accent1-main)',
          color: 'var(--accent1-contrast)',
          transform: 'translateX(-100%)',
          whiteSpace: 'nowrap',
        }}
      >
        Now
      </div>
      {/* Line */}
      <div
        className="h-0.5 w-full"
        style={{ background: 'var(--accent1-main)' }}
      />
    </div>
  );
}

function WeekPicker({
  selectedDate,
  onSelect,
}: {
  selectedDate: Date;
  onSelect: (d: Date) => void;
}) {
  const [weekStart, setWeekStart] = useState(() => getMonday(selectedDate));
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="flex items-center gap-2">
      {/* Prev week */}
      <button
        onClick={() => setWeekStart(d => addDays(d, -7))}
        className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
        style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-secondary)' }}
        aria-label="Previous week"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Day buttons */}
      <div className="flex items-center gap-1">
        {days.map((day, i) => {
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);
          return (
            <button
              key={i}
              onClick={() => onSelect(day)}
              className="flex flex-col items-center gap-0.5 w-12 py-1.5 rounded-xl transition-colors"
              style={{
                background: isSelected ? 'var(--primary-main)' : 'transparent',
                color: isSelected ? 'var(--primary-contrast)' : isToday ? 'var(--accent1-main)' : 'var(--text-secondary)',
              }}
            >
              <span className="text-[11px] font-medium uppercase tracking-wide">
                {DAY_LABELS[i]}
              </span>
              <span
                className="text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full"
                style={{
                  background: isToday && !isSelected ? 'var(--accent1-light)' : 'transparent',
                  color: isToday && !isSelected ? 'var(--accent1-dark)' : 'inherit',
                }}
              >
                {day.getDate()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Next week */}
      <button
        onClick={() => setWeekStart(d => addDays(d, 7))}
        className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
        style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-secondary)' }}
        aria-label="Next week"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}

function FilterButton({
  active,
  onChange,
}: {
  active: RoleCategory | 'all';
  onChange: (f: RoleCategory | 'all') => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const isFiltered = active !== 'all';
  const activeLabel = FILTER_CATS.find(c => c.id === active)?.label ?? 'All';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium transition-colors border"
        style={{
          background: isFiltered ? 'var(--primary-main)' : 'var(--background)',
          color: isFiltered ? 'var(--primary-contrast)' : 'var(--text-secondary)',
          borderColor: isFiltered ? 'var(--primary-main)' : 'var(--border)',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39C20.25 4.95 19.78 4 18.95 4H5.04c-.83 0-1.3.95-.79 1.61z" />
        </svg>
        {isFiltered ? activeLabel : 'Filter'}
      </button>

      {open && (
        <div
          className="absolute top-full mt-1 left-0 rounded-lg border shadow-lg overflow-hidden"
          style={{
            background: 'var(--background)',
            borderColor: 'var(--border)',
            minWidth: 180,
            zIndex: 50,
          }}
        >
          {FILTER_CATS.map(cat => {
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => { onChange(cat.id); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-medium transition-colors"
                style={{
                  background: isActive ? 'var(--selected)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--hover)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <span className="w-3 flex-shrink-0">
                  {isActive && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  )}
                </span>
                {cat.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── View switcher dropdown ───────────────────────────────────────────────────

function ViewSwitcherDropdown({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const currentLabel = VIEW_OPTIONS.find(o => o.id === value)?.label ?? 'Day View';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-xl font-semibold"
        style={{ color: 'var(--text-primary)' }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {currentLabel}
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{
            color: 'var(--text-secondary)',
            transition: 'transform 0.15s',
            transform: open ? 'rotate(180deg)' : 'none',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full mt-1 left-0 rounded-lg border shadow-lg overflow-hidden"
          style={{ background: 'var(--background)', borderColor: 'var(--border)', minWidth: 160, zIndex: 50 }}
        >
          {VIEW_OPTIONS.map(opt => {
            const isActive = value === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => { onChange(opt.id); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm font-medium transition-colors"
                style={{
                  background: isActive ? 'var(--selected)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--hover)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <span className="w-4 flex-shrink-0">
                  {isActive && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  )}
                </span>
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Urgent care: inline icon helpers ────────────────────────────────────────

function UCClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function UCPinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function UCPersonIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

// ─── Urgent care: context hint config ────────────────────────────────────────

const HINT_STYLE: Record<'green' | 'blue' | 'pink', { bg: string; text: string }> = {
  green: { bg: 'var(--success-light)',   text: 'var(--success-dark)'  },
  blue:  { bg: 'rgba(59,130,246,0.08)', text: '#2563eb'               },
  pink:  { bg: 'rgba(236,72,153,0.08)', text: '#be185d'               },
};

function HintIcon({ variant }: { variant: 'green' | 'blue' | 'pink' }) {
  if (variant === 'green') return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
  if (variant === 'blue') return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  );
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  );
}

// ─── Urgent care: recommended slot card ──────────────────────────────────────

function UrgentCareRecommendedCard({ slot, rank }: { slot: UrgentCareSlot; rank: number }) {
  const isTop = rank === 1;
  return (
    <div className="py-4" style={{ borderBottom: '1px solid var(--border-light)' }}>
      <div className="flex items-start gap-4">
        {/* Rank badge */}
        <span
          className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
          style={{
            background: isTop ? '#FCD34D' : 'var(--background-inactive)',
            color: isTop ? '#92400E' : 'var(--text-secondary)',
          }}
        >
          #{rank}
        </span>

        {/* Info columns */}
        <div className="flex-1 min-w-0 flex items-start gap-5 flex-wrap">
          <div className="min-w-[80px]">
            <p className="text-xs mb-0.5" style={{ color: 'var(--text-secondary)' }}>Time</p>
            <div className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
              <UCClockIcon />
              <span className="text-lg font-bold leading-none" style={{ color: 'var(--text-primary)' }}>{slot.time}</span>
            </div>
          </div>
          <div className="min-w-[140px]">
            <p className="text-xs mb-0.5" style={{ color: 'var(--text-secondary)' }}>Location</p>
            <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>{slot.location}</p>
            <p className="text-xs" style={{ color: 'var(--accent1-main)' }}>{slot.distanceMiles} mi away</p>
          </div>
          <div className="min-w-[120px]">
            <p className="text-xs mb-0.5" style={{ color: 'var(--text-secondary)' }}>Clinician</p>
            <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>{slot.clinician}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{slot.clinicianRole}</p>
          </div>
          <div>
            <p className="text-xs mb-0.5" style={{ color: 'var(--text-secondary)' }}>Duration</p>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{slot.durationMins} mins</p>
          </div>
        </div>

        {/* Book button */}
        <button
          className="flex-shrink-0 h-10 px-5 rounded-lg text-sm font-semibold"
          style={{
            background: isTop ? 'var(--primary-main)' : 'var(--background)',
            color: isTop ? 'var(--primary-contrast)' : 'var(--text-primary)',
            border: isTop ? 'none' : '1px solid var(--border)',
          }}
        >
          {isTop ? 'Book Top Pick' : 'Book Slot'}
        </button>
      </div>

      {/* Context hint */}
      {slot.contextHint && (
        <div className="mt-2.5 ml-11">
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
            style={{ background: HINT_STYLE[slot.contextHint.variant].bg, color: HINT_STYLE[slot.contextHint.variant].text }}
          >
            <HintIcon variant={slot.contextHint.variant} />
            {slot.contextHint.text}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Urgent care: all-slots row ───────────────────────────────────────────────

function UrgentCareAllSlotRow({ slot }: { slot: UrgentCareSlot }) {
  return (
    <div
      className="flex items-start gap-5 px-4 py-3 rounded-lg border"
      style={{ background: 'var(--background)', borderColor: 'var(--border)' }}
    >
      <div className="min-w-[64px] flex-shrink-0">
        <div className="flex items-center gap-1 mb-0.5" style={{ color: 'var(--text-secondary)' }}>
          <UCClockIcon /><span className="text-xs">Time</span>
        </div>
        <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{slot.time}</span>
      </div>
      <div className="flex-1 min-w-[120px]">
        <div className="flex items-center gap-1 mb-0.5" style={{ color: 'var(--text-secondary)' }}>
          <UCPinIcon /><span className="text-xs">Location</span>
        </div>
        <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>{slot.location}</p>
        <p className="text-xs" style={{ color: 'var(--accent1-main)' }}>{slot.distanceMiles} mi away</p>
      </div>
      <div className="flex-1 min-w-[120px]">
        <div className="flex items-center gap-1 mb-0.5" style={{ color: 'var(--text-secondary)' }}>
          <UCPersonIcon /><span className="text-xs">Clinician</span>
        </div>
        <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>{slot.clinician}</p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{slot.clinicianRole}</p>
      </div>
      <div className="min-w-[64px] flex-shrink-0">
        <div className="flex items-center gap-1 mb-0.5" style={{ color: 'var(--text-secondary)' }}>
          <UCClockIcon /><span className="text-xs">Duration</span>
        </div>
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{slot.durationMins} mins</span>
      </div>
      <div className="flex-shrink-0 flex items-center self-center">
        <button
          className="h-9 px-4 rounded-lg text-sm font-semibold"
          style={{ background: 'var(--primary-main)', color: 'var(--primary-contrast)' }}
        >
          Book Slot
        </button>
      </div>
    </div>
  );
}

// ─── Urgent care view ─────────────────────────────────────────────────────────

function UrgentCareView() {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedClinicianTypes, setSelectedClinicianTypes] = useState<string[]>([]);
  const [locationSearch, setLocationSearch] = useState(URGENT_CARE_PATIENT.postcode);
  const allSlotsRef = useRef<HTMLDivElement>(null);

  const toggleLocation = (loc: string) =>
    setSelectedLocations(prev => prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]);

  const toggleClinicianType = (type: string) =>
    setSelectedClinicianTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);

  const filteredSlots = useMemo(() => URGENT_CARE_SLOTS.filter(slot => {
    if (selectedLocations.length > 0 && !selectedLocations.includes(slot.location)) return false;
    if (selectedClinicianTypes.length > 0 && !selectedClinicianTypes.includes(slot.clinicianType)) return false;
    return true;
  }), [selectedLocations, selectedClinicianTypes]);

  const recommendedSlots = filteredSlots.filter(s => s.isRecommended);
  const allSlots = filteredSlots.filter(s => !s.isRecommended);

  const slotGroups = useMemo(() => {
    const groups: { time: string; slots: UrgentCareSlot[] }[] = [];
    for (const slot of allSlots) {
      const g = groups.find(gr => gr.time === slot.time);
      if (g) g.slots.push(slot);
      else groups.push({ time: slot.time, slots: [slot] });
    }
    return groups;
  }, [allSlots]);

  const dateLabel = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }, []);

  const earliestAllSlot = allSlots[0];

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">

      {/* ── Main slots column ── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <PatientHeader className="mx-6 mb-4" />

        <div className="flex-1 overflow-auto conversation-scroll px-6 py-5">

          {/* Available slots header */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Available Slots</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Showing {filteredSlots.length} slots on {dateLabel}
              </p>
            </div>
            {earliestAllSlot && (
              <p className="text-xs flex-shrink-0 pt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Earliest:{' '}
                <span className="font-bold" style={{ color: 'var(--accent1-main)' }}>{earliestAllSlot.time}</span>
                {' '}at{' '}
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{earliestAllSlot.location}</span>
              </p>
            )}
          </div>

          {filteredSlots.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No slots match the current filters</p>
              <button
                className="text-xs"
                style={{ color: 'var(--accent1-main)' }}
                onClick={() => { setSelectedLocations([]); setSelectedClinicianTypes([]); }}
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Recommended slots box */}
          {recommendedSlots.length > 0 && (
            <div
              className="rounded-xl border mb-6"
              style={{ background: 'var(--background)', borderColor: 'var(--border)' }}
            >
              <div className="px-5 pt-4">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(59,130,246,0.1)' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#3B82F6">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Recommended Slots</span>
                  </div>
                  <span
                    className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--success-light)', color: 'var(--success-dark)' }}
                  >
                    ✓ Updated for filters
                  </span>
                </div>
                <p className="text-xs ml-9" style={{ color: 'var(--text-secondary)' }}>
                  Smart suggestions based on patient location and urgency
                </p>
              </div>

              <div className="px-5">
                {recommendedSlots.map((slot, i) => (
                  <UrgentCareRecommendedCard key={slot.id} slot={slot} rank={i + 1} />
                ))}
              </div>

              <div className="px-5 py-3" style={{ borderTop: '1px solid var(--border-light)' }}>
                <p className="text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Not what you need?{' '}
                  <button
                    className="font-medium"
                    style={{ color: 'var(--accent1-main)' }}
                    onClick={() => allSlotsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    View all {filteredSlots.length} available slots below
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* All available slots */}
          {allSlots.length > 0 && (
            <div ref={allSlotsRef}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>All Available Slots</h3>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{allSlots.length} slots</span>
              </div>
              <div className="space-y-4">
                {slotGroups.map(group => (
                  <div key={group.time}>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-md"
                        style={{ background: 'var(--accent1-main)', color: 'var(--accent1-contrast)' }}
                      >
                        {group.time}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {group.slots.length} {group.slots.length === 1 ? 'slot' : 'slots'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {group.slots.map(slot => (
                        <UrgentCareAllSlotRow key={slot.id} slot={slot} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Filter panel ── */}
      <div
        className="w-72 flex-shrink-0 flex flex-col overflow-hidden"
        style={{ borderLeft: '1px solid var(--border)', background: 'var(--background-soft)' }}
      >
        <div
          className="flex-shrink-0 px-4 pt-4 pb-3"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Find Available Slots</h2>
        </div>

        <div className="flex-1 overflow-auto conversation-scroll px-4 py-4 space-y-4">

          {/* Search by location */}
          <div>
            <p className="text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Search by Location</p>
            <div
              className="flex items-center gap-2 px-3 h-9 rounded-lg border"
              style={{ background: 'var(--background)', borderColor: 'var(--border)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <input
                type="text"
                value={locationSearch}
                onChange={e => setLocationSearch(e.target.value)}
                className="flex-1 bg-transparent text-xs outline-none"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Select from suggestions or press Enter</p>
          </div>

          {/* Date */}
          <div>
            <p className="text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Date</p>
            <div
              className="flex items-center gap-2 px-3 h-9 rounded-lg border"
              style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
          </div>

          {/* Time window */}
          <div>
            <p className="text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Time Window</p>
            <div
              className="flex items-center gap-2 px-3 h-9 rounded-lg border"
              style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)' }} />

          {/* Locations */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Locations</p>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>(within 5mi)</span>
            </div>
            <div
              className="flex items-center gap-2 px-3 h-8 rounded-lg border mb-2.5"
              style={{ background: 'var(--background)', borderColor: 'var(--border)' }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                className="flex-1 bg-transparent text-xs outline-none"
                style={{ color: 'var(--text-secondary)' }}
                placeholder="Search locations..."
              />
            </div>
            <div className="space-y-0.5">
              {URGENT_CARE_LOCATION_META.map(loc => {
                const isActive = selectedLocations.includes(loc.name);
                return (
                  <button
                    key={loc.name}
                    onClick={() => toggleLocation(loc.name)}
                    className="w-full flex items-center justify-between px-2 py-2 rounded-lg text-left"
                    style={{ background: isActive ? 'var(--selected)' : 'transparent' }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--hover)'; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <div className="min-w-0 flex-1 mr-2">
                      <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{loc.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{loc.distanceMiles} mi away</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{loc.slotCount}</span>
                      <span
                        className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                        style={{ background: AVAILABILITY_COLOR[loc.availability] }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-secondary)' }}>
              Showing {URGENT_CARE_LOCATION_META.length} of {URGENT_CARE_LOCATION_META.length} locations
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)' }} />

          {/* Clinician type */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Clinician Type</p>
            </div>
            <div className="space-y-0.5">
              {URGENT_CARE_CLINICIAN_TYPES.map(type => {
                const isActive = selectedClinicianTypes.includes(type.label);
                return (
                  <button
                    key={type.id}
                    onClick={() => toggleClinicianType(type.label)}
                    className="w-full flex items-center justify-between px-2 py-2 rounded-lg text-left"
                    style={{ background: isActive ? 'var(--selected)' : 'transparent' }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--hover)'; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{type.label}</span>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{type.count} available</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

interface AppointmentsDayViewProps {
  onClose?: () => void;
}

export function AppointmentsDayView({ onClose }: AppointmentsDayViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [activeFilter, setActiveFilter] = useState<RoleCategory | 'all'>('all');
  const [currentTimeY, setCurrentTimeY] = useState<number | null>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);

  // Update current-time indicator
  useEffect(() => {
    function update() {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      if (h >= DAY_START && h < DAY_END) {
        const minsFromStart = (h - DAY_START) * 60 + m;
        setCurrentTimeY((minsFromStart / 5) * SLOT_HEIGHT);
      } else {
        setCurrentTimeY(null);
      }
    }
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to current time (or 09:00) on mount
  useEffect(() => {
    if (!scheduleRef.current) return;
    const scrollTo = currentTimeY !== null
      ? Math.max(0, currentTimeY - 120)
      : 0;
    scheduleRef.current.scrollTop = scrollTo;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleColumns = useMemo(
    () => activeFilter === 'all'
      ? SCHEDULE_COLUMNS
      : SCHEDULE_COLUMNS.filter(c => c.category === activeFilter),
    [activeFilter]
  );

  const slotsByColumn = useMemo(() => {
    const map: Record<string, ScheduleSlot[]> = {};
    for (const col of visibleColumns) {
      map[col.id] = SCHEDULE_SLOTS.filter(s => s.columnId === col.id);
    }
    return map;
  }, [visibleColumns]);

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: 'var(--background-soft)' }}
    >
      {/* ── View header ── */}
      <PageHeader
        title={<ViewSwitcherDropdown value={viewMode} onChange={setViewMode} />}
        className="px-6 pt-5 pb-4"
      />

      {/* ── Week picker + filter button — Day View only ── */}
      {viewMode === 'day' && (
        <div
          className="flex-shrink-0 flex items-center px-6 py-4"
        >
          <div className="flex-1 flex items-center">
            <FilterButton active={activeFilter} onChange={setActiveFilter} />
          </div>
          <WeekPicker selectedDate={selectedDate} onSelect={setSelectedDate} />
          <div className="flex-1" />
        </div>
      )}

      {/* ── Urgent Care / Schedule grid ── */}
      {viewMode === 'urgent-care' ? <UrgentCareView /> : (
      <div className="flex-1 overflow-hidden min-h-0">
        <div
          ref={scheduleRef}
          className="h-full overflow-auto conversation-scroll"
          style={{ scrollbarGutter: 'stable' }}
        >
          {/* Wrapper: at least min-width for many columns, but fills viewport when few */}
          <div style={{ minWidth: TIME_COL_W + COL_W * visibleColumns.length, width: '100%' }}>

            {/* Column headers — sticky top */}
            <div
              className="flex sticky top-0 z-20"
              style={{
                background: 'var(--background-soft)',
              }}
            >
              {/* Corner cell — sticky left */}
              <div
                className="flex-shrink-0 sticky left-0 z-30"
                style={{
                  width: TIME_COL_W,
                  background: 'var(--background-soft)',
                }}
              />
              {/* Column headers — flex-1 so they fill available width */}
              {visibleColumns.map((col: ScheduleColumn) => (
                <div
                  key={col.id}
                  className="px-3 py-2.5"
                  style={{
                    flex: `1 1 ${COL_W}px`,
                    minWidth: COL_W,
                    background: 'var(--background-soft)',
                  }}
                >
                  <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
                    {col.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {col.role}
                  </p>
                  {col.sessionLabel && (
                    <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--accent3-main)' }}>
                      {col.sessionLabel}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Schedule body */}
            <div className="flex">
              {/* Time gutter — sticky left */}
              <div
                className="flex-shrink-0 sticky left-0 z-10 relative"
                style={{
                  width: TIME_COL_W,
                  height: TOTAL_HEIGHT,
                  background: 'var(--background-soft)',
                }}
              >
                <TimeGutter />
              </div>

              {/* Appointment columns area — flex-1 so it fills available width */}
              <div className="relative flex flex-1" style={{ height: TOTAL_HEIGHT }}>
                {/* Grid lines — width: 100% fills the columns area */}
                <GridLines />

                {/* Current time line — width: 100% */}
                {currentTimeY !== null && (
                  <CurrentTimeLine y={currentTimeY} />
                )}

                {/* Per-column slots — flex-1 so they share available width */}
                {visibleColumns.map((col: ScheduleColumn) => (
                  <div
                    key={col.id}
                    className="relative group"
                    style={{
                      flex: `1 1 ${COL_W}px`,
                      minWidth: COL_W,
                      height: TOTAL_HEIGHT,
                    }}
                  >
                    {(slotsByColumn[col.id] ?? []).map((slot: ScheduleSlot) => {
                      if (slot.type === 'appointment') return <AppointmentCard key={slot.id} slot={slot} />;
                      if (slot.type === 'available')   return <AvailableCard   key={slot.id} slot={slot} />;
                      if (slot.type === 'blocked')     return <BlockedCard     key={slot.id} slot={slot} />;
                      return null;
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
