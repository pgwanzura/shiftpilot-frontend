'use client';

import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
  JSX,
  ReactNode,
  DragEvent,
} from 'react';
import { Button, Icon, Loader, Badge, Checkbox } from '@/app/components/ui';

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

export interface TableState {
  sort: SortState | null;
  filters: FilterState;
  selectedRows: Set<string | number>;
  columnOrder: string[];
  visibleColumns: Set<string>;
  expandedRows: Set<string | number>;
}

export interface BulkAction<T extends TableData> {
  label: string;
  icon: ReactNode;
  onClick: (selectedRows: T[]) => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface ExportOptions {
  formats: ('csv' | 'excel' | 'json')[];
  onExport: (
    format: string,
    data: TableData[],
    columns: Column<TableData>[]
  ) => void;
}

export interface InlineEditConfig<T extends TableData> {
  editable?: boolean;
  onSave: (row: T, key: keyof T, value: T[keyof T]) => Promise<void> | void;
  validation?: (value: T[keyof T], row: T, key: keyof T) => string | null;
  renderEditor?: (value: T[keyof T], row: T, key: keyof T) => ReactNode;
}

export interface AdvancedFilter {
  key: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multi-select';
  label: string;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
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
  selectable?: boolean;
  bulkActions?: BulkAction<T>[];
  exportOptions?: ExportOptions;
  inlineEdit?: InlineEditConfig<T>;
  advancedFilters?: AdvancedFilter[];
  virtualScroll?: boolean;
  rowExpansion?: {
    render: (row: T) => ReactNode;
    expandable?: (row: T) => boolean;
  };
  onSelectionChange?: (selectedRows: T[]) => void;
}

interface StatusConfig {
  label: string;
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

interface StatusBadgeProps {
  status: string;
  config?: Record<string, StatusConfig>;
}

function useTableState(initialState?: Partial<TableState>) {
  const [state, setState] = useState<TableState>({
    sort: null,
    filters: {},
    selectedRows: new Set(),
    columnOrder: [],
    visibleColumns: new Set(),
    expandedRows: new Set(),
    ...initialState,
  });

  const updateState = useCallback((updates: Partial<TableState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  return [state, updateState] as const;
}

function useVirtualScroll<T extends TableData>(
  data: T[],
  itemHeight: number = 53,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const containerHeight = containerRef.current?.clientHeight || 500;
  const totalHeight = data.length * itemHeight;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    data.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleData = data.slice(startIndex, endIndex);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    containerRef,
    visibleData,
    totalHeight,
    startIndex,
    endIndex,
    handleScroll,
  };
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
  selectable = false,
  bulkActions = [],
  exportOptions,
  inlineEdit,
  advancedFilters = [],
  virtualScroll = false,
  rowExpansion,
  onSelectionChange,
}: DataTableProps<T>): JSX.Element {
  const [state, updateState] = useTableState({
    filters,
    columnOrder: initialColumns.map((col) => col.key as string),
    visibleColumns: new Set(initialColumns.map((col) => col.key as string)),
  });

  const [editingCell, setEditingCell] = useState<{
    rowId: string | number;
    key: keyof T;
  } | null>(null);
  const [editValue, setEditValue] = useState<T[keyof T]>();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [localAdvancedFilters, setLocalAdvancedFilters] = useState<
    Record<string, string>
  >({});
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [showColumnSettingsPanel, setShowColumnSettingsPanel] = useState(false);

  const tableRef = useRef<HTMLDivElement>(null);

  const virtualScrollData = virtualScroll ? data : [];
  const {
    containerRef,
    visibleData,
    totalHeight,
    startIndex,
    endIndex,
    handleScroll,
  } = useVirtualScroll(virtualScrollData, 53, 5);

  useEffect(() => {
    updateState({ filters });
  }, [filters, updateState]);

  const columns = useMemo((): Column<T>[] => {
    return state.columnOrder
      .map((key) => initialColumns.find((col) => col.key === key))
      .filter((col): col is Column<T> => col !== undefined)
      .filter((col) => state.visibleColumns.has(col.key as string));
  }, [initialColumns, state.columnOrder, state.visibleColumns]);

  const handleSort = (key: string): void => {
    const newSort: SortState =
      state.sort?.key === key && state.sort.direction === 'asc'
        ? { key, direction: 'desc' }
        : { key, direction: 'asc' };

    updateState({ sort: newSort });
    onSortChange?.(newSort);
  };

  const handleSearch = (searchTerm: string): void => {
    const newFilters = { ...state.filters, search: searchTerm };
    updateState({ filters: newFilters });
    onFilterChange?.(newFilters);
  };

  const handleStatusFilter = (status: string): void => {
    const newFilters = { ...state.filters, status, page: 1 };
    updateState({ filters: newFilters });
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

    const newOrder = [...state.columnOrder];
    const draggedIndex = newOrder.indexOf(draggedColumn);
    const targetIndex = newOrder.indexOf(targetColumnKey);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedColumn);

    updateState({ columnOrder: newOrder });
  };

