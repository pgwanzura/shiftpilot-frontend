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
}: TableHeaderProps<T>) {
  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 min-w-full bg-gray-50 backdrop-blur-sm bg-opacity-95">
      <div
        className="grid min-w-full py-4"
        style={{
          gridTemplateColumns: `repeat(${columns.length + (hasActions ? 1 : 0)}, minmax(80px, 1fr))`,
        }}
      >
        {columns.map((column, index) => {
          const shouldWrap = column.wrapHeader !== false;
          const isFirstColumn = index === 0;
          const isLastColumn = index === columns.length - 1 && !hasActions;

          return (
            <div
              key={column.key as string}
              className={`flex items-center gap-3 group relative min-w-0 transition-all duration-300 ${
                state.sort?.key === column.key ? 'bg-indigo-50 rounded-lg' : ''
              } ${column.align === 'right' ? 'justify-end' : column.align === 'center' ? 'justify-center' : 'justify-start'} ${
                sortingColumn === column.key ? 'animate-pulse' : ''
              } ${isFirstColumn ? 'pl-6' : 'pl-3'} ${isLastColumn ? 'pr-6' : 'pr-3'}`}
              draggable={!isLoading}
              onDragStart={(e) =>
                !isLoading && onDragStart(e, column.key as string, index)
              }
              onDragOver={(e) =>
                !isLoading && onDragOver(e, column.key as string, index)
              }
              onDragLeave={onDragLeave}
              onDragEnd={onDragEnd}
            >
              <Icon
                name="gripVertical"
                className={`h-3 w-3 text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0 opacity-40 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110 ${
                  isLoading ? 'opacity-20 cursor-not-allowed' : ''
                }`}
              />

              <span
                className={`
                  text-sm font-semibold tracking-wide flex-1 transition-colors duration-200
                  ${state.sort?.key === column.key ? 'text-indigo-700' : 'text-gray-700'}
                  ${
                    shouldWrap
                      ? 'break-words whitespace-normal line-clamp-2 min-h-[2.5rem] flex items-center'
                      : 'truncate whitespace-nowrap'
                  }
                `}
              >
                {column.header}
              </span>
              {column.sortable && (
                <button
                  onClick={() => !isLoading && onSort(column.key as string)}
                  className={`flex flex-col border rounded flex-shrink-0 hover:bg-gray-100 transition-all duration-200 p-1.5 transform hover:scale-110 ${
                    state.sort?.key === column.key
                      ? 'bg-indigo-100 border-indigo-200 opacity-100'
                      : 'border-gray-200 opacity-60 hover:opacity-100'
                  } group/sort ${
                    isLoading
                      ? 'opacity-30 cursor-not-allowed hover:bg-transparent'
                      : ''
                  }`}
                  disabled={isLoading}
                >
                  <Icon
                    name="chevronUp"
                    className={`h-3 w-3 -mb-1 transition-colors duration-200 ${
                      state.sort?.key === column.key &&
                      state.sort.direction === 'asc'
                        ? 'text-indigo-600'
                        : 'text-gray-500 group-hover/sort:text-gray-700'
                    }`}
                  />
                  <Icon
                    name="chevronDown"
                    className={`h-3 w-3 transition-colors duration-200 ${
                      state.sort?.key === column.key &&
                      state.sort.direction === 'desc'
                        ? 'text-indigo-600'
                        : 'text-gray-500 group-hover/sort:text-gray-700'
                    }`}
                  />
                </button>
              )}

              {draggedColumn === column.key && (
                <div className="absolute inset-0 bg-indigo-50 border border-indigo-300 rounded-lg animate-pulse" />
              )}
              {dragOverIndex === index && draggedColumn !== column.key && (
                <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg animate-pulse" />
              )}
            </div>
          );
        })}
        {hasActions && (
          <div className="text-right min-w-0 pr-6 pl-3">
            <span className="text-sm font-semibold text-gray-700 tracking-wide truncate whitespace-nowrap">
              Actions
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
