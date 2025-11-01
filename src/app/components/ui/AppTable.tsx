// app/components/ui/AppTable.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DataTable, Column } from '@/app/components/ui/DataTable';
import { Button, Icon } from '@/app/components/ui';

interface AppTableProps<T> {
  authToken: string | null;
  endpoint: string;
  columns: Column<T>[];
  title: string;
  emptyMessage?: string;
  basePath: string;
  actions?: (item: T) => React.ReactNode;
  statusFilterConfig?: {
    options: Array<{ value: string; label: string }>;
    defaultValue: string;
  };
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;
  customFilters?: React.ReactNode;
}

interface ApiResponse<T> {
  data: T[];
  meta: {
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  };
}

interface TableFilters {
  status: string;
  search: string;
  page: number;
  per_page: number;
  sort_by: string;
  sort_direction: string;
}

const useTableData = <T,>(
  endpoint: string,
  filters: TableFilters,
  authToken: string | null
) => {
  const [data, setData] = useState<ApiResponse<T> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!authToken) return;

    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.set(key, value.toString());
      });

      const response = await fetch(`/api/${endpoint}?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint, filters, authToken]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
};

export function AppTable<T extends { id: string | number }>({
  authToken,
  endpoint,
  columns,
  title,
  emptyMessage = 'No data found',
  basePath,
  actions,
  statusFilterConfig,
  searchPlaceholder = 'Search...',
  onRowClick,
  customFilters,
}: AppTableProps<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<TableFilters>({
    status:
      searchParams.get('status') || statusFilterConfig?.defaultValue || '',
    search: searchParams.get('search') || '',
    page: parseInt(searchParams.get('page') || '1'),
    per_page: 10,
    sort_by: searchParams.get('sort_by') || 'created_at',
    sort_direction: searchParams.get('sort_direction') || 'desc',
  });

  const {
    data: tableData,
    isLoading,
    error,
    refetch,
  } = useTableData<T>(endpoint, filters, authToken);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();

      if (
        filters.status &&
        filters.status !== statusFilterConfig?.defaultValue
      ) {
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
        ? `${basePath}?${params.toString()}`
        : basePath;
      router.push(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, router, basePath, statusFilterConfig?.defaultValue]);

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handlePaginationChange = (pagination: {
    page: number;
    pageSize: number;
  }) => {
    setFilters((prev) => ({
      ...prev,
      page: pagination.page,
      per_page: pagination.pageSize,
    }));
  };

  const handleSortChange = (sort: {
    key: string;
    direction: 'asc' | 'desc';
  }) => {
    setFilters((prev) => ({
      ...prev,
      sort_by: sort.key,
      sort_direction: sort.direction,
      page: 1,
    }));
  };

  const handleRowClick = (item: T) => {
    if (onRowClick) {
      onRowClick(item);
    } else {
      router.push(`${basePath}/${item.id}`);
    }
  };

  const getEmptyMessage = () => {
    if (filters.search) {
      return `No ${title.toLowerCase()} found matching "${filters.search}". Try adjusting your search terms.`;
    }
    if (filters.status && filters.status !== statusFilterConfig?.defaultValue) {
      return `No ${filters.status} ${title.toLowerCase()} found. Try changing the status filter.`;
    }
    return emptyMessage;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600">
            {tableData?.meta?.total || 0} {title.toLowerCase()} found
            {filters.search && ` for "${filters.search}"`}
            {filters.status &&
              filters.status !== statusFilterConfig?.defaultValue &&
              ` (${filters.status})`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {statusFilterConfig && (
            <div className="flex rounded-lg border border-gray-200 p-1 bg-white">
              {statusFilterConfig.options.map((status) => (
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
          )}

          <div className="relative">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
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

          {customFilters}

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

      <DataTable<T>
        data={tableData?.data || []}
        columns={columns}
        pagination={{
          page: filters.page,
          pageSize: filters.per_page,
          total: tableData?.meta?.total || 0,
        }}
        onPaginationChange={handlePaginationChange}
        onSortChange={handleSortChange}
        onRowClick={handleRowClick}
        actions={actions}
        loading={isLoading}
        error={error ? { message: error } : undefined}
        onRetry={refetch}
        emptyMessage={getEmptyMessage()}
      />
    </div>
  );
}
