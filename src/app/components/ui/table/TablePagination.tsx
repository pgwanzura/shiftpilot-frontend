import React from 'react';
import { Pagination } from '@/types/table';
import { Icon } from '@/app/components/ui';

interface TablePaginationProps {
  pagination: Pagination;
  onPaginationChange?: (pagination: Pagination) => void;
  selectedCount: number;
}

export function TablePagination({
  pagination,
  onPaginationChange,
  selectedCount,
}: TablePaginationProps) {
  const safePage = pagination?.page ?? 1;
  const safePageSize = pagination?.pageSize ?? 10;
  const safeTotal = pagination?.total ?? 0;

  const totalPages = Math.ceil(safeTotal / safePageSize);
  const startRecord = safeTotal === 0 ? 0 : (safePage - 1) * safePageSize + 1;
  const endRecord = Math.min(safePage * safePageSize, safeTotal);

  return (
    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
            {safeTotal === 0
              ? 'No records'
              : `Showing ${startRecord} to ${endRecord} of ${safeTotal} records`}
          </div>
          {selectedCount > 0 && (
            <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium whitespace-nowrap animate-pulse">
              {selectedCount} selected
            </div>
          )}
        </div>

        {safeTotal > 0 && (
          <div className="flex items-center justify-center sm:justify-end gap-1 flex-wrap">
            <button
              onClick={() =>
                onPaginationChange?.({
                  ...pagination,
                  page: safePage - 1,
                })
              }
              disabled={safePage === 1}
              className="p-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 group transform hover:scale-110"
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
                    onPaginationChange?.({ ...pagination, page: pageNum })
                  }
                  className={`px-2.5 py-1 rounded text-sm font-medium border transition-all duration-200 group whitespace-nowrap transform hover:scale-110 ${
                    safePage === pageNum
                      ? 'bg-indigo-500 text-white border-indigo-500'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
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
                  page: safePage + 1,
                })
              }
              disabled={safePage >= totalPages}
              className="p-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 group transform hover:scale-110"
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
}
