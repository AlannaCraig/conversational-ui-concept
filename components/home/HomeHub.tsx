'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SCHEDULE_SLOTS } from '@/lib/appointmentsScheduleData';
import type { AppointmentStatus, ScheduleSlot } from '@/lib/appointmentsScheduleData';
import { getMockNotifications, formatNotificationTime } from '@/lib/mockNotifications';
import { CURRENT_USER } from '@/lib/currentUser';
import { Avatar, WeekPicker, Button } from '@/components/ui';
import { AppointmentStatusChip, APPOINTMENT_STATUS_CFG, appointmentStatusAccent } from '@/components/ui/AppointmentStatusChip';
import { InteractionStatusChip, INTERACTION_STATUS_CFG } from '@/components/ui/InteractionStatusChip';
import type { InteractionStatus } from '@/lib/appointmentsScheduleData';
import {
  CalendarIcon,
  SearchIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  MoreVerticalIcon,
  TaskIcon,
  ReportIcon,
  PillIcon,
  ReferralIcon,
  NotificationIcon,
  RepeatIcon,
} from '@/components/icons';
import { ActivityPanel } from '@/components/ui';
import type { ActivityItem } from '@/components/ui';
import { WorkItemsContent } from '@/components/workitems/WorkItemsView';
import { ScheduleInteractionModal, type ScheduledInteraction } from '@/components/interactions/ScheduleInteractionModal';
import { AppointmentHoverCard } from '@/components/appointments/AppointmentHoverCard';
import { AppointmentDetailPanel } from '@/components/appointments/AppointmentsDayView';
import { PatientBanner, PatientSummaryCard } from '@/components/ui/LargeAdaptiveCards/PatientSummaryCard';

// ── helpers ──────────────────────────────────────────────────────────────────

type HomeTab = 'day' | 'work';
type NotifFilter = 'all' | 'unread' | 'read';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}


const DONE_STATUSES: AppointmentStatus[] = ['Completed', 'DNA', 'Cancelled'];

const INTERACTION_TYPE_LABEL: Record<string, string> = {
  contact:     'Patient contact',
  review:      'Review',
  'follow-up': 'Follow-up',
  task:        'Task',
};

// ── patient data (shared with PatientSearchModal) ─────────────────────────────

interface HubPatient {
  id: string;
  name: string;
  dob: string;
  chiNumber: string;
  phone: string;
  address: string;
}

const HUB_PATIENTS: HubPatient[] = [
  { id: 'p-001', name: 'WALSH, Peter (Mr)',        dob: '14/03/1958', chiNumber: '312748 5091', phone: '07891 234 560', address: '42 Ashdown Road, Birmingham, B15 2TN'        },
  { id: 'p-002', name: 'DOBSON, Irene (Mrs)',       dob: '22/07/1941', chiNumber: '450619 2837', phone: '07723 456 781', address: '8 Clover Lane, Manchester, M14 6PQ'           },
  { id: 'p-003', name: 'HARTLEY, Charles (Mr)',     dob: '05/11/1965', chiNumber: '871304 6152', phone: '07654 321 098', address: '19 Mill Street, Leeds, LS6 3AB'               },
  { id: 'p-004', name: 'PATEL, Susan (Mrs)',        dob: '30/01/1972', chiNumber: '629015 3874', phone: '07512 876 543', address: '7 Linwood Close, Coventry, CV3 5RN'           },
  { id: 'p-005', name: 'HOLMES, Margaret (Mrs)',    dob: '18/09/1953', chiNumber: '483920 1754', phone: '07832 156 490', address: '3 Fairview Drive, Sheffield, S7 2WP'          },
  { id: 'p-006', name: 'CRAWFORD, Thomas (Mr)',     dob: '27/06/1980', chiNumber: '261083 7492', phone: '07910 244 033', address: '55 Birchwood Avenue, Bristol, BS4 1LX'        },
  { id: 'p-007', name: 'FARROW, Nina (Ms)',         dob: '09/12/1989', chiNumber: '739452 8163', phone: '07741 882 317', address: '12 Oakfield Road, Liverpool, L15 3HE'         },
  { id: 'p-008', name: 'ASHWORTH, Linda (Mrs)',     dob: '03/04/1967', chiNumber: '193507 4826', phone: '07346 890 123', address: '28 Hawthorn Close, Nottingham, NG3 2GX'       },
  { id: 'p-009', name: 'BAINES, Christopher (Mr)', dob: '16/08/1956', chiNumber: '748261 0935', phone: '07867 012 345', address: '6 Parkway Gardens, Leicester, LE2 8AQ'        },
  { id: 'p-010', name: 'MURRAY, David (Mr)',        dob: '11/02/1948', chiNumber: '927146 3580', phone: '07712 678 901', address: '15 Broom Crescent, Edinburgh, EH9 2JQ'        },
  { id: 'p-011', name: 'CLARKSON, Brian (Mr)',      dob: '20/05/1974', chiNumber: '236874 1059', phone: '07634 890 123', address: '9 Willow Road, Oxford, OX4 3PR'               },
  { id: 'p-012', name: 'NEVILLE, Patricia (Mrs)',   dob: '07/10/1963', chiNumber: '384920 6751', phone: '07478 234 567', address: '34 Chestnut Avenue, Cardiff, CF14 7NB'        },
  { id: 'p-013', name: 'REED, James (Mr)',          dob: '25/04/1977', chiNumber: '519083 2647', phone: '07558 123 456', address: '17 Elm Close, Norwich, NR3 4DY'               },
  { id: 'p-014', name: 'PORTER, Angela (Ms)',       dob: '12/09/1985', chiNumber: '672341 8950', phone: '07799 345 678', address: '6 Victoria Terrace, Brighton, BN1 2LQ'        },
  { id: 'p-015', name: 'THORNTON, William (Mr)',    dob: '03/06/1960', chiNumber: '845162 3097', phone: '07621 567 890', address: '21 Mapledene Road, Glasgow, G52 1AB'          },
];

