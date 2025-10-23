import { CheckCircle, Eye, AlertCircle, Info } from 'lucide-react';

export interface ActivityItemProps {
  type: 'submission' | 'view' | 'reminder';
  title: string;
  description: string;
  time: string;
}

export default function ActivityItem({
  type,
  title,
  description,
  time,
}: ActivityItemProps) {
  const getIconConfig = () => {
    switch (type) {
      case 'submission':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-100',
          textColor: 'text-green-600',
        };
      case 'view':
        return {
          icon: Eye,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-600',
        };
      case 'reminder':
        return {
          icon: AlertCircle,
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-600',
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
        };
    }
  };

  const { icon: Icon, bgColor, textColor } = getIconConfig();

  return (
    <div className="px-6 py-4">
      <div className="flex items-start">
        <div
          className={`flex-shrink-0 ${bgColor} rounded-full p-2 ${textColor}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
          <p className="text-xs text-gray-400 mt-1">{time}</p>
        </div>
      </div>
    </div>
  );
}
