import { Icon } from '@/app/components/ui';

export const InteractiveStatsCard = ({
  title,
  value,
  description,
  variant = 'primary',
  icon,
  onClick,
}: {
  title: string;
  value: string | number;
  description: string;
  variant: 'primary' | 'success' | 'warning' | 'error' | 'info';
  icon: React.ReactNode;
  onClick?: () => void;
}) => {
  const variantStyles = {
    primary: 'border-blue-200 hover:border-blue-300 hover:bg-blue-50',
    success: 'border-green-200 hover:border-green-300 hover:bg-green-50',
    warning: 'border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50',
    error: 'border-red-200 hover:border-red-300 hover:bg-red-50',
    info: 'border-purple-200 hover:border-purple-300 hover:bg-purple-50',
  };

  const textColors = {
    primary: 'text-blue-700',
    success: 'text-green-700',
    warning: 'text-yellow-700',
    error: 'text-red-700',
    info: 'text-purple-700',
  };

  return (
    <div
      className={`bg-white p-6 rounded-xl border-1 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 shadow-sm hover:shadow-lg ${variantStyles[variant]} ${onClick ? 'hover:scale-105' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${textColors[variant]} bg-opacity-10`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>

      <div className="mt-4 flex items-center text-xs font-medium text-gray-500">
        <span>View details</span>
        <Icon name="chevronRight" className="h-3 w-3 ml-1" />
      </div>
    </div>
  );
};
