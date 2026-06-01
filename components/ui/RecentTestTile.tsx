'use client';

export interface RecentTestTileProps {
  test: string;
  result: string;
  flag?: string;
  date?: string;
  category?: string;
}

const FLAG_CONFIG: Record<string, { bg: string; text: string }> = {
  normal:         { bg: 'bg-success-light',  text: 'text-success-dark'  },
  'borderline high': { bg: 'bg-accent-light', text: 'text-accent-dark'  },
  abnormal:       { bg: 'bg-error-light',    text: 'text-error-dark'    },
};

function getFlagConfig(flag: string) {
  return FLAG_CONFIG[flag.toLowerCase()] ?? { bg: 'bg-primary-light', text: 'text-text-secondary' };
}

export function RecentTestTile({ test, result, flag, date, category }: RecentTestTileProps) {
  const flagConfig = flag ? getFlagConfig(flag) : null;

  return (
    <div className="bg-primary-contrast border border-border rounded-lg px-4 py-3">
      {/* Top row: test name + date */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-text-primary">{test}</span>
        {date && <span className="text-xs text-text-secondary">{date}</span>}
      </div>

      {/* Bottom row: result + flag chip */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-text-secondary leading-snug flex-1 min-w-0">{result}</span>
        {flagConfig && flag && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${flagConfig.bg} ${flagConfig.text}`}>
            {flag}
          </span>
        )}
      </div>
    </div>
  );
}
