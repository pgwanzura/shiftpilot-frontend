// hooks/usePlacements.ts
import { useApiQuery } from './useApiQuery';
import { useApiMutation } from './useApiMutation';
import { useQueryClient } from '@tanstack/react-query';
import { PaginatedResponse, PlacementFilters, Placement } from '@/types';

export interface PlacementStatsData {
  total: number;
  active: number;
  draft: number;
  filled: number;
  completed: number;
  responses: number;
}

export interface CreatePlacementData {
  title: string;
  description: string;
  employer_id: number;
  location_id: number;
  experience_level: string;
  budget_type: string;
  budget_amount: number;
  currency: string;
  start_date: string;
  end_date?: string;
  response_deadline: string;
  location_instructions?: string;
}

export interface UpdatePlacementData {
  title?: string;
  description?: string;
  status?: string;
  experience_level?: string;
  budget_type?: string;
  budget_amount?: number;
  currency?: string;
  start_date?: string;
  end_date?: string;
  response_deadline?: string;
  location_instructions?: string;
}

export function usePlacements(filters: PlacementFilters) {
  const params = {
    status: filters.status,
    search: filters.search,
    experience_level: filters.experience_level,
    budget_type: filters.budget_type,
    location_id: filters.location_id,
    start_date_from: filters.start_date_from,
    start_date_to: filters.start_date_to,
    sort_by: filters.sort_by,
    sort_direction: filters.sort_direction,
    page: filters.page,
    per_page: filters.per_page,
  };

  return useApiQuery<PaginatedResponse<Placement>>({
    queryKey: ['placements', JSON.stringify(filters)],
    endpoint: '/agency/placements',
    params,
  });
}

export function usePlacementStats() {
  return useApiQuery<PlacementStatsData>({
    queryKey: ['placement-stats'],
    endpoint: '/agency/placements/stats/detailed',
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}

export function useCreatePlacement() {
  const queryClient = useQueryClient();

  return useApiMutation<Placement, CreatePlacementData>({
    endpoint: '/agency/placements',
    method: 'POST',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['placements'] });
      queryClient.invalidateQueries({ queryKey: ['placement-stats'] });
    },
  });
}

export function useUpdatePlacement() {
  const queryClient = useQueryClient();

  return useApiMutation<Placement, { id: number; data: UpdatePlacementData }>({
    endpoint: '/agency/placements',
    method: 'PUT',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['placements'] });
      queryClient.invalidateQueries({ queryKey: ['placement-stats'] });
      queryClient.invalidateQueries({
        queryKey: ['placement', variables.id.toString()],
      });
    },
  });
}

export function useDeletePlacement() {
  const queryClient = useQueryClient();

  return useApiMutation<void, number>({
    endpoint: '/agency/placements',
    method: 'DELETE',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['placements'] });
      queryClient.invalidateQueries({ queryKey: ['placement-stats'] });
    },
  });
}

export function usePlacement(id: number) {
  return useApiQuery<Placement>({
    queryKey: ['placement', id.toString()],
    endpoint: `/agency/placements/${id}`,
  });
}

export function useUpdatePlacementStatus() {
  const queryClient = useQueryClient();

  return useApiMutation<Placement, { id: number; status: string }>({
    endpoint: '/agency/placements',
    method: 'PATCH',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['placements'] });
      queryClient.invalidateQueries({ queryKey: ['placement-stats'] });
      queryClient.invalidateQueries({
        queryKey: ['placement', variables.id.toString()],
      });
    },
  });
}
