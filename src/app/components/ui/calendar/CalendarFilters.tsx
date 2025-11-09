'use client';

import React from 'react';
import { Button, Icon } from '@/app/components/ui';
import { EventFilter, FilterOption } from './utils/types';

interface CalendarFiltersProps {
  filter: EventFilter;
  onFilterChange: (filter: EventFilter) => void;
  userRole: string;
  eventCounts?: Record<string, number>;
}

const filterOptions: FilterOption[] = [
  {
    key: 'all',
    label: 'All',
    icon: 'grid',
    permissions: [
      'super_admin',
      'agency_admin',
      'agent',
      'employer_admin',
      'contact',
      'employee',
    ],
  },
  {
    key: 'shift',
    label: 'Shifts',
    icon: 'clock',
    permissions: [
      'super_admin',
      'agency_admin',
      'agent',
      'employer_admin',
      'contact',
      'employee',
    ],
  },
  {
    key: 'placement',
    label: 'Placements',
    icon: 'briefcase',
    permissions: ['super_admin', 'agency_admin', 'employer_admin'],
  },
  {
    key: 'interview',
    label: 'Interviews',
    icon: 'userCheck',
    permissions: ['super_admin', 'agency_admin', 'agent', 'employer_admin'],
  },
  {
    key: 'time_off',
    label: 'Time Off',
    icon: 'umbrella',
    permissions: ['super_admin', 'agency_admin', 'agent', 'employee'],
  },
  {
    key: 'meeting',
    label: 'Meetings',
    icon: 'users',
    permissions: ['super_admin', 'agency_admin', 'employer_admin'],
  },
  {
    key: 'training',
    label: 'Training',
    icon: 'bookOpen',
    permissions: ['super_admin', 'agency_admin', 'employer_admin', 'employee'],
  },
  {
    key: 'availability',
    label: 'Availabilities',
    icon: 'calendar',
    permissions: ['super_admin', 'agency_admin', 'agent'],
  },
];

export function CalendarFilters({
  filter,
  onFilterChange,
  userRole,
  eventCounts,
}: CalendarFiltersProps) {
  const handleFilterChange = (filterKey: EventFilter) => {
    onFilterChange(filterKey);
  };

  const getEventCount = (filterKey: string): number => {
    if (!eventCounts) return 0;

    if (filterKey === 'all') {
      const values = Object.values(eventCounts);
      return values.reduce((sum: number, count: number) => sum + count, 0);
    }
    return eventCounts[filterKey] || 0;
  };

  return (
    <div className="flex flex-wrap gap-3 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
      {filterOptions
        .filter((option: FilterOption) => option.permissions.includes(userRole))
        .map((option: FilterOption) => {
          const count = getEventCount(option.key);
          const isActive = filter === option.key;

          return (
            <Button
              key={option.key}
              onClick={() => handleFilterChange(option.key)}
              variant={isActive ? 'primary' : 'primary-outline'}
              size="sm"
              icon={option.icon}
              iconPosition="left"
              className="flex items-center space-x-2"
            >
              <span className="font-medium">{option.label}</span>
              <span
                className={`inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full text-xs font-semibold ${
                  isActive
                    ? 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {count > 99 ? '99+' : count}
              </span>
            </Button>
          );
        })}
    </div>
  );
}
