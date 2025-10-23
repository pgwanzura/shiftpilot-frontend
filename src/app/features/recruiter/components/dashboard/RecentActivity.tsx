interface ActivityItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  meta: string;
  actionText: string;
  onAction: () => void;
  iconBgColor: string;
  iconColor: string;
}

interface RecentActivityProps {
  title?: string;
  activities: ActivityItem[];
  onViewAll?: () => void;
}

export default function RecentActivity({
  title = 'Recent Activity',
  activities,
  onViewAll,
}: RecentActivityProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <div key={activity.id} className="px-6 py-4">
            <div className="flex items-start">
              <div
                className={`flex-shrink-0 rounded-full p-2 ${activity.iconBgColor}`}
              >
                <div className={activity.iconColor}>{activity.icon}</div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 mt-2">{activity.meta}</p>
              </div>
              <button
                onClick={activity.onAction}
                className="ml-4 flex-shrink-0 text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                {activity.actionText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
