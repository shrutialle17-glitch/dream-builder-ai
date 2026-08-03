import { useQuery } from '@tanstack/react-query';
import { getActivities } from '../services/activity.api';

export const activityKeys = {
  all: ['activities'],
  lists: () => [...activityKeys.all, 'list'],
  list: (filters) => [...activityKeys.lists(), { filters }],
};

export const useActivities = (filters = {}) => {
  return useQuery({
    queryKey: activityKeys.list(filters),
    queryFn: () => getActivities(filters),
    keepPreviousData: true,
  });
};
