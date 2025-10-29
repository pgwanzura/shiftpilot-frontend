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
      className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-500 ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] outline-none transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-evenly gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="font-semibold text-gray-900">
                {processedData.length}
              </span>
              <span className="text-gray-500">records</span>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:scale-105 transition-all">
              <Download className="h-4 w-4" />
              Export
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-all hover:scale-105 ${
                showFilters
                  ? 'bg-[#0077b6] text-white border-[#0077b6]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal
                className={`h-4 w-4 transition-transform ${
                  showFilters ? 'rotate-90' : 'rotate-0'
                }`}
              />
              Filters
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <div
          className={`transition-all duration-500 overflow-hidden ${
            showFilters ? 'max-h-96 mt-6' : 'max-h-0'
          }`}
        >
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Advanced Filters
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {columns
                .filter((col: any) => col.filterable)
                .map((column: any) => (
                  <div key={column.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {column.header}
                    </label>
                    <input
                      type="text"
                      placeholder={`Filter ${column.header.toLowerCase()}...`}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0077b6] outline-none transition-all text-sm"
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
          <div className="sticky top-0 z-10 bg-gray-100 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 px-6 py-3">
              {columns.map((column: any) => (
                <div key={column.key} className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    {column.header}
                  </span>
                  {column.sortable && (
                    <button onClick={() => handleSort(column.key)}>
                      <ChevronUp
                        className={`h-3 w-3 ${
                          sort?.key === column.key && sort.direction === 'asc'
                            ? 'text-[#0077b6]'
                            : 'text-gray-400'
                        }`}
                      />
                      <ChevronDown
                        className={`h-3 w-3 ${
                          sort?.key === column.key && sort.direction === 'desc'
                            ? 'text-[#0077b6]'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                  )}
                </div>
              ))}
              <div className="col-span-1 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Actions
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white divide-y divide-gray-100">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader size="lg" showText text="Loading data..." />
              </div>
            ) : paginatedData.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <div className="text-gray-600 text-sm">{emptyMessage}</div>
              </div>
            ) : (
              paginatedData.map((row: any, rowIndex: number) => (
                <div
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`group grid grid-cols-12 gap-4 px-6 py-3 text-sm transition-all duration-300 ${
                    onRowClick ? 'cursor-pointer hover:bg-blue-50' : ''
                  } ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                    rowClassName?.(row, rowIndex) || ''
                  }`}
                >
                  {columns.map((column: any, colIndex: number) => (
                    <div key={colIndex} className="truncate">
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key] || (
                            <span className="text-gray-400 italic">—</span>
                          )}
                    </div>
                  ))}

                  <div className="col-span-1 flex justify-end gap-2 transition-all">
                    {actions ? (
                      actions(row).length > 0 ? (
                        <div className="flex gap-2 justify-evenly flex-wrap">
                          {actions(row).map((action: any, index: number) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick();
                              }}
                              className="p-2 text-gray-400 hover:text-[#0077b6] hover:bg-blue-50 rounded-lg transition-all"
                              title={action.label}
                            >
                              {action.icon}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-xs">
                          No actions
                        </span>
                      )
                    ) : (
                      <>
                        <button className="p-2 text-gray-400 hover:text-[#0077b6] hover:bg-blue-50 rounded-lg transition-all">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all">
                          <FileText className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
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

            <div className="flex items-center space-x-1">
              <button
                onClick={() =>
                  onPaginationChange?.({
                    ...pagination,
                    page: pagination.page - 1,
                  })
                }
                disabled={pagination.page === 1}
                className="p-2 border border-gray-300 rounded-xl disabled:opacity-30 hover:bg-gray-50 transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
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
                    className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${
                      pagination.page === pageNum
                        ? 'bg-[#0077b6] text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
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
                className="p-2 border border-gray-300 rounded-xl disabled:opacity-30 hover:bg-gray-50 transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
