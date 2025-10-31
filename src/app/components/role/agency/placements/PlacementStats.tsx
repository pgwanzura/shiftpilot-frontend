'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Icon,
  Skeleton,
} from '@/app/components/ui';

interface PlacementStatsProps {
  stats: {
    total_placements?: number;
    active_placements?: number;
    pending_approvals?: number;
    revenue_this_month?: number;
    shift_fill_rate?: number;
    upcoming_shifts?: number;
    placement_opportunities?: number;
    pending_responses?: number;
  };
  isLoading?: boolean;
}

export function PlacementStats({
  stats,
  isLoading = false,
}: PlacementStatsProps) {
  const statCards = [
    {
      title: 'Active Placements',
      value: stats?.active_placements || 0,
      icon: 'briefcase' as const,
      color: 'blue',
      description: 'Currently active',
    },
    {
      title: 'Placement Opportunities',
      value: stats?.placement_opportunities || 0,
      icon: 'target' as const,
      color: 'green',
      description: 'Available to respond',
    },
    {
      title: 'Pending Responses',
      value: stats?.pending_responses || 0,
      icon: 'clock' as const,
      color: 'orange',
      description: 'Awaiting action',
    },
    {
      title: 'Fill Rate',
      value: `${stats?.shift_fill_rate || 0}%`,
      icon: 'trendingUp' as const,
      color: 'purple',
      description: 'Success rate',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    orange: 'text-orange-600 bg-orange-50',
    purple: 'text-purple-600 bg-purple-50',
  };

  const textColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <Card
          key={index}
          className="relative overflow-hidden hover:shadow-md transition-shadow duration-300"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <div
              className={`p-2 rounded-lg ${colorClasses[card.color as keyof typeof colorClasses]}`}
            >
              <Icon name={card.icon} className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${textColorClasses[card.color as keyof typeof textColorClasses]}`}
            >
              {card.value}
            </div>
            <p className="text-xs text-gray-500 mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
