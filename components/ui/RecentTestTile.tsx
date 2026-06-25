'use client';

import { useState } from 'react';
import { ChevronRightIcon } from './ChevronRightIcon';

export interface Investigation {
  test: string;
  result: string;
  flag?: string;
  date?: string;
  category?: string;
  requestGroup?: string;
  requestContext?: string;
}

export interface RecentTestTileProps {
  test: string;
  result: string;
  flag?: string;
  date?: string;
  category?: string;
}

const FLAG_RANK: Record<string, number> = { abnormal: 2, 'borderline high': 1, normal: 0 };
const FLAG_COLORS: Record<string, { bg: string; text: string }> = {
  normal:            { bg: 'var(--primary-main)',  text: 'var(--primary-contrast)' },
  'borderline high': { bg: 'var(--accent-main)',   text: 'var(--accent-contrast)'  },
  abnormal:          { bg: 'var(--error-main)',     text: 'var(--error-contrast)'   },
};

function getFlagColors(flag: string) {
  return FLAG_COLORS[flag.toLowerCase()] ?? { bg: 'var(--accent2-main)', text: 'var(--accent2-contrast)' };
}

function worstFlag(items: Investigation[]): string | undefined {
  return items
    .filter(i => i.flag)
    .sort((a, b) => (FLAG_RANK[b.flag!.toLowerCase()] ?? 0) - (FLAG_RANK[a.flag!.toLowerCase()] ?? 0))[0]?.flag;
}

export interface TestGroupTileProps {
  date: string;
  context: string;
  items: Investigation[];
}

export function TestGroupTile({ date, context, items }: TestGroupTileProps) {
  const [expanded, setExpanded] = useState(false);
  const worst = worstFlag(items);
  const hasAbnormal = worst?.toLowerCase() === 'abnormal';

  return (
    <div className="bg-primary-contrast border border-border rounded-lg overflow-hidden">
      {/* Group header — always visible */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-3 py-3 hover:bg-hover transition-colors text-left"
      >
        <span
          className="text-primary-main flex-shrink-0 transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          <ChevronRightIcon size={16} />
        </span>

        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-text-primary">{context}</span>
        </div>

        <span className="text-xs text-text-primary flex-shrink-0 whitespace-nowrap">
          <span className="mr-1">Date</span>{date}
        </span>

        <span className="text-xs text-text-secondary flex-shrink-0 whitespace-nowrap">
          {items.length} {items.length === 1 ? 'result' : 'results'}
        </span>

        {hasAbnormal && (
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: 'var(--error-main)' }}
          />
        )}
      </button>

      {/* Expanded individual results */}
      {expanded && (
        <div className="border-t border-border">
          {items.map((inv, i) => {
            const itemColors = inv.flag ? getFlagColors(inv.flag) : null;
            return (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2.5 border-b border-border last:border-b-0"
              >
                <span className="w-4 flex-shrink-0" />
                <span className="flex-1 min-w-0 text-sm text-text-primary truncate">{inv.test}</span>
                <span className="text-sm text-text-primary flex-shrink-0 whitespace-nowrap truncate max-w-[180px]">{inv.result}</span>
                {itemColors && inv.flag && (
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: itemColors.bg, color: itemColors.text }}
                  >
                    {inv.flag}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function RecentTestTile({ test, result, flag, date }: RecentTestTileProps) {
  const flagColors = flag ? getFlagColors(flag) : null;
  return (
    <div className="bg-primary-contrast border border-border rounded-lg px-3 py-3 flex items-center gap-3">
      <span className="flex-1 min-w-0 text-sm font-medium text-text-primary truncate">{test}</span>
      {date && (
        <span className="text-xs text-text-primary flex-shrink-0 whitespace-nowrap">
          <span className="mr-1">Date</span>{date}
        </span>
      )}
      {flagColors && flag && (
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: flagColors.bg, color: flagColors.text }}
        >
          {flag}
        </span>
      )}
    </div>
  );
}
