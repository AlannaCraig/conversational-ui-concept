'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  SCHEDULE_COLUMNS, SCHEDULE_SLOTS, type ScheduleSlot, type ScheduleColumn, type AppointmentStatus, type RoleCategory,
  URGENT_CARE_SLOTS, URGENT_CARE_PATIENT, URGENT_CARE_LOCATION_META, URGENT_CARE_CLINICIAN_TYPES,
  type UrgentCareSlot, type UrgentCareLocationMeta,
} from '@/lib/appointmentsScheduleData';
import { PatientBanner, PatientSummaryCard } from '@/components/ui/LargeAdaptiveCards/PatientSummaryCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { AppointmentHoverCard } from './AppointmentHoverCard';

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

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins} mins`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (m === 0) return h === 1 ? '1 hr' : `${h} hrs`;
  return `${h} hr ${m} mins`;
}

function seededRandom(seed: string): number {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = ((h * 33) ^ seed.charCodeAt(i)) >>> 0;
  }
  return h / 0xffffffff;
}

function availabilityFactor(daysDiff: number): number {
  if (daysDiff <= 0) return 0;
  if (daysDiff === 1) return 0.12;
  if (daysDiff === 2) return 0.25;
  if (daysDiff === 3) return 0.36;
  if (daysDiff <= 5) return 0.48;
  if (daysDiff <= 7) return 0.57;
  if (daysDiff <= 14) return 0.66;
  if (daysDiff <= 21) return 0.74;
  if (daysDiff <= 30) return 0.81;
  return 0.87;
}

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

// ─── Status logic ─────────────────────────────────────────────────────────────

function getValidStatuses(
  _selectedDate: Date,
  _startTime: string,
  _durationMins: number,
): AppointmentStatus[] {
  return ['Booked', 'Arrived', 'In Progress', 'Completed', 'DNA', 'Cancelled'];
}

// ─── Status dropdown ──────────────────────────────────────────────────────────

function StatusDropdownContent({
  slot,
  selectedDate,
  anchorRect,
  onSelect,
  onClose,
}: {
  slot: ScheduleSlot;
  selectedDate: Date;
  anchorRect: DOMRect;
  onSelect: (s: AppointmentStatus) => void;
  onClose: () => void;
}) {
  const validStatuses = getValidStatuses(selectedDate, slot.startTime, slot.durationMins);
  const current = slot.status as AppointmentStatus | undefined;

  const ITEM_H = 36, PAD = 6, DROP_W = 164;
  const dropH = validStatuses.length * ITEM_H + PAD * 2;

  let top = anchorRect.bottom + 4;
  if (top + dropH > window.innerHeight - 8) top = anchorRect.top - dropH - 4;
  top = Math.max(8, top);
  let left = anchorRect.left;
  if (left + DROP_W > window.innerWidth - 8) left = window.innerWidth - DROP_W - 8;
  left = Math.max(8, left);

  return createPortal(
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
        onMouseDown={onClose}
      />
      <div
        style={{
          position: 'fixed', top, left, width: DROP_W, zIndex: 9999,
          background: 'var(--background)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          boxShadow: '0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
          padding: `${PAD}px`,
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        {validStatuses.map(status => {
          const cfg = STATUS_CFG[status];
          const isActive = status === current;
          return (
            <button
              key={status}
              onClick={e => { e.stopPropagation(); onSelect(status); onClose(); }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors"
              style={{ background: isActive ? 'var(--hover)' : 'transparent' }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--hover)'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <span
                className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-medium border"
                style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}
              >
                {status}
              </span>
              {isActive && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', flexShrink: 0, color: 'var(--text-secondary)' }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </>,
    document.body,
  );
}

function StatusDropdown(props: {
  slot: ScheduleSlot;
  selectedDate: Date;
  anchorRect: DOMRect;
  onSelect: (s: AppointmentStatus) => void;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <StatusDropdownContent {...props} />;
}

// ─── Appointment card ─────────────────────────────────────────────────────────

function AppointmentCard({
  slot,
  selectedDate,
  onStatusChange,
  onSlotClick,
  onActionClick,
}: {
  slot: ScheduleSlot;
  selectedDate: Date;
  onStatusChange: (s: AppointmentStatus) => void;
  onSlotClick: () => void;
  onActionClick: (rect: DOMRect) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [statusDropOpen, setStatusDropOpen] = useState(false);
  const [statusAnchorRect, setStatusAnchorRect] = useState<DOMRect | null>(null);

  const h = minsToH(slot.durationMins);
  const compact = h < 80;
  const veryCompact = h < 56;
  const hasStatus = !!slot.status && slot.status !== 'Available';

  function handleMouseEnter() {
    hoverTimer.current = setTimeout(() => {
      if (wrapperRef.current) {
        setAnchorRect(wrapperRef.current.getBoundingClientRect());
        setHovered(true);
      }
    }, 150);
  }

  function handleMouseLeave() {
    if (hoverTimer.current) { clearTimeout(hoverTimer.current); hoverTimer.current = null; }
    setHovered(false);
    setAnchorRect(null);
  }

  function handleStatusClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (hoverTimer.current) { clearTimeout(hoverTimer.current); hoverTimer.current = null; }
    setHovered(false);
    setAnchorRect(null);
    setStatusAnchorRect((e.currentTarget as HTMLElement).getBoundingClientRect());
    setStatusDropOpen(true);
  }

  useEffect(() => {
    return () => { if (hoverTimer.current) clearTimeout(hoverTimer.current); };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="absolute left-1 right-1 group hover:z-50"
      style={{
        top: timeToY(slot.startTime) + 2,
        height: h - 4,
        cursor: 'pointer',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onSlotClick}
    >
      <div
        className="w-full h-full rounded-lg border overflow-hidden"
        style={{ background: 'var(--background)', borderColor: 'var(--border)' }}
      >
        <div className="flex flex-col h-full px-2.5 py-2 gap-0.5">
          {/* Time + menu row */}
          <div className="flex items-center justify-between flex-shrink-0">
            <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
              {slot.startTime}
            </span>
            {!veryCompact && (
              <button
                className="w-4 h-4 flex items-center justify-center rounded opacity-40 group-hover:opacity-100 transition-opacity hover:opacity-100"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="More options"
                tabIndex={0}
                onClick={e => { e.stopPropagation(); if (hoverTimer.current) { clearTimeout(hoverTimer.current); hoverTimer.current = null; } setHovered(false); setAnchorRect(null); onActionClick((e.currentTarget as HTMLElement).getBoundingClientRect()); }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                </svg>
              </button>
            )}
          </div>

          {/* Patient name */}
          {!veryCompact && slot.patientName && (
            <p className="text-[12px] font-semibold leading-tight truncate flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
              {slot.patientName}
            </p>
          )}

          {/* Type */}
          {!compact && slot.appointmentType && (
            <p className="text-[11px] leading-tight truncate flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
              {slot.appointmentType}
              <span> · {slot.durationMins} mins</span>
            </p>
          )}

          {/* Status chip — pushed to bottom, clickable to change */}
          {hasStatus && !veryCompact && (
            <div className="mt-auto flex-shrink-0">
              <div
                role="button"
                tabIndex={0}
                onClick={handleStatusClick}
                className="inline-flex rounded-full cursor-pointer transition-opacity hover:opacity-70"
                title="Change status"
              >
                <StatusChip status={slot.status as AppointmentStatus} />
              </div>
            </div>
          )}

          {/* Very compact: status only */}
          {veryCompact && hasStatus && (
            <div className="flex-1 flex items-center">
              <div
                role="button"
                tabIndex={0}
                onClick={handleStatusClick}
                className="inline-flex rounded-full cursor-pointer transition-opacity hover:opacity-70"
                title="Change status"
              >
                <StatusChip status={slot.status as AppointmentStatus} />
              </div>
            </div>
          )}
        </div>
      </div>

      {hovered && anchorRect !== null && !!slot.patientName && (
        <AppointmentHoverCard slot={slot} anchorRect={anchorRect} />
      )}

      {statusDropOpen && statusAnchorRect !== null && (
        <StatusDropdown
          slot={slot}
          selectedDate={selectedDate}
          anchorRect={statusAnchorRect}
          onSelect={onStatusChange}
          onClose={() => { setStatusDropOpen(false); setStatusAnchorRect(null); }}
        />
      )}
    </div>
  );
}

function AvailableCard({ slot, onClick }: { slot: ScheduleSlot; onClick: () => void }) {
  const h = minsToH(slot.durationMins);
  const [hov, setHov] = useState(false);
  return (
    <div
      className="absolute left-1 right-1 rounded-lg overflow-hidden flex flex-col justify-center px-2.5"
      style={{
        top: timeToY(slot.startTime) + 2,
        height: h - 4,
        border: '1.5px dashed var(--border)',
        background: hov ? 'var(--hover)' : 'transparent',
        cursor: 'pointer',
        transition: 'background 0.1s',
      }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
        <span className="font-medium">{slot.startTime}</span>
        <span className="ml-1.5">Available</span>
      </span>
      <span className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary, var(--text-secondary))', opacity: 0.7 }}>
        {formatDuration(slot.durationMins)}
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

// ─── Mock patient data ────────────────────────────────────────────────────────

interface MockPatient {
  id: string;
  name: string;
  dob: string;
  chiNumber: string;
  sex: string;
  phone: string;
  address: string;
}

const MOCK_PATIENTS: MockPatient[] = [
  { id: 'p-001', name: 'WALSH, Peter (Mr)',        dob: '14/03/1958', chiNumber: '312748 5091', sex: 'Male',   phone: '07891 234 560', address: '42 Ashdown Road, Birmingham B15 2TN'   },
  { id: 'p-002', name: 'DOBSON, Irene (Mrs)',       dob: '22/07/1941', chiNumber: '450619 2837', sex: 'Female', phone: '07723 456 781', address: '8 Clover Lane, Manchester M14 6PQ'      },
  { id: 'p-003', name: 'HARTLEY, Charles (Mr)',     dob: '05/11/1965', chiNumber: '871304 6152', sex: 'Male',   phone: '07654 321 098', address: '19 Mill Street, Leeds LS6 3AB'          },
  { id: 'p-004', name: 'PATEL, Susan (Mrs)',        dob: '30/01/1972', chiNumber: '629015 3874', sex: 'Female', phone: '07512 876 543', address: '7 Linwood Close, Coventry CV3 5RN'      },
  { id: 'p-005', name: 'HOLMES, Margaret (Mrs)',    dob: '18/09/1953', chiNumber: '483920 1754', sex: 'Female', phone: '07832 156 490', address: '3 Fairview Drive, Sheffield S7 2WP'     },
  { id: 'p-006', name: 'CRAWFORD, Thomas (Mr)',     dob: '27/06/1980', chiNumber: '261083 7492', sex: 'Male',   phone: '07910 244 033', address: '55 Birchwood Avenue, Bristol BS4 1LX'   },
  { id: 'p-007', name: 'FARROW, Nina (Ms)',         dob: '09/12/1989', chiNumber: '739452 8163', sex: 'Female', phone: '07741 882 317', address: '12 Oakfield Road, Liverpool L15 3HE'    },
  { id: 'p-008', name: 'ASHWORTH, Linda (Mrs)',     dob: '03/04/1967', chiNumber: '193507 4826', sex: 'Female', phone: '07346 890 123', address: '28 Hawthorn Close, Nottingham NG3 2GX'  },
  { id: 'p-009', name: 'BAINES, Christopher (Mr)',  dob: '16/08/1956', chiNumber: '748261 0935', sex: 'Male',   phone: '07867 012 345', address: '6 Parkway Gardens, Leicester LE2 8AQ'  },
  { id: 'p-010', name: 'MURRAY, David (Mr)',        dob: '11/02/1948', chiNumber: '927146 3580', sex: 'Male',   phone: '07712 678 901', address: '15 Broom Crescent, Edinburgh EH9 2JQ'   },
  { id: 'p-011', name: 'CLARKSON, Brian (Mr)',      dob: '20/05/1974', chiNumber: '236874 1059', sex: 'Male',   phone: '07634 890 123', address: '9 Willow Road, Oxford OX4 3PR'          },
  { id: 'p-012', name: 'NEVILLE, Patricia (Mrs)',   dob: '07/10/1963', chiNumber: '384920 6751', sex: 'Female', phone: '07478 234 567', address: '34 Chestnut Avenue, Cardiff CF14 7NB'   },
  { id: 'p-013', name: 'REED, James (Mr)',          dob: '25/04/1977', chiNumber: '519083 2647', sex: 'Male',   phone: '07558 123 456', address: '17 Elm Close, Norwich NR3 4DY'          },
  { id: 'p-014', name: 'PORTER, Angela (Ms)',       dob: '12/09/1985', chiNumber: '672341 8950', sex: 'Female', phone: '07799 345 678', address: '6 Victoria Terrace, Brighton BN1 2LQ'   },
  { id: 'p-015', name: 'THORNTON, William (Mr)',    dob: '03/06/1960', chiNumber: '845162 3097', sex: 'Male',   phone: '07621 567 890', address: '21 Mapledene Road, Glasgow G52 1AB'      },
];

const DOB_BY_CHI: Record<string, string> = Object.fromEntries(
  MOCK_PATIENTS.map(p => [p.chiNumber, p.dob])
);

function dobFromChiNumber(chiNumber: string): string {
  const d = chiNumber.replace(/\D/g, '');
  const age   = (parseInt(d.slice(0, 3), 10) % 65) + 20;
  const month = (parseInt(d.slice(3, 5),  10) % 12) + 1;
  const day   = (parseInt(d.slice(5, 7),  10) % 28) + 1;
  const year  = new Date().getFullYear() - age;
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
}

function getDob(chiNumber: string | undefined): string {
  if (!chiNumber) return '';
  return DOB_BY_CHI[chiNumber] ?? dobFromChiNumber(chiNumber);
}

function sexFromName(name: string): string | undefined {
  if (/\(Mr\)/.test(name)) return 'Male';
  if (/\(Mrs\)|\(Ms\)|\(Miss\)/.test(name)) return 'Female';
  return undefined;
}

const DOB_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDob(dob: string): string {
  const [d, m, y] = dob.split('/');
  if (!d || !m || !y) return dob;
  return `${d} ${DOB_MONTHS[parseInt(m, 10) - 1]} ${y}`;
}

function computeAge(dob: string): number {
  const [dd, mm, yyyy] = dob.split('/').map(Number);
  const today = new Date();
  let age = today.getFullYear() - yyyy;
  const monthDiff = (today.getMonth() + 1) - mm;
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dd)) age--;
  return age;
}

const APPT_TYPES = [
  'Routine', 'Follow-up', 'Urgent', 'Medication review', 'Annual review',
  'Face-to-face', 'Telephone', 'Mental health', 'Asthma review',
  "Women's health", 'Respiratory', 'Admin',
];

// ─── Slot context menu ────────────────────────────────────────────────────────

function SlotContextMenuContent({ anchorRect, onClose }: { anchorRect: DOMRect; onClose: () => void }) {
  const MENU_W = 204;
  const items = [
    { label: 'View patient', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> },
    { label: 'Reschedule appointment', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { label: 'Add note', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg> },
    { label: 'Cancel appointment', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>, danger: true },
  ];

  const menuH = items.length * 36 + 12;
  let top = anchorRect.bottom + 4;
  if (top + menuH > window.innerHeight - 8) top = anchorRect.top - menuH - 4;
  top = Math.max(8, top);
  let left = anchorRect.right - MENU_W;
  if (left < 8) left = anchorRect.left;
  left = Math.max(8, Math.min(left, window.innerWidth - MENU_W - 8));

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }} onMouseDown={onClose} />
      <div
        style={{
          position: 'fixed', top, left, width: MENU_W, zIndex: 9999,
          background: 'var(--background)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          boxShadow: '0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
          padding: '6px',
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        {items.map(item => (
          <button
            key={item.label}
            onClick={onClose}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-left transition-colors"
            style={{ color: item.danger ? 'var(--error, #dc2626)' : 'var(--text-primary)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--hover)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <span style={{ color: item.danger ? 'var(--error, #dc2626)' : 'var(--text-secondary)', flexShrink: 0, display: 'flex' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </>,
    document.body,
  );
}

function SlotContextMenu(props: { anchorRect: DOMRect; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <SlotContextMenuContent {...props} />;
}

// ─── Appointment detail panel ─────────────────────────────────────────────────

function DetailRow({ label, value, span }: { label: string; value: React.ReactNode; span?: boolean }) {
  return (
    <div style={span ? { gridColumn: '1 / -1' } : undefined}>
      <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 2 }}>{label}</p>
      <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function AppointmentDetailPanelContent({
  slot,
  selectedDate,
  onClose,
  onStartConsultation,
  onViewPatient,
}: {
  slot: ScheduleSlot;
  selectedDate: Date;
  onClose: () => void;
  onStartConsultation: () => void;
  onViewPatient: () => void;
}) {
  const column = SCHEDULE_COLUMNS.find(c => c.id === slot.columnId);
  const dob = getDob(slot.chiNumber);
  const dateStr = selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const statusCfg = slot.status ? STATUS_CFG[slot.status as AppointmentStatus] : null;

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 9990 }} onClick={onClose} />
      <div
        style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 480, maxHeight: '85vh',
          zIndex: 9991,
          background: 'var(--background)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>Appointment</p>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{slot.patientName ?? 'Unknown patient'}</h3>
          </div>
          <button
            onClick={onClose}
            style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginTop: 2 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }} className="conversation-scroll">
          <section style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Patient</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
              <DetailRow label="Date of birth" value={dob ? `${formatDob(dob)} (${computeAge(dob)})` : '—'} />
              <DetailRow label="CHI number" value={slot.chiNumber ?? '—'} />
              <DetailRow label="Phone" value={slot.phone ?? '—'} />
            </div>
          </section>

          <section style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Appointment</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
              <DetailRow label="Date" value={dateStr} span />
              <DetailRow label="Time" value={slot.startTime} />
              <DetailRow label="Duration" value={formatDuration(slot.durationMins)} />
              <DetailRow label="Clinician / resource" value={column?.name ?? slot.columnId} span />
              <DetailRow label="Appointment type" value={slot.appointmentType ?? '—'} />
              <DetailRow label="Status" value={
                statusCfg ? (
                  <span
                    className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-medium border"
                    style={{ background: statusCfg.bg, color: statusCfg.text, borderColor: statusCfg.border }}
                  >
                    {slot.status}
                  </span>
                ) : <span>{slot.status ?? 'Booked'}</span>
              } />
            </div>
          </section>

          {slot.notes && (
            <section>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Reason / notes</p>
              <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{slot.notes}</p>
            </section>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', flexShrink: 0, display: 'flex', gap: 8 }}>
          <button
            onClick={onStartConsultation}
            style={{ flex: 1, height: 40, borderRadius: 10, border: 'none', background: 'var(--primary-main)', color: 'var(--primary-contrast)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Start consultation
          </button>
          <button
            onClick={onViewPatient}
            style={{ height: 40, paddingInline: 16, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-primary)', fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            View patient summary
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}

function AppointmentDetailPanel(props: { slot: ScheduleSlot; selectedDate: Date; onClose: () => void; onStartConsultation: () => void; onViewPatient: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <AppointmentDetailPanelContent {...props} />;
}

// ─── Consultation view ────────────────────────────────────────────────────────

function ConsultationViewContent({ slot, onClose }: { slot: ScheduleSlot; onClose: () => void }) {
  const [subjective, setSubjective] = useState(slot.notes ?? '');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');

  const column = SCHEDULE_COLUMNS.find(c => c.id === slot.columnId);
  const dob = getDob(slot.chiNumber);

  const sections = [
    { label: 'Subjective', placeholder: "Patient's presenting complaint, history, symptoms…", value: subjective, onChange: setSubjective },
    { label: 'Objective',  placeholder: 'Examination findings, observations, vital signs…',  value: objective,  onChange: setObjective  },
    { label: 'Assessment', placeholder: 'Diagnosis, differential diagnoses, clinical impression…', value: assessment, onChange: setAssessment },
    { label: 'Plan',       placeholder: 'Treatment, referrals, investigations, follow-up…',   value: plan,       onChange: setPlan       },
  ];

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 9995, background: 'var(--background-soft)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ flexShrink: 0, padding: '0 24px', height: 52, borderBottom: '1px solid var(--border)', background: 'var(--background)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={onClose}
          style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to schedule
        </button>
        <div style={{ width: 1, height: 20, background: 'var(--border)', flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{slot.patientName}</span>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-secondary)', flexShrink: 0 }}>
          {slot.startTime} · {formatDuration(slot.durationMins)} · {column?.name}
        </div>
      </div>

      {/* Patient banner */}
      <PatientBanner
        patientName={slot.patientName ?? '—'}
        dateOfBirth={dob ? `${formatDob(dob)} (${computeAge(dob)})` : '—'}
        chiNumber={slot.chiNumber ?? '—'}
        sex={sexFromName(slot.patientName ?? '')}
        showMenu={false}
        className="mx-6 mt-4 flex-shrink-0"
      />

      {/* SOAP grid */}
      <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="conversation-scroll">
        {sections.map(s => (
          <div key={s.label} style={{ background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, flexShrink: 0 }}>{s.label}</p>
            <textarea
              value={s.value}
              onChange={e => s.onChange(e.target.value)}
              placeholder={s.placeholder}
              style={{ flex: 1, minHeight: 160, resize: 'vertical', border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, fontFamily: 'inherit' }}
            />
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{ flexShrink: 0, padding: '12px 24px', borderTop: '1px solid var(--border)', background: 'var(--background)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button
          onClick={onClose}
          style={{ height: 36, paddingInline: 16, borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-primary)', fontSize: 13, cursor: 'pointer' }}
        >
          End consultation
        </button>
        <button
          onClick={onClose}
          style={{ height: 36, paddingInline: 20, borderRadius: 8, border: 'none', background: 'var(--primary-main)', color: 'var(--primary-contrast)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          Save &amp; close
        </button>
      </div>
    </div>,
    document.body,
  );
}

function ConsultationView(props: { slot: ScheduleSlot; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <ConsultationViewContent {...props} />;
}

// ─── Booking flow panel ───────────────────────────────────────────────────────

function BookingFlowPanelContent({
  slot,
  selectedDate,
  onClose,
  onBook,
}: {
  slot: ScheduleSlot;
  selectedDate: Date;
  onClose: () => void;
  onBook: (newSlot: ScheduleSlot) => void;
}) {
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<MockPatient | null>(null);
  const [apptType, setApptType] = useState('Routine');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const column = SCHEDULE_COLUMNS.find(c => c.id === slot.columnId);
  const dateStr = selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const filtered = search.trim().length >= 2
    ? MOCK_PATIENTS.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.chiNumber.includes(search) ||
        p.dob.includes(search)
      )
    : [];

  function handleBook() {
    if (!selectedPatient) return;
    onBook({
      ...slot,
      type: 'appointment',
      patientName: selectedPatient.name,
      chiNumber: selectedPatient.chiNumber,
      phone: selectedPatient.phone,
      appointmentType: apptType,
      status: 'Booked',
      notes: [reason, notes].filter(Boolean).join('\n'),
    } as ScheduleSlot);
  }

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 9990 }} onClick={onClose} />
      <div
        style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 520, maxHeight: '90vh',
          zIndex: 9991,
          background: 'var(--background)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>Book appointment</p>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>{slot.startTime} · {formatDuration(slot.durationMins)}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{dateStr}</p>
          </div>
          <button
            onClick={onClose}
            style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginTop: 2 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Pre-populated slot info */}
        <div style={{ padding: '12px 24px', background: 'var(--background-soft)', borderBottom: '1px solid var(--border)', flexShrink: 0, display: 'flex', gap: 24 }}>
          <div><p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 1 }}>Clinician</p><p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{column?.name ?? slot.columnId}</p></div>
          <div><p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 1 }}>Duration</p><p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{formatDuration(slot.durationMins)}</p></div>
          {column?.sessionLabel && <div><p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 1 }}>Session</p><p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{column.sessionLabel}</p></div>}
        </div>

        {/* Scrollable form */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }} className="conversation-scroll">
          {/* Patient search */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Patient</label>
            {!selectedPatient ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 36, padding: '0 10px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search by name, CHI number or date of birth…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--text-primary)' }}
                  />
                </div>
                {search.trim().length >= 2 ? (
                  <div style={{ marginTop: 6, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                    {filtered.length === 0 ? (
                      <p style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text-secondary)' }}>No patients found</p>
                    ) : filtered.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { setSelectedPatient(p); setSearch(''); }}
                        style={{ width: '100%', display: 'block', padding: '10px 14px', textAlign: 'left', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--hover)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      >
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{p.name}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.dob} · {p.chiNumber}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p style={{ marginTop: 6, fontSize: 12, color: 'var(--text-secondary)' }}>Type at least 2 characters to search</p>
                )}
              </>
            ) : (
              <div>
                <PatientBanner
                  patientName={selectedPatient.name}
                  dateOfBirth={formatDob(selectedPatient.dob)}
                  chiNumber={selectedPatient.chiNumber}
                  sex={selectedPatient.sex}
                  showMenu={false}
                  className="mb-2"
                />
                <button
                  onClick={() => setSelectedPatient(null)}
                  style={{ fontSize: 12, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: '2px 0' }}
                >
                  Change patient
                </button>
              </div>
            )}
          </div>

          {/* Appointment type */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Appointment type</label>
            <select
              value={apptType}
              onChange={e => setApptType(e.target.value)}
              style={{ width: '100%', height: 36, padding: '0 10px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', fontSize: 13, color: 'var(--text-primary)', outline: 'none' }}
            >
              {APPT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Reason */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Reason for appointment</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Brief reason or presenting complaint…"
              rows={3}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', fontSize: 13, color: 'var(--text-primary)', outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5, boxSizing: 'border-box' }}
            />
          </div>

          {/* Notes */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Notes <span style={{ fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any additional notes…"
              rows={2}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', fontSize: 13, color: 'var(--text-primary)', outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5, boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', flexShrink: 0, display: 'flex', gap: 8 }}>
          <button
            onClick={handleBook}
            disabled={!selectedPatient}
            style={{
              flex: 1, height: 40, borderRadius: 10, border: 'none',
              background: selectedPatient ? 'var(--primary-main)' : 'var(--primary-light)',
              color: selectedPatient ? 'var(--primary-contrast)' : 'var(--text-secondary)',
              fontSize: 14, fontWeight: 600, cursor: selectedPatient ? 'pointer' : 'default',
              transition: 'background 0.15s',
            }}
          >
            Book appointment
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}

function BookingFlowPanel(props: { slot: ScheduleSlot; selectedDate: Date; onClose: () => void; onBook: (s: ScheduleSlot) => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <BookingFlowPanelContent {...props} />;
}

// ─── Patient summary view ─────────────────────────────────────────────────────

// Maps a slot's CHI number to one of the 3 seeded patient datasets
const _PT_IDS = ['PT-10001', 'PT-10002', 'PT-10003'] as const;
function chiToPatientId(chiNumber: string): string {
  const digits = chiNumber.replace(/\D/g, '');
  return _PT_IDS[parseInt(digits.slice(-1), 10) % 3];
}

const FINAL_STATUSES: AppointmentStatus[] = ['Completed', 'DNA', 'Cancelled'];

function computeNextApptDisplay(slot: ScheduleSlot, selectedDate: Date, now: Date): string | undefined {
  if (slot.type !== 'appointment' || !slot.startTime) return undefined;
  const isToday = selectedDate.toDateString() === now.toDateString();
  const isFuture = selectedDate > now && !isToday;
  if (!isToday && !isFuture) return undefined;

  if (isToday) {
    const [h, m] = slot.startTime.split(':').map(Number);
    const apptTime = new Date(now);
    apptTime.setHours(h, m, 0, 0);
    const diffMin = Math.round((apptTime.getTime() - now.getTime()) / 60000);
    if (Math.abs(diffMin) <= 60) {
      if (diffMin === 0) return `${slot.startTime} · now`;
      if (diffMin > 0) return `${slot.startTime} · in ${diffMin} min${diffMin === 1 ? '' : 's'}`;
      const ago = Math.abs(diffMin);
      return `${slot.startTime} · ${ago} min${ago === 1 ? '' : 's'} ago`;
    }
    return slot.startTime;
  }
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${DAYS[selectedDate.getDay()]} ${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]}`;
}

