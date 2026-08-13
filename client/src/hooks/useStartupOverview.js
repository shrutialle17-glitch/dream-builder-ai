import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjectOverview, generateProjectOverview } from '../services/project.api';
import { toast } from 'sonner';

export const startupOverviewKeys = {
  all: ['startup-overview'],
  detail: (id) => [...startupOverviewKeys.all, id],
};

export const useStartupOverview = (projectId) => {
  return useQuery({
    queryKey: startupOverviewKeys.detail(projectId),
    queryFn: () => getProjectOverview(projectId),
    enabled: !!projectId,
    retry: false, // Don't retry automatically on 404
  });
};

export const useGenerateStartupOverview = (projectId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => generateProjectOverview(projectId),
    onSuccess: (data) => {
      queryClient.setQueryData(startupOverviewKeys.detail(projectId), data);
      toast.success('Startup profile built successfully!');
    },
    onError: (error) => {
      if (error?.response?.data?.code === 'AI_GENERATION_FAILED') {
        toast.error('The startup overview could not be generated. You can try again.');
      } else {
        toast.error(error.message || 'Failed to generate startup overview');
      }
    },
  });
};
