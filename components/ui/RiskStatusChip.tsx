'use client';

export type RiskLevel = 'low' | 'medium' | 'high';

interface RiskStatusChipProps {
  level: RiskLevel;
  className?: string;
}

const CHIP_CONFIG: Record<RiskLevel, {
  label: string;
  bg: string;
  border: string;
  text: string;
  circleStroke: string;
  arrowFill: string;
  arrow: 'down' | 'up' | 'up-double';
}> = {
  low: {
    label: 'Low',
    bg: 'bg-success-contrast',
    border: 'border border-success-main',
    text: 'text-success-main',
    circleStroke: '#5E7F5C',
    arrowFill: '#669900',
    arrow: 'down',
  },
  medium: {
    label: 'Medium',
    bg: 'bg-accent-contrast',
    border: 'border border-accent-main',
    text: 'text-accent-main',
    circleStroke: '#B67A3C',
    arrowFill: '#CC6600',
    arrow: 'up',
  },
  high: {
    label: 'High',
    bg: 'bg-error-contrast',
    border: 'border border-error-main',
    text: 'text-error-main',
    circleStroke: '#B24E45',
    arrowFill: '#CC3014',
    arrow: 'up-double',
  },
};

function ArrowIcon({ type, fill, stroke }: { type: 'down' | 'up' | 'up-double'; fill: string; stroke: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <circle cx="8" cy="8" r="7.5" stroke={stroke} />
      {type === 'down' && (
        <path
          d="M5.202 8.833L8 11.5l2.798-2.667a.643.643 0 000-.924.68.68 0 00-.948 0L8.667 9.139V5.667A.667.667 0 008 5a.667.667 0 00-.667.667v3.472L6.15 7.909a.68.68 0 00-.948 0 .643.643 0 000 .924z"
          fill={fill}
        />
      )}
      {type === 'up' && (
        <path
          d="M10.798 7.167L8 4.5 5.202 7.167a.643.643 0 000 .924.68.68 0 00.948 0L7.333 6.861v3.472c0 .368.299.667.667.667.368 0 .667-.299.667-.667V6.861l1.183 1.23a.68.68 0 00.948 0 .643.643 0 000-.924z"
          fill={fill}
        />
      )}
      {type === 'up-double' && (
        <>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 4.5L10.798 7.167a.643.643 0 010 .924.68.68 0 01-.948 0L8 6.383 6.15 8.091a.68.68 0 01-.948 0 .643.643 0 010-.924L8 4.5z"
            fill={fill}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 7.196L10.798 9.863a.643.643 0 010 .924.68.68 0 01-.948 0L8 9.079l-1.85 1.708a.68.68 0 01-.948 0 .643.643 0 010-.924L8 7.196z"
            fill={fill}
          />
        </>
      )}
    </svg>
  );
}

export function RiskStatusChip({ level, className = '' }: RiskStatusChipProps) {
  const config = CHIP_CONFIG[level];

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0 ${config.bg} ${config.border} ${className}`}
    >
      <ArrowIcon type={config.arrow} fill={config.arrowFill} stroke={config.circleStroke} />
      <span className={`text-sm whitespace-nowrap ${config.text}`}>
        {config.label}
      </span>
    </div>
  );
}
