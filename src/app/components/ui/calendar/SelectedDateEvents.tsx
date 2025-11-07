import { CalendarEvent } from './utils/types';
import {
  getEventColor,
  getEventIcon,
  getStatusBadgeConfig,
} from './utils/calendarHelpers';
import { Icon } from '@/app/components/ui';
import { StatusBadge } from '@/app/components/ui/StatusBadge';

interface SelectedDateEventsProps {
  selectedDate: Date | null;
  selectedDateEvents: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onNewShiftClick: () => void;
}

export function SelectedDateEvents({
  selectedDate,
  selectedDateEvents,
  onEventClick,
  onNewShiftClick,
}: SelectedDateEventsProps) {
  return (
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
                onClick={() => onEventClick(event)}
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
                          <StatusBadge
                            status={event.status}
                            config={getStatusBadgeConfig(event.status)}
                            size="sm"
                          />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {event.startTime} - {event.endTime} • {event.location}
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
                onClick={onNewShiftClick}
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
  );
}
