// Types
export type {
  UserRole,
  AuthUser,
  AuthResponse,
  AuthActionResult,
  LoginCredentials,
} from './types';

// Schemas
export { 
  loginSchema,
  loginCredentialsSchema,
  agencyRegistrationSchema,
  employerRegistrationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
  passwordSchema
} from './schemas';

export type {
  LoginFormData,
  AgencyRegistrationData,
  EmployerRegistrationData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  UpdateProfileFormData,
  ChangePasswordFormData,
  RegistrationData
} from './schemas';

// Actions
export {
  loginAction,
  registerAgencyAction,
  registerEmployerAction,
  logoutAction,
} from './actions';

// Providers
export { AuthProvider, useAuth } from './providers';

// Utils
export {
  getUserFromCookie,
  isAuthenticated,
  getUserRole,
  clientHasRole,
} from './utils';

export {
  getRoleBasedRedirect,
  hasRole,
  isAgencyAdmin,
  isEmployerAdmin,
  isSuperAdmin,
  canManageShifts,
  canApproveTimesheets,
} from './utils';
