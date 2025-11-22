'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/app/components/layout/PageHeader';
import { QuickActions } from '@/app/components/ui';
import { AssignmentsTable } from '@/app/components/ui/assignments/AssignmentsTable';
import { AssignmentStats } from '@/app/components/ui/assignments/AssignmentStats';
import { useAssignments, useAssignmentStats } from '@/hooks/useAssignments';
import type { AssignmentFilters, Assignment, Pagination } from '@/types';

const DEFAULT_FILTERS: AssignmentFilters = {
  status: 'all',
  assignment_type: 'all',
  page: 1,
  per_page: 20,
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

  const handleRowClick = useCallback(
    (assignment: Assignment) => {
      router.push(`/assignments/${assignment.id}`);
    },
    [router]
  );

  const convertPagination = (
    apiPagination: ApiPagination | undefined
  ): Pagination | undefined => {
    if (!apiPagination) return undefined;

    return {
      page: apiPagination.current_page,
      pageSize: apiPagination.per_page,
      total: apiPagination.total,
    };
  };

  const tableData = assignmentsData?.data || [];
  const pagination = convertPagination(assignmentsData?.meta);

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

      <AssignmentStats stats={statsResponse?.data} loading={statsLoading} />

      <AssignmentsTable
        data={tableData}
        pagination={pagination}
        filters={filters}
        loading={assignmentsLoading}
        onFiltersChange={handleFiltersChange}
        onPaginationChange={handlePaginationChange}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
