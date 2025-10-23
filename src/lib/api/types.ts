// =============================================
// AUTH TYPES
// =============================================

export interface AuthUserResponse {
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  type: 'employer' | 'agency';
  company_name?: string;
}

// =============================================
// CORE ENTITY TYPES
// =============================================

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
  subscription_status: string;
  meta?: Record<string, unknown>;
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
  permissions?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone?: string;
  resume_url?: string;
  experience: string;
  skills: string[];
  status: 'submitted' | 'reviewed' | 'rejected' | 'accepted';
  submitted_by: number;
  job_id: number;
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
  role: ContactRole;
  can_sign_timesheets: boolean;
  meta?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: number;
  user_id: number;
  agency_id?: number;
  employer_id?: number;
  position?: string;
  pay_rate?: number;
  availability?: Record<string, unknown>;
  qualifications?: string[];
  employment_type: EmploymentType;
  status: EmployeeStatus;
  meta?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface EmployeeAvailability {
  id: number;
  employee_id: number;
  type: AvailabilityType;
  day_of_week?: DayOfWeek;
  start_date?: string;
  end_date?: string;
  start_time: string;
  end_time: string;
  timezone: string;
  status: AvailabilityStatus;
  priority: number;
  location_preference?: Record<string, unknown>;
  max_shift_length_hours?: number;
  min_shift_length_hours?: number;
  notes?: string;
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
  subscription_status: string;
  meta?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface EmployerAgencyLink {
  id: number;
  employer_id: number;
  agency_id: number;
  status: LinkStatus;
  contract_document_url?: string;
  contract_start?: string;
  contract_end?: string;
  terms?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: number;
  type: InvoiceType;
  from_type: string;
  from_id: number;
  to_type: string;
  to_id: number;
  reference?: string;
  line_items?: InvoiceLineItem[];
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: InvoiceStatus;
  due_date: string;
  paid_at?: string;
  payment_reference?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  total: number;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  salary_range: string;
  employment_type: string;
  status: 'active' | 'draft' | 'closed';
  employer_id: number;
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
  meta?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  invoice_id: number;
  payer_type: string;
  payer_id: number;
  amount: number;
  method: PaymentMethod;
  processor_id?: string;
  status: PaymentStatus;
  fee_amount: number;
  net_amount: number;
  metadata?: Record<string, unknown>;
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
  status: PayrollStatus;
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
  status: PayoutStatus;
  provider_payout_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Placement {
  id: number;
  employee_id: number;
  employer_id: number;
  agency_id: number;
  start_date: string;
  end_date?: string;
  status: PlacementStatus;
  employee_rate?: number;
  client_rate?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Shift {
  id: number;
  employer_id: number;
  agency_id?: number;
  placement_id?: number;
  employee_id?: number;
  agent_id?: number;
  location_id: number;
  start_time: string;
  end_time: string;
  hourly_rate?: number;
  status: ShiftStatus;
  created_by_type: string;
  created_by_id: number;
  meta?: Record<string, unknown>;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ShiftApproval {
  id: number;
  shift_id: number;
  contact_id: number;
  status: ApprovalStatus;
  signed_at?: string;
  signature_blob_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ShiftOffer {
  id: number;
  shift_id: number;
  employee_id: number;
  offered_by_id: number;
  status: OfferStatus;
  expires_at: string;
  responded_at?: string;
  response_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ShiftTemplate {
  id: number;
  employer_id: number;
  location_id: number;
  title: string;
  description?: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  role_requirement?: string;
  required_qualifications?: string[];
  hourly_rate?: number;
  recurrence_type: RecurrenceType;
  status: string;
  start_date?: string;
  end_date?: string;
  created_by_type: string;
  created_by_id: number;
  meta?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  entity_type: string;
  entity_id: number;
  plan_key: string;
  plan_name: string;
  amount: number;
  interval: SubscriptionInterval;
  status: SubscriptionStatus;
  started_at: string;
  current_period_start?: string;
  current_period_end?: string;
  meta?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface TimeOffRequest {
  id: number;
  employee_id: number;
  type: TimeOffType;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  status: TimeOffStatus;
  reason?: string;
  approved_by_id?: number;
  approved_at?: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
}

export interface Timesheet {
  id: number;
  shift_id: number;
  employee_id: number;
  clock_in?: string;
  clock_out?: string;
  break_minutes: number;
  hours_worked?: number;
  status: TimesheetStatus;
  agency_approved_by?: number;
  agency_approved_at?: string;
  approved_by_contact_id?: number;
  approved_at?: string;
  notes?: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  type: UserType;
  phone?: string;
  status: UserStatus;
  meta?: Record<string, unknown>;
  email_verified_at?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

// =============================================
// ENUM / STATUS TYPES
// =============================================

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type AvailabilityStatus = 'available' | 'unavailable' | 'preferred';
export type AvailabilityType = 'recurring' | 'one_time';

export type ContactRole = 'manager' | 'approver' | 'supervisor';

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type EmployeeStatus = 'active' | 'inactive';
export type EmploymentType = 'temp' | 'perm' | 'part_time';

export type InvoiceStatus =
  | 'pending'
  | 'paid'
  | 'partial'
  | 'overdue'
  | 'cancelled';
export type InvoiceType =
  | 'employer_to_agency'
  | 'agency_to_shiftpilot'
  | 'employer_to_shiftpilot'
  | 'shiftpilot_refund';

export type LinkStatus = 'pending' | 'approved' | 'suspended' | 'terminated';

export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

export type PaymentMethod = 'stripe' | 'bacs' | 'sepa' | 'paypal';
export type PaymentStatus = 'completed' | 'failed' | 'pending' | 'refunded';

export type PayrollStatus = 'unpaid' | 'paid';

export type PayoutStatus = 'processing' | 'paid' | 'failed';

export type PlacementStatus = 'active' | 'completed' | 'terminated';

export type RecurrenceType = 'weekly' | 'biweekly' | 'monthly';

export type ShiftStatus =
  | 'open'
  | 'offered'
  | 'assigned'
  | 'completed'
  | 'agency_approved'
  | 'employer_approved'
  | 'billed'
  | 'cancelled';

export type SubscriptionInterval = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled';

export type TimeOffStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type TimeOffType =
  | 'vacation'
  | 'sick'
  | 'personal'
  | 'bereavement'
  | 'other';

export type TimesheetStatus =
  | 'pending'
  | 'agency_approved'
  | 'employer_approved'
  | 'rejected';

export type UserRole =
  | 'super_admin'
  | 'agency_admin'
  | 'agent'
  | 'employer_admin'
  | 'manager'
  | 'contact'
  | 'employee'
  | 'system';
export type UserStatus = 'active' | 'inactive' | 'suspended';
export type UserType = 'employer' | 'agency' | 'admin';

// =============================================
// API & REQUEST TYPES
// =============================================

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T = undefined> {
  data?: T;
  message?: string;
  success: boolean;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  location: string;
  salary_range: string;
  employment_type: string;
}

export interface DashboardStats {
  total_shifts: number;
  active_employees: number;
  pending_approvals: number;
  revenue_this_month: number;
  shifts_this_week: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface QueryParams {
  [key: string]: string | number | undefined;
}

export interface ShiftsQueryParams extends QueryParams {
  employer_id?: number;
  agency_id?: number;
  employee_id?: number;
  status?: ShiftStatus;
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
}

export interface SubmitCandidateRequest {
  name: string;
  email: string;
  phone?: string;
  experience: string;
  skills: string[];
  resume?: File;
}

export interface UserStatusUpdate {
  status: 'active' | 'suspended';
}

export interface UsersQueryParams extends QueryParams {
  type?: UserType;
  page?: number;
  per_page?: number;
}
