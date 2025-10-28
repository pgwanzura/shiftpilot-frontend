'use client';

import { Icon } from '@/app/components/ui';
import { formatShiftTime } from '@/lib/utils';

interface Shift {
  id: string;
  employeeName: string;
  employerName: string;
  location: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

interface RecentShiftsProps {
  shifts: Shift[];
}

function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

export function RecentShifts({ shifts }: RecentShiftsProps) {
  return (
    <div className="space-y-4">
      {shifts.map((shift) => (
        <div
          key={shift.id}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Icon name="calendar" className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                {shift.employeeName}
              </h4>
              <p className="text-sm text-gray-600">{shift.employerName}</p>
              <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Icon name="mapPin" className="w-3 h-3" />
                  <span>{shift.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="clock" className="w-3 h-3" />
                  <span>{formatShiftTime(shift.startTime, shift.endTime)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shift.status)}`}
            >
              {shift.status.replace('_', ' ')}
            </span>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
