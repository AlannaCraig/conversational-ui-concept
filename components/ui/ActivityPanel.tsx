'use client';

import { ReactNode } from 'react';
import { Avatar } from './Avatar';
import {
  EyeIcon,
  TaskIcon,
  FolderIcon,
  PatientIcon,
  PlusIcon,
  EditIcon,
  AppointmentIcon,
  ReferralIcon,
  NotificationIcon,
  ChatsIcon,
  SearchIcon,
} from '@/components/icons';

// ─────────────────────────────────────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────────────────────────────────────

export type ActivityIconType =
  | 'view'
  | 'task'
  | 'file'
  | 'patient'
  | 'add'
  | 'edit'
  | 'appointment'
  | 'referral'
  | 'notification'
  | 'chat'
  | 'search';

export interface ActivityDetail {
  label: string;
  value?: string; // omit to render as a section heading
  isLink?: boolean;
}

export interface ActivityItem {
  id: string;
  user: string;
  userInitials: string;
  avatarVariant?: 'accent1' | 'accent2' | 'accent3';
  action: string;
  target?: string;
  timestamp: string;
  iconType: ActivityIconType;
  details?: ActivityDetail[];
}

export interface ActivityPanelProps {
  items: ActivityItem[];
  variant?: 'card' | 'compact';
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Icon configuration
// ─────────────────────────────────────────────────────────────────────────────

const ICON_CONFIG: Record<ActivityIconType, { bg: string; colorClass: string }> = {
  view:         { bg: 'var(--success-light)',   colorClass: 'text-success-dark'        },
  task:         { bg: 'var(--accent3-light)',   colorClass: 'text-accent3-dark'        },
  file:         { bg: 'var(--primary-main)',    colorClass: 'text-primary-contrast'    },
  patient:      { bg: 'var(--accent-light)',    colorClass: 'text-accent-dark'         },
  add:          { bg: 'var(--primary-main)',    colorClass: 'text-primary-contrast'    },
  edit:         { bg: 'var(--accent1-light)',   colorClass: 'text-accent1-dark'        },
  appointment:  { bg: 'var(--success-light)',   colorClass: 'text-success-dark'        },
  referral:     { bg: 'var(--accent2-light)',   colorClass: 'text-accent2-dark'        },
  notification: { bg: 'var(--error-light)',     colorClass: 'text-error-dark'          },
  chat:         { bg: 'var(--accent3-light)',   colorClass: 'text-accent3-dark'        },
  search:       { bg: 'var(--background-soft)', colorClass: 'text-text-secondary'      },
};

// Name highlight colors for compact variant (matches Avatar variant → bg)
const VARIANT_NAME_COLOR: Record<'accent1' | 'accent2' | 'accent3', string> = {
  accent1: 'var(--accent1-main)',
  accent2: 'var(--accent2-main)',
  accent3: 'var(--accent3-main)',
};

function renderIcon(iconType: ActivityIconType, size: number, colorClass: string): ReactNode {
  const props = { size, className: colorClass };
  switch (iconType) {
    case 'view':         return <EyeIcon {...props} />;
    case 'task':         return <TaskIcon {...props} />;
    case 'file':         return <FolderIcon {...props} />;
    case 'patient':      return <PatientIcon {...props} />;
    case 'add':          return <PlusIcon {...props} />;
    case 'edit':         return <EditIcon {...props} />;
    case 'appointment':  return <AppointmentIcon {...props} />;
    case 'referral':     return <ReferralIcon {...props} />;
    case 'notification': return <NotificationIcon {...props} />;
    case 'chat':         return <ChatsIcon {...props} />;
    case 'search':       return <SearchIcon {...props} />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Detail block (shared between variants)
// ─────────────────────────────────────────────────────────────────────────────

function DetailBlock({ details }: { details: ActivityDetail[] }) {
  return (
    <div style={{
      background: 'var(--background-soft)',
      border: '1px solid var(--border-light)',
      borderRadius: 8,
      marginTop: 10,
      overflow: 'hidden',
    }}>
      {details.map((d, i) => {
        const isHeading = d.value === undefined;
        const isLast = i === details.length - 1;

        if (isHeading) {
          return (
            <div key={i} style={{
              padding: '7px 12px 5px',
              borderBottom: isLast ? 'none' : '1px solid var(--border-light)',
            }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {d.label}
              </p>
            </div>
          );
        }

        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '7px 12px',
            borderBottom: isLast ? 'none' : '1px solid var(--border-light)',
          }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', minWidth: 52, flexShrink: 0, paddingTop: 1 }}>
              {d.label}
            </span>
            {d.isLink ? (
              <a
                href="#"
                style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-main)', textDecoration: 'underline', wordBreak: 'break-all' }}
                onClick={e => e.preventDefault()}
              >
                {d.value}
              </a>
            ) : (
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                {d.value}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Card variant item
// ─────────────────────────────────────────────────────────────────────────────

function CardItem({ item, isLast }: { item: ActivityItem; isLast: boolean }) {
  const { bg, colorClass } = ICON_CONFIG[item.iconType];
  const CIRCLE_SIZE = 36;
  const GAP_AFTER = 14;

  return (
    // align-items: stretch (default) makes timeline column stretch to card height
    <div style={{ display: 'flex' }}>

      {/* ── Timeline column ── */}
      <div style={{
        width: CIRCLE_SIZE, flexShrink: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* Action icon circle */}
        <div style={{
          width: CIRCLE_SIZE, height: CIRCLE_SIZE, borderRadius: '50%',
          background: bg, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {renderIcon(item.iconType, 18, colorClass)}
        </div>
        {/* Connecting line — fills remaining height including bottom gap */}
        {!isLast && (
          <div style={{
            flex: 1, width: 2,
            background: 'var(--border-light)',
            marginTop: 3,
          }} />
        )}
      </div>

      {/* ── Gap ── */}
      <div style={{ width: 14, flexShrink: 0 }} />

      {/* ── Card wrapper — paddingBottom creates spacing + extends line ── */}
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : GAP_AFTER }}>
        <div style={{
          border: '1px solid var(--border)',
          borderRadius: 10,
          background: 'var(--background)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '12px 14px' }}>

            {/* Actor row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
              <div style={{ flexShrink: 0, marginTop: 1 }}>
                <Avatar initials={item.userInitials} variant={item.avatarVariant ?? 'accent1'} size={22} />
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.45 }}>
                <strong style={{ fontWeight: 600 }}>{item.user}</strong>
                {' '}{item.action}
                {item.target && (
                  <> <span style={{ color: 'var(--text-secondary)' }}>{item.target}</span></>
                )}
              </p>
            </div>

            {/* Optional detail block */}
            {item.details && item.details.length > 0 && (
              <DetailBlock details={item.details} />
            )}

            {/* Timestamp */}
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 10 }}>
              {item.timestamp}
            </p>

          </div>
        </div>
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Compact variant item
// ─────────────────────────────────────────────────────────────────────────────

function CompactItem({ item, isLast }: { item: ActivityItem; isLast: boolean }) {
  const nameColor = VARIANT_NAME_COLOR[item.avatarVariant ?? 'accent1'];
  const AVATAR_SIZE = 32;
  const GAP_AFTER = 16;

  return (
    <div style={{ display: 'flex' }}>

      {/* ── Avatar on timeline ── */}
      <div style={{
        width: AVATAR_SIZE, flexShrink: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{ flexShrink: 0 }}>
          <Avatar initials={item.userInitials} variant={item.avatarVariant ?? 'accent1'} size={AVATAR_SIZE} />
        </div>
        {!isLast && (
          <div style={{
            flex: 1, width: 2,
            background: 'var(--border-light)',
            marginTop: 4,
          }} />
        )}
      </div>

      {/* ── Gap ── */}
      <div style={{ width: 12, flexShrink: 0 }} />

      {/* ── Content ── */}
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : GAP_AFTER }}>
        <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.45 }}>
          <span style={{ fontWeight: 600, color: nameColor }}>{item.user}</span>
          {' '}{item.action}
          {item.target && (
            <> <span>{item.target}</span></>
          )}
        </p>

        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
          {item.timestamp}
        </p>

        {/* Optional detail block */}
        {item.details && item.details.length > 0 && (
          <DetailBlock details={item.details} />
        )}
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ActivityPanel
// ─────────────────────────────────────────────────────────────────────────────

export function ActivityPanel({ items, variant = 'card', className = '' }: ActivityPanelProps) {
  if (items.length === 0) return null;

  return (
    <div className={className}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return variant === 'card'
          ? <CardItem key={item.id} item={item} isLast={isLast} />
          : <CompactItem key={item.id} item={item} isLast={isLast} />;
      })}
    </div>
  );
}
