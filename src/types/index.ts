export type { UserRole, AuthUser } from '../lib/auth';

export type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  AuthUserResponse,
  LoginResponse,
  AuthSession,
  AuthContextType,
  ApiErrorResponse,
  AuthActionResult,
  AgencyRegistrationData,
  BaseRegistrationData,
  PasswordResetData,
  TwoFactorAuthData,
  SessionData,
  AuthState,
  Permission,
  RoleWithPermissions,
} from './auth';

export type { PaginatedResponse, PaginationParams } from './pagination';

export type {
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
  PlacementFilters,
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
  CreatePlacementRequest,
  SubmitAgencyResponseRequest,
  CreateShiftRequest,
  ClockInOutRequest,
  SubmitTimesheetRequest,
  UserStatusUpdate,
  UsersQueryParams,
  ApiResponse,
  ApiErrorDetails,
  ValidationApiError,
  BusinessApiError,
  RateLimitApiError,
  RequestOptions,
  AgencyDashboardStats,
  EmployerDashboardStats,
  EmployeeDashboardStats,
  DashboardStats,
  HTTPMethod,
  JsonValue,
  JsonObject,
  JsonArray,
  User,
} from './api';

export { isValidationError, isBusinessError, isRateLimitError } from './api';

export * from './layout';
export * from './roles';
export * from './user';
export * from './status';
export * from './table';
export * from './calendar-events';
export * from './assingments';

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
