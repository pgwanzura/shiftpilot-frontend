import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api/apiClient';

export function usePlacements(filters: any, authToken: string | null) {
  const apiClient = new ApiClient(undefined, authToken);
  return useQuery({
    queryKey: ['placements', filters],
    queryFn: () => apiClient.getAgencyPlacements(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
}
