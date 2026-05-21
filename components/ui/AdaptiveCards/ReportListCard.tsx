/**
 * ReportListCard Component
 *
 * Adaptive card displaying a list of reports
 */

'use client';

interface ReportListCardProps {
  count: number;
}

export function ReportListCard({ count }: ReportListCardProps) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-4 p-4 border border-border rounded-lg"
        >
          {/* Report icon placeholder */}
          <div className="w-10 h-10 bg-accent2-light rounded flex-shrink-0" />

          {/* Report content */}
          <div className="flex-1 space-y-2">
            {/* Report title */}
            <div className="h-4 w-3/4 bg-primary-light rounded" />
            {/* Report metadata */}
            <div className="flex gap-3">
              <div className="h-3 w-20 bg-primary-light rounded opacity-70" />
              <div className="h-3 w-24 bg-primary-light rounded opacity-70" />
            </div>
          </div>

          {/* Status badge */}
          <div className="px-3 py-1 bg-accent3-light rounded-full flex-shrink-0">
            <div className="h-3 w-16 bg-accent3-main rounded opacity-50" />
          </div>
        </div>
      ))}
    </div>
  );
}
