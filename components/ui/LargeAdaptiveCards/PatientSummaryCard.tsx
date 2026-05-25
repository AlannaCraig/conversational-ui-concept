/**
 * PatientSummaryCard Component
 *
 * Large data view showing patient summary with enhanced patient header and widget grid
 * Patient header is separate and persistent across views
 */

'use client';

import { motion } from 'framer-motion';
import { PatientIcon, AllergyIcon, MoreVerticalIcon, ArrowRightIcon } from '@/components/icons';

interface PatientSummaryCardProps {
  patientName?: string;
  dateOfBirth?: string;
  patientId?: string;
  sex?: string;
  allergyStatus?: string;
  onWidgetClick?: (widgetTitle: string) => void;
  showWidgets?: boolean;
  className?: string;
}

const WIDGETS = [
  { id: 'summary', title: 'Summary' },
  { id: 'encounters', title: 'Recent encounters' },
  { id: 'activity', title: 'Recent activity' },
  { id: 'lifestyle', title: 'Lifestyle & examinations' },
  { id: 'tests', title: 'Recent tests' },
  { id: 'medications', title: 'Medications' },
];

// Separate Patient Header component for reuse
export function PatientHeader({
  patientName = 'SMITH, Robert (Mr)',
  dateOfBirth = 'DD-Mon-YYYY',
  patientId = '123 456 7890',
  sex = 'Male',
  allergyStatus = 'No known allergies',
  className = '',
}: Omit<PatientSummaryCardProps, 'onWidgetClick' | 'showWidgets'>) {
  return (
    <div className={`border border-accent1-main bg-accent1-contrast rounded-lg p-4 flex items-center gap-4 ${className}`}>
      {/* Patient Icon */}
      <div className="w-10 h-10 flex items-center justify-center bg-accent1-contrast border border-accent1-main rounded flex-shrink-0">
        <PatientIcon size={24} className="text-accent1-main" />
      </div>

      {/* Patient Information */}
      <div className="flex-1 min-w-0">
        {/* Patient Name */}
        <div className="text-sm font-semibold text-accent1-dark mb-1">
          {patientName}
        </div>

        {/* Demographics - Single line with separators */}
        <div className="text-sm text-accent1-main flex items-center gap-2 flex-wrap">
          <span>Born: {dateOfBirth}</span>
          <span className="text-accent1-main opacity-50">•</span>
          <span>Patient identifier: {patientId}</span>
          <span className="text-accent1-main opacity-50">•</span>
          <span>Sex: {sex}</span>
        </div>
      </div>

      {/* Allergy Badge */}
      <div className="flex items-center gap-2 px-3 py-2 bg-accent3-contrast border border-accent3-dark rounded-lg flex-shrink-0">
        <AllergyIcon size={16} className="text-accent3-dark" />
        <span className="text-sm text-accent3-dark whitespace-nowrap">{allergyStatus}</span>
      </div>

      {/* More Actions Button */}
      <button
        className="w-10 h-10 flex items-center justify-center text-accent1-main hover:text-accent1-dark transition-colors flex-shrink-0"
        aria-label="More actions"
      >
        <MoreVerticalIcon size={20} />
      </button>
    </div>
  );
}

export function PatientSummaryCard({
  patientName,
  dateOfBirth,
  patientId,
  sex,
  allergyStatus,
  onWidgetClick,
  showWidgets = true,
  className = '',
}: PatientSummaryCardProps) {
  if (!showWidgets) {
    return null;
  }

  return (
    <div className={`h-full grid grid-cols-3 grid-rows-2 gap-6 ${className}`}>
      {WIDGETS.map((widget, index) => (
        <motion.div
          key={widget.id}
          className="border border-border bg-primary-contrast rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          {/* Widget Header */}
          <div className="p-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary flex-1">
              {widget.title}
            </h3>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => onWidgetClick?.(widget.title)}
                className="w-8 h-8 flex items-center justify-center hover:bg-hover transition-colors rounded"
                aria-label={`Open ${widget.title}`}
              >
                <ArrowRightIcon size={20} className="text-primary-main" />
              </button>
              <button
                className="w-8 h-8 flex items-center justify-center hover:bg-hover transition-colors rounded"
                aria-label={`${widget.title} options`}
              >
                <MoreVerticalIcon size={20} className="text-primary-main" />
              </button>
            </div>
          </div>

          {/* Breaker line */}
          <div className="border-t border-border" />

          {/* Widget content */}
          <div className="p-4">
            {/* Skeleton content placeholder */}
            <div className="space-y-3">
              <div className="h-3 w-3/4 bg-primary-light rounded" />
              <div className="h-3 w-full bg-primary-light rounded" />
              <div className="h-3 w-2/3 bg-primary-light rounded" />
              <div className="h-3 w-5/6 bg-primary-light rounded" />
              <div className="h-3 w-1/2 bg-primary-light rounded" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
