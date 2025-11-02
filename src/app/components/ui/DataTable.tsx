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
  wrapHeader?: boolean;
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
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const scrollTimer = useRef<NodeJS.Timeout>();

  const containerHeight = containerRef.current?.clientHeight || 500;
  const totalHeight = data.length * itemHeight;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    data.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleData = data.slice(startIndex, endIndex);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollTop = e.currentTarget.scrollTop;
    const velocity = currentScrollTop - lastScrollTop.current;
    setScrollVelocity(velocity);
    lastScrollTop.current = currentScrollTop;

    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }

    scrollTimer.current = setTimeout(() => {
      setScrollVelocity(0);
    }, 100);

    setScrollTop(currentScrollTop);
  }, []);

  return {
    containerRef,
    visibleData,
    totalHeight,
    startIndex,
    endIndex,
    handleScroll,
    scrollVelocity,
  };
}

const TableSkeleton: React.FC<{
  columns: number;
  hasActions: boolean;
  rowCount?: number;
}> = ({ columns, hasActions, rowCount = 10 }) => {
  const totalColumns = columns + (hasActions ? 1 : 0);
  
  return (
    <div className="animate-pulse">
      <div className="sticky top-0 z-10 border-b border-gray-200 min-w-full bg-gray-50">
        <div 
          className="grid min-w-full py-4"
          style={{
            gridTemplateColumns: `repeat(${totalColumns}, minmax(80px, 1fr))`,
          }}
        >
          {Array.from({ length: totalColumns }).map((_, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 min-w-0 ${
                index === 0 ? 'pl-6 pr-3' : 
                index === totalColumns - 1 ? 'pl-3 pr-6' : 
                'px-3'
              }`}
            >
              <div className="h-3 w-3 bg-gray-300 rounded flex-shrink-0" />
              <div className="h-4 bg-gray-300 rounded flex-1 max-w-[120px]" />
              <div className="h-6 w-6 bg-gray-300 rounded flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white min-w-full">
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid min-w-full py-4 border-b border-gray-100 last:border-b-0 min-w-fit border-l-4 border-l-gray-50"
            style={{
              gridTemplateColumns: `repeat(${totalColumns}, minmax(80px, 1fr))`,
            }}
          >
            {Array.from({ length: totalColumns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={`flex items-center min-w-0 ${
                  colIndex === 0 ? 'pl-6 pr-3' : 
                  colIndex === totalColumns - 1 ? 'pl-3 pr-6' : 
                  'px-3'
                }`}
              >
                <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse" />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="h-4 bg-gray-300 rounded w-32 animate-pulse" />
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-1 flex-wrap">
            <div className="h-8 w-8 bg-gray-300 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-300 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-300 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-300 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [sortingColumn, setSortingColumn] = useState<string | null>(null);
  const [clickedRow, setClickedRow] = useState<number | null>(null);
  const [filterTransition, setFilterTransition] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const tableRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const columnSettingsRef = useRef<HTMLDivElement>(null);
  const columnSettingsButtonRef = useRef<HTMLButtonElement>(null);

  const virtualScrollData = virtualScroll ? data : [];
  const {
    containerRef,
    visibleData,
    totalHeight,
    startIndex,
    endIndex,
    handleScroll,
    scrollVelocity,
  } = useVirtualScroll(virtualScrollData, 53, 5);

  const clearLocalLoading = useCallback(() => {
    const timer = setTimeout(() => {
      setLocalLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) {
      setLocalLoading(true);
    } else {
      clearLocalLoading();
    }
  }, [loading, clearLocalLoading]);

  useEffect(() => {
    updateState({ filters });
  }, [filters, updateState]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
      if (
        columnSettingsRef.current && 
        !columnSettingsRef.current.contains(event.target as Node) &&
        columnSettingsButtonRef.current &&
        !columnSettingsButtonRef.current.contains(event.target as Node)
      ) {
        setShowColumnSettingsPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const columns = useMemo((): Column<T>[] => {
    return state.columnOrder
      .map((key) => initialColumns.find((col) => col.key === key))
      .filter((col): col is Column<T> => col !== undefined)
      .filter((col) => state.visibleColumns.has(col.key as string));
  }, [initialColumns, state.columnOrder, state.visibleColumns]);

  const smoothScrollToTop = useCallback(() => {
    if (tableRef.current) {
      tableRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleSort = useCallback((key: string): void => {
    setSortingColumn(key);
    setLocalLoading(true);
    const newSort: SortState =
      state.sort?.key === key && state.sort.direction === 'asc'
        ? { key, direction: 'desc' }
        : { key, direction: 'asc' };

    updateState({ sort: newSort });
    onSortChange?.(newSort);

    setTimeout(() => {
      setSortingColumn(null);
      clearLocalLoading();
    }, 300);
  }, [state.sort, updateState, onSortChange, clearLocalLoading]);

  const handleSearch = useCallback((searchTerm: string): void => {
    setFilterTransition(true);
    setLocalLoading(true);
    const newFilters = { ...state.filters, search: searchTerm };
    updateState({ filters: newFilters });
    onFilterChange?.(newFilters);

    setTimeout(() => {
      smoothScrollToTop();
      setFilterTransition(false);
      clearLocalLoading();
    }, 300);
  }, [state.filters, updateState, onFilterChange, smoothScrollToTop, clearLocalLoading]);

  const handleStatusFilter = useCallback((status: string): void => {
    setFilterTransition(true);
    setLocalLoading(true);
    const newFilters = { ...state.filters, status, page: 1 };
    updateState({ filters: newFilters });
    onFilterChange?.(newFilters);
    setShowStatusDropdown(false);

    setTimeout(() => {
      smoothScrollToTop();
      setFilterTransition(false);
      clearLocalLoading();
    }, 300);
  }, [state.filters, updateState, onFilterChange, smoothScrollToTop, clearLocalLoading]);

  const handleClearStatusFilter = (): void => {
    setFilterTransition(true);
    setLocalLoading(true);
    const newFilters = { ...state.filters };
    delete newFilters.status;
    updateState({ filters: newFilters });
    onFilterChange?.(newFilters);
    setShowStatusDropdown(false);

    setTimeout(() => {
      smoothScrollToTop();
      setFilterTransition(false);
      clearLocalLoading();
    }, 300);
  };

  const handleAdvancedFilterChange = useCallback(() => {
    setLocalLoading(true);
    setTimeout(() => {
      clearLocalLoading();
    }, 300);
  }, [clearLocalLoading]);

  const getCurrentStatusLabel = (): string => {
    if (!state.filters.status) return 'All Status';
    return statusFilterOptions?.find(opt => opt.value === state.filters.status)?.label || 'All Status';
  };

  const handleDragStart = (
    e: DragEvent<HTMLDivElement>,
    columnKey: string,
    index: number
  ): void => {
    setDraggedColumn(columnKey);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.4';
    e.currentTarget.style.transform = 'scale(0.98)';
  };

  const handleDragOver = (
    e: DragEvent<HTMLDivElement>,
    targetColumnKey: string,
    index: number
  ): void => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnKey) return;

    setDragOverIndex(index);
    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';
    e.currentTarget.style.borderRadius = '8px';
    e.currentTarget.style.transform = 'scale(1.02)';
    e.currentTarget.style.transition = 'all 0.2s ease';

    const newOrder = [...state.columnOrder];
    const draggedIndex = newOrder.indexOf(draggedColumn);
    const targetIndex = newOrder.indexOf(targetColumnKey);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedColumn);

    updateState({ columnOrder: newOrder });
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.currentTarget.style.background = '';
    e.currentTarget.style.transform = '';
    setDragOverIndex(null);
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>): void => {
    e.currentTarget.style.opacity = '';
    e.currentTarget.style.transform = '';
    e.currentTarget.style.background = '';
    setDraggedColumn(null);
    setDragOverIndex(null);
  };

  const handleRowHover = useCallback((index: number | null) => {
    setHoveredRow(index);
  }, []);

  const handleEnhancedRowClick = useCallback((row: T, index: number) => {
    setClickedRow(index);
    setTimeout(() => setClickedRow(null), 600);
    onRowClick?.(row);
  }, [onRowClick]);

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
        columns as Column<TableData>[]
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
        wrapHeader: false,
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
        wrapHeader: false,
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
              className="p-1 hover:bg-gray-100 rounded transition-all duration-200 transform hover:scale-110"
            >
              <Icon
                name={
                  state.expandedRows.has(row.id)
                    ? 'chevronDown'
                    : 'chevronRight'
                }
                className="h-4 w-4 text-gray-500 transition-transform duration-200"
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

  const getEmptyMessage = (): string => {
    if (state.filters.search) {
      return `No records found matching "${state.filters.search}". Try adjusting your search terms.`;
    }
    if (state.filters.status && state.filters.status !== 'all') {
      return `No ${state.filters.status} records found. Try changing the status filter.`;
    }
    if (Object.keys(localAdvancedFilters).length > 0) {
      return `No records match the applied filters. Try adjusting your filter criteria.`;
    }
    return emptyMessage;
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center animate-fade-in">
        <div className="text-red-600 mb-4 animate-bounce">
          <Icon name="alertCircle" className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to load data
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="primary" className="animate-pulse">
            <Icon name="refreshCw" className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    );
  }

  const hasActiveFilters =
    !!state.filters.search || Object.keys(localAdvancedFilters).length > 0;

  const isLoading = loading || localLoading;

  return (
    <div className="bg-white rounded-lg border border-gray-200 w-full overflow-x-auto animate-fade-in">
      <div className="p-4 md:p-6 min-w-[800px]">
        <div className={`space-y-4 ${className} ${filterTransition ? 'opacity-70 transition-opacity duration-300' : 'opacity-100 transition-opacity duration-300'}`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 flex-1 min-w-0">
              {(title || description) && (
                <div className="min-w-0 flex-1 space-y-1">
                  {title && (
                    <h2 className="text-xl font-bold text-gray-900 truncate animate-slide-down">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-sm text-gray-600 truncate animate-slide-down animation-delay-100">
                      {!isLoading && (
                        <>
                          <span className="font-medium text-gray-900">
                            {pagination?.total ?? processedData.length}
                          </span>
                          {' records found'}
                          {!isLoading && state.selectedRows.size > 0 && (
                            <>
                              {' • '}
                              <span className="font-medium text-indigo-600">
                                {state.selectedRows.size} selected
                              </span>
                            </>
                          )}
                        </>
                      )}
                      {isLoading && (
                        <span className="text-gray-500">Loading data...</span>
                      )}
                    </p>
                  )}
                </div>
              )}

              {!isLoading && state.selectedRows.size > 0 && bulkActions.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 animate-slide-up shrink-0">
                  {bulkActions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant || 'primary'}
                      size="sm"
                      onClick={() => {
                        const selectedData = processedData.filter((row) =>
                          state.selectedRows.has(row.id)
                        );
                        action.onClick(selectedData);
                      }}
                      className="transform hover:scale-105 transition-all duration-200 shadow-sm"
                    >
                      {action.icon}
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-wrap">
              {showSearch && (
                <div className="relative w-full sm:w-auto sm:min-w-[280px] flex-1 sm:flex-none order-first sm:order-none">
                  <Icon
                    name="search"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors duration-200"
                  />
                  <input
                    type="text"
                    placeholder="Search records..."
                    value={state.filters.search || ''}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-white shadow-sm"
                    disabled={isLoading}
                  />
                  {state.filters.search && (
                    <button
                      onClick={() => handleSearch('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded hover:bg-gray-100"
                      disabled={isLoading}
                    >
                      <Icon name="x" className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                {statusFilterOptions && (
                  <div className="relative" ref={statusDropdownRef}>
                    <Button
                      variant={state.filters.status ? "primary" : "secondary-outline"}
                      size="sm"
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                      className="transform hover:scale-105 transition-all duration-200 shadow-sm"
                      disabled={isLoading}
                    >
                      <Icon name="filter" className="h-4 w-4" />
                      <span className="ml-2">{getCurrentStatusLabel()}</span>
                      <Icon 
                        name={showStatusDropdown ? "chevronUp" : "chevronDown"} 
                        className="h-4 w-4 ml-1 transition-transform duration-200" 
                      />
                    </Button>

                    {showStatusDropdown && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 animate-scale-in">
                        <div className="p-2 space-y-1">
                          <button
                            onClick={handleClearStatusFilter}
                            className={`w-full text-left px-3 py-2.5 text-sm rounded-md transition-all duration-200 flex items-center gap-2 ${
                              !state.filters.status
                                ? 'bg-indigo-50 text-indigo-700 font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Icon name="layers" className="h-4 w-4" />
                            All Status
                          </button>
                          {statusFilterOptions.map((status) => (
                            <button
                              key={status.value}
                              onClick={() => handleStatusFilter(status.value)}
                              className={`w-full text-left px-3 py-2.5 text-sm rounded-md transition-all duration-200 flex items-center gap-2 ${
                                state.filters.status === status.value
                                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <Icon name="circle" className="h-3 w-3" />
                              {status.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {advancedFilters.length > 0 && (
                  <Button
                    variant={showAdvancedFilters ? 'primary' : 'secondary-outline'}
                    size="sm"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="transform hover:scale-105 transition-all duration-200 shadow-sm"
                    disabled={isLoading}
                  >
                    <Icon name="sliders" className="h-4 w-4" />
                    <span className="ml-2">Filters</span>
                  </Button>
                )}

                {exportOptions && (
                  <div className="relative">
                    <Button
                      variant="secondary-outline"
                      size="sm"
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className="transform hover:scale-105 transition-all duration-200 shadow-sm"
                      disabled={isLoading}
                    >
                      <Icon name="download" className="h-4 w-4" />
                      <span className="ml-2">Export</span>
                    </Button>

                    {showExportMenu && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 animate-scale-in">
                        <div className="p-2 space-y-1">
                          {exportOptions.formats.map((format) => (
                            <button
                              key={format}
                              onClick={() => handleExport(format)}
                              className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200 flex items-center gap-2"
                            >
                              <Icon name="file" className="h-4 w-4" />
                              Export as {format.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 border-l border-gray-200 pl-2 ml-1">
                  {onRetry && (
                    <div className="relative group">
                      <Button
                        variant="secondary-outline"
                        size="sm"
                        onClick={onRetry}
                        disabled={isLoading}
                        className="transform hover:scale-105 transition-all duration-200 shadow-sm"
                      >
                        <Icon
                          name="refreshCw"
                          className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                        />
                      </Button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                        Refresh data
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  )}

                  {showColumnSettings && (
                    <div className="relative group">
                      <Button
                        ref={columnSettingsButtonRef}
                        onClick={() => setShowColumnSettingsPanel(!showColumnSettingsPanel)}
                        variant={showColumnSettingsPanel ? 'primary' : 'secondary-outline'}
                        size="sm"
                        className="transform hover:scale-105 transition-all duration-200 shadow-sm"
                        disabled={isLoading}
                      >
                        <Icon name="columns" className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                        Configure columns
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {showColumnSettingsPanel && (
            <div ref={columnSettingsRef} className="absolute right-6 top-24 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-scale-in">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Columns</h3>
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
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {initialColumns.map((column) => (
                    <div key={column.key as string} className="flex items-center gap-3">
                      <Checkbox
                        name={`column-${column.key as string}`}
                        checked={state.visibleColumns.has(column.key as string)}
                        onChange={() => toggleColumnVisibility(column.key as string)}
                        className="h-4 w-4"
                      />
                      <label 
                        htmlFor={`column-${column.key as string}`}
                        className="text-sm text-gray-700 flex-1 truncate"
                      >
                        {column.header}
                      </label>
                      <Icon 
                        name="gripVertical" 
                        className="h-3 w-3 text-gray-400 cursor-grab flex-shrink-0" 
                      />
                    </div>
                  ))}
                </div>
                
                <div className="pt-2 border-t border-gray-200">
                  <button
                    onClick={() => setShowColumnSettingsPanel(false)}
                    className="w-full text-center text-sm text-gray-600 hover:text-gray-700 font-medium py-2 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {showAdvancedFilters && advancedFilters.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 animate-slide-down">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {advancedFilters.map((filter) => (
                  <div key={filter.key} className="min-w-0">
                    <label className="block text-sm font-medium text-gray-700 mb-2 truncate">
                      {filter.label}
                    </label>
                    {filter.type === 'select' ? (
                      <select
                        value={localAdvancedFilters[filter.key] || ''}
                        onChange={(e) => {
                          setLocalAdvancedFilters((prev) => ({
                            ...prev,
                            [filter.key]: e.target.value,
                          }));
                          handleAdvancedFilterChange();
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 transform focus:scale-102"
                        disabled={isLoading}
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
                        onChange={(e) => {
                          setLocalAdvancedFilters((prev) => ({
                            ...prev,
                            [filter.key]: e.target.value,
                          }));
                          handleAdvancedFilterChange();
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 transform focus:scale-102"
                        disabled={isLoading}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="secondary-outline"
                  size="sm"
                  onClick={() => {
                    setLocalAdvancedFilters({});
                    handleAdvancedFilterChange();
                  }}
                  className="transform hover:scale-105 transition-all duration-200"
                  disabled={isLoading}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-hidden w-full rounded-lg border border-gray-200" ref={tableRef}>
            <div
              className={`${virtualScroll ? 'h-[500px]' : 'max-h-[500px]'} overflow-auto scroll-smooth`}
              ref={virtualScroll ? containerRef : undefined}
              onScroll={virtualScroll ? handleScroll : undefined}
            >
              {isLoading ? (
                <TableSkeleton 
                  columns={enhancedColumns.length} 
                  hasActions={!!actions}
                  rowCount={10}
                />
              ) : (
                <>
                  <div className="sticky top-0 z-10 border-b border-gray-200 min-w-full bg-gray-50 backdrop-blur-sm bg-opacity-95">
                    <div
                      className="grid min-w-full py-4"
                      style={{
                        gridTemplateColumns: `repeat(${enhancedColumns.length + (actions ? 1 : 0)}, minmax(80px, 1fr))`,
                      }}
                    >
                      {enhancedColumns.map((column, index) => {
                        const shouldWrap = column.wrapHeader !== false;
                        const isFirstColumn = index === 0;
                        const isLastColumn = index === enhancedColumns.length - 1 && !actions;
                        
                        return (
                          <div
                            key={column.key as string}
                            className={`flex items-center gap-3 group relative min-w-0 transition-all duration-300 ${
                              state.sort?.key === column.key
                                ? 'bg-indigo-50 rounded-lg'
                                : ''
                            } ${column.align === 'right' ? 'justify-end' : column.align === 'center' ? 'justify-center' : 'justify-start'} ${
                              sortingColumn === column.key ? 'animate-pulse' : ''
                            } ${isFirstColumn ? 'pl-6' : 'pl-3'} ${isLastColumn ? 'pr-6' : 'pr-3'}`}
                            draggable={!isLoading}
                            onDragStart={(e) =>
                              !isLoading && handleDragStart(e, column.key as string, index)
                            }
                            onDragOver={(e) =>
                              !isLoading && handleDragOver(e, column.key as string, index)
                            }
                            onDragLeave={handleDragLeave}
                            onDragEnd={handleDragEnd}
                          >
                            <Icon
                              name="gripVertical"
                              className={`h-3 w-3 text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0 opacity-40 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110 ${
                                isLoading ? 'opacity-20 cursor-not-allowed' : ''
                              }`}
                            />

                            <span
                              className={`
                                text-sm font-semibold tracking-wide flex-1 transition-colors duration-200
                                ${state.sort?.key === column.key ? 'text-indigo-700' : 'text-gray-700'}
                                ${shouldWrap 
                                  ? 'break-words whitespace-normal line-clamp-2 min-h-[2.5rem] flex items-center' 
                                  : 'truncate whitespace-nowrap'
                                }
                              `}
                            >
                              {typeof column.header === 'string'
                                ? column.header
                                : 'Selection'}
                            </span>
                            {column.sortable && (
                              <button
                                onClick={() => !isLoading && handleSort(column.key as string)}
                                className={`flex flex-col border rounded flex-shrink-0 hover:bg-gray-100 transition-all duration-200 p-1.5 transform hover:scale-110 ${
                                  state.sort?.key === column.key
                                    ? 'bg-indigo-100 border-indigo-200 opacity-100'
                                    : 'border-gray-200 opacity-60 hover:opacity-100'
                                } group/sort ${
                                  isLoading ? 'opacity-30 cursor-not-allowed hover:bg-transparent' : ''
                                }`}
                                disabled={isLoading}
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
                              <div className="absolute inset-0 bg-indigo-50 border border-indigo-300 rounded-lg animate-pulse" />
                            )}
                            {dragOverIndex === index && draggedColumn !== column.key && (
                              <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg animate-pulse" />
                            )}
                          </div>
                        );
                      })}
                      {actions && (
                        <div className="text-right min-w-0 pr-6 pl-3">
                          <span className="text-sm font-semibold text-gray-700 tracking-wide truncate whitespace-nowrap">
                            Actions
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className="bg-white min-w-full transition-all duration-300"
                    style={virtualScroll ? { 
                      height: totalHeight,
                      transform: `translateY(${Math.min(scrollVelocity * 0.1, 20)}px)`
                    } : undefined}
                  >
                    {displayData.length === 0 ? (
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
                              onRowClick={handleEnhancedRowClick}
                              hoveredRow={hoveredRow}
                              onHover={handleRowHover}
                              selectable={selectable}
                              selected={state.selectedRows.has(row.id)}
                              onSelect={(checked) =>
                                handleSelectRow(row.id, row, checked)
                              }
                              inlineEdit={inlineEdit}
                              rowClassName={rowClassName}
                              actions={actions}
                              clickedRow={clickedRow}
                            />
                            {rowExpansion && state.expandedRows.has(row.id) && (
                              <div className="border-b border-gray-100 bg-gray-50 min-w-full animate-slide-down">
                                <div className="px-6 py-4 min-w-0">
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

                  {pagination && (
                    <EnhancedPagination
                      pagination={pagination}
                      onPaginationChange={onPaginationChange}
                      selectedCount={state.selectedRows.size}
                    />
                  )}
                </>
              )}
            </div>
          </div>
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
  <div className="text-center py-12 animate-fade-in">
    <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center mx-auto mb-3">
      <Icon name="search" className="h-5 w-5 text-gray-400" />
    </div>
    <div className="text-gray-500 text-sm font-medium mb-4 px-4">{message}</div>
    {filtersActive && (
      <Button 
        variant="secondary-outline" 
        size="sm" 
        onClick={onClearFilters}
        className="transform hover:scale-105 transition-all duration-200"
      >
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
  onRowClick?: (row: T, index: number) => void;
  hoveredRow: number | null;
  onHover: (index: number | null) => void;
  selectable: boolean;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  inlineEdit?: InlineEditConfig<T>;
  rowClassName?: (row: T, rowIndex: number) => string;
  actions?: (row: T) => ReactNode;
  clickedRow: number | null;
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
  clickedRow,
}: EnhancedTableRowProps<T>) => {
  const isEditing = editingCell?.rowId === row.id;

  const getRowBorderColor = () => {
    if (hoveredRow === rowIndex) return 'border-l-indigo-500';
    if (rowIndex % 2 === 0) return 'border-l-gray-50';
    return 'border-l-gray-100';
  };

  const getRowBackgroundColor = () => {
    if (hoveredRow === rowIndex) return 'bg-indigo-50';
    if (rowIndex % 2 === 0) return 'bg-white';
    return 'bg-gray-50';
  };

  return (
    <div
      onMouseEnter={() => onHover(rowIndex)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onRowClick?.(row, rowIndex)}
      className={`group relative grid min-w-full py-4 text-sm transition-all duration-300 border-b border-gray-100 last:border-b-0 min-w-fit border-l-4 ${getRowBorderColor()} ${getRowBackgroundColor()} ${
        onRowClick ? 'cursor-pointer hover:bg-indigo-50' : ''
      } ${rowClassName?.(row, rowIndex) || ''} ${
        clickedRow === rowIndex ? 'animate-pulse bg-indigo-100' : ''
      }`}
      style={{
        gridTemplateColumns: `repeat(${columns.length + (actions ? 1 : 0)}, minmax(80px, 1fr))`,
        animationDelay: `${rowIndex * 20}ms`,
      }}
    >
      {columns.map((column, index) => {
        const isCellEditing = isEditing && editingCell.key === column.key;
        const isFirstColumn = index === 0;
        const isLastColumn = index === columns.length - 1 && !actions;

        return (
          <div
            key={column.key as string}
            className={`flex items-center transition-all duration-300 min-w-0 ${
              column.align === 'right'
                ? 'justify-end'
                : column.align === 'center'
                  ? 'justify-center'
                  : 'justify-start'
            } ${isFirstColumn ? 'pl-6' : 'pl-3'} ${isLastColumn ? 'pr-6' : 'pr-3'}`}
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
                className={`truncate font-medium transition-all duration-300 transform hover:scale-105 ${
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
        <div className="flex justify-end min-w-0 pr-6 pl-3">
          <div
            className={`flex items-center gap-2 transition-all duration-300 transform ${
              hoveredRow === rowIndex ? 'opacity-100 scale-110' : 'opacity-70 scale-100'
            }`}
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
      <div className="flex items-center gap-2 w-full min-w-0 animate-scale-in">
        {renderEditor(value as T[keyof T], row, columnKey)}
        <button
          onClick={onSave}
          className="p-1 text-green-600 hover:bg-green-50 rounded transition-all duration-200 transform hover:scale-110"
        >
          <Icon name="check" className="h-3 w-3" />
        </button>
        <button
          onClick={onCancel}
          className="p-1 text-red-600 hover:bg-red-50 rounded transition-all duration-200 transform hover:scale-110"
        >
          <Icon name="x" className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 w-full min-w-0 animate-scale-in">
      <input
        ref={inputRef}
        type="text"
        value={value as string}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border border-gray-300 rounded px-2 py-1 text-sm w-full min-w-0 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 transform focus:scale-105"
      />
      <button
        onClick={onSave}
        className="p-1 text-green-600 hover:bg-green-50 rounded transition-all duration-200 transform hover:scale-110"
      >
        <Icon name="check" className="h-3 w-3" />
      </button>
      <button
        onClick={onCancel}
        className="p-1 text-red-600 hover:bg-red-50 rounded transition-all duration-200 transform hover:scale-110"
      >
        <Icon name="x" className="h-3 w-3" />
      </button>
    </div>
  );
};

const EnhancedPagination: React.FC<{
  pagination?: Pagination;
  onPaginationChange?: (pagination: Pagination) => void;
  selectedCount: number;
}> = ({
  pagination,
  onPaginationChange,
  selectedCount,
}) => {
  const safePage = pagination?.page ?? 1;
  const safePageSize = pagination?.pageSize ?? 10;
  const safeTotal = pagination?.total ?? 0;

  const totalPages = Math.ceil(safeTotal / safePageSize);
  const startRecord = safeTotal === 0 ? 0 : (safePage - 1) * safePageSize + 1;
  const endRecord = Math.min(safePage * safePageSize, safeTotal);

  return (
    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {safeTotal === 0 ? 'No records' : `Showing ${startRecord} to ${endRecord} of ${safeTotal} records`}
          </div>
          {selectedCount > 0 && (
            <div className="text-sm text-indigo-600 font-medium whitespace-nowrap animate-pulse">
              {selectedCount} selected
            </div>
          )}
        </div>

        {safeTotal > 0 && (
          <div className="flex items-center justify-center sm:justify-end gap-1 flex-wrap">
            <button
              onClick={() =>
                onPaginationChange?.({
                  ...pagination!,
                  page: safePage - 1,
                })
              }
              disabled={safePage === 1}
              className="p-1.5 bg-white border border-gray-300 rounded disabled:opacity-30 hover:bg-gray-50 transition-all duration-200 group transform hover:scale-110"
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
                  : safePage <= 3
                    ? i + 1
                    : safePage >= totalPages - 2
                      ? totalPages - 4 + i
                      : safePage - 2 + i;

              return (
                <button
                  key={pageNum}
                  onClick={() =>
                    onPaginationChange?.({ ...pagination!, page: pageNum })
                  }
                  className={`px-2.5 py-1 rounded text-sm font-medium border transition-all duration-200 group whitespace-nowrap transform hover:scale-110 ${
                    safePage === pageNum
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
                  ...pagination!,
                  page: safePage + 1,
                })
              }
              disabled={safePage >= totalPages}
              className="p-1.5 bg-white border border-gray-300 rounded disabled:opacity-30 hover:bg-gray-50 transition-all duration-200 group transform hover:scale-110"
            >
              <Icon
                name="chevronRight"
                className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

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