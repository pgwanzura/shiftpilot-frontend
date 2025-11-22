'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { TableData, Column, TableConfig, SortState } from '@/types/table';
import { useTableState } from '@/hooks/useTableState';
import { useVirtualScroll } from '@/hooks/useVirtualScroll';
import { TableSkeleton } from './TableSkeleton';
import { TableHeader } from './TableHeader';
import { TableToolbar } from './TableToolbar';
import { TableBody } from './TableBody';
import { TablePagination } from './TablePagination';
import { Button, Icon, Checkbox } from '@/app/components/ui';

interface EditingState<T extends TableData> {
  rowId: string | number;
  key: keyof T;
}

interface LocalAdvancedFilters {
  [key: string]: string;
}

type StatusKey = 'active' | 'draft' | 'filled' | 'cancelled' | 'completed';
type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'primary';

const VARIANT_CLASSES: Record<StatusVariant, string> = {
  success:
    'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700',
  warning:
    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700',
  error:
    'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700',
  info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700',
  primary:
    'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700',
};

const DEFAULT_CONFIG: Record<
  StatusKey,
  { label: string; variant: StatusVariant; icon?: React.ReactNode }
> = {
  active: { label: 'Active', variant: 'success' },
  draft: { label: 'Draft', variant: 'warning' },
  filled: { label: 'Filled', variant: 'info' },
  cancelled: { label: 'Cancelled', variant: 'error' },
  completed: { label: 'Completed', variant: 'primary' },
};

