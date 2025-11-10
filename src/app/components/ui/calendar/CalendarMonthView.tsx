import { JSX } from 'react';
import { CalendarEvent } from '@/types';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getEventsForDate,
  getEventColor,
  getEventIcon,
  shortDayNames,
} from './utils/calendarHelpers';
import { Icon } from '@/app/components/ui';

interface CalendarMonthViewProps {
  currentDate: Date;
  selectedDate: Date | null;
  events: CalendarEvent[];
  filter: string;
  onDateSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export function CalendarMonthView({
  currentDate,
  selectedDate,
  events,
  filter,
  onDateSelect,
  onEventClick,
}: CalendarMonthViewProps) {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const today = new Date();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  const renderMonthView = () => {
    const days: JSX.Element[] = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-36 p-2 border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
        />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected =
        selectedDate && date.toDateString() === selectedDate.toDateString();
      const dayEvents = getEventsForDate(events, date, filter);
      const hasEvents = dayEvents.length > 0;

      days.push(
        <div
          key={day}
          onClick={() => onDateSelect(date)}
          className={`
            h-36 p-2 border border-gray-100 dark:border-gray-700 
            cursor-pointer transition-all duration-300 ease-in-out 
            group relative
            ${
              isToday
                ? 'bg-primary-50 dark:bg-primary-900/20'
                : 'bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/10'
            }
            ${
              isSelected
                ? '!border-2 !border-primary-500 bg-primary-50 dark:bg-primary-900/20 z-10'
                : ''
            }
          `}
        >
          <div className="flex justify-between items-start mb-2">
            <span
              className={`
                text-sm font-bold transition-all duration-300 ease-in-out
                ${
                  isToday
                    ? 'text-primary-500 dark:text-primary-400'
                    : isSelected
                      ? 'text-primary-500 dark:text-primary-400'
                      : date.getDay() === 0
                        ? 'text-red-500 dark:text-red-400'
                        : 'text-gray-700 dark:text-gray-300'
                }
              `}
            >
              {day}
            </span>
            {isToday && (
              <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded-full font-bold transition-all duration-300 ease-in-out">
                Today
              </span>
            )}
            {hasEvents && !isToday && (
              <div className="flex space-x-1 transition-all duration-300 ease-in-out">
                {[...new Set(dayEvents.map((e) => e.type))]
                  .slice(0, 2)
                  .map((type) => (
                    <div
                      key={type}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ease-in-out ${getEventColor(type, 'scheduled').split(' ')[0]}`}
                    />
                  ))}
              </div>
            )}
          </div>

          <div className="space-y-1 max-h-24 overflow-y-auto transition-all duration-300 ease-in-out">
            {dayEvents.slice(0, 4).map((event) => (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(event);
                }}
                className={`
                  text-xs px-2 py-1 rounded border cursor-pointer 
                  transition-all duration-300 ease-in-out
                  hover:opacity-90
                  ${getEventColor(event.type, event.status)}
                `}
              >
                <div className="flex items-center space-x-1 truncate">
                  <Icon
                    name={getEventIcon(event.type)}
                    className="w-3 h-3 flex-shrink-0 transition-transform duration-300 ease-in-out"
                  />
                  <span className="truncate font-medium">
                    {event.startTime} {event.role || event.title}
                  </span>
                </div>
              </div>
            ))}
            {dayEvents.length > 4 && (
              <div className="text-xs text-primary-500 dark:text-primary-400 px-2 font-medium transition-all duration-300 ease-in-out">
                +{dayEvents.length - 4} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-300 ease-in-out">
      <div className="grid grid-cols-7 bg-primary-50 dark:bg-primary-900/20 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out">
        {shortDayNames.map((day, index) => (
          <div
            key={day}
            className={`p-4 text-center text-sm font-bold transition-all duration-300 ease-in-out ${
              index === 0
                ? 'text-red-500 dark:text-red-400'
                : 'text-primary-500 dark:text-primary-400'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 transition-all duration-300 ease-in-out">
        {renderMonthView()}
      </div>
    </div>
  );
}
