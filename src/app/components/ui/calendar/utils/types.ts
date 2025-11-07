import { IconName } from '@/config';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  type:
    | 'shift'
    | 'interview'
    | 'placement'
    | 'meeting'
    | 'training'
    | 'time_off';
  status: 'scheduled' | 'assigned' | 'completed' | 'cancelled' | 'pending';
  entityType: 'shift' | 'placement' | 'availability' | 'time_off';
  entityId?: string;
  location?: string;
  role?: string;
  employer?: string;
  agency?: string;
  employee?: string;
  payRate?: number;
  hours?: number;
}

export interface CalendarClientProps {
  user: {
    role: string;
    name?: string;
    id?: string;
  };
  events: CalendarEvent[];
  currentView?: 'month' | 'week' | 'day';
  onViewChange?: (view: 'month' | 'week' | 'day') => void;
}

export interface FilterOption {
  key: EventFilter;
  label: string;
  icon: IconName;
  permissions: string[];
}

export type CalendarView = 'month' | 'week' | 'day';
export type EventFilter =
  | 'all'
  | 'shift'
  | 'placement'
  | 'interview'
  | 'time_off'
  | 'meeting'
  | 'training'
  | 'availability';
