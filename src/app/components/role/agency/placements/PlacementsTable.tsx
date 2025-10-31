'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DataTable, Column } from '@/app/components/ui/DataTable';
import { Button, Icon, Badge } from '@/app/components/ui';
import { usePlacements } from '@/hooks/usePlacements';

interface PlacementsTableProps {
  authToken: string | null;
}

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

const StatusBadge = ({ status }: { status: Placement['status'] }) => {
  const statusConfig = {
    active: { label: 'Active', variant: 'success' as const },
    draft: { label: 'Draft', variant: 'warning' as const },
    filled: { label: 'Filled', variant: 'info' as const },
    cancelled: { label: 'Cancelled', variant: 'error' as const },
    completed: { label: 'Completed', variant: 'primary' as const },
  };

  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US');
};

export function PlacementsTable({ authToken }: PlacementsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
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

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handlePaginationChange = (newPagination: any) => {
    setFilters((prev) => ({
      ...prev,
      page: newPagination.page,
      per_page: newPagination.pageSize,
    }));
  };

  const handleSortChange = (sort: any) => {
    setFilters((prev) => ({
      ...prev,
      sort_by: sort.key,
      sort_direction: sort.direction,
      page: 1,
    }));
  };

  const handleRowClick = (placement: Placement) => {
    if (placement?.id) {
      router.push(`/agency/placements/${placement.id}`);
    }
  };

  const placementColumns: Column<Placement>[] = [
    {
      key: 'title',
      header: 'Position',
      sortable: true,
      filterable: true,
      width: 'col-span-3',
      render: (value, row) => (
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
      render: (value, row) => (
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
      render: (value) => (
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
      render: (value, row) => (
        <div className="text-right">
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
      render: (value) => <StatusBadge status={value as Placement['status']} />,
    },
    {
      key: 'agency_responses_count',
      header: 'Responses',
      sortable: true,
      width: 'col-span-2',
      render: (value) => {
        const responseCount = (value as number) || 0;
        return (
          <div className="text-center">
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
    {
      key: 'response_deadline',
      header: 'Deadline',
      sortable: true,
      width: 'col-span-2',
      render: (value, row) => {
        if (!row.response_deadline) {
          return <div className="text-sm text-gray-400">No deadline</div>;
        }

        const deadline = new Date(row.response_deadline);
        const today = new Date();
        const isPast = deadline < today;

        return (
          <div
            className={`text-sm ${isPast ? 'text-red-600' : 'text-gray-700'}`}
          >
            {formatDate(row.response_deadline)}
            {isPast && <div className="text-xs text-red-500">Expired</div>}
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
      {placement.status === 'active' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/agency/placements/${placement.id}/analytics`);
          }}
          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all duration-300"
          title="Track Responses"
        >
          <Icon name="barChart" className="h-4 w-4" />
        </button>
      )}
      {placement.status === 'draft' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/agency/placements/${placement.id}/edit`);
          }}
          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all duration-300"
          title="Edit Placement"
        >
          <Icon name="edit" className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  const getEmptyMessage = () => {
    if (filters.search) {
      return `No placements found matching "${filters.search}". Try adjusting your search terms.`;
    }
    if (filters.status && filters.status !== 'all') {
      return `No ${filters.status} placements found. Try changing the status filter.`;
    }
    return 'No placements found. Check back later for new opportunities.';
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Placements</h2>
          <p className="text-sm text-gray-600">
            {placementsResponse?.meta?.total || 0} placement opportunities found
            {filters.search && ` for "${filters.search}"`}
            {filters.status &&
              filters.status !== 'all' &&
              ` (${filters.status})`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Status Filter */}
          <div className="flex rounded-lg border border-gray-200 p-1 bg-white">
            {[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'draft', label: 'Draft' },
              { value: 'filled', label: 'Filled' },
              { value: 'completed', label: 'Completed' },
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => handleStatusFilter(status.value)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  filters.status === status.value
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by position, employer, or location..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 w-full sm:w-64"
            />
            {filters.search && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Icon name="x" className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Refresh Button */}
          <Button
            variant="secondary-outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="whitespace-nowrap"
          >
            <Icon
              name="refreshCw"
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable<Placement>
        data={placementsResponse?.data || []}
        columns={placementColumns}
        pagination={{
          page: filters.page,
          pageSize: filters.per_page,
          total: placementsResponse?.meta?.total || 0,
        }}
        onPaginationChange={handlePaginationChange}
        onSortChange={handleSortChange}
        onRowClick={handleRowClick}
        actions={actions}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        emptyMessage={getEmptyMessage()}
      />
    </div>
  );
}
