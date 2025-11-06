'use client';
import { useMemo } from 'react';
import { CalendarClient } from './CalendarClient';
import { CalendarEvent } from './utils/types';

interface CalendarPageClientProps {
  user: {
    id: string;
    name: string;
    role: string;
    email?: string;
  };
}

export default function CalendarPageClient({ user }: CalendarPageClientProps) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const events: CalendarEvent[] = useMemo(
    () => [
      {
        id: 'shift-1',
        title: 'Healthcare Assistant Shift',
        date: new Date(currentYear, currentMonth, 7),
        startTime: '07:00',
        endTime: '15:00',
        type: 'shift',
        status: 'assigned',
        entityType: 'shift',
        location: 'St. Thomas Hospital',
        role: 'Healthcare Assistant',
        employer: 'NHS Trust',
        employee: 'Sarah Johnson',
        payRate: 18.5,
        hours: 8,
      },
      {
        id: 'shift-2',
        title: 'Warehouse Operative',
        date: new Date(currentYear, currentMonth, 7),
        startTime: '14:00',
        endTime: '22:00',
        type: 'shift',
        status: 'scheduled',
        entityType: 'shift',
        location: 'Amazon Fulfillment Center',
        role: 'Warehouse Operative',
        employer: 'Amazon UK',
        payRate: 12.5,
        hours: 8,
      },
      {
        id: 'shift-3',
        title: 'Receptionist - Morning',
        date: new Date(currentYear, currentMonth, 12),
        startTime: '09:00',
        endTime: '17:00',
        type: 'shift',
        status: 'completed',
        entityType: 'shift',
        location: 'Corporate Office',
        role: 'Receptionist',
        employer: 'Tech Solutions Ltd',
        employee: 'Mike Chen',
        payRate: 15.0,
        hours: 8,
      },
      {
        id: 'shift-4',
        title: 'Security Guard - Night',
        date: new Date(currentYear, currentMonth, 15),
        startTime: '22:00',
        endTime: '06:00',
        type: 'shift',
        status: 'assigned',
        entityType: 'shift',
        location: 'City Center Mall',
        role: 'Security Guard',
        employer: 'SecureGuard Ltd',
        employee: 'David Wilson',
        payRate: 16.75,
        hours: 8,
      },
      {
        id: 'shift-5',
        title: 'Nurse - Day Shift',
        date: new Date(currentYear, currentMonth, 8),
        startTime: '08:00',
        endTime: '16:00',
        type: 'shift',
        status: 'assigned',
        entityType: 'shift',
        location: 'General Hospital',
        role: 'Registered Nurse',
        employer: 'NHS Trust',
        employee: 'Emma Wilson',
        payRate: 22.5,
        hours: 8,
      },
      {
        id: 'placement-1',
        title: '3-Month Nursing Placement',
        date: new Date(currentYear, currentMonth, 1),
        startTime: '09:00',
        endTime: '17:00',
        type: 'placement',
        status: 'scheduled',
        entityType: 'placement',
        location: 'Royal Infirmary',
        role: 'Registered Nurse',
        employer: 'NHS Scotland',
        employee: 'Emma Davis',
        payRate: 28.5,
        hours: 37.5,
      },
      {
        id: 'interview-1',
        title: 'Interview - Senior Care Assistant',
        date: new Date(currentYear, currentMonth, 15),
        startTime: '11:00',
        endTime: '12:00',
        type: 'interview',
        status: 'scheduled',
        entityType: 'shift',
        location: 'Interview Room B',
        role: 'Senior Care Assistant',
        employer: 'CarePlus Homes',
      },
      {
        id: 'interview-2',
        title: 'Technical Interview - DevOps',
        date: new Date(currentYear, currentMonth, 18),
        startTime: '14:00',
        endTime: '15:30',
        type: 'interview',
        status: 'scheduled',
        entityType: 'placement',
        location: 'Zoom Meeting',
        role: 'DevOps Engineer',
        employer: 'FinTech Solutions',
      },
      {
        id: 'meeting-1',
        title: 'Client Meeting - NHS Partnership',
        date: new Date(currentYear, currentMonth, 20),
        startTime: '10:00',
        endTime: '11:30',
        type: 'meeting',
        status: 'scheduled',
        entityType: 'shift',
        location: 'Board Room',
        employer: 'NHS Trust',
      },
      {
        id: 'training-1',
        title: 'Health & Safety Training',
        date: new Date(currentYear, currentMonth, 22),
        startTime: '13:00',
        endTime: '17:00',
        type: 'training',
        status: 'scheduled',
        entityType: 'shift',
        location: 'Training Center',
        role: 'Mandatory Training',
      },
      {
        id: 'timeoff-1',
        title: 'Annual Leave - Sarah Johnson',
        date: new Date(currentYear, currentMonth, 25),
        startTime: '00:00',
        endTime: '23:59',
        type: 'time_off',
        status: 'scheduled',
        entityType: 'time_off',
        employee: 'Sarah Johnson',
      },
      {
        id: 'timeoff-2',
        title: 'Sick Leave - Mike Chen',
        date: new Date(currentYear, currentMonth, 28),
        startTime: '00:00',
        endTime: '23:59',
        type: 'time_off',
        status: 'scheduled',
        entityType: 'time_off',
        employee: 'Mike Chen',
      },
    ],
    [currentYear, currentMonth]
  );

  return (
    <div className="p-6">
      <CalendarClient
        user={user}
        events={events}
        currentView="month"
        onViewChange={() => {}}
      />
    </div>
  );
}
