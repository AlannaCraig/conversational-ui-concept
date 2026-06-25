'use client';

import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export type MetricTrend = 'up' | 'down' | 'neutral';

export interface LifestyleMetricTileProps {
  label: string;
  value: string;
  unit: string;
  date: string;
  trend: MetricTrend;
}

function TrendArrow({ trend }: { trend: MetricTrend }) {
  if (trend === 'neutral') return null;

  const isUp = trend === 'up';

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="text-text-secondary flex-shrink-0"
    >
      {isUp ? (
        // Arrow up
        <path
          d="M12 4L4 12H9V20H15V12H20L12 4Z"
          fill="currentColor"
        />
      ) : (
        // Arrow down
        <path
          d="M12 20L20 12H15V4H9V12H4L12 20Z"
          fill="currentColor"
        />
      )}
    </svg>
  );
}

function TruncatedLabel({ label }: { label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const el = ref.current;
    if (el) setTruncated(el.scrollWidth > el.clientWidth);
  });

  const handleMouseEnter = () => {
    if (!truncated || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setCoords({ top: rect.top - 8, left: rect.left + rect.width / 2 });
    setVisible(true);
  };

  const tooltip = visible && mounted && truncated ? createPortal(
    <div
      className="pointer-events-none fixed z-[9999]"
      style={{ top: coords.top, left: coords.left, transform: 'translate(-50%, -100%)' }}
    >
      <div className="bg-primary-dark text-primary-contrast text-xs font-medium px-3 py-2 rounded-md whitespace-nowrap shadow-lg">
        {label}
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
      <span
        ref={ref}
        className="text-sm text-text-primary truncate"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setVisible(false)}
      >
        {label}
      </span>
      {tooltip}
    </>
  );
}

export function LifestyleMetricTile({ label, value, unit, date, trend }: LifestyleMetricTileProps) {
  return (
    <div className="bg-primary-contrast border border-border rounded-lg px-2.5 py-2">
      <div className="flex items-center justify-between gap-2">
        <TruncatedLabel label={label} />
        <div className="flex items-baseline gap-1 flex-shrink-0">
          <span className="text-sm font-medium text-text-primary leading-none">{value}</span>
          {unit && <span className="text-xs text-text-primary">{unit}</span>}
          <TrendArrow trend={trend} />
        </div>
      </div>
      <hr className="border-border mt-1.5" />
      <span className="text-xs text-text-secondary mt-1.5 block">{date}</span>
    </div>
  );
}
