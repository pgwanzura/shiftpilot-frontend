'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DataTable } from '@/app/components/ui';
import { usePlacements } from '@/hooks/usePlacements';
import { Button, Icon } from '@/app/components/ui';

interface PlacementsTableProps {
  authToken: string | null;
}

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
    }, 300); // Debounce for 300ms

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

  // Column definitions
  const placementColumns = [
    {
      key: 'title',
      header: 'Position',
      label: 'Position',
      sortable: true,
      width: '2fr',
      render: (value: string, row: any) => (
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 truncate">{value}</div>
          <div className="text-sm text-gray-500 truncate">
            {row.employer?.name || 'Employer'}
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
      label: 'Location',
      sortable: false,
      width: '1fr',
      render: (value: any, row: any) => (
        <div className="text-sm text-gray-700">
          {row.location?.name || 'Not specified'}
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
      label: 'Start Date',
      sortable: true,
      width: '1fr',
      render: (value: string) => (
        <div className="text-sm text-gray-700">
          {value ? new Date(value).toLocaleDateString() : 'Flexible'}
        </div>
      ),
    },
    {
      key: 'budget_amount',
      header: 'Budget',
      label: 'Budget',
      sortable: true,
      width: '1fr',
      render: (value: number, row: any) => (
        <div className="text-right">
          <div className="font-semibold text-gray-900">
            {row.currency} {value?.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 capitalize">
            {row.budget_type}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      label: 'Status',
      sortable: true,
      width: '1fr',
      render: (value: string) => {
        const statusConfig = {
          active: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            label: 'Active',
          },
          draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' },
          filled: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Filled' },
          cancelled: {
            bg: 'bg-red-100',
            text: 'text-red-800',
            label: 'Cancelled',
          },
          completed: {
            bg: 'bg-purple-100',
            text: 'text-purple-800',
            label: 'Completed',
          },
        };

        const config =
          statusConfig[value as keyof typeof statusConfig] ||
          statusConfig.draft;

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
          >
            {config.label}
          </span>
        );
      },
    },
    {
      key: 'agency_responses_count',
      header: 'Responses',
      label: 'Responses',
      sortable: true,
      width: '1fr',
      render: (value: number, row: any) => (
        <div className="text-center">
          <div
            className={`font-semibold ${value > 0 ? 'text-blue-600' : 'text-gray-500'}`}
          >
            {value || 0}
          </div>
          <div className="text-xs text-gray-500">responses</div>
        </div>
      ),
    },
    {
      key: 'response_deadline',
      header: 'Deadline',
      label: 'Deadline',
      sortable: true,
      width: '1fr',
      render: (value: string) => {
        if (!value)
          return <div className="text-sm text-gray-400">No deadline</div>;

        const deadline = new Date(value);
        const today = new Date();
        const isPast = deadline < today;

        return (
          <div
            className={`text-sm ${isPast ? 'text-red-600' : 'text-gray-700'}`}
          >
            {deadline.toLocaleDateString()}
            {isPast && <div className="text-xs text-red-500">Expired</div>}
          </div>
        );
      },
    },
  ];

 
  const actions = (placement: any) => {
    const baseActions = [
      {
        label: 'View Details',
        icon: <Icon name="eye" className="h-4 w-4" />,
        onClick: () => {
          router.push(`/agency/placements/${placement.id}`);
        },
      },
      {
        label: 'Submit Candidate',
        icon: <Icon name="userPlus" className="h-4 w-4" />,
        onClick: () => {
          console.log('Submit candidate for placement:', placement.id);
        },
      },
    ];

    if (placement.status === 'active') {
      baseActions.push({
        label: 'Track Responses',
        icon: <Icon name="barChart" className="h-4 w-4" />,
        onClick: () => {
          router.push(`/agency/placements/${placement.id}/analytics`);
        },
      });
    }

    if (placement.status === 'draft') {
      baseActions.push({
        label: 'Edit Placement',
        icon: <Icon name="edit" className="h-4 w-4" />,
        onClick: () => {
          router.push(`/agency/placements/${placement.id}/edit`);
        },
      });
    }

    // Return as ReactNode by wrapping in Fragment or mapping
    return (
      <>
        {baseActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all duration-300"
            title={action.label}
          >
            {action.icon}
          </button>
        ))}
      </>
    );
  };

  // Enhanced empty state message based on filters
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
      <DataTable
        data={placementsResponse?.data || []}
        columns={placementColumns}
        pagination={placementsResponse?.meta}
        onPaginationChange={handlePaginationChange}
        onSortChange={handleSortChange}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        emptyMessage={getEmptyMessage()}
        actions={actions}
        onRowClick={(placement) => {
          router.push(`/agency/placements/${placement.id}`);
        }}
        rowClassName={(row) =>
          row.status === 'active' &&
          row.response_deadline &&
          new Date(row.response_deadline) < new Date()
            ? 'border-l-4 border-l-orange-500 bg-orange-50'
            : row.status === 'active'
              ? 'border-l-4 border-l-green-500'
              : ''
        }
      />
    </div>
  );
}
