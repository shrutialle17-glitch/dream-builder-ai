import api from '../lib/axios';

export const getProjects = async (params = {}) => {
  const { data } = await api.get('/projects', { params });
  return data; // { success, projects, total, page, limit }
};

export const getProject = async (id) => {
  const { data } = await api.get(`/projects/${id}`);
  return data.project;
};

export const createProject = async (projectData) => {
  const { data } = await api.post('/projects', projectData);
  return data.project;
};

export const updateProject = async (id, projectData) => {
  const { data } = await api.put(`/projects/${id}`, projectData);
  return data.project;
};

export const deleteProject = async (id) => {
  const { data } = await api.delete(`/projects/${id}`);
  return data;
};