function PatientSummaryViewContent({ slot, selectedDate, onBack, onStartConsultation }: {
  slot: ScheduleSlot;
  selectedDate: Date;
  onBack: () => void;
  onStartConsultation: () => void;
}) {
  const dob = getDob(slot.chiNumber);
  const patientId = slot.chiNumber ? chiToPatientId(slot.chiNumber) : 'PT-10002';

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const isToday = selectedDate.toDateString() === now.toDateString();
  const showStartConsultation = (() => {
    if (!isToday || slot.type !== 'appointment' || !slot.startTime) return false;
    if (FINAL_STATUSES.includes(slot.status as AppointmentStatus)) return false;
    const [h, m] = slot.startTime.split(':').map(Number);
    const apptStart = new Date(now);
    apptStart.setHours(h, m, 0, 0);
    const windowStart = new Date(apptStart.getTime() - 30 * 60 * 1000);
    const windowEnd   = new Date(apptStart.getTime() + 30 * 60 * 1000);
    return now >= windowStart && now <= windowEnd;
  })();

  const nextAppointmentDisplay = computeNextApptDisplay(slot, selectedDate, now);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'var(--background-soft)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Top bar */}
      <div style={{ flexShrink: 0, height: 52, padding: '0 20px', borderBottom: '1px solid var(--border)', background: 'var(--background)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, flexShrink: 0 }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to appointment
        </button>
        <div style={{ width: 1, height: 18, background: 'var(--border)', flexShrink: 0 }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Patient summary</span>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }} className="conversation-scroll">

        <PatientBanner
          patientName={slot.patientName ?? 'Unknown patient'}
          dateOfBirth={dob ? `${formatDob(dob)} (${computeAge(dob)})` : '—'}
          chiNumber={slot.chiNumber ?? '—'}
          sex={sexFromName(slot.patientName ?? '')}
          className="mb-4"
        />

        {/* Clinical widgets — uses mapped patient dataset */}
        <PatientSummaryCard
          activePatientId={patientId}
          showStartConsultation={showStartConsultation}
          onStartConsultation={onStartConsultation}
          nextAppointmentDisplay={nextAppointmentDisplay}
        />

      </div>
    </div>
  );
}




