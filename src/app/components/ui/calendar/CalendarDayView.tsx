'use client';

import { CalendarEvent } from '@/types';
import {
  getEventsForDate,
  getEventColor,
  dayNames,
  monthNames,
  getStatusBadgeConfig,
} from './utils/calendarHelpers';
import { StatusBadge } from '@/app/components/ui/StatusBadge';

interface CalendarDayViewProps {
  currentDate: Date;
  selectedDate: Date | null;
  events: CalendarEvent[];
  filter: string;
  onNavigate: (direction: 'prev' | 'next') => void;
  onToday: () => void;
  onEventClick: (event: CalendarEvent) => void;
}

export function CalendarDayView({
  currentDate,
  events,
  filter,
  onNavigate,
  onToday,
  onEventClick,
}: CalendarDayViewProps) {
  const displayDate = currentDate;
  const dayEvents = getEventsForDate(events, displayDate, filter);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const parseTime = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const sortedEvents = [...dayEvents].sort(
    (a, b) => parseTime(a.startTime) - parseTime(b.startTime)
  );

  const calculateEventPosition = (event: CalendarEvent) => {
    const [startHour, startMinute] = event.startTime.split(':').map(Number);
    const [endHour, endMinute] = event.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    const duration = Math.max(endMinutes - startMinutes, 30);
    const top = (startMinutes / 60) * 80;
    const height = (duration / 60) * 80;
    return { top, height };
  };

  const detectOverlaps = (eventsList: CalendarEvent[]) => {
    const positions: { [id: string]: number } = {};
    const used: number[] = [];
    eventsList.forEach((event) => {
      const eventStart = parseTime(event.startTime);
      const eventEnd = parseTime(event.endTime);
      let slot = 0;
      while (used[slot] && used[slot] > eventStart) slot++;
      positions[event.id] = slot;
      used[slot] = eventEnd;
    });
    return positions;
  };

  const overlapPositions = detectOverlaps(sortedEvents);

  const getEventIconColor = (type: string): string => {
    const colorMap: Record<string, string> = {
      shift: 'bg-primary-500',
      placement: 'bg-success-500',
      interview: 'bg-info-500',
      meeting: 'bg-warning-500',
      training: 'bg-primary-600',
      time_off: 'bg-error-500',
      availability: 'bg-gray-500',
    };
    return colorMap[type] || 'bg-gray-500';
  };

  const formatCompactTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    return minutes === '00'
      ? `${displayHour}${ampm}`
      : `${displayHour}:${minutes}${ampm}`;
  };

  const getCurrentTimePosition = (): number => {
    const now = new Date();
    return ((now.getHours() * 60 + now.getMinutes()) / 60) * 80;
  };

  const isToday = new Date().toDateString() === displayDate.toDateString();
  const currentTimePosition = getCurrentTimePosition();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col h-[600px]">
      {/* Header */}
      <div className="px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {dayNames[displayDate.getDay()]}
            </h1>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
              {monthNames[displayDate.getMonth()]} {displayDate.getDate()},{' '}
              {displayDate.getFullYear()}
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            {isToday && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow">
                Today
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('prev')}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={onToday}
            className="px-3 py-2 text-sm font-medium rounded-md bg-primary-500 text-white hover:bg-primary-600 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => onNavigate('next')}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Hour Rows */}
      <div className="flex-1 overflow-y-auto relative">
        {hours.map((hour) => (
          <div
            key={hour}
            className="flex border-b border-gray-200 dark:border-gray-700 h-[80px] bg-white dark:bg-gray-900 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors duration-150"
          >
            <div className="w-24 p-4 border-r border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 text-right font-bold flex items-start justify-end">
              <span className="bg-white dark:bg-gray-900 px-2 py-1 rounded text-xs border border-gray-200 dark:border-gray-700">
                {hour === 0
                  ? '12 AM'
                  : hour < 12
                    ? `${hour} AM`
                    : hour === 12
                      ? '12 PM'
                      : `${hour - 12} PM`}
              </span>
            </div>
          </div>
        ))}

        {/* Current Time Indicator */}
        {isToday && (
          <div
            className="absolute left-24 right-0 h-0.25 bg-error-500 z-30"
            style={{ top: `${currentTimePosition}px` }}
          >
            <div className="absolute -left-2 -top-1.5 w-3 h-3 bg-error-500 rounded-full border-2 border-white dark:border-gray-900" />
          </div>
        )}

        {/* Events */}
        {sortedEvents.map((event) => {
          const { top, height } = calculateEventPosition(event);
          const overlapIndex = overlapPositions[event.id] || 0;
          const eventWidth = 200;
          const left = 110 + overlapIndex * 20;
          const z = 10 + overlapIndex;

          return (
            <button
              key={event.id}
              onClick={() => onEventClick(event)}
              className={`absolute rounded-lg border-l-4 ${getEventColor(
                event.type,
                event.status
              )} border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer`}
              style={{
                top: `${top}px`,
                height: `${height}px`,
                left: `${left}px`,
                width: `${eventWidth}px`,
                zIndex: z,
              }}
            >
              <div className="h-full flex flex-col justify-center px-3 py-2 text-left bg-opacity-100">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${getEventIconColor(event.type)}`}
                  />
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                    {event.title}
                  </h4>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {formatCompactTime(event.startTime)} -{' '}
                  {formatCompactTime(event.endTime)}
                </p>
                <StatusBadge
                  status={event.status}
                  config={getStatusBadgeConfig(event.status)}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
