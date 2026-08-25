'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ScheduleSlot } from '@/lib/appointmentsScheduleData';

const CARD_WIDTH = 224;
const CARD_GAP = 10;
const ESTIMATED_HEIGHT = 220;

function PhoneIcon() {
  return (
    <svg
      width="11" height="11" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9 2 2 0 0 1 3.6 2.72h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.1a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 17.5z" />
    </svg>
  );
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--border-light)', margin: '8px 0' }} />;
}

function HoverCardContent({ slot, anchorRect }: { slot: ScheduleSlot; anchorRect: DOMRect }) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = anchorRect.right + CARD_GAP;
  if (left + CARD_WIDTH > vw - 8) {
    left = anchorRect.left - CARD_WIDTH - CARD_GAP;
  }
  left = Math.max(8, left);

  let top = anchorRect.top;
  if (top + ESTIMATED_HEIGHT > vh - 8) {
    top = Math.max(8, vh - ESTIMATED_HEIGHT - 8);
  }
  top = Math.max(8, top);

  const hasPatient = !!(slot.patientName || slot.chiNumber || slot.phone);

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top,
        left,
        width: CARD_WIDTH,
        zIndex: 9999,
        background: 'var(--background)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        boxShadow: '0 8px 24px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        padding: '14px 16px',
        pointerEvents: 'none',
      }}
    >
      {/* Time */}
      <p
        style={{
          fontSize: 22,
          fontWeight: 700,
          lineHeight: 1.1,
          color: 'var(--text-primary)',
          marginBottom: hasPatient ? 10 : 0,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {slot.startTime}
      </p>

      {/* Patient name */}
      {slot.patientName && (
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.3,
            color: 'var(--text-primary)',
            marginBottom: 3,
          }}
        >
          {slot.patientName}
        </p>
      )}

      {slot.chiNumber && (
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 3 }}>
          CHI: {slot.chiNumber}
        </p>
      )}

      {/* Phone */}
      {slot.phone && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: 'var(--text-secondary)',
            marginBottom: 3,
          }}
        >
          <PhoneIcon />
          <span style={{ fontSize: 11 }}>{slot.phone}</span>
        </div>
      )}

      {/* Notes */}
      {slot.notes && (
        <>
          <Divider />
          <p
            className="line-clamp-3"
            style={{
              fontSize: 11,
              color: 'var(--text-secondary)',
              lineHeight: 1.55,
            }}
          >
            {slot.notes}
          </p>
        </>
      )}

      {/* Duration */}
      <Divider />
      <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
        Duration:{' '}
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
          {slot.durationMins} {slot.durationMins === 1 ? 'minute' : 'minutes'}
        </span>
      </p>
    </div>,
    document.body,
  );
}

export function AppointmentHoverCard({
  slot,
  anchorRect,
}: {
  slot: ScheduleSlot;
  anchorRect: DOMRect;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <HoverCardContent slot={slot} anchorRect={anchorRect} />;
}
