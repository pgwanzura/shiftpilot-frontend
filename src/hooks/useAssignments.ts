import { useApiQuery } from './useApiQuery';
import { useApiMutation } from './useApiMutation';
import { useQueryClient } from '@tanstack/react-query';
import {
  Assignment,
  AssignmentFilters,
  AssignmentStats,
  AssignmentStatsResponse,
  CreateAssignmentData,
  UpdateAssignmentData,
  StatusChangeData,
  PaginatedResponse,
} from '@/types';

export function useAssignments(filters: Partial<AssignmentFilters> = {}) {
  const params = {
    page: filters.page || 1,
    per_page: filters.per_page || 20,
    status: filters.status === 'all' ? undefined : filters.status,
    assignment_type:
      filters.assignment_type === 'all' ? undefined : filters.assignment_type,
    search: filters.search,
    role: filters.role,
    location_id: filters.location_id,
    start_date_from: filters.start_date_from,
    start_date_to: filters.start_date_to,
    end_date_from: filters.end_date_from,
    end_date_to: filters.end_date_to,
    employer_id: filters.employer_id,
    agency_employee_id: filters.agency_employee_id,
    sort_by: filters.sort_by,
    sort_direction: filters.sort_direction,
  };

  return useApiQuery<PaginatedResponse<Assignment>>({
    queryKey: ['assignments', JSON.stringify(params)],
    endpoint: '/assignments',
    params,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAssignmentStats() {
  return useApiQuery<AssignmentStatsResponse>({
    queryKey: ['assignment-stats'],
    endpoint: '/assignments/agency/statistics',
    staleTime: 1000 * 60 * 2,
  });
}

export function useAssignment(id: number) {
  return useApiQuery<Assignment>({
    queryKey: ['assignment', id.toString()],
    endpoint: `/assignments/${id}`,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useApiMutation<Assignment, CreateAssignmentData>({
    endpoint: '/assignments',
    method: 'POST',
    onSuccess: (newAssignment) => {
      // Invalidate assignments list
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment-stats'] });

      // Add the new assignment to the cache
      queryClient.setQueryData(
        ['assignment', newAssignment.id.toString()],
        newAssignment
      );
    },
  });
}

export function useUpdateAssignment() {
  const queryClient = useQueryClient();

  return useApiMutation<Assignment, { id: number; data: UpdateAssignmentData }>(
    {
      endpoint: '/assignments',
      method: 'PUT',
      onSuccess: (updatedAssignment, variables) => {
        queryClient.setQueryData(
          ['assignment', variables.id.toString()],
          updatedAssignment
        );

        queryClient.invalidateQueries({ queryKey: ['assignments'] });
        queryClient.invalidateQueries({ queryKey: ['assignment-stats'] });
      },
    }
  );
}

export function useChangeAssignmentStatus() {
  const queryClient = useQueryClient();

  return useApiMutation<Assignment, { id: number; data: StatusChangeData }>({
    endpoint: '/assignments',
    method: 'PATCH',
    onSuccess: (updatedAssignment, variables) => {
      queryClient.setQueryData(
        ['assignment', variables.id.toString()],
        updatedAssignment
      );

      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment-stats'] });
    },
  });
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useApiMutation<void, number>({
    endpoint: '/assignments',
    method: 'DELETE',
    onSuccess: (_, assignmentId) => {
      queryClient.removeQueries({
        queryKey: ['assignment', assignmentId.toString()],
      });

      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment-stats'] });
    },
  });
}

export function useCompleteAssignment() {
  const changeStatus = useChangeAssignmentStatus();

  return {
    ...changeStatus,
    mutate: (assignmentId: number, reason?: string) =>
      changeStatus.mutate({
        id: assignmentId,
        data: { status: 'completed', reason: reason ?? null },
      }),
  };
}

export function usePauseAssignment() {
  const changeStatus = useChangeAssignmentStatus();

  return {
    ...changeStatus,
    mutate: (assignmentId: number, reason?: string) =>
      changeStatus.mutate({
        id: assignmentId,
        data: { status: 'paused', reason: reason ?? null },
      }),
  };
}

export function useReactivateAssignment() {
  const changeStatus = useChangeAssignmentStatus();

  return {
    ...changeStatus,
    mutate: (assignmentId: number) =>
      changeStatus.mutate({
        id: assignmentId,
        data: { status: 'active', reason: null },
      }),
  };
}

export function useCancelAssignment() {
  const changeStatus = useChangeAssignmentStatus();

  return {
    ...changeStatus,
    mutate: (assignmentId: number, reason?: string) =>
      changeStatus.mutate({
        id: assignmentId,
        data: { status: 'cancelled', reason: reason ?? null },
      }),
  };
}
