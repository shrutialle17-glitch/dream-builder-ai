import api from '../lib/axios';

export const getProjects = async (filters = {}) => {
  const response = await api.get('/v1/projects', {
    params: filters,
  });

  return response.data.data || response.data;
};

export const getProject = async (id) => {
  const response = await api.get(`/v1/projects/${id}`);

  return response.data.data || response.data;
};

export const createProject = async (projectData) => {
  const response = await api.post('/v1/projects', projectData);

  return response.data.data || response.data;
};

export const updateProject = async (id, projectData) => {
  const response = await api.put(`/v1/projects/${id}`, projectData);

  return response.data.data || response.data;
};

export const deleteProject = async (id) => {
  const response = await api.delete(`/v1/projects/${id}`);

  return response.data.data || response.data;
};