/**
 * NotificationsPopover Component
 *
 * Displays notifications in a popover aligned with the navigation rail button
 * Follows the same design pattern as ChatHistoryPopover
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  NotificationIcon,
  AppWindowIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
  CircleIcon,
  ChevronDownIcon,
} from '@/components/icons';
import { useState, useMemo } from 'react';
import { StatusChip } from '@/components/ui/StatusChip';
import {
  getMockNotifications,
  groupNotificationsByTime,
  formatNotificationTime,
  type Notification,
} from '@/lib/mockNotifications';

interface NotificationGroup {
  id: string;
  title: string;
  notifications: Notification[];
}

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement>;
  onSelectNotification?: (notificationId: string) => void;
}

export function NotificationsPopover({
  isOpen,
  onClose,
  buttonRef,
  onSelectNotification,
}: NotificationsPopoverProps) {
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const notifications = getMockNotifications();

  // Filter notifications based on toggle
  const filteredNotifications = showOnlyUnread
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const groupedNotifications = groupNotificationsByTime(filteredNotifications);

  const groups: NotificationGroup[] = useMemo(
    () => [
      {
        id: 'group-today',
        title: 'Today',
        notifications: groupedNotifications.today,
      },
      {
        id: 'group-yesterday',
        title: 'Yesterday',
        notifications: groupedNotifications.yesterday,
      },
      {
        id: 'group-lastweek',
        title: 'Last 7 days',
        notifications: groupedNotifications.lastWeek,
      },
    ].filter(g => g.notifications.length > 0),
    [groupedNotifications]
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getPriorityIcon = (notification: Notification) => {
    if (notification.isUrgent) {
      return <AlertCircleIcon size={16} className="text-[#ef4444]" />;
    }
    if (notification.priority === 'high') {
      return <AlertTriangleIcon size={16} className="text-[#f59e0b]" />;
    }
    return null;
  };

  const getStatusVariant = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'info';
      case 'to do':
        return 'warning';
      case 'pending':
      case 'review':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Popover */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-[68px] top-[216px] z-50 w-[392px] bg-background border border-border rounded-[12px] shadow-lg"
            style={{
              maxHeight: 'calc(100vh - 232px)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-5 pt-5 pb-4">
              <div className="flex items-center gap-3">
                <NotificationIcon size={24} className="text-text-primary" />
                <h2 className="text-base font-semibold text-text-primary">
                  Notifications {unreadCount > 0 && `(${unreadCount} new)`}
                </h2>
              </div>
            </div>

            {/* Divider */}
            <div className="flex-shrink-0 px-5">
              <div className="border-t border-border" />
            </div>

            {/* Show only unread toggle - below divider */}
            <div className="flex-shrink-0 px-5 pt-4 pb-2">
              <div className="flex items-center justify-end">
                <button
                  onClick={() => setShowOnlyUnread(!showOnlyUnread)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-full hover:bg-hover cursor-pointer transition-colors"
                >
                  <span className="text-xs text-text-secondary">Show only unread</span>
                  <div
                    className={`relative w-8 h-4 rounded-full transition-colors ${
                      showOnlyUnread ? 'bg-primary-main' : 'bg-border'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-3 h-3 rounded-full bg-background transition-transform ${
                        showOnlyUnread ? 'translate-x-[18px]' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </button>
              </div>
            </div>

            {/* Scrollable Notifications List */}
            <div className="flex-1 overflow-y-auto conversation-scroll px-5 pb-4">
              <div className="space-y-4">
                {groups.map((group) => (
                  <div key={group.id}>
                    {/* Caption-style date heading */}
                    <div className="mb-3">
                      <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                        {group.title}
                      </span>
                    </div>

                    {/* Notification items */}
                    <div className="space-y-2">
                      {group.notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => {
                            if (onSelectNotification) {
                              onSelectNotification(notification.id);
                              onClose();
                            }
                          }}
                          className={`w-full text-left bg-background border border-border rounded-lg p-4 hover:bg-hover cursor-pointer transition-colors ${
                            !notification.isRead ? 'bg-primary-light/5' : ''
                          }`}
                        >
                          {/* Header row: App/workflow + Status + Time */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <AppWindowIcon size={16} className="text-text-secondary flex-shrink-0" />
                              <span className="text-xs text-text-secondary truncate">
                                {notification.sourceApp}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              {notification.status && (
                                <StatusChip
                                  label={notification.status}
                                  variant={getStatusVariant(notification.status)}
                                />
                              )}
                              {getPriorityIcon(notification)}
                              <span className="text-xs text-text-secondary">
                                {formatNotificationTime(notification.timestamp)}
                              </span>
                            </div>
                          </div>

                          {/* Title row with unread indicator */}
                          <div className="flex items-start gap-2 mb-2">
                            {!notification.isRead && (
                              <CircleIcon size={8} className="text-primary-main flex-shrink-0 mt-1" />
                            )}
                            <h3 className="text-sm font-medium text-text-primary">
                              {notification.title}
                            </h3>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                            {notification.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
