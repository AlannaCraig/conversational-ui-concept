'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from './Button';
import { getMonday, addDays, isSameDay, DAY_LABELS, MONTH_NAMES } from '@/lib/dateUtils';

// ─── CalendarDropdown — month-grid date picker ────────────────────────────────

function CalendarDropdown({
  selectedDate,
  onSelect,
}: {
  selectedDate: Date;
  onSelect: (d: Date) => void;
}) {
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(viewYear, viewMonth, day));
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        right: 0,
        width: 256,
        background: 'var(--background)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        boxShadow: '0 8px 24px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        zIndex: 100,
        padding: '12px 12px 10px',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <Button variant="icon" size="xs" onClick={prevMonth} aria-label="Previous month" style={{ border: 'none', background: 'none' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Button>
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <Button variant="icon" size="xs" onClick={nextMonth} aria-label="Next month" style={{ border: 'none', background: 'none' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="h-7 flex items-center justify-center text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((date, i) => {
          if (!date) return <div key={i} className="h-8" />;
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          return (
            <button
              key={i}
              onClick={() => onSelect(date)}
              className="h-8 flex items-center justify-center rounded-full text-[12px] transition-colors"
              style={{
                background: isSelected ? 'var(--primary-main)' : isToday ? 'var(--accent1-light)' : 'transparent',
                color: isSelected ? 'var(--primary-contrast)' : isToday ? 'var(--accent1-dark)' : 'var(--text-primary)',
                fontWeight: isSelected || isToday ? 600 : 400,
              }}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
        <button
          onClick={() => onSelect(today)}
          className="w-full py-1.5 text-[12px] font-medium rounded-lg text-center transition-colors"
          style={{ color: 'var(--accent1-main)' }}
        >
          Today
        </button>
      </div>
    </div>
  );
}

// ─── WeekPicker ───────────────────────────────────────────────────────────────

export interface WeekPickerProps {
  selectedDate: Date;
  onSelect: (d: Date) => void;
}

export function WeekPicker({ selectedDate, onSelect }: WeekPickerProps) {
  const [weekStart, setWeekStart] = useState(() => getMonday(selectedDate));
  const [calOpen, setCalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Sync weekStart when selectedDate jumps to a different week
  useEffect(() => {
    const monday = getMonday(selectedDate);
    if (monday.getTime() !== weekStart.getTime()) setWeekStart(monday);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // Close calendar on outside click
  useEffect(() => {
    if (!calOpen) return;
    function handle(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setCalOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [calOpen]);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div ref={containerRef} className="relative flex items-center gap-2">
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
          const isDayToday = isSameDay(day, today);
          return (
            <button
              key={i}
              onClick={() => onSelect(day)}
              className="flex flex-col items-center gap-0.5 w-12 py-1.5 rounded-xl transition-colors"
              style={{
                background: isSelected ? 'var(--primary-main)' : 'transparent',
                color: isSelected ? 'var(--primary-contrast)' : isDayToday ? 'var(--accent1-main)' : 'var(--text-secondary)',
              }}
            >
              <span className="text-[11px] font-medium uppercase tracking-wide">
                {DAY_LABELS[i]}
              </span>
              <span
                className="text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full"
                style={{
                  background: isDayToday && !isSelected ? 'var(--accent1-light)' : 'transparent',
                  color: isDayToday && !isSelected ? 'var(--accent1-dark)' : 'inherit',
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

      {/* Calendar date picker toggle */}
      <button
        onClick={() => setCalOpen(o => !o)}
        className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
        style={{
          border: '1px solid var(--border)',
          background: calOpen ? 'var(--hover)' : 'var(--background)',
          color: calOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
        }}
        aria-label="Open date picker"
        aria-expanded={calOpen}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>

      {calOpen && (
        <CalendarDropdown
          selectedDate={selectedDate}
          onSelect={d => { onSelect(d); setCalOpen(false); }}
        />
      )}
    </div>
  );
}
