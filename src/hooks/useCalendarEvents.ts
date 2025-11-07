import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api/apiClient';
import { CalendarEventsParams } from '@/types';

export const useCalendarEvents = (
  params: CalendarEventsParams,
  authToken: string
) => {
  const apiClient = new ApiClient(undefined, authToken);
  return useQuery({
    queryKey: ['calendar-events', params],
    queryFn: () => apiClient.getCalendarEvents(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
