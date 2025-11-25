import React, { useCallback, useMemo } from 'react';
import { TableData, Column, TableState } from '@/types/table';
import { Icon } from '@/app/components/ui';

interface TableHeaderProps<T extends TableData> {
  columns: Column<T>[];
  state: TableState;
  onSort: (key: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, columnKey: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, columnKey: string) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  hasActions: boolean;
  isLoading?: boolean;
  sortingColumn?: string | null;
  draggedColumn?: string | null;
  dragOverIndex?: number | null;
}

function useColumnAlignment<T extends TableData>(column: Column<T>): string {
  switch (column.align) {
    case 'right':
      return 'justify-end';
    case 'center':
      return 'justify-center';
    default:
      return 'justify-start';
  }
}

const SortIndicator = React.memo(function <T extends TableData>({
  column,
  isActive,
  isAsc,
}: {
  column: Column<T>;
  isActive: boolean;
  isAsc: boolean;
}) {
  return (
    <div
      className="flex flex-col transition-opacity duration-150"
      aria-hidden="true"
    >
      <Icon
        name="chevronUp"
        className={`h-3 w-3 -mb-0.5 transition-colors ${
          isActive && isAsc ? 'text-blue-600' : 'text-gray-400'
        }`}
      />
      <Icon
        name="chevronDown"
        className={`h-3 w-3 transition-colors ${
          isActive && !isAsc ? 'text-blue-600' : 'text-gray-400'
        }`}
      />
    </div>
  );
});
SortIndicator.displayName = 'SortIndicator';

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
  const handleSortClick = useCallback(
    (columnKey: string) => {
      if (!isLoading) {
        onSort(columnKey);
      }
    },
    [isLoading, onSort]
  );

  const handleKeySort = useCallback(
    (e: React.KeyboardEvent, columnKey: string) => {
      if (isLoading) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSort(columnKey);
      }
    },
    [isLoading, onSort]
  );

  const getSortButtonClasses = useCallback(
    (column: Column<T>): string => {
      const base =
        'flex flex-col rounded-md flex-shrink-0 p-1.5 group/sort transition-colors';
      if (isLoading) return `${base} opacity-40 cursor-not-allowed`;
      const isActive = state.sort?.key === column.key;
      if (isActive) return `${base} bg-blue-50 text-blue-600`;
      return `${base} text-gray-400 hover:text-gray-600 hover:bg-gray-50`;
    },
    [isLoading, state.sort]
  );

  const getHeaderTextClasses = useCallback(
    (column: Column<T>): string => {
      const base = 'text-sm font-semibold flex-1';
      const isSorted = state.sort?.key === column.key;
      const colorClass = isSorted ? 'text-blue-700' : 'text-gray-900';
      const wrap =
        column.wrapHeader !== false
          ? 'break-words whitespace-normal line-clamp-2 min-h-[48px] flex items-center'
          : 'truncate whitespace-nowrap h-[48px] flex items-center';
      return `${base} ${colorClass} ${wrap}`;
    },
    [state.sort]
  );

  const getColumnClasses = useCallback(
    (column: Column<T>, index: number): string => {
      const alignment = useColumnAlignment(column);
      const isSorted = state.sort?.key === column.key;
      const baseClasses = [
        'flex items-center gap-2 group relative min-w-0 transition-colors h-[48px]',
        alignment,
        sortingColumn === column.key ? 'animate-pulse' : '',
        index === 0 ? 'pl-6' : 'pl-4',
        index === columns.length - 1 && !hasActions ? 'pr-6' : 'pr-4',
        'py-3',
        'border-r border-gray-100 last:border-r-0',
      ].join(' ');
      const sortedClass = isSorted ? 'bg-blue-50/30' : '';
      return `${baseClasses} ${sortedClass}`.trim();
    },
    [columns.length, hasActions, state.sort, sortingColumn]
  );

  const getGripIconClasses = useCallback((): string => {
    const base = 'h-3.5 w-3.5 text-gray-300 flex-shrink-0 transition-opacity';
    return isLoading
      ? `${base} opacity-20 cursor-not-allowed`
      : `${base} opacity-20 group-hover:opacity-60 cursor-grab active:cursor-grabbing`;
  }, [isLoading]);

  const gridTemplate = useMemo(() => {
    return `repeat(${columns.length + (hasActions ? 1 : 0)}, minmax(80px, 1fr))`;
  }, [columns.length, hasActions]);

  return (
    <div className="sticky top-0 z-20 border-b border-gray-300 min-w-full bg-white shadow-sm">
      <div
        className="grid min-w-full"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {columns.map((column, index) => {
          const columnKey = String(column.key);
          const isFirstColumn = index === 0;
          const isLastColumn = index === columns.length - 1 && !hasActions;
          const isActive = state.sort?.key === column.key;
          const isAsc = state.sort?.direction === 'asc';

          return (
            <div
              key={columnKey}
              className={getColumnClasses(column, index)}
              draggable={!isLoading}
              onDragStart={(e) => onDragStart(e, columnKey)}
              onDragOver={(e) => onDragOver(e, columnKey)}
              onDragLeave={onDragLeave}
              onDragEnd={onDragEnd}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div role="presentation" className="flex items-center">
                  <Icon name="gripVertical" className={getGripIconClasses()} />
                </div>

                <span
                  className={getHeaderTextClasses(column)}
                  tabIndex={0}
                  onKeyDown={(e) => handleKeySort(e, columnKey)}
                  aria-sort={
                    isActive ? (isAsc ? 'ascending' : 'descending') : 'none'
                  }
                >
                  {column.header}
                </span>
              </div>

              {column.sortable && (
                <button
                  onClick={() => handleSortClick(columnKey)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSortClick(columnKey);
                    }
                  }}
                  className={getSortButtonClasses(column)}
                  disabled={isLoading}
                  type="button"
                  aria-label={`Sort by ${column.header} ${
                    isActive ? (isAsc ? 'ascending' : 'descending') : ''
                  }`}
                >
                  <SortIndicator
                    column={column}
                    isActive={isActive}
                    isAsc={isAsc}
                  />
                </button>
              )}

              {draggedColumn === columnKey && (
                <div
                  className="absolute inset-0 bg-blue-50/40 border border-blue-200 rounded-md"
                  aria-hidden="true"
                />
              )}
              {dragOverIndex === index && draggedColumn !== columnKey && (
                <div
                  className="absolute inset-0 bg-blue-50/30 border border-dashed border-blue-300 rounded-md"
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}

        {hasActions && (
          <div className="flex items-center justify-end min-w-0 pr-6 pl-4 py-3 border-gray-100 h-[48px]">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900 truncate whitespace-nowrap">
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

export default React.memo(TableHeader) as typeof TableHeader;
