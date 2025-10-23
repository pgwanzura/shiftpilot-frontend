interface CreditUsageProps {
  used: number;
  total: number;
  resetDate: string;
  onManageCredits: () => void;
}

export default function CreditUsage({
  used,
  total,
  resetDate,
  onManageCredits,
}: CreditUsageProps) {
  const remaining = total - used;
  const percentage = (used / total) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Credit Usage</h2>
      </div>
      <div className="px-6 py-4">
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold">{remaining}</p>
                <p className="text-xs text-gray-500">remaining</p>
              </div>
            </div>
          </div>
          <div className="ml-6">
            <div className="flex items-center mb-2">
              <span className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></span>
              <span className="text-sm">Used: {used}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="w-3 h-3 rounded-full bg-gray-200 mr-2"></span>
              <span className="text-sm">Remaining: {remaining}</span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Monthly reset: {resetDate}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 text-right">
        <button
          onClick={onManageCredits}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Manage credits
        </button>
      </div>
    </div>
  );
}
