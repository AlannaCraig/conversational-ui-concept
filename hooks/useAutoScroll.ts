import { useEffect, useRef } from 'react';

interface UseAutoScrollOptions {
  /**
   * Whether auto-scroll is enabled
   */
  enabled?: boolean;
  /**
   * Behavior of the scroll animation
   */
  behavior?: ScrollBehavior;
  /**
   * Dependencies that trigger auto-scroll
   */
  dependencies?: any[];
}

/**
 * Custom hook for smooth auto-scrolling to bottom of a container
 * Triggers when dependencies change (e.g., new messages added)
 */
export function useAutoScroll<T extends HTMLElement = HTMLDivElement>(
  options: UseAutoScrollOptions = {}
) {
  const { enabled = true, behavior = 'smooth', dependencies = [] } = options;
  const scrollRef = useRef<T>(null);

  useEffect(() => {
    if (!enabled || !scrollRef.current) return;

    const scrollToBottom = () => {
      const element = scrollRef.current;
      if (!element) return;

      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        element.scrollTo({
          top: element.scrollHeight,
          behavior,
        });
      });
    };

    // Small delay to ensure content has rendered
    const timeoutId = setTimeout(scrollToBottom, 100);

    return () => clearTimeout(timeoutId);
  }, dependencies);

  return scrollRef;
}
