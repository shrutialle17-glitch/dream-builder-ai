import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../services/project.api';

export const useDigitalTwin = (projectId) => {
  return useQuery({
    queryKey: ['digitalTwin', projectId],
    queryFn: () => api.getDigitalTwin(projectId),
    enabled: !!projectId
  });
};

export const useSimulateScenario = (projectId) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (customAssumptions) => api.runSimulation(projectId, customAssumptions),
    onSuccess: () => {
      queryClient.invalidateQueries(['digitalTwin', projectId]);
    }
  });
};

export const useGenerateDigitalTwinInsights = (projectId) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (scenarioKey) => api.generateDigitalTwinInsights(projectId, scenarioKey),
    onSuccess: () => {
      queryClient.invalidateQueries(['digitalTwin', projectId]);
    }
  });
};

export const useAskDigitalTwinQuestion = (projectId) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (question) => api.askDigitalTwinQuestion(projectId, question),
    onSuccess: () => {
      queryClient.invalidateQueries(['chat', projectId, 'DIGITAL_TWIN']);
    }
  });
};
