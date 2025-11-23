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
      'flex flex-col rounded-lg flex-shrink-0 p-1.5 group/sort transition-colors';
    const isActive = state.sort?.key === column.key;

    if (isLoading) {
      return `${baseClasses} opacity-40 cursor-not-allowed`;
    }

    if (isActive) {
      return `${baseClasses} bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400`;
    }

    return `${baseClasses} text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700`;
  };

  const getHeaderTextClasses = (column: Column<T>): string => {
    const baseClasses = 'text-sm font-semibold flex-1';
    const isSorted = state.sort?.key === column.key;
    const colorClass = isSorted
      ? 'text-blue-700 dark:text-blue-400'
      : 'text-gray-900 dark:text-white';
    const wrapClass =
      column.wrapHeader !== false
        ? 'break-words whitespace-normal line-clamp-2 min-h-[2.5rem] flex items-center'
        : 'truncate whitespace-nowrap';

    return `${baseClasses} ${colorClass} ${wrapClass}`;
  };

  const getColumnClasses = (column: Column<T>, index: number): string => {
    const baseClasses = [
      'flex items-center gap-2 group relative min-w-0 transition-colors',
      getColumnAlignment(column),
      sortingColumn === column.key ? 'animate-pulse' : '',
      index === 0 ? 'pl-6' : 'pl-4',
      index === columns.length - 1 && !hasActions ? 'pr-6' : 'pr-4',
      'py-3',
      'border-r border-gray-100 dark:border-gray-700 last:border-r-0',
    ].join(' ');

    const sortedClass =
      state.sort?.key === column.key ? 'bg-blue-25 dark:bg-blue-900/10' : '';

    return `${baseClasses} ${sortedClass}`;
  };

  const getGripIconClasses = (): string => {
    const baseClasses =
      'h-3.5 w-3.5 text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0 transition-colors hover:text-gray-600 dark:hover:text-gray-300';
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

  const SortIndicator = ({ column }: { column: Column<T> }) => {
    const isActive = state.sort?.key === column.key;
    const isAsc = state.sort?.direction === 'asc';

    if (!isActive) {
      return (
        <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
          <Icon name="chevronUp" className="h-3 w-3 -mb-0.5 text-gray-400" />
          <Icon name="chevronDown" className="h-3 w-3 text-gray-400" />
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        <Icon
          name="chevronUp"
          className={`h-3 w-3 -mb-0.5 transition-colors ${
            isAsc
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-400 dark:text-gray-500'
          }`}
        />
        <Icon
          name="chevronDown"
          className={`h-3 w-3 transition-colors ${
            !isAsc
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-400 dark:text-gray-500'
          }`}
        />
      </div>
    );
  };

  return (
    <div className="sticky top-0 z-20 border-b border-gray-200 dark:border-gray-700 min-w-full bg-white dark:bg-gray-900 shadow-sm">
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
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Icon name="gripVertical" className={getGripIconClasses()} />

                <span className={getHeaderTextClasses(column)}>
                  {column.header}
                </span>
              </div>

              {column.sortable && (
                <button
                  onClick={() => handleSortClick(columnKey)}
                  className={getSortButtonClasses(column)}
                  disabled={isLoading}
                  type="button"
                  aria-label={`Sort by ${column.header} ${
                    state.sort?.key === column.key
                      ? state.sort.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : ''
                  }`}
                >
                  <SortIndicator column={column} />
                </button>
              )}

              {draggedColumn === columnKey && (
                <div
                  className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-md animate-pulse"
                  aria-hidden="true"
                />
              )}
              {dragOverIndex === index && draggedColumn !== columnKey && (
                <div
                  className="absolute inset-0 bg-blue-25 dark:bg-blue-900/10 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-md animate-pulse"
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}

        {hasActions && (
          <div className="flex items-center justify-end min-w-0 pr-6 pl-4 py-3 border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-white truncate whitespace-nowrap">
                Actions
              </span>
              <Icon name="moreHorizontal" className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
