import { CalendarEvent } from './utils/types';
import {
  getWeekDates,
  getEventsForDate,
  getEventColor,
  shortDayNames,
} from './utils/calendarHelpers';

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

  const formatTimeLabel = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const getHeaderButtonClass = (
    isToday: boolean,
    isSelected: boolean | null
  ): string => {
    if (isToday) return 'bg-primary-500 text-white';
    if (isSelected)
      return 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-700';
    return 'bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/10';
  };

  const getDayNameClass = (isToday: boolean): string => {
    return isToday
      ? 'text-white'
      : 'text-primary-500 dark:text-primary-400 group-hover:text-primary-600 dark:group-hover:text-primary-300';
  };

  const getDateNumberClass = (isToday: boolean): string => {
    return isToday ? 'text-white' : 'text-gray-900 dark:text-white font-bold';
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto relative">
        <div className="sticky top-0 z-10 grid grid-cols-8 bg-primary-50 dark:bg-primary-900/20 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="p-3 border-r border-gray-200 dark:border-gray-700">
            <span className="text-xs font-bold text-primary-500 dark:text-primary-400 uppercase tracking-wide">
              Time
            </span>
          </div>
          {weekDates.map((date, index) => {
            const isToday = date.toDateString() === today.toDateString();
            const isSelected =
              selectedDate &&
              date.toDateString() === selectedDate.toDateString();

            return (
              <button
                key={index}
                onClick={() => onDateSelect(date)}
                className={`p-3 border-r border-gray-200 dark:border-gray-700 text-center transition-all duration-200 group ${getHeaderButtonClass(isToday, isSelected)}`}
              >
                <div
                  className={`text-xs font-bold ${getDayNameClass(isToday)}`}
                >
                  {shortDayNames[date.getDay()]}
                </div>
                <div
                  className={`text-lg font-bold ${getDateNumberClass(isToday)}`}
                >
                  {date.getDate()}
                </div>
              </button>
            );
          })}
        </div>

        <div className="relative" style={{ height: '1152px' }}>
          <div className="absolute inset-0">
            {hours.map((hour) => (
              <div
                key={hour}
                className="grid grid-cols-8 group hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-colors"
                style={{ height: '48px' }}
              >
                <div className="p-2 border-r border-gray-200 dark:border-gray-700 text-xs text-primary-500 dark:text-primary-400 text-right pr-3 flex items-center justify-end">
                  <span className="bg-white dark:bg-gray-900 px-1.5 py-0.5 rounded text-xs font-bold border border-primary-200 dark:border-primary-700">
                    {formatTimeLabel(hour)}
                  </span>
                </div>

                {weekDates.map((date, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="border-r border-gray-200 dark:border-gray-700 relative p-0.5"
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-primary-100 dark:bg-primary-800 group-hover:bg-primary-200 dark:group-hover:bg-primary-700 transition-colors" />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {weekDates.map((date, dayIndex) => {
            const dayEvents = getEventsForDate(events, date, filter);

            return dayEvents.map((event) => {
              const eventStartHour = parseInt(event.startTime.split(':')[0]);
              const eventEndHour = parseInt(event.endTime.split(':')[0]);
              const eventDuration = eventEndHour - eventStartHour;
              const topPosition = eventStartHour * 48;
              const height = eventDuration * 48;

              return (
                <button
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className={`absolute rounded-lg border-l-4 p-2 cursor-pointer transition-all duration-200 hover:opacity-90 ${getEventColor(event.type, event.status)}`}
                  style={{
                    top: `${topPosition}px`,
                    height: `${height}px`,
                    left: `${(dayIndex + 1) * 12.5}%`,
                    width: 'calc(12.5% - 8px)',
                    zIndex: 5,
                  }}
                >
                  <div className="space-y-0.5 h-full flex flex-col justify-center">
                    <div className="font-bold text-xs truncate leading-tight text-gray-900 dark:text-white">
                      {event.title}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 truncate leading-tight">
                      {event.startTime} - {event.endTime}
                    </div>
                    {eventDuration <= 8 && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                        <span className="text-xs capitalize text-gray-700 dark:text-gray-300 font-medium">
                          {event.status}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
}
