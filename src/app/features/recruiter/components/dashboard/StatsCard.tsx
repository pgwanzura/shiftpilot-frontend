import { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconBgColor: string;
  iconColor: string;
}

export default function StatsCard({
  icon,
  title,
  value,
  subtitle,
  trend,
  iconBgColor,
  iconColor,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${iconBgColor} ${iconColor} mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">{subtitle}</span>
          {trend && (
            <span
              className={`font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
