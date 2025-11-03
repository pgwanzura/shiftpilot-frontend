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

  const [editingCell, setEditingCell] = useState<{
    rowId: string | number;
    key: keyof T;
  } | null>(null);
  const [editValue, setEditValue] = useState<T[keyof T]>();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [localAdvancedFilters, setLocalAdvancedFilters] = useState<
    Record<string, string>
  >({});
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

  const columns = useMemo((): Column<T>[] => {
    return state.columnOrder
      .map((key) => initialColumns.find((col) => col.key === key))
      .filter((col): col is Column<T> => col !== undefined)
      .filter((col) => state.visibleColumns.has(col.key as string));
  }, [initialColumns, state.columnOrder, state.visibleColumns]);

  //   const processedData = useMemo((): T[] => {
  //   // Since we're doing server-side filtering, just return the data as-is
  //   // Remove all client-side filtering logic
  //   return data;
  // }, [data]); // Only depend on data, not filters

  // // OR if you want to be explicit about it:
  const processedData = useMemo((): T[] => {
    console.log('📊 DataTable - Using server-side filtered data:', data.length);
    return data;
  }, [data]);

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
    updateState,
    handleSelectRow,
  ]);

  const displayData = virtualScroll ? visibleData : processedData;
  const isLoading = loading || localLoading;

  const handleSort = useCallback(
    (key: string): void => {
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
    [state.sort, updateState, onSortChange]
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
        const exportedRow: TableData & Record<string, unknown> = {
          id: row.id,
        };
        columns.forEach((col) => {
          exportedRow[col.header] = row[col.key];
        });
        return exportedRow;
      });

      // Fix: Properly handle the type conversion
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
    // Remove the unused index parameter
  ): void => {
    setDraggedColumn(columnKey);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.4';
    e.currentTarget.style.transform = 'scale(0.98)';
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
    e.currentTarget.style.borderRadius = '8px';
    e.currentTarget.style.transform = 'scale(1.02)';
    e.currentTarget.style.transition = 'all 0.2s ease';

    const newOrder = [...state.columnOrder];
    const draggedIndex = newOrder.indexOf(draggedColumn);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedColumn);

    updateState({ columnOrder: newOrder });
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.currentTarget.style.background = '';
    e.currentTarget.style.transform = '';
    setDragOverIndex(null);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>): void => {
    e.currentTarget.style.opacity = '';
    e.currentTarget.style.transform = '';
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 w-full overflow-x-auto animate-fade-in">
      <div className="p-4 md:p-6 min-w-[800px]">
        <div
          className={`space-y-4 ${className} ${filterTransition ? 'opacity-70 transition-opacity duration-300' : 'opacity-100 transition-opacity duration-300'}`}
        >
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
            showSearch={showSearch}
            searchValue={state.filters.search || ''}
            onSearch={handleSearch}
            statusFilterOptions={statusFilterOptions}
            currentStatus={state.filters.status}
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
            onToggleColumnSettings={() => {
              /* Implement column settings */
            }}
            onRetry={onRetry}
          />

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
                  }}
                  className="transform hover:scale-105 transition-all duration-200"
                  disabled={isLoading}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}

          <div
            className="overflow-hidden w-full rounded-lg border border-gray-200"
            ref={tableRef}
          >
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
  config?: Record<
    string,
    {
      label: string;
      variant:
        | 'primary'
        | 'secondary'
        | 'success'
        | 'warning'
        | 'error'
        | 'info';
    }
  >;
}

export const StatusBadge = ({ status, config }: StatusBadgeProps) => {
  const defaultConfig: Record<
    string,
    {
      label: string;
      variant:
        | 'primary'
        | 'secondary'
        | 'success'
        | 'warning'
        | 'error'
        | 'info';
    }
  > = {
    active: { label: 'Active', variant: 'success' },
    draft: { label: 'Draft', variant: 'warning' },
    filled: { label: 'Filled', variant: 'info' },
    cancelled: { label: 'Cancelled', variant: 'error' },
    completed: { label: 'Completed', variant: 'primary' },
  };

  const mergedConfig = {
    ...defaultConfig,
    ...config,
  };
  const currentConfig = mergedConfig[status] || {
    label: status,
    variant: 'primary',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${currentConfig.variant}-100 text-${currentConfig.variant}-800`}
    >
      {currentConfig.label}
    </span>
  );
};
