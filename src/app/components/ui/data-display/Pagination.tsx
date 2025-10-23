'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) => {
  const pages: number[] = Array.from({ length: totalPages }, (_, i) => i + 1);

  const baseClasses =
    'inline-flex items-center justify-center px-4 py-2 text-sm font-medium border rounded-md h-10 transition-colors duration-200';
  const inactiveClasses =
    'bg-white border-gray-300 text-gray-500 hover:bg-gray-50';
  const activeClasses = 'bg-indigo-50 border-indigo-500 text-indigo-600';
  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';

  return (
    <div className="bg-white px-6 py-4 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span> pages
        </div>
        <nav className="flex items-center space-x-1">
          <button
            type="button"
            disabled={currentPage === 1 || disabled}
            onClick={() => onPageChange(currentPage - 1)}
            className={`${baseClasses} ${inactiveClasses} ${
              currentPage === 1 || disabled ? disabledClasses : ''
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="hidden sm:flex space-x-1">
            {pages.map((page) => (
              <button
                key={page}
                type="button"
                disabled={disabled}
                onClick={() => onPageChange(page)}
                className={`${baseClasses} ${
                  page === currentPage ? activeClasses : inactiveClasses
                } ${disabled ? disabledClasses : ''}`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={currentPage === totalPages || disabled}
            onClick={() => onPageChange(currentPage + 1)}
            className={`${baseClasses} ${inactiveClasses} ${
              currentPage === totalPages || disabled ? disabledClasses : ''
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
