import React from 'react';
import { PaginationState } from '@/types';
import { Icon } from '@/app/components/ui';

interface TablePaginationProps {
  pagination: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  selectedCount: number;
}

export function TablePagination({
  pagination,
  onPaginationChange,
  selectedCount,
}: TablePaginationProps) {
  const safePage = Math.max(1, Number(pagination?.page) || 1);
  const safePageSize = Math.max(1, Number(pagination?.pageSize) || 10);
  const safeTotal = Math.max(0, Number(pagination?.total) || 0);
  console.log('safeTotal:', safeTotal);
  const totalPages = Math.max(1, Math.ceil(safeTotal / safePageSize));

  const startRecord = safeTotal === 0 ? 0 : (safePage - 1) * safePageSize + 1;
  const endRecord = Math.min(safePage * safePageSize, safeTotal);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, safePage - 1);
      let end = Math.min(totalPages - 1, safePage + 1);

      if (safePage <= 3) {
        end = 4;
      } else if (safePage >= totalPages - 2) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push(-1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push(-2);
      }

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

  const getRecordsText = () => {
    if (safeTotal === 0) {
      return 'No records found';
    }

    const validStart = Number.isNaN(startRecord) ? 1 : startRecord;
    const validEnd = Number.isNaN(endRecord)
      ? Math.min(safePageSize, safeTotal)
      : endRecord;
    const validTotal = Number.isNaN(safeTotal) ? 0 : safeTotal;

    return `Showing ${validStart.toLocaleString()} to ${validEnd.toLocaleString()} of ${validTotal.toLocaleString()} records`;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="px-6 py-4 border-t border-gray-200 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {getRecordsText()}
          </div>
          {selectedCount > 0 && (
            <div className="text-sm text-primary-600 font-medium whitespace-nowrap bg-primary-50 px-3 py-1 rounded-md border border-primary-200">
              {selectedCount.toLocaleString()} selected
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage === 1}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200 justify-center"
            >
              <Icon name="chevronLeft" className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1 mx-2">
              {pageNumbers.map((pageNum, index) => (
                <React.Fragment key={index}>
                  {pageNum === -1 || pageNum === -2 ? (
                    <span className="px-3 py-2 text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[40px] px-3 py-2 text-sm font-medium rounded-md border transition-colors duration-200 ${
                        safePage === pageNum
                          ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage >= totalPages}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200  justify-center"
            >
              <Icon name="chevronRight" className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* {safeTotal > 0 && (
        <div className="flex items-center justify-center sm:justify-start gap-2 mt-4 pt-3 border-t border-gray-100">
          <label className="text-sm text-gray-600 whitespace-nowrap">
            Rows per page:
          </label>
          <select
            value={safePageSize}
            onChange={(e) =>
              onPaginationChange?.({
                ...pagination,
                pageSize: Number(e.target.value),
                page: 1,
              })
            }
            className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )} */}
    </div>
  );
}
