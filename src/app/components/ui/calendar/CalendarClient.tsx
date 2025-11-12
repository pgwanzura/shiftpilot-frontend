'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCalendarView } from './hooks/useCalendarView';
import { CalendarHeader } from './CalendarHeader';
import { CalendarFilters } from './CalendarFilters';
import { CalendarMonthView } from './CalendarMonthView';
import { CalendarWeekView } from './CalendarWeekView';
import { CalendarDayView } from './CalendarDayView';
import { CalendarSidebar } from './CalendarSidebar';
import { SelectedDateEvents } from './SelectedDateEvents';
import { SelectedEventDetails } from './SelectedEventDetails';
import { CalendarEvent, CalendarClientProps, EventFilter } from '@/types';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { CalendarEventsParams } from '@/types';
import { CalendarSkeleton } from './skeleton';

interface ApiResponse {
  success: boolean;
  data: CalendarEvent[];
  meta?: {
    total: number;
    filters: Record<string, unknown>;
  };
}

export function CalendarClient({
  user,
  currentView,
  onViewChange,
}: CalendarClientProps) {
  const [filter, setFilter] = useState<EventFilter>('all');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isMounted, setIsMounted] = useState(false);

  const {
    currentDate,
    selectedDate,
    setSelectedDate,
    view,
    handleViewChange,
    navigateDate,
    goToToday,
  } = useCalendarView(currentView, onViewChange);

  const today = useMemo(() => new Date(), []);

  const calendarParams: CalendarEventsParams = {
    start_date: currentDate.toISOString().split('T')[0],
    end_date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0],
    type: filter === 'all' ? undefined : filter,
    view: view,
    filter: filter,
  };

  const {
    data: apiEvents,
    error,
    isLoading,
  } = useCalendarEvents(calendarParams);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const events: CalendarEvent[] = useMemo(() => {
    if (!apiEvents) return [];

    let eventsData: CalendarEvent[] = [];

    if (Array.isArray(apiEvents)) {
      eventsData = apiEvents;
    } else {
      const response = apiEvents as ApiResponse;
      if (response && response.data) {
        eventsData = response.data;
      }
    }

    return eventsData.map((event) => ({
      ...event,
      date: new Date(event.date),
    }));
  }, [apiEvents]);

  const eventCounts = useMemo(() => {
    const counts: Record<string, number> = {
      shift: 0,
      placement: 0,
      interview: 0,
      time_off: 0,
      meeting: 0,
      training: 0,
      availability: 0,
    };

    events.forEach((event) => {
      if (counts.hasOwnProperty(event.type)) {
        counts[event.type]++;
      }
    });

    return counts;
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => filter === 'all' || event.type === filter);
  }, [events, filter]);

  const upcomingEvents = useMemo(() => {
    return filteredEvents
      .filter((event) => event.date >= today && event.status !== 'completed')
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 10);
  }, [filteredEvents, today]);

  const clearSelectedEvent = () => {
    setSelectedEvent(null);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(event.date);
  };

  const handleNewShiftClick = () => {
    console.log('Create new shift');
  };

  const handleEventAction = (
    event: CalendarEvent,
    action: 'edit' | 'delete' | 'view'
  ) => {
    setSelectedEvent(event);
    switch (action) {
      case 'edit':
        console.log('Edit event:', event.id);
        break;
      case 'delete':
        console.log('Delete event:', event.id);
        break;
      case 'view':
      default:
        break;
    }
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear() &&
        (filter === 'all' || event.type === filter)
    );
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  if (!isMounted || isLoading) {
    return <CalendarSkeleton view={view} />;
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <div className="xl:col-span-3 space-y-6">
        {selectedEvent && (
          <SelectedEventDetails
            event={selectedEvent}
            onClose={clearSelectedEvent}
            onAction={handleEventAction}
          />
        )}

        <CalendarHeader
          currentDate={currentDate}
          selectedDate={selectedDate}
          view={view}
          onNavigate={navigateDate}
          onToday={goToToday}
          onViewChange={handleViewChange}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm text-red-700 mt-1">
                  Failed to load calendar events.
                </div>
              </div>
            </div>
          </div>
        )}

        <CalendarFilters
          filter={filter}
          onFilterChange={setFilter}
          userRole={user.role}
          eventCounts={eventCounts}
        />

        {view === 'month' && (
          <CalendarMonthView
            currentDate={currentDate}
            selectedDate={selectedDate}
            events={filteredEvents}
            filter={filter}
            onDateSelect={handleDateSelect}
            onEventClick={handleEventClick}
          />
        )}

        {view === 'week' && (
          <CalendarWeekView
            currentDate={currentDate}
            selectedDate={selectedDate}
            events={filteredEvents}
            filter={filter}
            onDateSelect={handleDateSelect}
            onEventClick={handleEventClick}
          />
        )}

        {view === 'day' && (
          <CalendarDayView
            currentDate={currentDate}
            selectedDate={selectedDate}
            events={filteredEvents}
            filter={filter}
            onNavigate={navigateDate}
            onToday={goToToday}
            onEventClick={handleEventClick}
          />
        )}

        {view === 'month' && (
          <SelectedDateEvents
            selectedDate={selectedDate}
            selectedDateEvents={selectedDateEvents}
            selectedEvent={selectedEvent}
            onEventClick={handleEventClick}
            onNewShiftClick={handleNewShiftClick}
          />
        )}
      </div>

      <div className="xl:col-span-1">
        <CalendarSidebar
          upcomingEvents={upcomingEvents}
          selectedDate={selectedDate}
          selectedEvent={selectedEvent}
          onDateSelect={handleDateSelect}
          onEventClick={handleEventClick}
          onNewShiftClick={handleNewShiftClick}
          onClearSelection={clearSelectedEvent}
        />
      </div>
    </div>
  );
}
