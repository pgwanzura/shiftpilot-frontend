import { CalendarEvent } from './utils/types';
import {
  getWeekDates,
  getEventsForDate,
  getEventColor,
  shortDayNames,
} from './utils/calendarHelpers';
import { Icon } from '@/app/components/ui';

interface CalendarWeekViewProps {
  currentDate: Date;
  selectedDate: Date | null;
  events: CalendarEvent[];
  filter: string;
  onDateSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export function CalendarWeekView({
  currentDate,
  selectedDate,
  events,
  filter,
  onDateSelect,
  onEventClick,
}: CalendarWeekViewProps) {
  const today = new Date();
  const weekDates = getWeekDates(currentDate);
  const hours = Array.from({ length: 24 }, (_, i) => i);

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
            selectedDate && date.toDateString() === selectedDate.toDateString();
          return (
            <div
              key={index}
              onClick={() => onDateSelect(date)}
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
              const dayEvents = getEventsForDate(events, date, filter);
              const hourEvents = dayEvents.filter((event) => {
                const eventStartHour = parseInt(event.startTime.split(':')[0]);
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
                        onClick={() => onEventClick(event)}
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
}
