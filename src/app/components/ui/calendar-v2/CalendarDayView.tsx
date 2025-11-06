import { CalendarEvent } from './utils/types';
import {
  getEventsForDate,
  getEventColor,
  getEventIcon,
  dayNames,
  monthNames,
  getStatusBadge,
} from './utils/calendarHelpers';
import { Icon } from '@/app/components/ui';

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
  selectedDate,
  events,
  filter,
  onNavigate,
  onToday,
  onEventClick,
}: CalendarDayViewProps) {
  const displayDate = selectedDate || currentDate;
  const dayEvents = getEventsForDate(events, displayDate, filter);
  const hours = Array.from({ length: 24 }, (_, i) => i);

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
              onClick={() => onNavigate('prev')}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Icon
                name="chevronLeft"
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
              />
            </button>
            <button
              onClick={onToday}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              Today
            </button>
            <button
              onClick={() => onNavigate('next')}
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
                      onClick={() => onEventClick(event)}
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
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(event.status).color}`}
                        >
                          {getStatusBadge(event.status).label}
                        </span>
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
}
