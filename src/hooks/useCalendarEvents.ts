import { CalendarEvent, CalendarEventsParams } from '@/types';
import { useApiQuery } from './useApiQuery';

export function useCalendarEvents(params: CalendarEventsParams) {
  return useApiQuery<CalendarEvent[]>({
    queryKey: ['calendar-events', JSON.stringify(params)],
    endpoint: '/calendar/events',
    params,
  });
}