  const handleDragEnd = (): void => {
    setDraggedColumn(null);
  };

  const toggleColumnVisibility = (columnKey: string): void => {
    const newVisible = new Set(state.visibleColumns);
    if (newVisible.has(columnKey)) {
      newVisible.delete(columnKey);
    } else {
      newVisible.add(columnKey);
    }
    updateState({ visibleColumns: newVisible });
  };

  const selectAllColumns = (): void => {
    updateState({
      visibleColumns: new Set(initialColumns.map((col) => col.key as string)),
    });
  };

  const deselectAllColumns = (): void => {
    updateState({ visibleColumns: new Set() });
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

    if (state.filters.search) {
      result = result.filter((row) =>
        columns.some((col) => {
          const value = row[col.key];
          return value
            ?.toString()
            .toLowerCase()
            .includes(state.filters.search!.toLowerCase());
        })
      );
    }

    if (state.filters.status && state.filters.status !== 'all') {
      result = result.filter(
        (row) => (row as { status?: string }).status === state.filters.status
      );
    }

    if (advancedFilters.length > 0) {
      result = result.filter((row) =>
        advancedFilters.every((filter) => {
          const value = row[filter.key as keyof T];
          const filterValue = localAdvancedFilters[filter.key];

          if (!filterValue) return true;

          switch (filter.type) {
            case 'text':
              return value
                ?.toString()
                .toLowerCase()
                .includes(filterValue.toLowerCase());
            case 'number':
              return Number(value) === Number(filterValue);
            case 'date':
              return (
                new Date(value as string).getTime() ===
                new Date(filterValue).getTime()
              );
            case 'select':
              return value === filterValue;
            case 'multi-select':
              return Array.isArray(filterValue)
                ? filterValue.includes(value as string)
                : false;
            default:
              return true;
          }
        })
      );
    }

    if (state.sort) {
      result.sort((a, b) => {
        const aValue = a[state.sort!.key as keyof T];
        const bValue = b[state.sort!.key as keyof T];

        if (aValue === bValue) return 0;

        const direction = state.sort!.direction === 'asc' ? 1 : -1;

        if (aValue == null) return direction;
        if (bValue == null) return -direction;

        return aValue < bValue ? -direction : direction;
      });
    }

    return result;
  }, [
    data,
    state.sort,
    state.filters,
    localAdvancedFilters,
    advancedFilters,
    columns,
  ]);

  const displayData = virtualScroll ? visibleData : processedData;

  const handleSelectRow = useCallback(
    (rowId: string | number, row: T, checked: boolean) => {
      const newSelectedRows = new Set(state.selectedRows);
      if (checked) {
        newSelectedRows.add(rowId);
      } else {
        newSelectedRows.delete(rowId);
      }
      updateState({ selectedRows: newSelectedRows });

      const selectedData = processedData.filter((row) =>
        newSelectedRows.has(row.id)
      );
      onSelectionChange?.(selectedData);
    },
    [state.selectedRows, processedData, updateState, onSelectionChange]
  );

  const handleEditStart = useCallback(
    (row: T, key: keyof T) => {
      if (!inlineEdit?.editable) return;
      setEditingCell({ rowId: row.id, key });
      setEditValue(row[key]);
    },
    [inlineEdit]
  );

