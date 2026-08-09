import api from '../lib/axios';

export const login = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data.user;
};

export const register = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data.user;
};

export const logout = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  return data.user;
};
