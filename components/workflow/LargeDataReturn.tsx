/**
 * LargeDataReturn Component
 *
 * Reusable component for large data returns displayed in the 2/3 panel.
 * Supports multiple large data layout types:
 * - table: List view with checkboxes and actions
 * - dashboard: Widget-based dashboard with metrics and charts
 * - document: Multi-column text document
 * - calendar: Event scheduling view
 * - kanban: Task board view
 * - analytics: Data visualization focus
 * - grid: Gallery/media grid view
 * - patient-summary: Healthcare patient summary
 */

'use client';

import {
  TableCard,
  DashboardCard,
  DocumentCard,
  CalendarCard,
  KanbanCard,
  AnalyticsCard,
  GridCard,
} from '@/components/ui/LargeAdaptiveCards';
import { PatientSummaryCard } from '@/components/ui/LargeAdaptiveCards/PatientSummaryCard';
import { SuggestedActions } from '@/components/chat/SuggestedActions';

export type LargeDataLayoutType =
  | 'table'
  | 'dashboard'
  | 'document'
  | 'calendar'
  | 'kanban'
  | 'analytics'
  | 'grid'
  | 'patient-summary';

interface LargeDataReturnProps {
  /** Type of large data layout to render */
  layoutType: LargeDataLayoutType;
  /** Optional intro text displayed above the large data view */
  introText?: string;
  /** Optional follow-up text displayed below the large data view */
  followUpText?: string;
  /** Optional suggested actions displayed at the bottom */
  suggestedActions?: { id: string; text: string }[];
  /** Handler for suggested action selection */
  onSelectAction?: (action: { id: string; text: string }) => void;
  /** Additional CSS classes */
  className?: string;
  /** Optional data payload for specialized cards (e.g., patient-summary) */
  data?: any;
}

// Map layout types to components
const layoutComponents: Record<LargeDataLayoutType, React.ComponentType<any>> = {
  table: TableCard,
  dashboard: DashboardCard,
  document: DocumentCard,
  calendar: CalendarCard,
  kanban: KanbanCard,
  analytics: AnalyticsCard,
  grid: GridCard,
  'patient-summary': PatientSummaryCard,
};

export function LargeDataReturn({
  layoutType,
  introText,
  followUpText,
  suggestedActions,
  onSelectAction,
  className = '',
  data,
}: LargeDataReturnProps) {
  const LayoutComponent = layoutComponents[layoutType];

  if (!LayoutComponent) {
    console.warn(`Unknown large data layout type: ${layoutType}`);
    return null;
  }

  return (
    <div className={`${className}`}>
      {/* Intro Text */}
      {introText && (
        <div className="mb-4">
          <div className="text-text-primary text-sm leading-6 whitespace-pre-wrap">
            {introText}
          </div>
        </div>
      )}

      {/* Large Data Layout */}
      <div className="mb-5">
        <LayoutComponent {...data} />
      </div>

      {/* Follow-up Text */}
      {followUpText && (
        <div className="mb-5">
          <div className="text-text-primary text-sm leading-6 whitespace-pre-wrap">
            {followUpText}
          </div>
        </div>
      )}

      {/* Suggested Actions */}
      {suggestedActions && suggestedActions.length > 0 && onSelectAction && (
        <div className="mb-3">
          <SuggestedActions
            actions={suggestedActions}
            onSelectAction={onSelectAction}
          />
        </div>
      )}
    </div>
  );
}
