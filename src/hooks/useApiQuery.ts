// hooks/useApiQuery.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
import { useAuth } from '@/contexts/AuthContext';

interface UseApiQueryOptions<TData, TError = Error>
  extends Omit<UseQueryOptions<TData, TError>, 'queryFn' | 'enabled'> {
  queryKey: string[];
  endpoint: string;
  params?: Record<string, unknown>;
  enabled?: boolean;
}

export function useApiQuery<TData, TError = Error>({
  queryKey,
  endpoint,
  params,
  enabled = true,
  ...options
}: UseApiQueryOptions<TData, TError>) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      const response = await apiClient.get<TData>(endpoint, params);
      return response;
    },
    enabled: enabled && isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: 1000,
    ...options,
  });
}
