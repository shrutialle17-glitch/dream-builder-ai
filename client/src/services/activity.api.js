import api from '../lib/axios';

export const getActivities = async (params = {}) => {
  const { data } = await api.get('/activities', { params });
  return data; // { success, activities, total, page, limit }
};
