'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRightIcon } from './ChevronRightIcon';

const AVATAR_TOKENS = [
  { bg: 'var(--accent1-main)',  text: 'var(--accent1-contrast)' },
  { bg: 'var(--accent3-main)',  text: 'var(--accent3-contrast)' },
  { bg: 'var(--accent-main)',   text: 'var(--accent-contrast)'  },
  { bg: 'var(--accent2-main)',  text: 'var(--accent2-contrast)' },
  { bg: 'var(--primary-main)',  text: 'var(--primary-contrast)' },
  { bg: 'var(--accent1-dark)',  text: 'var(--accent1-contrast)' },
];

function getInitials(name: string): string {
  return name
    .replace(/^Dr\s+/i, '')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarToken(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_TOKENS[Math.abs(hash) % AVATAR_TOKENS.length];
}

interface AvatarTooltipProps {
  name: string;
  initials: string;
  token: { bg: string; text: string };
}

function AvatarWithTooltip({ name, initials, token }: AvatarTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const avatarRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleMouseEnter = () => {
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top - 8,          // 8px gap above avatar
        left: rect.left + rect.width / 2,
      });
    }
    setVisible(true);
  };

  const tooltip = visible && mounted ? createPortal(
    <div
      className="pointer-events-none fixed z-[9999]"
      style={{ top: coords.top, left: coords.left, transform: 'translate(-50%, -100%)' }}
    >
      <div className="bg-primary-dark text-primary-contrast text-xs font-medium px-3 py-2 rounded-md whitespace-nowrap shadow-lg">
        {name}
        {/* Arrow */}
        <div
          className="absolute left-1/2 top-full -translate-x-1/2 w-0 h-0"
          style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid var(--primary-dark)' }}
        />
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <div
        ref={avatarRef}
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold select-none flex-shrink-0 cursor-default"
        style={{ backgroundColor: token.bg, color: token.text }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setVisible(false)}
      >
        {initials}
      </div>
      {tooltip}
    </>
  );
}

export interface PatientEntryTileProps {
  title: string;
  subtitle: string;
  gpName: string;
  onClick?: () => void;
}

export function PatientEntryTile({ title, subtitle, gpName, onClick }: PatientEntryTileProps) {
  const token = getAvatarToken(gpName);
  const initials = getInitials(gpName);

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-3 bg-primary-contrast border border-border hover:bg-hover transition-colors rounded-lg text-left group"
    >
      {/* Chevron — primary-main colour */}
      <span className="text-primary-main flex-shrink-0">
        <ChevronRightIcon size={16} />
      </span>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-text-primary truncate">{title}</div>
        <div className="text-xs text-text-secondary mt-0.5">{subtitle}</div>
      </div>

      {/* GP Avatar — tooltip only fires on hover of this element */}
      <AvatarWithTooltip name={gpName} initials={initials} token={token} />
    </button>
  );
}
