'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { SCHEDULE_COLUMNS, SCHEDULE_SLOTS, type ScheduleSlot, type ScheduleColumn, type AppointmentStatus, type RoleCategory } from '@/lib/appointmentsScheduleData';

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
          <span className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
            {slot.startTime}
          </span>
          {!veryCompact && (
            <button
              className="w-4 h-4 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
              style={{ color: 'var(--text-tertiary)' }}
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
            <span style={{ color: 'var(--text-tertiary)' }}> · {slot.durationMins} mins</span>
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
      <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
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
        <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
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
            <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
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
  for (let m = 0; m <= TOTAL_MINS; m += 5) {
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

// ─── Main view ────────────────────────────────────────────────────────────────

interface AppointmentsDayViewProps {
  onClose?: () => void;
}

export function AppointmentsDayView({ onClose }: AppointmentsDayViewProps) {
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
      <div
        className="flex-shrink-0 flex items-center justify-between px-6 pt-5 pb-0"
        style={{ background: 'var(--background-soft)' }}
      >
        <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Day View
        </h1>
        <div className="flex items-center gap-2">
          <button
            className="h-9 px-4 text-sm font-medium rounded-lg border transition-colors"
            style={{
              background: 'var(--background)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            + New appointment
          </button>
        </div>
      </div>

      {/* ── Week picker + filter button — picker centred ── */}
      <div
        className="flex-shrink-0 flex items-center px-6 py-4"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex-1 flex items-center">
          <FilterButton active={activeFilter} onChange={setActiveFilter} />
        </div>
        <WeekPicker selectedDate={selectedDate} onSelect={setSelectedDate} />
        <div className="flex-1" />
      </div>

      {/* ── Schedule grid ── */}
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
                  borderRight: '1px solid var(--border)',
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
    </div>
  );
}
