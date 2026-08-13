import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../services/project.api';

export const useBranding = (projectId) => {
  return useQuery({
    queryKey: ['branding', projectId],
    queryFn: () => api.getBranding(projectId),
    enabled: !!projectId,
  });
};

export const useGenerateBranding = (projectId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.generateBranding(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branding', projectId] });
      queryClient.invalidateQueries({ queryKey: ['pitch-deck', projectId] }); // Update pitch deck as it depends on branding
    },
  });
};

export const useRegenerateBranding = (projectId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.regenerateBranding(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branding', projectId] });
    },
  });
};

export const useDeleteBranding = (projectId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.deleteBranding(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branding', projectId] });
    },
  });
};

export const useAskBrandingQuestion = (projectId) => {
  return useMutation({
    mutationFn: (question) => api.askBrandingQuestion(projectId, question),
  });
};
