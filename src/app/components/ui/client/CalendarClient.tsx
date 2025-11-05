'use client';

import { useState, useMemo } from 'react';
import { Icon } from '@/app/components/ui';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  type:
    | 'shift'
    | 'interview'
    | 'placement'
    | 'meeting'
    | 'training'
    | 'time_off';
  status: 'scheduled' | 'assigned' | 'completed' | 'cancelled' | 'pending';
  entityType: 'shift' | 'placement' | 'availability' | 'time_off';
  entityId?: string;
  location?: string;
  role?: string;
  employer?: string;
  agency?: string;
  employee?: string;
  payRate?: number;
  hours?: number;
}

interface CalendarClientProps {
  user: {
    role: string;
    name?: string;
    id?: string;
  };
}

type CalendarView = 'month' | 'week' | 'day';
type EventFilter =
  | 'all'
  | 'shifts'
  | 'placements'
  | 'interviews'
  | 'time_off'
  | 'meetings'
  | 'training'
  | 'availabilities';

export function CalendarClient({ user }: CalendarClientProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [filter, setFilter] = useState<EventFilter>('all');

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const events: CalendarEvent[] = useMemo(
    () => [
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

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const navigateDate = (direction: 'prev' | 'next'): void => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (view === 'month') {
        direction === 'prev'
          ? newDate.setMonth(newDate.getMonth() - 1)
          : newDate.setMonth(newDate.getMonth() + 1);
      } else if (view === 'week') {
        direction === 'prev'
          ? newDate.setDate(newDate.getDate() - 7)
          : newDate.setDate(newDate.getDate() + 7);
      } else {
        direction === 'prev'
          ? newDate.setDate(newDate.getDate() - 1)
          : newDate.setDate(newDate.getDate() + 1);
      }
      return newDate;
    });
  };

  const goToToday = (): void => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear() &&
        (filter === 'all' || event.type === filter)
    );
  };

  const getWeekDates = (startDate: Date): Date[] => {
    const dates: Date[] = [];
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getEventColor = (type: string, status: string): string => {
    const colors = {
      shift: {
        scheduled:
          'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        assigned:
          'bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
        completed:
          'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800',
        cancelled:
          'bg-red-500/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
      },
      placement:
        'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      interview:
        'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      meeting:
        'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
      training:
        'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      time_off:
        'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    };

    if (type === 'shift') {
      return (
        colors.shift[status as keyof typeof colors.shift] ||
        colors.shift.scheduled
      );
    }

    return (
      colors[type as keyof Omit<typeof colors, 'shift'>] ||
      'bg-gray-500/10 text-gray-700 dark:text-gray-300'
    );
  };

  const getEventIcon = (type: string): string => {
    const icons: Record<string, string> = {
      shift: 'clock',
      placement: 'briefcase',
      interview: 'userCheck',
      meeting: 'users',
      training: 'bookOpen',
      time_off: 'umbrella',
    };
    return icons[type] || 'calendar';
  };

  const getStatusBadge = (status: string): JSX.Element => {
    const statusConfig = {
      scheduled: {
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        label: 'Scheduled',
      },
      assigned: {
        color:
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        label: 'Assigned',
      },
      completed: {
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
        label: 'Completed',
      },
      cancelled: {
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        label: 'Cancelled',
      },
      pending: {
        color:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        label: 'Pending',
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.scheduled;
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

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
    const stats = {
      total: filteredEvents.length,
      shifts: filteredEvents.filter((e) => e.type === 'shift').length,
      placements: filteredEvents.filter((e) => e.type === 'placement').length,
      interviews: filteredEvents.filter((e) => e.type === 'interview').length,
      timeOff: filteredEvents.filter((e) => e.type === 'time_off').length,
      thisWeek: filteredEvents.filter((e) => {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        return e.date >= today && e.date <= nextWeek;
      }).length,
    };
    return stats;
  }, [filteredEvents, today]);

  const handleDateSelect = (date: Date): void => {
    setSelectedDate(date);
    const dateEvents = getEventsForDate(date);
    setSelectedEvent(dateEvents.length > 0 ? dateEvents[0] : null);
  };

  const handleEventClick = (event: CalendarEvent): void => {
    setSelectedEvent(event);
  };

  const handleViewChange = (newView: CalendarView): void => {
    setView(newView);
  };

  const handleTodayClick = (): void => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleNewShiftClick = (): void => {
    console.log('Create new shift');
  };

  const renderMonthView = (): JSX.Element[] => {
    const days: JSX.Element[] = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-36 p-2 border-r border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50"
        />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected =
        selectedDate && date.toDateString() === selectedDate.toDateString();
      const dayEvents = getEventsForDate(date);
      const hasEvents = dayEvents.length > 0;

      days.push(
        <div
          key={day}
          onClick={() => handleDateSelect(date)}
          className={`h-36 p-2 border-r border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-all duration-200 group relative ${
            isToday
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
          } ${
            isSelected
              ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : ''
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span
              className={`text-sm font-medium ${
                isToday
                  ? 'text-blue-600 dark:text-blue-400'
                  : isSelected
                    ? 'text-blue-600 dark:text-blue-400'
                    : date.getDay() === 0
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {day}
            </span>
            {isToday && (
              <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-medium">
                Today
              </span>
            )}
            {hasEvents && !isToday && (
              <div className="flex space-x-1">
                {[...new Set(dayEvents.map((e) => e.type))]
                  .slice(0, 2)
                  .map((type) => (
                    <div
                      key={type}
                      className={`w-2 h-2 rounded-full ${getEventColor(type, 'scheduled').split(' ')[0]}`}
                    />
                  ))}
              </div>
            )}
          </div>

          <div className="space-y-1 max-h-24 overflow-y-auto">
            {dayEvents.slice(0, 4).map((event) => (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick(event);
                }}
                className={`text-xs px-2 py-1 rounded border cursor-pointer hover:opacity-80 transition-opacity ${getEventColor(event.type, event.status)}`}
              >
                <div className="flex items-center space-x-1 truncate">
                  <Icon
                    name={getEventIcon(event.type)}
                    className="w-3 h-3 flex-shrink-0"
                  />
                  <span className="truncate">
                    {event.startTime} {event.role || event.title}
                  </span>
                </div>
              </div>
            ))}
            {dayEvents.length > 4 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
                +{dayEvents.length - 4} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const renderWeekView = (): JSX.Element => {
    const weekDates = getWeekDates(currentDate);

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="grid grid-cols-8 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="p-4 border-r border-gray-200 dark:border-gray-700">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Time
            </span>
          </div>
          {weekDates.map((date, index) => {
            const isToday = date.toDateString() === today.toDateString();
            const isSelected =
              selectedDate &&
              date.toDateString() === selectedDate.toDateString();
            return (
              <div
                key={index}
                onClick={() => handleDateSelect(date)}
                className={`p-4 border-r border-gray-200 dark:border-gray-700 text-center cursor-pointer transition-colors ${
                  isToday
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : isSelected
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {shortDayNames[date.getDay()]}
                </div>
                <div
                  className={`text-lg font-bold ${
                    isToday
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {hours.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-8 border-b border-gray-100 dark:border-gray-800"
            >
              <div className="p-2 border-r border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-right pr-3">
                {hour === 0
                  ? '12 AM'
                  : hour < 12
                    ? `${hour} AM`
                    : hour === 12
                      ? '12 PM'
                      : `${hour - 12} PM`}
              </div>
              {weekDates.map((date, dayIndex) => {
                const dayEvents = getEventsForDate(date);
                const hourEvents = dayEvents.filter((event) => {
                  const eventStartHour = parseInt(
                    event.startTime.split(':')[0]
                  );
                  const eventEndHour = parseInt(event.endTime.split(':')[0]);
                  return hour >= eventStartHour && hour < eventEndHour;
                });

                return (
                  <div
                    key={dayIndex}
                    className="min-h-[80px] p-1 border-r border-gray-100 dark:border-gray-800 relative"
                  >
                    {hourEvents.map((event) => {
                      const eventStartHour = parseInt(
                        event.startTime.split(':')[0]
                      );
                      const isFirstHour = hour === eventStartHour;

                      return (
                        <div
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          className={`absolute left-1 right-1 p-2 rounded border text-xs cursor-pointer hover:opacity-90 transition-opacity ${getEventColor(event.type, event.status)}`}
                          style={{
                            top: '4px',
                            bottom: '4px',
                            left: isFirstHour ? '4px' : '1px',
                            right: '1px',
                          }}
                        >
                          {isFirstHour && (
                            <>
                              <div className="font-medium truncate">
                                {event.title}
                              </div>
                              <div className="text-xs opacity-75 truncate">
                                {event.startTime} - {event.endTime}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = (): JSX.Element => {
    const displayDate = selectedDate || currentDate;
    const dayEvents = getEventsForDate(displayDate);

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="p-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {dayNames[displayDate.getDay()]},{' '}
                {monthNames[displayDate.getMonth()]} {displayDate.getDate()},{' '}
                {displayDate.getFullYear()}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {dayEvents.length} events scheduled
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Icon
                  name="chevronLeft"
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
                />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Today
              </button>
              <button
                onClick={() => navigateDate('next')}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Icon
                  name="chevronRight"
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {hours.map((hour) => {
            const hourEvents = dayEvents.filter((event) => {
              const eventStartHour = parseInt(event.startTime.split(':')[0]);
              const eventEndHour = parseInt(event.endTime.split(':')[0]);
              return hour >= eventStartHour && hour < eventEndHour;
            });

            return (
              <div
                key={hour}
                className="flex border-b border-gray-100 dark:border-gray-800"
              >
                <div className="w-20 p-4 border-r border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 text-right">
                  {hour === 0
                    ? '12 AM'
                    : hour < 12
                      ? `${hour} AM`
                      : hour === 12
                        ? '12 PM'
                        : `${hour - 12} PM`}
                </div>
                <div className="flex-1 p-4 min-h-[100px] relative">
                  {hourEvents.map((event) => {
                    const eventStartHour = parseInt(
                      event.startTime.split(':')[0]
                    );
                    const isFirstHour = hour === eventStartHour;

                    return (
                      <div
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        className={`p-3 rounded-lg border mb-2 cursor-pointer hover:opacity-90 transition-opacity ${getEventColor(event.type, event.status)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-lg ${getEventColor(event.type, event.status).split(' ')[0]}`}
                            >
                              <Icon
                                name={getEventIcon(event.type)}
                                className="w-4 h-4"
                              />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {event.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {event.startTime} - {event.endTime} •{' '}
                                {event.location}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(event.status)}
                        </div>
                        {event.role && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Role: {event.role}
                          </p>
                        )}
                        {event.employee && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Employee: {event.employee}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const getViewTitle = (): string => {
    if (view === 'month') {
      return `${monthNames[currentMonth]} ${currentYear}`;
    } else if (view === 'week') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return `${weekStart.getDate()} ${monthNames[weekStart.getMonth()]} - ${weekEnd.getDate()} ${monthNames[weekEnd.getMonth()]} ${currentYear}`;
    } else {
      const displayDate = selectedDate || currentDate;
      return `${dayNames[displayDate.getDay()]}, ${monthNames[displayDate.getMonth()]} ${displayDate.getDate()}, ${displayDate.getFullYear()}`;
    }
  };

  const filterOptions = [
    {
      key: 'all' as EventFilter,
      label: 'All',
      icon: 'grid',
      permissions: [
        'super_admin',
        'agency_admin',
        'agent',
        'employer_admin',
        'contact',
        'employee',
      ],
    },
    {
      key: 'shifts' as EventFilter,
      label: 'Shifts',
      icon: 'clock',
      permissions: [
        'super_admin',
        'agency_admin',
        'agent',
        'employer_admin',
        'contact',
        'employee',
      ],
    },
    {
      key: 'placements' as EventFilter,
      label: 'Placements',
      icon: 'briefcase',
      permissions: ['super_admin', 'agency_admin', 'employer_admin'],
    },
    {
      key: 'interviews' as EventFilter,
      label: 'Interviews',
      icon: 'userCheck',
      permissions: ['super_admin', 'agency_admin', 'agent', 'employer_admin'],
    },
    {
      key: 'time_off' as EventFilter,
      label: 'Time Off',
      icon: 'umbrella',
      permissions: ['super_admin', 'agency_admin', 'agent', 'employee'],
    },
    {
      key: 'meetings' as EventFilter,
      label: 'Meetings',
      icon: 'users',
      permissions: ['super_admin', 'agency_admin', 'employer_admin'],
    },
    {
      key: 'training' as EventFilter,
      label: 'Training',
      icon: 'bookOpen',
      permissions: [
        'super_admin',
        'agency_admin',
        'employer_admin',
        'employee',
      ],
    },
    {
      key: 'availabilities' as EventFilter,
      label: 'Availabilities',
      icon: 'calendar',
      permissions: ['super_admin', 'agency_admin', 'agent'],
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <div className="xl:col-span-3 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {getViewTitle()}
            </h2>
            <div className="flex space-x-1">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Icon
                  name="chevronLeft"
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
                />
              </button>
              <button
                onClick={() => navigateDate('next')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Icon
                  name="chevronRight"
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
                />
              </button>
            </div>
          </div>

          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(['month', 'week', 'day'] as CalendarView[]).map((viewType) => (
              <button
                key={viewType}
                onClick={() => handleViewChange(viewType)}
                className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
                  view === viewType
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {viewType}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {filterOptions
            .filter((filterOption) =>
              filterOption.permissions.includes(user.role)
            )
            .map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Icon name={filterOption.icon} className="w-4 h-4" />
                <span>{filterOption.label}</span>
              </button>
            ))}
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
            <div className="text-blue-600 dark:text-blue-400 font-bold text-2xl">
              {eventStats.total}
            </div>
            <div className="text-blue-700 dark:text-blue-300 text-sm mt-1">
              Total Events
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
            <div className="text-green-600 dark:text-green-400 font-bold text-2xl">
              {eventStats.shifts}
            </div>
            <div className="text-green-700 dark:text-green-300 text-sm mt-1">
              Shifts
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 text-center">
            <div className="text-purple-600 dark:text-purple-400 font-bold text-2xl">
              {eventStats.placements}
            </div>
            <div className="text-purple-700 dark:text-purple-300 text-sm mt-1">
              Placements
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 text-center">
            <div className="text-orange-600 dark:text-orange-400 font-bold text-2xl">
              {eventStats.interviews}
            </div>
            <div className="text-orange-700 dark:text-orange-300 text-sm mt-1">
              Interviews
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
            <div className="text-yellow-600 dark:text-yellow-400 font-bold text-2xl">
              {eventStats.thisWeek}
            </div>
            <div className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
              This Week
            </div>
          </div>
        </div>

        {view === 'month' && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              {shortDayNames.map((day, index) => (
                <div
                  key={day}
                  className={`p-4 text-center text-sm font-semibold ${
                    index === 0
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">{renderMonthView()}</div>
          </div>
        )}

        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}

        {view === 'month' && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedDate
                  ? selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Select a Date'}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedDateEvents.length} events
              </span>
            </div>

            {selectedDate ? (
              <div className="space-y-3">
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      className={`p-4 rounded-lg border cursor-pointer hover:opacity-90 transition-opacity ${getEventColor(event.type, event.status)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div
                              className={`p-2 rounded-lg ${getEventColor(event.type, event.status).split(' ')[0]}`}
                            >
                              <Icon
                                name={getEventIcon(event.type)}
                                className="w-4 h-4"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  {event.title}
                                </h4>
                                {getStatusBadge(event.status)}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {event.startTime} - {event.endTime} •{' '}
                                {event.location}
                              </p>
                              {event.role && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Role: {event.role}
                                </p>
                              )}
                              {event.employee && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Employee: {event.employee}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-4">
                          <Icon name="moreHorizontal" className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Icon
                      name="calendar"
                      className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
                    />
                    <p className="text-gray-500 dark:text-gray-400">
                      No events scheduled for this date
                    </p>
                    <button
                      onClick={handleNewShiftClick}
                      className="mt-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center justify-center space-x-2 mx-auto"
                    >
                      <Icon name="plus" className="w-4 h-4" />
                      <span>Create Shift</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Icon
                  name="calendar"
                  className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
                />
                <p className="text-gray-500 dark:text-gray-400">
                  Select a date to view events
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="xl:col-span-1 space-y-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upcoming Events
            </h3>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium px-2 py-1 rounded-full">
              {upcomingEvents.length}
            </span>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => {
                  setSelectedDate(event.date);
                  handleEventClick(event);
                }}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-lg ${getEventColor(event.type, event.status).split(' ')[0]} group-hover:opacity-80`}
                  >
                    <Icon name={getEventIcon(event.type)} className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate text-sm mb-1">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {event.date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {event.startTime} • {event.location}
                    </p>
                    {event.role && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {event.role}
                      </p>
                    )}
                    <div className="mt-2">{getStatusBadge(event.status)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button
              onClick={handleNewShiftClick}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors flex items-center space-x-3"
            >
              <Icon name="plus" className="w-4 h-4 text-blue-500" />
              <span>Create New Shift</span>
            </button>
            <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors flex items-center space-x-3">
              <Icon name="download" className="w-4 h-4 text-gray-400" />
              <span>Export Schedule</span>
            </button>
            <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors flex items-center space-x-3">
              <Icon name="users" className="w-4 h-4 text-gray-400" />
              <span>Manage Availability</span>
            </button>
            <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors flex items-center space-x-3">
              <Icon name="settings" className="w-4 h-4 text-gray-400" />
              <span>Calendar Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
