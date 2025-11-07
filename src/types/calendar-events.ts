export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
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
  location?: string;
  role?: string;
  employer?: string;
  employee?: string;
  payRate?: number;
  hours?: number;
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