export function DataTable<T extends TableData>({
  data,
  columns: initialColumns,
  pagination,
  filters = {},
  loading = false,
  error = null,
  onPaginationChange,
  onSortChange,
  onFilterChange,
  onRowClick,
  onRetry,
  onSelectionChange,
  className = '',
  rowClassName,
  emptyMessage = 'No data available',
  selectable = false,
  virtualScroll = false,
  showSearch = true,
  showColumnSettings = true,
  actions,
  bulkActions = [],
  statusFilterOptions,
  advancedFilters = [],
  title,
  description,
  exportOptions,
  inlineEdit,
  rowExpansion,
}: TableConfig<T>) {
  const [state, updateState] = useTableState({
    filters,
    columnOrder: initialColumns.map((col) => col.key as string),
    visibleColumns: new Set(initialColumns.map((col) => col.key as string)),
  });

  const [editingCell, setEditingCell] = useState<EditingState<T> | null>(null);
  const [editValue, setEditValue] = useState<T[keyof T]>();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [localAdvancedFilters, setLocalAdvancedFilters] =
    useState<LocalAdvancedFilters>({});
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [sortingColumn, setSortingColumn] = useState<string | null>(null);
  const [clickedRow, setClickedRow] = useState<number | null>(null);
  const [filterTransition, setFilterTransition] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const tableRef = useRef<HTMLDivElement>(null);

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

  const columnSettingsData = useMemo(() => {
    return initialColumns.map((col) => ({
      key: col.key as string,
      header: col.header,
      visible: state.visibleColumns.has(col.key as string),
    }));
  }, [initialColumns, state.visibleColumns]);

  const handleColumnVisibilityChange = useCallback(
    (key: string, visible: boolean) => {
      setLocalLoading(true);
      const newVisibleColumns = new Set(state.visibleColumns);

      if (visible) {
        newVisibleColumns.add(key);
      } else {
        newVisibleColumns.delete(key);
      }

      updateState({ visibleColumns: newVisibleColumns });
      setTimeout(() => setLocalLoading(false), 150);
    },
    [state.visibleColumns, updateState]
  );

  const columns = useMemo((): Column<T>[] => {
    return state.columnOrder
      .map((key) => initialColumns.find((col) => col.key === key))
      .filter((col): col is Column<T> => col !== undefined)
      .filter((col) => state.visibleColumns.has(col.key as string));
  }, [initialColumns, state.columnOrder, state.visibleColumns]);

  const processedData = useMemo((): T[] => data, [data]);

  const handleSelectionChange = useCallback(
    (newSelectedRows: Set<string | number>) => {
      updateState({ selectedRows: newSelectedRows });
      const selectedData = processedData.filter((row) =>
        newSelectedRows.has(row.id)
      );
      onSelectionChange?.(selectedData);
    },
    [processedData, updateState, onSelectionChange]
  );

  const handleSelectRow = useCallback(
    (rowId: string | number, checked: boolean) => {
      const newSelectedRows = new Set(state.selectedRows);
      if (checked) {
        newSelectedRows.add(rowId);
      } else {
        newSelectedRows.delete(rowId);
      }
      handleSelectionChange(newSelectedRows);
    },
    [state.selectedRows, handleSelectionChange]
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
            onChange={(e) => handleSelectRow(row.id, e.target.checked)}
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
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <Icon
                name={
                  state.expandedRows.has(row.id)
                    ? 'chevronDown'
                    : 'chevronRight'
                }
                className="h-4 w-4 text-gray-500 dark:text-gray-400"
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
    updateState,
    handleSelectRow,
  ]);

  const displayData = virtualScroll ? visibleData : processedData;
  const isLoading = loading || localLoading;

  const handleSort = useCallback(
    (key: string): void => {
      const column = initialColumns.find((col) => col.key === key);
      if (!column?.sortable) return;

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
        setLocalLoading(false);
      }, 300);
    },
    [state.sort, updateState, onSortChange, initialColumns]
  );

  const handleSearch = useCallback(
    (searchTerm: string): void => {
      setFilterTransition(true);
      setLocalLoading(true);
      const newFilters = { ...state.filters, search: searchTerm };
      updateState({ filters: newFilters });
      onFilterChange?.(newFilters);

      setTimeout(() => {
        setFilterTransition(false);
        setLocalLoading(false);
      }, 300);
    },
    [state.filters, updateState, onFilterChange]
  );

  const handleStatusFilter = useCallback(
    (status: string): void => {
      setFilterTransition(true);
      setLocalLoading(true);
      const newFilters = { ...state.filters, status, page: 1 };
      updateState({ filters: newFilters });
      onFilterChange?.(newFilters);

      setTimeout(() => {
        setFilterTransition(false);
        setLocalLoading(false);
      }, 300);
    },
    [state.filters, updateState, onFilterChange]
  );

  const handleClearStatusFilter = useCallback((): void => {
    setFilterTransition(true);
    setLocalLoading(true);
    const newFilters = { ...state.filters };
    delete newFilters.status;
    updateState({ filters: newFilters });
    onFilterChange?.(newFilters);

    setTimeout(() => {
      setFilterTransition(false);
      setLocalLoading(false);
    }, 300);
  }, [state.filters, updateState, onFilterChange]);

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
        const exportedRow: TableData & Record<string, unknown> = { id: row.id };
        columns.forEach((col) => {
          exportedRow[col.header] = row[col.key];
        });
        return exportedRow;
      });
      const exportColumns = columns.map((col) => ({
        ...col,
        key: col.key as string,
      })) as Column<TableData>[];
      exportOptions.onExport(format, exportData as TableData[], exportColumns);
    },
    [exportOptions, processedData, columns]
  );

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    columnKey: string
  ): void => {
    setDraggedColumn(columnKey);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.4';
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    targetColumnKey: string
  ): void => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnKey) return;

    const targetIndex = state.columnOrder.indexOf(targetColumnKey);
    setDragOverIndex(targetIndex);
    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';

    const newOrder = [...state.columnOrder];
    const draggedIndex = newOrder.indexOf(draggedColumn);
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedColumn);
    updateState({ columnOrder: newOrder });
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.currentTarget.style.background = '';
    setDragOverIndex(null);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>): void => {
    e.currentTarget.style.opacity = '';
    e.currentTarget.style.background = '';
    setDraggedColumn(null);
    setDragOverIndex(null);
  };

  const hasActiveFilters =
    !!state.filters.search ||
    (state.filters.status && state.filters.status !== 'all') ||
    Object.keys(localAdvancedFilters).length > 0;

  const handleClearFilters = useCallback(() => {
    setFilterTransition(true);
    setLocalLoading(true);
    const newFilters = {};
    updateState({ filters: newFilters });
    setLocalAdvancedFilters({});
    onFilterChange?.(newFilters);
    setTimeout(() => {
      setFilterTransition(false);
      setLocalLoading(false);
    }, 300);
  }, [updateState, onFilterChange]);

  const searchValue = useMemo(() => {
    const search = state.filters.search;
    return search ? String(search) : '';
  }, [state.filters.search]);

  const currentStatus = useMemo(() => {
    const status = state.filters.status;
    return status ? String(status) : undefined;
  }, [state.filters.status]);

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div className="text-red-600 mb-4">
          <Icon name="alertCircle" className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Failed to load data
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
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
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 w-full overflow-x-auto">
      <div className="p-4 md:p-6 min-w-[800px]">
        <div className={`space-y-4 ${className}`}>
          <TableToolbar
            title={title}
            description={description}
            isLoading={isLoading}
            selectedCount={state.selectedRows.size}
            totalCount={pagination?.total ?? processedData.length}
            bulkActions={bulkActions}
            selectedData={processedData.filter((row) =>
              state.selectedRows.has(row.id)
            )}
            columns={columnSettingsData}
            showSearch={showSearch}
            searchValue={searchValue}
            onSearch={handleSearch}
            statusFilterOptions={statusFilterOptions}
            currentStatus={currentStatus}
            onStatusChange={handleStatusFilter}
            onClearStatus={handleClearStatusFilter}
            advancedFilters={advancedFilters}
            showAdvancedFilters={showAdvancedFilters}
            onToggleAdvancedFilters={() =>
              setShowAdvancedFilters(!showAdvancedFilters)
            }
            exportOptions={exportOptions}
            onExport={handleExport}
            showColumnSettings={showColumnSettings}
            onToggleColumnSettings={() => {}}
            onRetry={onRetry}
            onColumnVisibilityChange={handleColumnVisibilityChange}
          />

          {showAdvancedFilters && advancedFilters.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {advancedFilters.map((filter) => (
                  <div key={filter.key} className="min-w-0">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                        }}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                        }}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  onClick={() => setLocalAdvancedFilters({})}
                  disabled={isLoading}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}

          <div
            className="overflow-hidden w-full rounded-lg border border-gray-200 dark:border-gray-700"
            ref={tableRef}
          >
            <div
              className={`${virtualScroll ? 'h-[500px]' : 'max-h-[500px]'} overflow-auto`}
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
                  <TableHeader
                    columns={enhancedColumns}
                    state={state}
                    onSort={handleSort}
                    onDragStart={(e, columnKey) =>
                      handleDragStart(e, columnKey)
                    }
                    onDragOver={(e, columnKey) => handleDragOver(e, columnKey)}
                    onDragLeave={handleDragLeave}
                    onDragEnd={handleDragEnd}
                    hasActions={!!actions}
                    isLoading={isLoading}
                    sortingColumn={sortingColumn}
                    draggedColumn={draggedColumn}
                    dragOverIndex={dragOverIndex}
                  />

                  <TableBody
                    data={displayData}
                    columns={enhancedColumns}
                    state={state}
                    virtualScroll={virtualScroll}
                    totalHeight={totalHeight}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    scrollVelocity={scrollVelocity}
                    actions={actions}
                    rowExpansion={rowExpansion}
                    inlineEdit={inlineEdit}
                    editingCell={editingCell}
                    editValue={editValue}
                    onEditStart={handleEditStart}
                    onEditSave={handleEditSave}
                    onEditCancel={handleEditCancel}
                    onEditValueChange={setEditValue}
                    hoveredRow={hoveredRow}
                    onHover={setHoveredRow}
                    clickedRow={clickedRow}
                    rowClassName={rowClassName}
                    emptyMessage={emptyMessage}
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                  />
                </>
              )}
            </div>
          </div>

          {pagination && (
            <TablePagination
              pagination={pagination}
              onPaginationChange={onPaginationChange}
              selectedCount={state.selectedRows.size}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export const formatCurrency = (
  amount: number | string | null | undefined,
  currency: string = 'USD'
): string => {
  const numericAmount =
    typeof amount === 'string'
      ? Number.parseFloat(amount)
      : Number(amount || 0);

  if (Number.isNaN(numericAmount) || !Number.isFinite(numericAmount)) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(0);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US');
};

interface StatusBadgeProps {
  status: string;
  config?: Partial<
    Record<
      StatusKey,
      { label: string; variant: StatusVariant; icon?: React.ReactNode }
    >
  >;
  icon?: React.ReactNode;
}

export const DataTableStatusBadge = ({
  status,
  config,
  icon,
}: StatusBadgeProps) => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  const statusConfig = Object.keys(mergedConfig).find(
    (key): key is StatusKey => key === status && key in DEFAULT_CONFIG
  );

  const currentConfig = statusConfig
    ? mergedConfig[statusConfig]
    : { label: status, variant: 'primary' as StatusVariant, icon: undefined };

  const variantClasses = VARIANT_CLASSES[currentConfig.variant];
  const displayIcon = icon || currentConfig.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses}`}
    >
      {displayIcon && <span className="flex-shrink-0">{displayIcon}</span>}
      {currentConfig.label}
    </span>
  );
};
