'use client';

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
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className={isUp ? 'text-accent1-dark' : 'text-accent3-dark'}
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

export function LifestyleMetricTile({ label, value, unit, date, trend }: LifestyleMetricTileProps) {
  return (
    <div className="bg-primary-contrast border border-border rounded-lg px-4 py-3">
      {/* Top row: label + date */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-text-primary">
          {label}
        </span>
        <span className="text-xs text-text-secondary">{date}</span>
      </div>

      {/* Bottom row: value + unit + trend */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-light text-text-primary leading-none">{value}</span>
          {unit && (
            <span className="text-xs text-text-secondary">{unit}</span>
          )}
        </div>
        <TrendArrow trend={trend} />
      </div>
    </div>
  );
}
