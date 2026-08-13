import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getIdeaValidation, generateIdeaValidation, regenerateIdeaValidation, askValidationQuestion } from '../services/project.api';
import { toast } from 'sonner';

export const ideaValidationKeys = {
  all: ['idea-validation'],
  detail: (id) => [...ideaValidationKeys.all, id],
};

export const useIdeaValidation = (projectId) => {
  return useQuery({
    queryKey: ideaValidationKeys.detail(projectId),
    queryFn: () => getIdeaValidation(projectId),
    enabled: !!projectId,
    retry: false, // Don't retry automatically on 404
  });
};

export const useGenerateIdeaValidation = (projectId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => generateIdeaValidation(projectId),
    onSuccess: (data) => {
      queryClient.setQueryData(ideaValidationKeys.detail(projectId), data);
      toast.success('Idea validation completed successfully!');
    },
    onError: (error) => {
      if (error?.response?.data?.code === 'OVERVIEW_REQUIRED') {
        toast.error('You must generate the Startup Overview first.');
      } else if (error?.response?.data?.code === 'AI_GENERATION_FAILED') {
        toast.error('The idea validation could not be generated. You can try again.');
      } else {
        toast.error(error.message || 'Failed to generate idea validation');
      }
    },
  });
};

export const useRegenerateIdeaValidation = (projectId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => regenerateIdeaValidation(projectId),
    onSuccess: (data) => {
      queryClient.setQueryData(ideaValidationKeys.detail(projectId), data);
      toast.success('Idea validation regenerated successfully!');
    },
    onError: (error) => {
      if (error?.response?.data?.code === 'AI_GENERATION_FAILED') {
        toast.error('The idea validation could not be regenerated. You can try again.');
      } else {
        toast.error(error.message || 'Failed to regenerate idea validation');
      }
    },
  });
};

export const useAskValidationQuestion = (projectId) => {
  return useMutation({
    mutationFn: (question) => askValidationQuestion(projectId, question),
    onError: (error) => {
      toast.error(error.message || 'Failed to ask Dream Builder');
    },
  });
};
