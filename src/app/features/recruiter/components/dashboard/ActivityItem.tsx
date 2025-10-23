import { ReactNode } from 'react';

interface ActivityItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  meta: string;
  actionText: string;
  onAction: () => void;
  iconBgColor: string;
  iconColor: string;
}

export default function ActivityItem({
  icon,
  title,
  description,
  meta,
  actionText,
  onAction,
  iconBgColor,
  iconColor,
}: ActivityItemProps) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-start">
        <div
          className={`flex-shrink-0 ${iconBgColor} rounded-full p-2 ${iconColor}`}
        >
          {icon}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
          <p className="text-xs text-gray-400 mt-1">{meta}</p>
        </div>
        <div className="ml-auto">
          <button
            onClick={onAction}
            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
}
