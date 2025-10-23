'use client';

import { ReactNode, useState } from 'react';
import Pagination from '@/app/components/ui/data-display/Pagination';
import { Icon } from '@/app/components/ui';
import Button from '@/app/components/ui/buttons/Button';
import { Select, SelectOption } from '@/app/components/ui';

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
  width?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  title?: string;
  data: T[];
  columns: Column<T>[];
  actions?: (row: T) => ReactNode;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  noDataMessage?: string | ReactNode;
  noDataIcon?: ReactNode;
  noDataAction?: ReactNode;
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  sortKey?: keyof T;
  sortDirection?: 'asc' | 'desc';
}

const Loader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="flex flex-col items-center space-y-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  </div>
);

function DataTable<T extends { id?: string | number }>({
  title,
  data,
  columns,
  actions,
  currentPage,
  totalPages,
  onPageChange,
  noDataMessage = 'No data available',
  noDataIcon,
  noDataAction,
  onSort,
  sortKey,
  sortDirection = 'asc',
}: DataTableProps<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof T>>(
    new Set(columns.map((col) => col.key))
  );

  const defaultNoDataIcon = (
    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
      <Icon name="database" className="h-6 w-6 text-gray-400" />
    </div>
  );

  const handlePageChange = async (page: number) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    onPageChange(page);
    setTimeout(() => setIsLoading(false), 100);
  };

  const toggleColumn = (key: keyof T) => {
    const newVisibleColumns = new Set(visibleColumns);
    if (newVisibleColumns.has(key)) {
      newVisibleColumns.delete(key);
    } else {
      newVisibleColumns.add(key);
    }
    setVisibleColumns(newVisibleColumns);
  };

  const toggleAllColumns = () => {
    if (visibleColumns.size === columns.length) {
      setVisibleColumns(new Set());
    } else {
      setVisibleColumns(new Set(columns.map((col) => col.key)));
    }
  };

  const handleSort = (key: keyof T) => {
    if (!onSort || !columns.find((col) => col.key === key)?.sortable) return;
    const newDirection =
      sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(key, newDirection);
  };

  const handleSortDirectionToggle = () => {
    if (!onSort || !sortKey) return;
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(sortKey, newDirection);
  };

  const handleSortColumnChange = (value: string) => {
    if (!onSort) return;
    if (value) {
      const key = value as keyof T;
      onSort(key, sortDirection);
    }
  };

  const filteredColumns = columns.filter((col) => visibleColumns.has(col.key));

  const sortOptions: SelectOption[] = [
    { value: '', label: 'Select column...' },
    ...columns
      .filter((col) => col.sortable)
      .map((col) => ({
        value: String(col.key),
        label: col.label,
      })),
  ];

  const renderNoDataMessage = () => {
    if (typeof noDataMessage === 'string') {
      return (
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {noDataMessage}
          </h3>
          <p className="text-gray-500">
            {`There's no data to display at the moment.`}
          </p>
        </div>
      );
    }
    return noDataMessage;
  };

  return (
    <div className="bg-white p-6 border border-gray-100 rounded-2xl w-full max-w-full overflow-hidden backdrop-blur-sm bg-white/95">
      <div className="flex justify-between items-center mb-6">
        {title && (
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {data.length > 0 && !isLoading && (
              <p className="text-sm text-gray-500 mt-1">
                {data.length} {data.length === 1 ? 'item' : 'items'} • Page{' '}
                {currentPage} of {totalPages}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center space-x-2">
          {onSort && (
            <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-1.5">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap mr-2">
                Sort by
              </span>
              <Select
                name="sort-column"
                options={sortOptions}
                value={sortKey ? String(sortKey) : ''}
                onChange={handleSortColumnChange}
                className="border-none shadow-none focus:ring-0 p-0 m-0 min-w-[140px] h-[32px] flex items-center"
                labelClassName="sr-only"
              />
              {sortKey && (
                <button
                  onClick={handleSortDirectionToggle}
                  className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-50 transition-colors duration-150 ml-1"
                  title={`Sort ${
                    sortDirection === 'asc' ? 'descending' : 'ascending'
                  }`}
                >
                  <Icon
                    name={sortDirection === 'asc' ? 'arrowUp' : 'arrowDown'}
                    className="h-3.5 w-3.5 text-indigo-600"
                  />
                </button>
              )}
            </div>
          )}

          <div className="relative">
            <Button
              onClick={() => setShowColumnDropdown(!showColumnDropdown)}
              variant="primary-outline"
              size="md"
              icon="columns"
              className="whitespace-nowrap border-gray-200 hover:border-gray-300 text-gray-700"
            >
              Columns
            </Button>

            {showColumnDropdown && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      Columns
                    </span>
                    <button
                      onClick={toggleAllColumns}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      {visibleColumns.size === columns.length
                        ? 'Deselect All'
                        : 'Select All'}
                    </button>
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {columns.map((col) => (
                    <label
                      key={String(col.key)}
                      className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns.has(col.key)}
                        onChange={() => toggleColumn(col.key)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {col.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden min-h-[200px] rounded-lg border border-gray-100 bg-white">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="w-full overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {filteredColumns.map((col) => (
                      <th
                        key={String(col.key)}
                        className={`
                          px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide
                          whitespace-nowrap
                          ${
                            col.sortable && onSort
                              ? 'cursor-pointer hover:bg-gray-100'
                              : ''
                          }
                          ${col.className || ''}
                        `}
                        style={{ width: col.width }}
                        onClick={() => col.sortable && handleSort(col.key)}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{col.label}</span>
                          {sortKey === col.key && (
                            <Icon
                              name={
                                sortDirection === 'asc'
                                  ? 'chevronUp'
                                  : 'chevronDown'
                              }
                              className="h-3.5 w-3.5 text-indigo-600 flex-shrink-0"
                            />
                          )}
                        </div>
                      </th>
                    ))}
                    {actions && visibleColumns.size > 0 && (
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide whitespace-nowrap w-28">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-100">
                  {data.length === 0 ? (
                    <tr>
                      <td
                        colSpan={filteredColumns.length + (actions ? 1 : 0)}
                        className="px-6 py-16 text-center"
                      >
                        <div className="flex flex-col items-center justify-center space-y-3 max-w-sm mx-auto">
                          <div className="text-gray-400">
                            {noDataIcon || defaultNoDataIcon}
                          </div>
                          {renderNoDataMessage()}
                          {noDataAction && noDataAction}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.map((row, index) => (
                      <tr
                        key={row.id ?? `row-${index}`}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        {filteredColumns.map((col) => (
                          <td
                            key={String(col.key)}
                            className={`
                              px-4 py-3 text-sm text-gray-900
                              ${col.render ? '' : 'truncate max-w-0'}
                            `}
                            style={{ width: col.width }}
                          >
                            <div className={`${col.render ? '' : 'truncate'}`}>
                              {col.render ? (
                                col.render(row)
                              ) : row[col.key] != null ? (
                                String(row[col.key])
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </div>
                          </td>
                        ))}
                        {actions && filteredColumns.length > 0 && (
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                            <div className="flex justify-start space-x-1">
                              {actions(row)}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {data.length > 0 && totalPages > 1 && (
        <div className="px-2 py-4 border-t border-gray-100">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            disabled={isLoading}
          />
        </div>
      )}
    </div>
  );
}

export default DataTable;
