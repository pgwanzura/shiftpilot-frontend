import { CalendarEvent } from './utils/types';
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

interface EventLayout {
  event: CalendarEvent;
  column: number;
  totalColumns: number;
}

export function CalendarDayView({
  currentDate,
  selectedDate,
  events,
  filter,
  onNavigate,
  onToday,
  onEventClick,
}: CalendarDayViewProps) {
  const displayDate = currentDate;
  const dayEvents = getEventsForDate(events, displayDate, filter);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventLayouts = (): EventLayout[] => {
    if (dayEvents.length === 0) return [];

    const sortedEvents = [...dayEvents].sort((a, b) => {
      const aStart = parseInt(a.startTime.split(':')[0]);
      const bStart = parseInt(b.startTime.split(':')[0]);
      if (aStart !== bStart) return aStart - bStart;

      const aEnd = parseInt(a.endTime.split(':')[0]);
      const bEnd = parseInt(b.endTime.split(':')[0]);
      return bEnd - bStart - (aEnd - aStart);
    });

    const layouts: EventLayout[] = [];
    const columns: CalendarEvent[][] = [];

    sortedEvents.forEach((event) => {
      const eventStart = parseInt(event.startTime.split(':')[0]);
      const eventEnd = parseInt(event.endTime.split(':')[0]);

      const availableColumns: number[] = [];
      columns.forEach((columnEvents, columnIndex) => {
        const lastEventInColumn = columnEvents[columnEvents.length - 1];
        const lastEventEnd = parseInt(lastEventInColumn.endTime.split(':')[0]);

        if (lastEventEnd <= eventStart) {
          availableColumns.push(columnIndex);
        }
      });

      let columnIndex: number;

      if (availableColumns.length > 0) {
        columnIndex = availableColumns[0];
        columns[columnIndex].push(event);
      } else {
        columnIndex = columns.length;
        columns.push([event]);
      }

      layouts.push({
        event,
        column: columnIndex,
        totalColumns: columns.length,
      });
    });

    return layouts;
  };

  const formatTimeLabel = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

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

  const eventLayouts = getEventLayouts();
  const currentTimePosition = getCurrentTimePosition();
  const isToday = new Date().toDateString() === displayDate.toDateString();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col h-[600px]">
      <div className="px-6 py-4 bg-primary-50 dark:bg-primary-900/20 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {dayNames[displayDate.getDay()]}
              </h1>
              <p className="text-lg text-primary-500 dark:text-primary-400 font-medium">
                {monthNames[displayDate.getMonth()]} {displayDate.getDate()},{' '}
                {displayDate.getFullYear()}
              </p>
            </div>
            {isToday && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-primary-500 text-white border border-primary-300 dark:border-primary-700">
                Today
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-lg border border-primary-200 dark:border-primary-700 p-1">
              <button
                onClick={() => onNavigate('prev')}
                className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md transition-colors duration-200 group"
                title="Previous day"
              >
                <svg
                  className="w-4 h-4 text-primary-500 dark:text-primary-400 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors"
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
                className="px-3 py-2 text-sm font-bold text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md transition-colors duration-200"
                title="Go to today"
              >
                Today
              </button>

              <button
                onClick={() => onNavigate('next')}
                className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md transition-colors duration-200 group"
                title="Next day"
              >
                <svg
                  className="w-4 h-4 text-primary-500 dark:text-primary-400 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors"
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
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-primary-200 dark:border-primary-700">
          <div className="flex items-center space-x-6 text-sm">
            <span className="text-primary-500 dark:text-primary-400 font-medium">
              {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
            </span>
            {eventLayouts.length > 0 && (
              <span className="text-primary-500 dark:text-primary-500 font-medium">
                {Math.max(...eventLayouts.map((l) => l.totalColumns))}{' '}
                concurrent
              </span>
            )}
          </div>
          <div className="text-sm text-primary-500 dark:text-primary-400">
            All times in local timezone
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto relative bg-primary-50 dark:bg-primary-900/10">
        <div className="absolute inset-0">
          {hours.map((hour) => (
            <div
              key={hour}
              className="flex border-b border-primary-100 dark:border-primary-800 h-[80px] group hover:bg-white dark:hover:bg-gray-800 transition-colors duration-150"
            >
              <div className="w-24 p-4 border-r border-primary-200 dark:border-primary-700 text-sm text-primary-500 dark:text-primary-400 text-right font-bold flex items-start justify-end bg-white dark:bg-gray-900">
                <span className="bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded text-xs font-bold border border-primary-200 dark:border-primary-700">
                  {formatTimeLabel(hour)}
                </span>
              </div>
              <div className="flex-1 p-4 relative">
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-primary-400 dark:bg-primary-600 rounded-full opacity-60"></div>
              </div>
            </div>
          ))}
        </div>

        {isToday && (
          <div
            className="absolute left-24 right-0 h-0.5 bg-error-500 z-30 pointer-events-none"
            style={{ top: `${currentTimePosition}px` }}
          >
            <div className="absolute -left-2 -top-1.5">
              <div className="w-3 h-3 bg-error-500 rounded-full border-2 border-white dark:border-gray-900"></div>
            </div>
            <div className="absolute -right-2 -top-1.5 w-2 h-2 bg-error-500 rounded-full opacity-70"></div>
          </div>
        )}

        {dayEvents.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center max-w-sm mx-auto p-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 dark:bg-primary-800 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-primary-400 dark:text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                No events scheduled
              </h3>
              <p className="text-primary-500 dark:text-primary-400 text-sm mb-6 leading-relaxed">
                {displayDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <div className="w-16 h-1 bg-primary-200 dark:bg-primary-700 mx-auto rounded-full"></div>
            </div>
          </div>
        )}

        {eventLayouts.map(({ event, column, totalColumns }) => {
          const eventStartHour = parseInt(event.startTime.split(':')[0]);
          const eventEndHour = parseInt(event.endTime.split(':')[0]);
          const eventDuration = eventEndHour - eventStartHour;
          const topPosition = eventStartHour * 80;
          const height = eventDuration * 80;

          const columnWidth = 100 / totalColumns;
          const margin = 1.5;
          const width = `calc(${columnWidth}% - ${margin * 2}px)`;
          const left = `calc(96px + ${columnWidth * column}% + ${margin}px)`;

          const isCompact = height < 120;
          const isVeryCompact = height < 80;

          return (
            <button
              key={event.id}
              onClick={() => onEventClick(event)}
              className={`absolute rounded-xl border-l-4 cursor-pointer transition-all duration-200 hover:opacity-90 ${getEventColor(event.type, event.status)} border border-gray-200 dark:border-gray-700`}
              style={{
                top: `${topPosition}px`,
                height: `${height}px`,
                left: left,
                width: width,
                zIndex: 10,
              }}
            >
              <div
                className={`h-full flex flex-col ${isCompact ? 'p-3' : 'p-4'} ${isVeryCompact ? 'justify-center' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div
                      className={`${isVeryCompact ? 'w-2 h-2' : 'w-3 h-3'} rounded-full ${getEventIconColor(event.type)} flex-shrink-0`}
                    />
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-bold text-gray-900 dark:text-white truncate ${isVeryCompact ? 'text-xs' : 'text-sm'}`}
                      >
                        {event.title}
                      </h4>
                      {!isVeryCompact && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate font-medium">
                          {formatCompactTime(event.startTime)} -{' '}
                          {formatCompactTime(event.endTime)}
                        </p>
                      )}
                    </div>
                  </div>
                  {!isVeryCompact && (
                    <StatusBadge
                      status={event.status}
                      config={getStatusBadgeConfig(event.status)}
                    />
                  )}
                </div>

                {!isVeryCompact && event.location && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate mb-2 flex items-center font-medium">
                    <svg
                      className="w-3 h-3 mr-1.5 text-primary-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {event.location}
                  </p>
                )}

                {!isCompact && event.role && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate flex items-center font-medium">
                    <svg
                      className="w-3 h-3 mr-1.5 text-primary-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {event.role}
                  </p>
                )}

                {isVeryCompact && (
                  <div className="mt-1">
                    <StatusBadge
                      status={event.status}
                      config={getStatusBadgeConfig(event.status)}
                    />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-6 py-3 bg-primary-50 dark:bg-primary-900/20 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between text-xs text-primary-500 dark:text-primary-400 font-medium">
          <span>Click on events to view details</span>
          <span>Scroll to view all hours</span>
        </div>
      </div>
    </div>
  );
}
