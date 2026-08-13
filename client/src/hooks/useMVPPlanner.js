import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as projectApi from '../services/project.api';

export const useMVPPlanner = (projectId) => {
  return useQuery({
    queryKey: ['mvp-plan', projectId],
    queryFn: () => projectApi.getMVPPlan(projectId),
    enabled: !!projectId,
    retry: false
  });
};

export const useGenerateMVPPlan = (projectId) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => projectApi.generateMVPPlan(projectId),
    onSuccess: (data) => {
      queryClient.setQueryData(['mvp-plan', projectId], data);
    }
  });
};

export const useRegenerateMVPPlan = (projectId) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => projectApi.regenerateMVPPlan(projectId),
    onSuccess: (data) => {
      queryClient.setQueryData(['mvp-plan', projectId], data);
    }
  });
};

export const useAskMVPQuestion = (projectId) => {
  return useMutation({
    mutationFn: (question) => projectApi.askMVPQuestion(projectId, question)
  });
};
