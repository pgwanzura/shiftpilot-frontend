export {
  type AuthErrorResponse,
  type AuthResponse,
  type AuthUser,
  type ForgotPasswordData,
  type ForgotPasswordRequest,
  type LoginCredentials,
  type RefreshTokenResponse,
  type RegisterCredentials,
  type RegisterData,
  type ResetPasswordData,
  type ResetPasswordRequest,
  type Session,
  type User,
} from './auth';

export { type PaginatedResponse, type PaginationParams } from './pagination';
export interface ApiResponse<T> {
  data: T;
  message?: string;
}
