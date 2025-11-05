import React from 'react';
import { TableData, Column, TableState } from '@/types/table';
import { Icon } from '@/app/components/ui';

interface TableHeaderProps<T extends TableData> {
  columns: Column<T>[];
  state: TableState;
  onSort: (key: string) => void;
  onDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    columnKey: string,
    index: number
  ) => void;
  onDragOver: (
    e: React.DragEvent<HTMLDivElement>,
    columnKey: string,
    index: number
  ) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  hasActions: boolean;
  isLoading?: boolean;
  sortingColumn?: string | null;
  draggedColumn?: string | null;
  dragOverIndex?: number | null;
}

export function TableHeader<T extends TableData>({
  columns,
  state,
  onSort,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDragEnd,
  hasActions,
  isLoading = false,
  sortingColumn,
  draggedColumn,
  dragOverIndex,
}: TableHeaderProps<T>): React.JSX.Element {
  const getColumnAlignment = (column: Column<T>): string => {
    switch (column.align) {
      case 'right':
        return 'justify-end';
      case 'center':
        return 'justify-center';
      default:
        return 'justify-start';
    }
  };

  const getSortButtonClasses = (column: Column<T>): string => {
    const baseClasses =
      'flex flex-col rounded-lg flex-shrink-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 p-1.5 group/sort';
    const isActive = state.sort?.key === column.key;

    if (isLoading) {
      return `${baseClasses} opacity-40 cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent`;
    }

    if (isActive) {
      return `${baseClasses} bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-xs`;
    }

    return `${baseClasses} text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:shadow-xs`;
  };

  const getHeaderTextClasses = (column: Column<T>): string => {
    const baseClasses =
      'text-sm font-semibold flex-1 transition-colors duration-200';
    const isSorted = state.sort?.key === column.key;
    const colorClass = isSorted
      ? 'text-primary-700 dark:text-primary-400'
      : 'text-gray-900 dark:text-white';
    const wrapClass =
      column.wrapHeader !== false
        ? 'break-words whitespace-normal line-clamp-2 min-h-[2.5rem] flex items-center'
        : 'truncate whitespace-nowrap';

    return `${baseClasses} ${colorClass} ${wrapClass}`;
  };

  const getColumnClasses = (column: Column<T>, index: number): string => {
    const baseClasses = [
      'flex items-center gap-2 group relative min-w-0 transition-all duration-200',
      getColumnAlignment(column),
      sortingColumn === column.key ? 'animate-pulse' : '',
      index === 0 ? 'pl-6' : 'pl-4',
      index === columns.length - 1 && !hasActions ? 'pr-6' : 'pr-4',
      'py-3',
      'border-r border-gray-100 dark:border-gray-700 last:border-r-0',
    ].join(' ');

    const sortedClass =
      state.sort?.key === column.key
        ? 'bg-primary-25 dark:bg-primary-900/10'
        : '';

    return `${baseClasses} ${sortedClass}`;
  };

  const getGripIconClasses = (): string => {
    const baseClasses =
      'h-3.5 w-3.5 text-gray-300 dark:text-gray-600 cursor-grab active:cursor-grabbing flex-shrink-0 transition-all duration-200 hover:text-gray-500 dark:hover:text-gray-400';
    return isLoading
      ? `${baseClasses} opacity-30 cursor-not-allowed`
      : baseClasses;
  };

  const handleSortClick = (columnKey: string): void => {
    if (!isLoading) {
      onSort(columnKey);
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    columnKey: string,
    index: number
  ): void => {
    if (!isLoading) {
      onDragStart(e, columnKey, index);
    }
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    columnKey: string,
    index: number
  ): void => {
    if (!isLoading) {
      onDragOver(e, columnKey, index);
    }
  };

  return (
    <div className="sticky top-0 z-20 border-b border-gray-100 dark:border-gray-700 min-w-full bg-white dark:bg-gray-900 shadow-xs">
      <div
        className="grid min-w-full"
        style={{
          gridTemplateColumns: `repeat(${columns.length + (hasActions ? 1 : 0)}, minmax(80px, 1fr))`,
        }}
      >
        {columns.map((column, index) => {
          const columnKey = String(column.key);
          const isFirstColumn = index === 0;
          const isLastColumn = index === columns.length - 1 && !hasActions;

          return (
            <div
              key={columnKey}
              className={getColumnClasses(column, index)}
              draggable={!isLoading}
              onDragStart={(e) => handleDragStart(e, columnKey, index)}
              onDragOver={(e) => handleDragOver(e, columnKey, index)}
              onDragLeave={onDragLeave}
              onDragEnd={onDragEnd}
            >
              <Icon name="gripVertical" className={getGripIconClasses()} />

              <span className={getHeaderTextClasses(column)}>
                {column.header}
              </span>

              {column.sortable && (
                <button
                  onClick={() => handleSortClick(columnKey)}
                  className={getSortButtonClasses(column)}
                  disabled={isLoading}
                  type="button"
                  aria-label={`Sort by ${column.header} ${state.sort?.key === column.key ? (state.sort.direction === 'asc' ? 'ascending' : 'descending') : ''}`}
                >
                  <Icon
                    name="chevronUp"
                    className={`h-3 w-3 -mb-0.5 transition-colors duration-200 ${
                      state.sort?.key === columnKey &&
                      state.sort.direction === 'asc'
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-current opacity-60 group-hover/sort:opacity-100'
                    }`}
                  />
                  <Icon
                    name="chevronDown"
                    className={`h-3 w-3 transition-colors duration-200 ${
                      state.sort?.key === columnKey &&
                      state.sort.direction === 'desc'
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-current opacity-60 group-hover/sort:opacity-100'
                    }`}
                  />
                </button>
              )}

              {draggedColumn === columnKey && (
                <div
                  className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-700 rounded-md animate-pulse"
                  aria-hidden="true"
                />
              )}
              {dragOverIndex === index && draggedColumn !== columnKey && (
                <div
                  className="absolute inset-0 bg-primary-25 dark:bg-primary-900/10 border-2 border-dashed border-primary-300 dark:border-primary-600 rounded-md animate-pulse"
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}

        {hasActions && (
          <div className="flex items-center justify-end min-w-0 pr-6 pl-4 py-3 border-gray-100 dark:border-gray-700">
            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate whitespace-nowrap">
              Actions
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
