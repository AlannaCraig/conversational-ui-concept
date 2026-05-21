'use client';

import { motion } from 'framer-motion';
import {
  ListItemCard,
  ThreeColumnGrid,
  TwoColumnLayout,
  MediaCard,
  StatsGrid,
  TimelineList,
  CalendarGrid,
  ProfileCard,
  TableRow,
  FormCard,
} from '@/components/ui/AdaptiveCards';
import type { CardLayoutType } from '@/lib/adaptiveCardSelector';

interface AdaptiveCardRendererProps {
  layouts: CardLayoutType[];
  className?: string;
}

// Map layout types to components
const cardComponents: Record<CardLayoutType, React.ComponentType<any>> = {
  'list-item': ListItemCard,
  'three-column': ThreeColumnGrid,
  'two-column': TwoColumnLayout,
  media: MediaCard,
  stats: StatsGrid,
  timeline: TimelineList,
  calendar: CalendarGrid,
  profile: ProfileCard,
  table: TableRow,
  form: FormCard,
};

export function AdaptiveCardRenderer({
  layouts,
  className = '',
}: AdaptiveCardRendererProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {layouts.map((layout, index) => {
        const CardComponent = cardComponents[layout];

        return (
          <motion.div
            key={`${layout}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <CardComponent />
          </motion.div>
        );
      })}
    </div>
  );
}
