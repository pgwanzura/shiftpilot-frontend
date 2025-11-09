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
// export { AuthProvider, useAuth } from './providers'; // Removed as providers directory was deleted

// Utils
export * from './roles';
export * from './utils/client-auth';
// Export server-side utilities from a specific file if needed elsewhere in server components
// export * from './utils/server'; // Removed to prevent client-side import issues