function hubChiToPatientId(chiNumber: string): string {
  const d = chiNumber.replace(/\D/g, '');
  return (['PT-10001', 'PT-10002', 'PT-10003'] as const)[parseInt(d.slice(-1), 10) % 3];
}

// ── PatientSearchModal ────────────────────────────────────────────────────────

function PatientSearchModal({ onClose, onSelectPatient }: {
  onClose: () => void;
  onSelectPatient: (patient: HubPatient) => void;
}) {
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const results = search.trim().length >= 2
    ? HUB_PATIENTS.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.chiNumber.replace(/\s/g, '').includes(search.replace(/\s/g, '')) ||
        p.dob.includes(search)
      ).slice(0, 8)
    : [];

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 9990 }} onClick={onClose} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 9991, width: 520, maxWidth: 'calc(100vw - 32px)', maxHeight: '80vh',
        display: 'flex', flexDirection: 'column',
        background: 'var(--background)', borderRadius: 14,
        boxShadow: '0 20px 60px rgba(0,0,0,0.18)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ flexShrink: 0, height: 52, padding: '0 16px 0 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>Patient lookup</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--text-secondary)', lineHeight: 1, padding: '0 4px' }}>×</button>
        </div>

        {/* Search input */}
        <div style={{ flexShrink: 0, padding: '16px 20px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 12px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background-soft)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        </div>

        {/* Results */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }} className="conversation-scroll">
          {search.trim().length < 2 && (
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', paddingTop: 4 }}>Type at least 2 characters to search…</p>
          )}
          {search.trim().length >= 2 && results.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', paddingTop: 4 }}>No patients found.</p>
          )}
          {results.length > 0 && (
            <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
              {results.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => { onSelectPatient(p); onClose(); }}
                  style={{
                    width: '100%', padding: '11px 14px', display: 'flex', flexDirection: 'column', gap: 3,
                    background: 'transparent', border: 'none',
                    borderBottom: i < results.length - 1 ? '1px solid var(--border-light)' : 'none',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--hover)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.dob} · {p.chiNumber}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.address}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}

// ── status dropdowns ─────────────────────────────────────────────────────────

const APPT_STATUSES: AppointmentStatus[] = ['Booked', 'Arrived', 'In Progress', 'Completed', 'DNA', 'Cancelled'];
const INTERACTION_STATUSES: InteractionStatus[] = ['To do', 'In progress', 'Completed'];

function calcDropPos(anchorRect: DOMRect, dropW: number, dropH: number) {
  let top = anchorRect.bottom + 4;
  if (top + dropH > window.innerHeight - 8) top = anchorRect.top - dropH - 4;
  let left = anchorRect.left;
  if (left + dropW > window.innerWidth - 8) left = window.innerWidth - dropW - 8;
  return { top: Math.max(8, top), left: Math.max(8, left) };
}

