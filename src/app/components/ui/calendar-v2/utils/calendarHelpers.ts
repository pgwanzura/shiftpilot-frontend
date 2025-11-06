import { IconName } from '@/config';
import { CalendarEvent } from './types';

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
export const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

export const getWeekDates = (startDate: Date): Date[] => {
  const dates: Date[] = [];
  const start = new Date(startDate);
  start.setDate(start.getDate() - start.getDay());

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(date);
  }
  return dates;
};

export const getEventsForDate = (
  events: CalendarEvent[],
  date: Date,
  filter: string
): CalendarEvent[] => {
  return events.filter(
    (event) =>
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear() &&
      (filter === 'all' || event.type === filter)
  );
};

export const getEventColor = (type: string, status: string): string => {
  const colors = {
    shift: {
      scheduled:
        'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      assigned:
        'bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
      completed:
        'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800',
      cancelled:
        'bg-red-500/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    },
    placement:
      'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    interview:
      'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    meeting:
      'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    training:
      'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    time_off:
      'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
  };

  if (type === 'shift') {
    return (
      colors.shift[status as keyof typeof colors.shift] ||
      colors.shift.scheduled
    );
  }

  return (
    colors[type as keyof Omit<typeof colors, 'shift'>] ||
    'bg-gray-500/10 text-gray-700 dark:text-gray-300'
  );
};

export const getEventIcon = (type: string): IconName => {
  const icons: Record<string, IconName> = {
    shift: 'clock' as IconName,
    placement: 'briefcase' as IconName,
    interview: 'userCheck' as IconName,
    meeting: 'users' as IconName,
    training: 'bookOpen' as IconName,
    time_off: 'umbrella' as IconName,
  };

  return icons[type] || ('calendar' as IconName);
};

export const getStatusBadge = (
  status: string
): { color: string; label: string } => {
  const statusConfig = {
    scheduled: {
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      label: 'Scheduled',
    },
    assigned: {
      color:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      label: 'Assigned',
    },
    completed: {
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      label: 'Completed',
    },
    cancelled: {
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      label: 'Cancelled',
    },
    pending: {
      color:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      label: 'Pending',
    },
  };

  return (
    statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled
  );
};

export const getViewTitle = (
  view: string,
  currentDate: Date,
  selectedDate: Date | null
): string => {
  if (view === 'month') {
    return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  } else if (view === 'week') {
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return `${weekStart.getDate()} ${monthNames[weekStart.getMonth()]} - ${weekEnd.getDate()} ${monthNames[weekEnd.getMonth()]} ${currentDate.getFullYear()}`;
  } else {
    const displayDate = selectedDate || currentDate;
    return `${dayNames[displayDate.getDay()]}, ${monthNames[displayDate.getMonth()]} ${displayDate.getDate()}, ${displayDate.getFullYear()}`;
  }
};
