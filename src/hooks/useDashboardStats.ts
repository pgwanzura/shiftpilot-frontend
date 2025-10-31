import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api/apiClient';

export function useDashboardStats(role: string, authToken: string | null) {
  const apiClient = new ApiClient(undefined, authToken);
  return useQuery({
    queryKey: ['dashboard-stats', role],
    queryFn: async () => {
      try {
        let response;

        switch (role) {
          case 'agency':
            response = await apiClient.getAgencyDashboardStats();
            console.log(response);
            break;
          case 'employer':
            response = await apiClient.getEmployerDashboardStats();
            break;
          case 'employee':
            response = await apiClient.getEmployeeDashboardStats();
            break;
          default:
            throw new Error(`Invalid role: ${role}`);
        }

        return response.data;
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}
