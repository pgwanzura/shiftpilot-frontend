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
  // Safe defaults with proper type checking
  const safePage = Math.max(1, Number(pagination?.page) || 1);
  const safePageSize = Math.max(1, Number(pagination?.pageSize) || 10);
  const safeTotal = Math.max(0, Number(pagination?.total) || 0);

  // Calculate total pages safely
  const totalPages = Math.max(1, Math.ceil(safeTotal / safePageSize));

  // Calculate start and end records safely
  const startRecord = safeTotal === 0 ? 0 : (safePage - 1) * safePageSize + 1;
  const endRecord = Math.min(safePage * safePageSize, safeTotal);

  // Generate page numbers with proper logic
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of middle pages
      let start = Math.max(2, safePage - 1);
      let end = Math.min(totalPages - 1, safePage + 1);

      // Adjust if we're at the beginning
      if (safePage <= 3) {
        end = 4;
      }
      // Adjust if we're at the end
      else if (safePage >= totalPages - 2) {
        start = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push(-1); // -1 represents ellipsis
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push(-2); // -2 represents ellipsis
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPaginationChange?.({
        ...pagination,
        page: newPage,
      });
    }
  };

  // Format the records text safely
  const getRecordsText = () => {
    if (safeTotal === 0) {
      return 'No records found';
    }

    // Ensure we have valid numbers
    const validStart = Number.isNaN(startRecord) ? 1 : startRecord;
    const validEnd = Number.isNaN(endRecord)
      ? Math.min(safePageSize, safeTotal)
      : endRecord;
    const validTotal = Number.isNaN(safeTotal) ? 0 : safeTotal;

    return `Showing ${validStart.toLocaleString()} to ${validEnd.toLocaleString()} of ${validTotal.toLocaleString()} records`;
  };

  return (
    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Records info and selection count */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
            {getRecordsText()}
          </div>
          {selectedCount > 0 && (
            <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium whitespace-nowrap bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded">
              {selectedCount.toLocaleString()} selected
            </div>
          )}
        </div>

        {/* Pagination controls - only show if we have pages */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center sm:justify-end gap-2">
            {/* Previous page button */}
            <button
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage === 1}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Icon name="chevronLeft" className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((pageNum, index) => (
                <React.Fragment key={index}>
                  {pageNum === -1 || pageNum === -2 ? (
                    <span className="px-2 py-1 text-gray-500 dark:text-gray-400">
                      ...
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[40px] px-3 py-2 text-sm font-medium rounded-lg border transition-colors duration-200 ${
                        safePage === pageNum
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Next page button */}
            <button
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage >= totalPages}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <span className="hidden sm:inline">Next</span>
              <Icon name="chevronRight" className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Page size selector */}
      {safeTotal > 0 && (
        <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
          <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
            Rows per page:
          </label>
          <select
            value={safePageSize}
            onChange={(e) =>
              onPaginationChange?.({
                ...pagination,
                pageSize: Number(e.target.value),
                page: 1, // Reset to first page when changing page size
              })
            }
            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