function PatientSummaryView(props: { slot: ScheduleSlot; selectedDate: Date; onBack: () => void; onStartConsultation: () => void }) {
  return <PatientSummaryViewContent {...props} />;
}

// ─── New booking flow ─────────────────────────────────────────────────────────

interface BookingReasonDef {
  id: string;
  label: string;
  categories: RoleCategory[];
  preferredColumnIds?: string[];
  durationMins: number;
  apptType: string;
}

const NB_REASONS: BookingReasonDef[] = [
  { id: 'gp',          label: 'General GP appointment', categories: ['doctor'],                                          durationMins: 15, apptType: 'Face-to-face'     },
  { id: 'medication',  label: 'Medication review',      categories: ['doctor'],                                          durationMins: 15, apptType: 'Medication review' },
  { id: 'smear',       label: 'Smear test',             categories: ['nurse'],                                           durationMins: 20, apptType: "Women's health"   },
  { id: 'blood',       label: 'Blood test',             categories: ['service'], preferredColumnIds: ['phlebotomy'],     durationMins: 10, apptType: 'Blood test'       },
  { id: 'diabetes',    label: 'Diabetes review',        categories: ['clinic', 'doctor'], preferredColumnIds: ['diabetes'], durationMins: 30, apptType: 'Diabetes review' },
  { id: 'asthma',      label: 'Asthma review',          categories: ['nurse', 'doctor'],                                 durationMins: 20, apptType: 'Asthma review'    },
  { id: 'vaccination', label: 'Vaccination',            categories: ['hca', 'nurse'],                                    durationMins: 10, apptType: 'Vaccination'      },
  { id: 'wound',       label: 'Wound care',             categories: ['nurse', 'hca'],                                    durationMins: 20, apptType: 'Wound care'       },
  { id: 'mental',      label: 'Mental health review',   categories: ['doctor'],                                          durationMins: 30, apptType: 'Mental health'    },
  { id: 'other',       label: 'Other',                  categories: ['doctor'],                                          durationMins: 15, apptType: 'Routine'          },
];

