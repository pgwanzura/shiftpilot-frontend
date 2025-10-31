'use client';

import React from 'react';
import type { JSX } from 'react';
import { useState, useMemo, useRef, ReactNode, DragEvent } from 'react';
import { Button, Icon, Loader } from '@/app/components/ui';

export interface TableData {
  id: string | number;
}

export interface Column<T extends TableData> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], row: T) => ReactNode;
  width: string;
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

export interface Action<T extends TableData> {
  label: string;
  icon: ReactNode;
  onClick: (row: T) => void;
}

export interface DataTableProps<T extends TableData> {
  data: T[];
  columns: Array<Column<T>>;
  pagination?: Pagination;
  onPaginationChange?: (pagination: Pagination) => void;
  onSortChange?: (sort: SortState) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  rowClassName?: (row: T, rowIndex: number) => string;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => Array<Action<T>>;
}

export function DataTable<T extends TableData>({
  data,
  columns: initialColumns,
  pagination,
  onPaginationChange,
  onSortChange,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  rowClassName,
  onRowClick,
  actions,
}: DataTableProps<T>): JSX.Element {
  const [sort, setSort] = useState<SortState | null>(null);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [columnOrder, setColumnOrder] = useState<string[]>(
    initialColumns.map((col) => col.key as string)
  );
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(initialColumns.map((col) => col.key as string))
  );
  const [showColumnSettings, setShowColumnSettings] = useState<boolean>(false);

  const tableRef = useRef<HTMLDivElement>(null);

  const columns = useMemo((): Array<Column<T>> => {
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

  const processedData = useMemo((): T[] => {
    let result = [...data];

    if (globalFilter) {
      result = result.filter((row) =>
        columns.some((col) => {
          const value = row[col.key];
          return value
            ?.toString()
            .toLowerCase()
            .includes(globalFilter.toLowerCase());
        })
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
  }, [data, sort, globalFilter, columns]);

  const paginatedData = useMemo((): T[] => {
    if (!pagination) return processedData;
    const start = (pagination.page - 1) * pagination.pageSize;
    return processedData.slice(start, start + pagination.pageSize);
  }, [processedData, pagination]);

  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 1;

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-xs hover:shadow-md transition-all duration-300 ${className}`}
    >
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <Icon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 transition-transform duration-300 group-hover:scale-105"
              />
              <input
                type="text"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search across all records..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 placeholder-gray-400 hover:border-gray-400 group"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 group">
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full transition-transform duration-300 group-hover:scale-110" />
              <span className="font-semibold text-gray-900">
                {processedData.length}
              </span>
              <span className="text-gray-500 hidden sm:inline">records</span>
            </div>

            <Button variant="secondary-outline" size="sm">
              <Icon
                name="download"
                className="h-4 w-4 transition-transform duration-300 group-hover:scale-105"
              />
              <span className="hidden sm:inline">Export</span>
            </Button>

            <Button
              variant={showFilters ? 'primary' : 'secondary-outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Icon
                name="slidersHorizontal"
                className="h-4 w-4 transition-transform duration-300 group-hover:scale-105"
              />
              <span className="hidden sm:inline">Filters</span>
            </Button>

            <div className="relative">
              <Button
                onClick={() => setShowColumnSettings(!showColumnSettings)}
                variant={showColumnSettings ? 'primary' : 'secondary-outline'}
                size="sm"
              >
                <Icon
                  name="settings"
                  className="h-4 w-4 transition-transform duration-300 group-hover:scale-105"
                />
                <span className="hidden sm:inline">Columns</span>
              </Button>

              {showColumnSettings && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-900">
                        Columns
                      </h4>
                      <div className="flex gap-1">
                        <button
                          onClick={selectAllColumns}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
                        >
                          All
                        </button>
                        <span className="text-gray-300">•</span>
                        <button
                          onClick={deselectAllColumns}
                          className="text-xs text-gray-600 hover:text-gray-700 font-medium transition-colors duration-200"
                        >
                          None
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {initialColumns.map((column) => (
                        <label
                          key={column.key as string}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 ease-out"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <Icon
                              name="gripVertical"
                              className="h-3 w-3 text-gray-400 flex-shrink-0 transition-colors duration-200"
                            />
                            <span className="text-sm text-gray-700 flex-1 transition-colors duration-200">
                              {column.header}
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={visibleColumns.has(column.key as string)}
                            onChange={() =>
                              toggleColumnVisibility(column.key as string)
                            }
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all duration-200"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4">
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-800">
                  Advanced Filters
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-white transition-all duration-300 border border-transparent hover:border-gray-300 group"
                >
                  <Icon
                    name="x"
                    className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
                  />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {columns
                  .filter((col) => col.filterable)
                  .map((column) => (
                    <div key={column.key as string}>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        {column.header}
                      </label>
                      <input
                        type="text"
                        placeholder={`Filter ${column.header.toLowerCase()}...`}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 text-sm hover:border-gray-400"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-hidden" ref={tableRef}>
        <div className="max-h-[500px] overflow-auto">
          <div className="sticky top-0 z-10 bg-gradient-to-b from-white to-gray-50/80 backdrop-blur-sm border-b border-gray-200 min-w-fit">
            <div
              className="grid gap-3 sm:gap-4 px-4 sm:px-6 py-3 min-w-fit"
              style={{
                gridTemplateColumns: `repeat(${columns.length + 1}, minmax(100px, 1fr))`,
              }}
            >
              {columns.map((column) => (
                <div
                  key={column.key as string}
                  className={`flex items-center gap-2 group relative ${
                    sort?.key === column.key
                      ? 'bg-indigo-25 rounded-lg px-2 -mx-2'
                      : ''
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, column.key as string)}
                  onDragOver={(e) => handleDragOver(e, column.key as string)}
                  onDragEnd={handleDragEnd}
                >
                  <Icon
                    name="gripVertical"
                    className="h-3 w-3 text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity duration-200"
                  />

                  <span
                    className={`text-xs font-semibold tracking-wide truncate flex-1 ${
                      sort?.key === column.key
                        ? 'text-indigo-600'
                        : 'text-gray-700'
                    }`}
                  >
                    {column.header}
                  </span>
                  {column.sortable && (
                    <button
                      onClick={() => handleSort(column.key as string)}
                      className={`flex flex-col border rounded-md flex-shrink-0 hover:scale-105 transition-all duration-300 p-1 ${
                        sort?.key === column.key
                          ? 'bg-indigo-50 border-indigo-200 shadow-xs opacity-100'
                          : 'border-transparent hover:border-gray-200 opacity-60 hover:opacity-100'
                      } group/sort`}
                    >
                      <Icon
                        name="chevronUp"
                        className={`h-3 w-3 -mb-1 transition-colors duration-300 ${
                          sort?.key === column.key && sort.direction === 'asc'
                            ? 'text-indigo-600'
                            : 'text-gray-500 group-hover/sort:text-gray-700'
                        }`}
                      />
                      <Icon
                        name="chevronDown"
                        className={`h-3 w-3 transition-colors duration-300 ${
                          sort?.key === column.key && sort.direction === 'desc'
                            ? 'text-indigo-600'
                            : 'text-gray-500 group-hover/sort:text-gray-700'
                        }`}
                      />
                    </button>
                  )}

                  {draggedColumn === column.key && (
                    <div className="absolute inset-0 bg-indigo-50 border-2 border-indigo-300 border-dashed rounded-lg" />
                  )}
                </div>
              ))}
              <div className="text-right">
                <span className="text-xs font-semibold text-gray-700 tracking-wide">
                  Actions
                </span>
              </div>
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
                  {emptyMessage}
                </div>
              </div>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <div
                  key={row.id}
                  onMouseEnter={() => setHoveredRow(rowIndex)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => onRowClick?.(row)}
                  className={`group relative grid gap-3 sm:gap-4 px-4 sm:px-6 py-3 text-sm transition-all duration-300 border-b border-gray-100 last:border-b-0 min-w-fit ${
                    onRowClick ? 'cursor-pointer' : ''
                  } ${
                    hoveredRow === rowIndex
                      ? 'bg-indigo-50'
                      : rowIndex % 2 === 0
                        ? 'bg-white'
                        : 'bg-gray-50/30'
                  } ${rowClassName?.(row, rowIndex) || ''}`}
                  style={{
                    gridTemplateColumns: `repeat(${columns.length + 1}, minmax(100px, 1fr))`,
                  }}
                >
                  <div
                    className={`absolute left-0 top-0 h-full w-0.5 transition-colors duration-300 ${
                      hoveredRow === rowIndex
                        ? 'bg-indigo-500'
                        : rowIndex % 2 === 0
                          ? 'bg-white'
                          : 'bg-gray-50/30'
                    }`}
                  />

                  {columns.map((column) => (
                    <div
                      key={column.key as string}
                      className="flex items-center transition-all duration-300 min-w-0"
                    >
                      <div
                        className={`truncate font-medium transition-all duration-300 ${
                          hoveredRow === rowIndex
                            ? 'text-gray-900'
                            : 'text-gray-700'
                        }`}
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : (row[column.key] as ReactNode) || (
                              <span className="text-gray-400 italic">—</span>
                            )}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end">
                    <div
                      className={`flex items-center gap-1 transition-all duration-300 ${
                        hoveredRow === rowIndex ? 'opacity-100' : 'opacity-70'
                      }`}
                    >
                      {actions ? (
                        actions(row).length > 0 ? (
                          <div className="flex gap-1">
                            {actions(row).map((action, index) => (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(row);
                                }}
                                className="p-1.5 text-gray-400 hover:text-white hover:bg-indigo-500 rounded-md border border-transparent hover:border-indigo-600 transition-all duration-300 group hover:scale-105"
                                title={action.label}
                              >
                                {action.icon}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-xs hidden sm:inline transition-colors duration-300 group-hover:text-gray-500">
                            No actions
                          </span>
                        )
                      ) : (
                        <>
                          <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md border border-transparent hover:border-indigo-200 transition-all duration-300 group hover:scale-105">
                            <Icon
                              name="eye"
                              className="h-3 w-3 transition-transform duration-300 group-hover:scale-110"
                            />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md border border-transparent hover:border-emerald-200 transition-all duration-300 group hover:scale-105">
                            <Icon
                              name="edit"
                              className="h-3 w-3 transition-transform duration-300 group-hover:scale-110"
                            />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md border border-transparent hover:border-purple-200 transition-all duration-300 group hover:scale-105">
                            <Icon
                              name="moreHorizontal"
                              className="h-3 w-3 transition-transform duration-300 group-hover:scale-110"
                            />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {pagination && (
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="text-sm text-gray-600 text-center sm:text-left">
              Showing{' '}
              <span className="font-semibold text-gray-900">
                {(pagination.page - 1) * pagination.pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-gray-900">
                {Math.min(
                  pagination.page * pagination.pageSize,
                  pagination.total
                )}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-gray-900">
                {pagination.total}
              </span>{' '}
              records
            </div>

            <div className="flex items-center justify-center sm:justify-end space-x-1">
              <button
                onClick={() =>
                  onPaginationChange?.({
                    ...pagination,
                    page: pagination.page - 1,
                  })
                }
                disabled={pagination.page === 1}
                className="p-1.5 bg-white border border-gray-300 rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-all duration-300 group hover:scale-105"
              >
                <Icon
                  name="chevronLeft"
                  className="h-3 w-3 transition-transform duration-300 group-hover:-translate-x-0.5"
                />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum =
                  totalPages <= 5
                    ? i + 1
                    : pagination.page <= 3
                      ? i + 1
                      : pagination.page >= totalPages - 2
                        ? totalPages - 4 + i
                        : pagination.page - 2 + i;

                return (
                  <button
                    key={pageNum}
                    onClick={() =>
                      onPaginationChange?.({ ...pagination, page: pageNum })
                    }
                    className={`px-2.5 py-1 rounded-lg text-sm font-medium border transition-all duration-300 group ${
                      pagination.page === pageNum
                        ? 'bg-indigo-500 text-white border-indigo-500 shadow-xs'
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
                    page: pagination.page + 1,
                  })
                }
                disabled={pagination.page >= totalPages}
                className="p-1.5 bg-white border border-gray-300 rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-all duration-300 group hover:scale-105"
              >
                <Icon
                  name="chevronRight"
                  className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