function HubStatusDropdown({ anchorRect, current, onSelect, onClose }: {
  anchorRect: DOMRect;
  current: AppointmentStatus | undefined;
  onSelect: (s: AppointmentStatus) => void;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const DROP_W = 164, ITEM_H = 36, PAD = 6;
  const { top, left } = calcDropPos(anchorRect, DROP_W, APPT_STATUSES.length * ITEM_H + PAD * 2);

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }} onMouseDown={onClose} />
      <div
        style={{
          position: 'fixed', top, left, width: DROP_W, zIndex: 9999,
          background: 'var(--background)', border: '1px solid var(--border)',
          borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
          padding: `${PAD}px`,
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        {APPT_STATUSES.map(s => {
          const cfg = APPOINTMENT_STATUS_CFG[s];
          const isActive = s === current;
          return (
            <button
              key={s}
              onClick={() => { onSelect(s); onClose(); }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors"
              style={{ background: isActive ? 'var(--hover)' : 'transparent' }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--hover)'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, whiteSpace: 'nowrap' }}>
                {s}
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

function HubInteractionStatusDropdown({ anchorRect, current, onSelect, onClose }: {
  anchorRect: DOMRect;
  current: InteractionStatus;
  onSelect: (s: InteractionStatus) => void;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const DROP_W = 148, ITEM_H = 36, PAD = 6;
  const { top, left } = calcDropPos(anchorRect, DROP_W, INTERACTION_STATUSES.length * ITEM_H + PAD * 2);

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }} onMouseDown={onClose} />
      <div
        style={{
          position: 'fixed', top, left, width: DROP_W, zIndex: 9999,
          background: 'var(--background)', border: '1px solid var(--border)',
          borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
          padding: `${PAD}px`,
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        {INTERACTION_STATUSES.map(s => {
          const cfg = INTERACTION_STATUS_CFG[s];
          const isActive = s === current;
          return (
            <button
              key={s}
              onClick={() => { onSelect(s); onClose(); }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors"
              style={{ background: isActive ? 'var(--hover)' : 'transparent' }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--hover)'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, whiteSpace: 'nowrap' }}>
                {s}
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

// ── component ─────────────────────────────────────────────────────────────────

interface HomeHubProps {
  onViewAppointments: () => void;
  onScheduleInteraction: (patient?: { name: string; chiNumber: string } | null) => void;
  onStartConsultation: (slotId: string) => void;
  onViewNotifications: () => void;
  bookedSlots?: Record<string, ScheduleSlot>;
  statusOverrides?: Record<string, AppointmentStatus>;
  onStatusOverride?: (key: string, status: AppointmentStatus) => void;
  scheduledInteractions?: ScheduledInteraction[];
  onInteractionScheduled?: (interaction: ScheduledInteraction) => void;
  onInteractionStatusChange?: (id: string, status: InteractionStatus) => void;
}

export function HomeHub({ onViewAppointments, onScheduleInteraction, onStartConsultation, onViewNotifications, bookedSlots = {}, statusOverrides = {}, onStatusOverride, scheduledInteractions, onInteractionScheduled, onInteractionStatusChange }: HomeHubProps) {
  const [activeTab, setActiveTab] = useState<HomeTab>('day');
  const [notifFilter, setNotifFilter] = useState<NotifFilter>('all');
  const [notifSearch, setNotifSearch] = useState('');
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleContextPatient, setScheduleContextPatient] = useState<{ name: string; chiNumber: string; dob?: string; phone?: string } | null>(null);
  const [patientSearchOpen, setPatientSearchOpen] = useState(false);
  const [patientView, setPatientView] = useState<HubPatient | null>(null);
  const [displayDate, setDisplayDate] = useState<Date>(() => { const d = new Date(); d.setHours(0,0,0,0); return d; });
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);
  const [hoverSlot, setHoverSlot] = useState<{ slot: ScheduleSlot; rect: DOMRect } | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [apptChipDrop, setApptChipDrop] = useState<{ slotId: string; rect: DOMRect } | null>(null);
  const [iSlotChipDrop, setISlotChipDrop] = useState<{ slotId: string; rect: DOMRect } | null>(null);
  const [siChipDrop, setSiChipDrop] = useState<{ id: string; rect: DOMRect } | null>(null);
  const [interactionOverrides, setInteractionOverrides] = useState<Record<string, InteractionStatus>>({});

  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);

  const todayDateKey = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }, []);

  // All of Dr Malik's patient appointments (for the "Upcoming" card)
  const allAppts = useMemo(() => {
    const dk = todayDateKey;
    return SCHEDULE_SLOTS
      .filter(s => s.columnId === CURRENT_USER.columnId)
      .map(s => {
        const base = bookedSlots[`${s.id}:${dk}`] ?? s;
        const ovr = statusOverrides[`${s.id}:${dk}`];
        return ovr ? { ...base, status: ovr } : base;
      })
      .filter(s => s.type === 'appointment' && s.patientName)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [bookedSlots, todayDateKey, statusOverrides]);

  const isDisplayDateToday = displayDate.toDateString() === today.toDateString();

  const displayDateKey = useMemo(() => {
    return `${displayDate.getFullYear()}-${displayDate.getMonth()}-${displayDate.getDate()}`;
  }, [displayDate]);

  // All schedule items — appointments + interactions (for the mini-calendar)
  const allScheduleItems = useMemo(() => {
    const dk = displayDateKey;
    return SCHEDULE_SLOTS
      .filter(s => s.columnId === CURRENT_USER.columnId)
      .map(s => {
        const base = bookedSlots[`${s.id}:${dk}`] ?? s;
        const statusOvr = statusOverrides[`${s.id}:${dk}`];
        const iOvr = interactionOverrides[s.id];
        return {
          ...(statusOvr ? { ...base, status: statusOvr } : base),
          ...(iOvr ? { interactionStatus: iOvr } : {}),
        };
      })
      .filter(s => s.type !== 'blocked' && s.type !== 'available')
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [bookedSlots, displayDateKey, statusOverrides, interactionOverrides]);

  const completedCount = allAppts.filter(s => DONE_STATUSES.includes(s.status ?? 'Booked')).length;

  const currentSlot = useMemo(() => (
    allAppts.find(s => s.status === 'In Progress') ??
    allAppts.find(s => s.status === 'Arrived') ??
    allAppts.find(s => s.status === 'Running Late') ??
    allAppts.find(s => !DONE_STATUSES.includes(s.status ?? 'Booked'))
  ), [allAppts]);

  // All notifications
  const allNotifs = useMemo(() => getMockNotifications(), []);
  const filteredNotifs = useMemo(() => {
    let list = allNotifs;
    if (notifFilter === 'unread') list = list.filter(n => !n.isRead);
    if (notifFilter === 'read') list = list.filter(n => n.isRead);
    if (notifSearch.trim()) {
      const q = notifSearch.toLowerCase();
      list = list.filter(n => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q));
    }
    return list;
  }, [allNotifs, notifFilter, notifSearch]);

  const unreadCount = useMemo(() => allNotifs.filter(n => !n.isRead).length, [allNotifs]);


  // Separate notifications into today vs yesterday vs older
  const todayNotifs = filteredNotifs.filter(n => {
    const d = new Date(n.timestamp); d.setHours(0,0,0,0);
    return d.getTime() === today.getTime();
  });
  const olderNotifs = filteredNotifs.filter(n => {
    const d = new Date(n.timestamp); d.setHours(0,0,0,0);
    return d.getTime() !== today.getTime();
  });

  const workItems = [
    { Icon: TaskIcon,     label: '3 tasks due today',        sub: '1 overdue',                  urgent: true  },
    { Icon: ReportIcon,   label: '4 results to review',      sub: 'FBC, TFTs, HbA1c',           urgent: false },
    { Icon: PillIcon,     label: '17 prescriptions to sign', sub: 'Awaiting authorisation',      urgent: false },
    { Icon: ReferralIcon, label: '2 referral letters',       sub: 'Require signature',           urgent: false },
  ] as const;

  const activityItems: ActivityItem[] = [
    {
      id: 'act-1',
      user: 'You',
      userInitials: CURRENT_USER.initials,
      avatarVariant: 'accent1',
      action: 'edited',
      target: 'medication review notes',
      timestamp: 'Today, 10:32',
      iconType: 'edit',
    },
    {
      id: 'act-2',
      user: 'You',
      userInitials: CURRENT_USER.initials,
      avatarVariant: 'accent1',
      action: 'viewed',
      target: "this patient's record",
      timestamp: 'Today, 10:28',
      iconType: 'view',
      details: [
        { label: 'Patient', value: 'CRAWFORD, Thomas (Mr)' },
        { label: 'NHS No', value: '943 476 5628' },
      ],
    },
    {
      id: 'act-3',
      user: 'You',
      userInitials: CURRENT_USER.initials,
      avatarVariant: 'accent1',
      action: 'added',
      target: 'a referral letter for FARROW, Nina',
      timestamp: 'Today, 09:55',
      iconType: 'add',
    },
    {
      id: 'act-4',
      user: 'You',
      userInitials: CURRENT_USER.initials,
      avatarVariant: 'accent1',
      action: 'created a task',
      target: 'to chase FBC results',
      timestamp: 'Today, 09:40',
      iconType: 'task',
      details: [
        { label: 'Task ID', value: 'TSK-20845', isLink: true },
      ],
    },
    {
      id: 'act-5',
      user: 'You',
      userInitials: CURRENT_USER.initials,
      avatarVariant: 'accent1',
      action: 'booked an appointment',
      target: 'for FARROW, Nina',
      timestamp: 'Today, 09:38',
      iconType: 'appointment',
    },
  ];

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ position: 'relative' }}>
      <style>{`
        /* ── Hub responsive grid ───────────────────────── */
        .hub-body {
          flex: 1;
          min-height: 0;
          display: grid;
          gap: 14px;
          padding: 14px 16px 16px;
          /* Narrow: single column, body scrolls */
          grid-template-columns: 1fr;
          overflow-y: auto;
        }
        .hub-col-left, .hub-col-centre, .hub-col-right {
          min-width: 0;
          min-height: 0;
        }
        .hub-col-left   { grid-area: left;   }
        .hub-col-centre { grid-area: centre; }
        .hub-col-right  { grid-area: right;  }

        /* Medium desktop (1024–1279px): 2 columns, centre dominant */
        @media (min-width: 1024px) {
          .hub-body {
            overflow: hidden;
            grid-template-columns: 1fr 1.6fr;
            grid-template-rows: 1fr 1fr;
            grid-template-areas:
              'left   centre'
              'right  centre';
          }
        }

        /* Large desktop (≥1280px): full 3-column layout */
        @media (min-width: 1280px) {
          .hub-body {
            grid-template-columns: 1fr 1.6fr 1fr;
            grid-template-rows: 1fr;
            grid-template-areas: 'left centre right';
          }
        }

        /* Recent activity — natural height at narrow, fill column at desktop */
        .hub-recent-activity { flex-shrink: 0; }
        @media (min-width: 1024px) {
          .hub-recent-activity { flex: 1; min-height: 0; overflow: hidden; }
          .hub-recent-activity-scroll { flex: 1; overflow-y: auto; min-height: 0; }
        }

        /* Appointment timeline — min-height at narrow, flex fill at desktop */
        .hub-appt-scroll { min-height: 320px; }
        @media (min-width: 1024px) {
          .hub-appt-scroll { flex: 1; min-height: 0; }
        }

        /* Notification list — min-height at narrow, flex fill at desktop */
        .hub-notif-scroll { min-height: 280px; }
        @media (min-width: 1024px) {
          .hub-notif-scroll { flex: 1; min-height: 0; }
        }
      `}</style>

      {/* ── User header ─────────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', gap: 16,
        padding: '20px 24px 18px', borderBottom: '1px solid var(--border)',
        background: 'var(--background)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar initials={CURRENT_USER.initials} variant="accent1" size={44} />
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 2 }}>
              Good {getGreeting()}, {CURRENT_USER.name}
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {CURRENT_USER.role} · {CURRENT_USER.practice} · {CURRENT_USER.location}
            </p>
          </div>
        </div>
        {/* Header actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 2 }}>
          <Button
            variant="primary"
            size="sm"
            leadingIcon={<CalendarIcon size={14} className="text-primary-contrast" />}
            onClick={() => { setScheduleContextPatient(null); setScheduleOpen(true); }}
          >
            Schedule an interaction
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leadingIcon={<SearchIcon size={14} className="text-text-secondary" />}
            onClick={() => setPatientSearchOpen(true)}
          >
            Patient lookup
          </Button>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0, display: 'flex', gap: 0,
        paddingLeft: 24, borderBottom: '1px solid var(--border)',
        background: 'var(--background)',
      }}>
        {(['day', 'work'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              height: 42, paddingLeft: 16, paddingRight: 16,
              fontSize: 13, fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid var(--primary-main)' : '2px solid transparent',
              marginBottom: -1, display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {tab === 'day' ? 'My day' : 'My work items'}
            {tab === 'work' && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 16, height: 16, borderRadius: '50%',
                background: 'var(--accent-main)', color: 'var(--accent-contrast)',
                fontSize: 9, fontWeight: 700,
              }}>4</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      {activeTab === 'work' ? (
        <WorkItemsContent />
      ) : (
      <div style={{ background: 'var(--background-soft)' }} className="hub-body">

        {/* ══ LEFT COLUMN ════════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}
             className="hub-col-left">

          {activeTab === 'day' ? (
            <>
              {/* Current/upcoming appointment — dark card */}
              <div style={{ background: 'var(--primary-main)', borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                <div style={{ padding: '16px 18px 0' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(250,248,242,0.55)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
                    Upcoming
                  </p>
                </div>

                {currentSlot ? (
                  <div style={{ padding: '0 18px 18px' }}>
                    {/* Time + status */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                      <p style={{ fontSize: 34, fontWeight: 700, color: 'var(--primary-contrast)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                        {currentSlot.startTime}
                      </p>
                      {currentSlot.status && (
                        <span style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.92)', borderRadius: 24, padding: 1, flexShrink: 0 }}>
                          <AppointmentStatusChip status={currentSlot.status as AppointmentStatus} />
                        </span>
                      )}
                    </div>
                    {/* Patient name */}
                    <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--primary-contrast)', marginBottom: 4, lineHeight: 1.3 }}>
                      {currentSlot.patientName}
                    </p>
                    {/* Appointment details */}
                    <p style={{ fontSize: 12, color: 'rgba(250,248,242,0.6)', marginBottom: 16 }}>
                      {currentSlot.appointmentType}
                      {currentSlot.durationMins ? ` · ${currentSlot.durationMins} min` : ''}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onStartConsultation(currentSlot.id)}
                      style={{
                        width: '100%',
                        background: 'rgba(250,248,242,0.12)',
                        border: '1px solid rgba(250,248,242,0.3)',
                        color: 'var(--primary-contrast)',
                      }}
                      className="hover:opacity-80 transition-opacity"
                    >
                      Start consultation
                    </Button>
                  </div>
                ) : (
                  <div style={{ padding: '0 18px 20px' }}>
                    <p style={{ fontSize: 13, color: 'rgba(250,248,242,0.45)', fontStyle: 'italic' }}>No appointments scheduled</p>
                  </div>
                )}
              </div>

              {/* Work items */}
              <div style={{ background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                {workItems.map(({ Icon, label, sub, urgent }, i) => (
                  <div
                    key={label}
                    className="hover:bg-hover transition-colors cursor-pointer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 14px',
                      borderBottom: i < workItems.length - 1 ? '1px solid var(--border-light)' : 'none',
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                      background: urgent ? 'var(--accent-light)' : 'var(--background-soft)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={14} className={urgent ? 'text-accent-dark' : 'text-text-secondary'} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: urgent ? 'var(--accent-dark)' : 'var(--text-primary)' }}>{label}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{sub}</p>
                    </div>
                    <ArrowRightIcon size={14} className="text-text-secondary flex-shrink-0" />
                  </div>
                ))}
              </div>

              {/* Recent activity */}
              <div style={{
                background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 12,
                display: 'flex', flexDirection: 'column',
              }} className="hub-recent-activity">
                <div style={{ flexShrink: 0, padding: '12px 14px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 7 }}>
                  <RepeatIcon size={14} className="text-text-secondary" />
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Recent activity</p>
                </div>
                <div style={{ padding: '12px' }} className="hub-recent-activity-scroll conversation-scroll">
                  <ActivityPanel variant="card" items={activityItems} />
                </div>
              </div>
            </>
          ) : (
            /* My work items tab — left column content */
            <div style={{ background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Outstanding work</p>
              </div>
              {workItems.map(({ Icon, label, sub, urgent }, i) => (
                <div
                  key={label}
                  className="hover:bg-hover transition-colors cursor-pointer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
                    borderBottom: i < workItems.length - 1 ? '1px solid var(--border-light)' : 'none',
                  }}
                >
                  <div style={{
                    width: 30, height: 30, borderRadius: 7, flexShrink: 0,
                    background: urgent ? 'var(--accent-light)' : 'var(--background-soft)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={15} className={urgent ? 'text-accent-dark' : 'text-text-secondary'} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: urgent ? 'var(--accent-dark)' : 'var(--text-primary)' }}>{label}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{sub}</p>
                  </div>
                  <ArrowRightIcon size={14} className="text-text-secondary" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ══ CENTRE COLUMN — My Calendar ════════════════════════════════════ */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 12,
          overflow: 'hidden',
        }} className="hub-col-centre">
          {/* Calendar header */}
          <div style={{ flexShrink: 0, padding: '14px 18px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarIcon size={16} className="text-text-secondary" />
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>My calendar</p>
              {!isDisplayDateToday && (
                <>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {displayDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                  <button
                    onClick={() => setDisplayDate(today)}
                    style={{ fontSize: 11, color: 'var(--primary-main)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                  >
                    Today
                  </button>
                </>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Button
                variant="secondary"
                size="xs"
                onClick={onViewAppointments}
                className="text-text-secondary"
              >
                Full day view →
              </Button>
              <button style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', borderRadius: 6 }} className="hover:bg-hover transition-colors">
                <MoreVerticalIcon size={16} className="text-text-secondary" />
              </button>
            </div>
          </div>

          {/* Week navigation */}
          <div style={{ flexShrink: 0, padding: '10px 18px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'center' }}>
            <WeekPicker selectedDate={displayDate} onSelect={setDisplayDate} />
          </div>

          {/* Schedule timeline — appointments + interactions */}
          <div style={{ overflowY: 'auto' }} className="hub-appt-scroll conversation-scroll">
            {allScheduleItems.map((slot, i) => {
              const isInteraction = slot.type !== 'appointment';
              const isApptDone = !isInteraction && DONE_STATUSES.includes(slot.status ?? 'Booked') && slot.status !== 'DNA';
              const canHover = !isInteraction && !!slot.patientName;
              return (
                <div
                  key={slot.id}
                  onClick={() => {
                    if (hoverTimerRef.current) { clearTimeout(hoverTimerRef.current); hoverTimerRef.current = null; }
                    setHoverSlot(null);
                    if (canHover) setSelectedSlot(slot);
                    else onViewAppointments();
                  }}
                  onMouseEnter={canHover ? (e) => {
                    const el = e.currentTarget as HTMLElement;
                    hoverTimerRef.current = setTimeout(() => {
                      setHoverSlot({ slot, rect: el.getBoundingClientRect() });
                    }, 150);
                  } : undefined}
                  onMouseLeave={canHover ? () => {
                    if (hoverTimerRef.current) { clearTimeout(hoverTimerRef.current); hoverTimerRef.current = null; }
                    setHoverSlot(null);
                  } : undefined}
                  className="hover:bg-hover transition-colors cursor-pointer"
                  style={{
                    display: 'flex', alignItems: 'stretch',
                    borderBottom: i < allScheduleItems.length - 1 ? '1px solid var(--border-light)' : 'none',
                    opacity: isApptDone ? 0.55 : 1,
                  }}
                >
                  {/* Time column */}
                  <div style={{ flexShrink: 0, width: 52, padding: '11px 8px 11px 18px', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                      {slot.startTime}
                    </span>
                  </div>
                  {/* Accent bar */}
                  <div style={{ width: 3, flexShrink: 0, background: isInteraction ? 'var(--border)' : appointmentStatusAccent(slot.status), borderRadius: 2, margin: '8px 0' }} />
                  {/* Content */}
                  <div style={{ flex: 1, padding: '10px 14px 10px 12px', minWidth: 0 }}>
                    {isInteraction ? (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {slot.title ?? slot.appointmentType}
                          </p>
                          {slot.interactionStatus && (
                            <div
                              role="button"
                              tabIndex={0}
                              title="Change status"
                              className="cursor-pointer transition-opacity hover:opacity-70 inline-flex rounded-full"
                              onClick={e => { e.stopPropagation(); setISlotChipDrop({ slotId: slot.id, rect: (e.currentTarget as HTMLElement).getBoundingClientRect() }); }}
                            >
                              <InteractionStatusChip status={slot.interactionStatus} />
                            </div>
                          )}
                        </div>
                        {slot.patientName && (
                          <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>
                            {slot.patientName} · {INTERACTION_TYPE_LABEL[slot.type] ?? slot.type}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {slot.patientName}
                          </p>
                          {slot.status && (
                            <div
                              role="button"
                              tabIndex={0}
                              title="Change status"
                              className="cursor-pointer transition-opacity hover:opacity-70 inline-flex rounded-full"
                              onClick={e => { e.stopPropagation(); setApptChipDrop({ slotId: slot.id, rect: (e.currentTarget as HTMLElement).getBoundingClientRect() }); }}
                            >
                              <AppointmentStatusChip status={slot.status} />
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {slot.chiNumber && <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>CHI: {slot.chiNumber}</span>}
                          {slot.phone && <>
                            <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>·</span>
                            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{slot.phone}</span>
                          </>}
                        </div>
                        {slot.appointmentType && (
                          <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>{slot.appointmentType} · {slot.durationMins} min</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            {/* Scheduled interactions */}
            {(scheduledInteractions ?? []).length > 0 && (
              <div>
                <div style={{ padding: '8px 18px 4px', borderTop: '1px solid var(--border-light)' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Scheduled interactions
                  </p>
                </div>
                {(scheduledInteractions ?? []).map((item, i, arr) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex', alignItems: 'flex-start',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--border-light)' : 'none',
                    }}
                  >
                    <div style={{ flexShrink: 0, width: 52, padding: '11px 8px 11px 18px', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: 10, color: 'var(--text-secondary)', textAlign: 'right' }}>{item.dueDate}</span>
                    </div>
                    <div style={{ width: 3, flexShrink: 0, background: 'var(--border)', borderRadius: 2, margin: '8px 0' }} />
                    <div style={{ flex: 1, padding: '10px 14px 10px 12px', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.description || INTERACTION_TYPE_LABEL[item.type] || item.type}
                        </p>
                        <div
                          role="button"
                          tabIndex={0}
                          title="Change status"
                          className="cursor-pointer transition-opacity hover:opacity-70 inline-flex rounded-full"
                          onClick={e => { e.stopPropagation(); setSiChipDrop({ id: item.id, rect: (e.currentTarget as HTMLElement).getBoundingClientRect() }); }}
                        >
                          <InteractionStatusChip status={item.status} />
                        </div>
                      </div>
                      {item.patientName && <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{item.patientName}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══ RIGHT COLUMN — Notifications ═══════════════════════════════════ */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 12,
          overflow: 'hidden',
        }} className="hub-col-right">
          {/* Notifications header */}
          <div style={{ flexShrink: 0, padding: '14px 18px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <NotificationIcon size={16} className="text-text-secondary" />
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Notifications</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {unreadCount > 0 && (
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: 'var(--error-light)', color: 'var(--error-dark)' }}>
                  {unreadCount}
                </span>
              )}
              <button style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', borderRadius: 6 }} className="hover:bg-hover transition-colors">
                <MoreVerticalIcon size={16} className="text-text-secondary" />
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderBottom: '1px solid var(--border-light)' }}>
            {(['all', 'unread', 'read'] as const).map(f => (
              <button
                key={f}
                onClick={() => setNotifFilter(f)}
                style={{
                  height: 28, paddingLeft: 12, paddingRight: 12, borderRadius: 20,
                  border: `1px solid ${notifFilter === f ? 'var(--primary-main)' : 'var(--border)'}`,
                  background: notifFilter === f ? 'var(--primary-main)' : 'var(--background)',
                  color: notifFilter === f ? 'var(--primary-contrast)' : 'var(--text-secondary)',
                  fontSize: 11, fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize',
                }}
              >
                {f}
              </button>
            ))}
            {/* Search */}
            <div style={{ position: 'relative', flex: 1 }}>
              <SearchIcon size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search..."
                value={notifSearch}
                onChange={e => setNotifSearch(e.target.value)}
                style={{
                  width: '100%', height: 28, paddingLeft: 26, paddingRight: 8,
                  fontSize: 11, color: 'var(--text-primary)', background: 'var(--background)',
                  border: '1px solid var(--border)', borderRadius: 20, outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Notification list */}
          <div style={{ overflowY: 'auto' }} className="hub-notif-scroll conversation-scroll">
            {filteredNotifs.length === 0 ? (
              <p style={{ padding: '24px 18px', fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>
                No notifications
              </p>
            ) : (
              <>
                {todayNotifs.length > 0 && (
                  <>
                    <div style={{ padding: '10px 18px 6px' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Today</p>
                    </div>
                    {todayNotifs.map((n, i) => (
                      <div
                        key={n.id}
                        className="hover:bg-hover transition-colors cursor-pointer"
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: 10,
                          padding: '10px 18px',
                          borderBottom: '1px solid var(--border-light)',
                        }}
                      >
                        <div style={{
                          width: 7, height: 7, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                          background: !n.isRead ? (n.isUrgent ? 'var(--error-main)' : 'var(--primary-main)') : 'transparent',
                          border: !n.isRead ? 'none' : '1.5px solid var(--border)',
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6, marginBottom: 3 }}>
                            <p style={{ fontSize: 12, fontWeight: n.isRead ? 400 : 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {n.title}
                            </p>
                            <span style={{ fontSize: 10, color: 'var(--text-secondary)', flexShrink: 0 }}>
                              {formatNotificationTime(n.timestamp)}
                            </span>
                          </div>
                          <p className="line-clamp-2" style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                            {n.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                {olderNotifs.length > 0 && (
                  <>
                    <div style={{ padding: '10px 18px 6px' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Earlier</p>
                    </div>
                    {olderNotifs.map((n) => (
                      <div
                        key={n.id}
                        className="hover:bg-hover transition-colors cursor-pointer"
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: 10,
                          padding: '10px 18px',
                          borderBottom: '1px solid var(--border-light)',
                        }}
                      >
                        <div style={{
                          width: 7, height: 7, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                          background: !n.isRead ? 'var(--primary-main)' : 'transparent',
                          border: !n.isRead ? 'none' : '1.5px solid var(--border)',
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6, marginBottom: 3 }}>
                            <p style={{ fontSize: 12, fontWeight: n.isRead ? 400 : 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {n.title}
                            </p>
                            <span style={{ fontSize: 10, color: 'var(--text-secondary)', flexShrink: 0 }}>
                              {formatNotificationTime(n.timestamp)}
                            </span>
                          </div>
                          <p className="line-clamp-2" style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                            {n.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}

            {/* View all */}
            <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border-light)' }}>
              <button
                onClick={onViewNotifications}
                style={{ fontSize: 12, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                className="hover:text-text-primary transition-colors"
              >
                View all notifications →
              </button>
            </div>
          </div>
        </div>

      </div>
      )}
      {scheduleOpen && (
        <ScheduleInteractionModal
          isOpen={true}
          onClose={() => { setScheduleOpen(false); setScheduleContextPatient(null); }}
          onBookAppointment={() => {
              const patient = scheduleContextPatient ? { name: scheduleContextPatient.name, chiNumber: scheduleContextPatient.chiNumber } : null;
              setScheduleOpen(false);
              setScheduleContextPatient(null);
              onScheduleInteraction(patient);
            }}
          onSchedule={onInteractionScheduled}
          contextPatient={scheduleContextPatient}
        />
      )}
      {patientSearchOpen && (
        <PatientSearchModal
          onClose={() => setPatientSearchOpen(false)}
          onSelectPatient={p => { setPatientSearchOpen(false); setPatientView(p); }}
        />
      )}
      {hoverSlot && <AppointmentHoverCard slot={hoverSlot.slot} anchorRect={hoverSlot.rect} />}
      {apptChipDrop && (() => {
        const slot = allScheduleItems.find(s => s.id === apptChipDrop.slotId);
        if (!slot) return null;
        return (
          <HubStatusDropdown
            anchorRect={apptChipDrop.rect}
            current={slot.status as AppointmentStatus | undefined}
            onSelect={s => { if (onStatusOverride) onStatusOverride(`${slot.id}:${displayDateKey}`, s); }}
            onClose={() => setApptChipDrop(null)}
          />
        );
      })()}
      {iSlotChipDrop && (() => {
        const slot = allScheduleItems.find(s => s.id === iSlotChipDrop.slotId);
        if (!slot?.interactionStatus) return null;
        return (
          <HubInteractionStatusDropdown
            anchorRect={iSlotChipDrop.rect}
            current={slot.interactionStatus}
            onSelect={s => setInteractionOverrides(prev => ({ ...prev, [iSlotChipDrop.slotId]: s }))}
            onClose={() => setISlotChipDrop(null)}
          />
        );
      })()}
      {siChipDrop && (() => {
        const item = (scheduledInteractions ?? []).find(i => i.id === siChipDrop.id);
        if (!item) return null;
        return (
          <HubInteractionStatusDropdown
            anchorRect={siChipDrop.rect}
            current={item.status}
            onSelect={s => { if (onInteractionStatusChange) onInteractionStatusChange(item.id, s); }}
            onClose={() => setSiChipDrop(null)}
          />
        );
      })()}
      {selectedSlot && (
        <AppointmentDetailPanel
          slot={selectedSlot}
          selectedDate={displayDate}
          onClose={() => setSelectedSlot(null)}
          onStartConsultation={() => { onStartConsultation(selectedSlot.id); setSelectedSlot(null); }}
          onViewPatient={selectedSlot.patientName ? () => {
              const chi = selectedSlot.chiNumber ?? '';
              const found = HUB_PATIENTS.find(p => p.chiNumber.replace(/\s/g, '') === chi.replace(/\s/g, ''));
              setPatientView(found ?? {
                id: selectedSlot.id,
                name: selectedSlot.patientName ?? 'Unknown',
                dob: '',
                chiNumber: chi,
                phone: selectedSlot.phone ?? '',
                address: '',
              });
              setSelectedSlot(null);
            } : undefined}
        />
      )}

      {/* Patient record overlay — triggered by Patient lookup */}
      {patientView && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'var(--background-soft)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Top bar */}
          <div style={{ flexShrink: 0, height: 52, padding: '0 20px', borderBottom: '1px solid var(--border)', background: 'var(--background)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button
              variant="ghost"
              size="sm"
              leadingIcon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                </svg>
              }
              onClick={() => setPatientView(null)}
            >
              Back
            </Button>
            <div style={{ width: 1, height: 18, background: 'var(--border)', flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Patient summary</span>
          </div>
          {/* Scrollable content */}
          <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }} className="conversation-scroll">
            <PatientBanner
              patientName={patientView.name}
              dateOfBirth={patientView.dob}
              chiNumber={patientView.chiNumber}
              sex={/\(Mr\)/.test(patientView.name) ? 'Male' : /\(Mrs\)|\(Ms\)|\(Miss\)/.test(patientView.name) ? 'Female' : undefined}
              className="mb-4"
              onAddInteraction={() => {
                setScheduleContextPatient({ name: patientView.name, chiNumber: patientView.chiNumber, dob: patientView.dob, phone: patientView.phone });
                setScheduleOpen(true);
              }}
            />
            <PatientSummaryCard activePatientId={hubChiToPatientId(patientView.chiNumber)} />
          </div>
        </div>
      )}
    </div>
  );
}
