'use client';

import React, { JSX } from 'react';
import { useState, useMemo, useRef, ReactNode, DragEvent } from 'react';
import {
  Button,
  Icon,
  Loader,
  Badge,
  type BadgeVariant,
} from '@/app/components/ui';

export interface TableData {
  id: string | number;
}

export interface Column<T extends TableData> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], row: T) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface SortState {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterState {
  search?: string;
  status?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_direction?: string;
}

export interface DataTableProps<T extends TableData> {
  data: T[];
  columns: Column<T>[];
  pagination?: Pagination;
  filters?: FilterState;
  onPaginationChange?: (pagination: Pagination) => void;
  onSortChange?: (sort: SortState) => void;
  onFilterChange?: (filters: FilterState) => void;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
  className?: string;
  rowClassName?: (row: T, rowIndex: number) => string;
  actions?: (row: T) => ReactNode;
  showSearch?: boolean;
  showColumnSettings?: boolean;
  statusFilterOptions?: Array<{ value: string; label: string }>;
  title?: string;
  description?: string;
}

interface StatusConfig {
  label: string;
  variant: BadgeVariant;
}

interface StatusBadgeProps {
  status: string;
  config?: Record<string, StatusConfig>;
}

export function DataTable<T extends TableData>({
  data,
  columns: initialColumns,
  pagination,
  filters = {},
  onPaginationChange,
  onSortChange,
  onFilterChange,
  onRowClick,
  loading = false,
  error = null,
  onRetry,
  emptyMessage = 'No data available',
  className = '',
  rowClassName,
  actions,
  showSearch = true,
  showColumnSettings = true,
  statusFilterOptions,
  title,
  description,
}: DataTableProps<T>): JSX.Element {
  const [sort, setSort] = useState<SortState | null>(null);
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [columnOrder, setColumnOrder] = useState<string[]>(
    initialColumns.map((col) => col.key as string)
  );
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(initialColumns.map((col) => col.key as string))
  );
  const [showColumnSettingsPanel, setShowColumnSettingsPanel] =
    useState<boolean>(false);

  const tableRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const columns = useMemo((): Column<T>[] => {
    return columnOrder
      .map((key) => initialColumns.find((col) => col.key === key))
      .filter((col): col is Column<T> => col !== undefined)
      .filter((col) => visibleColumns.has(col.key as string));
  }, [initialColumns, columnOrder, visibleColumns]);

  const handleSort = (key: string): void => {
    const newSort: SortState =
      sort?.key === key && sort.direction === 'asc'
        ? { key, direction: 'desc' }
        : { key, direction: 'asc' };

    setSort(newSort);
    onSortChange?.(newSort);
  };

  const handleSearch = (searchTerm: string): void => {
    const newFilters = { ...localFilters, search: searchTerm };
    setLocalFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleStatusFilter = (status: string): void => {
    const newFilters = { ...localFilters, status, page: 1 };
    setLocalFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleDragStart = (
    e: DragEvent<HTMLDivElement>,
    columnKey: string
  ): void => {
    setDraggedColumn(columnKey);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (
    e: DragEvent<HTMLDivElement>,
    targetColumnKey: string
  ): void => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnKey) return;

    const newOrder = [...columnOrder];
    const draggedIndex = newOrder.indexOf(draggedColumn);
    const targetIndex = newOrder.indexOf(targetColumnKey);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedColumn);

    setColumnOrder(newOrder);
  };

  const handleDragEnd = (): void => {
    setDraggedColumn(null);
  };

  const toggleColumnVisibility = (columnKey: string): void => {
    const newVisible = new Set(visibleColumns);
    if (newVisible.has(columnKey)) {
      newVisible.delete(columnKey);
    } else {
      newVisible.add(columnKey);
    }
    setVisibleColumns(newVisible);
  };

  const selectAllColumns = (): void => {
    setVisibleColumns(new Set(initialColumns.map((col) => col.key as string)));
  };

  const deselectAllColumns = (): void => {
    setVisibleColumns(new Set());
  };

