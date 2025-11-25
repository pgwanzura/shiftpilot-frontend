'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/app/components/layout/PageHeader';
import { QuickActions } from '@/app/components/ui';
import { AssignmentsTable } from '@/app/components/ui/assignments/AssignmentsTable';
import { AssignmentStats } from '@/app/components/ui/assignments/AssignmentStats';
import {
  useAssignments,
  useAssignmentStats,
  usePauseAssignment,
  useReactivateAssignment,
} from '@/hooks/useAssignments';
import type { AssignmentFilters, Assignment, Pagination } from '@/types';

const DEFAULT_FILTERS: AssignmentFilters = {
  status: 'all',
  assignment_type: 'all',
  page: 1,
  per_page: 10,
};

interface ApiPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export default function AssignmentsPage() {
  const [filters, setFilters] = useState<AssignmentFilters>(DEFAULT_FILTERS);
  const router = useRouter();

  const { data: assignmentsData, isLoading: assignmentsLoading } =
    useAssignments(filters);
  const { data: statsResponse, isLoading: statsLoading } = useAssignmentStats();

  const pauseAssignment = usePauseAssignment();
  const resumeAssignment = useReactivateAssignment();

  const handleFiltersChange = useCallback((newFilters: AssignmentFilters) => {
    setFilters(newFilters);
  }, []);

  const handlePaginationChange = useCallback((pagination: Pagination) => {
    setFilters((prev) => ({
      ...prev,
      page: pagination.page,
      per_page: pagination.pageSize,
    }));
  }, []);

  const tableData: Assignment[] = useMemo(
    () => assignmentsData?.data || [],
    [assignmentsData]
  );
  const pagination: Pagination | undefined = useMemo(() => {
    if (!assignmentsData?.meta) return undefined;
    const meta = assignmentsData.meta as ApiPagination;
    return {
      page: meta.current_page,
      pageSize: meta.per_page,
      total: meta.total,
      last_page: meta.last_page,
    };
  }, [assignmentsData]);

  const navigateToAssignment = useCallback(
    (assignmentId: number, path: 'view' | 'edit' = 'view') => {
      const url =
        path === 'edit'
          ? `/assignments/${assignmentId}/edit`
          : `/assignments/${assignmentId}`;
      router.push(url);
    },
    [router]
  );

  const navigateToShifts = useCallback(
    (assignmentId: number) => router.push(`/shifts?assignment=${assignmentId}`),
    [router]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        actions={<QuickActions userRole="agency_admin" />}
        customBreadcrumbs={{
          '/': 'Dashboard',
          '/agency': 'Agency',
          '/agency/assignments': 'Assignments',
        }}
      />

      {/* <AssignmentStats stats={statsResponse?.data} loading={statsLoading} /> */}

      <AssignmentsTable
        data={tableData}
        pagination={pagination}
        filters={filters}
        loading={assignmentsLoading}
        onFiltersChange={handleFiltersChange}
        onPaginationChange={handlePaginationChange}
        onRowClick={(assignment) => navigateToAssignment(assignment.id)}
        onEdit={(assignment) => navigateToAssignment(assignment.id, 'edit')}
        onPause={(assignment) => pauseAssignment.mutate(assignment.id)}
        onResume={(assignment) => resumeAssignment.mutate(assignment.id)}
        onViewDetails={(assignment) => navigateToAssignment(assignment.id)}
        onViewShifts={(assignment) => navigateToShifts(assignment.id)}
      />
    </div>
  );
}
