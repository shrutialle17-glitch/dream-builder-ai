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

export const updateProfile = async (userData) => {
  const { data } = await api.patch('/auth/me', userData);
  return data.user;
};

export const updatePassword = async (passwords) => {
  const { data } = await api.patch('/auth/me/password', passwords);
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

export const resetPassword = async ({ token, password }) => {
  const { data } = await api.post('/auth/reset-password', { token, password });
  return data;
};
