/**
 * TaskListCard Component
 *
 * Adaptive card displaying a list of tasks
 */

'use client';

interface TaskListCardProps {
  count: number;
}

export function TaskListCard({ count }: TaskListCardProps) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-3 border border-border rounded-lg"
        >
          {/* Checkbox */}
          <div className="w-5 h-5 border-2 border-border rounded flex-shrink-0 mt-0.5" />

          {/* Task content */}
          <div className="flex-1 space-y-2">
            {/* Task title */}
            <div className="h-4 w-3/4 bg-primary-light rounded" />
            {/* Task details */}
            <div className="h-3 w-1/2 bg-primary-light rounded opacity-70" />
          </div>

          {/* Priority indicator */}
          <div className="w-2 h-2 rounded-full bg-accent-main flex-shrink-0 mt-1.5" />
        </div>
      ))}
    </div>
  );
}
