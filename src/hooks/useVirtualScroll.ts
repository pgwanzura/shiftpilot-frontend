import { useState, useRef, useCallback, useMemo } from 'react';

interface VirtualScrollResult {
  containerRef: React.RefObject<HTMLDivElement>;
  visibleData: any[];
  totalHeight: number;
  startIndex: number;
  endIndex: number;
  handleScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  scrollVelocity: number;
}

export function useVirtualScroll(
  data: any[],
  rowHeight: number = 53,
  overscan: number = 5
): VirtualScrollResult {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const lastScrollTime = useRef(Date.now());

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const currentScrollTop = event.currentTarget.scrollTop;
    const currentTime = Date.now();
    const timeDiff = currentTime - lastScrollTime.current;

    if (timeDiff > 0) {
      const velocity =
        Math.abs(currentScrollTop - lastScrollTop.current) / timeDiff;
      setScrollVelocity(velocity * 1000);
    }

    setScrollTop(currentScrollTop);
    lastScrollTop.current = currentScrollTop;
    lastScrollTime.current = currentTime;
  }, []);

  const { startIndex, endIndex, visibleData, totalHeight } = useMemo(() => {
    const containerHeight = containerRef.current?.clientHeight || 0;
    const visibleStart = Math.floor(scrollTop / rowHeight);
    const visibleEnd = Math.ceil((scrollTop + containerHeight) / rowHeight);

    const startIndex = Math.max(0, visibleStart - overscan);
    const endIndex = Math.min(data.length, visibleEnd + overscan);
    const visibleData = data.slice(startIndex, endIndex);
    const totalHeight = data.length * rowHeight;

    return { startIndex, endIndex, visibleData, totalHeight };
  }, [data, scrollTop, rowHeight, overscan]);

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
