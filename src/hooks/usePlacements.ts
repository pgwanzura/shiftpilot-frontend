import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api/apiClient';

export interface PlacementFilters {
  status?: string;
  search?: string;
  experience_level?: string;
  budget_type?: string;
  location_id?: number;
  start_date_from?: string;
  start_date_to?: string;
  sort_by?: string;
  sort_direction?: string;
  page?: number;
  per_page?: number;
}

export function usePlacements(
  filters: PlacementFilters,
  authToken: string | null
) {
  const apiClient = new ApiClient(undefined, authToken);

  return useQuery({
    queryKey: ['placements', filters],
    queryFn: () => apiClient.getAgencyPlacements(filters),
    staleTime: 1000 * 60 * 5, 
    placeholderData: (previousData) => previousData,
    retry: 2,
    retryDelay: 1000,
    enabled: !!authToken,
  });
}

export function usePlacementStats(authToken: string | null) {
  const apiClient = new ApiClient(undefined, authToken);

  return useQuery({
    queryKey: ['placement-stats'],
    queryFn: () => apiClient.getAgencyPlacementStats(),
    staleTime: 1000 * 60 * 2,
    placeholderData: (previousData) => previousData,
    retry: 1,
    enabled: !!authToken,
  });
}
