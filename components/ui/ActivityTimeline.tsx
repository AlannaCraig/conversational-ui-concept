'use client';

import type { ActivityEvent, ActivityEventType } from '@/lib/patientData';

const EVENT_CONFIG: Record<ActivityEventType, {
  label: string;
  actionWord: string;
}> = {
  viewed:      { label: 'Viewed this patient',              actionWord: 'Viewed'    },
  'work-item': { label: 'Created a Work Item',              actionWord: 'Created'   },
  filed:       { label: 'Filed a document to this patient', actionWord: 'Filed'     },
  appointment: { label: 'Booked an appointment',            actionWord: 'Booked'    },
  task:        { label: 'Completed a task',                 actionWord: 'Completed' },
};

function ActorAvatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white"
      style={{ backgroundColor: color }}
    >
      <span className="text-[10px] font-semibold leading-none">{initials}</span>
    </div>
  );
}

// Card top padding is py-2.5 (10px). Avatar is h-6 (24px). Dot centre = 10 + 12 = 22px from card top.
// Adding mb-2 (8px) gap between cards, the top segment of the next item must also be 22px to keep dot
// centred with *that* card's header — so we use a fixed 22px top segment on every item and let the
// bottom segment (flex-1) absorb the gap + any variable card height.
const DOT_OFFSET = 22;

function TimelineItem({ event, isFirst, isLast }: { event: ActivityEvent; isFirst: boolean; isLast: boolean }) {
  const config = EVENT_CONFIG[event.type];

  return (
    <div className="flex gap-3">
      {/* Left column: top line → dot → bottom line */}
      <div className="flex flex-col items-center flex-shrink-0 w-3">
        <div
          className={`w-px flex-none ${isFirst ? '' : 'bg-border'}`}
          style={{ height: DOT_OFFSET }}
        />
        <div className="w-2.5 h-2.5 rounded-full bg-primary-light flex-shrink-0" />
        <div className={`w-px flex-1 ${isLast ? '' : 'bg-border'}`} />
      </div>

      {/* Right column: card */}
      <div className={`flex-1 border border-border rounded-lg px-3 py-2.5 min-w-0 ${isLast ? '' : 'mb-2'}`}>
        {/* Actor + action */}
        <div className="flex items-center gap-2">
          <ActorAvatar initials={event.actor.initials} color={event.actor.color} />
          <p className="text-sm text-text-primary min-w-0">
            <span className="font-semibold">{config.actionWord}</span>
            {' '}
            <span>{config.label.replace(config.actionWord + ' ', '')}</span>
          </p>
        </div>

        {/* Optional metadata row */}
        {event.meta && (
          <>
            <div className="border-t border-border-light mt-2 mb-2" />
            <p className="text-sm text-text-secondary">
              <span>{event.meta.label}</span>
              {'  '}
              <span className="text-text-primary font-medium">{event.meta.value}</span>
            </p>
          </>
        )}

        {/* Timestamp */}
        <div className="border-t border-border-light mt-2 pt-2">
          <p className="text-xs text-text-tertiary">{event.datetime}</p>
        </div>
      </div>
    </div>
  );
}

interface ActivityTimelineProps {
  events: ActivityEvent[];
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  if (!events.length) {
    return <p className="text-sm text-text-tertiary italic">No recent activity.</p>;
  }

  return (
    <div className="flex flex-col">
      {events.map((event, i) => (
        <TimelineItem
          key={event.id}
          event={event}
          isFirst={i === 0}
          isLast={i === events.length - 1}
        />
      ))}
    </div>
  );
}
