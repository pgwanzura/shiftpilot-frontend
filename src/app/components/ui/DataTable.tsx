'use client';

import { useState, useMemo } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Search,
  SlidersHorizontal,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  FileText,
  MoreHorizontal,
} from 'lucide-react';
import Loader from '@/app/components/ui/Loader';

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pagination,
  onPaginationChange,
  onSortChange,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  rowClassName,
  onRowClick,
  actions,
}: any) {
  const [sort, setSort] = useState<any>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const handleSort = (key: string) => {
    const newSort =
      sort?.key === key && sort.direction === 'asc'
        ? { key, direction: 'desc' }
        : { key, direction: 'asc' };

    setSort(newSort);
    onSortChange?.(newSort);
  };

  const processedData = useMemo(() => {
    let result = [...data];
    if (globalFilter) {
      result = result.filter((row) =>
        columns.some((col: any) => {
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
        const aValue = a[sort.key];
        const bValue = b[sort.key];
        if (aValue === bValue) return 0;
        const direction = sort.direction === 'asc' ? 1 : -1;
        if (aValue == null) return direction;
        if (bValue == null) return -direction;
        return aValue < bValue ? -direction : direction;
      });
    }
    return result;
  }, [data, sort, globalFilter, columns]);

  const paginatedData = useMemo(() => {
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
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          {/* Search */}
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 transition-transform duration-300 group-hover:scale-105" />
              <input
                type="text"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search across all records..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 placeholder-gray-400 hover:border-gray-400 group"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 group">
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full transition-transform duration-300 group-hover:scale-110" />
              <span className="font-semibold text-gray-900">
                {processedData.length}
              </span>
              <span className="text-gray-500 hidden sm:inline">records</span>
            </div>

            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 whitespace-nowrap group">
              <Download className="h-4 w-4 transition-transform duration-300 group-hover:scale-105" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border transition-all duration-300 whitespace-nowrap group ${
                showFilters
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4 transition-transform duration-300 group-hover:scale-105" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <div
          className={`transition-all duration-500 overflow-hidden ${
            showFilters ? 'max-h-96 mt-4' : 'max-h-0'
          }`}
        >
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-800">
                Advanced Filters
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-white transition-all duration-300 border border-transparent hover:border-gray-300 group"
              >
                <X className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {columns
                .filter((col: any) => col.filterable)
                .map((column: any) => (
                  <div key={column.key}>
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
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          {/* Header Row */}
          <div className="sticky top-0 z-10 bg-gradient-to-b from-white to-gray-50/80 backdrop-blur-sm border-b border-gray-200">
            <div className="grid grid-cols-12 gap-3 sm:gap-4 px-4 sm:px-6 py-3">
              {columns.map((column: any) => (
                <div key={column.key} className="flex items-center gap-2 group">
                  <span className="text-xs font-semibold text-gray-700 tracking-wide truncate">
                    {column.header}
                  </span>
                  {column.sortable && (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex flex-col border border-transparent hover:border-gray-200 rounded-md flex-shrink-0 hover:scale-105 transition-all duration-300 p-1 opacity-60 hover:opacity-100 group/sort"
                    >
                      <ChevronUp
                        className={`h-3 w-3 -mb-1 transition-colors duration-300 ${
                          sort?.key === column.key && sort.direction === 'asc'
                            ? 'text-indigo-600 opacity-100'
                            : 'text-gray-500 group-hover/sort:text-gray-700'
                        }`}
                      />
                      <ChevronDown
                        className={`h-3 w-3 transition-colors duration-300 ${
                          sort?.key === column.key && sort.direction === 'desc'
                            ? 'text-indigo-600 opacity-100'
                            : 'text-gray-500 group-hover/sort:text-gray-700'
                        }`}
                      />
                    </button>
                  )}
                </div>
              ))}
              <div className="col-span-1 text-right">
                <span className="text-xs font-semibold text-gray-700 tracking-wide">
                  Actions
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white">
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
                  <Search className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="text-gray-500 text-sm font-medium transition-colors duration-300 group-hover:text-gray-600">
                  {emptyMessage}
                </div>
              </div>
            ) : (
              paginatedData.map((row: any, rowIndex: number) => (
                <div
                  key={rowIndex}
                  onMouseEnter={() => setHoveredRow(rowIndex)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => onRowClick?.(row)}
                  className={`group relative grid grid-cols-12 gap-3 sm:gap-4 px-4 sm:px-6 py-3 text-sm transition-all duration-300 border-b border-gray-100 last:border-b-0 ${
                    onRowClick ? 'cursor-pointer' : ''
                  } ${
                    hoveredRow === rowIndex
                      ? 'bg-indigo-50'
                      : rowIndex % 2 === 0
                        ? 'bg-white'
                        : 'bg-gray-50/30'
                  } ${rowClassName?.(row, rowIndex) || ''}`}
                >
                  {/* Vertical line - matches row background */}
                  <div
                    className={`absolute left-0 top-0 h-full w-0.5 transition-colors duration-300 ${
                      hoveredRow === rowIndex
                        ? 'bg-indigo-500'
                        : rowIndex % 2 === 0
                          ? 'bg-white'
                          : 'bg-gray-50/30'
                    }`}
                  />

                  {columns.map((column: any, colIndex: number) => (
                    <div
                      key={colIndex}
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
                          : row[column.key] || (
                              <span className="text-gray-400 italic">—</span>
                            )}
                      </div>
                    </div>
                  ))}

                  {/* Actions */}
                  <div className="col-span-1 flex justify-end">
                    <div
                      className={`flex items-center gap-1 transition-all duration-300 ${
                        hoveredRow === rowIndex ? 'opacity-100' : 'opacity-70'
                      }`}
                    >
                      {actions ? (
                        actions(row).length > 0 ? (
                          <div className="flex gap-1">
                            {actions(row).map((action: any, index: number) => (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick();
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
                            <Eye className="h-3 w-3 transition-transform duration-300 group-hover:scale-110" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md border border-transparent hover:border-emerald-200 transition-all duration-300 group hover:scale-105">
                            <Edit className="h-3 w-3 transition-transform duration-300 group-hover:scale-110" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md border border-transparent hover:border-purple-200 transition-all duration-300 group hover:scale-105">
                            <MoreHorizontal className="h-3 w-3 transition-transform duration-300 group-hover:scale-110" />
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

      {/* Pagination */}
      {pagination && (
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="text-sm text-gray-600 text-center sm:text-left transition-colors duration-300 group-hover:text-gray-700">
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
                <ChevronLeft className="h-3 w-3 transition-transform duration-300 group-hover:-translate-x-0.5" />
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
                <ChevronRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}