interface SuggestedAppt {
  slot: ScheduleSlot;
  date: Date;
  column: ScheduleColumn;
  label: string;
  recommended: boolean;
}

function usualGpForPatient(chiNumber: string): string {
  return seededRandom(chiNumber + ':usual-gp') < 0.5 ? 'malik' : 'reid';
}

function buildSlotLabel(col: ScheduleColumn, reason: BookingReasonDef, chiNumber: string, isEarliest: boolean): string {
  const usualId = usualGpForPatient(chiNumber);
  if (col.id === usualId && reason.categories.includes('doctor')) return 'Usual GP';
  if (col.id === 'phlebotomy') return 'Phlebotomy clinic';
  if (col.id === 'diabetes') return 'Diabetes clinic';
  if (col.category === 'nurse') return 'Practice nurse';
  if (col.category === 'hca') return 'Healthcare assistant';
  if (isEarliest) return 'Earliest available';
  return 'Next available';
}

function findSuggestedAppts(
  reason: BookingReasonDef,
  chiNumber: string,
  bookedSlots: Record<string, ScheduleSlot>
): SuggestedAppt[] {
  const usualId = usualGpForPatient(chiNumber);
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const targetCols = SCHEDULE_COLUMNS
    .filter(c => reason.preferredColumnIds?.includes(c.id) || reason.categories.includes(c.category))
    .sort((a, b) => {
      const ap = reason.preferredColumnIds?.includes(a.id) ? 0 : 1;
      const bp = reason.preferredColumnIds?.includes(b.id) ? 0 : 1;
      if (ap !== bp) return ap - bp;
      if (reason.categories.includes('doctor')) {
        if (a.id === usualId) return -1;
        if (b.id === usualId) return 1;
      }
      return 0;
    });

  const results: SuggestedAppt[] = [];
  const seenCols = new Set<string>();

  for (let off = 1; off <= 28 && results.length < 5; off++) {
    const date = new Date(today);
    date.setDate(today.getDate() + off);
    if (date.getDay() === 0) continue;

    const factor = availabilityFactor(off);
    const dk = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    for (const col of targetCols) {
      if (results.length < 3 && seenCols.has(col.id)) continue;

      const avail = SCHEDULE_SLOTS
        .filter(s => s.columnId === col.id && s.type !== 'blocked')
        .find(s => {
          if (bookedSlots[`${s.id}:${dk}`]) return false;
          if (s.type === 'available') return true;
          return s.type === 'appointment' && seededRandom(`${s.id}:${dk}`) < factor;
        });

      if (avail) {
        results.push({
          slot: avail,
          date: new Date(date),
          column: col,
          label: buildSlotLabel(col, reason, chiNumber, results.length === 0),
          recommended: false,
        });
        seenCols.add(col.id);
        break;
      }
    }
  }

  if (results.length > 0) {
    let ri = 0;
    if (reason.categories.includes('doctor')) {
      const gi = results.findIndex(r => r.column.id === usualId);
      if (gi >= 0) ri = gi;
    } else {
      const pi = results.findIndex(r => reason.preferredColumnIds?.includes(r.column.id));
      if (pi >= 0) ri = pi;
    }
    results[ri] = { ...results[ri], recommended: true };
    const [rec] = results.splice(ri, 1);
    results.unshift(rec);
  }

  return results.slice(0, 4);
}

