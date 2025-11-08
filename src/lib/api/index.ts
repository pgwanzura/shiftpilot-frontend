
export * from '../auth';

import { AuthClient } from './authClient';
import { ApiClient } from './apiClient';

const authClient = new AuthClient();
const apiClient = new ApiClient(authClient);

export { apiClient, authClient };

export type {
  PaginatedResponse,
  PaginationParams,
} from '../../types/pagination';
export type { ApiResponse } from '../../types';

export * from './utils/error';
export { logger } from '../utils/logger';
