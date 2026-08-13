import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as projectApi from '../services/project.api';

export const useBusinessPlan = (projectId) => {
  return useQuery({
    queryKey: ['business-plan', projectId],
    queryFn: () => projectApi.getBusinessPlan(projectId),
    enabled: !!projectId,
    retry: false
  });
};

export const useGenerateBusinessPlan = (projectId) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => projectApi.generateBusinessPlan(projectId),
    onSuccess: (data) => {
      queryClient.setQueryData(['business-plan', projectId], data);
    }
  });
};

export const useRegenerateBusinessPlan = (projectId) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => projectApi.regenerateBusinessPlan(projectId),
    onSuccess: (data) => {
      queryClient.setQueryData(['business-plan', projectId], data);
    }
  });
};

export const useAskBusinessPlanQuestion = (projectId) => {
  return useMutation({
    mutationFn: (question) => projectApi.askBusinessPlanQuestion(projectId, question)
  });
};
