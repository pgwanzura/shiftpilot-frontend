interface CalendarStatsProps {
  stats: {
    total: number;
    shifts: number;
    placements: number;
    interviews: number;
    timeOff: number;
    thisWeek: number;
  };
}

export function CalendarStats({ stats }: CalendarStatsProps) {
  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
        <div className="text-blue-600 dark:text-blue-400 font-bold text-2xl">
          {stats.total}
        </div>
        <div className="text-blue-700 dark:text-blue-300 text-sm mt-1">
          Total Events
        </div>
      </div>
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
        <div className="text-green-600 dark:text-green-400 font-bold text-2xl">
          {stats.shifts}
        </div>
        <div className="text-green-700 dark:text-green-300 text-sm mt-1">
          Shifts
        </div>
      </div>
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 text-center">
        <div className="text-purple-600 dark:text-purple-400 font-bold text-2xl">
          {stats.placements}
        </div>
        <div className="text-purple-700 dark:text-purple-300 text-sm mt-1">
          Placements
        </div>
      </div>
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 text-center">
        <div className="text-orange-600 dark:text-orange-400 font-bold text-2xl">
          {stats.interviews}
        </div>
        <div className="text-orange-700 dark:text-orange-300 text-sm mt-1">
          Interviews
        </div>
      </div>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
        <div className="text-yellow-600 dark:text-yellow-400 font-bold text-2xl">
          {stats.thisWeek}
        </div>
        <div className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
          This Week
        </div>
      </div>
    </div>
  );
}
