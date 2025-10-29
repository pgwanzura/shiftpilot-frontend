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
    primary: {
      container: 'border-blue-200 hover:border-blue-300 hover:bg-blue-50/50',
      icon: 'bg-blue-500/10 border border-blue-200/50',
      text: 'text-blue-600',
      value: 'text-blue-700',
    },
    success: {
      container: 'border-green-200 hover:border-green-300 hover:bg-green-50/50',
      icon: 'bg-green-500/10 border border-green-200/50',
      text: 'text-green-600',
      value: 'text-green-700',
    },
    warning: {
      container:
        'border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50/50',
      icon: 'bg-yellow-500/10 border border-yellow-200/50',
      text: 'text-yellow-600',
      value: 'text-yellow-700',
    },
    error: {
      container: 'border-red-200 hover:border-red-300 hover:bg-red-50/50',
      icon: 'bg-red-500/10 border border-red-200/50',
      text: 'text-red-600',
      value: 'text-red-700',
    },
    info: {
      container:
        'border-purple-200 hover:border-purple-300 hover:bg-purple-50/50',
      icon: 'bg-purple-500/10 border border-purple-200/50',
      text: 'text-purple-600',
      value: 'text-purple-700',
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <div
      className={`group bg-white p-6 rounded-xl border transition-all duration-300 cursor-pointer hover:-translate-y-0.5 shadow-xs hover:shadow-md ${currentVariant.container} ${onClick ? 'hover:scale-[1.02]' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-2.5 rounded-lg ${currentVariant.icon} ${currentVariant.text} transition-colors duration-300 group-hover:scale-105`}
        >
          {icon}
        </div>
        <div className="text-right">
          <p
            className={`text-2xl font-bold ${currentVariant.value} transition-colors duration-300`}
          >
            {value}
          </p>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-gray-800">
        {title}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed transition-colors duration-300 group-hover:text-gray-700">
        {description}
      </p>

      <div className="mt-4 flex items-center text-xs font-medium text-gray-500 transition-all duration-300 group-hover:text-gray-700 group-hover:translate-x-0.5">
        <span>View details</span>
        <Icon
          name="chevronRight"
          className="h-3 w-3 ml-1 transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </div>
    </div>
  );
};
