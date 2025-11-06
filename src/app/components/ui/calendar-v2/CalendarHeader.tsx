import { Icon } from '@/app/components/ui';
import { getViewTitle } from './utils/calendarHelpers';

interface CalendarHeaderProps {
  currentDate: Date;
  selectedDate: Date | null;
  view: 'month' | 'week' | 'day';
  onNavigate: (direction: 'prev' | 'next') => void;
  onToday: () => void;
  onViewChange: (view: 'month' | 'week' | 'day') => void;
}

export function CalendarHeader({
  currentDate,
  selectedDate,
  view,
  onNavigate,
  onToday,
  onViewChange,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <div className="flex space-x-1">
          <button
            onClick={() => onNavigate('prev')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Icon
              name="chevronLeft"
              className="w-5 h-5 text-gray-600 dark:text-gray-400"
            />
          </button>
          <button
            onClick={onToday}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Icon
              name="calendar"
              className="w-5 h-5 text-gray-600 dark:text-gray-400"
            />
          </button>
          <button
            onClick={() => onNavigate('next')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Icon
              name="chevronRight"
              className="w-5 h-5 text-gray-600 dark:text-gray-400"
            />
          </button>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {getViewTitle(view, currentDate, selectedDate)}
        </h2>
      </div>

      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {(['month', 'week', 'day'] as const).map((viewType) => (
          <button
            key={viewType}
            onClick={() => onViewChange(viewType)}
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
  );
}
