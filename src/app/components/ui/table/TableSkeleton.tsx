import React from 'react';

interface TableSkeletonProps {
  columns: number;
  hasActions: boolean;
  rowCount?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columns,
  hasActions,
  rowCount = 10,
}) => {
  const totalColumns = columns + (hasActions ? 1 : 0);

  return (
    <div className="animate-pulse">
      <div className="sticky top-0 z-10 border-b border-gray-200 min-w-full bg-gray-50">
        <div
          className="grid min-w-full py-4"
          style={{
            gridTemplateColumns: `repeat(${totalColumns}, minmax(80px, 1fr))`,
          }}
        >
          {Array.from({ length: totalColumns }).map((_, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 min-w-0 ${
                index === 0
                  ? 'pl-6 pr-3'
                  : index === totalColumns - 1
                    ? 'pl-3 pr-6'
                    : 'px-3'
              }`}
            >
              <div className="h-3 w-3 bg-gray-300 rounded flex-shrink-0" />
              <div className="h-4 bg-gray-300 rounded flex-1 max-w-[120px]" />
              <div className="h-6 w-6 bg-gray-300 rounded flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white min-w-full">
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid min-w-full py-4 border-b border-gray-100 last:border-b-0 min-w-fit border-l-4 border-l-gray-50"
            style={{
              gridTemplateColumns: `repeat(${totalColumns}, minmax(80px, 1fr))`,
            }}
          >
            {Array.from({ length: totalColumns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={`flex items-center min-w-0 ${
                  colIndex === 0
                    ? 'pl-6 pr-3'
                    : colIndex === totalColumns - 1
                      ? 'pl-3 pr-6'
                      : 'px-3'
                }`}
              >
                <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse" />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="h-4 bg-gray-300 rounded w-32 animate-pulse" />
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-1 flex-wrap">
            <div className="h-8 w-8 bg-gray-300 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-300 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-300 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-300 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
