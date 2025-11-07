// Re-export everything from auth
export * from '../auth';

// API Client
import { AuthClient } from './authClient';
import { ApiClient } from './apiClient';

const authClient = new AuthClient();
const apiClient = new ApiClient(authClient);

export { apiClient, authClient };

// Types
export type {
  PaginatedResponse,
  PaginationParams,
} from '../../types/pagination';
export type { ApiResponse } from '../../types';

// Utilities
export { ApiError } from './utils/error';
export { logger } from '../utils/logger';
