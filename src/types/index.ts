export type { UserRole, AuthUser } from '../lib/auth';
export type {
  User,
  ApiResponse,
  ApiError,
  QueryParams,
  RequestOptions,
} from './api';
export type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  AuthUserResponse,
  LoginResponse,
} from './auth';
export type { PaginatedResponse, PaginationParams } from './pagination';

export * from './api';

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
