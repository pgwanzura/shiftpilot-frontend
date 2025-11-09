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
import { CalendarEvent, CalendarClientProps, EventFilter } from './utils/types';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { CalendarEventsParams } from '@/types';

export function CalendarClient({
  user,
  currentView,
  onViewChange,
}: CalendarClientProps) {
  const [filter, setFilter] = useState<EventFilter>('all');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [useMockData, setUseMockData] = useState(false);

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
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const calendarParams: CalendarEventsParams = {
    start_date: currentDate.toISOString().split('T')[0],
    end_date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0],
    type: filter === 'all' ? undefined : filter,
  };

  const {
    data: apiEvents,
    error,
    isLoading,
  } = useCalendarEvents(calendarParams, user.authToken || '');

  useEffect(() => {
    if (error) {
      setUseMockData(true);
    }
  }, [error]);

  const mockEvents = useMemo(
    (): CalendarEvent[] => [
      {
        id: 'shift-1',
        title: 'Healthcare Assistant Shift',
        date: new Date(currentYear, currentMonth, 7),
        startTime: '07:00',
        endTime: '15:00',
        type: 'shift',
        status: 'assigned',
        entityType: 'shift',
        location: 'St. Thomas Hospital',
        role: 'Healthcare Assistant',
        employer: 'NHS Trust',
        employee: 'Sarah Johnson',
        payRate: 18.5,
        hours: 8,
      },
      {
        id: 'shift-2',
        title: 'Warehouse Operative',
        date: new Date(currentYear, currentMonth, 7),
        startTime: '14:00',
        endTime: '22:00',
        type: 'shift',
        status: 'scheduled',
        entityType: 'shift',
        location: 'Amazon Fulfillment Center',
        role: 'Warehouse Operative',
        employer: 'Amazon UK',
        payRate: 12.5,
        hours: 8,
      },
      {
        id: 'shift-3',
        title: 'Receptionist - Morning',
        date: new Date(currentYear, currentMonth, 12),
        startTime: '09:00',
        endTime: '17:00',
        type: 'shift',
        status: 'completed',
        entityType: 'shift',
        location: 'Corporate Office',
        role: 'Receptionist',
        employer: 'Tech Solutions Ltd',
        employee: 'Mike Chen',
        payRate: 15.0,
        hours: 8,
      },
      {
        id: 'shift-4',
        title: 'Security Guard - Night',
        date: new Date(currentYear, currentMonth, 15),
        startTime: '22:00',
        endTime: '06:00',
        type: 'shift',
        status: 'assigned',
        entityType: 'shift',
        location: 'City Center Mall',
        role: 'Security Guard',
        employer: 'SecureGuard Ltd',
        employee: 'David Wilson',
        payRate: 16.75,
        hours: 8,
      },
      {
        id: 'shift-5',
        title: 'Nurse - Day Shift',
        date: new Date(currentYear, currentMonth, 8),
        startTime: '08:00',
        endTime: '16:00',
        type: 'shift',
        status: 'assigned',
        entityType: 'shift',
        location: 'General Hospital',
        role: 'Registered Nurse',
        employer: 'NHS Trust',
        employee: 'Emma Wilson',
        payRate: 22.5,
        hours: 8,
      },
      {
        id: 'placement-1',
        title: '3-Month Nursing Placement',
        date: new Date(currentYear, currentMonth, 1),
        startTime: '09:00',
        endTime: '17:00',
        type: 'placement',
        status: 'scheduled',
        entityType: 'placement',
        location: 'Royal Infirmary',
        role: 'Registered Nurse',
        employer: 'NHS Scotland',
        employee: 'Emma Davis',
        payRate: 28.5,
        hours: 37.5,
      },
      {
        id: 'interview-1',
        title: 'Interview - Senior Care Assistant',
        date: new Date(currentYear, currentMonth, 15),
        startTime: '11:00',
        endTime: '12:00',
        type: 'interview',
        status: 'scheduled',
        entityType: 'shift',
        location: 'Interview Room B',
        role: 'Senior Care Assistant',
        employer: 'CarePlus Homes',
      },
      {
        id: 'interview-2',
        title: 'Technical Interview - DevOps',
        date: new Date(currentYear, currentMonth, 18),
        startTime: '14:00',
        endTime: '15:30',
        type: 'interview',
        status: 'scheduled',
        entityType: 'placement',
        location: 'Zoom Meeting',
        role: 'DevOps Engineer',
        employer: 'FinTech Solutions',
      },
      {
        id: 'meeting-1',
        title: 'Client Meeting - NHS Partnership',
        date: new Date(currentYear, currentMonth, 20),
        startTime: '10:00',
        endTime: '11:30',
        type: 'meeting',
        status: 'scheduled',
        entityType: 'shift',
        location: 'Board Room',
        employer: 'NHS Trust',
      },
      {
        id: 'training-1',
        title: 'Health & Safety Training',
        date: new Date(currentYear, currentMonth, 22),
        startTime: '13:00',
        endTime: '17:00',
        type: 'training',
        status: 'scheduled',
        entityType: 'shift',
        location: 'Training Center',
        role: 'Mandatory Training',
      },
      {
        id: 'timeoff-1',
        title: 'Annual Leave - Sarah Johnson',
        date: new Date(currentYear, currentMonth, 25),
        startTime: '00:00',
        endTime: '23:59',
        type: 'time_off',
        status: 'scheduled',
        entityType: 'time_off',
        employee: 'Sarah Johnson',
      },
      {
        id: 'timeoff-2',
        title: 'Sick Leave - Mike Chen',
        date: new Date(currentYear, currentMonth, 28),
        startTime: '00:00',
        endTime: '23:59',
        type: 'time_off',
        status: 'scheduled',
        entityType: 'time_off',
        employee: 'Mike Chen',
      },
    ],
    [currentYear, currentMonth]
  );

  const events =
    useMockData || error ? mockEvents : apiEvents?.data || mockEvents;

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

    events.forEach((event: CalendarEvent) => {
      if (counts.hasOwnProperty(event.type)) {
        counts[event.type]++;
      }
    });

    return counts;
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter(
      (event: CalendarEvent) => filter === 'all' || event.type === filter
    );
  }, [events, filter]);

  const upcomingEvents = useMemo(() => {
    return filteredEvents
      .filter(
        (event: CalendarEvent) =>
          event.date >= today && event.status !== 'completed'
      )
      .sort(
        (a: CalendarEvent, b: CalendarEvent) =>
          a.date.getTime() - b.date.getTime()
      )
      .slice(0, 10);
  }, [filteredEvents, today]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dateEvents = getEventsForDate(date);
    setSelectedEvent(dateEvents.length > 0 ? dateEvents[0] : null);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleNewShiftClick = () => {
    console.log('Create new shift');
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(
      (event: CalendarEvent) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear() &&
        (filter === 'all' || event.type === filter)
    );
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  if (isLoading && !useMockData) {
    return <CalendarSkeleton view={view} />;
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <div className="xl:col-span-3 space-y-6">
        <CalendarHeader
          currentDate={currentDate}
          selectedDate={selectedDate}
          view={view}
          onNavigate={navigateDate}
          onToday={goToToday}
          onViewChange={handleViewChange}
        />

        {useMockData && (
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
            <p className="text-warning-700 text-sm">
              Using demo data. Calendar events from API are not available.
            </p>
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
            onEventClick={handleEventClick}
            onNewShiftClick={handleNewShiftClick}
          />
        )}
      </div>

      <div className="xl:col-span-1">
        <CalendarSidebar
          upcomingEvents={upcomingEvents}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onEventClick={handleEventClick}
          onNewShiftClick={handleNewShiftClick}
        />
      </div>
    </div>
  );
}

interface CalendarSkeletonProps {
  view: 'month' | 'week' | 'day';
}

function CalendarSkeleton({ view }: CalendarSkeletonProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 animate-pulse">
      <div className="xl:col-span-3 space-y-6">
        <HeaderSkeleton />
        <FiltersSkeleton />
        {view === 'month' && <MonthViewSkeleton />}
        {view === 'week' && <WeekViewSkeleton />}
        {view === 'day' && <DayViewSkeleton />}
        {view === 'month' && <SelectedDateEventsSkeleton />}
      </div>
      <SidebarSkeleton />
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <div className="flex space-x-1">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
        <div className="w-48 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1 gap-1">
        <div className="w-20 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="w-20 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="w-20 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
  );
}

