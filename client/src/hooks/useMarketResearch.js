import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMarketResearch, generateMarketResearch, regenerateMarketResearch } from '../services/project.api';
import { getChatHistory } from '../services/project.api'; // reused
import api from '../lib/axios';

export const useMarketResearch = (projectId) => {
  return useQuery({
    queryKey: ['marketResearch', projectId],
    queryFn: () => getMarketResearch(projectId),
    enabled: !!projectId,
  });
};

export const useGenerateMarketResearch = (projectId) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => generateMarketResearch(projectId),
    onSuccess: (data) => {
      queryClient.setQueryData(['marketResearch', projectId], data);
    },
  });
};

export const useRegenerateMarketResearch = (projectId) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => regenerateMarketResearch(projectId),
    onSuccess: (data) => {
      queryClient.setQueryData(['marketResearch', projectId], data);
    },
  });
};

// We will map the chat for Market Research to a new ModuleType MARKET_RESEARCH
export const useAskMarketAnalyst = (projectId) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (question) => {
      const { data } = await api.post(`/projects/${projectId}/market-research/ask`, { question });
      return data.data.answer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['chat', projectId, 'MARKET_RESEARCH']);
    },
  });
};
