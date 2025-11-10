export function WeekViewSkeleton() {
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
      <div className="grid grid-cols-8 gap-px bg-gray-100 dark:bg-gray-700">
        <div className="bg-gray-50 dark:bg-gray-800"></div>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="bg-gray-50 dark:bg-gray-800 p-2 text-center">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto mt-1"></div>
          </div>
        ))}
        {Array.from({ length: 24 }).map((_, hour) => (
          <div key={`time-${hour}`} className="contents">
            <div className="bg-white dark:bg-gray-800 p-2 text-right text-sm text-gray-500 dark:text-gray-400 border-r border-gray-100 dark:border-gray-700">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 inline-block"></div>
            </div>
            {Array.from({ length: 7 }).map((_, day) => (
              <div
                key={`${hour}-${day}`}
                className="bg-white dark:bg-gray-800 min-h-[60px] p-1 relative border-b border-gray-100 dark:border-gray-700"
              >
                <div className="absolute inset-1 bg-gray-200 dark:bg-gray-700 rounded flex items-start p-2">
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
