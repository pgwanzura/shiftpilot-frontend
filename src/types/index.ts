export type { UserRole, AuthUser } from '../lib/auth';

export type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  AuthUserResponse,
  LoginResponse,
} from './auth';
export type { PaginatedResponse, PaginationParams } from './pagination';

// Explicitly export from api to avoid conflicts
export type {
  // Core entities
  Agency,
  Agent,
  Employer,
  EmployerAgencyLink,
  Contact,
  Location,
  Employee,
  EmployeeQualification,
  EmployeePreferences,
  EmployeeAvailability,
  TimeOffRequest,
  Placement,
  AgencyResponse,
  PlacementStats,
  Shift,
  ShiftTemplate,
  ShiftOffer,
  ShiftApproval,
  Timesheet,
  Payroll,
  Payout,
  Invoice,
  InvoiceLineItem,
  Payment,
  Subscription,
  RateCard,
  PlacementTracking,
  ShiftTracking,

  // Request interfaces
  CreatePlacementRequest,
  SubmitAgencyResponseRequest,
  CreateShiftRequest,
  ClockInOutRequest,
  SubmitTimesheetRequest,
  UserStatusUpdate,
  UsersQueryParams,

  // API responses and errors
  ApiResponse,
  ApiErrorDetails,
  ValidationApiError,
  BusinessApiError,
  RateLimitApiError,
  RequestOptions,

  // Dashboard stats
  AgencyDashboardStats,
  EmployerDashboardStats,
  EmployeeDashboardStats,

  // Other types
  DashboardStats,
  HTTPMethod,
  JsonValue,
  JsonObject,
  JsonArray,
} from './api';

// Export values (non-types) separately
export { isValidationError, isBusinessError, isRateLimitError } from './api';

// Explicitly export User from api with a different name to avoid conflict
export type { User as ApiUser } from './api';

export * from './layout';
export * from './user';
export * from './status';
export * from './table';
export * from './calendar-events';

export type RolePermissions = {
  canViewAgencyDashboard: boolean;
  canViewEmployerDashboard: boolean;
  canViewAdminDashboard: boolean;
  canManagePlacements: boolean;
  canViewPlacements: boolean;
  canManageShifts: boolean;
  canApproveTimesheets: boolean;
};

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export type QueryParams = Record<string, string | number | boolean | undefined>;
