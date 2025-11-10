import { CalendarEvent } from '@/types';
import {
  getEventColor,
  getEventIcon,
  getStatusBadgeConfig,
} from './utils/calendarHelpers';
import { Icon } from '@/app/components/ui';
import { StatusBadge } from '@/app/components/ui/StatusBadge';

interface CalendarSidebarProps {
  upcomingEvents: CalendarEvent[];
  selectedDate: Date | null;
  selectedEvent: CalendarEvent | null;
  onDateSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onNewShiftClick: () => void;
  onClearSelection: () => void;
}

export function CalendarSidebar({
  upcomingEvents,
  selectedEvent,
  onDateSelect,
  onEventClick,
  onNewShiftClick,
  onClearSelection,
}: CalendarSidebarProps) {
  return (
    <div className="space-y-6">
      {selectedEvent && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Selected Event
            </h3>
            <button
              onClick={onClearSelection}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Icon name="x" className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 border border-primary-200 dark:border-primary-700 rounded-lg bg-primary-50 dark:bg-primary-900/10">
            <div className="flex items-start space-x-3">
              <div
                className={`p-2 rounded-lg ${getEventColor(selectedEvent.type, selectedEvent.status).split(' ')[0]}`}
              >
                <Icon
                  name={getEventIcon(selectedEvent.type)}
                  className="w-4 h-4"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 dark:text-white truncate text-sm mb-1">
                  {selectedEvent.title}
                </p>
                <p className="text-xs text-primary-500 dark:text-primary-400 mb-1">
                  {selectedEvent.date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedEvent.startTime} • {selectedEvent.location}
                </p>
                {selectedEvent.role && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {selectedEvent.role}
                  </p>
                )}
                <div className="mt-2">
                  <StatusBadge
                    status={selectedEvent.status}
                    config={getStatusBadgeConfig(selectedEvent.status)}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Upcoming Events
          </h3>
          <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {upcomingEvents.length}
          </span>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => {
                onDateSelect(event.date);
                onEventClick(event);
              }}
              className={`p-4 border rounded-lg transition-colors cursor-pointer group ${
                selectedEvent?.id === event.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 dark:border-primary-700'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900/10'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-lg ${getEventColor(event.type, event.status).split(' ')[0]} group-hover:opacity-80`}
                >
                  <Icon name={getEventIcon(event.type)} className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white truncate text-sm mb-1">
                    {event.title}
                  </p>
                  <p className="text-xs text-primary-500 dark:text-primary-400 mb-1">
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
                  <div className="mt-2">
                    <StatusBadge
                      status={event.status}
                      config={getStatusBadgeConfig(event.status)}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <button
            onClick={onNewShiftClick}
            className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-lg transition-colors flex items-center space-x-3"
          >
            <Icon name="plus" className="w-4 h-4 text-primary-500" />
            <span>Create New Shift</span>
          </button>
          <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-lg transition-colors flex items-center space-x-3">
            <Icon name="download" className="w-4 h-4 text-gray-400" />
            <span>Export Schedule</span>
          </button>
          <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-lg transition-colors flex items-center space-x-3">
            <Icon name="users" className="w-4 h-4 text-gray-400" />
            <span>Manage Availability</span>
          </button>
          <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-lg transition-colors flex items-center space-x-3">
            <Icon name="settings" className="w-4 h-4 text-gray-400" />
            <span>Calendar Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
