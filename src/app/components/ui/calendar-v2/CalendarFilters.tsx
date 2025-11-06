import { Icon } from '@/app/components/ui';
import { FilterOption } from './utils/types';

interface CalendarFiltersProps {
  filter: string;
  onFilterChange: (filter: string) => void;
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
    key: 'shifts',
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
    key: 'placements',
    label: 'Placements',
    icon: 'briefcase',
    permissions: ['super_admin', 'agency_admin', 'employer_admin'],
  },
  {
    key: 'interviews',
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
    key: 'meetings',
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
    key: 'availabilities',
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
  return (
    <div className="flex items-center space-x-2">
      {filterOptions
        .filter((filterOption) => filterOption.permissions.includes(userRole))
        .map((filterOption) => (
          <button
            key={filterOption.key}
            onClick={() => onFilterChange(filterOption.key)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === filterOption.key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Icon name={filterOption.icon} className="w-4 h-4" />
            <span>{filterOption.label}</span>
          </button>
        ))}
    </div>
  );
}