  const getStatusVariant = (statusValue: string): string => {
    const variants: Record<string, string> = {
      active: 'bg-green-50 text-green-700 border-green-200',
      draft: 'bg-amber-50 text-amber-700 border-amber-200',
      filled: 'bg-blue-50 text-blue-700 border-blue-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
      completed: 'bg-purple-50 text-purple-700 border-purple-200',
      all: 'bg-gray-50 text-gray-700 border-gray-200',
    };

    return variants[statusValue] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const processedData = useMemo((): T[] => {
    let result = [...data];

    if (localFilters.search) {
      result = result.filter((row) =>
        columns.some((col) => {
          const value = row[col.key];
          return value
            ?.toString()
            .toLowerCase()
            .includes(localFilters.search!.toLowerCase());
        })
      );
    }

    if (localFilters.status && localFilters.status !== 'all') {
      result = result.filter(
        (row) => (row as { status?: string }).status === localFilters.status
      );
    }

    if (sort) {
      result.sort((a, b) => {
        const aValue = a[sort.key as keyof T];
        const bValue = b[sort.key as keyof T];

        if (aValue === bValue) return 0;

        const direction = sort.direction === 'asc' ? 1 : -1;

        if (aValue == null) return direction;
        if (bValue == null) return -direction;

        return aValue < bValue ? -direction : direction;
      });
    }

    return result;
  }, [data, sort, localFilters, columns]);

  const paginatedData = useMemo((): T[] => {
    if (!pagination) return processedData;
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return processedData.slice(start, end);
  }, [processedData, pagination]);

  const safePaginationTotal = pagination?.total ?? 0;
  const safePaginationPage = pagination?.page ?? 1;
  const safePaginationPageSize = pagination?.pageSize ?? 10;

  const totalPages = pagination
    ? Math.ceil(safePaginationTotal / safePaginationPageSize)
    : 1;

  const getEmptyMessage = (): string => {
    if (localFilters.search) {
      return `No records found matching "${localFilters.search}". Try adjusting your search terms.`;
    }
    if (localFilters.status && localFilters.status !== 'all') {
      return `No ${localFilters.status} records found. Try changing the status filter.`;
    }
    return emptyMessage;
  };

  const getPaginationDisplayText = (): string => {
    if (!pagination) return '';

    const startRecord = Math.min(
      (safePaginationPage - 1) * safePaginationPageSize + 1,
      safePaginationTotal
    );
    const endRecord = Math.min(
      safePaginationPage * safePaginationPageSize,
      safePaginationTotal
    );

    return `Showing ${startRecord} to ${endRecord} of ${safePaginationTotal} records`;
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="text-red-600 mb-4">
          <Icon name="alertCircle" className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to load data
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            <Icon name="refreshCw" className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6">
        <div className={`space-y-4 ${className}`}>
          {(title || showSearch || statusFilterOptions) && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {(title || description) && (
                <div>
                  {title && (
                    <h2 className="text-lg font-semibold text-gray-900">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-sm text-gray-600">
                      {pagination?.total ?? processedData.length} records found
                      {localFilters.search && ` for "${localFilters.search}"`}
                      {localFilters.status &&
                        localFilters.status !== 'all' &&
                        ` (${localFilters.status})`}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {statusFilterOptions && (
                  <div className="flex items-center gap-1">
                    {statusFilterOptions.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => handleStatusFilter(status.value)}
                        className={`
                          relative px-4 py-1 text-sm font-medium rounded-full 
                          transition-all duration-200 ease-in-out
                          whitespace-nowrap border
                          ${
                            localFilters.status === status.value
                              ? `${getStatusVariant(status.value)} font-semibold`
                              : 'text-gray-600 hover:text-gray-700 border-gray-200 bg-white hover:bg-gray-50'
                          }
                        `}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                )}

                {showSearch && (
                  <div className="relative">
                    <Icon
                      name="search"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search across all records..."
                      value={localFilters.search || ''}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 w-full sm:w-64"
                    />
                    {localFilters.search && (
                      <button
                        onClick={() => handleSearch('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <Icon name="x" className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {onRetry && (
                    <Button
                      variant="secondary-outline"
                      size="sm"
                      onClick={onRetry}
                      disabled={loading}
                      className="whitespace-nowrap"
                    >
                      <Icon
                        name="refreshCw"
                        className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                      />
                      Refresh
                    </Button>
                  )}

                  {showColumnSettings && (
                    <div className="relative">
                      <Button
                        onClick={() =>
                          setShowColumnSettingsPanel(!showColumnSettingsPanel)
                        }
                        variant={
                          showColumnSettingsPanel
                            ? 'primary'
                            : 'secondary-outline'
                        }
                        size="sm"
                      >
                        <Icon name="settings" className="h-4 w-4" />
                        Columns
                      </Button>

                      {showColumnSettingsPanel && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg z-20">
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-semibold text-gray-900">
                                Columns
                              </h4>
                              <div className="flex gap-1">
                                <button
                                  onClick={selectAllColumns}
                                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                  All
                                </button>
                                <span className="text-gray-300">•</span>
                                <button
                                  onClick={deselectAllColumns}
                                  className="text-xs text-gray-600 hover:text-gray-700 font-medium"
                                >
                                  None
                                </button>
                              </div>
                            </div>
                            <div className="space-y-1 max-h-60 overflow-y-auto">
                              {initialColumns.map((column) => (
                                <label
                                  key={column.key as string}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                                >
                                  <div className="flex items-center gap-2 flex-1">
                                    <Icon
                                      name="gripVertical"
                                      className="h-3 w-3 text-gray-400 flex-shrink-0"
                                    />
                                    <span className="text-sm text-gray-700 flex-1">
                                      {column.header}
                                    </span>
                                  </div>
                                  <input
                                    type="checkbox"
                                    checked={visibleColumns.has(
                                      column.key as string
                                    )}
                                    onChange={() =>
                                      toggleColumnVisibility(
                                        column.key as string
                                      )
                                    }
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="overflow-hidden" ref={tableRef}>
            <div className="max-h-[500px] overflow-auto border border-gray-200 rounded-lg">
              <div className="sticky top-0 z-10 border-b border-gray-200 min-w-fit bg-gray-50 rounded-t-lg">
                <div
                  className="grid gap-3 sm:gap-4 px-4 sm:px-6 py-3 min-w-fit"
                  style={{
                    gridTemplateColumns: `repeat(${columns.length + (actions ? 1 : 0)}, minmax(100px, 1fr))`,
                  }}
                >
                  {columns.map((column) => (
                    <div
                      key={column.key as string}
                      className={`flex items-center gap-2 group relative ${
                        sort?.key === column.key
                          ? 'bg-indigo-50 rounded-lg px-2 -mx-2'
                          : ''
                      } ${column.align === 'right' ? 'justify-end' : column.align === 'center' ? 'justify-center' : 'justify-start'}`}
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(e, column.key as string)
                      }
                      onDragOver={(e) =>
                        handleDragOver(e, column.key as string)
                      }
                      onDragEnd={handleDragEnd}
                    >
                      <Icon
                        name="gripVertical"
                        className="h-3 w-3 text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity duration-200"
                      />

                      <span
                        className={`text-xs font-semibold tracking-wide truncate flex-1 ${
                          sort?.key === column.key
                            ? 'text-indigo-700'
                            : 'text-gray-700'
                        }`}
                      >
                        {column.header}
                      </span>
                      {column.sortable && (
                        <button
                          onClick={() => handleSort(column.key as string)}
                          className={`flex flex-col border rounded flex-shrink-0 hover:bg-gray-100 transition-all duration-200 p-1 ${
                            sort?.key === column.key
                              ? 'bg-indigo-100 border-indigo-200 opacity-100'
                              : 'border-gray-200 opacity-60 hover:opacity-100'
                          } group/sort`}
                        >
                          <Icon
                            name="chevronUp"
                            className={`h-3 w-3 -mb-1 transition-colors duration-200 ${
                              sort?.key === column.key &&
                              sort.direction === 'asc'
                                ? 'text-indigo-600'
                                : 'text-gray-500 group-hover/sort:text-gray-700'
                            }`}
                          />
                          <Icon
                            name="chevronDown"
                            className={`h-3 w-3 transition-colors duration-200 ${
                              sort?.key === column.key &&
                              sort.direction === 'desc'
                                ? 'text-indigo-600'
                                : 'text-gray-500 group-hover/sort:text-gray-700'
                            }`}
                          />
                        </button>
                      )}

                      {draggedColumn === column.key && (
                        <div className="absolute inset-0 bg-indigo-50 border border-indigo-300 rounded-lg" />
                      )}
                    </div>
                  ))}
                  {actions && (
                    <div className="text-right">
                      <span className="text-xs font-semibold text-gray-700 tracking-wide">
                        Actions
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white min-w-fit">
                {loading ? (
                  <div className="flex justify-center items-center py-16">
                    <Loader
                      size="lg"
                      showText
                      text="Loading data..."
                      textPosition="bottom"
                      color="#0077b6"
                      thickness={4}
                    />
                  </div>
                ) : paginatedData.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center mx-auto mb-3 group">
                      <Icon
                        name="search"
                        className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="text-gray-500 text-sm font-medium transition-colors duration-300 group-hover:text-gray-600">
                      {getEmptyMessage()}
                    </div>
                  </div>
                ) : (
                  paginatedData.map((row, rowIndex) => (
                    <div
                      key={row.id}
                      onMouseEnter={() => setHoveredRow(rowIndex)}
                      onMouseLeave={() => setHoveredRow(null)}
                      onClick={() => onRowClick?.(row)}
                      className={`group relative grid gap-3 sm:gap-4 px-4 sm:px-6 py-3 text-sm transition-all duration-200 border-b border-gray-100 last:border-b-0 min-w-fit ${
                        onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
                      } ${
                        hoveredRow === rowIndex
                          ? 'bg-blue-50'
                          : rowIndex % 2 === 0
                            ? 'bg-white'
                            : 'bg-gray-50'
                      } ${rowClassName?.(row, rowIndex) || ''}`}
                      style={{
                        gridTemplateColumns: `repeat(${columns.length + (actions ? 1 : 0)}, minmax(100px, 1fr))`,
                      }}
                    >
                      <div
                        className={`absolute left-0 top-0 h-full w-0.5 transition-colors duration-200 ${
                          hoveredRow === rowIndex
                            ? 'bg-blue-500'
                            : 'bg-transparent'
                        }`}
                      />

                      {columns.map((column) => (
                        <div
                          key={column.key as string}
                          className={`flex items-center transition-all duration-200 min-w-0 ${
                            column.align === 'right'
                              ? 'justify-end'
                              : column.align === 'center'
                                ? 'justify-center'
                                : 'justify-start'
                          }`}
                        >
                          <div
                            className={`truncate font-medium transition-all duration-200 ${
                              hoveredRow === rowIndex
                                ? 'text-gray-900'
                                : 'text-gray-700'
                            }`}
                          >
                            {column.render
                              ? column.render(row[column.key], row)
                              : (row[column.key] as ReactNode) || (
                                  <span className="text-gray-400 italic">
                                    —
                                  </span>
                                )}
                          </div>
                        </div>
                      ))}

                      {actions && (
                        <div className="flex justify-end">
                          <div
                            className={`flex items-center gap-1 transition-all duration-200 ${
                              hoveredRow === rowIndex
                                ? 'opacity-100'
                                : 'opacity-70'
                            }`}
                          >
                            {actions(row)}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {pagination && (
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="text-sm text-gray-600 text-center sm:text-left">
                  {getPaginationDisplayText()}
                </div>

                <div className="flex items-center justify-center sm:justify-end space-x-1">
                  <button
                    onClick={() =>
                      onPaginationChange?.({
                        ...pagination,
                        page: safePaginationPage - 1,
                      })
                    }
                    disabled={safePaginationPage === 1}
                    className="p-1.5 bg-white border border-gray-300 rounded disabled:opacity-30 hover:bg-gray-50 transition-all duration-200 group"
                  >
                    <Icon
                      name="chevronLeft"
                      className="h-3 w-3 transition-transform duration-200 group-hover:-translate-x-0.5"
                    />
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum =
                      totalPages <= 5
                        ? i + 1
                        : safePaginationPage <= 3
                          ? i + 1
                          : safePaginationPage >= totalPages - 2
                            ? totalPages - 4 + i
                            : safePaginationPage - 2 + i;

                    return (
                      <button
                        key={pageNum}
                        onClick={() =>
                          onPaginationChange?.({ ...pagination, page: pageNum })
                        }
                        className={`px-2.5 py-1 rounded text-sm font-medium border transition-all duration-200 group ${
                          safePaginationPage === pageNum
                            ? 'bg-indigo-500 text-white border-indigo-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      onPaginationChange?.({
                        ...pagination,
                        page: safePaginationPage + 1,
                      })
                    }
                    disabled={safePaginationPage >= totalPages}
                    className="p-1.5 bg-white border border-gray-300 rounded disabled:opacity-30 hover:bg-gray-50 transition-all duration-200 group"
                  >
                    <Icon
                      name="chevronRight"
                      className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const formatCurrency = (
  amount: number,
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US');
};

interface StatusBadgeProps {
  status: string;
  config?: Record<string, StatusConfig>;
}

export const StatusBadge = ({
  status,
  config,
}: StatusBadgeProps): JSX.Element => {
  const defaultConfig: Record<string, StatusConfig> = {
    active: { label: 'Active', variant: 'success' },
    draft: { label: 'Draft', variant: 'warning' },
    filled: { label: 'Filled', variant: 'info' },
    cancelled: { label: 'Cancelled', variant: 'error' },
    completed: { label: 'Completed', variant: 'primary' },
  };

  const mergedConfig: Record<string, StatusConfig> = {
    ...defaultConfig,
    ...config,
  };
  const currentConfig: StatusConfig = mergedConfig[status] || {
    label: status,
    variant: 'primary',
  };

  return <Badge variant={currentConfig.variant}>{currentConfig.label}</Badge>;
};
