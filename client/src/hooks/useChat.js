import { useQuery } from '@tanstack/react-query';
import { getChatHistory } from '../services/project.api';

export const chatKeys = {
  all: ['chat'],
  list: (projectId, moduleType) => [...chatKeys.all, projectId, moduleType],
};

export const useChatHistory = (projectId, moduleType) => {
  return useQuery({
    queryKey: chatKeys.list(projectId, moduleType),
    queryFn: () => getChatHistory(projectId, moduleType),
    enabled: !!projectId && !!moduleType,
  });
};