function FiltersSkeleton() {
  return (
    <div className="flex flex-wrap gap-3 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
      {Array.from({ length: 6 }).map((_, index: number) => (
        <div
          key={index}
          className="w-24 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"
        ></div>
      ))}
    </div>
  );
}

function MonthViewSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        {Array.from({ length: 7 }).map((_, index: number) => (
          <div key={index} className="p-4 text-center">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mx-auto w-8"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: 42 }).map((_, index: number) => (
          <div
            key={index}
            className="h-36 p-2 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
            </div>
            <div className="space-y-1">
              {Array.from({ length: 3 }).map((_, subIndex: number) => (
                <div
                  key={subIndex}
                  className="h-6 bg-gray-200 dark:bg-gray-700 rounded"
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeekViewSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700">
        <div className="border-r border-gray-200 dark:border-gray-700"></div>
        {Array.from({ length: 7 }).map((_, index: number) => (
          <div
            key={index}
            className="p-4 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mx-auto w-16"></div>
          </div>
        ))}
      </div>
      <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
    </div>
  );
}

function DayViewSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden h-[600px]">
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        {Array.from({ length: 24 }).map((_, index: number) => (
          <div
            key={index}
            className="flex border-b border-gray-200 dark:border-gray-700 h-20"
          >
            <div className="w-24 p-4 border-r border-gray-200 dark:border-gray-700">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 float-right"></div>
            </div>
            <div className="flex-1 p-4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SelectedDateEventsSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, index: number) => (
          <div
            key={index}
            className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"
          ></div>
        ))}
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index: number) => (
            <div
              key={index}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index: number) => (
            <div
              key={index}
              className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
