'use client';

import { useState } from 'react';
import { CalendarClient } from './CalendarClient';

interface CalendarPageClientProps {
  user: {
    id: string;
    name: string;
    role: string;
    email?: string;
  };
}

export default function CalendarPageClient({ user }: CalendarPageClientProps) {
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>(
    'day'
  );

  const handleViewChange = (view: 'month' | 'week' | 'day') => {
    setCurrentView(view);
  };

  return (
    <div className="p-6">
      <CalendarClient
        user={user}
        currentView={currentView}
        onViewChange={handleViewChange}
      />
    </div>
  );
}
