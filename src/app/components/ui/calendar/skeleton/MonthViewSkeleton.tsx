export function MonthViewSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-gray-700">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="bg-gray-50 dark:bg-gray-800 p-2 text-center">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-gray-700">
        {Array.from({ length: 42 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 min-h-[120px] p-2 text-left"
          >
            <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full mb-1"></div>
            <div className="space-y-1">
              <div className="h-3 rounded text-xs bg-blue-200 dark:bg-blue-800"></div>
              <div className="h-3 rounded text-xs bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
