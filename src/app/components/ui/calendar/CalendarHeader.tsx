'use client';

import { Button, Icon } from '@/app/components/ui';
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
          <Button
            variant="ghost"
            onClick={() => onNavigate('prev')}
            className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
          >
            <Icon
              name="chevronLeft"
              className="w-5 h-5 text-primary-500 dark:text-primary-400"
            />
          </Button>
          <button
            onClick={onToday}
            className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
          >
            <Icon
              name="calendar"
              className="w-5 h-5 text-primary-500 dark:text-primary-400"
            />
          </button>
          <Button
            variant="ghost"
            onClick={() => onNavigate('next')}
            className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
          >
            <Icon
              name="chevronRight"
              className="w-5 h-5 text-primary-500 dark:text-primary-400"
            />
          </Button>
        </div>
        <h2 className="text-2xl font-bold text-primary-500 dark:text-primary-400">
          {getViewTitle(view, currentDate, selectedDate)}
        </h2>
      </div>

      <div className="flex bg-primary-50 dark:bg-primary-900/20 rounded-lg p-1 border border-primary-100 dark:border-primary-800">
        {(['month', 'week', 'day'] as const).map((viewType) => (
          <Button
            key={viewType}
            onClick={() => onViewChange(viewType)}
            variant={view === viewType ? 'primary' : 'ghost'}
            className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
              view === viewType
                ? 'bg-white dark:bg-gray-800 text-primary-500 dark:text-primary-400 border border-primary-200 dark:border-primary-700'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
            }`}
          >
            {viewType}
          </Button>
        ))}
      </div>
    </div>
  );
}
