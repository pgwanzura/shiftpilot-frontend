import { IconName } from '@/config';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  type:
    | 'shift'
    | 'placement'
    | 'interview'
    | 'meeting'
    | 'training'
    | 'time_off'
    | 'availability';
  status: 'scheduled' | 'assigned' | 'completed' | 'cancelled';
  entityType: 'shift' | 'placement' | 'time_off';
  entityId: string;
  location?: string;
  role?: string;
  employer?: string;
  employee?: string;
  payRate?: number;
  hours?: number;
  reason?: string;
  description?: string;
}

export interface CalendarEventsParams {
  start_date: string;
  end_date: string;
  view: 'month' | 'week' | 'day';
  filter: string;
  [key: string]: string | number | boolean | undefined;
}

export interface CalendarEventsResponse {
  data: CalendarEvent[];
  meta?: {
    total: number;
    page: number;
    per_page: number;
  };
}

export interface CalendarClientProps {
  user: {
    role: string;
    name?: string;
    id?: string;
  };
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
