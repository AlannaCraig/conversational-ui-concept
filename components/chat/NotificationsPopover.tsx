'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { NotificationIcon } from '@/components/icons/NotificationIcon';
import { MoreVerticalIcon } from '@/components/icons/MoreVerticalIcon';
import {
  getMockNotifications,
  groupNotificationsByTime,
  formatNotificationTime,
  type Notification,
} from '@/lib/mockNotifications';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement>;
  onSelectNotification?: (notificationId: string) => void;
}

const AVATAR_COLORS = [
  { bg: 'var(--accent-main)',  text: 'var(--accent-contrast)'  },
  { bg: 'var(--accent1-main)', text: 'var(--accent1-contrast)' },
  { bg: 'var(--accent2-main)', text: 'var(--accent2-contrast)' },
  { bg: 'var(--accent3-main)', text: 'var(--accent3-contrast)' },
  { bg: 'var(--primary-main)', text: 'var(--primary-contrast)' },
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function SenderAvatar({ name, isUnread }: { name: string; isUnread: boolean }) {
  const color = getAvatarColor(name);
  const initials = getInitials(name);
  return (
    <div className="relative flex-shrink-0">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
        style={{ backgroundColor: color.bg, color: color.text }}
      >
        {initials}
      </div>
      {isUnread && (
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary-main border-2 border-background" />
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  onClick,
  index,
}: {
  notification: Notification;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      onClick={onClick}
      className={`w-full text-left flex items-start gap-3 p-2 rounded-lg hover:bg-background-soft transition-colors ${
        !notification.isRead ? 'bg-primary-light/5' : ''
      }`}
    >
      <SenderAvatar
        name={notification.sender ?? notification.sourceApp}
        isUnread={!notification.isRead}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <p className={`text-sm leading-snug ${!notification.isRead ? 'font-semibold text-text-primary' : 'font-medium text-text-primary'}`}>
            {notification.title}
          </p>
          <span className="text-xs text-text-secondary whitespace-nowrap flex-shrink-0 mt-0.5">
            {formatNotificationTime(notification.timestamp)}
          </span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
          {notification.description}
        </p>
        <p className="text-xs text-text-tertiary mt-1">{notification.sourceApp}</p>
      </div>
    </motion.button>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-background-soft flex items-center justify-center mb-4">
        <NotificationIcon size={20} className="text-text-tertiary" />
      </div>
      <p className="text-sm font-medium text-text-primary mb-1">You're all caught up</p>
      <p className="text-xs text-text-secondary">No unread notifications</p>
    </div>
  );
}

export function NotificationsPopover({
  isOpen,
  onClose,
  onSelectNotification,
}: NotificationsPopoverProps) {
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const allNotifications = useMemo(() => {
    return getMockNotifications().map(n => ({
      ...n,
      isRead: n.isRead || readIds.has(n.id),
    }));
  }, [readIds]);

  const filtered = showOnlyUnread
    ? allNotifications.filter(n => !n.isRead)
    : allNotifications;

  const grouped = groupNotificationsByTime(filtered);

  const sections = useMemo(() => [
    { id: 'today',     label: 'Today',       items: grouped.today },
    { id: 'yesterday', label: 'Yesterday',   items: grouped.yesterday },
    { id: 'lastWeek',  label: 'Last 7 days', items: grouped.lastWeek },
  ].filter(s => s.items.length > 0), [grouped]);

  const unreadCount = allNotifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    setReadIds(new Set(allNotifications.map(n => n.id)));
  };

  const handleSelect = (id: string) => {
    setReadIds(prev => new Set([...prev, id]));
    onSelectNotification?.(id);
    onClose();
  };

  let itemIndex = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-[68px] top-[216px] z-50 w-[400px] bg-background border border-border rounded-[12px] shadow-lg flex flex-col"
            style={{ maxHeight: 'calc(100vh - 232px)' }}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-5 pt-5 pb-4">
              <h2 className="text-base font-semibold text-text-primary">Notifications</h2>
            </div>

            <div className="flex-shrink-0 px-5">
              <div className="border-t border-border" />
            </div>

            {/* Controls */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 pt-5 pb-3">
              {unreadCount > 0 ? (
                <p className="text-xs text-text-secondary">{unreadCount} unread</p>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowOnlyUnread(v => !v)}
                  className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
                >
                  <div
                    className={`relative w-7 h-3.5 rounded-full transition-colors ${
                      showOnlyUnread ? 'bg-primary-main' : 'bg-border'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-transform ${
                        showOnlyUnread ? 'translate-x-[14px]' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                  Unread only
                </button>
                <button className="text-text-secondary hover:text-text-primary transition-colors">
                  <MoreVerticalIcon size={16} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto conversation-scroll">
              {sections.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="p-2 space-y-4">
                  {sections.map(section => (
                    <div key={section.id}>
                      <p className="text-xs font-medium text-text-secondary uppercase tracking-wide px-2 mb-2">
                        {section.label}
                      </p>
                      <div className="space-y-2">
                        {section.items.map(notification => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onClick={() => handleSelect(notification.id)}
                            index={itemIndex++}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
