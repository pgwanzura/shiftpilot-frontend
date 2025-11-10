import { CalendarEvent } from '@/types';

interface SelectedDateEventsProps {
  selectedDate: Date | null;
  selectedDateEvents: CalendarEvent[];
  selectedEvent: CalendarEvent | null;
  onEventClick: (event: CalendarEvent) => void;
  onNewShiftClick: () => void;
}

export function SelectedDateEvents({
  selectedDate,
  selectedDateEvents,
  selectedEvent,
  onEventClick,
  onNewShiftClick,
}: SelectedDateEventsProps) {
  if (!selectedDate) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Events for {selectedDate.toLocaleDateString()}
        </h2>
        <button
          onClick={onNewShiftClick}
          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Event
        </button>
      </div>

      <div className="space-y-3">
        {selectedDateEvents.map((event) => (
          <div
            key={event.id}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedEvent?.id === event.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onEventClick(event)}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-900">{event.title}</h3>
              <span className="text-sm text-gray-500 capitalize">
                {event.type.replace('_', ' ')}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {event.date.toLocaleTimeString()}
            </p>
            {event.description && (
              <p className="text-sm text-gray-500 mt-2">{event.description}</p>
            )}
          </div>
        ))}
        {selectedDateEvents.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No events for this date
          </p>
        )}
      </div>
    </div>
  );
}
