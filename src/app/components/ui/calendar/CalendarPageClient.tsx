'use client';

import { useState } from 'react';
import { PageHeader } from '@/app/components/layout';
import { CalendarActions } from '@/app/components/ui/actions/CalendarActions';
import { CalendarClient } from '@/app/components/ui';

interface CalendarPageClientProps {
  user: {
    role: string;
    name?: string;
    id?: string;
  };
}

export function CalendarPageClient({ user }: CalendarPageClientProps) {
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>(
    'month'
  );

  const handleNewShiftClick = () => {
    console.log('Creating new shift');

    // router.push('/shifts/create');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <CalendarActions
            userRole={user.role}
            currentView={currentView}
            onNewShiftClick={handleNewShiftClick}
          />
        }
      />

      <CalendarClient
        user={user}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
    </div>
  );
}
