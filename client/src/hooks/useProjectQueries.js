import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjects, getProject, createProject, updateProject, deleteProject } from '../services/project.api';
import { toast } from 'sonner';

export const projectKeys = {
  all: ['projects'],
  lists: () => [...projectKeys.all, 'list'],
  list: (filters) => [...projectKeys.lists(), { filters }],
  details: () => [...projectKeys.all, 'detail'],
  detail: (id) => [...projectKeys.details(), id],
};

export const useProjects = (filters = {}) => {
  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: () => getProjects(filters),
    keepPreviousData: true,
  });
};

export const useProject = (id) => {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => getProject(id),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      toast.success('Project created successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create project');
    },
  });
};

export const useUpdateProject = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      toast.success('Project updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update project');
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      toast.success('Project deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete project');
    },
  });
};
