import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api/apiClient';
import { CalendarEventsParams } from '@/types';
import { AuthClient } from '@/lib/api/authClient';

export const useCalendarEvents = (
  params: CalendarEventsParams,
  authToken: string
) => {
  const authClient = new AuthClient();
  console.log(authToken);
  const apiClient = new ApiClient(authClient, undefined, authToken);

  return useQuery({
    queryKey: ['calendar-events', params],
    queryFn: () => apiClient.getCalendarEvents(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
