// hooks/useApiMutation.ts
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
import { JsonObject } from '@/types';

interface UseApiMutationOptions<TData, TVariables, TError = Error>
  extends Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> {
  endpoint: string;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

export function useApiMutation<TData, TVariables = void, TError = Error>({
  endpoint,
  method = 'POST',
  ...options
}: UseApiMutationOptions<TData, TVariables, TError>) {
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const requestData = variables as JsonObject;

      switch (method) {
        case 'POST':
          return apiClient.post<TData>(endpoint, requestData);
        case 'PUT':
          return apiClient.put<TData>(endpoint, requestData);
        case 'PATCH':
          return apiClient.patch<TData>(endpoint, requestData);
        case 'DELETE':
          return apiClient.delete<TData>(endpoint);
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    },
    ...options,
  });
}
