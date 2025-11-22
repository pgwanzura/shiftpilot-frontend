import { JSX } from 'react';
import { InteractiveStatsCard } from '@/app/components/ui';
import { Icon } from '@/app/components/ui';
import { AssignmentStats as StatsType } from '@/types';
import { formatCurrency } from '../table';
import { useMemo, useCallback } from 'react';

interface AssignmentStatsProps {
  stats?: StatsType;
  loading?: boolean;
  onCardClick?: (cardType: string) => void;
}

interface StatCardConfig {
  title: string;
  value: string | number;
  description: string;
  variant: 'primary' | 'success' | 'warning' | 'error' | 'info';
  icon: JSX.Element;
  cardType: string;
}

const safeNumber = (value: number | undefined | null): number => {
  if (value === undefined || value === null || Number.isNaN(Number(value)))
    return 0;
  return Number(value);
};

const safePercentage = (value: number | undefined | null): string => {
  const num = safeNumber(value);
  return `${Math.round(num)}%`;
};

export function AssignmentStats({
  stats,
  loading = false,
  onCardClick,
}: AssignmentStatsProps) {
  const handleCardClick = useCallback(
    (cardType: string) => {
      onCardClick?.(cardType);
    },
    [onCardClick]
  );

  const statsCards: StatCardConfig[] = useMemo(() => {
    const totalAssignments = safeNumber(stats?.total_assignments);
    const activeAssignments = safeNumber(stats?.active_assignments);
    const pendingAssignments = safeNumber(stats?.pending_assignments);
    const completedAssignments = safeNumber(stats?.completed_assignments);
    const weeklyMargin = safeNumber(
      stats?.financial_summary?.total_weekly_margin
    );
    const utilizationRate = safeNumber(stats?.utilization_rate);

    return [
      {
        title: 'Total Assignments',
        value: totalAssignments,
        description: 'All assignments',
        variant: 'primary',
        icon: <Icon name="link" className="h-4 w-4" />,
        cardType: 'total',
      },
      {
        title: 'Active',
        value: activeAssignments,
        description: 'Currently active',
        variant: 'success',
        icon: <Icon name="activity" className="h-4 w-4" />,
        cardType: 'active',
      },
      {
        title: 'Pending',
        value: pendingAssignments,
        description: 'Awaiting activation',
        variant: 'warning',
        icon: <Icon name="clock" className="h-4 w-4" />,
        cardType: 'pending',
      },
      {
        title: 'Completed',
        value: completedAssignments,
        description: 'Successfully completed',
        variant: 'info',
        icon: <Icon name="checkCircle" className="h-4 w-4" />,
        cardType: 'completed',
      },
      {
        title: 'Weekly Margin',
        value: formatCurrency(weeklyMargin, 'GBP'),
        description: 'Total weekly profit',
        variant: 'success',
        icon: <Icon name="trendingUp" className="h-4 w-4" />,
        cardType: 'margin',
      },
      {
        title: 'Utilization',
        value: safePercentage(utilizationRate),
        description: 'Average utilization rate',
        variant: 'info',
        icon: <Icon name="target" className="h-4 w-4" />,
        cardType: 'utilization',
      },
    ];
  }, [stats]);

  if (loading) {
    return <AssignmentStatsSkeleton />;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statsCards.map((stat) => (
        <InteractiveStatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          variant={stat.variant}
          icon={stat.icon}
          onClick={() => handleCardClick(stat.cardType)}
          showViewDetails={!!onCardClick}
          size="md"
          className="h-full"
        />
      ))}
    </div>
  );
}

function AssignmentStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <InteractiveStatsCard
          key={`skeleton-${index}`}
          title="Loading..."
          value="0"
          description="Loading data..."
          variant="primary"
          icon={<div className="h-4 w-4" />}
          isLoading={true}
          size="md"
        />
      ))}
    </div>
  );
}
