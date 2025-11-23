export interface Assignment {
  id: number;
  contract_id: number;
  agency_employee_id: number;
  shift_request_id: number | null;
  agency_response_id: number | null;
  location_id: number;
  role: string;
  start_date: string;
  end_date: string | undefined;
  expected_hours_per_week: number | null;
  agreed_rate: number;
  pay_rate: number;
  markup_amount: number;
  markup_percent: number;
  status: AssignmentStatus;
  status_label: string;
  assignment_type: AssignmentType;
  assignment_type_label: string;
  shift_pattern: ShiftPattern;
  notes: string | null;
  created_by_id: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_completed: boolean;
  is_ongoing: boolean;
  duration_days: number | null;
  total_expected_hours: number | null;
  can_be_updated: boolean;
  can_be_deleted: boolean;
  contract?: Contract;
  agency_employee?: AgencyEmployee;
  shift_request?: ShiftRequest;
  agency_assignment_response?: AgencyAssignmentResponse;
  location?: Location;
  created_by?: User;
  shifts?: Shift[];
  timesheets?: Timesheet[];
}

export type AssignmentStatus = 'active' | 'paused' | 'completed' | 'cancelled';
export type AssignmentType = 'temp' | 'direct' | 'contract';

export interface ShiftPattern {
  [day: string]: {
    start: string;
    end: string;
    duration: number;
  };
}

export interface Contract {
  id: number;
  employer_id: number;
  agency_id: number;
  status: string;
  status_label: string;
  contract_document_url: string;
  contract_start: string;
  contract_end: string;
  terms: string;
  created_at: string;
  updated_at: string;
  employer: Employer;
  agency: Agency;
  links: {
    self: string;
    employer: string;
    agency: string;
  };
}

export interface AgencyEmployee {
  id: number;
  agency_id: number;
  agency_branch_id: number;
  employee_id: number;
  position: string;
  pay_rate: number;
  employment_type: string;
  employment_type_label: string;
  status: string;
  status_label: string;
  contract_start_date: string;
  contract_end_date: string | null;
  specializations: string[] | null;
  preferred_locations: LocationPreference[] | null;
  max_weekly_hours: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  agency: Agency;
  employee: Employee;
}

export interface LocationPreference {
  location_id: number;
  priority: number;
}

export interface Employee {
  id: number;
  user_id: number;
  agency_id: number | null;
  employer_id: number | null;
  position: string | null;
  pay_rate: number | null;
  availability: EmployeeAvailability | null;
  qualifications: Qualification[];
  employment_type: string | null;
  status: string;
  meta: EmployeeMeta;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface EmployeeAvailability {
  days: string[];
  start_time: string;
  end_time: string;
}

export interface Qualification {
  name: string;
  level: string;
}

export interface EmployeeMeta {
  max_travel_distance?: number;
  preferred_shift_types?: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string;
  status: string;
  address: UserAddress | null;
  date_of_birth: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  meta: UserMeta | null;
  email_verified_at: string;
  last_login_at: string;
  created_at: string;
  updated_at: string;
  has_complete_profile: boolean;
  formatted_address: string | null;
  employee?: Employee;
  agent?: Agent;
}

export interface UserAddress {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface UserMeta {
  notification_preferences: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
}

export interface Agent {
  id: number;
  user_id: number;
  agency_id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  permissions: string[];
  created_at: string;
  updated_at: string;
  agency: Agency;
}

export interface Agency {
  id: number;
  name: string;
  legal_name: string;
  registration_number: string;
  billing_email: string;
  address: AgencyAddress;
  city: string;
  country: string;
  default_markup_percent: string;
  subscription_status: string;
  created_at: string;
  updated_at: string;
}

export interface AgencyAddress {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Employer {
  id: number;
  user_id: number | null;
  name: string;
  billing_email: string;
  address: EmployerAddress;
  city: string;
  country: string;
  subscription_status: string | null;
  meta: EmployerMeta;
  created_at: string;
  updated_at: string;
}

export interface EmployerAddress {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface EmployerMeta {
  website?: string;
  established?: number;
}

export interface Location {
  id: number;
  employer_id: number;
  name: string;
  address: LocationAddress;
  latitude: string;
  longitude: string;
  meta: LocationMeta;
  created_at: string;
  updated_at: string;
}

export interface LocationAddress {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface LocationMeta {
  facilities: string[];
}

export interface AssignmentFilters {
  status?: AssignmentStatus | 'all';
  assignment_type?: AssignmentType | undefined;
  agency: string;
  search?: string;
  role?: string;
  location_id?: number;
  location: string;
  start_date_from?: string;
  start_date_to?: string;
  end_date_from?: string;
  end_date_to?: string;
  employer_id?: number;
  agency_employee_id?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface AssignmentStats {
  total_assignments: number;
  active_assignments: number;
  pending_assignments: number;
  suspended_assignments: number;
  completed_assignments: number;
  cancelled_assignments: number;
  direct_assignments: number;
  standard_assignments: number;
  total_weekly_margin: number;
  average_utilization: number;
  financial_summary: FinancialSummary | null;
  utilization_rate: number | null;
  average_duration_days: number | null;
  period: Period;
}

export interface AssignmentStatsResponse {
  data: AssignmentStats;
}

export interface FinancialSummary {
  total_weekly_margin: number;
  total_revenue: number;
  total_cost: number;
}

export interface Period {
  start_date: string | null;
  end_date: string | null;
}

export interface ShiftRequest {
  id: number;
  status: string;
  requested_date: string;
}

export interface AgencyAssignmentResponse {
  id: number;
  status: string;
  response_date: string;
}

export interface Shift {
  id: number;
  assignment_id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
}

export interface Timesheet {
  id: number;
  assignment_id: number;
  week_start_date: string;
  hours_worked: number;
  status: string;
}

export interface CreateAssignmentData {
  contract_id: number;
  agency_employee_id: number;
  location_id: number;
  role: string;
  start_date: string;
  end_date?: string;
  expected_hours_per_week?: number;
  agreed_rate: number;
  shift_pattern: ShiftPattern;
  assignment_type: AssignmentType;
  notes?: string;
}

export interface UpdateAssignmentData {
  role?: string;
  location_id?: number;
  start_date?: string;
  end_date?: string;
  expected_hours_per_week?: number;
  agreed_rate?: number;
  shift_pattern?: ShiftPattern;
  notes?: string;
}

export interface StatusChangeData {
  status: AssignmentStatus;
  reason?: string | null;
}
