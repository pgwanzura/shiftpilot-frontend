import { Icon } from '@/app/components/ui';

interface InteractiveStatsCardProps {
  title: string;
  value: string | number;
  description: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  icon: React.ReactNode;
  onClick?: () => void;
  showViewDetails?: boolean;
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  format?: 'number' | 'currency' | 'percentage';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  comparisonText?: string;
}

const VARIANT_STYLES = {
  primary: {
    container:
      'border-blue-200 bg-white hover:border-blue-300 hover:bg-blue-50/30',
    icon: 'bg-blue-500 text-white',
    value: 'text-gray-900',
    trendUp: 'text-green-600',
    trendDown: 'text-red-600',
    metric: 'text-blue-600',
  },
  success: {
    container:
      'border-green-200 bg-white hover:border-green-300 hover:bg-green-50/30',
    icon: 'bg-green-500 text-white',
    value: 'text-gray-900',
    trendUp: 'text-green-600',
    trendDown: 'text-red-600',
    metric: 'text-green-600',
  },
  warning: {
    container:
      'border-yellow-200 bg-white hover:border-yellow-300 hover:bg-yellow-50/30',
    icon: 'bg-yellow-500 text-white',
    value: 'text-gray-900',
    trendUp: 'text-green-600',
    trendDown: 'text-red-600',
    metric: 'text-yellow-600',
  },
  error: {
    container:
      'border-red-200 bg-white hover:border-red-300 hover:bg-red-50/30',
    icon: 'bg-red-500 text-white',
    value: 'text-gray-900',
    trendUp: 'text-green-600',
    trendDown: 'text-red-600',
    metric: 'text-red-600',
  },
  info: {
    container:
      'border-purple-200 bg-white hover:border-purple-300 hover:bg-purple-50/30',
    icon: 'bg-purple-500 text-white',
    value: 'text-gray-900',
    trendUp: 'text-green-600',
    trendDown: 'text-red-600',
    metric: 'text-purple-600',
  },
} as const;

const SIZE_STYLES = {
  sm: {
    container: 'p-3 rounded-lg',
    icon: 'p-1.5 rounded-md',
    value: 'text-xl font-semibold',
    title: 'text-sm font-medium mb-1',
    description: 'text-xs leading-snug',
  },
  md: {
    container: 'p-4 rounded-xl',
    icon: 'p-2 rounded-lg',
    value: 'text-2xl font-semibold',
    title: 'text-base font-medium mb-1',
    description: 'text-sm leading-tight',
  },
  lg: {
    container: 'p-5 rounded-xl',
    icon: 'p-2.5 rounded-lg',
    value: 'text-3xl font-semibold',
    title: 'text-lg font-medium mb-2',
    description: 'text-base leading-relaxed',
  },
} as const;

const getClassName = (...classes: string[]): string =>
  classes.filter(Boolean).join(' ').replace(/\s+/g, ' ');

export const InteractiveStatsCard = ({
  title,
  value,
  description,
  variant = 'primary',
  icon,
  onClick,
  showViewDetails = true,
  className = '',
  trend,
  trendValue,
  isLoading = false,
  size = 'md',
  comparisonText,
}: InteractiveStatsCardProps) => {
  const currentVariant = VARIANT_STYLES[variant];
  const currentSize = SIZE_STYLES[size];
  const isClickable = !!onClick;

  const getTrendIcon = () => {
    if (trend === 'up') return <Icon name="trendingUp" className="h-4 w-4" />;
    if (trend === 'down')
      return <Icon name="trendingDown" className="h-4 w-4" />;
    return null;
  };

  if (isLoading) {
    return (
      <div
        className={getClassName(
          'border-2 bg-gray-100 animate-pulse',
          currentSize.container,
          className
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className={getClassName('bg-gray-300 rounded-lg', currentSize.icon)}
          >
            <div className="w-4 h-4" />
          </div>
          <div className="h-6 bg-gray-300 rounded w-16" />
        </div>
        <div className="h-4 bg-gray-300 rounded mb-2 w-3/4" />
        <div className="h-3 bg-gray-300 rounded w-full" />
      </div>
    );
  }

  return (
    <div
      className={getClassName(
        'group border transition-all duration-200 ease-out bg-white',
        currentSize.container,
        currentVariant.container,
        isClickable ? 'cursor-pointer hover:shadow-md' : '',
        className
      )}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={isClickable ? `View ${title} statistics` : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={getClassName(
            'flex items-center justify-center transition-colors duration-200',
            currentSize.icon,
            currentVariant.icon
          )}
        >
          {icon}
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 justify-end">
            {trend && (
              <div
                className={getClassName(
                  'flex items-center',
                  trend === 'up'
                    ? currentVariant.trendUp
                    : currentVariant.trendDown
                )}
              >
                {getTrendIcon()}
              </div>
            )}
            <p className={getClassName('text-gray-900', currentSize.value)}>
              {value}
            </p>
          </div>
          {trendValue && (
            <p
              className={getClassName(
                'text-xs font-medium mt-0.5',
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trendValue}
            </p>
          )}
        </div>
      </div>

      <h3
        className={getClassName('text-gray-900 font-medium', currentSize.title)}
      >
        {title}
      </h3>

      <p className={getClassName('text-gray-600', currentSize.description)}>
        {description}
      </p>

      {comparisonText && (
        <p className="text-xs text-gray-500 mt-2">{comparisonText}</p>
      )}

      {showViewDetails && isClickable && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
            <span>View details</span>
            <Icon
              name="chevronRight"
              className="h-3 w-3 ml-1 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveStatsCard;
