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
}

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
  subscription_status: string;
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
  role: string;
  can_sign_timesheets: boolean;
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
  employer_id?: number;
  position?: string;
  pay_rate?: number;
  availability?: any;
  qualifications?: string[];
  employment_type: 'temp' | 'perm' | 'part_time';
  status: string;
  meta?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface EmployeeAvailability {
  id: number;
  employee_id: number;
  type: 'recurring' | 'one_time';
  day_of_week?: string;
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

export interface Placement {
  id: number;
  employee_id: number;
  employer_id: number;
  agency_id: number;
  start_date: string;
  end_date?: string;
  status: 'active' | 'completed' | 'terminated';
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
  status:
    | 'open'
    | 'offered'
    | 'assigned'
    | 'completed'
    | 'agency_approved'
    | 'employer_approved'
    | 'billed'
    | 'cancelled';
  created_by_type: string;
  created_by_id: number;
  meta?: any;
  notes?: string;
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
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
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
  status: 'unpaid' | 'paid';
  paid_at?: string;
  payout_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: number;
  type: string;
  from_type: string;
  from_id: number;
  to_type: string;
  to_id: number;
  reference?: string;
  line_items?: any;
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

export interface Payment {
  id: number;
  invoice_id: number;
  payer_type: string;
  payer_id: number;
  amount: number;
  method: string;
  processor_id?: string;
  status: 'completed' | 'failed' | 'pending' | 'refunded';
  fee_amount: number;
  net_amount: number;
  metadata?: any;
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

export interface Subscription {
  id: number;
  entity_type: string;
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

export interface CreateJobRequest {
  title: string;
  description?: string;
  location_id: number;
  role_requirement?: string;
  required_qualifications?: string[];
  hourly_rate?: number;
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
  status: 'active' | 'inactive' | 'suspended';
}

export interface UsersQueryParams {
  role?: string;
  status?: string;
  page?: number;
  per_page?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}
