'use client';

/**
 * Sidebar Component
 *
 * Fixed-position left sidebar with icon-based navigation.
 * Features vertical layout with logo at top, navigation groups, and utility icons at bottom.
 */

import { useRef } from 'react';
import {
  IQIcon,
  HomeIcon,
  ChatHistoryIcon,
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
  chatHistoryButtonRef?: React.RefObject<HTMLButtonElement>;
  isOnHome?: boolean;
}

export function Sidebar({ onHomeClick, onHelpClick, onChatHistoryClick, chatHistoryButtonRef, isOnHome = true }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-background border-r border-border flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <div className="mb-8">
        <IQIcon width={32} height={24} />
      </div>

      {/* Main Navigation - Top */}
      <nav className="flex flex-col gap-2 flex-1">
        <SidebarItem icon={HomeIcon} label="Home" active={isOnHome} onClick={onHomeClick} />
        <SidebarItem
          ref={chatHistoryButtonRef}
          icon={ChatHistoryIcon}
          label="Chat History"
          onClick={onChatHistoryClick}
        />
      </nav>

      {/* Bottom Utility Icons */}
      <div className="flex flex-col gap-2 mt-auto">
        <SidebarItem icon={SearchIcon} label="Search" />
        <SidebarItem icon={NotificationIcon} label="Notifications" />
        <SidebarItem icon={HelpIcon} label="Help" onClick={onHelpClick} />
        <SidebarItem icon={SettingsIcon} label="Settings" />
      </div>

      {/* User Avatar */}
      <div className="mt-4">
        <Avatar initials="LH" variant="accent1" size={36} />
      </div>
    </aside>
  );
}