  const handleEditSave = useCallback(async () => {
    if (!editingCell || !inlineEdit) return;

    const row = processedData.find((r) => r.id === editingCell.rowId);
    if (row && editValue !== undefined) {
      try {
        await inlineEdit.onSave(row, editingCell.key, editValue);
        setEditingCell(null);
      } catch (error) {
        console.error('Edit failed:', error);
      }
    }
  }, [editingCell, editValue, inlineEdit, processedData]);

  const handleEditCancel = useCallback(() => {
    setEditingCell(null);
  }, []);

  const handleExport = useCallback(
    (format: string) => {
      if (!exportOptions) return;

      const exportData = processedData.map((row) => {
        const exportedRow: TableData & Record<string, unknown> = {
          id: row.id,
        };
        columns.forEach((col) => {
          exportedRow[col.header] = row[col.key];
        });
        return exportedRow;
      });

      exportOptions.onExport(
        format,
        exportData as TableData[],
        columns as unknown as Column<TableData>[]
      );
      setShowExportMenu(false);
    },
    [exportOptions, processedData, columns]
  );

  const enhancedColumns = useMemo((): Column<T>[] => {
    const cols = [...columns];

    if (selectable) {
      cols.unshift({
        key: 'selection' as keyof T,
        header: 'Select',
        width: 'w-12',
        render: (_, row) => (
          <Checkbox
            name={`select-row-${row.id}`}
            checked={state.selectedRows.has(row.id)}
            onChange={(e) => handleSelectRow(row.id, row, e.target.checked)}
          />
        ),
      });
    }

    if (rowExpansion) {
      cols.unshift({
        key: 'expansion' as keyof T,
        header: '',
        width: 'w-12',
        render: (_, row) =>
          rowExpansion.expandable?.(row) !== false && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const newExpanded = new Set(state.expandedRows);
                if (newExpanded.has(row.id)) {
                  newExpanded.delete(row.id);
                } else {
                  newExpanded.add(row.id);
                }
                updateState({ expandedRows: newExpanded });
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
            >
              <Icon
                name={
                  state.expandedRows.has(row.id)
                    ? 'chevronDown'
                    : 'chevronRight'
                }
                className="h-4 w-4 text-gray-500"
              />
            </button>
          ),
      });
    }

    return cols;
  }, [
    columns,
    selectable,
    state.selectedRows,
    state.expandedRows,
    rowExpansion,
    handleSelectRow,
    updateState,
  ]);

  const safePaginationTotal = pagination?.total ?? 0;
  const safePaginationPage = pagination?.page ?? 1;
  const safePaginationPageSize = pagination?.pageSize ?? 10;

  const totalPages = pagination
    ? Math.ceil(safePaginationTotal / safePaginationPageSize)
    : 1;

  const getEmptyMessage = (): string => {
    if (state.filters.search) {
      return `No records found matching "${state.filters.search}". Try adjusting your search terms.`;
    }
    if (state.filters.status && state.filters.status !== 'all') {
      return `No ${state.filters.status} records found. Try changing the status filter.`;
    }
    if (Object.keys(localAdvancedFilters).length > 0) {
      return 'No records match the applied filters. Try adjusting your filter criteria.';
    }
    return emptyMessage;
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

  const hasActiveFilters =
    !!state.filters.search || Object.keys(localAdvancedFilters).length > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6">
        <div className={`space-y-4 ${className}`}>
          {(title ||
            showSearch ||
            statusFilterOptions ||
            bulkActions.length > 0 ||
            exportOptions) && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                {(title || description) && (
                  <div>
                    {title && (
                      <h2 className="text-lg font-semibold text-gray-900">
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p className="text-sm text-gray-600">
                        {pagination?.total ?? processedData.length} records
                        found
                        {state.selectedRows.size > 0 &&
                          `, ${state.selectedRows.size} selected`}
                      </p>
                    )}
                  </div>
                )}

                {state.selectedRows.size > 0 && bulkActions.length > 0 && (
                  <div className="flex items-center gap-2">
                    {bulkActions.map((action, index) => (
                      <Button
                        key={index}
                        variant={action.variant || 'secondary'}
                        size="sm"
                        onClick={() => {
                          const selectedData = processedData.filter((row) =>
                            state.selectedRows.has(row.id)
                          );
                          action.onClick(selectedData);
                        }}
                      >
                        {action.icon}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {statusFilterOptions && (
                  <div className="flex items-center gap-1">
                    {statusFilterOptions.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => handleStatusFilter(status.value)}
                        className={`relative px-4 py-1 text-sm font-medium rounded-full transition-all duration-200 ease-in-out whitespace-nowrap border ${
                          state.filters.status === status.value
                            ? `${getStatusVariant(status.value)}`
                            : 'text-gray-600 hover:text-gray-700 border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                )}

                {exportOptions && (
                  <div className="relative">
                    <Button
                      variant="secondary-outline"
                      size="sm"
                      onClick={() => setShowExportMenu(!showExportMenu)}
                    >
                      <Icon name="download" className="h-4 w-4" />
                      Export
                    </Button>

                    {showExportMenu && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                        <div className="p-2">
                          {exportOptions.formats.map((format) => (
                            <button
                              key={format}
                              onClick={() => handleExport(format)}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
                            >
                              Export as {format.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {advancedFilters.length > 0 && (
                  <Button
                    variant={
                      showAdvancedFilters ? 'primary' : 'secondary-outline'
                    }
                    size="sm"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  >
                    <Icon name="filter" className="h-4 w-4" />
                    Advanced Filters
                  </Button>
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
                      value={state.filters.search || ''}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 w-full sm:w-64"
                    />
                    {state.filters.search && (
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
                                    checked={state.visibleColumns.has(
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

          {showAdvancedFilters && advancedFilters.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {advancedFilters.map((filter) => (
                  <div key={filter.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {filter.label}
                    </label>
                    {filter.type === 'select' ? (
                      <select
                        value={localAdvancedFilters[filter.key] || ''}
                        onChange={(e) =>
                          setLocalAdvancedFilters((prev) => ({
                            ...prev,
                            [filter.key]: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                      >
                        <option value="">All</option>
                        {filter.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={filter.type === 'number' ? 'number' : 'text'}
                        placeholder={filter.placeholder}
                        value={localAdvancedFilters[filter.key] || ''}
                        onChange={(e) =>
                          setLocalAdvancedFilters((prev) => ({
                            ...prev,
                            [filter.key]: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="secondary-outline"
                  size="sm"
                  onClick={() => setLocalAdvancedFilters({})}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-hidden" ref={tableRef}>
            <div
              className={`${virtualScroll ? 'h-[500px]' : 'max-h-[500px]'} overflow-auto border border-gray-200 rounded-lg`}
              ref={virtualScroll ? containerRef : undefined}
              onScroll={virtualScroll ? handleScroll : undefined}
            >
              <div className="sticky top-0 z-10 border-b border-gray-200 min-w-fit bg-gray-50 rounded-t-lg">
                <div
                  className="grid gap-3 sm:gap-4 px-4 sm:px-6 py-3 min-w-fit"
                  style={{
                    gridTemplateColumns: `repeat(${enhancedColumns.length + (actions ? 1 : 0)}, minmax(100px, 1fr))`,
                  }}
                >
                  {enhancedColumns.map((column) => (
                    <div
                      key={column.key as string}
                      className={`flex items-center gap-2 group relative ${
                        state.sort?.key === column.key
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
                          state.sort?.key === column.key
                            ? 'text-indigo-700'
                            : 'text-gray-700'
                        }`}
                      >
                        {typeof column.header === 'string'
                          ? column.header
                          : 'Selection'}
                      </span>
                      {column.sortable && (
                        <button
                          onClick={() => handleSort(column.key as string)}
                          className={`flex flex-col border rounded flex-shrink-0 hover:bg-gray-100 transition-all duration-200 p-1 ${
                            state.sort?.key === column.key
                              ? 'bg-indigo-100 border-indigo-200 opacity-100'
                              : 'border-gray-200 opacity-60 hover:opacity-100'
                          } group/sort`}
                        >
                          <Icon
                            name="chevronUp"
                            className={`h-3 w-3 -mb-1 transition-colors duration-200 ${
                              state.sort?.key === column.key &&
                              state.sort.direction === 'asc'
                                ? 'text-indigo-600'
                                : 'text-gray-500 group-hover/sort:text-gray-700'
                            }`}
                          />
                          <Icon
                            name="chevronDown"
                            className={`h-3 w-3 transition-colors duration-200 ${
                              state.sort?.key === column.key &&
                              state.sort.direction === 'desc'
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

              <div
                className="bg-white min-w-fit"
                style={virtualScroll ? { height: totalHeight } : undefined}
              >
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
                ) : displayData.length === 0 ? (
                  <EnhancedEmptyState
                    message={getEmptyMessage()}
                    filtersActive={hasActiveFilters}
                    onClearFilters={() => {
                      updateState({ filters: {} });
                      setLocalAdvancedFilters({});
                    }}
                  />
                ) : (
                  <>
                    {virtualScroll && (
                      <div style={{ height: startIndex * 53 }} />
                    )}
                    {displayData.map((row, rowIndex) => (
                      <React.Fragment key={row.id}>
                        <EnhancedTableRow
                          row={row}
                          rowIndex={rowIndex}
                          columns={enhancedColumns}
                          editingCell={editingCell}
                          editValue={editValue}
                          onEditStart={handleEditStart}
                          onEditSave={handleEditSave}
                          onEditCancel={handleEditCancel}
                          onEditValueChange={setEditValue}
                          onRowClick={onRowClick}
                          hoveredRow={hoveredRow}
                          onHover={setHoveredRow}
                          selectable={selectable}
                          selected={state.selectedRows.has(row.id)}
                          onSelect={(checked) =>
                            handleSelectRow(row.id, row, checked)
                          }
                          inlineEdit={inlineEdit}
                          rowClassName={rowClassName}
                          actions={actions}
                        />
                        {rowExpansion && state.expandedRows.has(row.id) && (
                          <div className="border-b border-gray-100 bg-gray-50">
                            <div className="px-4 sm:px-6 py-4">
                              {rowExpansion.render(row)}
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                    {virtualScroll && (
                      <div
                        style={{
                          height: (processedData.length - endIndex) * 53,
                        }}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {pagination && (
            <EnhancedPagination
              pagination={pagination}
              onPaginationChange={onPaginationChange}
              totalPages={totalPages}
              selectedCount={state.selectedRows.size}
              safePaginationPage={safePaginationPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const EnhancedEmptyState: React.FC<{
  message: string;
  filtersActive: boolean;
  onClearFilters: () => void;
}> = ({ message, filtersActive, onClearFilters }) => (
  <div className="text-center py-12">
    <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center mx-auto mb-3">
      <Icon name="search" className="h-5 w-5 text-gray-400" />
    </div>
    <div className="text-gray-500 text-sm font-medium mb-4">{message}</div>
    {filtersActive && (
      <Button variant="secondary-outline" size="sm" onClick={onClearFilters}>
        Clear all filters
      </Button>
    )}
  </div>
);

interface EnhancedTableRowProps<T extends TableData> {
  row: T;
  rowIndex: number;
  columns: Column<T>[];
  editingCell: { rowId: string | number; key: keyof T } | null;
  editValue: T[keyof T] | undefined;
  onEditStart: (row: T, key: keyof T) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onEditValueChange: (value: T[keyof T]) => void;
  onRowClick?: (row: T) => void;
  hoveredRow: number | null;
  onHover: (index: number | null) => void;
  selectable: boolean;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  inlineEdit?: InlineEditConfig<T>;
  rowClassName?: (row: T, rowIndex: number) => string;
  actions?: (row: T) => ReactNode;
}

const EnhancedTableRowComponent = <T extends TableData>({
  row,
  rowIndex,
  columns,
  editingCell,
  editValue,
  onEditStart,
  onEditSave,
  onEditCancel,
  onEditValueChange,
  onRowClick,
  hoveredRow,
  onHover,
  inlineEdit,
  rowClassName,
  actions,
}: EnhancedTableRowProps<T>) => {
  const isEditing = editingCell?.rowId === row.id;

  return (
    <div
      onMouseEnter={() => onHover(rowIndex)}
      onMouseLeave={() => onHover(null)}
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
      {columns.map((column) => {
        const isCellEditing = isEditing && editingCell.key === column.key;

        return (
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
            {isCellEditing && inlineEdit ? (
              <InlineEditor
                value={editValue}
                onChange={onEditValueChange}
                onSave={onEditSave}
                onCancel={onEditCancel}
                renderEditor={inlineEdit.renderEditor}
                row={row}
                columnKey={column.key}
              />
            ) : (
              <div
                className={`truncate font-medium transition-all duration-200 ${
                  hoveredRow === rowIndex ? 'text-gray-900' : 'text-gray-700'
                } ${
                  inlineEdit?.editable &&
                  column.key !== 'selection' &&
                  column.key !== 'expansion'
                    ? 'cursor-text hover:bg-gray-100 rounded px-1'
                    : ''
                }`}
                onDoubleClick={() =>
                  inlineEdit?.editable &&
                  column.key !== 'selection' &&
                  column.key !== 'expansion' &&
                  onEditStart(row, column.key)
                }
              >
                {column.render
                  ? column.render(row[column.key], row)
                  : (row[column.key] as ReactNode) || (
                      <span className="text-gray-400 italic">—</span>
                    )}
              </div>
            )}
          </div>
        );
      })}

      {actions && (
        <div className="flex justify-end">
          <div
            className={`flex items-center gap-1 transition-all duration-200 ${hoveredRow === rowIndex ? 'opacity-100' : 'opacity-70'}`}
          >
            {actions(row)}
          </div>
        </div>
      )}
    </div>
  );
};

EnhancedTableRowComponent.displayName = 'EnhancedTableRow';

const EnhancedTableRow = React.memo(EnhancedTableRowComponent) as <
  T extends TableData,
>(
  props: EnhancedTableRowProps<T>
) => JSX.Element;

interface InlineEditorProps<T extends TableData> {
  value: T[keyof T] | undefined;
  onChange: (value: T[keyof T]) => void;
  onSave: () => void;
  onCancel: () => void;
  renderEditor?: (value: T[keyof T], row: T, key: keyof T) => ReactNode;
  row: T;
  columnKey: keyof T;
}

const InlineEditor = <T extends TableData>({
  value,
  onChange,
  onSave,
  onCancel,
  renderEditor,
  row,
  columnKey,
}: InlineEditorProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSave();
    if (e.key === 'Escape') onCancel();
  };

  const handleChange = (newValue: string) => {
    onChange(newValue as T[keyof T]);
  };

  if (renderEditor) {
    return (
      <div className="flex items-center gap-1 w-full">
        {renderEditor(value as T[keyof T], row, columnKey)}
        <button
          onClick={onSave}
          className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors duration-200"
        >
          <Icon name="check" className="h-3 w-3" />
        </button>
        <button
          onClick={onCancel}
          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
        >
          <Icon name="x" className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 w-full">
      <input
        ref={inputRef}
        type="text"
        value={value as string}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border border-gray-300 rounded px-2 py-1 text-sm w-full focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
      />
      <button
        onClick={onSave}
        className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors duration-200"
      >
        <Icon name="check" className="h-3 w-3" />
      </button>
      <button
        onClick={onCancel}
        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
      >
        <Icon name="x" className="h-3 w-3" />
      </button>
    </div>
  );
};

const EnhancedPagination: React.FC<{
  pagination: Pagination;
  onPaginationChange?: (pagination: Pagination) => void;
  totalPages: number;
  selectedCount: number;
  safePaginationPage: number;
}> = ({
  pagination,
  onPaginationChange,
  totalPages,
  selectedCount,
  safePaginationPage,
}) => (
  <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">
          Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
          {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
          {pagination.total} records
        </div>
        {selectedCount > 0 && (
          <div className="text-sm text-indigo-600 font-medium">
            {selectedCount} selected
          </div>
        )}
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
);

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
