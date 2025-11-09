'use client';

import { useRouter } from 'next/navigation';
import { InteractiveStatsCard } from '@/app/components/ui';
import { Icon } from '@/app/components/ui';
import { usePlacementStats } from '@/hooks/usePlacements';

interface PlacementStatsData {
  total: number;
  active: number;
  draft: number;
  filled: number;
  completed: number;
  responses: number;
}

interface StatsResponse {
  data?: PlacementStatsData | PlacementStatsData[];
}

export function PlacementStatsCards() {
  const router = useRouter();
  const { data: statsResponse, isLoading, error } = usePlacementStats();

  const handleTotalClick = () => {
    router.push('/agency/placements?status=all');
  };

  const handleActiveClick = () => {
    router.push('/agency/placements?status=active');
  };

  const handleDraftClick = () => {
    router.push('/agency/placements?status=draft');
  };

  const handleFilledClick = () => {
    router.push('/agency/placements?status=filled');
  };

  const handleCompletedClick = () => {
    router.push('/agency/placements?status=completed');
  };

  const handleResponsesClick = () => {
    router.push('/agency/responses');
  };

  const extractStatsData = (response: unknown): PlacementStatsData => {
    if (!response || typeof response !== 'object') {
      return {
        total: 0,
        active: 0,
        draft: 0,
        filled: 0,
        completed: 0,
        responses: 0,
      };
    }

    const statsResponse = response as StatsResponse;

    if (!statsResponse.data) {
      return {
        total: 0,
        active: 0,
        draft: 0,
        filled: 0,
        completed: 0,
        responses: 0,
      };
    }

    if (Array.isArray(statsResponse.data)) {
      return (
        statsResponse.data[0] || {
          total: 0,
          active: 0,
          draft: 0,
          filled: 0,
          completed: 0,
          responses: 0,
        }
      );
    }

    return statsResponse.data;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <Icon name="alertTriangle" className="h-5 w-5 text-yellow-600" />
          <div>
            <div className="text-yellow-800 font-medium text-sm">
              Unable to load placement stats
            </div>
            <div className="text-yellow-700 text-sm mt-1">
              Some features may be temporarily unavailable
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statsData = extractStatsData(statsResponse);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
      <InteractiveStatsCard
        title="Total Placements"
        value={statsData.total}
        description="All placement opportunities"
        icon={<Icon name="briefcase" className="h-5 w-5" />}
        variant="primary"
        onClick={handleTotalClick}
        isLoading={isLoading}
      />
      <InteractiveStatsCard
        title="Active"
        value={statsData.active}
        description="Currently accepting responses"
        icon={<Icon name="activity" className="h-5 w-5" />}
        variant="success"
        onClick={handleActiveClick}
        isLoading={isLoading}
      />
      <InteractiveStatsCard
        title="Draft"
        value={statsData.draft}
        description="In preparation"
        icon={<Icon name="fileText" className="h-5 w-5" />}
        variant="warning"
        onClick={handleDraftClick}
        isLoading={isLoading}
      />
      <InteractiveStatsCard
        title="Filled"
        value={statsData.filled}
        description="Positions filled"
        icon={<Icon name="checkCircle" className="h-5 w-5" />}
        variant="info"
        onClick={handleFilledClick}
        isLoading={isLoading}
      />
      <InteractiveStatsCard
        title="Completed"
        value={statsData.completed}
        description="Successfully completed"
        icon={<Icon name="award" className="h-5 w-5" />}
        variant="primary"
        onClick={handleCompletedClick}
        isLoading={isLoading}
      />
      <InteractiveStatsCard
        title="Total Responses"
        value={statsData.responses}
        description="Candidate submissions"
        icon={<Icon name="users" className="h-5 w-5" />}
        variant="info"
        onClick={handleResponsesClick}
        isLoading={isLoading}
      />
    </div>
  );
}
