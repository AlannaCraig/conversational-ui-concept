/**
 * AppointmentListCard Component
 *
 * Adaptive card displaying a list of appointments
 */

'use client';

interface AppointmentListCardProps {
  count: number;
}

export function AppointmentListCard({ count }: AppointmentListCardProps) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-4 p-3 border border-border rounded-lg"
        >
          {/* Time block */}
          <div className="flex-shrink-0 text-center">
            <div className="h-4 w-12 bg-primary-light rounded mb-1" />
            <div className="h-3 w-12 bg-primary-light rounded opacity-70" />
          </div>

          {/* Vertical divider */}
          <div className="w-px h-12 bg-border flex-shrink-0" />

          {/* Appointment content */}
          <div className="flex-1 space-y-2">
            {/* Appointment title */}
            <div className="h-4 w-2/3 bg-primary-light rounded" />
            {/* Appointment location/details */}
            <div className="h-3 w-1/2 bg-primary-light rounded opacity-70" />
          </div>

          {/* Duration badge */}
          <div className="w-12 h-6 bg-accent1-light rounded flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}
