import { UserRole, AuthUser } from '../lib/auth';

export interface User extends AuthUser {
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  meta?: Record<string, any>;
  email_verified_at?: string;
  last_login_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardStats {
  total_shifts: number;
  active_placements: number;
  pending_approvals: number;
  revenue: number;
  shift_fill_rate: number;
  upcoming_shifts: number;
  active_employees?: number;
}

// ==================== CORE ENTITIES ====================

export interface Agency {
  id: number;
  user_id: number;
  name: string;
  legal_name?: string;
  registration_number?: string;
  billing_email?: string;
  address?: string;
  city?: string;
  country?: string;
  commission_rate: number;
  subscription_status: 'active' | 'inactive' | 'suspended';
  meta?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: number;
  user_id: number;
  agency_id: number;
  name: string;
  email: string;
  phone?: string;
  permissions?: string[];
  created_at: string;
  updated_at: string;
}

export interface Employer {
  id: number;
  user_id: number;
  name: string;
  billing_email?: string;
  address?: string;
  city?: string;
  country?: string;
  subscription_status: 'active' | 'inactive' | 'suspended';
  meta?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface EmployerAgencyLink {
  id: number;
  employer_id: number;
  agency_id: number;
  status: 'pending' | 'approved' | 'suspended' | 'terminated';
  contract_document_url?: string;
  contract_start?: string;
  contract_end?: string;
  terms?: string;
  commission_rate?: number;
  service_level_agreement?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: number;
  employer_id: number;
  user_id?: number;
  name: string;
  email: string;
  phone?: string;
  role: 'manager' | 'approver' | 'supervisor';
  can_sign_timesheets: boolean;
  permissions?: string[];
  meta?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: number;
  employer_id: number;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  meta?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: number;
  user_id: number;
  agency_id?: number;
  employer_id?: number; // For direct hires
  position?: string;
  pay_rate?: number;
  availability?: EmployeeAvailability[];
  qualifications?: EmployeeQualification[];
  employment_type: 'temp' | 'perm' | 'part_time';
  status: 'active' | 'inactive' | 'suspended';
  preferences?: EmployeePreferences;
  meta?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface EmployeeQualification {
  id: number;
  employee_id: number;
  type: string;
  name: string;
  issuing_authority?: string;
  issue_date: string;
  expiry_date?: string;
  document_url?: string;
  status: 'active' | 'expired' | 'pending_verification';
  created_at: string;
  updated_at: string;
}

export interface EmployeePreferences {
  preferred_locations?: string[];
  max_travel_distance_km?: number;
  preferred_shift_types?: string[];
  max_hours_per_week?: number;
  min_shift_length_hours?: number;
  max_shift_length_hours?: number;
  unavailable_dates?: string[];
}

export interface EmployeeAvailability {
  id: number;
  employee_id: number;
  type: 'recurring' | 'one_time';
  day_of_week?: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
  start_date?: string;
  end_date?: string;
  start_time: string;
  end_time: string;
  timezone: string;
  status: 'available' | 'unavailable' | 'preferred';
  priority: number;
  location_preference?: any;
  max_shift_length_hours?: number;
  min_shift_length_hours?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TimeOffRequest {
  id: number;
  employee_id: number;
  type: 'vacation' | 'sick' | 'personal' | 'bereavement' | 'other';
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reason?: string;
  approved_by_id?: number;
  approved_at?: string;
  attachments?: any;
  created_at: string;
  updated_at: string;
}

// ==================== PLACEMENT & SHIFT SYSTEM ====================

export interface Placement {
  id: number;
  employer_id: number;
  title: string;
  description?: string;

  // Requirements
  role_requirements: string[];
  required_qualifications: string[];
  experience_level: 'entry' | 'intermediate' | 'senior';
  background_check_required: boolean;

  // Location
  location_id: number;
  location_instructions?: string;

  // Timing
  start_date: string;
  end_date?: string;
  shift_pattern: 'one_time' | 'recurring' | 'ongoing';
  recurrence_rules?: any;

  // Budget
  budget_type: 'hourly' | 'daily' | 'fixed';
  budget_amount: number;
  currency: string;
  overtime_rules?: any;

  // Visibility
  target_agencies: 'all' | 'specific';
  specific_agency_ids?: number[];
  response_deadline?: string;

  status: 'draft' | 'active' | 'filled' | 'cancelled' | 'completed';
  created_by_id: number;
  created_at: string;
  updated_at: string;
}

export interface AgencyResponse {
  id: number;
  placement_id: number;
  agency_id: number;
  status: 'draft' | 'submitted' | 'accepted' | 'rejected' | 'withdrawn';

  submitted_employees: {
    employee_id: number;
    proposed_rate: number;
    notes: string;
    qualifications_match: string[];
    availability_confirmed: boolean;
  }[];

  employer_feedback?: {
    selected_employee_id?: number;
    rejection_reason?: string;
    notes: string;
    counter_offer_rate?: number;
  };

  submitted_at?: string;
  responded_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PlacementStats {
  total: number;
  active: number;
  draft: number;
  filled: number;
  completed: number;
  responses: number;
}

export interface Shift {
  id: number;
  placement_id: number;
  agency_id: number;
  employee_id: number;
  employer_id: number;

  // Assignment details
  agency_response_id: number;
  agreed_rate: number;

  // Timing
  scheduled_start: string;
  scheduled_end: string;
  actual_start?: string;
  actual_end?: string;
  break_minutes: number;

  // Status tracking
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

  // Location tracking
  clock_in_location?: { lat: number; lng: number };
  clock_out_location?: { lat: number; lng: number };

  // Approval workflow
  timesheet_status:
    | 'pending'
    | 'submitted'
    | 'agency_approved'
    | 'employer_approved'
    | 'disputed';
  employer_approved_at?: string;
  employer_approved_by?: number;

  created_at: string;
  updated_at: string;
}

export interface ShiftTemplate {
  id: number;
  employer_id: number;
  location_id: number;
  title: string;
  description?: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  role_requirement?: string;
  required_qualifications?: string[];
  hourly_rate?: number;
  recurrence_type: 'weekly' | 'biweekly' | 'monthly';
  status: 'active' | 'inactive';
  start_date?: string;
  end_date?: string;
  created_by_type: string;
  created_by_id: number;
  meta?: any;
  created_at: string;
  updated_at: string;
}

export interface ShiftOffer {
  id: number;
  shift_id: number;
  employee_id: number;
  offered_by_id: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'rescinded';
  expires_at: string;
  responded_at?: string;
  response_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ShiftApproval {
  id: number;
  shift_id: number;
  contact_id: number;
  status: 'pending' | 'approved' | 'rejected';
  signed_at?: string;
  signature_blob_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ==================== TIMESHEET & PAYROLL ====================

export interface Timesheet {
  id: number;
  shift_id: number;
  employee_id: number;
  clock_in?: string;
  clock_out?: string;
  break_minutes: number;
  hours_worked?: number;
  status: 'pending' | 'agency_approved' | 'employer_approved' | 'rejected';
  agency_approved_by?: number;
  agency_approved_at?: string;
  approved_by_contact_id?: number;
  approved_at?: string;
  notes?: string;
  attachments?: any;
  created_at: string;
  updated_at: string;
}

export interface Payroll {
  id: number;
  agency_id: number;
  employee_id: number;
  period_start: string;
  period_end: string;
  total_hours: number;
  gross_pay: number;
  taxes: number;
  net_pay: number;
  status: 'unpaid' | 'paid' | 'processing';
  paid_at?: string;
  payout_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Payout {
  id: number;
  agency_id: number;
  period_start: string;
  period_end: string;
  total_amount: number;
  status: 'processing' | 'paid' | 'failed';
  provider_payout_id?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

// ==================== FINANCIAL ====================

export interface Invoice {
  id: number;
  type:
    | 'employer_to_agency'
    | 'agency_to_shiftpilot'
    | 'employer_to_shiftpilot'
    | 'shiftpilot_refund';
  from_type: 'employer' | 'agency' | 'shiftpilot';
  from_id: number;
  to_type: 'employer' | 'agency' | 'shiftpilot';
  to_id: number;
  reference?: string;
  line_items?: InvoiceLineItem[];
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: 'pending' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  due_date: string;
  paid_at?: string;
  payment_reference?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  total: number;
  shift_id?: number;
  timesheet_id?: number;
}

export interface Payment {
  id: number;
  invoice_id: number;
  payer_type: string;
  payer_id: number;
  amount: number;
  method: 'stripe' | 'bacs' | 'sepa' | 'paypal';
  processor_id?: string;
  status: 'completed' | 'failed' | 'pending' | 'refunded';
  fee_amount: number;
  net_amount: number;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  entity_type: 'agency' | 'employer';
  entity_id: number;
  plan_key: string;
  plan_name: string;
  amount: number;
  interval: 'monthly' | 'yearly';
  status: 'active' | 'past_due' | 'cancelled';
  started_at: string;
  current_period_start?: string;
  current_period_end?: string;
  meta?: any;
  created_at: string;
  updated_at: string;
}

// ==================== RATE MANAGEMENT ====================

export interface RateCard {
  id: number;
  employer_id?: number;
  agency_id?: number;
  role_key: string;
  location_id?: number;
  day_of_week?: string;
  start_time?: string;
  end_time?: string;
  rate: number;
  currency: string;
  effective_from: string;
  effective_to?: string;
  created_at: string;
  updated_at: string;
}

// ==================== TRACKING & ANALYTICS ====================

export interface PlacementTracking {
  placement_id: number;
  milestones: {
    created: string;
    published: string;
    responses_received: string[];
    selection_made?: string;
    assignment_confirmed?: string;
    completed?: string;
    cancelled?: string;
  };
  metrics: {
    total_responses: number;
    response_rate: number;
    time_to_first_response: number;
    time_to_fill: number;
    employer_satisfaction_score?: number;
  };
  agency_engagement: {
    agency_id: number;
    viewed_at?: string;
    responded_at?: string;
    status: 'viewed' | 'responded' | 'selected' | 'rejected';
    response_quality_score?: number;
  }[];
}

export interface ShiftTracking {
  shift_id: number;
  timeline: {
    scheduled: { start: string; end: string };
    actual: {
      clock_in?: { time: string; location: { lat: number; lng: number } };
      breaks_taken: { start: string; end: string }[];
      clock_out?: { time: string; location: { lat: number; lng: number } };
    };
  };
  compliance: {
    on_time: boolean;
    location_verified: boolean;
    break_compliant: boolean;
    hours_compliant: boolean;
  };
  quality_metrics: {
    employer_rating?: number;
    employer_feedback?: string;
    agency_rating?: number;
    agency_feedback?: string;
    issues_reported: number;
  };
  financial_tracking: {
    agreed_rate: number;
    calculated_amount: number;
    approved_amount?: number;
    paid_amount?: number;
    payment_date?: string;
  };
}

// ==================== REQUEST/QUERY INTERFACES ====================

export interface CreatePlacementRequest {
  title: string;
  description?: string;
  role_requirements: string[];
  location_id: number;
  start_date: string;
  end_date?: string;
  shift_pattern: 'one_time' | 'recurring' | 'ongoing';
  budget_type: 'hourly' | 'daily' | 'fixed';
  budget_amount: number;
  target_agencies: 'all' | 'specific';
  specific_agency_ids?: number[];
  response_deadline?: string;
  required_qualifications?: string[];
  experience_level?: 'entry' | 'intermediate' | 'senior';
  background_check_required?: boolean;
}

export interface SubmitAgencyResponseRequest {
  placement_id: number;
  submitted_employees: {
    employee_id: number;
    proposed_rate: number;
    notes: string;
  }[];
}

export interface CreateShiftRequest {
  placement_id: number;
  agency_response_id: number;
  employee_id: number;
  scheduled_start: string;
  scheduled_end: string;
  agreed_rate: number;
}

export interface ClockInOutRequest {
  shift_id: number;
  type: 'clock_in' | 'clock_out';
  location: { lat: number; lng: number };
  notes?: string;
}

export interface SubmitTimesheetRequest {
  shift_id: number;
  clock_in: string;
  clock_out: string;
  break_minutes: number;
  notes?: string;
  attachments?: any;
}

export interface UserStatusUpdate {
  status: 'active' | 'inactive' | 'suspended';
}

export interface UsersQueryParams {
  role?: string;
  status?: string;
  page?: number;
  per_page?: number;
  [key: string]: string | number | boolean | undefined;
}

// ==================== API RESPONSES ====================

export interface ApiResponse<T> {
  data: T[];
  message?: string;
  meta?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface ApiErrorDetails {
  code?: string | number;
  exception?: string;
  file?: string;
  line?: number;
  trace?: string[];
  validation_errors?: Record<string, string[]>;
  business_reason?: string;
  suggestion?: string;
  retry_after?: number;
  current_page?: number;
  total?: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
  details?: ApiErrorDetails;
}

export interface ValidationApiError extends ApiError {
  errors: Record<string, string[]>;
  details: ApiErrorDetails & {
    validation_errors: Record<string, string[]>;
  };
}

export interface BusinessApiError extends ApiError {
  details: ApiErrorDetails & {
    business_reason: string;
    code: string | number;
  };
}

export interface RateLimitApiError extends ApiError {
  details: ApiErrorDetails & {
    retry_after: number;
  };
}

export const isValidationError = (
  error: ApiError
): error is ValidationApiError => {
  return !!(error.errors && Object.keys(error.errors).length > 0);
};

export const isBusinessError = (error: ApiError): error is BusinessApiError => {
  return !!(error.details?.business_reason && error.details?.code);
};

export const isRateLimitError = (
  error: ApiError
): error is RateLimitApiError => {
  return !!error.details?.retry_after;
};

export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

export interface RequestOptions {
  timeout?: number;
  headers?: Record<string, string>;
  skipCSRF?: boolean;
}

// ==================== DASHBOARD INTERFACES ====================

export interface AgencyDashboardStats {
  total_employees: number;
  active_shifts: number;
  pending_approvals: number;
  revenue_this_month: number;
  shift_fill_rate: number;
  upcoming_shifts: number;
  placement_opportunities: number;
  pending_responses: number;
}

export interface EmployerDashboardStats {
  active_placements: number;
  filled_shifts: number;
  pending_timesheets: number;
  total_spend: number;
  average_fill_time: number;
  upcoming_shifts: number;
  agency_partners: number;
}

export interface EmployeeDashboardStats {
  upcoming_shifts: number;
  hours_this_week: number;
  total_earnings: number;
  pending_offers: number;
  completed_shifts: number;
  availability_score: number;
}