function nbFormatDate(d: Date): string {
  const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tom = new Date(today); tom.setDate(today.getDate() + 1);
  if (d.toDateString() === tom.toDateString()) return `Tomorrow · ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  return `${FULL_DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function ApptOptionCard({ s, reason, onClick }: { s: SuggestedAppt; reason: BookingReasonDef; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6,
        background: hov ? 'var(--hover)' : 'var(--background)',
        border: '1px solid ' + (s.recommended ? 'var(--primary-main)' : 'var(--border)'),
        borderRadius: 10, cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 1 }}>
            {nbFormatDate(s.date)} · {s.slot.startTime}
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-primary)' }}>{s.column.name}</p>
        </div>
        <span style={{ flexShrink: 0, fontSize: 12, color: 'var(--text-secondary)', background: 'var(--background-soft)', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 8px' }}>
          {reason.durationMins} mins
        </span>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.label}</p>
    </button>
  );
}

function toDateInputValue(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function ManualSlotRow({ slot, col, reason, onClick }: {
  slot: ScheduleSlot; col: ScheduleColumn; reason: BookingReasonDef; onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: hov ? 'var(--hover)' : 'var(--background)',
        border: '1px solid var(--border)', borderRadius: 8,
        cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s',
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{slot.startTime}</span>
      <span style={{ fontSize: 12, color: 'var(--text-secondary)', background: 'var(--background-soft)', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 8px' }}>
        {reason.durationMins} mins
      </span>
    </button>
  );
}

function NewBookingFlowContent({ onClose, onBook, bookedSlots }: {
  onClose: () => void;
  onBook: (slot: ScheduleSlot, date: Date) => void;
  bookedSlots: Record<string, ScheduleSlot>;
}) {
  type NbStep = 'patient' | 'reason' | 'finding' | 'options' | 'manual' | 'confirm';
  const [step, setStep] = useState<NbStep>('patient');
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<MockPatient | null>(null);
  const [selectedReason, setSelectedReason] = useState<BookingReasonDef | null>(null);
  const [customReason, setCustomReason] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestedAppt[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<SuggestedAppt | null>(null);
  const [confirmSource, setConfirmSource] = useState<NbStep>('options');
  const [bookingNotes, setBookingNotes] = useState('');
  const [manualDate, setManualDate] = useState<Date>(() => {
    const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(0, 0, 0, 0); return d;
  });
  const [manualColumnId, setManualColumnId] = useState('all');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 'patient') setTimeout(() => searchRef.current?.focus(), 50);
  }, [step]);

  const patientResults = patientSearch.length >= 2
    ? MOCK_PATIENTS.filter(p =>
        p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.chiNumber.replace(/\s/g, '').includes(patientSearch.replace(/\s/g, '')) ||
        p.dob.includes(patientSearch)
      ).slice(0, 6)
    : [];

  const launchFind = (r: BookingReasonDef) => {
    setStep('finding');
    setTimeout(() => {
      try {
        setSuggestions(findSuggestedAppts(r, selectedPatient!.chiNumber, bookedSlots));
      } catch {
        setSuggestions([]);
      }
      setStep('options');
    }, 600);
  };

  const handleSelectReason = (r: BookingReasonDef) => {
    setSelectedReason(r);
    if (r.id !== 'other') launchFind(r);
  };

  const stepBack = () => {
    if (step === 'reason') { setStep('patient'); setSelectedReason(null); setCustomReason(''); }
    else if (step === 'options') { setStep('reason'); setSelectedReason(null); setCustomReason(''); setSuggestions([]); }
    else if (step === 'manual') { setStep('options'); }
    else if (step === 'confirm') { setStep(confirmSource); setSelectedSuggestion(null); }
  };

  const handlePickSuggestion = (s: SuggestedAppt) => {
    setSelectedSuggestion(s);
    setConfirmSource('options');
    setBookingNotes('');
    setStep('confirm');
  };

  const handlePickManualSlot = (slot: ScheduleSlot, col: ScheduleColumn) => {
    setSelectedSuggestion({ slot, date: manualDate, column: col, label: col.name, recommended: false });
    setConfirmSource('manual');
    setBookingNotes('');
    setStep('confirm');
  };

  const handleBook = () => {
    if (!selectedSuggestion || !selectedPatient || !selectedReason) return;
    const newSlot: ScheduleSlot = {
      ...selectedSuggestion.slot,
      type: 'appointment',
      patientName: selectedPatient.name,
      chiNumber: selectedPatient.chiNumber,
      phone: selectedPatient.phone,
      appointmentType: selectedReason.apptType,
      status: 'Booked',
      notes: bookingNotes.trim() || undefined,
    };
    onBook(newSlot, selectedSuggestion.date);
  };

  const todayMidnight = new Date(); todayMidnight.setHours(0, 0, 0, 0);
  const minDateStr = toDateInputValue(new Date(todayMidnight.getTime() + 86400000));
  const manualDateStr = toDateInputValue(manualDate);
  const manualDaysDiff = Math.round((manualDate.getTime() - todayMidnight.getTime()) / 86400000);
  const manualFactor = availabilityFactor(Math.max(1, manualDaysDiff));
  const manualDk = `${manualDate.getFullYear()}-${manualDate.getMonth()}-${manualDate.getDate()}`;
  const isSunday = manualDate.getDay() === 0;

  const manualTargetCols = !selectedReason ? [] :
    manualColumnId !== 'all'
      ? SCHEDULE_COLUMNS.filter(c => c.id === manualColumnId)
      : SCHEDULE_COLUMNS.filter(c =>
          selectedReason.preferredColumnIds?.includes(c.id) ||
          selectedReason.categories.includes(c.category)
        );

  const manualSlotGroups = manualTargetCols.map(col => ({
    col,
    slots: isSunday ? [] : SCHEDULE_SLOTS
      .filter(s => s.columnId === col.id && s.type !== 'blocked')
      .filter(s => !bookedSlots[`${s.id}:${manualDk}`])
      .filter(s => s.type === 'available' || seededRandom(`${s.id}:${manualDk}`) < manualFactor),
  }));

  const totalManualSlots = manualSlotGroups.reduce((n, g) => n + g.slots.length, 0);

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 40, padding: '0 12px', borderRadius: 8,
    border: '1px solid var(--border)', background: 'var(--background)',
    fontSize: 14, color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box',
  };
  const sectionLabel: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)',
    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
  };

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 9990 }} onClick={onClose} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 9991, width: 540, maxWidth: 'calc(100vw - 32px)',
        maxHeight: '88vh', display: 'flex', flexDirection: 'column',
        background: 'var(--background)', borderRadius: 14,
        boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}>

        {/* Modal header */}
        <div style={{ flexShrink: 0, height: 52, padding: '0 16px 0 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          {step !== 'patient' && step !== 'finding' && (
            <>
              <button
                onClick={stepBack}
                style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: '4px 6px', borderRadius: 6, flexShrink: 0 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Back
              </button>
              <div style={{ width: 1, height: 16, background: 'var(--border)', flexShrink: 0 }} />
            </>
          )}
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
            {step === 'manual' ? 'Find another appointment' : 'Book appointment'}
          </span>
          <button
            onClick={onClose}
            style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Step content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }} className="conversation-scroll">

          {/* Patient search */}
          {step === 'patient' && (
            <>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Find patient</p>
              <input
                ref={searchRef}
                value={patientSearch}
                onChange={e => setPatientSearch(e.target.value)}
                placeholder="Search by name, date of birth or CHI number"
                style={inputStyle}
              />
              {patientResults.length > 0 && (
                <div style={{ marginTop: 8, border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                  {patientResults.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => { setSelectedPatient(p); setStep('reason'); }}
                      style={{
                        width: '100%', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 2,
                        background: 'transparent', border: 'none',
                        borderBottom: i < patientResults.length - 1 ? '1px solid var(--border)' : 'none',
                        cursor: 'pointer', textAlign: 'left',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--hover)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.dob} · {p.chiNumber}</span>
                    </button>
                  ))}
                </div>
              )}
              {patientSearch.length >= 2 && patientResults.length === 0 && (
                <p style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>No patients found.</p>
              )}
            </>
          )}

          {/* Reason */}
          {step === 'reason' && selectedPatient && (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', height: 28, paddingInline: 12, borderRadius: 20, border: '1px solid var(--border)', background: 'var(--background-soft)', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 16 }}>
                {selectedPatient.name}
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>What is this appointment for?</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {NB_REASONS.filter(r => r.id !== 'other').map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleSelectReason(r)}
                    style={{
                      width: '100%', padding: '11px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      background: 'transparent', border: '1px solid transparent', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--hover)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{r.label}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.durationMins} mins</span>
                  </button>
                ))}
                <button
                  onClick={() => handleSelectReason(NB_REASONS.find(r => r.id === 'other')!)}
                  style={{
                    width: '100%', padding: '11px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: selectedReason?.id === 'other' ? 'var(--background-soft)' : 'transparent',
                    border: '1px solid ' + (selectedReason?.id === 'other' ? 'var(--border)' : 'transparent'),
                    borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                  }}
                  onMouseEnter={e => { if (selectedReason?.id !== 'other') (e.currentTarget as HTMLElement).style.background = 'var(--hover)'; }}
                  onMouseLeave={e => { if (selectedReason?.id !== 'other') (e.currentTarget as HTMLElement).style.background = selectedReason?.id === 'other' ? 'var(--background-soft)' : 'transparent'; }}
                >
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Other</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>15 mins</span>
                </button>
              </div>
              {selectedReason?.id === 'other' && (
                <div style={{ marginTop: 12 }}>
                  <input
                    autoFocus
                    value={customReason}
                    onChange={e => setCustomReason(e.target.value)}
                    placeholder="Briefly describe the reason"
                    style={inputStyle}
                  />
                  <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => launchFind(selectedReason)}
                      disabled={!customReason.trim()}
                      style={{
                        height: 36, paddingInline: 16, borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 600,
                        background: customReason.trim() ? 'var(--primary-main)' : 'var(--primary-light)',
                        color: customReason.trim() ? 'var(--primary-contrast)' : 'var(--text-secondary)',
                        cursor: customReason.trim() ? 'pointer' : 'default',
                      }}
                    >
                      Find appointments
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Finding */}
          {step === 'finding' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '44px 0', gap: 14 }}>
              <div className="animate-spin" style={{ width: 26, height: 26, borderRadius: '50%', border: '3px solid var(--primary-light)', borderTopColor: 'var(--primary-main)' }} />
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Finding suitable appointments…</p>
            </div>
          )}

          {/* Options */}
          {step === 'options' && selectedPatient && selectedReason && (
            <>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', height: 26, paddingInline: 10, borderRadius: 20, border: '1px solid var(--border)', background: 'var(--background-soft)', fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{selectedPatient.name}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', height: 26, paddingInline: 10, borderRadius: 20, border: '1px solid var(--border)', background: 'var(--background-soft)', fontSize: 12, color: 'var(--text-secondary)' }}>{customReason || selectedReason.label}</span>
              </div>
              {suggestions.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', padding: '32px 0' }}>No suitable appointments found in the next 28 days.</p>
              ) : (
                <>
                  {suggestions.filter(s => s.recommended).length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <p style={sectionLabel}>Recommended</p>
                      {suggestions.filter(s => s.recommended).map((s, i) => (
                        <ApptOptionCard key={i} s={s} reason={selectedReason} onClick={() => handlePickSuggestion(s)} />
                      ))}
                    </div>
                  )}
                  {suggestions.filter(s => !s.recommended).length > 0 && (
                    <div>
                      <p style={sectionLabel}>Other available appointments</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {suggestions.filter(s => !s.recommended).map((s, i) => (
                          <ApptOptionCard key={i} s={s} reason={selectedReason} onClick={() => handlePickSuggestion(s)} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <button
                  onClick={() => setStep('manual')}
                  style={{
                    width: '100%', height: 40, borderRadius: 8,
                    border: '1px solid var(--border)', background: 'transparent',
                    fontSize: 13, fontWeight: 500, color: 'var(--text-primary)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--hover)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Find another appointment
                </button>
              </div>
            </>
          )}

          {/* Manual search */}
          {step === 'manual' && selectedPatient && selectedReason && (
            <>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', height: 26, paddingInline: 10, borderRadius: 20, border: '1px solid var(--border)', background: 'var(--background-soft)', fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{selectedPatient.name}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', height: 26, paddingInline: 10, borderRadius: 20, border: '1px solid var(--border)', background: 'var(--background-soft)', fontSize: 12, color: 'var(--text-secondary)' }}>{customReason || selectedReason.label}</span>
              </div>

              <p style={sectionLabel}>Date</p>
              <input
                type="date"
                value={manualDateStr}
                min={minDateStr}
                onChange={e => {
                  if (!e.target.value) return;
                  const [y, m, d] = e.target.value.split('-').map(Number);
                  setManualDate(new Date(y, m - 1, d));
                }}
                style={{ ...inputStyle, marginBottom: 10 }}
              />
              <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
                {([
                  { label: '+1 week',   days: 7  },
                  { label: '+2 weeks',  days: 14 },
                  { label: '+1 month',  days: 30 },
                  { label: '+3 months', days: 91 },
                ] as { label: string; days: number }[]).map(({ label, days }) => (
                  <button
                    key={label}
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + days);
                      d.setHours(0, 0, 0, 0);
                      setManualDate(d);
                    }}
                    style={{ height: 28, paddingInline: 10, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--background-soft)', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--hover)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--background-soft)'; }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <p style={sectionLabel}>Clinician / resource</p>
              <select
                value={manualColumnId}
                onChange={e => setManualColumnId(e.target.value)}
                style={{ ...inputStyle, marginBottom: 20, cursor: 'pointer' }}
              >
                <option value="all">Any suitable</option>
                {SCHEDULE_COLUMNS.map(col => (
                  <option key={col.id} value={col.id}>{col.name}</option>
                ))}
              </select>

              <p style={{ ...sectionLabel, marginBottom: 8 }}>Available slots · {nbFormatDate(manualDate)}</p>
              {isSunday ? (
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '20px 0' }}>No appointments on Sundays. Please select a different date.</p>
              ) : totalManualSlots === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '20px 0' }}>No available slots on this date. Try a different date or clinician.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {manualSlotGroups.filter(g => g.slots.length > 0).map(({ col, slots }) => (
                    <div key={col.id}>
                      {manualTargetCols.length > 1 && (
                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{col.name}</p>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {slots.map(slot => (
                          <ManualSlotRow
                            key={slot.id}
                            slot={slot}
                            col={col}
                            reason={selectedReason}
                            onClick={() => handlePickManualSlot(slot, col)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Confirm */}
          {step === 'confirm' && selectedPatient && selectedReason && selectedSuggestion && (
            <>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Confirm appointment</p>
              <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
                {([
                  { label: 'Patient',          value: selectedPatient.name },
                  { label: 'Date of birth',    value: (() => { const d = getDob(selectedPatient.chiNumber); return d ? `${formatDob(d)} (${computeAge(d)})` : selectedPatient.dob; })() },
                  { label: 'CHI number',       value: selectedPatient.chiNumber },
                  { label: 'Reason',           value: customReason || selectedReason.label },
                  { label: 'Appointment type', value: selectedReason.apptType },
                  { label: 'Clinician',        value: selectedSuggestion.column.name },
                  { label: 'Date',             value: nbFormatDate(selectedSuggestion.date) },
                  { label: 'Time',             value: selectedSuggestion.slot.startTime ?? '—' },
                  { label: 'Duration',         value: `${selectedReason.durationMins} minutes` },
                ] as { label: string; value: string }[]).map(({ label, value }, i, arr) => (
                  <div key={label} style={{ display: 'flex', padding: '10px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', gap: 16 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', width: 134, flexShrink: 0 }}>{label}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
              <p style={{ ...sectionLabel, marginTop: 20, marginBottom: 6 }}>Notes</p>
              <textarea
                value={bookingNotes}
                onChange={e => setBookingNotes(e.target.value)}
                placeholder="Add any relevant notes for this appointment…"
                rows={3}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 8,
                  border: '1px solid var(--border)', background: 'var(--background)',
                  fontSize: 13, color: 'var(--text-primary)', outline: 'none',
                  resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.5,
                }}
              />
            </>
          )}
        </div>

        {/* Footer — confirm step only */}
        {step === 'confirm' && (
          <div style={{ flexShrink: 0, padding: '14px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleBook}
              style={{ height: 38, paddingInline: 20, borderRadius: 8, border: 'none', background: 'var(--primary-main)', color: 'var(--primary-contrast)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              Book appointment
            </button>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}

function NewBookingFlow(props: { onClose: () => void; onBook: (slot: ScheduleSlot, date: Date) => void; bookedSlots: Record<string, ScheduleSlot> }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <NewBookingFlowContent {...props} />;
}

// ─── Time gutter ──────────────────────────────────────────────────────────────

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

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

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
        <button
          onClick={prevMonth}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Previous month"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Next month"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {['M','T','W','T','F','S','S'].map((d, i) => (
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

function WeekPicker({
  selectedDate,
  onSelect,
}: {
  selectedDate: Date;
  onSelect: (d: Date) => void;
}) {
  const [weekStart, setWeekStart] = useState(() => getMonday(selectedDate));
  const [calOpen, setCalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Sync weekStart when selectedDate jumps to a different week (e.g. from calendar picker)
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
        <PatientBanner className="mx-6 mb-4" />

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
  const [statusOverrides, setStatusOverrides] = useState<Record<string, AppointmentStatus>>({});
  const [bookedSlots, setBookedSlots] = useState<Record<string, ScheduleSlot>>({});
  const [contextMenu, setContextMenu] = useState<{ slot: ScheduleSlot; rect: DOMRect } | null>(null);
  const [detailPanel, setDetailPanel] = useState<ScheduleSlot | null>(null);
  const [consultationSlot, setConsultationSlot] = useState<ScheduleSlot | null>(null);
  const [bookingFlow, setBookingFlow] = useState<ScheduleSlot | null>(null);
  const [patientSummarySlot, setPatientSummarySlot] = useState<ScheduleSlot | null>(null);
  const [newBookingOpen, setNewBookingOpen] = useState(false);
  const [currentTimeY, setCurrentTimeY] = useState<number | null>(() => {
    const now = new Date();
    const h = now.getHours(), m = now.getMinutes();
    if (h >= DAY_START && h < DAY_END) {
      return Math.round(((h - DAY_START) * 60 + m) / 5 * SLOT_HEIGHT);
    }
    return null;
  });
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

  // Centre the Now line whenever the user lands on today (initial mount, Today button,
  // navigating back). Depends only on selectedDate so it never fires during the
  // per-minute currentTimeY tick — the viewport stays where the user left it.
  useEffect(() => {
    if (!scheduleRef.current) return;
    const todayMidnight = new Date(); todayMidnight.setHours(0, 0, 0, 0);
    if (isSameDay(selectedDate, todayMidnight)) {
      // Today: centre the Now line in the viewport
      const now = new Date();
      const h = now.getHours(), m = now.getMinutes();
      if (h >= DAY_START && h < DAY_END) {
        const y = ((h - DAY_START) * 60 + m) / 5 * SLOT_HEIGHT;
        scheduleRef.current.scrollTop = Math.max(0, y - scheduleRef.current.clientHeight / 2);
      } else {
        scheduleRef.current.scrollTop = 0;
      }
    } else {
      // Any other date: scroll to the top so the first appointments are visible
      scheduleRef.current.scrollTop = 0;
    }
  }, [selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleColumns = useMemo(
    () => activeFilter === 'all'
      ? SCHEDULE_COLUMNS
      : SCHEDULE_COLUMNS.filter(c => c.category === activeFilter),
    [activeFilter]
  );

  const isSelectedDateToday = useMemo(() => {
    const now = new Date(); now.setHours(0, 0, 0, 0);
    return isSameDay(selectedDate, now);
  }, [selectedDate]);

  const slotsByColumn = useMemo(() => {
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const daysDiff = Math.round((selectedDate.getTime() - now.getTime()) / 86400000);
    const factor = availabilityFactor(daysDiff);
    const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;

    const map: Record<string, ScheduleSlot[]> = {};
    for (const col of visibleColumns) {
      map[col.id] = SCHEDULE_SLOTS
        .filter(s => s.columnId === col.id)
        .map(s => {
          const overrideKey = `${s.id}:${dateKey}`;

          // Available slot that the user has booked
          if (s.type === 'available' && bookedSlots[overrideKey]) return bookedSlots[overrideKey];

          if (s.type !== 'appointment') return s;

          if (daysDiff > 0) {
            // Future: some slots open up, the rest are Booked
            if (seededRandom(`${s.id}:${dateKey}`) < factor) {
              if (bookedSlots[overrideKey]) return bookedSlots[overrideKey];
              return { id: s.id, columnId: s.columnId, type: 'available' as const, startTime: s.startTime, durationMins: s.durationMins };
            }
            return { ...s, status: (statusOverrides[overrideKey] ?? 'Booked') as AppointmentStatus };
          }

          if (daysDiff < 0) {
            return { ...s, status: (statusOverrides[overrideKey] ?? 'Booked') as AppointmentStatus };
          }

          // Today: keep original status, apply override if set
          return statusOverrides[overrideKey] ? { ...s, status: statusOverrides[overrideKey] } : s;
        });
    }
    return map;
  }, [visibleColumns, selectedDate, statusOverrides, bookedSlots]);

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: 'var(--background-soft)', position: 'relative' }}
    >
      {/* ── View header ── */}
      <PageHeader
        title={<ViewSwitcherDropdown value={viewMode} onChange={setViewMode} />}
        className="px-6 pt-5 pb-4"
        actions={
          <>
            <button
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[13px] font-medium transition-colors"
              style={{
                background: 'var(--primary-main)',
                border: '1px solid var(--primary-main)',
                color: 'var(--primary-contrast)',
              }}
              onClick={() => setNewBookingOpen(true)}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Book appointment
            </button>
            <button
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[13px] font-medium transition-colors"
              style={{
                background: 'var(--background)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
              onClick={() => {}}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Patient lookup
            </button>
          </>
        }
      />

      {/* ── Week picker + filter button — Day View only ── */}
      {viewMode === 'day' && (
        <div
          className="flex-shrink-0 flex items-center px-6 py-4"
        >
          <div className="flex-1 flex items-center gap-2">
            <div
              className="flex items-center gap-2 h-9 px-3 rounded-lg border"
              style={{ background: 'var(--background)', borderColor: 'var(--border)', minWidth: 200 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search appointments..."
                className="flex-1 bg-transparent text-xs outline-none"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
            <FilterButton active={activeFilter} onChange={setActiveFilter} />
          </div>
          <button
              onClick={() => {
                const t = new Date(); t.setHours(0, 0, 0, 0);
                setSelectedDate(t);
              }}
              className="flex-shrink-0 h-8 px-3 rounded-lg text-[13px] font-medium transition-colors mr-2"
              style={{
                background: 'var(--background)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                visibility: isSelectedDateToday ? 'hidden' : 'visible',
                pointerEvents: isSelectedDateToday ? 'none' : 'auto',
              }}
            >
              Today
            </button>
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

                {/* Current time line — only shown when viewing today */}
                {currentTimeY !== null && isSelectedDateToday && (
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
                      if (slot.type === 'appointment') return (
                        <AppointmentCard
                          key={slot.id}
                          slot={slot}
                          selectedDate={selectedDate}
                          onStatusChange={newStatus => {
                            const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
                            setStatusOverrides(prev => ({ ...prev, [`${slot.id}:${dateKey}`]: newStatus }));
                          }}
                          onSlotClick={() => setDetailPanel(slot)}
                          onActionClick={rect => setContextMenu({ slot, rect })}
                        />
                      );
                      if (slot.type === 'available') return (
                        <AvailableCard
                          key={slot.id}
                          slot={slot}
                          onClick={() => setBookingFlow(slot)}
                        />
                      );
                      if (slot.type === 'blocked')   return <BlockedCard   key={slot.id} slot={slot} />;
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

      {/* ── Portalled overlays ── */}
      {contextMenu && (
        <SlotContextMenu
          anchorRect={contextMenu.rect}
          onClose={() => setContextMenu(null)}
        />
      )}
      {detailPanel && !consultationSlot && !patientSummarySlot && (
        <AppointmentDetailPanel
          slot={detailPanel}
          selectedDate={selectedDate}
          onClose={() => setDetailPanel(null)}
          onStartConsultation={() => { setConsultationSlot(detailPanel); setDetailPanel(null); }}
          onViewPatient={() => { setPatientSummarySlot(detailPanel); setDetailPanel(null); }}
        />
      )}
      {patientSummarySlot && (
        <PatientSummaryView
          slot={patientSummarySlot}
          selectedDate={selectedDate}
          onBack={() => { setDetailPanel(patientSummarySlot); setPatientSummarySlot(null); }}
          onStartConsultation={() => { setConsultationSlot(patientSummarySlot); setPatientSummarySlot(null); }}
        />
      )}
      {consultationSlot && (
        <ConsultationView
          slot={consultationSlot}
          onClose={() => setConsultationSlot(null)}
        />
      )}
      {bookingFlow && (
        <BookingFlowPanel
          slot={bookingFlow}
          selectedDate={selectedDate}
          onClose={() => setBookingFlow(null)}
          onBook={newSlot => {
            const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
            setBookedSlots(prev => ({ ...prev, [`${bookingFlow.id}:${dateKey}`]: newSlot }));
            setBookingFlow(null);
          }}
        />
      )}
      {newBookingOpen && (
        <NewBookingFlow
          onClose={() => setNewBookingOpen(false)}
          onBook={(slot, date) => {
            const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            setBookedSlots(prev => ({ ...prev, [`${slot.id}:${dateKey}`]: slot }));
            setNewBookingOpen(false);
          }}
          bookedSlots={bookedSlots}
        />
      )}
    </div>
  );
}
