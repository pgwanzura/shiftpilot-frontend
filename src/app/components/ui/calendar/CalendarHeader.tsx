'use client';

import { JSX } from 'react';
import { Button, Icon } from '@/app/components/ui';
import { getViewTitle } from './utils/calendarHelpers';
import { IconName } from '@/config';

type CalendarView = 'month' | 'week' | 'day';

interface CalendarHeaderProps {
  currentDate: Date;
  selectedDate: Date | null;
  view: CalendarView;
  onNavigate: (direction: 'prev' | 'next') => void;
  onToday: () => void;
  onViewChange: (view: CalendarView) => void;
}

export function CalendarHeader({
  currentDate,
  selectedDate,
  view,
  onNavigate,
  onToday,
  onViewChange,
}: CalendarHeaderProps): JSX.Element {
  const viewConfig: Record<CalendarView, { icon: IconName; label: string }> = {
    month: { icon: 'calendar', label: 'Month' },
    week: { icon: 'calendarWeek', label: 'Week' },
    day: { icon: 'calendarDay', label: 'Day' },
  };

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
          <Button
            variant="ghost"
            onClick={onToday}
            className="p-2 px-3 flex items-center gap-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
          >
            <Icon
              name="calendar"
              className="w-5 h-5 text-primary-500 dark:text-primary-400"
            />
            <span className="text-sm font-medium text-primary-600 dark:text-primary-300">
              Today
            </span>
          </Button>
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

      <div className="flex bg-primary-50 dark:bg-primary-900/20 rounded-lg p-1 border border-primary-100 dark:border-primary-800 gap-1">
        {(['month', 'week', 'day'] as const).map((viewType) => (
          <Button
            key={viewType}
            size="sm"
            onClick={() => onViewChange(viewType)}
            variant={view === viewType ? 'primary' : 'ghost'}
            className="flex-1 flex items-center justify-center space-x-2"
            icon={<Icon name={viewConfig[viewType].icon} className="w-4 h-4" />}
          >
            <span className="capitalize">{viewConfig[viewType].label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
