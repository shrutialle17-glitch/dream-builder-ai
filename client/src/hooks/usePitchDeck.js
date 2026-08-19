import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../services/project.api';

export const usePitchDeck = (projectId) => {
  return useQuery({
    queryKey: ['pitch-deck', projectId],
    queryFn: () => api.getPitchDeck(projectId),
    enabled: !!projectId,
  });
};

export const useGeneratePitchDeck = (projectId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.generatePitchDeck(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pitch-deck', projectId] });
    },
  });
};

export const useRegeneratePitchDeck = (projectId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.regeneratePitchDeck(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pitch-deck', projectId] });
    },
  });
};

export const useDeletePitchDeck = (projectId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.deletePitchDeck(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pitch-deck', projectId] });
    },
  });
};

export const useAskPitchDeckQuestion = (projectId) => {
  return useMutation({
    mutationFn: (question) => api.askPitchDeckQuestion(projectId, question),
  });
};
