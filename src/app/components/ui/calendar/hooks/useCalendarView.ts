import { useState, useEffect } from 'react';

type CalendarView = 'month' | 'week' | 'day';

const CALENDAR_VIEW_STORAGE_KEY = 'calendar-view-preference';

const getStoredView = (): CalendarView | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(CALENDAR_VIEW_STORAGE_KEY);
    return stored as CalendarView;
  } catch {
    return null;
  }
};

const setStoredView = (view: CalendarView): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CALENDAR_VIEW_STORAGE_KEY, view);
  } catch (error) {
    console.warn('Failed to save calendar view to localStorage:', error);
  }
};

export function useCalendarView(
  externalView?: CalendarView,
  onViewChange?: (view: CalendarView) => void
) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [internalView, setInternalView] = useState<CalendarView>(() => {
    const storedView = getStoredView();
    return storedView && ['month', 'week', 'day'].includes(storedView)
      ? storedView
      : 'month';
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    let initialView: CalendarView = internalView;

    if (externalView !== undefined) {
      initialView = externalView;
    }

    if (initialView !== internalView) {
      setInternalView(initialView);
    }

    setIsInitialized(true);
  }, [externalView, internalView, isInitialized]);

  useEffect(() => {
    if (isInitialized && externalView === undefined) {
      setStoredView(internalView);
    }
  }, [internalView, externalView, isInitialized]);

  useEffect(() => {
    if (
      isInitialized &&
      externalView !== undefined &&
      externalView !== internalView
    ) {
      setInternalView(externalView);
    }
  }, [externalView, internalView, isInitialized]);

  const view = externalView !== undefined ? externalView : internalView;

  const handleViewChange = (newView: CalendarView) => {
    if (onViewChange) {
      onViewChange(newView);
    }

    if (externalView === undefined) {
      setInternalView(newView);
    }
  };

  const navigateDate = (direction: 'prev' | 'next'): void => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (view === 'month') {
        newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
      } else if (view === 'week') {
        newDate.setDate(newDate.getDate() + (direction === 'prev' ? -7 : 7));
      } else {
        newDate.setDate(newDate.getDate() + (direction === 'prev' ? -1 : 1));
      }
      return newDate;
    });
  };

  const goToToday = (): void => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  return {
    currentDate,
    setCurrentDate,
    selectedDate,
    setSelectedDate,
    view,
    internalView,
    handleViewChange,
    navigateDate,
    goToToday,
  };
}
