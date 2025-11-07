import { AuthClient } from './authClient';
import { BaseClient } from './baseClient';
import {
  ApiResponse,
  CalendarEventsParams,
  CalendarEvent,
  Contact,
  // CreateJobRequest,
  DashboardStats,
  Employee,
  EmployeeAvailability,
  EmployerAgencyLink,
  Invoice,
  Location,
  PaginatedResponse,
  Payment,
  Payroll,
  Payout,
  Placement,
  PlacementStats,
  Shift,
  ShiftApproval,
  ShiftOffer,
  ShiftTemplate,
  // SubmitCandidateRequest,
  Subscription,
  TimeOffRequest,
  Timesheet,
  User,
  UserStatusUpdate,
  UsersQueryParams,
} from '@/types';

export class ApiClient extends BaseClient {
  public auth: AuthClient;

  constructor(authClient: AuthClient, baseURL?: string, authToken: string | null = null) {
    super(authToken, baseURL);
    this.auth = authClient;
  }

  async getCalendarEvents(
    params: CalendarEventsParams
  ): Promise<ApiResponse<CalendarEvent[]>> {
    return this.get<ApiResponse<CalendarEvent[]>>('/calendar/events', params);
  }

  // =============================================
  // ADMIN METHODS
  // =============================================

  async getAdminDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
  }

  async getAdminInvoices(): Promise<PaginatedResponse<Invoice>> {
    return this.get<PaginatedResponse<Invoice>>('/admin/invoices');
  }

  async getAdminPayments(): Promise<PaginatedResponse<Payment>> {
    return this.get<PaginatedResponse<Payment>>('/admin/payments');
  }

  async getAdminPayouts(): Promise<PaginatedResponse<Payout>> {
    return this.get<PaginatedResponse<Payout>>('/admin/payouts');
  }

  async getAdminSubscriptions(): Promise<PaginatedResponse<Subscription>> {
    return this.get<PaginatedResponse<Subscription>>('/admin/subscriptions');
  }

  async getUsers(params?: UsersQueryParams): Promise<PaginatedResponse<User>> {
    return this.get<PaginatedResponse<User>>('/admin/users', params);
  }

  async updateUserStatus(
    userId: number,
    status: UserStatusUpdate
  ): Promise<ApiResponse<undefined>> {
    return this.patch<ApiResponse<undefined>>(
      `/admin/users/${userId}/status`,
      status
    );
  }

  // =============================================
  // AGENCY METHODS
  // =============================================

  async agencyApproveTimesheet(
    timesheetId: number
  ): Promise<ApiResponse<Timesheet>> {
    return this.patch<ApiResponse<Timesheet>>(
      `/agency/timesheets/${timesheetId}/approve`
    );
  }

  async createAgent(agentData: {
    name: string;
    email: string;
    permissions: string[];
  }): Promise<ApiResponse<User>> {
    return this.post<ApiResponse<User>>('/agency/agents', agentData);
  }

  async createPlacement(placementData: {
    employee_id: number;
    employer_id: number;
    start_date: string;
    end_date?: string;
    employee_rate?: number;
    client_rate?: number;
  }): Promise<ApiResponse<Placement>> {
    return this.post<ApiResponse<Placement>>(
      '/agency/placements',
      placementData
    );
  }

  async createShiftFromTemplate(
    templateId: number,
    date: string
  ): Promise<ApiResponse<Shift>> {
    return this.post<ApiResponse<Shift>>(
      `/agency/shift-templates/${templateId}/generate`,
      { date }
    );
  }

  async getAgencyContacts(): Promise<PaginatedResponse<Contact>> {
    return this.get<PaginatedResponse<Contact>>('/agency/contacts');
  }

  async getAgencyDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.get<ApiResponse<DashboardStats>>('/agency/dashboard/stats');
  }

  async getAgencyEmployees(params?: {
    status?: string;
  }): Promise<PaginatedResponse<Employee>> {
    return this.get<PaginatedResponse<Employee>>('/agency/employees', params);
  }

  async getAgencyEmployerLinks(): Promise<
    PaginatedResponse<EmployerAgencyLink>
  > {
    return this.get<PaginatedResponse<EmployerAgencyLink>>(
      '/agency/employer-links'
    );
  }

  async getAgencyInvoices(): Promise<PaginatedResponse<Invoice>> {
    return this.get<PaginatedResponse<Invoice>>('/agency/invoices');
  }

  async getAgencyPayroll(params?: {
    period_start?: string;
    period_end?: string;
  }): Promise<PaginatedResponse<Payroll>> {
    return this.get<PaginatedResponse<Payroll>>('/agency/payroll', params);
  }

  async getAgencyPayouts(): Promise<PaginatedResponse<Payout>> {
    return this.get<PaginatedResponse<Payout>>('/agency/payouts');
  }

  async getAgencyPlacements(params?: {
    status?: string;
    search?: string;
    experience_level?: string;
    budget_type?: string;
    location_id?: number;
    start_date_from?: string;
    start_date_to?: string;
    sort_by?: string;
    sort_direction?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<Placement>> {
    return this.get<PaginatedResponse<Placement>>('/agency/placements', params);
  }

  // In your ApiClient class, update the getAgencyPlacementStats method:
  async getAgencyPlacementStats(): Promise<ApiResponse<PlacementStats>> {
    return this.get<ApiResponse<PlacementStats>>(
      '/agency/placements/stats/detailed'
    );
  }

  async getAgencyShifts(params?: {
    status?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<PaginatedResponse<Shift>> {
    return this.get<PaginatedResponse<Shift>>('/agency/shifts', params);
  }

  async getAgencySubscriptions(): Promise<ApiResponse<Subscription[]>> {
    return this.get<ApiResponse<Subscription[]>>('/agency/subscriptions');
  }

  async getAgencyTimesheets(params?: {
    status?: string;
  }): Promise<PaginatedResponse<Timesheet>> {
    return this.get<PaginatedResponse<Timesheet>>('/agency/timesheets', params);
  }

  async processPayroll(payrollData: {
    period_start: string;
    period_end: string;
  }): Promise<ApiResponse<Payroll[]>> {
    return this.post<ApiResponse<Payroll[]>>(
      '/agency/payroll/process',
      payrollData
    );
  }

  async updateEmployee(
    employeeId: number,
    employeeData: Partial<Employee>
  ): Promise<ApiResponse<Employee>> {
    return this.put<ApiResponse<Employee>>(
      `/agency/employees/${employeeId}`,
      employeeData
    );
  }

  async updatePlacement(
    placementId: number,
    placementData: Partial<Placement>
  ): Promise<ApiResponse<Placement>> {
    return this.put<ApiResponse<Placement>>(
      `/agency/placements/${placementId}`,
      placementData
    );
  }

  // =============================================
  // EMPLOYER METHODS
  // =============================================

  async approveShiftApproval(
    approvalId: number
  ): Promise<ApiResponse<ShiftApproval>> {
    return this.patch<ApiResponse<ShiftApproval>>(
      `/employer/shift-approvals/${approvalId}/approve`
    );
  }

  async employerApproveTimesheet(
    timesheetId: number
  ): Promise<ApiResponse<Timesheet>> {
    return this.patch<ApiResponse<Timesheet>>(
      `/employer/timesheets/${timesheetId}/approve`
    );
  }

  async createContact(contactData: {
    name: string;
    email: string;
    role: string;
    can_sign_timesheets: boolean;
  }): Promise<ApiResponse<Contact>> {
    return this.post<ApiResponse<Contact>>('/employer/contacts', contactData);
  }

  async createLocation(locationData: {
    name: string;
    address?: string;
  }): Promise<ApiResponse<Location>> {
    return this.post<ApiResponse<Location>>(
      '/employer/locations',
      locationData
    );
  }

  async createShift(shiftData: {
    location_id: number;
    start_time: string;
    end_time: string;
    hourly_rate?: number;
    role_requirement?: string;
  }): Promise<ApiResponse<Shift>> {
    return this.post<ApiResponse<Shift>>('/employer/shifts', shiftData);
  }

  async createShiftTemplate(templateData: {
    location_id: number;
    title: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    recurrence_type: string;
  }): Promise<ApiResponse<ShiftTemplate>> {
    return this.post<ApiResponse<ShiftTemplate>>(
      '/employer/shift-templates',
      templateData
    );
  }

  async deleteJob(jobId: number): Promise<ApiResponse<undefined>> {
    return this.delete<ApiResponse<undefined>>(`/employer/jobs/${jobId}`);
  }

  async getEmployerAgencyLinks(): Promise<
    PaginatedResponse<EmployerAgencyLink>
  > {
    return this.get<PaginatedResponse<EmployerAgencyLink>>(
      '/employer/agency-links'
    );
  }

  async getEmployerContacts(): Promise<PaginatedResponse<Contact>> {
    return this.get<PaginatedResponse<Contact>>('/employer/contacts');
  }

  async getEmployerDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.get<ApiResponse<DashboardStats>>('/employer/dashboard/stats');
  }

  async getEmployerInvoices(): Promise<PaginatedResponse<Invoice>> {
    return this.get<PaginatedResponse<Invoice>>('/employer/invoices');
  }

  async getEmployerLocations(): Promise<ApiResponse<Location[]>> {
    return this.get<ApiResponse<Location[]>>('/employer/locations');
  }

  async getEmployerPayments(): Promise<PaginatedResponse<Payment>> {
    return this.get<PaginatedResponse<Payment>>('/employer/payments');
  }

  async getEmployerShiftApprovals(): Promise<PaginatedResponse<ShiftApproval>> {
    return this.get<PaginatedResponse<ShiftApproval>>(
      '/employer/shift-approvals'
    );
  }

  async getEmployerShiftOffers(): Promise<PaginatedResponse<ShiftOffer>> {
    return this.get<PaginatedResponse<ShiftOffer>>('/employer/shift-offers');
  }

  async getEmployerShiftTemplates(): Promise<ApiResponse<ShiftTemplate[]>> {
    return this.get<ApiResponse<ShiftTemplate[]>>('/employer/shift-templates');
  }

  async getEmployerShifts(params?: {
    status?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<PaginatedResponse<Shift>> {
    return this.get<PaginatedResponse<Shift>>('/employer/shifts', params);
  }

  async getEmployerSubscriptions(): Promise<ApiResponse<Subscription[]>> {
    return this.get<ApiResponse<Subscription[]>>('/employer/subscriptions');
  }

  async getEmployerTimesheets(params?: {
    status?: string;
  }): Promise<PaginatedResponse<Timesheet>> {
    return this.get<PaginatedResponse<Timesheet>>(
      '/employer/timesheets',
      params
    );
  }

  async payInvoice(
    invoiceId: number,
    paymentData: { method: string; amount: number }
  ): Promise<ApiResponse<Payment>> {
    return this.post<ApiResponse<Payment>>(
      `/employer/invoices/${invoiceId}/pay`,
      paymentData
    );
  }

  async requestAgencyLink(
    agencyId: number
  ): Promise<ApiResponse<EmployerAgencyLink>> {
    return this.post<ApiResponse<EmployerAgencyLink>>(
      '/employer/agency-links/request',
      { agency_id: agencyId }
    );
  }

  async updateLocation(
    locationId: number,
    locationData: Partial<Location>
  ): Promise<ApiResponse<Location>> {
    return this.put<ApiResponse<Location>>(
      `/employer/locations/${locationId}`,
      locationData
    );
  }

  // =============================================
  // EMPLOYEE METHODS
  // =============================================

  async clockIn(shiftId: number): Promise<ApiResponse<Timesheet>> {
    return this.post<ApiResponse<Timesheet>>(
      `/employee/timesheets/${shiftId}/clock-in`
    );
  }

  async clockOut(shiftId: number): Promise<ApiResponse<Timesheet>> {
    return this.post<ApiResponse<Timesheet>>(
      `/employee/timesheets/${shiftId}/clock-out`
    );
  }

  async getEmployeeAvailability(): Promise<
    ApiResponse<EmployeeAvailability[]>
  > {
    return this.get<ApiResponse<EmployeeAvailability[]>>(
      '/employee/availability'
    );
  }

  async getEmployeeDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.get<ApiResponse<DashboardStats>>('/employee/dashboard/stats');
  }

  async getEmployeePayroll(): Promise<PaginatedResponse<Payroll>> {
    return this.get<PaginatedResponse<Payroll>>('/employee/payroll');
  }

  async getEmployeeShifts(params?: {
    status?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<PaginatedResponse<Shift>> {
    return this.get<PaginatedResponse<Shift>>('/employee/shifts', params);
  }

  async getEmployeeTimesheets(): Promise<PaginatedResponse<Timesheet>> {
    return this.get<PaginatedResponse<Timesheet>>('/employee/timesheets');
  }

  async getShiftOffers(): Promise<PaginatedResponse<ShiftOffer>> {
    return this.get<PaginatedResponse<ShiftOffer>>('/employee/shift-offers');
  }

  async respondToShiftOffer(
    offerId: number,
    accept: boolean,
    notes?: string
  ): Promise<ApiResponse<ShiftOffer>> {
    return this.patch<ApiResponse<ShiftOffer>>(
      `/employee/shift-offers/${offerId}/respond`,
      {
        accept,
        notes,
      }
    );
  }

  async setAvailability(
    availabilityData: Omit<
      EmployeeAvailability,
      'id' | 'employee_id' | 'created_at' | 'updated_at'
    >
  ): Promise<ApiResponse<EmployeeAvailability>> {
    return this.post<ApiResponse<EmployeeAvailability>>(
      '/employee/availability',
      availabilityData
    );
  }

  async submitTimeOffRequest(timeOffData: {
    type: string;
    start_date: string;
    end_date: string;
    start_time?: string;
    end_time?: string;
    reason?: string;
  }): Promise<ApiResponse<TimeOffRequest>> {
    return this.post<ApiResponse<TimeOffRequest>>(
      '/employee/time-off',
      timeOffData
    );
  }

  async updateAvailability(
    availabilityId: number,
    availabilityData: Partial<EmployeeAvailability>
  ): Promise<ApiResponse<EmployeeAvailability>> {
    return this.put<ApiResponse<EmployeeAvailability>>(
      `/employee/availability/${availabilityId}`,
      availabilityData
    );
  }

  // =============================================
  // SHIFT & TIMESHEET METHODS (Shared)
  // =============================================

  async cancelShift(shiftId: number): Promise<ApiResponse<Shift>> {
    return this.patch<ApiResponse<Shift>>(`/shifts/${shiftId}/cancel`);
  }

  async getShiftDetails(shiftId: number): Promise<ApiResponse<Shift>> {
    return this.get<ApiResponse<Shift>>(`/shifts/${shiftId}`);
  }

  async updateShift(
    shiftId: number,
    shiftData: Partial<Shift>
  ): Promise<ApiResponse<Shift>> {
    return this.put<ApiResponse<Shift>>(`/shifts/${shiftId}`, shiftData);
  }

  async updateTimesheet(
    timesheetId: number,
    timesheetData: Partial<Timesheet>
  ): Promise<ApiResponse<Timesheet>> {
    return this.put<ApiResponse<Timesheet>>(
      `/timesheets/${timesheetId}`,
      timesheetData
    );
  }
}
