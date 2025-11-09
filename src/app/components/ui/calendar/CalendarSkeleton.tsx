// components/CalendarSkeleton.tsx
export function CalendarSkeleton() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 animate-pulse">
      {/* Main Calendar Area */}
      <div className="xl:col-span-3 space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex space-x-1">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
            <div className="w-48 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1 gap-1">
            <div className="w-20 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="w-20 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="w-20 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="flex flex-wrap gap-3 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-24 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"
            ></div>
          ))}
        </div>

        {/* Calendar View Skeleton */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="p-4 text-center">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mx-auto w-8"></div>
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {[...Array(42)].map((_, i) => (
              <div
                key={i}
                className="h-36 p-2 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                </div>
                <div className="space-y-1">
                  {[...Array(3)].map((_, j) => (
                    <div
                      key={j}
                      className="h-6 bg-gray-200 dark:bg-gray-700 rounded"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Date Events Skeleton */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar Skeleton */}
      <div className="xl:col-span-1 space-y-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
