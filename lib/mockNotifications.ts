/**
 * Mock Notifications
 *
 * Provides sample notification data with various states and priorities
 */

export type NotificationPriority = 'high' | 'medium' | 'low' | 'none';
export type NotificationStatus = 'to do' | 'in progress' | 'completed' | 'pending' | 'review';

export interface Notification {
  id: string;
  sourceApp: string;
  sourceIcon?: string;
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  priority: NotificationPriority;
  isUrgent: boolean;
  status?: NotificationStatus;
}

/**
 * Get all mock notifications
 */
export function getMockNotifications(): Notification[] {
  const now = new Date();

  return [
    // Today - unread urgent
    {
      id: 'notif-1',
      sourceApp: 'Task Manager',
      title: 'Critical deadline approaching',
      description: 'Q2 budget review is due in 2 hours. Please complete the financial analysis section before the deadline.',
      timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
      isRead: false,
      priority: 'high',
      isUrgent: true,
      status: 'to do',
    },
    // Today - unread high priority
    {
      id: 'notif-2',
      sourceApp: 'Workflow Engine',
      title: 'Approval required for project proposal',
      description: 'New project proposal from Design Team requires your review and approval. 3 stakeholders are waiting.',
      timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
      isRead: false,
      priority: 'high',
      isUrgent: false,
      status: 'pending',
    },
    // Today - read
    {
      id: 'notif-3',
      sourceApp: 'Calendar',
      title: 'Meeting reminder: Sprint planning',
      description: 'Your sprint planning meeting starts in 30 minutes. Location: Conference Room B. 8 attendees confirmed.',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: true,
      priority: 'medium',
      isUrgent: false,
      status: 'in progress',
    },
    // Today - read
    {
      id: 'notif-4',
      sourceApp: 'Analytics Dashboard',
      title: 'Weekly report ready for review',
      description: 'Your weekly performance metrics report has been generated and is ready for review in the dashboard.',
      timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
      isRead: true,
      priority: 'low',
      isUrgent: false,
      status: 'review',
    },
    // Yesterday - unread
    {
      id: 'notif-5',
      sourceApp: 'Document Manager',
      title: 'New documents shared with you',
      description: 'Sarah Martinez shared 3 documents with you: Q2 Strategy.pdf, Budget_Draft.xlsx, Timeline_v2.docx.',
      timestamp: new Date(now.getTime() - 20 * 60 * 60 * 1000), // 20 hours ago
      isRead: false,
      priority: 'medium',
      isUrgent: false,
    },
    // Yesterday - read
    {
      id: 'notif-6',
      sourceApp: 'Project Hub',
      title: 'Project milestone completed',
      description: 'Congratulations! The UX Design phase has been completed. Ready to move to development phase.',
      timestamp: new Date(now.getTime() - 26 * 60 * 60 * 1000), // 26 hours ago
      isRead: true,
      priority: 'none',
      isUrgent: false,
      status: 'completed',
    },
    // Last 7 days - read
    {
      id: 'notif-7',
      sourceApp: 'System Monitor',
      title: 'Scheduled maintenance completed',
      description: 'System maintenance was successfully completed. All services are now running normally with improved performance.',
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      isRead: true,
      priority: 'low',
      isUrgent: false,
      status: 'completed',
    },
    // Last 7 days - read
    {
      id: 'notif-8',
      sourceApp: 'Team Chat',
      title: 'You were mentioned in a discussion',
      description: 'Marcus Chen mentioned you in the Infrastructure Planning channel regarding cloud migration strategy.',
      timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      isRead: true,
      priority: 'medium',
      isUrgent: false,
    },
  ];
}

/**
 * Group notifications by time period
 */
export function groupNotificationsByTime(notifications: Notification[]): {
  today: Notification[];
  yesterday: Notification[];
  lastWeek: Notification[];
} {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  return {
    today: notifications.filter(n => n.timestamp >= today),
    yesterday: notifications.filter(n => n.timestamp >= yesterday && n.timestamp < today),
    lastWeek: notifications.filter(n => n.timestamp >= lastWeek && n.timestamp < yesterday),
  };
}

/**
 * Format timestamp for display
 */
export function formatNotificationTime(timestamp: Date): string {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;

  return timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
