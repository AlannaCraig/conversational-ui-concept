'use client';

import { useState, useMemo } from 'react';
import { SCHEDULE_SLOTS } from '@/lib/appointmentsScheduleData';
import type { AppointmentStatus } from '@/lib/appointmentsScheduleData';
import { getMockNotifications, formatNotificationTime } from '@/lib/mockNotifications';
import { CURRENT_USER } from '@/lib/currentUser';
import { Avatar, WeekPicker, Button } from '@/components/ui';
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

function statusBg(status: AppointmentStatus | undefined): string {
  switch (status) {
    case 'In Progress':   return 'var(--success-light)';
    case 'Arrived':       return 'var(--accent-light)';
    case 'Running Late':  return '#FDEBD0';
    case 'DNA':           return 'var(--error-light)';
    case 'Cancelled':     return 'var(--error-light)';
    case 'Completed':     return 'var(--background-inactive)';
    default:              return 'var(--background-soft)';
  }
}

function statusText(status: AppointmentStatus | undefined): string {
  switch (status) {
    case 'In Progress':  return 'var(--success-dark)';
    case 'Arrived':      return 'var(--accent-dark)';
    case 'Running Late': return '#7D4E1F';
    case 'DNA':          return 'var(--error-dark)';
    case 'Cancelled':    return 'var(--error-dark)';
    case 'Completed':    return 'var(--text-secondary)';
    default:             return 'var(--text-secondary)';
  }
}

function statusAccent(status: AppointmentStatus | undefined): string {
  switch (status) {
    case 'In Progress':  return 'var(--success-main)';
    case 'Arrived':      return 'var(--accent-main)';
    case 'Running Late': return '#E87A2D';
    case 'DNA':          return 'var(--error-main)';
    case 'Cancelled':    return 'var(--error-main)';
    case 'Completed':    return 'var(--border)';
    default:             return 'var(--primary-light)';
  }
}

function StatusChip({ status }: { status: AppointmentStatus }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20,
      background: statusBg(status), color: statusText(status),
      whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {status}
    </span>
  );
}

// ── component ─────────────────────────────────────────────────────────────────

interface HomeHubProps {
  onViewAppointments: () => void;
  onBookAppointment: () => void;
  onStartConsultation: (slotId: string) => void;
  onViewNotifications: () => void;
}

export function HomeHub({ onViewAppointments, onBookAppointment, onStartConsultation, onViewNotifications }: HomeHubProps) {
  const [activeTab, setActiveTab] = useState<HomeTab>('day');
  const [notifFilter, setNotifFilter] = useState<NotifFilter>('all');
  const [notifSearch, setNotifSearch] = useState('');

  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);

  // All of Dr Malik's patient appointments
  const allAppts = useMemo(() =>
    SCHEDULE_SLOTS
      .filter(s => s.columnId === CURRENT_USER.columnId && s.type === 'appointment' && s.patientName)
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    []
  );

  const completedCount = allAppts.filter(s => DONE_STATUSES.includes(s.status ?? 'Booked')).length;

  const currentSlot = useMemo(() => (
    allAppts.find(s => s.status === 'In Progress') ??
    allAppts.find(s => s.status === 'Arrived') ??
    allAppts.find(s => s.status === 'Running Late') ??
    allAppts.find(s => !DONE_STATUSES.includes(s.status ?? 'Booked'))
  ), [allAppts]);

  // The slot after the current one (next upcoming)
  const nextSlot = useMemo(() => {
    if (!currentSlot) return null;
    const idx = allAppts.findIndex(s => s.id === currentSlot.id);
    return allAppts.slice(idx + 1).find(s => !DONE_STATUSES.includes(s.status ?? 'Booked')) ?? null;
  }, [allAppts, currentSlot]);

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

  const currentLabel =
    currentSlot?.status === 'In Progress' ? 'In consultation now' :
    currentSlot?.status === 'Arrived'     ? 'Patient arrived' :
    currentSlot?.status === 'Running Late' ? 'Running late' :
    'Up next';

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
    <div className="h-full flex flex-col overflow-hidden">
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
            variant="secondary"
            size="sm"
            leadingIcon={<CalendarIcon size={14} className="text-text-secondary" />}
            onClick={onBookAppointment}
          >
            Book appointment
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leadingIcon={<SearchIcon size={14} className="text-text-secondary" />}
            onClick={onViewAppointments}
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
              {/* Current / next appointment — dark card */}
              <div style={{ background: 'var(--primary-main)', borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                <div style={{ padding: '12px 16px 6px' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(250,248,242,0.55)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                    Upcoming
                  </p>
                </div>

                {/* Current slot */}
                {currentSlot && (
                  <div style={{ padding: '0 16px 12px', borderBottom: nextSlot ? '1px solid rgba(250,248,242,0.12)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                      <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary-contrast)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                        {currentSlot.startTime}
                      </p>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: statusBg(currentSlot.status), color: statusText(currentSlot.status), whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {currentLabel}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary-contrast)', marginBottom: 2 }}>
                      {currentSlot.patientName}
                    </p>
                    <p style={{ fontSize: 11, color: 'rgba(250,248,242,0.6)', marginBottom: 8 }}>
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
                )}

                {/* Next slot */}
                {nextSlot && (
                  <div style={{ padding: '10px 16px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ width: 3, alignSelf: 'stretch', borderRadius: 2, background: 'rgba(250,248,242,0.25)', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary-contrast)', marginBottom: 1 }}>
                          {nextSlot.patientName}
                        </p>
                        <p style={{ fontSize: 11, color: 'rgba(250,248,242,0.55)' }}>
                          {nextSlot.startTime} · {nextSlot.appointmentType}
                        </p>
                      </div>
                    </div>
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
            <WeekPicker selectedDate={today} onSelect={() => {}} />
          </div>

          {/* Appointment timeline */}
          <div style={{ overflowY: 'auto' }} className="hub-appt-scroll conversation-scroll">
            {allAppts.map((slot, i) => (
              <div
                key={slot.id}
                onClick={onViewAppointments}
                className="hover:bg-hover transition-colors cursor-pointer"
                style={{
                  display: 'flex', alignItems: 'stretch',
                  borderBottom: i < allAppts.length - 1 ? '1px solid var(--border-light)' : 'none',
                  opacity: DONE_STATUSES.includes(slot.status ?? 'Booked') && slot.status !== 'DNA' ? 0.55 : 1,
                }}
              >
                {/* Time column */}
                <div style={{
                  flexShrink: 0, width: 52, padding: '11px 8px 11px 18px',
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
                }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                    {slot.startTime}
                  </span>
                </div>
                {/* Accent bar */}
                <div style={{ width: 3, flexShrink: 0, background: statusAccent(slot.status), borderRadius: 2, margin: '8px 0' }} />
                {/* Content */}
                <div style={{ flex: 1, padding: '10px 14px 10px 12px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {slot.patientName}
                    </p>
                    {slot.status && <StatusChip status={slot.status} />}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {slot.chiNumber && (
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>CHI: {slot.chiNumber}</span>
                    )}
                    {slot.phone && (
                      <>
                        <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>·</span>
                        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{slot.phone}</span>
                      </>
                    )}
                  </div>
                  {slot.appointmentType && (
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>{slot.appointmentType} · {slot.durationMins} min</p>
                  )}
                </div>
              </div>
            ))}
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
    </div>
  );
}
