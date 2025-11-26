'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { TableData, Column, TableConfig, SortState } from '@/types/table';
import { useTableState } from '@/hooks/useTableState';
import { useTableSorting } from '@/hooks/datatable/useTableSorting';
import { useTableFiltering } from '@/hooks/datatable/useTableFiltering';
import { useTablePagination } from '@/hooks/datatable/useTablePagination';
import { useColumnDragging } from '@/hooks/datatable/useColumnDragging';
import { TableSkeleton } from './TableSkeleton';
import { TableHeader } from './TableHeader';
import { TableToolbar } from './TableToolbar';
import { TableBody } from './TableBody';
import { TablePagination } from './TablePagination';
import { AdvancedFiltersPanel } from './AdvancedFiltersPanel';
import { Button, Checkbox } from '@/app/components/ui';

const Icon = ({
  name,
  className = '',
}: {
  name: string;
  className?: string;
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center w-4 h-4 ${className}`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
};

interface EditingState<T extends TableData> {
  rowId: string | number;
  key: keyof T;
}

type StatusKey = 'active' | 'draft' | 'filled' | 'cancelled' | 'completed';
type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'primary';

const VARIANT_CLASSES: Record<StatusVariant, string> = {
  success: 'bg-green-100 text-green-800 border border-green-300',
  warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  error: 'bg-red-100 text-red-800 border border-red-300',
  info: 'bg-blue-100 text-blue-800 border border-blue-300',
  primary: 'bg-purple-100 text-purple-800 border border-purple-300',
};

const DEFAULT_CONFIG: Record<
  StatusKey,
  { label: string; variant: StatusVariant }
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
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [clickedRow, setClickedRow] = useState<number | null>(null);

  const tableRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { sortingColumn, sortLoading, handleSort } = useTableSorting(
    state.sort,
    (newSort) => {
      updateState({ sort: newSort });
      onSortChange?.(newSort);
    }
  );

  const {
    filterLoading,
    localAdvancedFilters,
    showAdvancedFilters,
    hasActiveFilters,
    searchValue,
    currentStatus,
    handleSearch,
    handleStatusFilter,
    handleClearStatusFilter,
    handleClearFilters,
    setLocalAdvancedFilters,
    setShowAdvancedFilters,
    setFilterLoading,
  } = useTableFiltering(state.filters, onFilterChange);

  const {
    draggedColumn,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDragEnd,
  } = useColumnDragging(state.columnOrder, updateState);

  const columnSettingsData = useMemo(() => {
    return initialColumns.map((col) => ({
      key: col.key as string,
      header: col.header,
      visible: state.visibleColumns.has(col.key as string),
    }));
  }, [initialColumns, state.visibleColumns]);

  const handleColumnVisibilityChange = useCallback(
    (key: string, visible: boolean) => {
      setFilterLoading(true);
      const newVisibleColumns = new Set(state.visibleColumns);

      if (visible) {
        newVisibleColumns.add(key);
      } else {
        newVisibleColumns.delete(key);
      }

      updateState({ visibleColumns: newVisibleColumns });
      setTimeout(() => setFilterLoading(false), 150);
    },
    [state.visibleColumns, updateState, setFilterLoading]
  );

  const columns = useMemo((): Column<T>[] => {
    return state.columnOrder
      .map((key) => initialColumns.find((col) => col.key === key))
      .filter((col): col is Column<T> => col !== undefined)
      .filter((col) => state.visibleColumns.has(col.key as string));
  }, [initialColumns, state.columnOrder, state.visibleColumns]);

  const processedData = useMemo(() => {
    if (!state.sort) return data;
    const { key, direction } = state.sort;

    return [...data].sort((a, b) => {
      const aValue = a[key as keyof T];
      const bValue = b[key as keyof T];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      if (aStr < bStr) return direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, state.sort]);

  const { normalizedPagination, paginatedData } = useTablePagination(
    pagination,
    processedData
  );

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
              className="p-1 hover:bg-gray-100 rounded transition-colors"
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
    updateState,
    handleSelectRow,
  ]);

  const isLoading = loading || sortLoading || filterLoading;

  if (error) {
    return (
      <div className="bg-white rounded-md border border-gray-200 p-8 text-center">
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

  console.log('DataTable pagination props:', {
    incomingPagination: pagination,
    normalizedPagination: normalizedPagination,
    dataLength: data.length,
    totalPages: Math.ceil(
      normalizedPagination.total / normalizedPagination.pageSize
    ),
  });

  return (
    <div className="bg-white rounded-md border border-gray-300 w-full overflow-hidden">
      <div className="min-w-[800px]">
        <div className={`space-y-4 ${className}`}>
          <div className="p-6">
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
              onExport={() => {}}
              showColumnSettings={showColumnSettings}
              onToggleColumnSettings={() => {}}
              onRetry={onRetry}
              onColumnVisibilityChange={handleColumnVisibilityChange}
            />
          </div>

          {showAdvancedFilters && advancedFilters.length > 0 && (
            <AdvancedFiltersPanel
              advancedFilters={advancedFilters}
              localAdvancedFilters={localAdvancedFilters}
              setLocalAdvancedFilters={setLocalAdvancedFilters}
              isLoading={isLoading}
            />
          )}

          <div
            className="overflow-hidden border-t border-gray-200"
            ref={tableRef}
          >
            <div
              className="max-h-[600px] overflow-auto"
              ref={scrollContainerRef}
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
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDragEnd={handleDragEnd}
                    hasActions={!!actions}
                    isLoading={isLoading}
                    sortingColumn={sortingColumn}
                    draggedColumn={draggedColumn}
                    dragOverIndex={dragOverIndex}
                  />

                  <TableBody
                    data={paginatedData}
                    columns={enhancedColumns}
                    state={state}
                    onRowClick={onRowClick}
                    actions={actions}
                    rowExpansion={rowExpansion}
                    inlineEdit={inlineEdit}
                    editingCell={editingCell}
                    editValue={editValue}
                    onEditStart={() => {}}
                    onEditSave={() => {}}
                    onEditCancel={() => {}}
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
            {pagination && (
              <div className="sticky bottom-0 bg-white border-t border-gray-200 z-20">
                <TablePagination
                  pagination={normalizedPagination}
                  onPaginationChange={onPaginationChange}
                  selectedCount={state.selectedRows.size}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const formatCurrency = (
  amount: number | string | null | undefined,
  currency: string = 'GBP'
): string => {
  const numericAmount =
    typeof amount === 'string'
      ? Number.parseFloat(amount)
      : Number(amount || 0);

  if (Number.isNaN(numericAmount) || !Number.isFinite(numericAmount)) {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(0);
  }

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-GB');
};

interface StatusBadgeProps {
  status: string;
  config?: Partial<
    Record<StatusKey, { label: string; variant: StatusVariant }>
  >;
  icon?: React.ReactNode;
}

export const DataTableStatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  config,
  icon,
}) => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  const statusConfig = Object.keys(mergedConfig).find(
    (key): key is StatusKey => key === status && key in DEFAULT_CONFIG
  );

  const currentConfig = statusConfig
    ? mergedConfig[statusConfig]
    : { label: status, variant: 'primary' as StatusVariant };

  const variantClasses = VARIANT_CLASSES[currentConfig.variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {currentConfig.label}
    </span>
  );
};
