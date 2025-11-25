import { useQueryClient } from '@tanstack/react-query';
import { useApiQuery } from './useApiQuery';
import { useApiMutation } from './useApiMutation';
import {
  Assignment,
  AssignmentFilters,
  AssignmentStatsResponse,
  CreateAssignmentData,
  UpdateAssignmentData,
  StatusChangeData,
  PaginatedResponse,
  AssignmentStatus,
  AssignmentType,
} from '@/types';

interface AssignmentQueryParams extends Record<string, unknown> {
  page: number;
  per_page: number;
  status?: AssignmentStatus;
  assignment_type?: AssignmentType;
  search?: string;
  role?: string;
  location_id?: number;
  start_date_from?: string;
  start_date_to?: string;
  end_date_from?: string;
  end_date_to?: string;
  employer_id?: number;
  agency_employee_id?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}

const ASSIGNMENTS_STALE_TIME = 300_000;
const ASSIGNMENT_STATS_STALE_TIME = 120_000;
const SINGLE_ASSIGNMENT_STALE_TIME = 600_000;

const assignmentKeys = {
  all: ['assignments'] as const,
  lists: () => [...assignmentKeys.all, 'list'] as const,
  list: (filters: AssignmentQueryParams) =>
    [...assignmentKeys.lists(), { ...filters }] as const,
  details: () => [...assignmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...assignmentKeys.details(), id.toString()] as const,
  stats: ['assignment-stats'] as const,
};

function buildAssignmentParams(
  filters: Partial<AssignmentFilters>
): AssignmentQueryParams {
  const status = filters.status === 'all' ? undefined : filters.status;
  const assignment_type =
    filters.assignment_type === 'all'
      ? undefined
      : (filters.assignment_type as AssignmentType);

  return {
    page: filters.page ?? 1,
    per_page: filters.per_page ?? 20,
    status,
    assignment_type,
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
}

export function useAssignments(filters: Partial<AssignmentFilters> = {}) {
  const params = buildAssignmentParams(filters);
  const queryKey = [...assignmentKeys.list(params)] as string[];

  return useApiQuery<PaginatedResponse<Assignment>>({
    queryKey,
    endpoint: '/assignments',
    params,
    staleTime: ASSIGNMENTS_STALE_TIME,
  });
}

export function useAssignmentStats() {
  const queryKey = [...assignmentKeys.stats] as string[];

  return useApiQuery<AssignmentStatsResponse>({
    queryKey,
    endpoint: '/assignments/agency/statistics',
    staleTime: ASSIGNMENT_STATS_STALE_TIME,
  });
}

export function useAssignment(id: number) {
  const queryKey = [...assignmentKeys.detail(id)] as string[];

  return useApiQuery<Assignment>({
    queryKey,
    endpoint: `/assignments/${id}`,
    staleTime: SINGLE_ASSIGNMENT_STALE_TIME,
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useApiMutation<Assignment, CreateAssignmentData>({
    endpoint: '/assignments',
    method: 'POST',
    onSuccess: (newAssignment) => {
      queryClient.setQueryData(
        assignmentKeys.detail(newAssignment.id),
        newAssignment
      );
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.stats });
    },
  });
}

export function useUpdateAssignment() {
  const queryClient = useQueryClient();

  return useApiMutation<Assignment, { id: number; data: UpdateAssignmentData }>(
    {
      endpoint: '/assignments',
      method: 'PUT',
      onSuccess: (updated, { id }) => {
        queryClient.setQueryData(assignmentKeys.detail(id), updated);
        queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
        queryClient.invalidateQueries({ queryKey: assignmentKeys.stats });
      },
    }
  );
}

export function useAssignmentActions() {
  const queryClient = useQueryClient();

  const changeStatus = useApiMutation<
    Assignment,
    { id: number; data: StatusChangeData }
  >({
    endpoint: '/assignments',
    method: 'PATCH',
    onSuccess: (updated, { id }) => {
      queryClient.setQueryData(assignmentKeys.detail(id), updated);
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.stats });
    },
  });

  return {
    changeStatus: (
      id: number,
      status: AssignmentStatus,
      reason?: string | null
    ) => changeStatus.mutate({ id, data: { status, reason: reason ?? null } }),
    pause: (id: number, reason?: string) =>
      changeStatus.mutate({
        id,
        data: { status: 'paused', reason: reason ?? null },
      }),
    complete: (id: number, reason?: string) =>
      changeStatus.mutate({
        id,
        data: { status: 'completed', reason: reason ?? null },
      }),
    reactivate: (id: number) =>
      changeStatus.mutate({ id, data: { status: 'active', reason: null } }),
    cancel: (id: number, reason?: string) =>
      changeStatus.mutate({
        id,
        data: { status: 'cancelled', reason: reason ?? null },
      }),
  };
}

export const usePauseAssignment = () => {
  const { pause } = useAssignmentActions();
  return { mutate: pause };
};

export const useCompleteAssignment = () => {
  const { complete } = useAssignmentActions();
  return { mutate: complete };
};

export const useReactivateAssignment = () => {
  const { reactivate } = useAssignmentActions();
  return { mutate: reactivate };
};

export const useCancelAssignment = () => {
  const { cancel } = useAssignmentActions();
  return { mutate: cancel };
};
