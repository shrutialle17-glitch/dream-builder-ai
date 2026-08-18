import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStartupDNA, generateStartupDNA, regenerateStartupDNA, askDNAQuestion } from '../services/project.api';
import { toast } from 'sonner';

export const startupDNAKeys = {
  all: ['startup-dna'],
  detail: (id) => [...startupDNAKeys.all, id],
};

export const useStartupDNA = (projectId) => {
  return useQuery({
    queryKey: startupDNAKeys.detail(projectId),
    queryFn: () => getStartupDNA(projectId),
    enabled: !!projectId,
    retry: 1,
  });
};

export const useGenerateStartupDNA = (projectId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => generateStartupDNA(projectId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: startupDNAKeys.detail(projectId) });
      toast.success('Startup DNA generated successfully');
    },
    onError: (error) => {
      if (error?.response?.data?.code === 'OVERVIEW_REQUIRED') {
        toast.error('You must generate the Startup Overview first.');
      } else {
        toast.error(error?.response?.data?.message || 'Failed to generate Startup DNA');
      }
    },
  });
};

export const useRegenerateStartupDNA = (projectId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => regenerateStartupDNA(projectId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: startupDNAKeys.detail(projectId) });
      toast.success('Startup DNA regenerated successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to regenerate Startup DNA');
    },
  });
};

export const useAskDNAQuestion = (projectId) => {
  return useMutation({
    mutationFn: (question) => askDNAQuestion(projectId, question),
    onError: (error) => {
      toast.error(error.message || 'Failed to ask DNA Analyst');
    },
  });
};
