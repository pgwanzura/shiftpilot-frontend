import { useState, useRef, useCallback } from 'react';
import { TableData } from '@/types/table';

export function useVirtualScroll<T extends TableData>(
  data: T[],
  itemHeight: number = 53,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const scrollTimer = useRef<NodeJS.Timeout>();

  const containerHeight = containerRef.current?.clientHeight || 500;
  const totalHeight = data.length * itemHeight;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    data.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleData = data.slice(startIndex, endIndex);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollTop = e.currentTarget.scrollTop;
    const velocity = currentScrollTop - lastScrollTop.current;
    setScrollVelocity(velocity);
    lastScrollTop.current = currentScrollTop;

    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }

    scrollTimer.current = setTimeout(() => {
      setScrollVelocity(0);
    }, 100);

    setScrollTop(currentScrollTop);
  }, []);

  return {
    containerRef,
    visibleData,
    totalHeight,
    startIndex,
    endIndex,
    handleScroll,
    scrollVelocity,
  };
}
