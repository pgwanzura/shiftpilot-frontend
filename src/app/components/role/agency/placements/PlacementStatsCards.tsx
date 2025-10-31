// app/components/role/agency/placements/PlacementStatsCards.tsx
'use client';

import { InteractiveStatsCard } from '@/app/components/ui';
import { Icon } from '@/app/components/ui';

interface PlacementStatsCardsProps {
  stats: {
    total: number;
    active: number;
    draft: number;
    filled: number;
    completed: number;
    responses: number;
  };
}

export function PlacementStatsCards({ stats }: PlacementStatsCardsProps) {
  const handleTotalClick = () => {
    console.log('Navigate to all placements');
    // You can add navigation logic here
  };

  const handleActiveClick = () => {
    console.log('Navigate to active placements');
  };

  const handleDraftClick = () => {
    console.log('Navigate to draft placements');
  };

  const handleFilledClick = () => {
    console.log('Navigate to filled placements');
  };

  const handleCompletedClick = () => {
    console.log('Navigate to completed placements');
  };

  const handleResponsesClick = () => {
    console.log('Navigate to responses');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
      <InteractiveStatsCard
        title="Total Placements"
        value={stats.total}
        description="All placement opportunities"
        icon={<Icon name="briefcase" className="h-5 w-5" />}
        variant="primary"
        onClick={handleTotalClick}
      />
      <InteractiveStatsCard
        title="Active"
        value={stats.active}
        description="Currently accepting responses"
        icon={<Icon name="activity" className="h-5 w-5" />}
        variant="success"
        onClick={handleActiveClick}
      />
      <InteractiveStatsCard
        title="Draft"
        value={stats.draft}
        description="In preparation"
        icon={<Icon name="fileText" className="h-5 w-5" />}
        variant="warning"
        onClick={handleDraftClick}
      />
      <InteractiveStatsCard
        title="Filled"
        value={stats.filled}
        description="Positions filled"
        icon={<Icon name="checkCircle" className="h-5 w-5" />}
        variant="info"
        onClick={handleFilledClick}
      />
      <InteractiveStatsCard
        title="Completed"
        value={stats.completed}
        description="Successfully completed"
        icon={<Icon name="award" className="h-5 w-5" />}
        variant="primary"
        onClick={handleCompletedClick}
      />
      <InteractiveStatsCard
        title="Total Responses"
        value={stats.responses}
        description="Candidate submissions"
        icon={<Icon name="users" className="h-5 w-5" />}
        variant="info"
        onClick={handleResponsesClick}
      />
    </div>
  );
}
