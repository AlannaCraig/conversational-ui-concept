'use client';

/**
 * Sidebar Component
 *
 * Fixed-position left sidebar with icon-based navigation.
 * Features vertical layout with logo at top, navigation groups, and utility icons at bottom.
 */

import { useRef } from 'react';
import {
  HomeIcon,
  ChatHistoryIcon,
  CalendarIcon,
  SearchIcon,
  NotificationIcon,
  HelpIcon,
  SettingsIcon
} from '@/components/icons';
import { SidebarItem } from './SidebarItem';
import { Avatar } from '@/components/ui';

interface SidebarProps {
  onHomeClick?: () => void;
  onHelpClick?: () => void;
  onChatHistoryClick?: () => void;
  onNotificationsClick?: () => void;
  onSearchClick?: () => void;
  onCalendarClick?: () => void;
  chatHistoryButtonRef?: React.RefObject<HTMLButtonElement>;
  notificationsButtonRef?: React.RefObject<HTMLButtonElement>;
  isOnHome?: boolean;
  isOnCalendar?: boolean;
  unreadNotificationCount?: number;
  activePopover?: 'chatHistory' | 'notifications' | null;
  isFocusMode?: boolean;
}

export function Sidebar({ onHomeClick, onHelpClick, onChatHistoryClick, onNotificationsClick, onSearchClick, onCalendarClick, chatHistoryButtonRef, notificationsButtonRef, isOnHome = true, isOnCalendar = false, unreadNotificationCount = 0, activePopover, isFocusMode = false }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-background border-r border-border flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <div className="mb-8">
        <svg width="32" height="32" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 9.5C16.2761 9.5 16.5 9.72386 16.5 10C16.5 10.2761 16.2761 10.5 16 10.5C15.7239 10.5 15.5 10.2761 15.5 10C15.5 9.72386 15.7239 9.5 16 9.5Z" fill="currentColor" stroke="currentColor"/>
          <path d="M4 9.5C4.27614 9.5 4.5 9.72386 4.5 10C4.5 10.2761 4.27614 10.5 4 10.5C3.72386 10.5 3.5 10.2761 3.5 10C3.5 9.72386 3.72386 9.5 4 9.5Z" fill="currentColor" stroke="currentColor"/>
          <circle cx="6" cy="7" r="0.5" fill="currentColor" stroke="currentColor"/>
          <circle cx="8" cy="13" r="0.5" fill="currentColor" stroke="currentColor"/>
          <circle cx="11" cy="3" r="0.5" fill="currentColor" stroke="currentColor"/>
          <circle cx="13" cy="17" r="0.5" fill="currentColor" stroke="currentColor"/>
          <path d="M0 10H4" stroke="currentColor" strokeWidth="2"/>
          <path d="M4 10L6 7" stroke="currentColor" strokeWidth="2"/>
          <path d="M6 7L8 13" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 13L11 3" stroke="currentColor" strokeWidth="2"/>
          <path d="M11 3L13 17" stroke="currentColor" strokeWidth="2"/>
          <path d="M20 10H16" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 10L13 17" stroke="currentColor" strokeWidth="2"/>
          <mask id="path-14-inside-1_316_864" fill="white">
            <path d="M0 2C0 0.895431 0.895431 0 2 0H18C19.1046 0 20 0.895431 20 2V18C20 19.1046 19.1046 20 18 20H2C0.895431 20 0 19.1046 0 18V2Z"/>
          </mask>
          <path d="M2 0V1.5H18V0V-1.5H2V0ZM20 2H18.5V18H20H21.5V2H20ZM18 20V18.5H2V20V21.5H18V20ZM0 18H1.5V2H0H-1.5V18H0ZM2 20V18.5C1.72386 18.5 1.5 18.2761 1.5 18H0H-1.5C-1.5 19.933 0.0670043 21.5 2 21.5V20ZM20 18H18.5C18.5 18.2761 18.2761 18.5 18 18.5V20V21.5C19.933 21.5 21.5 19.933 21.5 18H20ZM18 0V1.5C18.2761 1.5 18.5 1.72386 18.5 2H20H21.5C21.5 0.067003 19.933 -1.5 18 -1.5V0ZM2 0V-1.5C0.067003 -1.5 -1.5 0.0670043 -1.5 2H0H1.5C1.5 1.72386 1.72386 1.5 2 1.5V0Z" fill="currentColor" mask="url(#path-14-inside-1_316_864)"/>
        </svg>
      </div>

      {/* Main Navigation - Top */}
      <nav className="flex flex-col gap-2 flex-1">
        <SidebarItem icon={HomeIcon} label="Home" active={isOnHome} onClick={onHomeClick} />
        <SidebarItem
          ref={chatHistoryButtonRef}
          icon={ChatHistoryIcon}
          label="Chat History"
          onClick={onChatHistoryClick}
          disableTooltip={activePopover === 'chatHistory'}
        />
        <SidebarItem icon={CalendarIcon} label="Calendar" active={isOnCalendar} onClick={onCalendarClick} />
      </nav>

      {/* Bottom Utility Icons */}
      <div className="flex flex-col gap-2 mt-auto">
        <SidebarItem icon={SearchIcon} label="Search" onClick={onSearchClick} active={isFocusMode} />
        <SidebarItem
          ref={notificationsButtonRef}
          icon={NotificationIcon}
          label="Notifications"
          onClick={onNotificationsClick}
          badge={unreadNotificationCount}
          disableTooltip={activePopover === 'notifications'}
        />
        <SidebarItem icon={HelpIcon} label="Help" onClick={onHelpClick} />
        <SidebarItem icon={SettingsIcon} label="Settings" />
      </div>

      {/* User Avatar */}
      <div className="mt-4">
        <Avatar initials="AC" variant="accent1" size={36} />
      </div>
    </aside>
  );
}
