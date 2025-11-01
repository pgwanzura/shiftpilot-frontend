'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Icon } from '@/app/components/ui';
import {
  DataTable,
  StatusBadge,
  formatCurrency,
  formatDate,
  Column,
} from '@/app/components/ui/DataTable';
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

  const placementColumns: Column<Placement>[] = [
    {
      key: 'title',
      header: 'Position',
      sortable: true,
      filterable: true,
      width: 'col-span-3',
      render: (value: unknown, row: Placement) => (
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 truncate">
            {row.title || 'Untitled Position'}
          </div>
          <div className="text-sm text-gray-500 truncate">
            {row.employer?.name || 'Employer not specified'}
          </div>
          {row.experience_level && (
            <div className="text-xs text-gray-400 capitalize mt-1">
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
        <div className="text-sm text-gray-700">
          {row.location?.name || 'Location not specified'}
          {row.location_instructions && (
            <div className="text-xs text-gray-500 mt-1 truncate">
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
        <div className="text-sm text-gray-700">
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
          <div className="font-semibold text-gray-900">
            {row.budget_amount
              ? formatCurrency(row.budget_amount, row.currency)
              : 'Not specified'}
          </div>
          <div className="text-xs text-gray-500 capitalize">
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
              className={`font-semibold ${responseCount > 0 ? 'text-blue-600' : 'text-gray-500'}`}
            >
              {responseCount}
            </div>
            <div className="text-xs text-gray-500">responses</div>
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
        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all duration-300"
        title="View Details"
      >
        <Icon name="eye" className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          console.log('Submit candidate for placement:', placement.id);
        }}
        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all duration-300"
        title="Submit Candidate"
      >
        <Icon name="userPlus" className="h-4 w-4" />
      </button>
    </div>
  );

  const statusFilterOptions = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'filled', label: 'Filled' },
    { value: 'completed', label: 'Completed' },
  ];

  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <DataTable<Placement>
      data={placementsResponse?.data || []}
      columns={placementColumns}
      pagination={{
        page: filters.page,
        pageSize: filters.per_page,
        total: placementsResponse?.meta?.total || 0,
      }}
      filters={filters}
      onFilterChange={handleFilterChange}
      onPaginationChange={handlePaginationChange}
      onSortChange={handleSortChange}
      onRowClick={(placement) =>
        router.push(`/agency/placements/${placement.id}`)
      }
      actions={actions}
      loading={isLoading}
      error={errorMessage}
      onRetry={refetch}
      title="Placements"
      description={`${placementsResponse?.meta?.total || 0} placement opportunities found`}
      statusFilterOptions={statusFilterOptions}
      showSearch={true}
      showColumnSettings={true}
    />
  );
}
