'use client';

import React from 'react';
import { Icon } from '@/app/components/ui';
import { EventFilter, FilterOption } from './utils/types';

interface CalendarFiltersProps {
  filter: EventFilter;
  onFilterChange: (filter: EventFilter) => void;
  userRole: string;
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
}: CalendarFiltersProps) {
  const handleFilterChange = (filterKey: EventFilter) => {
    onFilterChange(filterKey);
  };

  return (
    <div className="flex flex-wrap gap-3 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
      {filterOptions
        .filter((option) => option.permissions.includes(userRole))
        .map((option) => (
          <button
            key={option.key}
            onClick={() => handleFilterChange(option.key)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
              filter === option.key
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <Icon
              name={option.icon}
              className={`w-4 h-4 transition-colors ${
                filter === option.key
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-500'
              }`}
            />
            <span className="font-medium">{option.label}</span>
          </button>
        ))}
    </div>
  );
}
