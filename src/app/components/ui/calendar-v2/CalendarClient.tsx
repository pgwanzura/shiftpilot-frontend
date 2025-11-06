'use client';

import { useState, useMemo } from 'react';
import { useCalendarView } from './hooks/useCalendarView';
import { CalendarHeader } from './CalendarHeader';
import { CalendarFilters } from './CalendarFilters';
import { CalendarStats } from './CalendarStats';
import { CalendarMonthView } from './CalendarMonthView';
import { CalendarWeekView } from './CalendarWeekView';
import { CalendarDayView } from './CalendarDayView';
import { CalendarSidebar } from './CalendarSidebar';
import { SelectedDateEvents } from './SelectedDateEvents';
import { CalendarEvent, CalendarClientProps } from './utils/types';

export function CalendarClient({
  user,
  currentView,
  onViewChange,
}: CalendarClientProps) {
  const [filter, setFilter] = useState<EventFilter>('all');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );

  const {
    currentDate,
    selectedDate,
    setSelectedDate,
    view,
    handleViewChange,
    navigateDate,
    goToToday,
  } = useCalendarView(currentView, onViewChange);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const events = useMemo(
    (): CalendarEvent[] => [
      {
        id: 'shift-1',
        title: 'Healthcare Assistant Shift',
        date: new Date(currentYear, currentMonth, 7),
        startTime: '07:00',
        endTime: '15:00',
        type: 'shift' as const,
        status: 'assigned' as const,
        entityType: 'shift' as const,
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
        type: 'shift' as const,
        status: 'scheduled' as const,
        entityType: 'shift' as const,
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
        type: 'shift' as const,
        status: 'completed' as const,
        entityType: 'shift' as const,
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
        type: 'shift' as const,
        status: 'assigned' as const,
        entityType: 'shift' as const,
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
        type: 'shift' as const,
        status: 'assigned' as const,
        entityType: 'shift' as const,
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
        type: 'placement' as const,
        status: 'scheduled' as const,
        entityType: 'placement' as const,
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
        type: 'interview' as const,
        status: 'scheduled' as const,
        entityType: 'shift' as const,
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
        type: 'interview' as const,
        status: 'scheduled' as const,
        entityType: 'placement' as const,
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
        type: 'meeting' as const,
        status: 'scheduled' as const,
        entityType: 'shift' as const,
        location: 'Board Room',
        employer: 'NHS Trust',
      },
      {
        id: 'training-1',
        title: 'Health & Safety Training',
        date: new Date(currentYear, currentMonth, 22),
        startTime: '13:00',
        endTime: '17:00',
        type: 'training' as const,
        status: 'scheduled' as const,
        entityType: 'shift' as const,
        location: 'Training Center',
        role: 'Mandatory Training',
      },
      {
        id: 'timeoff-1',
        title: 'Annual Leave - Sarah Johnson',
        date: new Date(currentYear, currentMonth, 25),
        startTime: '00:00',
        endTime: '23:59',
        type: 'time_off' as const,
        status: 'scheduled' as const,
        entityType: 'time_off' as const,
        employee: 'Sarah Johnson',
      },
      {
        id: 'timeoff-2',
        title: 'Sick Leave - Mike Chen',
        date: new Date(currentYear, currentMonth, 28),
        startTime: '00:00',
        endTime: '23:59',
        type: 'time_off' as const,
        status: 'scheduled' as const,
        entityType: 'time_off' as const,
        employee: 'Mike Chen',
      },
    ],
    [currentYear, currentMonth]
  );

  const filteredEvents = useMemo(() => {
    return events.filter((event) => filter === 'all' || event.type === filter);
  }, [events, filter]);

  const upcomingEvents = useMemo(() => {
    return filteredEvents
      .filter((event) => event.date >= today && event.status !== 'completed')
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 10);
  }, [filteredEvents, today]);

  const eventStats = useMemo(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    return {
      total: filteredEvents.length,
      shifts: filteredEvents.filter((e) => e.type === 'shift').length,
      placements: filteredEvents.filter((e) => e.type === 'placement').length,
      interviews: filteredEvents.filter((e) => e.type === 'interview').length,
      timeOff: filteredEvents.filter((e) => e.type === 'time_off').length,
      thisWeek: filteredEvents.filter(
        (e) => e.date >= today && e.date <= nextWeek
      ).length,
    };
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
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear() &&
        (filter === 'all' || event.type === filter)
    );
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

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

        <CalendarFilters
          filter={filter}
          onFilterChange={setFilter}
          userRole={user.role}
        />

        <CalendarStats stats={eventStats} />

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

        {/* Selected Date Events Panel - Only shown in month view */}
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
