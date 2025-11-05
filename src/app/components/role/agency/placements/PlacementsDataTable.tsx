'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Icon } from '@/app/components/ui';
import {
  DataTable,
  StatusBadge,
  formatCurrency,
  formatDate,
} from '@/app/components/ui';
import {
  BulkAction,
  ExportOptions,
  AdvancedFilter,
  Column,
} from '@/types';
import type { PaginatedResponse as BackendPaginatedResponse } from '@/types/pagination';
import type { Placement as BackendPlacement } from '@/types/api';
import { usePlacements } from '@/hooks/usePlacements';

interface Placement {
  id: string | number;
  title: string;
  employer?: { name: string };
  location?: { name: string };
  start_date?: string;
  budget_amount?: number;
  currency?: string;
  budget_type?: string;
  status: 'active' | 'draft' | 'filled' | 'cancelled' | 'completed';
  experience_level?: string;
  location_instructions?: string;
  agency_responses_count?: number;
  response_deadline?: string;
}


interface PlacementsDataTableProps {
  authToken: string | null;
}

interface FiltersState {
  status: string;
  search: string;
  page: number;
  per_page: number;
  sort_by: string;
  sort_direction: string;
}

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

interface SortState {
  key: string;
  direction: 'asc' | 'desc';
}

export function PlacementsDataTable({ authToken }: PlacementsDataTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FiltersState>({
    status: searchParams.get('status') || 'active',
    search: searchParams.get('search') || '',
    page: parseInt(searchParams.get('page') || '1'),
    per_page: 10,
    sort_by: searchParams.get('sort_by') || 'created_at',
    sort_direction: searchParams.get('sort_direction') || 'desc',
  });

  const {
    data: placementsResponse,
    isLoading,
    error,
    refetch,
  } = usePlacements(filters, authToken);

  const getTotalCount = (
    placementsResponse: BackendPaginatedResponse<BackendPlacement> | undefined
  ): number => {
    if (!placementsResponse?.meta) return 0;

    const metaTotal = placementsResponse.meta.total;

    if (Array.isArray(metaTotal) && metaTotal.length > 0) {
      return metaTotal[0];
    }

    if (typeof metaTotal === 'number' && !isNaN(metaTotal)) {
      return metaTotal;
    }

    if (typeof metaTotal === 'string') {
      const parsed = parseInt(metaTotal, 10);
      return isNaN(parsed) ? 0 : parsed;
    }

    return 0;
  };

  const totalCount = getTotalCount(placementsResponse);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();

      if (filters.status && filters.status !== 'active') {
        params.set('status', filters.status);
      }

      if (filters.search) {
        params.set('search', filters.search);
      }

      if (filters.page > 1) {
        params.set('page', filters.page.toString());
      }

      if (filters.sort_by !== 'created_at') {
        params.set('sort_by', filters.sort_by);
      }

      if (filters.sort_direction !== 'desc') {
        params.set('sort_direction', filters.sort_direction);
      }

      const newUrl = params.toString()
        ? `?${params.toString()}`
        : '/agency/placements';
      router.push(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, router]);

  const handleFilterChange = (newFilters: Partial<FiltersState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePaginationChange = (pagination: PaginationState) => {
    setFilters((prev) => ({
      ...prev,
      page: pagination.page,
      per_page: pagination.pageSize,
    }));
  };

  const handleSortChange = (sort: SortState) => {
    setFilters((prev) => ({
      ...prev,
      sort_by: sort.key,
      sort_direction: sort.direction,
      page: 1,
    }));
  };

  const handleSelectionChange = useCallback(
    (selectedPlacements: Placement[]) => {
      console.log('Selected placements:', selectedPlacements);
    },
    []
  );

  const handleBulkArchive = useCallback((selectedPlacements: Placement[]) => {
    console.log('Archiving placements:', selectedPlacements);
  }, []);

  const handleBulkContact = useCallback((selectedPlacements: Placement[]) => {
    console.log('Contacting employers for placements:', selectedPlacements);
  }, []);

  const handleExport = useCallback((format: string): void => {
    console.log(`Exporting as ${format}`);
  }, []);

  const bulkActions: BulkAction<Placement>[] = [
    {
      label: 'Archive Selected',
      icon: (
        <Icon
          name="archive"
          className="h-4 w-4 mr-2 transition-transform duration-300"
        />
      ),
      onClick: handleBulkArchive,
      variant: 'secondary-outline',
    },
    {
      label: 'Contact Employers',
      icon: (
        <Icon
          name="mail"
          className="h-4 w-4 mr-2 transition-transform duration-300"
        />
      ),
      onClick: handleBulkContact,
      variant: 'secondary',
    },
  ];

  const exportOptions: ExportOptions = {
    formats: ['csv', 'excel', 'json'],
    onExport: handleExport,
  };

  const advancedFilters: AdvancedFilter[] = [
    {
      key: 'budget_amount',
      type: 'number',
      label: 'Budget Amount',
      placeholder: 'Filter by budget...',
    },
    {
      key: 'experience_level',
      type: 'select',
      label: 'Experience Level',
      options: [
        { label: 'Entry Level', value: 'entry' },
        { label: 'Mid Level', value: 'mid' },
        { label: 'Senior Level', value: 'senior' },
        { label: 'Executive', value: 'executive' },
      ],
    },
    {
      key: 'start_date',
      type: 'date',
      label: 'Start Date',
      placeholder: 'Filter by start date...',
    },
  ];

  const placementColumns: Column<Placement>[] = [
    {
      key: 'title',
      header: 'Position',
      sortable: true,
      filterable: true,
      width: 'col-span-3',
      render: (value: unknown, row: Placement) => (
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 dark:text-white truncate">
            {row.title || 'Untitled Position'}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {row.employer?.name || 'Employer not specified'}
          </div>
          {row.experience_level && (
            <div className="text-xs text-gray-400 dark:text-gray-500 capitalize mt-1">
              {row.experience_level} level
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      sortable: true,
      filterable: true,
      width: 'col-span-2',
      render: (value: unknown, row: Placement) => (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {row.location?.name || 'Location not specified'}
          {row.location_instructions && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
              {row.location_instructions}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'start_date',
      header: 'Start Date',
      sortable: true,
      width: 'col-span-2',
      render: (value: unknown) => (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {value ? formatDate(value as string) : 'Flexible'}
        </div>
      ),
    },
    {
      key: 'budget_amount',
      header: 'Budget',
      sortable: true,
      width: 'col-span-2',
      render: (value: unknown, row: Placement) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {row.budget_amount
              ? formatCurrency(row.budget_amount, row.currency)
              : 'Not specified'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {row.budget_type || 'fixed'}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      width: 'col-span-2',
      render: (value: unknown) => <StatusBadge status={value as string} />,
    },
    {
      key: 'agency_responses_count',
      header: 'Responses',
      sortable: true,
      width: 'col-span-2',
      render: (value: unknown) => {
        const responseCount = (value as number) || 0;
        return (
          <div>
            <div
              className={`font-semibold ${responseCount > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
            >
              {responseCount}
            </div>
          </div>
        );
      },
    },
  ];

  const actions = (placement: Placement) => (
    <div className="flex space-x-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/agency/placements/${placement.id}`);
        }}
        className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-all duration-300 cursor-pointer"
        title="View Details"
      >
        <Icon name="eye" className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          console.log('Submit candidate for placement:', placement.id);
        }}
        className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-all duration-300 cursor-pointer"
        title="Submit Candidate"
      >
        <Icon name="userPlus" className="h-4 w-4" />
      </button>
      {placement.status === 'active' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log('Track responses for placement:', placement.id);
          }}
          className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-all duration-300 cursor-pointer"
          title="Track Responses"
        >
          <Icon name="barChart" className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  const statusFilterOptions = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'filled', label: 'Filled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <DataTable<Placement>
      data={placementsResponse?.data || []}
      columns={placementColumns}
      pagination={{
        page: filters.page,
        pageSize: filters.per_page,
        total: totalCount,
      }}
      filters={filters}
      onFilterChange={handleFilterChange}
      onPaginationChange={handlePaginationChange}
      onSortChange={handleSortChange}
      actions={actions}
      loading={isLoading}
      error={errorMessage}
      onRetry={refetch}
      title="Placements"
      description={`${totalCount} placement opportunities found`}
      statusFilterOptions={statusFilterOptions}
      showSearch={true}
      showColumnSettings={true}
      selectable={true}
      bulkActions={bulkActions}
      exportOptions={exportOptions}
      advancedFilters={advancedFilters}
      virtualScroll={
        placementsResponse?.data && placementsResponse.data.length > 50
      }
      onSelectionChange={handleSelectionChange}
      rowExpansion={{
        render: (placement: Placement) => (
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Placement Details
                </h4>
                <div className="space-y-1">
                  <div className="text-gray-700 dark:text-gray-300">
                    <span className="text-gray-600 dark:text-gray-400">
                      ID:
                    </span>{' '}
                    {placement.id}
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    <span className="text-gray-600 dark:text-gray-400">
                      Experience Level:
                    </span>{' '}
                    {placement.experience_level || 'Not specified'}
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    <span className="text-gray-600 dark:text-gray-400">
                      Budget Type:
                    </span>{' '}
                    {placement.budget_type || 'Fixed'}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Response Information
                </h4>
                <div className="space-y-1">
                  <div className="text-gray-700 dark:text-gray-300">
                    <span className="text-gray-600 dark:text-gray-400">
                      Responses:
                    </span>{' '}
                    {placement.agency_responses_count || 0}
                  </div>
                  {placement.response_deadline && (
                    <div className="text-gray-700 dark:text-gray-300">
                      <span className="text-gray-600 dark:text-gray-400">
                        Deadline:
                      </span>{' '}
                      {formatDate(placement.response_deadline)}
                    </div>
                  )}
                  {placement.location_instructions && (
                    <div className="text-gray-700 dark:text-gray-300">
                      <span className="text-gray-600 dark:text-gray-400">
                        Location Notes:
                      </span>{' '}
                      {placement.location_instructions}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ),
      }}
    />
  );
}
